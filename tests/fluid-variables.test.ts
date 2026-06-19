import { describe, it, expect, vi } from "vitest";
import type { ResolvedFluidOptions } from "../src/types";
import { calculateClampAdvanced } from "../src/clamp";
import {
  matchVariablePrefix,
  internalClampVar,
  resolveFluidVariable,
  generateFluidVariables,
  fluidVariableThemeExtensions,
} from "../src/variables";

const baseOptions: ResolvedFluidOptions = {
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
  variables: {},
};

const screens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

describe("fluid variable helpers", () => {
  describe("matchVariablePrefix", () => {
    it("matches recognized prefixes", () => {
      expect(matchVariablePrefix("text-h1")).toEqual({
        prefix: "text",
        themeKey: "fontSize",
      });
      expect(matchVariablePrefix("spacing-section")).toEqual({
        prefix: "spacing",
        themeKey: "spacing",
      });
      expect(matchVariablePrefix("leading-tight")).toEqual({
        prefix: "leading",
        themeKey: "lineHeight",
      });
      expect(matchVariablePrefix("tracking-wide")).toEqual({
        prefix: "tracking",
        themeKey: "letterSpacing",
      });
      expect(matchVariablePrefix("radius-card")).toEqual({
        prefix: "radius",
        themeKey: "borderRadius",
      });
    });

    it("returns undefined for non-matching names", () => {
      expect(matchVariablePrefix("brand-gutter")).toBeUndefined();
      expect(matchVariablePrefix("foo-bar")).toBeUndefined();
    });
  });

  describe("internalClampVar", () => {
    it("prefixes the name with --fluid-", () => {
      expect(internalClampVar("text-h1")).toBe("--fluid-text-h1");
      expect(internalClampVar("brand-gutter")).toBe("--fluid-brand-gutter");
    });
  });
});

describe("generateFluidVariables", () => {
  it("emits arbitrary px values as clamp", () => {
    const result = generateFluidVariables(
      { "--text-h1": "36px/60px" },
      baseOptions,
      screens,
    );

    expect(result).toHaveProperty(":root");
    const { result: expected } = calculateClampAdvanced(
      "36px",
      "60px",
      baseOptions,
      { useContainerQuery: false },
    );
    expect(result[":root"]["--fluid-text-h1"]).toBe(expected);
  });

  it("emits bare number spacing clamps", () => {
    const result = generateFluidVariables(
      { "--spacing-section": "4/8" },
      baseOptions,
      screens,
    );

    const { result: expected } = calculateClampAdvanced(
      "1rem",
      "2rem",
      baseOptions,
      { useContainerQuery: false },
    );
    expect(result[":root"]["--fluid-spacing-section"]).toBe(expected);
  });

  it("handles --md-lg breakpoint range", () => {
    const result = generateFluidVariables(
      { "--text-h1": "36px/60px--md-lg" },
      baseOptions,
      screens,
    );

    const { result: expected } = calculateClampAdvanced(
      "36px",
      "60px",
      baseOptions,
      { minViewport: 768, maxViewport: 1024 },
    );
    expect(result[":root"]["--fluid-text-h1"]).toBe(expected);
  });

  it("handles @md-lg legacy breakpoint range", () => {
    const result = generateFluidVariables(
      { "--text-h1": "36px/60px@md-lg" },
      baseOptions,
      screens,
    );

    const { result: expected } = calculateClampAdvanced(
      "36px",
      "60px",
      baseOptions,
      { minViewport: 768, maxViewport: 1024 },
    );
    expect(result[":root"]["--fluid-text-h1"]).toBe(expected);
  });

  it("handles --[768px-1024px] arbitrary breakpoint range", () => {
    const result = generateFluidVariables(
      { "--text-h1": "36px/60px--[768px-1024px]" },
      baseOptions,
      screens,
    );

    const { result: expected } = calculateClampAdvanced(
      "36px",
      "60px",
      baseOptions,
      { minViewport: 768, maxViewport: 1024 },
    );
    expect(result[":root"]["--fluid-text-h1"]).toBe(expected);
  });

  it("normalizes whitespace in specs", () => {
    const withSpace = generateFluidVariables(
      { "--text-h1": "36px / 60px" },
      baseOptions,
      screens,
    );
    const withoutSpace = generateFluidVariables(
      { "--text-h1": "36px/60px" },
      baseOptions,
      screens,
    );

    expect(withSpace).toEqual(withoutSpace);
  });

  it("returns empty object for invalid specs", () => {
    expect(
      generateFluidVariables({ "--text-h1": "36px" }, baseOptions, screens),
    ).toEqual({});
    expect(
      generateFluidVariables(
        { "--text-h1": "base/2xl" },
        baseOptions,
        screens,
      ),
    ).toEqual({});
  });

  it("warns in debug mode for skipped variables", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    generateFluidVariables(
      { "--text-h1": "36px" },
      { ...baseOptions, debug: true },
      screens,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Variable "text-h1" skipped'),
    );

    warnSpy.mockRestore();
  });

  it("honors useContainerQuery", () => {
    const result = generateFluidVariables(
      { "--text-h1": "36px/60px" },
      { ...baseOptions, useContainerQuery: true },
      screens,
    );

    expect(result[":root"]["--fluid-text-h1"]).toContain("cqw");
  });

  it("honors useRem:false", () => {
    const result = generateFluidVariables(
      { "--text-h1": "36px/60px" },
      { ...baseOptions, useRem: false },
      screens,
    );

    expect(result[":root"]["--fluid-text-h1"]).toContain("px");
    expect(result[":root"]["--fluid-text-h1"]).not.toContain("rem");
  });

  it("returns empty object when variables is empty", () => {
    expect(generateFluidVariables({}, baseOptions, screens)).toEqual({});
  });

  it("emits non-matching prefix variables", () => {
    const result = generateFluidVariables(
      { "--brand-gutter": "16px/32px" },
      baseOptions,
      screens,
    );

    expect(result[":root"]["--fluid-brand-gutter"]).toContain("clamp(");
  });

  it("normalizes variable names with or without leading --", () => {
    const withDashes = generateFluidVariables(
      { "--text-h1": "36px/60px" },
      baseOptions,
      screens,
    );
    const withoutDashes = generateFluidVariables(
      { "text-h1": "36px/60px" },
      baseOptions,
      screens,
    );

    expect(withDashes).toEqual(withoutDashes);
  });

  it("preserves unit for tracking variables", () => {
    const result = generateFluidVariables(
      { "--tracking-wide": "0.025em/0.05em" },
      baseOptions,
      screens,
    );

    const { result: expected } = calculateClampAdvanced(
      "0.025em",
      "0.05em",
      baseOptions,
      { preserveUnit: true },
    );
    expect(result[":root"]["--fluid-tracking-wide"]).toBe(expected);
  });
});

