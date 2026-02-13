import plugin from 'tailwindcss/plugin'
import type { FluidOptions, ResolvedFluidOptions, CssInJs, PluginAPI } from './types'
import {
  calculateClampAdvanced,
  parseFluidString,
  resolveThemeValue,
  checkAccessibility,
  validateFluidUnits,
} from './clamp'
import { fluidUtilities, getThemePath, getDefaultScale } from './utilities'
import { parseArbitraryValue } from './validation'
import { Length } from './length'

// Re-export types for consumers
export type { 
  FluidOptions, 
  ResolvedFluidOptions, 
  FluidValue, 
  UtilityDefinition, 
  CssInJs,
  SC144CheckResult,
  AccessibilityCheckResult,
  ValidationResult,
  FluidValuePair,
  PerUtilityBreakpoints,
} from './types'

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
} from './clamp'

// Export utility definitions
export { fluidUtilities, getDefaultScale } from './utilities'

// Export Length class for advanced usage
export { Length } from './length'
export type { RawValue } from './length'

// Export error handling utilities
export { 
  FluidError, 
  errorCodes, 
  throwError,
  ok,
  err,
} from './errors'
export type { ErrorCode, FluidResult } from './errors'

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
} from './validation'

/**
 * Default plugin options
 */
const defaultOptions: ResolvedFluidOptions = {
  minViewport: 375,
  maxViewport: 1440,
  useRem: true,
  rootFontSize: 16,
  checkAccessibility: true,
  prefix: '',
  separator: ':',
  useContainerQuery: false,
  debug: false,
  validateUnits: true,
}

/**
 * Normalizes options by converting lowercase variants to camelCase
 * This handles Prettier converting camelCase to lowercase in CSS @plugin blocks
 */
function normalizeOptions(options: FluidOptions): FluidOptions {
  const normalized: FluidOptions = { ...options }
  
  // Map lowercase variants to camelCase
  if (options.minviewport !== undefined && options.minViewport === undefined) {
    normalized.minViewport = options.minviewport
  }
  if (options.maxviewport !== undefined && options.maxViewport === undefined) {
    normalized.maxViewport = options.maxviewport
  }
  if (options.userem !== undefined && options.useRem === undefined) {
    normalized.useRem = options.userem
  }
  if (options.rootfontsize !== undefined && options.rootFontSize === undefined) {
    normalized.rootFontSize = options.rootfontsize
  }
  if (options.checkaccessibility !== undefined && options.checkAccessibility === undefined) {
    normalized.checkAccessibility = options.checkaccessibility
  }
  if (options.usecontainerquery !== undefined && options.useContainerQuery === undefined) {
    normalized.useContainerQuery = options.usecontainerquery
  }
  if (options.validateunits !== undefined && options.validateUnits === undefined) {
    normalized.validateUnits = options.validateunits
  }
  
  return normalized
}

/**
 * Resolves user options with defaults
 */
function resolveOptions(options: FluidOptions = {}): ResolvedFluidOptions {
  const normalized = normalizeOptions(options)
  return {
    ...defaultOptions,
    ...normalized,
  }
}

/**
 * Keys that should never participate in fluid value pair generation.
 */
const SKIP_KEYS = new Set(['DEFAULT', 'none', 'full'])

/**
 * Extracts the CSS unit from a theme value.
 *
 * Handles plain strings ("1rem", "16px"), Tailwind v4 fontSize objects,
 * and the [fontSize, lineHeight] array format.
 * Returns null when the value cannot be parsed to a recognised unit.
 */
function extractUnit(value: unknown): string | null {
  if (typeof value === 'string') {
    const parsed = Length.parse(value.trim())
    if (parsed?.unit) return parsed.unit
    return null
  }

  // Tailwind fontSize values can be arrays: ["1.5rem", { lineHeight: "2rem" }]
  if (Array.isArray(value) && value.length > 0) {
    return extractUnit(value[0])
  }

  // Tailwind v4 may wrap values in objects: { fontSize: "1rem", lineHeight: "1.5" }
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    for (const prop of ['fontSize', 'value', 'size']) {
      if (typeof obj[prop] === 'string') return extractUnit(obj[prop])
    }
  }

  return null
}

