import plugin from "tailwindcss/plugin";
import type {
  FluidOptions,
  FluidPlugin,
  ResolvedFluidOptions,
  CssInJs,
  PluginAPI,
} from "./types";
import {
  calculateClampAdvanced,
  parseFluidString,
  resolveThemeValue,
  checkAccessibility,
  validateFluidUnits,
  extractFontSizeCompanions,
  resolveLineHeightCompanion,
} from "./clamp";
import { fluidUtilities, getThemePath, getDefaultScale } from "./utilities";
import { parseArbitraryValue } from "./validation";
import { Length } from "./length";
import { parseBreakpointRange, resolveScreens } from "./breakpoints";

// Re-export types for consumers
export type {
  FluidOptions,
  FluidPlugin,
  ResolvedFluidOptions,
  FluidValue,
  UtilityDefinition,
  CssInJs,
  SC144CheckResult,
  AccessibilityCheckResult,
  ValidationResult,
  FluidValuePair,
  PerUtilityBreakpoints,
} from "./types";

export type { BreakpointRange } from "./breakpoints";

// Export clamp utilities
export {
  calculateClamp,
  parseFluidString,
  resolveThemeValue,
  toPrecision,
  getPrecision,
  clampNumber,
  checkSC144,
  checkAccessibility,
  calculateNegativeClamp,
  // Advanced clamp functions
  calculateClampAdvanced,
  validateFluidUnits,
  createNegatedClamp,
  createContainerClamp,
  extractFontSizeCompanions,
  resolveLineHeightCompanion,
} from "./clamp";

// Export utility definitions
export { fluidUtilities, getDefaultScale } from "./utilities";

// Export Length class for advanced usage
export { Length } from "./length";
export type { RawValue } from "./length";

// Export breakpoint utilities
export { parseBreakpointRange, resolveScreens } from "./breakpoints";

// Export error handling utilities
export { FluidError, errorCodes, throwError, ok, err } from "./errors";
export type { ErrorCode, FluidResult } from "./errors";

// Export validation utilities
export {
  validateUnitsMatch,
  validateBreakpointsCompatible,
  validateValuesAreDifferent,
  validateFluidPair,
  parseAndValidateFluidPair,
  isSupportedUnit,
  isArbitraryValue,
  parseArbitraryValue,
  createDebugComment,
  SUPPORTED_UNITS,
} from "./validation";

/**
 * Default plugin options
 */
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

/**
 * Normalizes options by converting lowercase variants to camelCase
 * This handles Prettier converting camelCase to lowercase in CSS @plugin blocks
 */
function normalizeOptions(options: FluidOptions): FluidOptions {
  const normalized: FluidOptions = { ...options };

  // Map lowercase variants to camelCase
  if (options.minviewport !== undefined && options.minViewport === undefined) {
    normalized.minViewport = options.minviewport;
  }
  if (options.maxviewport !== undefined && options.maxViewport === undefined) {
    normalized.maxViewport = options.maxviewport;
  }
  if (options.userem !== undefined && options.useRem === undefined) {
    normalized.useRem = options.userem;
  }
  if (
    options.rootfontsize !== undefined &&
    options.rootFontSize === undefined
  ) {
    normalized.rootFontSize = options.rootfontsize;
  }
  if (
    options.checkaccessibility !== undefined &&
    options.checkAccessibility === undefined
  ) {
    normalized.checkAccessibility = options.checkaccessibility;
  }
  if (
    options.usecontainerquery !== undefined &&
    options.useContainerQuery === undefined
  ) {
    normalized.useContainerQuery = options.usecontainerquery;
  }
  if (
    options.validateunits !== undefined &&
    options.validateUnits === undefined
  ) {
    normalized.validateUnits = options.validateunits;
  }

  return normalized;
}

/**
 * Resolves user options with defaults
 */
function resolveOptions(options: FluidOptions = {}): ResolvedFluidOptions {
  const normalized = normalizeOptions(options);
  return {
    ...defaultOptions,
    ...normalized,
  };
}

/**
 * Keys that should never participate in fluid value pair generation.
 */
const SKIP_KEYS = new Set(["DEFAULT", "none", "full"]);

/**
 * Extracts the CSS unit from a theme value.
 *
 * Handles plain strings ("1rem", "16px"), Tailwind v4 fontSize objects,
 * and the [fontSize, lineHeight] array format.
 * Returns null when the value cannot be parsed to a recognised unit.
 */
