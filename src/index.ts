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
 * Resolves user options with defaults
 */
function resolveOptions(options: FluidOptions = {}): ResolvedFluidOptions {
  return {
    ...defaultOptions,
    ...options,
  }
}

/**
 * Generates fluid utility values by combining all theme values
 * Format: "minValue/maxValue" pairs like "4/8" or "base/2xl"
 */
function generateFluidValues(
  scaleValues: Record<string, unknown>
): Record<string, string> {
  const values: Record<string, string> = {}

  // Generate all possible min/max combinations
  const keys = Object.keys(scaleValues)

  for (const minKey of keys) {
    for (const maxKey of keys) {
      // Skip if min equals max
      if (minKey === maxKey) continue

      // Skip DEFAULT key in combinations (use it directly if needed)
      if (minKey === 'DEFAULT' || maxKey === 'DEFAULT') continue

      // Skip combinations that don't make sense (like 'none' for border-radius)
      if (minKey === 'none' || maxKey === 'none') continue
      if (minKey === 'full' || maxKey === 'full') continue

      // Create the fluid value key
      const fluidKey = `${minKey}/${maxKey}`
      values[fluidKey] = fluidKey
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
        
        // Generate fluid value combinations
        const fluidValues = generateFluidValues(themeValues)

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
            if (resolvedOptions.validateUnits) {
              const validation = validateFluidUnits(
                minResolved, 
                maxResolved, 
                resolvedOptions.rootFontSize
              )
              if (!validation.valid) {
                console.warn(`[fluid-tailwindcss] ${validation.error?.message}`)
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