describe("fluidVariableThemeExtensions", () => {
  it("builds theme extensions for recognized prefixes", () => {
    const result = fluidVariableThemeExtensions({
      "text-h1": "36px/60px",
      "spacing-section": "4/8",
      "leading-tight": "1.25rem/1.5rem",
      "tracking-wide": "0.025em/0.05em",
      "radius-card": "4px/8px",
      "brand-gutter": "16px/32px",
    });

    expect(result).toEqual({
      theme: {
        extend: {
          fontSize: { h1: "var(--fluid-text-h1)" },
          spacing: { section: "var(--fluid-spacing-section)" },
          lineHeight: { tight: "var(--fluid-leading-tight)" },
          letterSpacing: { wide: "var(--fluid-tracking-wide)" },
          borderRadius: { card: "var(--fluid-radius-card)" },
        },
      },
    });
  });

  it("treats name equal to prefix as DEFAULT theme key", () => {
    const result = fluidVariableThemeExtensions({ text: "36px/60px" });

    expect(result.theme.extend.fontSize?.DEFAULT).toBe("var(--fluid-text)");
  });

  it("normalizes keys with leading --", () => {
    const result = fluidVariableThemeExtensions({ "--text-h1": "36px/60px" });

    expect(result.theme.extend.fontSize?.h1).toBe("var(--fluid-text-h1)");
  });

  it("omits empty theme keys", () => {
    const result = fluidVariableThemeExtensions({
      "brand-gutter": "16px/32px",
    });

    expect(result).toEqual({ theme: { extend: {} } });
  });
});

describe("resolveFluidVariable", () => {
  it("returns empty clamp for unresolvable named theme keys", () => {
    const entry = resolveFluidVariable(
      "text-h1",
      "base/2xl",
      baseOptions,
      screens,
    );

    expect(entry.clamp).toBe("");
    expect(entry.clampVar).toBe("--fluid-text-h1");
  });

  it("preserves prefix mapping on failure", () => {
    const entry = resolveFluidVariable(
      "text-h1",
      "base/2xl",
      baseOptions,
      screens,
    );

    expect(entry.prefix).toBe("text");
  });
});