export function extractUnit(value: unknown): string | null {
  if (typeof value === "string") {
    const parsed = Length.parse(value.trim());
    if (parsed?.unit) return parsed.unit;
    return null;
  }

  // Tailwind fontSize values can be arrays: ["1.5rem", { lineHeight: "2rem" }]
  if (Array.isArray(value) && value.length > 0) {
    return extractUnit(value[0]);
  }

  // Tailwind v4 may wrap values in objects: { fontSize: "1rem", lineHeight: "1.5" }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    for (const prop of ["fontSize", "value", "size"]) {
      if (typeof obj[prop] === "string") return extractUnit(obj[prop]);
    }
  }

  return null;
}

/**
 * Generates fluid utility values using dynamic resolution.
 *
 * Instead of pre-generating all O(n²) min/max pairs, this registers
 * only the raw theme keys as accepted values. The handler receives
 * the slash-separated "min/max" string and resolves it at match time.
 *
 * This approach:
 * - Reduces registered values from O(n²) to O(n)
 * - Eliminates cross-unit warning spam entirely
 * - Makes IntelliSense fast (~330ms baseline vs ~2700ms+)
 */
function generateFluidValues(
  scaleValues: Record<string, unknown>,
  debug = false,
): Record<string, string> {
  const values: Record<string, string> = {};
  const keys = Object.keys(scaleValues);

  // ── 1. Resolve units for every key up-front (O(n)) ──────────
  const unitByKey = new Map<string, string>();
  const unparsableKeys: string[] = [];

  for (const key of keys) {
    if (SKIP_KEYS.has(key)) continue;

    const unit = extractUnit(scaleValues[key]);
    if (unit) {
      unitByKey.set(key, unit);
    } else {
      unparsableKeys.push(key);
    }
  }

  // ── 2. Group keys by unit so we only combine compatible pairs ──
  const keysByUnit = new Map<string, string[]>();
  for (const [key, unit] of unitByKey) {
    let group = keysByUnit.get(unit);
    if (!group) {
      group = [];
      keysByUnit.set(unit, group);
    }
    group.push(key);
  }

  // ── 3. One-time summary warnings (debug mode only) ────────────
  if (debug) {
    if (keysByUnit.size > 1) {
      const unitSummary = [...keysByUnit.entries()]
        .map(([unit, group]) => `${unit} (${group.length} values)`)
        .join(", ");
      console.warn(
        `[fluid-tailwindcss] Theme scale contains mixed units: ${unitSummary}. ` +
          `Cross-unit pairs have been excluded.`,
      );
    }
    if (unparsableKeys.length > 0) {
      console.warn(
        `[fluid-tailwindcss] Could not determine unit for theme keys: ` +
          `${unparsableKeys.join(", ")}. These keys are excluded from fluid value generation.`,
      );
    }
  }

  // ── 4. Register each valid key as its own value (O(n)) ─────────
  // The handler will dynamically parse the "min/max" slash-separated
  // syntax at match time, avoiding O(n²) pair pre-generation.
  for (const key of unitByKey.keys()) {
    values[key] = key;
  }

  return values;
}

/**
 * Creates the CSS declaration(s) for a fluid utility
 */
function createFluidDeclaration(
  properties: string | string[],
  clampValue: string,
): CssInJs {
  const props = Array.isArray(properties) ? properties : [properties];
  const result: CssInJs = {};

  for (const prop of props) {
    result[prop] = clampValue;
  }

  return result;
}

type MatchOptions = Parameters<PluginAPI["matchUtilities"]>[1];
type MatchValues = NonNullable<MatchOptions>["values"];

function getMatchOptions(
  scale: (typeof fluidUtilities)[string]["scale"],
  values: Record<string, string>,
): MatchOptions {
  if (scale === "spacing") {
    return {
      values: {
        __BARE_VALUE__: ({ value }: { value: string }) =>
          /^-?\d+(\.\d+)?$/.test(value) ? value : undefined,
      } as unknown as MatchValues,
      modifiers: "any",
    };
  }

  return { values, modifiers: "any" };
}

/**
 * The main fluid-tailwindcss plugin
 */
