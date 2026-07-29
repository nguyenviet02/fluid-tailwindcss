import { describe, it, expect, vi } from "vitest";
import { calculateClampAdvanced } from "../src/clamp";
import fluidPlugin from "../src/index";
import type { CssInJs, PluginAPI, ResolvedFluidOptions } from "../src/types";

const proportionalOptions: ResolvedFluidOptions = {
  minViewport: 375,
  maxViewport: 1440,
  useRem: true,
  rootFontSize: 16,
  checkAccessibility: true,
  prefix: "",
  separator: ":",
  useContainerQuery: false,
  debug: false,
  validateUnits: true,
  mode: "proportional",
  variables: {},
};

/**
 * Collects the registered utility handlers so plugin-level output can be
 * asserted the same way Tailwind would invoke them.
 */
function createUtilities(options: Parameters<typeof fluidPlugin>[0] = {}) {
  const utilities: Record<
    string,
    (value: string, extra: { modifier: string | null }) => CssInJs
  > = {};

  fluidPlugin(options).handler({
    matchUtilities(newUtilities: Record<string, unknown>) {
      Object.assign(utilities, newUtilities);
    },
    theme() {
      return undefined;
    },
    config() {
      return undefined;
    },
  } as unknown as PluginAPI);

  return utilities;
}

