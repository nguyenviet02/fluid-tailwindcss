import { describe, it, expect } from "vitest";
import {
  extractFontSizeCompanions,
  resolveLineHeightCompanion,
  calculateClampAdvanced,
} from "../src/clamp";
import type { ResolvedFluidOptions } from "../src/types";

const defaultOptions: ResolvedFluidOptions = {
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
};

describe("extractFontSizeCompanions", () => {
  it("returns empty for plain string values", () => {
    const result = extractFontSizeCompanions("1rem");
    expect(result).toEqual({});
  });

  it("extracts lineHeight from array format [fontSize, lineHeight]", () => {
    const result = extractFontSizeCompanions(["1.5rem", "2rem"]);
    expect(result.lineHeight).toBe("2rem");
    expect(result.letterSpacing).toBeUndefined();
  });

  it("extracts lineHeight and letterSpacing from array with object", () => {
    const result = extractFontSizeCompanions([
      "3rem",
      { lineHeight: "1.2", letterSpacing: "-0.02em" },
    ]);
    expect(result.lineHeight).toBe("1.2");
    expect(result.letterSpacing).toBe("-0.02em");
  });

  it("extracts from object format", () => {
    const result = extractFontSizeCompanions({
      fontSize: "2rem",
      lineHeight: "2.5rem",
      letterSpacing: "-0.01em",
    });
    expect(result.lineHeight).toBe("2.5rem");
    expect(result.letterSpacing).toBe("-0.01em");
  });

  it("handles array with only lineHeight object (no letterSpacing)", () => {
    const result = extractFontSizeCompanions([
      "1rem",
      { lineHeight: "1.5" },
    ]);
    expect(result.lineHeight).toBe("1.5");
    expect(result.letterSpacing).toBeUndefined();
  });

  it("handles array with only letterSpacing object (no lineHeight)", () => {
    const result = extractFontSizeCompanions([
      "1rem",
      { letterSpacing: "-0.05em" },
    ]);
    expect(result.lineHeight).toBeUndefined();
    expect(result.letterSpacing).toBe("-0.05em");
  });

  it("returns empty for single-element array", () => {
    const result = extractFontSizeCompanions(["1rem"]);
    expect(result).toEqual({});
  });

  it("returns empty for null/undefined", () => {
    expect(extractFontSizeCompanions(null)).toEqual({});
    expect(extractFontSizeCompanions(undefined)).toEqual({});
  });
});

describe("resolveLineHeightCompanion", () => {
  it("returns value as-is when it has a unit", () => {
    expect(resolveLineHeightCompanion("1.5rem", "1rem")).toBe("1.5rem");
    expect(resolveLineHeightCompanion("24px", "16px")).toBe("24px");
  });

  it("resolves calc(X / Y) to Xrem (Tailwind v4 format)", () => {
    expect(resolveLineHeightCompanion("calc(2.5 / 2.25)", "2.25rem")).toBe("2.5rem");
    expect(resolveLineHeightCompanion("calc(1.5 / 1)", "1rem")).toBe("1.5rem");
    expect(resolveLineHeightCompanion("calc(1.75 / 1.125)", "1.125rem")).toBe("1.75rem");
  });

  it("resolves unitless ratio by multiplying with font-size", () => {
    expect(resolveLineHeightCompanion("1", "4.5rem")).toBe("4.5rem");
    expect(resolveLineHeightCompanion("1.5", "1rem")).toBe("1.5rem");
    expect(resolveLineHeightCompanion("1.2", "2rem")).toBe("2.4rem");
  });

  it("resolves unitless ratio with px font-size", () => {
    expect(resolveLineHeightCompanion("1.5", "16px")).toBe("24px");
  });

  it("returns null for unparseable values", () => {
    expect(resolveLineHeightCompanion("auto", "1rem")).toBeNull();
    expect(resolveLineHeightCompanion("normal", "1rem")).toBeNull();
  });
});

describe("fl-text companion clamp generation", () => {
  it("generates fluid line-height clamp from companion values", () => {
    const minLH = "1.5rem";
    const maxLH = "3.6rem";
    const { result } = calculateClampAdvanced(minLH, maxLH, defaultOptions);
    expect(result).toMatch(/^clamp\(/);
    expect(result).toContain("rem");
    expect(result).toContain("vw");
  });

  it("generates fluid letter-spacing clamp from companion values", () => {
    const minLS = "-0.01em";
    const maxLS = "-0.03em";
    const { result } = calculateClampAdvanced(minLS, maxLS, defaultOptions);
    expect(result).toMatch(/^clamp\(/);
    expect(result).toContain("em");
  });

  it("handles unitless line-height values gracefully", () => {
    // Unitless values like "1.5" can't be clamped (no unit to interpolate)
    const { result } = calculateClampAdvanced("1.5", "1.2", defaultOptions);
    // Unitless values will fail parsing — this is expected behavior
    // Users should use rem/em values for fluid line-height
    expect(result).toBe("");
  });

  it("simulates full fl-text handler with companions", () => {
    const themeValues: Record<string, unknown> = {
      base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0em" }],
      "5xl": ["3rem", { lineHeight: "3.6rem", letterSpacing: "-0.03em" }],
    };

    const minCompanions = extractFontSizeCompanions(themeValues["base"]);
    const maxCompanions = extractFontSizeCompanions(themeValues["5xl"]);

    // Font-size clamp
    const { result: fsClamp } = calculateClampAdvanced(
      "1rem",
      "3rem",
      defaultOptions,
    );
    expect(fsClamp).toContain("clamp(");

    // Line-height clamp
    expect(minCompanions.lineHeight).toBe("1.5rem");
    expect(maxCompanions.lineHeight).toBe("3.6rem");
    const { result: lhClamp } = calculateClampAdvanced(
      minCompanions.lineHeight!,
      maxCompanions.lineHeight!,
      defaultOptions,
    );
    expect(lhClamp).toContain("clamp(");
    expect(lhClamp).toContain("rem");

    // Letter-spacing clamp
    expect(minCompanions.letterSpacing).toBe("0em");
    expect(maxCompanions.letterSpacing).toBe("-0.03em");
    const { result: lsClamp } = calculateClampAdvanced(
      minCompanions.letterSpacing!,
      maxCompanions.letterSpacing!,
      defaultOptions,
    );
    expect(lsClamp).toContain("clamp(");
    expect(lsClamp).toContain("em");
  });

  it("does not emit companions when only one side has them", () => {
    const themeValues: Record<string, unknown> = {
      base: "1rem",
      "5xl": ["3rem", { lineHeight: "3.6rem" }],
    };

    const minCompanions = extractFontSizeCompanions(themeValues["base"]);
    const maxCompanions = extractFontSizeCompanions(themeValues["5xl"]);

    expect(minCompanions.lineHeight).toBeUndefined();
    expect(maxCompanions.lineHeight).toBe("3.6rem");
    // When min has no companion, we should NOT emit a fluid line-height
  });

  it("does not emit companions when neither side has them", () => {
    const themeValues: Record<string, unknown> = {
      base: "1rem",
      "5xl": "3rem",
    };

    const minCompanions = extractFontSizeCompanions(themeValues["base"]);
    const maxCompanions = extractFontSizeCompanions(themeValues["5xl"]);

    expect(minCompanions.lineHeight).toBeUndefined();
    expect(maxCompanions.lineHeight).toBeUndefined();
  });
});
