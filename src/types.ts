import type { Length } from './length'
import type { FluidError } from './errors'

/**
 * Configuration options for the fluid-tailwindcss plugin
 * Note: Both camelCase and lowercase variants are supported
 * (Prettier may convert camelCase to lowercase in CSS @plugin blocks)
 */
export interface FluidOptions {
  /**
   * Minimum viewport width in pixels where fluid scaling starts
   * @default 375
   */
  minViewport?: number
  /** @deprecated Use minViewport instead. Lowercase variant for Prettier compatibility. */
  minviewport?: number

  /**
   * Maximum viewport width in pixels where fluid scaling ends
   * @default 1440
   */
  maxViewport?: number
  /** @deprecated Use maxViewport instead. Lowercase variant for Prettier compatibility. */
  maxviewport?: number

  /**
   * Whether to use rem units (true) or px units (false)
   * @default true
   */
  useRem?: boolean
  /** @deprecated Use useRem instead. Lowercase variant for Prettier compatibility. */
  userem?: boolean

  /**
   * Root font size in pixels (used when useRem is true)
   * @default 16
   */
  rootFontSize?: number
  /** @deprecated Use rootFontSize instead. Lowercase variant for Prettier compatibility. */
  rootfontsize?: number

  /**
   * Whether to show accessibility warnings for small font sizes
   * @default true
   */
  checkAccessibility?: boolean
  /** @deprecated Use checkAccessibility instead. Lowercase variant for Prettier compatibility. */
  checkaccessibility?: boolean

  /**
   * Custom prefix for fluid utilities (e.g., 'tw-' would make 'tw-fl-p-4/8')
   * @default ''
   */
  prefix?: string

  /**
   * Custom separator for modifiers
   * @default ':'
   */
  separator?: string

  /**
   * Whether to use container query units (cqw) instead of viewport units (vw)
   * @default false
   */
  useContainerQuery?: boolean
  /** @deprecated Use useContainerQuery instead. Lowercase variant for Prettier compatibility. */
  usecontainerquery?: boolean

  /**
   * Whether to add debug comments in CSS output
   * @default false
   */
  debug?: boolean

  /**
   * Whether to validate units before calculation
   * @default true
   */
  validateUnits?: boolean
  /** @deprecated Use validateUnits instead. Lowercase variant for Prettier compatibility. */
  validateunits?: boolean
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
  prefix: string
  separator: string
  useContainerQuery: boolean
  debug: boolean
  validateUnits: boolean
}

/**
 * Per-utility breakpoint configuration
 * Allows customizing breakpoints for individual utilities
 */
export interface PerUtilityBreakpoints {
  minViewport?: number
  maxViewport?: number
}

/**
 * Result of validation operation
 */
export interface ValidationResult {
  valid: boolean
  error?: FluidError
  warning?: string
}

/**
 * Parsed and validated fluid value pair
 */
export interface FluidValuePair {
  min: Length
  max: Length
  minKey: string
  maxKey: string
  minResolved: string
  maxResolved: string
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

/**
 * WCAG SC 1.4.4 check result
 */
export interface SC144CheckResult {
  passes: boolean
  failingViewport?: number
  failingUnit?: string
}

/**
 * Accessibility check result
 */
export interface AccessibilityCheckResult {
  isValid: boolean
  warning?: string
}

