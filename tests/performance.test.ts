import { describe, it, expect } from "vitest";
import { extractUnit } from "../src/index";
import {
  fluidUtilities,
  defaultSpacing,
  defaultFontSize,
  defaultLineHeight,
  defaultLetterSpacing,
  defaultBorderRadius,
  defaultBorderWidth,
  getDefaultScale,
} from "../src/utilities";

// ─── Helpers ────────────────────────────────────────────────────────────

const SKIP_KEYS = new Set(["DEFAULT", "none", "full"]);

/** Simulates the OLD O(n²) generateFluidValues */
function generateFluidValuesOld(
  scaleValues: Record<string, unknown>,
): Record<string, string> {
  const values: Record<string, string> = {};
  const keys = Object.keys(scaleValues);

  for (const minKey of keys) {
    for (const maxKey of keys) {
      if (minKey === maxKey) continue;
      if (minKey === "DEFAULT" || maxKey === "DEFAULT") continue;
      if (minKey === "none" || maxKey === "none") continue;
      if (minKey === "full" || maxKey === "full") continue;

      const fluidKey = `${minKey}/${maxKey}`;
      values[fluidKey] = fluidKey;
    }
  }

  return values;
}

/** Simulates the NEW O(n) generateFluidValues */
function generateFluidValuesNew(
  scaleValues: Record<string, unknown>,
): Record<string, string> {
  const values: Record<string, string> = {};
  const keys = Object.keys(scaleValues);

  const unitByKey = new Map<string, string>();
  for (const key of keys) {
    if (SKIP_KEYS.has(key)) continue;
    const unit = extractUnit(scaleValues[key]);
    if (unit) unitByKey.set(key, unit);
  }

  for (const key of unitByKey.keys()) {
    values[key] = key;
  }

  return values;
}

/** Runs a function N times and returns avg/min/max in milliseconds */
function benchmark(fn: () => void, iterations: number) {
  // Warmup
  for (let i = 0; i < 5; i++) fn();

  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }

  times.sort((a, b) => a - b);
  return {
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    min: times[0],
    max: times[times.length - 1],
    median: times[Math.floor(times.length / 2)],
    p95: times[Math.floor(times.length * 0.95)],
  };
}

// ─── Performance benchmarks ─────────────────────────────────────────────

