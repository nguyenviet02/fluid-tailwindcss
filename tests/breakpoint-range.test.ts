import { describe, it, expect } from "vitest";
import {
  parseBreakpointRange,
  resolveScreens,
  calculateClampAdvanced,
  parseFluidString,
  resolveThemeValue,
} from "../src";
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

const screens: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const themeValues: Record<string, unknown> = {
  "4": "1rem",
  "8": "2rem",
  "12": "3rem",
  "16": "4rem",
  base: "1rem",
  "2xl": "1.5rem",
};

describe("parseBreakpointRange", () => {
  describe("double-dash syntax (primary)", () => {
    it("parses 4/8--md-lg", () => {
      const result = parseBreakpointRange("4/8--md-lg", screens);
      expect(result).toEqual({
        fluidValue: "4/8",
        minViewport: 768,
        maxViewport: 1024,
      });
    });

    it("parses base/2xl--sm-xl", () => {
      const result = parseBreakpointRange("base/2xl--sm-xl", screens);
      expect(result).toEqual({
        fluidValue: "base/2xl",
        minViewport: 640,
        maxViewport: 1280,
      });
    });

    it("parses 4/16--sm-2xl", () => {
      const result = parseBreakpointRange("4/16--sm-2xl", screens);
      expect(result).toEqual({
        fluidValue: "4/16",
        minViewport: 640,
        maxViewport: 1536,
      });
    });

    it("parses arbitrary pixels: 4/8--[768px-1024px]", () => {
      const result = parseBreakpointRange("4/8--[768px-1024px]", screens);
      expect(result).toEqual({
        fluidValue: "4/8",
        minViewport: 768,
        maxViewport: 1024,
      });
    });

    it("parses arbitrary pixels: 4/8--[320px/1920px]", () => {
      const result = parseBreakpointRange("4/8--[320px/1920px]", screens);
      expect(result).toEqual({
        fluidValue: "4/8",
        minViewport: 320,
        maxViewport: 1920,
      });
    });

    it("returns null for unknown breakpoint names", () => {
      expect(parseBreakpointRange("4/8--foo-bar", screens)).toBeNull();
    });

    it("returns null when min >= max breakpoint", () => {
      expect(parseBreakpointRange("4/8--lg-sm", screens)).toBeNull();
      expect(parseBreakpointRange("4/8--md-md", screens)).toBeNull();
    });
  });

  describe("Tailwind v4 real flow (double-dash in modifier)", () => {
    // In Tailwind v4: fl-p-4/8--md-lg
    // → value="4", modifier="8--md-lg"
    // → effectiveValue = "4/8--md-lg"
    it("parses 4/8--md-lg (as reconstructed from Tailwind v4 modifier)", () => {
      const result = parseBreakpointRange("4/8--md-lg", screens);
      expect(result).toEqual({
        fluidValue: "4/8",
        minViewport: 768,
        maxViewport: 1024,
      });
    });

    it("parses 4/8--sm-2xl", () => {
      const result = parseBreakpointRange("4/8--sm-2xl", screens);
      expect(result).toEqual({
        fluidValue: "4/8",
        minViewport: 640,
        maxViewport: 1536,
      });
    });

    it("parses base/2xl--sm-xl", () => {
      const result = parseBreakpointRange("base/2xl--sm-xl", screens);
      expect(result).toEqual({
        fluidValue: "base/2xl",
        minViewport: 640,
        maxViewport: 1280,
      });
    });
  });

  describe("legacy @ syntax (backward compatible)", () => {
    it("parses md-lg range", () => {
      const result = parseBreakpointRange("4/8@md-lg", screens);
      expect(result).toEqual({
        fluidValue: "4/8",
        minViewport: 768,
        maxViewport: 1024,
      });
    });

    it("parses md/lg range (slash separator)", () => {
      const result = parseBreakpointRange("4/8@md/lg", screens);
      expect(result).toEqual({
        fluidValue: "4/8",
        minViewport: 768,
        maxViewport: 1024,
      });
    });

    it("parses arbitrary [768px/1024px]", () => {
      const result = parseBreakpointRange("4/8@[768px/1024px]", screens);
      expect(result).toEqual({
        fluidValue: "4/8",
        minViewport: 768,
        maxViewport: 1024,
      });
    });

    it("parses arbitrary [768px-1024px]", () => {
      const result = parseBreakpointRange("4/8@[768px-1024px]", screens);
      expect(result).toEqual({
        fluidValue: "4/8",
        minViewport: 768,
        maxViewport: 1024,
      });
    });
  });

  describe("no range (backward compatibility)", () => {
    it("returns null when no separator is present", () => {
      expect(parseBreakpointRange("4/8", screens)).toBeNull();
      expect(parseBreakpointRange("base/2xl", screens)).toBeNull();
    });

    it("returns null for empty range part", () => {
      expect(parseBreakpointRange("4/8@", screens)).toBeNull();
      expect(parseBreakpointRange("4/8--", screens)).toBeNull();
    });

    it("returns null for empty fluid part", () => {
      expect(parseBreakpointRange("@md/lg", screens)).toBeNull();
      expect(parseBreakpointRange("--md-lg", screens)).toBeNull();
    });
  });
});

