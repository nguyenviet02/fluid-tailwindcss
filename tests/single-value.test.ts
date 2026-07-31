import { describe, it, expect, vi } from "vitest";
import fluidPlugin from "../src/index";
import { twMerge } from "../src/tailwind-merge";
import type { CssInJs, FluidOptions, PluginAPI } from "../src/types";

/**
 * Collects the registered utility handlers so single-value classes can be
 * invoked the same way Tailwind would.
 */
function createUtilities(options: FluidOptions = {}) {
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

const single = { modifier: null };

describe("single-value classes in interpolation mode", () => {
  it("resolves fl-p-4 to a static value", () => {
    const utilities = createUtilities();

    expect(utilities["fl-p"]("4", single)["padding"]).toBe("1rem");
  });

  it("resolves theme keys such as fl-text-base", () => {
    const utilities = createUtilities();

    expect(utilities["fl-text"]("base", single)["font-size"]).toBe("1rem");
  });

  it("resolves decimal spacing values", () => {
    const utilities = createUtilities();

    expect(utilities["fl-mt"]("4.5", single)["margin-top"]).toBe("1.125rem");
  });

  it("resolves arbitrary single values", () => {
    const utilities = createUtilities();

    expect(utilities["fl-p"]("[16px]", single)["padding"]).toBe("1rem");
  });

  it("negates single values", () => {
    const utilities = createUtilities();

    expect(utilities["neg-fl-mt"]("4", single)["margin-top"]).toBe("-1rem");
  });

  it("stays static when a breakpoint range is given", () => {
    const utilities = createUtilities();

    expect(utilities["fl-p"]("4--[768px-1024px]", single)["padding"]).toBe(
      "1rem",
    );
  });

  it("is unaffected by layout viewports", () => {
    const utilities = createUtilities({
      maxViewport: 1920,
      minLayoutViewport: 480,
      maxLayoutViewport: 1440,
    });

    expect(utilities["fl-p"]("4", single)["padding"]).toBe("1rem");
  });
});

describe("single-value classes in proportional mode", () => {
  it("scales fl-p-4 from the layout viewport", () => {
    const utilities = createUtilities({
      mode: "proportional",
      maxLayoutViewport: 1440,
    });

    // 16px at 1440px = 1.1111vw, never below 1rem on smaller viewports
    expect(utilities["fl-p"]("4", single)["padding"]).toBe(
      "max(1rem, 1.1111vw)",
    );
  });

  it("scales from maxViewport when no layout viewport is set", () => {
    const utilities = createUtilities({
      mode: "proportional",
      maxViewport: 1440,
    });

    expect(utilities["fl-p"]("4", single)["padding"]).toBe(
      "max(1rem, 1.1111vw)",
    );
  });

  it("stops scaling at maxViewport when a layout viewport is set", () => {
    const utilities = createUtilities({
      mode: "proportional",
      maxViewport: 1920,
      maxLayoutViewport: 1440,
    });

    // 1.1111vw resolves to 1.33rem at 1920px
    expect(utilities["fl-p"]("4", single)["padding"]).toBe(
      "clamp(1rem, 1.1111vw, 1.33rem)",
    );
  });

  it("scales theme keys such as fl-text-base", () => {
    const utilities = createUtilities({
      mode: "proportional",
      maxLayoutViewport: 1440,
    });

    expect(utilities["fl-text"]("base", single)["font-size"]).toBe(
      "max(1rem, 1.1111vw)",
    );
  });

  it("scales arbitrary single values", () => {
    const utilities = createUtilities({
      mode: "proportional",
      maxLayoutViewport: 1440,
    });

    expect(utilities["fl-p"]("[32px]", single)["padding"]).toBe(
      "max(2rem, 2.2222vw)",
    );
  });

  it("inverts the bound for negative single values", () => {
    const utilities = createUtilities({
      mode: "proportional",
      maxLayoutViewport: 1440,
    });

    expect(utilities["neg-fl-mt"]("4", single)["margin-top"]).toBe(
      "min(-1rem, -1.1111vw)",
    );
  });

  it("uses a per-class breakpoint range as the design width", () => {
    const utilities = createUtilities({
      mode: "proportional",
      maxLayoutViewport: 1440,
    });

    // 16px at 1024px = 1.5625vw, and the layout viewport is bypassed
    expect(utilities["fl-p"]("4--[768px-1024px]", single)["padding"]).toBe(
      "max(1rem, 1.5625vw)",
    );
  });

  it("scales space utilities", () => {
    const utilities = createUtilities({
      mode: "proportional",
      maxLayoutViewport: 1440,
    });
    const result = utilities["fl-space-y"]("4", single) as Record<
      string,
      Record<string, string>
    >;

    expect(
      result["& > :not([hidden]) ~ :not([hidden])"]["margin-top"],
    ).toBe("max(1rem, 1.1111vw)");
  });

  it("scales translate utilities", () => {
    const utilities = createUtilities({
      mode: "proportional",
      maxLayoutViewport: 1440,
    });
    const result = utilities["fl-translate-x"]("4", single);

    expect(result["--tw-translate-x"]).toBe("max(1rem, 1.1111vw)");
    expect(result["transform"]).toContain("translate(");
  });

  it("scales single-value fluid CSS variables", () => {
    const addBase = vi.fn();
    const { handler } = fluidPlugin({
      mode: "proportional",
      maxLayoutViewport: 1440,
      variables: { "spacing-gutter": "32px" },
    });

    handler({
      matchUtilities: vi.fn(),
      theme: vi.fn(() => ({})),
      config: vi.fn(() => ({})),
      addBase,
    } as unknown as PluginAPI);

    expect(addBase.mock.calls[0][0][":root"]["--fluid-spacing-gutter"]).toBe(
      "max(2rem, 2.2222vw)",
    );
  });
});

describe("tailwind-merge with single-value classes", () => {
  it("lets a later single-value class win over a pair", () => {
    expect(twMerge("fl-p-4/8", "fl-p-4")).toBe("fl-p-4");
  });

  it("lets a later pair win over a single-value class", () => {
    expect(twMerge("fl-p-4", "fl-p-4/8")).toBe("fl-p-4/8");
  });

  it("resolves conflicts with regular Tailwind classes", () => {
    expect(twMerge("p-4", "fl-p-4")).toBe("fl-p-4");
    expect(twMerge("fl-p-4", "p-8")).toBe("p-8");
  });

  it("keeps unrelated fluid utilities", () => {
    expect(twMerge("fl-p-4", "fl-mt-8")).toBe("fl-p-4 fl-mt-8");
  });

  it("resolves arbitrary single values", () => {
    expect(twMerge("fl-p-4", "fl-p-[24px]")).toBe("fl-p-[24px]");
  });
});