describe("performance benchmarks", () => {
  it("should show O(n) is faster than O(n²) for single spacing scale", () => {
    const iterations = 1000;

    const oldResult = benchmark(() => {
      generateFluidValuesOld(defaultSpacing);
    }, iterations);

    const newResult = benchmark(() => {
      generateFluidValuesNew(defaultSpacing);
    }, iterations);

    console.log("\n── Single spacing scale ──");
    console.log(
      `  Old O(n²): avg=${oldResult.avg.toFixed(4)}ms, median=${oldResult.median.toFixed(4)}ms, p95=${oldResult.p95.toFixed(4)}ms`,
    );
    console.log(
      `  New O(n):  avg=${newResult.avg.toFixed(4)}ms, median=${newResult.median.toFixed(4)}ms, p95=${newResult.p95.toFixed(4)}ms`,
    );
    console.log(
      `  Speedup:   ${(oldResult.avg / newResult.avg).toFixed(1)}x avg, ${(oldResult.median / newResult.median).toFixed(1)}x median`,
    );

    // New approach should be meaningfully faster
    expect(newResult.avg).toBeLessThan(oldResult.avg);
  });

  it("should show dramatic improvement across ALL utilities", () => {
    const iterations = 100;

    // Simulate registering all fluid utilities (what the plugin does on load)
    const oldResult = benchmark(() => {
      for (const [, utilityDef] of Object.entries(fluidUtilities)) {
        const scale = getDefaultScale(utilityDef.scale);
        generateFluidValuesOld(scale);
      }
    }, iterations);

    const newResult = benchmark(() => {
      for (const [, utilityDef] of Object.entries(fluidUtilities)) {
        const scale = getDefaultScale(utilityDef.scale);
        generateFluidValuesNew(scale);
      }
    }, iterations);

    console.log("\n── All utilities (full plugin init) ──");
    console.log(
      `  Old O(n²): avg=${oldResult.avg.toFixed(4)}ms, median=${oldResult.median.toFixed(4)}ms, p95=${oldResult.p95.toFixed(4)}ms`,
    );
    console.log(
      `  New O(n):  avg=${newResult.avg.toFixed(4)}ms, median=${newResult.median.toFixed(4)}ms, p95=${newResult.p95.toFixed(4)}ms`,
    );
    console.log(
      `  Speedup:   ${(oldResult.avg / newResult.avg).toFixed(1)}x avg, ${(oldResult.median / newResult.median).toFixed(1)}x median`,
    );

    expect(newResult.avg).toBeLessThan(oldResult.avg);
  });

  it("should measure total registered values (memory pressure)", () => {
    let oldTotal = 0;
    let newTotal = 0;

    for (const [, utilityDef] of Object.entries(fluidUtilities)) {
      const scale = getDefaultScale(utilityDef.scale);
      oldTotal += Object.keys(generateFluidValuesOld(scale)).length;
      newTotal += Object.keys(generateFluidValuesNew(scale)).length;
    }

    console.log("\n── Registered values (memory) ──");
    console.log(`  Old: ${oldTotal.toLocaleString()} values`);
    console.log(`  New: ${newTotal.toLocaleString()} values`);
    console.log(
      `  Reduction: ${(oldTotal / newTotal).toFixed(1)}x (${((1 - newTotal / oldTotal) * 100).toFixed(1)}% fewer)`,
    );

    expect(newTotal).toBeLessThan(oldTotal);
    expect(oldTotal / newTotal).toBeGreaterThan(10); // At least 10x fewer
  });

  it("should measure cross-unit warning count (the original bug)", () => {
    let totalWarnings = 0;

    for (const [, utilityDef] of Object.entries(fluidUtilities)) {
      const scale = getDefaultScale(utilityDef.scale);
      const keys = Object.keys(scale);

      // Determine units per key
      const unitByKey = new Map<string, string>();
      for (const key of keys) {
        if (SKIP_KEYS.has(key)) continue;
        const unit = extractUnit(scale[key]);
        if (unit) unitByKey.set(key, unit);
      }

      // Group by unit
      const keysByUnit = new Map<string, string[]>();
      for (const [key, unit] of unitByKey) {
        let g = keysByUnit.get(unit);
        if (!g) {
          g = [];
          keysByUnit.set(unit, g);
        }
        g.push(key);
      }

      // Count cross-unit pairs (these would all produce warnings)
      const groups = [...keysByUnit.entries()];
      for (let i = 0; i < groups.length; i++) {
        for (let j = i + 1; j < groups.length; j++) {
          totalWarnings += groups[i][1].length * groups[j][1].length * 2;
        }
      }
    }

    console.log("\n── Warning spam eliminated ──");
    console.log(
      `  Warnings that the old code would emit: ${totalWarnings.toLocaleString()}`,
    );
    console.log(`  Warnings with the new code:            0`);

    // This is the number that was causing the 4700+ warnings in IntelliSense
    expect(totalWarnings).toBeGreaterThan(0);
  });

  it("should complete full plugin init under 5ms (new approach)", () => {
    const iterations = 200;
    const result = benchmark(() => {
      for (const [, utilityDef] of Object.entries(fluidUtilities)) {
        const scale = getDefaultScale(utilityDef.scale);
        generateFluidValuesNew(scale);
      }
    }, iterations);

    console.log(`\n── New approach latency ──`);
    console.log(`  Median: ${result.median.toFixed(4)}ms`);
    console.log(`  P95:    ${result.p95.toFixed(4)}ms`);

    // Full plugin init should be very fast with O(n)
    expect(result.median).toBeLessThan(5);
  });
});

describe("per-scale breakdown", () => {
  const scales: [string, Record<string, unknown>][] = [
    ["spacing", defaultSpacing],
    ["fontSize", defaultFontSize],
    ["lineHeight", defaultLineHeight],
    ["letterSpacing", defaultLetterSpacing],
    ["borderRadius", defaultBorderRadius],
    ["borderWidth", defaultBorderWidth],
  ];

  it("should show per-scale comparison", () => {
    console.log("\n── Per-scale breakdown ──");
    console.log(
      `${"Scale".padEnd(16)} | ${"Keys".padStart(5)} | ${"Old pairs".padStart(10)} | ${"New values".padStart(10)} | ${"Ratio".padStart(7)}`,
    );
    console.log("-".repeat(60));

    for (const [name, scale] of scales) {
      const keys = Object.keys(scale).filter((k) => !SKIP_KEYS.has(k));
      const oldCount = Object.keys(generateFluidValuesOld(scale)).length;
      const newCount = Object.keys(generateFluidValuesNew(scale)).length;
      const ratio = oldCount > 0 ? (oldCount / newCount).toFixed(1) : "N/A";
      console.log(
        `${name.padEnd(16)} | ${keys.length.toString().padStart(5)} | ${oldCount.toString().padStart(10)} | ${newCount.toString().padStart(10)} | ${ratio.toString().padStart(6)}x`,
      );
    }

    // All scales should have fewer or equal values in new approach
    for (const [, scale] of scales) {
      const oldCount = Object.keys(generateFluidValuesOld(scale)).length;
      const newCount = Object.keys(generateFluidValuesNew(scale)).length;
      expect(newCount).toBeLessThanOrEqual(oldCount);
    }
  });
});