const fluidPlugin = plugin.withOptions<FluidOptions>(
  (options = {}) => {
    const resolvedOptions = resolveOptions(options);

    return ({ matchUtilities, theme }) => {
      const screens = resolveScreens(theme);

      // Register each fluid utility
      for (const [utilityName, utilityDef] of Object.entries(fluidUtilities)) {
        const themePath = getThemePath(utilityDef.scale);

        // Get theme values, fallback to defaults
        // Tailwind v4 can return objects for some theme values (like fontSize)
        const themeValues =
          (theme(themePath) as Record<string, unknown>) ??
          getDefaultScale(utilityDef.scale);

        // Generate fluid value combinations (pre-filtered by unit compatibility)
        const fluidValues = generateFluidValues(
          themeValues,
          resolvedOptions.debug,
        );

        // Handle special utilities that need custom logic
        if (utilityName === "fl-space-x" || utilityName === "fl-space-y") {
          // Space utilities need special handling with > * + * selector
          registerSpaceUtility(
            utilityName,
            utilityDef,
            themeValues,
            fluidValues,
            resolvedOptions,
            matchUtilities,
            screens,
          );
          continue;
        }

        if (
          utilityName === "fl-translate-x" ||
          utilityName === "fl-translate-y"
        ) {
          // Translate utilities need transform context
          registerTranslateUtility(
            utilityName,
            utilityDef,
            themeValues,
            fluidValues,
            resolvedOptions,
            matchUtilities,
            screens,
          );
          continue;
        }

        // Build the utility name with optional prefix
        const fullUtilityName = resolvedOptions.prefix
          ? `${resolvedOptions.prefix}${utilityName}`
          : utilityName;

        // Create utility handler function
        // Values are resolved dynamically at match time from the slash-separated
        // "min/max" syntax, instead of pre-enumerating all O(n²) pairs.
        const createUtilityHandler = (negate: boolean) => {
          return (
            value: string,
            extra: { modifier: string | null },
          ): CssInJs => {
            // In Tailwind v4, the "/" in "fl-p-4/8" is interpreted as modifier syntax.
            // Tailwind sends value="4" and modifier="8". We reconstruct "4/8" here.
            const effectiveValue =
              extra.modifier != null ? `${value}/${extra.modifier}` : value;

            // Extract breakpoint range if present (e.g. "4/8@md/lg")
            const rangeResult = parseBreakpointRange(effectiveValue, screens);
            const fluidInput = rangeResult ? rangeResult.fluidValue : effectiveValue;
            const bpOverrides = rangeResult
              ? { minViewport: rangeResult.minViewport, maxViewport: rangeResult.maxViewport }
              : {};

            // Handle arbitrary values like [1rem/2rem]
            const arbitraryValue = parseArbitraryValue(fluidInput);
            if (arbitraryValue) {
              const arbitraryParsed = parseFluidString(arbitraryValue);
              if (!arbitraryParsed) return {};

              // Validate units match for arbitrary values
              if (resolvedOptions.validateUnits) {
                const validation = validateFluidUnits(
                  arbitraryParsed.min,
                  arbitraryParsed.max,
                );
                if (!validation.valid) {
                  console.warn(
                    `[fluid-tailwindcss] ${validation.error?.message}`,
                  );
                  return {};
                }
              }

              const { result } = calculateClampAdvanced(
                arbitraryParsed.min,
                arbitraryParsed.max,
                resolvedOptions,
                { negate, ...bpOverrides },
              );
              return createFluidDeclaration(utilityDef.property, result);
            }

            const parsed = parseFluidString(fluidInput);
            if (!parsed) return {};

            // Resolve theme values
            const minResolved = resolveThemeValue(parsed.min, themeValues);
            const maxResolved = resolveThemeValue(parsed.max, themeValues);

            if (!minResolved || !maxResolved) return {};

            // Validate units match if validation is enabled
            if (resolvedOptions.validateUnits) {
              const validation = validateFluidUnits(minResolved, maxResolved);
              if (!validation.valid) {
                if (resolvedOptions.debug) {
                  console.warn(
                    `[fluid-tailwindcss] ${validation.error?.message}`,
                  );
                }
                return {};
              }
            }

            // Check accessibility for typography
            if (utilityName === "fl-text") {
              const { warning } = checkAccessibility(
                minResolved,
                resolvedOptions,
                "text",
              );
              if (warning) {
                console.warn(`[fluid-tailwindcss] ${warning}`);
              }
            }

            // Calculate the clamp value using advanced function for debug support
            const shouldPreserveUnit = utilityName === "fl-tracking";
            const { result: clampValue } = calculateClampAdvanced(
              minResolved,
              maxResolved,
              resolvedOptions,
              { negate, preserveUnit: shouldPreserveUnit, ...bpOverrides },
            );

            // For fl-text, also emit fluid line-height and letter-spacing
            // when both min and max fontSize entries have companion values
            if (utilityName === "fl-text") {
              const css = createFluidDeclaration(utilityDef.property, clampValue);
              const minCompanions = extractFontSizeCompanions(themeValues[parsed.min]);
              const maxCompanions = extractFontSizeCompanions(themeValues[parsed.max]);

              if (minCompanions.lineHeight && maxCompanions.lineHeight) {
                const minLH = resolveLineHeightCompanion(minCompanions.lineHeight, minResolved);
                const maxLH = resolveLineHeightCompanion(maxCompanions.lineHeight, maxResolved);
                if (minLH && maxLH) {
                  const { result: lhClamp } = calculateClampAdvanced(
                    minLH,
                    maxLH,
                    resolvedOptions,
                    { negate, ...bpOverrides },
                  );
                  if (lhClamp) css["line-height"] = lhClamp;
                }
              }

              if (minCompanions.letterSpacing && maxCompanions.letterSpacing) {
                const { result: lsClamp, validation: lsValidation } = calculateClampAdvanced(
                  minCompanions.letterSpacing,
                  maxCompanions.letterSpacing,
                  resolvedOptions,
                  { negate, preserveUnit: true, ...bpOverrides },
                );
                if (lsClamp) {
                  css["letter-spacing"] = lsClamp;
                } else if (resolvedOptions.debug && lsValidation.error) {
                  console.warn(
                    `[fluid-tailwindcss] fl-text-${parsed.min}/${parsed.max} letter-spacing skipped: ${lsValidation.error.message}`,
                  );
                }
              }

              return css;
            }

            // Create the CSS declaration
            return createFluidDeclaration(utilityDef.property, clampValue);
          };
        };

        // Register the positive utility
        matchUtilities(
          {
            [fullUtilityName]: createUtilityHandler(false),
          },
          getMatchOptions(utilityDef.scale, fluidValues),
        );

        // Register the negative utility with "neg" prefix if supported
        // Tailwind v4 doesn't allow utility names starting with "-"
        // So we use "neg-fl-*" instead of "-fl-*" for negative utilities
        // Users should use: neg-fl-m-4/8 instead of -fl-m-4/8
        if (utilityDef.supportsNegative) {
          // Create negative version with "neg-" prefix: neg-fl-m, neg-fl-mt, etc.
          const negativeUtilityName = `neg-${fullUtilityName}`;
          matchUtilities(
            {
              [negativeUtilityName]: createUtilityHandler(true),
            },
            getMatchOptions(utilityDef.scale, fluidValues),
          );
        }
      }
    };
  },
  // Plugin configuration (for @plugin options)
  () => ({
    // No additional Tailwind config needed
  }),
) as unknown as FluidPlugin;

