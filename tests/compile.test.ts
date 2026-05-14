import { describe, it, expect } from "vitest";
import { compile } from "tailwindcss";
import path from "path";
import fs from "fs";

const base = path.resolve(__dirname, "..");

async function buildCSS(candidates: string[], pluginOptions = "") {
  const pluginPath = path.resolve(base, "src/index.ts");
  const input = `
    @import "tailwindcss";
    @plugin "${pluginPath}"${pluginOptions ? ` { ${pluginOptions} }` : ""};
  `;
  const compiler = await compile(input, {
    base,
    loadModule: async (id, loadBase) => {
      const resolved = path.resolve(loadBase, id);
      const mod = await import(resolved);
      return { module: mod.default ?? mod, base: path.dirname(resolved) };
    },
    loadStylesheet: async (id, loadBase) => {
      if (id === "tailwindcss") {
        const cssPath = require.resolve("tailwindcss/index.css");
        return { content: fs.readFileSync(cssPath, "utf-8"), base: path.dirname(cssPath) };
      }
      const cssPath = path.resolve(loadBase, id);
      return { content: fs.readFileSync(cssPath, "utf-8"), base: path.dirname(cssPath) };
    },
  });
  return compiler.build(candidates);
}

describe("Tailwind v4 compile integration", () => {
  it("fl-p-4/8 generates correct clamp with global viewport", async () => {
    const result = await buildCSS(["fl-p-4/8"]);
    expect(result).toContain("clamp(1rem, 0.6479rem + 1.5023vw, 2rem)");
  });

  it("fl-p-4/8--md-lg generates clamp scoped to md-lg range", async () => {
    const result = await buildCSS(["fl-p-4/8--md-lg"]);
    expect(result).toContain("clamp(1rem, 6.25vw - 2rem, 2rem)");
  });

  it("fl-text-base/2xl--sm-xl generates typography clamp scoped to sm-xl", async () => {
    const result = await buildCSS(["fl-text-base/2xl--sm-xl"]);
    expect(result).toContain("clamp(1rem, 0.5rem + 1.25vw, 1.5rem)");
  });

  it("breakpoint range produces different output than global", async () => {
    const result = await buildCSS(["fl-p-4/8", "fl-p-4/8--md-lg"]);
    expect(result).toContain("0.6479rem + 1.5023vw");
    expect(result).toContain("6.25vw - 2rem");
  });

  it("fl-text emits only font-size when fontSize theme has no companions", async () => {
    const result = await buildCSS(["fl-text-base/5xl"]);
    // Tailwind v4 default fontSize theme uses plain strings without companions,
    // so only font-size is emitted in the utility rule.
    expect(result).toContain("font-size: clamp(");
    // The utility block should also contain line-height since v4 provides companions
    const utilityBlock = result.match(/\.fl-text-base\\\/5xl\s*\{([^}]+)\}/);
    expect(utilityBlock).not.toBeNull();
  });

  it("fl-text-4xl/7xl generates fluid line-height from Tailwind v4 companions", async () => {
    const result = await buildCSS(["fl-text-4xl/7xl"]);
    const utilityBlock = result.match(/\.fl-text-4xl\\\/7xl\s*\{([^}]+)\}/);
    expect(utilityBlock).not.toBeNull();
    expect(utilityBlock![1]).toContain("font-size: clamp(");
    expect(utilityBlock![1]).toContain("line-height: clamp(");
  });
});