/**
 * Generates fluid utility values by combining all theme values.
 * Format: "minValue/maxValue" pairs like "4/8" or "base/2xl"
 *
 * Only pairs whose resolved values share the same CSS unit are included.
 * This prevents the combinatorial explosion of warnings that previously
 * occurred when the theme scale contained mixed units (e.g. the `px` key
 * at "1px" alongside all the rem-based spacing values), which caused
 * thousands of console.warn() calls per IntelliSense reload.
 */
function generateFluidValues(
  scaleValues: Record<string, unknown>,
  debug = false
): Record<string, string> {
  const values: Record<string, string> = {}
  const keys = Object.keys(scaleValues)

  // ── 1. Resolve units for every key up-front (O(n) not O(n²)) ──────────
  const unitByKey = new Map<string, string>()
  const unparsableKeys: string[] = []

  for (const key of keys) {
    if (SKIP_KEYS.has(key)) continue

    const unit = extractUnit(scaleValues[key])
    if (unit) {
      unitByKey.set(key, unit)
    } else {
      unparsableKeys.push(key)
    }
  }

  // ── 2. Group keys by unit so we only combine compatible pairs ──────────
  const keysByUnit = new Map<string, string[]>()
  for (const [key, unit] of unitByKey) {
    let group = keysByUnit.get(unit)
    if (!group) {
      group = []
      keysByUnit.set(unit, group)
    }
    group.push(key)
  }

  // ── 3. One-time summary warnings (debug mode only) ────────────────────
  if (debug) {
    if (keysByUnit.size > 1) {
      const unitSummary = [...keysByUnit.entries()]
        .map(([unit, group]) => `${unit} (${group.length} values)`)
        .join(', ')
      console.warn(
        `[fluid-tailwindcss] Theme scale contains mixed units: ${unitSummary}. ` +
        `Cross-unit pairs have been excluded.`
      )
    }
    if (unparsableKeys.length > 0) {
      console.warn(
        `[fluid-tailwindcss] Could not determine unit for theme keys: ` +
        `${unparsableKeys.join(', ')}. These keys are excluded from fluid value generation.`
      )
    }
  }

  // ── 4. Generate pairs only within same-unit groups ─────────────────────
  for (const group of keysByUnit.values()) {
    for (const minKey of group) {
      for (const maxKey of group) {
        if (minKey === maxKey) continue

        const fluidKey = `${minKey}/${maxKey}`
        values[fluidKey] = fluidKey
      }
    }
  }

  return values
}

/**
 * Creates the CSS declaration(s) for a fluid utility
 */
function createFluidDeclaration(
  properties: string | string[],
  clampValue: string
): CssInJs {
  const props = Array.isArray(properties) ? properties : [properties]
  const result: CssInJs = {}

  for (const prop of props) {
    result[prop] = clampValue
  }

  return result
}

/**
 * The main fluid-tailwindcss plugin
 */