/**
 * Registers space-x/space-y utilities with proper child selectors
 */
function registerSpaceUtility(
  utilityName: string,
  _utilityDef: (typeof fluidUtilities)[string],
  themeValues: Record<string, unknown>,
  fluidValues: Record<string, string>,
  resolvedOptions: ResolvedFluidOptions,
  matchUtilities: PluginAPI["matchUtilities"],
  screens: Record<string, number>,
) {
  const isX = utilityName === "fl-space-x";
  const marginProp = isX ? "margin-left" : "margin-top";

  // Build the utility name with optional prefix
  const fullUtilityName = resolvedOptions.prefix
    ? `${resolvedOptions.prefix}${utilityName}`
    : utilityName;

  // Create space utility handler
  const createSpaceHandler = (negate: boolean) => {
    return (value: string, extra: { modifier: string | null }): CssInJs => {
      // In Tailwind v4, reconstruct "value/modifier" from the slash syntax
      const effectiveValue =
        extra.modifier != null ? `${value}/${extra.modifier}` : value;

      // Extract breakpoint range if present
      const rangeResult = parseBreakpointRange(effectiveValue, screens);
      const fluidInput = rangeResult ? rangeResult.fluidValue : effectiveValue;
      const bpOverrides = rangeResult
        ? { minViewport: rangeResult.minViewport, maxViewport: rangeResult.maxViewport }
        : {};

      // Handle arbitrary values
      const arbitraryValue = parseArbitraryValue(fluidInput);
      if (arbitraryValue) {
        const arbitraryParsed = parseFluidString(arbitraryValue);
        if (!arbitraryParsed) return {};

        if (resolvedOptions.validateUnits) {
          const validation = validateFluidUnits(
            arbitraryParsed.min,
            arbitraryParsed.max,
          );
          if (!validation.valid) return {};
        }

        const { result } = calculateClampAdvanced(
          arbitraryParsed.min,
          arbitraryParsed.max,
          resolvedOptions,
          { negate, ...bpOverrides },
        );
        return {
          "& > :not([hidden]) ~ :not([hidden])": {
            [marginProp]: result,
          },
        };
      }

      const parsed = parseFluidString(fluidInput);
      if (!parsed) return {};

      const minResolved = resolveThemeValue(parsed.min, themeValues);
      const maxResolved = resolveThemeValue(parsed.max, themeValues);

      if (!minResolved || !maxResolved) return {};

      if (resolvedOptions.validateUnits) {
        const validation = validateFluidUnits(minResolved, maxResolved);
        if (!validation.valid) return {};
      }

      const { result: clampValue } = calculateClampAdvanced(
        minResolved,
        maxResolved,
        resolvedOptions,
        { negate, ...bpOverrides },
      );

      return {
        "& > :not([hidden]) ~ :not([hidden])": {
          [marginProp]: clampValue,
        },
      };
    };
  };

  const matchOptions = getMatchOptions(_utilityDef.scale, fluidValues);

  // Register positive utility
  matchUtilities(
    {
      [fullUtilityName]: createSpaceHandler(false),
    },
    matchOptions,
  );

  // Register negative utility with "neg-" prefix
  const negativeUtilityName = `neg-${fullUtilityName}`;
  matchUtilities(
    {
      [negativeUtilityName]: createSpaceHandler(true),
    },
    matchOptions,
  );
}

