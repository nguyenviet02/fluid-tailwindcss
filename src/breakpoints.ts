import type { PluginAPI } from "./types";

export interface BreakpointRange {
  fluidValue: string;
  minViewport: number;
  maxViewport: number;
}

/**
 * Resolves theme("screens") into a map of breakpoint name → pixel value.
 * Handles string values ("768px", "768") and object values ({ min: "768px" }).
 */
export function resolveScreens(
  theme: PluginAPI["theme"],
): Record<string, number> {
  const raw = theme("screens") as Record<string, unknown> | undefined;
  if (!raw || typeof raw !== "object") return {};

  const result: Record<string, number> = {};

  for (const [name, value] of Object.entries(raw)) {
    if (name === "__CSS_VALUES__") continue;
    const px = extractPixelValue(value);
    if (px !== null) {
      result[name] = px;
    }
  }

  return result;
}

/**
 * Extracts a pixel number from a screen value.
 * Supports: "768px", "48rem", "768", { min: "768px" }, { min: "48rem" }
 */
function extractPixelValue(value: unknown): number | null {
  if (typeof value === "string") {
    return parseLengthToPixels(value);
  }
  if (typeof value === "number") {
    return value;
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.min === "string") {
      return parseLengthToPixels(obj.min);
    }
  }
  return null;
}

function parseLengthToPixels(str: string): number | null {
  const trimmed = str.trim();
  if (trimmed.endsWith("rem")) {
    const num = parseFloat(trimmed);
    if (isNaN(num) || num <= 0) return null;
    return num * 16;
  }
  if (trimmed.endsWith("em")) {
    const num = parseFloat(trimmed);
    if (isNaN(num) || num <= 0) return null;
    return num * 16;
  }
  const num = parseInt(trimmed, 10);
  if (isNaN(num) || num <= 0) return null;
  return num;
}

/**
 * Parses a breakpoint range from a fluid value string.
 *
 * Primary syntax (double-dash): "4/8--md-lg" → { fluidValue: "4/8", minViewport: 768, maxViewport: 1024 }
 * Arbitrary pixels: "4/8--[768px-1024px]" → { fluidValue: "4/8", minViewport: 768, maxViewport: 1024 }
 * Legacy (@-based): "4/8@md-lg" → same result (for unit tests and internal use)
 *
 * Returns null if no range separator is present (backward compatible) or if parsing fails.
 */
export function parseBreakpointRange(
  effectiveValue: string,
  screens: Record<string, number>,
): BreakpointRange | null {
  let fluidPart: string;
  let rangePart: string;

  // Primary syntax: split on "--" (double dash)
  // Must check for "--" before "@" since "--" is the user-facing syntax
  const doubleDashIndex = effectiveValue.indexOf("--");
  if (doubleDashIndex > 0) {
    fluidPart = effectiveValue.substring(0, doubleDashIndex);
    rangePart = effectiveValue.substring(doubleDashIndex + 2);
  } else {
    // Legacy: split on "@"
    const atIndex = effectiveValue.indexOf("@");
    if (atIndex === -1) return null;
    fluidPart = effectiveValue.substring(0, atIndex);
    rangePart = effectiveValue.substring(atIndex + 1);
  }

  if (!fluidPart || !rangePart) return null;

  // Arbitrary pixel values: [768px-1024px] or [768px/1024px]
  if (rangePart.startsWith("[") && rangePart.endsWith("]")) {
    return parseArbitraryRange(fluidPart, rangePart);
  }

  // Named breakpoints: md-lg, sm-xl, sm-2xl
  return parseNamedRange(fluidPart, rangePart, screens);
}

function parseArbitraryRange(
  fluidValue: string,
  rangePart: string,
): BreakpointRange | null {
  const inner = rangePart.slice(1, -1);

  // Try "/" separator: [768px/1024px]
  let parts = inner.split("/");
  if (parts.length === 2) {
    const result = parsePixelPair(parts[0], parts[1]);
    if (result) return { fluidValue, ...result };
  }

  // Try "-" separator: [768px-1024px]
  // Match pattern: digits+px - digits+px
  const dashMatch = inner.match(/^(\d+)px-(\d+)px$/);
  if (dashMatch) {
    const result = parsePixelPair(dashMatch[1] + "px", dashMatch[2] + "px");
    if (result) return { fluidValue, ...result };
  }

  return null;
}

function parsePixelPair(
  minStr: string,
  maxStr: string,
): { minViewport: number; maxViewport: number } | null {
  const min = parseInt(minStr, 10);
  const max = parseInt(maxStr, 10);
  if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0 || min >= max) {
    return null;
  }
  return { minViewport: min, maxViewport: max };
}

function parseNamedRange(
  fluidValue: string,
  rangePart: string,
  screens: Record<string, number>,
): BreakpointRange | null {
  // Try "/" separator first (e.g. "md/lg")
  let parts = rangePart.split("/");
  if (parts.length === 2) {
    const result = resolveNamedPair(parts[0], parts[1], screens);
    if (result) return { fluidValue, ...result };
  }

  // Try "-" separator, matching against known screen names
  // This handles "md-lg" but also "sm-2xl" correctly
  const dashResult = parseDashSeparated(rangePart, screens);
  if (dashResult) return { fluidValue, ...dashResult };

  return null;
}

function resolveNamedPair(
  minName: string,
  maxName: string,
  screens: Record<string, number>,
): { minViewport: number; maxViewport: number } | null {
  const minVp = screens[minName];
  const maxVp = screens[maxName];
  if (minVp === undefined || maxVp === undefined) return null;
  if (minVp >= maxVp) return null;
  return { minViewport: minVp, maxViewport: maxVp };
}

function parseDashSeparated(
  rangePart: string,
  screens: Record<string, number>,
): { minViewport: number; maxViewport: number } | null {
  const screenNames = Object.keys(screens);
  for (const name of screenNames) {
    if (rangePart.startsWith(name + "-")) {
      const rest = rangePart.substring(name.length + 1);
      if (screens[rest] !== undefined) {
        return resolveNamedPair(name, rest, screens);
      }
    }
  }
  return null;
}
