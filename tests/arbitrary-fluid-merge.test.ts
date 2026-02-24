import { describe, it, expect } from "vitest";
import {
  twMerge,
  isFluidValue,
  isArbitraryFluidValue,
  isAnyFluidValue,
  withFluid,
} from "../src/tailwind-merge";

/**
 * Tests for Issue #11:
 * tailwind-merge cannot recognize two arbitrary fluid classes as conflicting,
 * so it keeps both instead of deduplicating.
 *
 * @see https://github.com/nguyenviet02/fluid-tailwindcss/issues/11
 */

describe("Issue #11: Arbitrary fluid value deduplication", () => {
  // ── Validator function tests ──────────────────────────────────────────

  describe("isFluidValue should NOT match arbitrary bracket values", () => {
    it("should not match [8.75/20]", () => {
      expect(isFluidValue("[8.75/20]")).toBe(false);
    });

    it("should not match [1rem/3rem]", () => {
      expect(isFluidValue("[1rem/3rem]")).toBe(false);
    });

    it("should not match [15/30]", () => {
      expect(isFluidValue("[15/30]")).toBe(false);
    });
  });

  describe("isArbitraryFluidValue should match bracket values", () => {
    it("should match [8.75/20]", () => {
      expect(isArbitraryFluidValue("[8.75/20]")).toBe(true);
    });

    it("should match [1rem/3rem]", () => {
      expect(isArbitraryFluidValue("[1rem/3rem]")).toBe(true);
    });

    it("should match [15/30]", () => {
      expect(isArbitraryFluidValue("[15/30]")).toBe(true);
    });
  });

  describe("isAnyFluidValue should match both standard and bracket values", () => {
    it("should match standard values", () => {
      expect(isAnyFluidValue("4/8")).toBe(true);
      expect(isAnyFluidValue("base/2xl")).toBe(true);
    });

    it("should match arbitrary bracket values", () => {
      expect(isAnyFluidValue("[8.75/20]")).toBe(true);
      expect(isAnyFluidValue("[1rem/3rem]")).toBe(true);
    });
  });

  // ── Core bug: twMerge deduplication with arbitrary values ─────────────

  describe("twMerge should deduplicate arbitrary fluid text classes", () => {
    it("should keep only the last fl-text with arbitrary values", () => {
      // This is the exact reproduction case from the issue
      const result = twMerge("fl-text-[8.75/20] fl-text-[15/25]");
      // ❌ BUG: Currently returns "fl-text-[8.75/20] fl-text-[15/25]"
      // ✅ Expected: "fl-text-[15/25]"
      expect(result).toBe("fl-text-[15/25]");
    });
  });

  describe("twMerge should deduplicate arbitrary fluid padding classes", () => {
    it("should keep only the last fl-p with arbitrary values", () => {
      // Another reproduction case from the issue
      const result = twMerge("fl-p-[1rem/3rem] fl-p-[2rem/4rem]");
      // ❌ BUG: Currently returns "fl-p-[1rem/3rem] fl-p-[2rem/4rem]"
      // ✅ Expected: "fl-p-[2rem/4rem]"
      expect(result).toBe("fl-p-[2rem/4rem]");
    });
  });

  describe("twMerge should deduplicate arbitrary fluid margin classes", () => {
    it("should keep only the last fl-m with arbitrary values", () => {
      const result = twMerge("fl-m-[1rem/2rem] fl-m-[2rem/4rem]");
      expect(result).toBe("fl-m-[2rem/4rem]");
    });
  });

  describe("twMerge should deduplicate arbitrary fluid gap classes", () => {
    it("should keep only the last fl-gap with arbitrary values", () => {
      const result = twMerge("fl-gap-[1rem/2rem] fl-gap-[2rem/3rem]");
      expect(result).toBe("fl-gap-[2rem/3rem]");
    });
  });

  describe("twMerge should deduplicate arbitrary fluid sizing classes", () => {
    it("should keep only the last fl-w with arbitrary values", () => {
      const result = twMerge("fl-w-[100px/200px] fl-w-[150px/300px]");
      expect(result).toBe("fl-w-[150px/300px]");
    });

    it("should keep only the last fl-h with arbitrary values", () => {
      const result = twMerge("fl-h-[50px/100px] fl-h-[75px/150px]");
      expect(result).toBe("fl-h-[75px/150px]");
    });
  });

  // ── Mixed: standard + arbitrary values should still conflict ──────────

  describe("twMerge should resolve conflicts between standard and arbitrary values", () => {
    it("standard value followed by arbitrary value should keep arbitrary", () => {
      const result = twMerge("fl-text-base/2xl fl-text-[15/25]");
      expect(result).toBe("fl-text-[15/25]");
    });

    it("arbitrary value followed by standard value should keep standard", () => {
      const result = twMerge("fl-text-[15/25] fl-text-base/2xl");
      expect(result).toBe("fl-text-base/2xl");
    });

    it("arbitrary padding followed by standard padding should keep standard", () => {
      const result = twMerge("fl-p-[1rem/3rem] fl-p-4/8");
      expect(result).toBe("fl-p-4/8");
    });

    it("standard padding followed by arbitrary padding should keep arbitrary", () => {
      const result = twMerge("fl-p-4/8 fl-p-[1rem/3rem]");
      expect(result).toBe("fl-p-[1rem/3rem]");
    });
  });

  // ── Verify scale-based values still work (not regression) ─────────────

  describe("scale-based fluid values should still deduplicate correctly", () => {
    it("should keep last scale-based fl-text", () => {
      const result = twMerge("fl-text-base/2xl fl-text-sm/lg");
      expect(result).toBe("fl-text-sm/lg");
    });

    it("should keep last scale-based fl-p", () => {
      const result = twMerge("fl-p-4/8 fl-p-6/12");
      expect(result).toBe("fl-p-6/12");
    });
  });

  // ── Root cause: withFluid config uses isFluidValue instead of isAnyFluidValue ─

  describe("withFluid config should use isAnyFluidValue (root cause)", () => {
    it("classGroups validators should accept arbitrary values", () => {
      const classGroups = withFluid.extend.classGroups;

      // Get the validator for fluid-text (first entry in the array, first key's array)
      const fluidTextGroup = classGroups["fluid-text"];
      const fluidTextValidators = Object.values(fluidTextGroup[0]) as Array<
        Array<(v: string) => boolean>
      >;
      const validator = fluidTextValidators[0][0];

      // The validator SHOULD accept arbitrary values
      // ❌ BUG: Currently uses isFluidValue which returns false for bracket syntax
      expect(validator("[15/25]")).toBe(true);
      expect(validator("[1rem/3rem]")).toBe(true);

      // Should still accept standard values
      expect(validator("base/2xl")).toBe(true);
      expect(validator("4/8")).toBe(true);
    });
  });
});