const fluidPlugin = plugin.withOptions<FluidOptions>(
  (options = {}) => {
    const resolvedOptions = resolveOptions(options)

    return ({ matchUtilities, theme }) => {
      // Register each fluid utility
      for (const [utilityName, utilityDef] of Object.entries(fluidUtilities)) {
        const themePath = getThemePath(utilityDef.scale)
        
        // Get theme values, fallback to defaults
        // Tailwind v4 can return objects for some theme values (like fontSize)
        const themeValues = (theme(themePath) as Record<string, unknown>) ?? getDefaultScale(utilityDef.scale)
        
        // Generate fluid value combinations (pre-filtered by unit compatibility)
        const fluidValues = generateFluidValues(themeValues, resolvedOptions.debug)

        // Handle special utilities that need custom logic
        if (utilityName === 'fl-space-x' || utilityName === 'fl-space-y') {
          // Space utilities need special handling with > * + * selector
          registerSpaceUtility(utilityName, utilityDef, themeValues, fluidValues, resolvedOptions, matchUtilities)
          continue
        }

        if (utilityName === 'fl-translate-x' || utilityName === 'fl-translate-y') {
          // Translate utilities need transform context
          registerTranslateUtility(utilityName, utilityDef, themeValues, fluidValues, resolvedOptions, matchUtilities)
          continue
        }

        // Build the utility name with optional prefix
        const fullUtilityName = resolvedOptions.prefix 
          ? `${resolvedOptions.prefix}${utilityName}`
          : utilityName

        // Create utility handler function
        const createUtilityHandler = (negate: boolean) => {
          return (value: string, _extra: { modifier: string | null }): CssInJs => {
            // Handle arbitrary values like [1rem/2rem]
            const arbitraryValue = parseArbitraryValue(value)
            if (arbitraryValue) {
              const arbitraryParsed = parseFluidString(arbitraryValue)
              if (!arbitraryParsed) return {}
              
              // Validate units match for arbitrary values
              if (resolvedOptions.validateUnits) {
                const validation = validateFluidUnits(
                  arbitraryParsed.min, 
                  arbitraryParsed.max, 
                  resolvedOptions.rootFontSize
                )
                if (!validation.valid) {
                  console.warn(`[fluid-tailwindcss] ${validation.error?.message}`)
                  return {}
                }
              }

              const { result } = calculateClampAdvanced(
                arbitraryParsed.min, 
                arbitraryParsed.max, 
                resolvedOptions,
                { negate }
              )
              return createFluidDeclaration(utilityDef.property, result)
            }

            const parsed = parseFluidString(value)
            if (!parsed) return {}

            // Resolve theme values
            const minResolved = resolveThemeValue(parsed.min, themeValues)
            const maxResolved = resolveThemeValue(parsed.max, themeValues)

            if (!minResolved || !maxResolved) return {}

            // Validate units match if validation is enabled
            // With pre-filtered generateFluidValues() this should rarely fire
            // for theme-based pairs, but still catches edge cases where the
            // resolved value differs from what extractUnit() predicted.
            if (resolvedOptions.validateUnits) {
              const validation = validateFluidUnits(
                minResolved, 
                maxResolved, 
                resolvedOptions.rootFontSize
              )
              if (!validation.valid) {
                if (resolvedOptions.debug) {
                  console.warn(`[fluid-tailwindcss] ${validation.error?.message}`)
                }
                return {}
              }
            }

            // Check accessibility for typography
            if (utilityName === 'fl-text') {
              const { warning } = checkAccessibility(minResolved, resolvedOptions, 'text')
              if (warning) {
                console.warn(`[fluid-tailwindcss] ${warning}`)
              }
            }

            // Calculate the clamp value using advanced function for debug support
            const { result: clampValue } = calculateClampAdvanced(
              minResolved, 
              maxResolved, 
              resolvedOptions,
              { negate }
            )

            // Create the CSS declaration
            return createFluidDeclaration(utilityDef.property, clampValue)
          }
        }

        // Register the positive utility
        matchUtilities(
          {
            [fullUtilityName]: createUtilityHandler(false),
          },
          {
            values: fluidValues,
          }
        )

        // Register the negative utility with "neg" prefix if supported
        // Tailwind v4 doesn't allow utility names starting with "-"
        // So we use "neg-fl-*" instead of "-fl-*" for negative utilities
        // Users should use: neg-fl-m-4/8 instead of -fl-m-4/8
        if (utilityDef.supportsNegative) {
          // Create negative version with "neg-" prefix: neg-fl-m, neg-fl-mt, etc.
          const negativeUtilityName = `neg-${fullUtilityName}`
          matchUtilities(
            {
              [negativeUtilityName]: createUtilityHandler(true),
            },
            {
              values: fluidValues,
            }
          )
        }
      }
    }
  },
  // Plugin configuration (for @plugin options)
  (_options = {}) => ({
    // No additional Tailwind config needed
  })
)

/**
 * Registers space-x/space-y utilities with proper child selectors
 */
