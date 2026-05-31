import { describe, it, expect } from "vitest";
import { calculateClampAdvanced } from "../src/clamp";
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

describe("layout viewport extrapolation", () => {
  describe("basic extrapolation", () => {
    it("should extrapolate min/max values when layout viewports are set", () => {
      const options: ResolvedFluidOptions = {
        ...defaultOptions,
        minViewport: 375,
        maxViewport: 1440,
        minLayoutViewport: 480,
        maxLayoutViewport: 1024,
      };

      // fl-p-4/8 → 1rem at 480px, 2rem at 1024px
      const { result, validation } = calculateClampAdvanced(
        "1rem",
        "2rem",
        options,
      );

      expect(validation.valid).toBe(true);
      expect(result).toMatch(/^clamp\(/);

      // The clamp min should be less than 1rem (extrapolated below 480px)
      const minMatch = result.match(/clamp\(([\d.-]+)rem/);
      expect(minMatch).not.toBeNull();
      const clampMin = parseFloat(minMatch![1]);
      expect(clampMin).toBeLessThan(1);

      // The clamp max should be greater than 2rem (extrapolated above 1024px)
      const maxMatch = result.match(/, ([\d.-]+)rem\)$/);
      expect(maxMatch).not.toBeNull();
      const clampMax = parseFloat(maxMatch![1]);
      expect(clampMax).toBeGreaterThan(2);
    });

    it("should produce correct extrapolated values for known inputs", () => {
      const options: ResolvedFluidOptions = {
        ...defaultOptions,
        minViewport: 375,
        maxViewport: 1440,
        minLayoutViewport: 480,
        maxLayoutViewport: 1024,
      };

      // 1rem at 480px, 2rem at 1024px
      // slope = (2 - 1) / ((1024/16) - (480/16)) = 1 / (64 - 30) = 1/34
      // extrapolatedMin = 1 - (1/34) * (30 - 23.4375) = 1 - 0.193 = ~0.807
      // extrapolatedMax = 2 + (1/34) * (90 - 64) = 2 + 0.765 = ~2.765
      const { result } = calculateClampAdvanced("1rem", "2rem", options);

      const minMatch = result.match(/clamp\(([\d.-]+)rem/);
      const maxMatch = result.match(/, ([\d.-]+)rem\)$/);
      const clampMin = parseFloat(minMatch![1]);
      const clampMax = parseFloat(maxMatch![1]);

      expect(clampMin).toBeCloseTo(0.8069, 2);
      expect(clampMax).toBeCloseTo(2.7647, 2);
    });

    it("should work with px output mode", () => {
      const options: ResolvedFluidOptions = {
        ...defaultOptions,
        useRem: false,
        minViewport: 375,
        maxViewport: 1440,
        minLayoutViewport: 480,
        maxLayoutViewport: 1024,
      };

      const { result, validation } = calculateClampAdvanced(
        "16px",
        "32px",
        options,
      );

      expect(validation.valid).toBe(true);
      expect(result).toMatch(/^clamp\(/);
      expect(result).toContain("px");

      // Clamp min should be less than 16px
      const minMatch = result.match(/clamp\(([\d.-]+)px/);
      expect(minMatch).not.toBeNull();
      expect(parseFloat(minMatch![1])).toBeLessThan(16);

      // Clamp max should be greater than 32px
      const maxMatch = result.match(/, ([\d.-]+)px\)$/);
      expect(maxMatch).not.toBeNull();
      expect(parseFloat(maxMatch![1])).toBeGreaterThan(32);
    });
  });

  describe("no regression without layout viewports", () => {
    it("should produce identical output when layout viewports are not set", () => {
      const withoutLayout = calculateClampAdvanced(
        "1rem",
        "3rem",
        defaultOptions,
      );

      const withUndefinedLayout: ResolvedFluidOptions = {
        ...defaultOptions,
        minLayoutViewport: undefined,
        maxLayoutViewport: undefined,
      };
      const withUndefined = calculateClampAdvanced(
        "1rem",
        "3rem",
        withUndefinedLayout,
      );

      expect(withoutLayout.result).toBe(withUndefined.result);
    });

    it("should produce identical output when layout viewports equal global viewports", () => {
      const withoutLayout = calculateClampAdvanced(
        "1rem",
        "3rem",
        defaultOptions,
      );

      const withSameLayout: ResolvedFluidOptions = {
        ...defaultOptions,
        minLayoutViewport: 375,
        maxLayoutViewport: 1440,
      };
      const withSame = calculateClampAdvanced("1rem", "3rem", withSameLayout);

      expect(withoutLayout.result).toBe(withSame.result);
    });
  });

  describe("per-utility breakpoint override", () => {
    it("should ignore layout viewports when per-utility breakpoints are set", () => {
      const options: ResolvedFluidOptions = {
        ...defaultOptions,
        minLayoutViewport: 480,
        maxLayoutViewport: 1024,
      };

      // With per-utility override, layout viewports should be bypassed
      const withOverride = calculateClampAdvanced("1rem", "2rem", options, {
        minViewport: 768,
        maxViewport: 1280,
      });

      // Same as calling without layout viewports but with the override
      const directOverride = calculateClampAdvanced(
        "1rem",
        "2rem",
        defaultOptions,
        { minViewport: 768, maxViewport: 1280 },
      );

      expect(withOverride.result).toBe(directOverride.result);
    });
  });

  describe("edge cases", () => {
    it("should handle minLayoutViewport equal to minViewport (no min extrapolation)", () => {
      const options: ResolvedFluidOptions = {
        ...defaultOptions,
        minViewport: 375,
        maxViewport: 1440,
        minLayoutViewport: 375,
        maxLayoutViewport: 1024,
      };

      const { result, validation } = calculateClampAdvanced(
        "1rem",
        "2rem",
        options,
      );

      expect(validation.valid).toBe(true);
      // Min should stay at 1rem since minLayoutViewport === minViewport
      const minMatch = result.match(/clamp\(([\d.-]+)rem/);
      expect(parseFloat(minMatch![1])).toBeCloseTo(1, 2);
      // Max should be extrapolated
      const maxMatch = result.match(/, ([\d.-]+)rem\)$/);
      expect(parseFloat(maxMatch![1])).toBeGreaterThan(2);
    });

    it("should handle maxLayoutViewport equal to maxViewport (no max extrapolation)", () => {
      const options: ResolvedFluidOptions = {
        ...defaultOptions,
        minViewport: 375,
        maxViewport: 1440,
        minLayoutViewport: 480,
        maxLayoutViewport: 1440,
      };

      const { result, validation } = calculateClampAdvanced(
        "1rem",
        "2rem",
        options,
      );

      expect(validation.valid).toBe(true);
      // Min should be extrapolated
      const minMatch = result.match(/clamp\(([\d.-]+)rem/);
      expect(parseFloat(minMatch![1])).toBeLessThan(1);
      // Max should stay at 2rem since maxLayoutViewport === maxViewport
      const maxMatch = result.match(/, ([\d.-]+)rem\)$/);
      expect(parseFloat(maxMatch![1])).toBeCloseTo(2, 2);
    });

    it("should work with negated values", () => {
      const options: ResolvedFluidOptions = {
        ...defaultOptions,
        minLayoutViewport: 480,
        maxLayoutViewport: 1024,
      };

      const { result, validation } = calculateClampAdvanced(
        "1rem",
        "2rem",
        options,
        { negate: true },
      );

      expect(validation.valid).toBe(true);
      // Negated: clamp min/max are swapped and negative
      expect(result).toContain("clamp(");
      const minMatch = result.match(/clamp\(([-\d.]+)rem/);
      expect(parseFloat(minMatch![1])).toBeLessThan(0);
    });
  });
});
