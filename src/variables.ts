import {
  type ResolvedFluidOptions,
  type FluidVariablePrefixMapping,
  type FluidVariableEntry,
  type CssInJs,
} from "./types";
import { parseBreakpointRange, resolveScreens } from "./breakpoints";
import {
  parseFluidString,
  resolveThemeValue,
  validateFluidUnits,
  calculateClampAdvanced,
} from "./clamp";

/**
 * Recognized fluid variable name prefixes and the Tailwind theme key they extend.
 * Order matters: `text` must be checked before `tracking` since both start with
 * the same letters, but the prefix boundary (`-`) makes them unambiguous here.
 */
const PREFIX_MAP: FluidVariablePrefixMapping[] = [
  { prefix: "text", themeKey: "fontSize" },
  { prefix: "spacing", themeKey: "spacing" },
  { prefix: "leading", themeKey: "lineHeight" },
  { prefix: "tracking", themeKey: "letterSpacing" },
  { prefix: "radius", themeKey: "borderRadius" },
];

/**
 * Returns the matching prefix mapping for a variable name (without leading `--`),
 * or `undefined` if the name does not start with a recognized prefix.
 */
export function matchVariablePrefix(
  name: string,
): FluidVariablePrefixMapping | undefined {
  const segment = name.split("-")[0];
  return PREFIX_MAP.find((mapping) => mapping.prefix === segment);
}

/**
 * Internal clamp variable name for a given user-facing name (without leading `--`).
 */
export function internalClampVar(name: string): string {
  return `--fluid-${name}`;
}

/**
 * Strips a leading `--` from a variable name if present.
 */
function normalizeVariableName(name: string): string {
  return name.startsWith("--") ? name.slice(2) : name;
}

/**
 * Resolves a single fluid variable declaration to a `clamp()` string (or `null` on failure).
 *
 * Reuses the same math and validation as the `fl-*` utility classes:
 * - breakpoint ranges (`min/max--md-lg`, `min/max@md-lg`, `min/max--[768px-1024px]`)
 * - arbitrary values with units (`64px/80px`)
 * - bare numbers (`4/8` → spacing scale)
 */
export function resolveFluidVariable(
  name: string,
  spec: string,
  options: ResolvedFluidOptions,
  screens: Record<string, number>,
  themeValues: Record<string, unknown> = {},
): FluidVariableEntry {
  const normalizedName = normalizeVariableName(name);
  const clampVar = internalClampVar(normalizedName);
  const prefixMapping = matchVariablePrefix(normalizedName);

  if (!normalizedName) {
    return { name: "", spec, clampVar: "", clamp: "" };
  }

  const range = parseBreakpointRange(spec, screens);
  const fluidInput = range ? range.fluidValue : spec;
  const bpOverrides = range
    ? { minViewport: range.minViewport, maxViewport: range.maxViewport }
    : {};

  const parsed = parseFluidString(fluidInput);
  if (!parsed) {
    return {
      name: normalizedName,
      spec,
      clampVar,
      clamp: "",
      prefix: prefixMapping?.prefix,
    };
  }

  const minResolved = resolveThemeValue(parsed.min, themeValues);
  const maxResolved = resolveThemeValue(parsed.max, themeValues);
  if (!minResolved || !maxResolved) {
    return {
      name: normalizedName,
      spec,
      clampVar,
      clamp: "",
      prefix: prefixMapping?.prefix,
    };
  }

  if (options.validateUnits) {
    const validation = validateFluidUnits(minResolved, maxResolved);
    if (!validation.valid) {
      return { name: normalizedName, spec, clampVar, clamp: "" };
    }
  }

  const { result: clamp } = calculateClampAdvanced(
    minResolved,
    maxResolved,
    options,
    {
      ...bpOverrides,
      useContainerQuery: options.useContainerQuery,
      preserveUnit: prefixMapping?.prefix === "tracking",
    },
  );

  return {
    name: normalizedName,
    spec,
    clampVar,
    clamp,
    prefix: prefixMapping?.prefix,
  };
}

/**
 * Generates `:root` CSS declarations for all resolvable fluid variables.
 *
 * The clamp is emitted under the namespaced internal variable `--fluid-<name>`
 * so that Phase 2 (theme-entry registration) can safely reference it without
 * colliding with Tailwind's own `--text-*` etc. `@theme` output.
 */
export function generateFluidVariables(
  variables: Record<string, string>,
  options: ResolvedFluidOptions,
  screens: Record<string, number>,
  themeValues: Record<string, unknown> = {},
): CssInJs {
  const root: Record<string, string> = {};

  for (const [rawName, spec] of Object.entries(variables)) {
    const name = normalizeVariableName(rawName);
    if (!name) continue;

    const { clamp, clampVar } = resolveFluidVariable(
      name,
      spec,
      options,
      screens,
      themeValues,
    );

    if (!clamp) {
      if (options.debug) {
        console.warn(
          `[fluid-tailwindcss] Variable "${name}" skipped: invalid spec "${spec}".`,
        );
      }
      continue;
    }

    root[clampVar] = clamp;
  }

  return Object.keys(root).length > 0 ? { ":root": root } : {};
}

/**
 * Extracts the theme sub-key for a variable name. E.g. `text-head-1` → `head-1`,
 * `spacing-section` → `section`, `text` → `DEFAULT`.
 */
function themeSubKey(name: string): string {
  const mapping = matchVariablePrefix(name);
  if (!mapping) return "";

  const rest = name.slice(mapping.prefix.length);
  if (rest === "" || rest === "-") return "DEFAULT";
  return rest.startsWith("-") ? rest.slice(1) : rest;
}

/**
 * Builds Tailwind theme extensions for recognized variable-name prefixes.
 *
 * Phase 2: registers `var(--fluid-<name>)` references so Tailwind auto-generates
 * utilities such as `text-head-1`, `p-gutter`, `leading-tight`, `tracking-wide`,
 * `rounded-card` for variables whose names match the recognized prefixes.
 *
 * The function does NOT validate the spec; it registers the reference even when
 * Phase 1 failed to emit the clamp, matching Tailwind's own behavior for
 * unresolved theme variables.
 */
export function fluidVariableThemeExtensions(
  variables: Record<string, string>,
): { theme: { extend: Record<string, Record<string, string>> } } {
  const extend: Record<string, Record<string, string>> = {
    fontSize: {},
    spacing: {},
    lineHeight: {},
    letterSpacing: {},
    borderRadius: {},
  };

  for (const rawName of Object.keys(variables)) {
    const name = normalizeVariableName(rawName);
    if (!name) continue;

    const mapping = matchVariablePrefix(name);
    if (!mapping) continue;

    const subKey = themeSubKey(name);
    if (!subKey) continue;

    extend[mapping.themeKey][subKey] = `var(${internalClampVar(name)})`;
  }

  // Remove empty theme keys to keep the returned config clean
  for (const key of Object.keys(extend)) {
    if (Object.keys(extend[key]).length === 0) {
      delete extend[key];
    }
  }

  return { theme: { extend } };
}

/**
 * Convenience re-export of screen resolution for tests/advance usage.
 */
export { resolveScreens };
