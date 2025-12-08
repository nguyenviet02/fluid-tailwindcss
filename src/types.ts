/**
 * Configuration options for the fluid-tailwindcss plugin
 */
export interface FluidOptions {
  /**
   * Minimum viewport width in pixels where fluid scaling starts
   * @default 375
   */
  minViewport?: number

  /**
   * Maximum viewport width in pixels where fluid scaling ends
   * @default 1440
   */
  maxViewport?: number

  /**
   * Whether to use rem units (true) or px units (false)
   * @default true
   */
  useRem?: boolean

  /**
   * Root font size in pixels (used when useRem is true)
   * @default 16
   */
  rootFontSize?: number

  /**
   * Whether to show accessibility warnings for small font sizes
   * @default true
   */
  checkAccessibility?: boolean
}

/**
 * Resolved configuration with all defaults applied
 */
export interface ResolvedFluidOptions {
  minViewport: number
  maxViewport: number
  useRem: boolean
  rootFontSize: number
  checkAccessibility: boolean
}

/**
 * Parsed fluid value containing min and max values
 */
export interface FluidValue {
  min: number
  max: number
  unit: 'rem' | 'px'
}

/**
 * Utility property definition
 */
export interface UtilityDefinition {
  property: string | string[]
  supportsNegative?: boolean
  scale?: 'spacing' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'borderRadius' | 'borderWidth'
}

/**
 * Theme values from Tailwind
 * In Tailwind v4, values can be strings, arrays, or objects
 */
export type ThemeValue = Record<string, unknown>

/**
 * CSS-in-JS style object
 */
export type CssInJs = Record<string, string | Record<string, string>>

/**
 * Plugin API from Tailwind CSS
 */
export interface PluginAPI {
  matchUtilities: (
    utilities: Record<string, (value: string, extra: { modifier: string | null }) => CssInJs | CssInJs[]>,
    options?: {
      values?: Record<string, string>
      type?: string | string[]
      supportsNegativeValues?: boolean
      respectPrefix?: boolean
      respectImportant?: boolean
    }
  ) => void
  theme: (path: string, defaultValue?: unknown) => unknown
  config: (path: string, defaultValue?: unknown) => unknown
}