describe("proportional mode", () => {
  describe("without layout viewports", () => {
    it("expresses the max value as a viewport ratio floored by the min value", () => {
      // fl-p-4/8: 2rem is reached at 1440px → 32px / 1440px = 2.2222vw
      const { result, validation } = calculateClampAdvanced(
        "1rem",
        "2rem",
        proportionalOptions,
      );

      expect(validation.valid).toBe(true);
      expect(result).toBe("max(1rem, 2.2222vw)");
    });

    it("ignores minViewport and minLayoutViewport", () => {
      const { result } = calculateClampAdvanced("1rem", "2rem", {
        ...proportionalOptions,
        minViewport: 320,
        minLayoutViewport: 480,
      });

      expect(result).toBe("max(1rem, 2.2222vw)");
    });

    it("scales the ratio with maxViewport", () => {
      const { result } = calculateClampAdvanced("1rem", "2rem", {
        ...proportionalOptions,
        maxViewport: 1920,
      });

      // 32px / 1920px = 1.6667vw
      expect(result).toBe("max(1rem, 1.6667vw)");
    });

    it("emits a bare ratio when the min value is zero", () => {
      const { result, validation } = calculateClampAdvanced(
        "0",
        "2rem",
        proportionalOptions,
      );

      expect(validation.valid).toBe(true);
      expect(result).toBe("2.2222vw");
    });

    it("returns the bound when the max value is zero", () => {
      const { result } = calculateClampAdvanced(
        "1rem",
        "0",
        proportionalOptions,
      );

      expect(result).toBe("1rem");
    });
  });

  describe("with maxLayoutViewport", () => {
    it("caps the ratio at maxViewport", () => {
      const { result, validation } = calculateClampAdvanced("1rem", "2rem", {
        ...proportionalOptions,
        minViewport: 375,
        maxViewport: 1920,
        minLayoutViewport: 480,
        maxLayoutViewport: 1440,
      });

      expect(validation.valid).toBe(true);
      // 2.2222vw resolves to 2.67rem at 1920px
      expect(result).toBe("clamp(1rem, 2.2222vw, 2.67rem)");
    });

    it("does not cap when maxLayoutViewport equals maxViewport", () => {
      const { result } = calculateClampAdvanced("1rem", "2rem", {
        ...proportionalOptions,
        maxViewport: 1440,
        maxLayoutViewport: 1440,
      });

      expect(result).toBe("max(1rem, 2.2222vw)");
    });

    it("works in px output mode", () => {
      const { result } = calculateClampAdvanced("16px", "32px", {
        ...proportionalOptions,
        useRem: false,
        maxViewport: 1920,
        maxLayoutViewport: 1440,
      });

      expect(result).toBe("clamp(16px, 2.2222vw, 42.67px)");
    });
  });

  describe("overrides", () => {
    it("uses a per-class breakpoint range as the design width", () => {
      const { result } = calculateClampAdvanced(
        "1rem",
        "2rem",
        { ...proportionalOptions, maxLayoutViewport: 1024 },
        { minViewport: 768, maxViewport: 1280 },
      );

      // 32px / 1280px = 2.5vw, and the layout viewport is bypassed
      expect(result).toBe("max(1rem, 2.5vw)");
    });

    it("uses container query units when requested", () => {
      const { result } = calculateClampAdvanced(
        "1rem",
        "2rem",
        proportionalOptions,
        { useContainerQuery: true },
      );

      expect(result).toBe("max(1rem, 2.2222cqw)");
    });

    it("inverts the bound for negated values", () => {
      const { result } = calculateClampAdvanced(
        "1rem",
        "2rem",
        proportionalOptions,
        { negate: true },
      );

      expect(result).toBe("min(-1rem, -2.2222vw)");
    });

    it("caps negated values at maxViewport", () => {
      const { result } = calculateClampAdvanced(
        "1rem",
        "2rem",
        {
          ...proportionalOptions,
          maxViewport: 1920,
          maxLayoutViewport: 1440,
        },
        { negate: true },
      );

      expect(result).toBe("clamp(-2.67rem, -2.2222vw, -1rem)");
    });

    it("can be selected per call", () => {
      const { result } = calculateClampAdvanced(
        "1rem",
        "2rem",
        { ...proportionalOptions, mode: "interpolation" },
        { mode: "proportional" },
      );

      expect(result).toBe("max(1rem, 2.2222vw)");
    });

    it("adds a debug comment when debug is enabled", () => {
      const { result } = calculateClampAdvanced("1rem", "2rem", {
        ...proportionalOptions,
        debug: true,
      });

      expect(result).toContain("max(1rem, 2.2222vw)");
      expect(result).toContain("fluid proportional 2rem at 1440px, bound 1rem");
    });
  });

  describe("fallbacks", () => {
    it("keeps interpolating em values that must preserve their unit", () => {
      const { result } = calculateClampAdvanced(
        "-0.02em",
        "0.01em",
        proportionalOptions,
        { preserveUnit: true },
      );

      expect(result).toMatch(/^clamp\(/);
      expect(result).toContain("em");
    });

    it("returns a static value for equal min and max", () => {
      const { result, validation } = calculateClampAdvanced(
        "1rem",
        "1rem",
        proportionalOptions,
      );

      expect(validation.valid).toBe(true);
      expect(result).toBe("1rem");
    });

    it("still rejects mismatched units", () => {
      const { result, validation } = calculateClampAdvanced(
        "1rem",
        "32px",
        proportionalOptions,
      );

      expect(validation.valid).toBe(false);
      expect(validation.error?.code).toBe("mismatched-units");
      expect(result).toBe("");
    });
  });
});

describe("proportional mode option handling", () => {
  it("interpolates by default", () => {
    const utilities = createUtilities();
    const result = utilities["fl-p"]("4", { modifier: "8" });

    expect(result["padding"]).toMatch(/^clamp\(/);
  });

  it("applies the mode to utilities", () => {
    const utilities = createUtilities({ mode: "proportional" });
    const result = utilities["fl-p"]("4", { modifier: "8" });

    expect(result["padding"]).toBe("max(1rem, 2.2222vw)");
  });

  it("applies the mode to negative utilities", () => {
    const utilities = createUtilities({ mode: "proportional" });
    const result = utilities["neg-fl-mt"]("4", { modifier: "8" });

    expect(result["margin-top"]).toBe("min(-1rem, -2.2222vw)");
  });

  it("applies the mode to arbitrary values", () => {
    const utilities = createUtilities({
      mode: "proportional",
      maxViewport: 1920,
      maxLayoutViewport: 1440,
    });
    const result = utilities["fl-gap"]("[16px", { modifier: "32px]" });

    expect(result["gap"]).toBe("clamp(1rem, 2.2222vw, 2.67rem)");
  });

  it("accepts the quoted, upper-cased CSS @plugin form", () => {
    const utilities = createUtilities({
      mode: '"Proportional"',
    } as unknown as { mode: "proportional" });
    const result = utilities["fl-p"]("4", { modifier: "8" });

    expect(result["padding"]).toBe("max(1rem, 2.2222vw)");
  });

  it("warns and interpolates for an unknown mode", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const utilities = createUtilities({
      mode: "proportionl",
    } as unknown as { mode: "proportional" });
    const result = utilities["fl-p"]("4", { modifier: "8" });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unknown mode "proportionl"'),
    );
    expect(result["padding"]).toMatch(/^clamp\(/);
    warnSpy.mockRestore();
  });

  it("applies the mode to fluid CSS variables", () => {
    const addBase = vi.fn();
    const { handler } = fluidPlugin({
      mode: "proportional",
      variables: { "spacing-gutter": "16px/32px" },
    });

    handler({
      matchUtilities: vi.fn(),
      theme: vi.fn(() => ({})),
      config: vi.fn(() => ({})),
      addBase,
    } as unknown as PluginAPI);

    const base = addBase.mock.calls[0][0];
    expect(base[":root"]["--fluid-spacing-gutter"]).toBe(
      "max(1rem, 2.2222vw)",
    );
  });
});
