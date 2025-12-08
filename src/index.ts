import plugin from 'tailwindcss/plugin'
import type { FluidOptions, ResolvedFluidOptions, CssInJs, PluginAPI } from './types'
import {
  calculateClamp,
  parseFluidString,
  resolveThemeValue,
  checkAccessibility,
} from './clamp'
import { fluidUtilities, getThemePath, getDefaultScale } from './utilities'

// Re-export types for consumers
export type { FluidOptions, ResolvedFluidOptions, FluidValue, UtilityDefinition, CssInJs } from './types'
export { calculateClamp, parseFluidString, resolveThemeValue } from './clamp'
export { fluidUtilities, getDefaultScale } from './utilities'

/**
 * Default plugin options
 */
const defaultOptions: ResolvedFluidOptions = {
  minViewport: 375,
  maxViewport: 1440,
  useRem: true,
  rootFontSize: 16,
  checkAccessibility: true,
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
 * The main tailwind-fluid plugin
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

        // Register the utility with matchUtilities
        // Note: supportsNegativeValues handles negative values automatically in Tailwind v4
        // e.g., -fl-m-4/8 will work when supportsNegativeValues is true
        matchUtilities(
          {
            [utilityName]: (value: string, _extra: { modifier: string | null }): CssInJs => {
              const parsed = parseFluidString(value)
              if (!parsed) return {}

              // Resolve theme values
              const minResolved = resolveThemeValue(parsed.min, themeValues)
              const maxResolved = resolveThemeValue(parsed.max, themeValues)

              if (!minResolved || !maxResolved) return {}

              // Check accessibility for typography
              if (utilityName === 'fl-text') {
                const { warning } = checkAccessibility(minResolved, resolvedOptions, 'text')
                if (warning) {
                  console.warn(`[tailwind-fluid] ${warning}`)
                }
              }

              // Calculate the clamp value
              const clampValue = calculateClamp(minResolved, maxResolved, resolvedOptions)

              // Create the CSS declaration
              return createFluidDeclaration(utilityDef.property, clampValue)
            },
          },
          {
            values: fluidValues,
            supportsNegativeValues: utilityDef.supportsNegative ?? false,
          }
        )
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

  matchUtilities(
    {
      [utilityName]: (value: string, _extra: { modifier: string | null }): CssInJs => {
        const parsed = parseFluidString(value)
        if (!parsed) return {}

        const minResolved = resolveThemeValue(parsed.min, themeValues)
        const maxResolved = resolveThemeValue(parsed.max, themeValues)

        if (!minResolved || !maxResolved) return {}

        const clampValue = calculateClamp(minResolved, maxResolved, resolvedOptions)

        return {
          '& > :not([hidden]) ~ :not([hidden])': {
            [marginProp]: clampValue,
          },
        }
      },
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
  matchUtilities(
    {
      [utilityName]: (value: string, _extra: { modifier: string | null }): CssInJs => {
        const parsed = parseFluidString(value)
        if (!parsed) return {}

        const minResolved = resolveThemeValue(parsed.min, themeValues)
        const maxResolved = resolveThemeValue(parsed.max, themeValues)

        if (!minResolved || !maxResolved) return {}

        const clampValue = calculateClamp(minResolved, maxResolved, resolvedOptions)

        return {
          [utilityDef.property as string]: clampValue,
          transform: `translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
        }
      },
    },
    {
      values: fluidValues,
      supportsNegativeValues: utilityDef.supportsNegative ?? false,
    }
  )
}

// Export the plugin as default
export default fluidPlugin

// Named export for CommonJS compatibility
export { fluidPlugin }

