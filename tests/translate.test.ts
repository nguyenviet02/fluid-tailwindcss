import { describe, it, expect } from "vitest";
import fluidPlugin from "../src/index";
import type { CssInJs, FluidOptions, PluginAPI } from "../src/types";

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

const TRANSLATE = "var(--tw-translate-x, 0) var(--tw-translate-y, 0)";

describe("fluid translate utilities", () => {
  it("applies the value through the translate property", () => {
    const utilities = createUtilities();
    const result = utilities["fl-translate-x"]("4", { modifier: "8" });

    expect(result["--tw-translate-x"]).toMatch(/^clamp\(/);
    expect(result["translate"]).toBe(TRANSLATE);
  });

  it("uses the y axis variable for fl-translate-y", () => {
    const utilities = createUtilities();
    const result = utilities["fl-translate-y"]("4", { modifier: "8" });

    expect(result["--tw-translate-y"]).toMatch(/^clamp\(/);
    expect(result["translate"]).toBe(TRANSLATE);
  });

  it("applies the same value for arbitrary values", () => {
    const utilities = createUtilities();
    const result = utilities["fl-translate-x"]("[16px", { modifier: "32px]" });

    expect(result["--tw-translate-x"]).toMatch(/^clamp\(/);
    expect(result["translate"]).toBe(TRANSLATE);
  });

  it("applies the same value for negative utilities", () => {
    const utilities = createUtilities();
    const result = utilities["neg-fl-translate-x"]("4", { modifier: "8" });

    expect(result["--tw-translate-x"]).toContain("-");
    expect(result["translate"]).toBe(TRANSLATE);
  });

  // Tailwind v4 dropped the composite transform of v3: referencing removed
  // variables such as --tw-rotate made the whole declaration invalid, so the
  // browser discarded it and nothing moved.
  it("does not emit the Tailwind v3 composite transform", () => {
    const utilities = createUtilities();
    const result = utilities["fl-translate-x"]("4", { modifier: "8" });

    expect(result["transform"]).toBeUndefined();
    expect(JSON.stringify(result)).not.toContain("--tw-rotate");
  });
});