describe("resolveScreens", () => {
  it("resolves string pixel values", () => {
    const theme = (path: string) => {
      if (path === "screens") {
        return { sm: "640px", md: "768px", lg: "1024px" };
      }
      return undefined;
    };
    const result = resolveScreens(theme);
    expect(result).toEqual({ sm: 640, md: 768, lg: 1024 });
  });

  it("resolves numeric values", () => {
    const theme = (path: string) => {
      if (path === "screens") {
        return { sm: 640, md: 768 };
      }
      return undefined;
    };
    const result = resolveScreens(theme);
    expect(result).toEqual({ sm: 640, md: 768 });
  });

  it("resolves object values with min property", () => {
    const theme = (path: string) => {
      if (path === "screens") {
        return { md: { min: "768px" }, lg: { min: "1024px" } };
      }
      return undefined;
    };
    const result = resolveScreens(theme);
    expect(result).toEqual({ md: 768, lg: 1024 });
  });

  it("returns empty object when screens is undefined", () => {
    const theme = () => undefined;
    const result = resolveScreens(theme);
    expect(result).toEqual({});
  });

  it("resolves rem values (Tailwind v4 format)", () => {
    const theme = (path: string) => {
      if (path === "screens") {
        return { sm: "40rem", md: "48rem", lg: "64rem", xl: "80rem", "2xl": "96rem", __CSS_VALUES__: {} };
      }
      return undefined;
    };
    const result = resolveScreens(theme);
    expect(result).toEqual({ sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 });
  });
});

describe("breakpoint range end-to-end CSS output", () => {
  function generateClampWithRange(
    fluidInput: string,
    bpRange: string | null,
    separator: "--" | "@" = "--",
  ): string | null {
    const effectiveValue = bpRange ? `${fluidInput}${separator}${bpRange}` : fluidInput;
    const rangeResult = parseBreakpointRange(effectiveValue, screens);
    const fluidValue = rangeResult ? rangeResult.fluidValue : effectiveValue;
    const overrides = rangeResult
      ? { minViewport: rangeResult.minViewport, maxViewport: rangeResult.maxViewport }
      : {};

    const parsed = parseFluidString(fluidValue);
    if (!parsed) return null;

    const minResolved = resolveThemeValue(parsed.min, themeValues);
    const maxResolved = resolveThemeValue(parsed.max, themeValues);
    if (!minResolved || !maxResolved) return null;

    const { result, validation } = calculateClampAdvanced(
      minResolved,
      maxResolved,
      defaultOptions,
      overrides,
    );
    if (!validation.valid) return null;
    return result;
  }

  it("fl-p-4/8--md-lg produces clamp with md/lg bounds", () => {
    const result = generateClampWithRange("4/8", "md-lg");
    expect(result).toMatch(/^clamp\(/);
    expect(result).toContain("vw");
    expect(result).toBe("clamp(1rem, 6.25vw - 2rem, 2rem)");
  });

  it("fl-p-4/8 (no range) uses global bounds", () => {
    const result = generateClampWithRange("4/8", null);
    expect(result).toMatch(/^clamp\(/);
    expect(result).toBe("clamp(1rem, 0.6479rem + 1.5023vw, 2rem)");
  });

  it("fl-p-4/8--sm-xl produces different output than global", () => {
    const ranged = generateClampWithRange("4/8", "sm-xl");
    const global = generateClampWithRange("4/8", null);
    expect(ranged).not.toBe(global);
    expect(ranged).toMatch(/^clamp\(/);
  });

  it("fl-p-4/8--[768px-1024px] matches named md-lg", () => {
    const named = generateClampWithRange("4/8", "md-lg");
    const arbitrary = generateClampWithRange("4/8", "[768px-1024px]");
    expect(named).toBe(arbitrary);
  });

  it("fl-text-base/2xl--sm-xl produces correct typography clamp", () => {
    const result = generateClampWithRange("base/2xl", "sm-xl");
    expect(result).toMatch(/^clamp\(/);
    expect(result).toContain("rem");
    expect(result).toContain("vw");
  });

  it("legacy @ syntax produces same output as -- syntax", () => {
    const doubleDash = generateClampWithRange("4/8", "md-lg", "--");
    const atSign = generateClampWithRange("4/8", "md-lg", "@");
    expect(doubleDash).toBe(atSign);
  });

  it("negative utility with range works", () => {
    const effectiveValue = "4/8--md-lg";
    const rangeResult = parseBreakpointRange(effectiveValue, screens);
    expect(rangeResult).not.toBeNull();

    const parsed = parseFluidString(rangeResult!.fluidValue);
    const minResolved = resolveThemeValue(parsed!.min, themeValues);
    const maxResolved = resolveThemeValue(parsed!.max, themeValues);

    const { result, validation } = calculateClampAdvanced(
      minResolved!,
      maxResolved!,
      defaultOptions,
      {
        negate: true,
        minViewport: rangeResult!.minViewport,
        maxViewport: rangeResult!.maxViewport,
      },
    );

    expect(validation.valid).toBe(true);
    expect(result).toMatch(/^clamp\(-/);
    expect(result).toContain("-2rem");
    expect(result).toContain("-1rem");
  });
});