/**
 * Registers translate utilities with transform context
 */
function registerTranslateUtility(
  utilityName: string,
  utilityDef: (typeof fluidUtilities)[string],
  themeValues: Record<string, unknown>,
  fluidValues: Record<string, string>,
  resolvedOptions: ResolvedFluidOptions,
  matchUtilities: PluginAPI["matchUtilities"],
  screens: Record<string, number>,
) {
  // Build the utility name with optional prefix
  const fullUtilityName = resolvedOptions.prefix
    ? `${resolvedOptions.prefix}${utilityName}`
    : utilityName;

  // Create translate utility handler
  const createTranslateHandler = (negate: boolean) => {
    return (value: string, extra: { modifier: string | null }): CssInJs => {
      // In Tailwind v4, reconstruct "value/modifier" from the slash syntax
      const effectiveValue =
        extra.modifier != null ? `${value}/${extra.modifier}` : value;

      // Extract breakpoint range if present
      const rangeResult = parseBreakpointRange(effectiveValue, screens);
      const fluidInput = rangeResult ? rangeResult.fluidValue : effectiveValue;
      const bpOverrides = rangeResult
        ? { minViewport: rangeResult.minViewport, maxViewport: rangeResult.maxViewport }
        : {};

      // Handle arbitrary values
      const arbitraryValue = parseArbitraryValue(fluidInput);
      if (arbitraryValue) {
        const arbitraryParsed = parseFluidString(arbitraryValue);
        if (!arbitraryParsed) return {};

        if (resolvedOptions.validateUnits) {
          const validation = validateFluidUnits(
            arbitraryParsed.min,
            arbitraryParsed.max,
          );
          if (!validation.valid) return {};
        }

        const { result } = calculateClampAdvanced(
          arbitraryParsed.min,
          arbitraryParsed.max,
          resolvedOptions,
          { negate, ...bpOverrides },
        );
        return {
          [utilityDef.property as string]: result,
          transform: `translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
        };
      }

      const parsed = parseFluidString(fluidInput);
      if (!parsed) return {};

      const minResolved = resolveThemeValue(parsed.min, themeValues);
      const maxResolved = resolveThemeValue(parsed.max, themeValues);

      if (!minResolved || !maxResolved) return {};

      if (resolvedOptions.validateUnits) {
        const validation = validateFluidUnits(minResolved, maxResolved);
        if (!validation.valid) return {};
      }

      const { result: clampValue } = calculateClampAdvanced(
        minResolved,
        maxResolved,
        resolvedOptions,
        { negate, ...bpOverrides },
      );

      return {
        [utilityDef.property as string]: clampValue,
        transform: `translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
      };
    };
  };

  const matchOptions = getMatchOptions(utilityDef.scale, fluidValues);

  // Register positive utility
  matchUtilities(
    {
      [fullUtilityName]: createTranslateHandler(false),
    },
    matchOptions,
  );

  // Register negative utility with "neg-" prefix if supported
  if (utilityDef.supportsNegative) {
    const negativeUtilityName = `neg-${fullUtilityName}`;
    matchUtilities(
      {
        [negativeUtilityName]: createTranslateHandler(true),
      },
      matchOptions,
    );
  }
}

// Export the plugin as default
export default fluidPlugin;

// Named export for CommonJS compatibility
export { fluidPlugin };
