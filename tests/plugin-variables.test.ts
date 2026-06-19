import { describe, it, expect, vi } from "vitest";
import fluidPlugin from "../src/index";
import type { PluginAPI } from "../src/types";

function createStub(addBase: PluginAPI["addBase"] = vi.fn()) {
  return {
    matchUtilities: vi.fn(),
    theme: vi.fn(() => ({
      /* empty screens */
    })),
    config: vi.fn(() => ({})),
    addBase,
  } as unknown as PluginAPI;
}

describe("plugin variable handling", () => {
  it("calls addBase with :root fluid variables when provided", () => {
    const addBase = vi.fn();
    const { handler } = fluidPlugin({ variables: { "text-h1": "36px/60px" } });
    handler(createStub(addBase));

    expect(addBase).toHaveBeenCalledTimes(1);
    const base = addBase.mock.calls[0][0];
    expect(base).toHaveProperty(":root");
    expect(base[":root"]["--fluid-text-h1"]).toContain("clamp(");
  });

  it("does not crash when addBase is missing", () => {
    const { handler } = fluidPlugin({ variables: { "text-h1": "36px/60px" } });
    expect(() =>
      handler({
        matchUtilities: vi.fn(),
        theme: vi.fn(),
        config: vi.fn(),
      } as unknown as PluginAPI),
    ).not.toThrow();
  });

  it("warns in debug mode when addBase is missing", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { handler } = fluidPlugin({
      variables: { "text-h1": "36px/60px" },
      debug: true,
    });

    handler({
      matchUtilities: vi.fn(),
      theme: vi.fn(),
      config: vi.fn(),
    } as unknown as PluginAPI);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("addBase is not available"),
    );
    warnSpy.mockRestore();
  });

  it("sweeps @plugin-form --* declarations into variables", () => {
    const addBase = vi.fn();
    const { handler } = fluidPlugin({
      "--text-h1": "36px/60px",
    } as unknown as Record<string, string>);

    handler(createStub(addBase));

    expect(addBase).toHaveBeenCalledTimes(1);
    const base = addBase.mock.calls[0][0];
    expect(base[":root"]["--fluid-text-h1"]).toContain("clamp(");
  });

  it("merges JS variables and wins on conflict", () => {
    const addBase = vi.fn();
    const { handler } = fluidPlugin({
      "--text-h1": "36px/60px",
      variables: { "text-h1": "16px/32px" },
    });
    handler(createStub(addBase));

    const base = addBase.mock.calls[0][0];
    const clamp = base[":root"]["--fluid-text-h1"];
    expect(clamp).toContain("clamp(");
    // JS value (16px/32px) should win, so clamp uses 1rem/2rem, not 2.25rem/3.75rem
    expect(clamp).toContain("1rem");
    expect(clamp).toContain("2rem");
    expect(clamp).not.toContain("2.25rem");
    expect(clamp).not.toContain("3.75rem");
  });

  it("does not call addBase when variables is empty", () => {
    const addBase = vi.fn();
    const { handler } = fluidPlugin({});
    handler(createStub(addBase));

    expect(addBase).not.toHaveBeenCalled();
  });
});
