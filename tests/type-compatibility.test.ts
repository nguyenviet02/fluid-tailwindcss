import { describe, it, expect } from "vitest";
import { extendTailwindMerge } from "tailwind-merge";
import { createCn } from "cn/config";
import {
  twMerge,
  withFluid,
  type FluidClassGroupIds,
  type FluidConfigExtension,
} from "../src/tailwind-merge";

// The extendTailwindMerge/createCn call sites below must stay cast-free:
// they are the compile-time regression guards for issue #25 (type
// compatibility with shadcn's cn package), checked by `pnpm test:types`.
describe("withFluid type compatibility", () => {
  it("extends tailwind-merge without a cast", () => {
    const merge = extendTailwindMerge(withFluid);
    expect(merge("fl-p-4/8", "p-4")).toBe("p-4");
  });

  it("is accepted by shadcn's createCn without a cast", () => {
    const cn = createCn(withFluid);
    expect(cn("fl-p-4/8", "p-4")).toBe("p-4");
  });

  it("is annotated as FluidConfigExtension with populated groups", () => {
    const config: FluidConfigExtension = withFluid;
    const groups = Object.keys(config.extend?.classGroups ?? {});
    expect(groups.length).toBeGreaterThan(0);
    expect(groups).toContain("fluid-p");
  });

  it("exports FluidClassGroupIds as a string union", () => {
    const id: FluidClassGroupIds = "fluid-scroll-pl";
    expect(id).toBe("fluid-scroll-pl");
  });
});

// Locks runtime semantics after fl-*/neg-fl-* pairs were merged into
// single class objects in withFluid.classGroups.
describe("negative fluid utilities merging", () => {
  it("keeps the last positive over negative within a group", () => {
    expect(twMerge("neg-fl-m-2/4", "fl-m-4/8")).toBe("fl-m-4/8");
    expect(twMerge("fl-m-4/8", "neg-fl-m-2/4")).toBe("neg-fl-m-2/4");
  });

  it("keeps the last negative over positive for axis utilities", () => {
    expect(twMerge("fl-mx-4/8", "neg-fl-mx-2/4")).toBe("neg-fl-mx-2/4");
    expect(twMerge("fl-translate-y-2/4", "neg-fl-translate-y-1/2")).toBe(
      "neg-fl-translate-y-1/2",
    );
  });

  it("resolves conflicts between negative fluid and regular utilities", () => {
    expect(twMerge("neg-fl-m-2/4", "m-4")).toBe("m-4");
    expect(twMerge("m-4", "neg-fl-m-2/4")).toBe("neg-fl-m-2/4");
  });

  it("dedupes negative inset utilities and keeps unrelated classes", () => {
    expect(twMerge("neg-fl-inset-1/2", "fl-top-2/4", "top-4")).toBe(
      "neg-fl-inset-1/2 top-4",
    );
  });
});