function registerSpaceUtility(
  utilityName: string,
  _utilityDef: (typeof fluidUtilities)[string],
  themeValues: Record<string, unknown>,
  fluidValues: Record<string, string>,
  resolvedOptions: ResolvedFluidOptions,
  matchUtilities: PluginAPI['matchUtilities']
) {
  const isX = utilityName === 'fl-space-x'
  const marginProp = isX ? 'margin-left' : 'margin-top'

  // Build the utility name with optional prefix
  const fullUtilityName = resolvedOptions.prefix 
    ? `${resolvedOptions.prefix}${utilityName}`
    : utilityName

  // Create space utility handler
  const createSpaceHandler = (negate: boolean) => {
    return (value: string, _extra: { modifier: string | null }): CssInJs => {
      // Handle arbitrary values
      const arbitraryValue = parseArbitraryValue(value)
      if (arbitraryValue) {
        const arbitraryParsed = parseFluidString(arbitraryValue)
        if (!arbitraryParsed) return {}
        
        if (resolvedOptions.validateUnits) {
          const validation = validateFluidUnits(
            arbitraryParsed.min, 
            arbitraryParsed.max, 
            resolvedOptions.rootFontSize
          )
          if (!validation.valid) return {}
        }

        const { result } = calculateClampAdvanced(
          arbitraryParsed.min, 
          arbitraryParsed.max, 
          resolvedOptions,
          { negate }
        )
        return {
          '& > :not([hidden]) ~ :not([hidden])': {
            [marginProp]: result,
          },
        }
      }

      const parsed = parseFluidString(value)
      if (!parsed) return {}

      const minResolved = resolveThemeValue(parsed.min, themeValues)
      const maxResolved = resolveThemeValue(parsed.max, themeValues)

      if (!minResolved || !maxResolved) return {}

      if (resolvedOptions.validateUnits) {
        const validation = validateFluidUnits(
          minResolved, 
          maxResolved, 
          resolvedOptions.rootFontSize
        )
        if (!validation.valid) return {}
      }

      const { result: clampValue } = calculateClampAdvanced(
        minResolved, 
        maxResolved, 
        resolvedOptions,
        { negate }
      )

      return {
        '& > :not([hidden]) ~ :not([hidden])': {
          [marginProp]: clampValue,
        },
      }
    }
  }

  // Register positive utility
  matchUtilities(
    {
      [fullUtilityName]: createSpaceHandler(false),
    },
    {
      values: fluidValues,
    }
  )

  // Register negative utility with "neg-" prefix
  const negativeUtilityName = `neg-${fullUtilityName}`
  matchUtilities(
    {
      [negativeUtilityName]: createSpaceHandler(true),
    },
    {
      values: fluidValues,
    }
  )
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
  matchUtilities: PluginAPI['matchUtilities']
) {
  // Build the utility name with optional prefix
  const fullUtilityName = resolvedOptions.prefix 
    ? `${resolvedOptions.prefix}${utilityName}`
    : utilityName

  // Create translate utility handler
  const createTranslateHandler = (negate: boolean) => {
    return (value: string, _extra: { modifier: string | null }): CssInJs => {
      // Handle arbitrary values
      const arbitraryValue = parseArbitraryValue(value)
      if (arbitraryValue) {
        const arbitraryParsed = parseFluidString(arbitraryValue)
        if (!arbitraryParsed) return {}
        
        if (resolvedOptions.validateUnits) {
          const validation = validateFluidUnits(
            arbitraryParsed.min, 
            arbitraryParsed.max, 
            resolvedOptions.rootFontSize
          )
          if (!validation.valid) return {}
        }

        const { result } = calculateClampAdvanced(
          arbitraryParsed.min, 
          arbitraryParsed.max, 
          resolvedOptions,
          { negate }
        )
        return {
          [utilityDef.property as string]: result,
          transform: `translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
        }
      }

      const parsed = parseFluidString(value)
      if (!parsed) return {}

      const minResolved = resolveThemeValue(parsed.min, themeValues)
      const maxResolved = resolveThemeValue(parsed.max, themeValues)

      if (!minResolved || !maxResolved) return {}

      if (resolvedOptions.validateUnits) {
        const validation = validateFluidUnits(
          minResolved, 
          maxResolved, 
          resolvedOptions.rootFontSize
        )
        if (!validation.valid) return {}
      }

      const { result: clampValue } = calculateClampAdvanced(
        minResolved, 
        maxResolved, 
        resolvedOptions,
        { negate }
      )

      return {
        [utilityDef.property as string]: clampValue,
        transform: `translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
      }
    }
  }

  // Register positive utility
  matchUtilities(
    {
      [fullUtilityName]: createTranslateHandler(false),
    },
    {
      values: fluidValues,
    }
  )

  // Register negative utility with "neg-" prefix if supported
  if (utilityDef.supportsNegative) {
    const negativeUtilityName = `neg-${fullUtilityName}`
    matchUtilities(
      {
        [negativeUtilityName]: createTranslateHandler(true),
      },
      {
        values: fluidValues,
      }
    )
  }
}

// Export the plugin as default
export default fluidPlugin

// Named export for CommonJS compatibility
export { fluidPlugin }

