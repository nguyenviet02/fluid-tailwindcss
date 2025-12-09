import type { ResolvedFluidOptions, PerUtilityBreakpoints, ValidationResult } from './types'
import { Length } from './length'
import { FluidError } from './errors'

/**
 * Cached number formatters for better performance
 * Based on fluid-tailwind's precision handling approach
 */
const formatters: Record<number, Intl.NumberFormat> = {}

/**
 * Formats a number to a specific precision using Intl.NumberFormat
 * This avoids floating-point precision issues and removes trailing zeros
 * 
 * @param num - The number to format
 * @param precision - Maximum decimal places
 * @returns Formatted number string
 */
export function toPrecision(num: number, precision: number): string {
  if (!formatters[precision]) {
    formatters[precision] = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: precision,
      useGrouping: false
    })
  }
  return formatters[precision].format(num)
}

/**
 * Counts the decimal places in a number
 * 
 * @param num - The number to analyze
 * @returns Number of decimal places
 */
export function getPrecision(num: number): number {
  if (Math.floor(num) === num) return 0
  return num.toString().split('.')?.[1]?.length || 0
}

/**
 * Clamps a value between min and max (math utility)
 */
export function clampNumber(min: number, n: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}

/**
 * Parses a value string (e.g., "1.5rem", "24px", "4") to a numeric value in rem
 * @deprecated Use Length class instead for more robust parsing
 */
export function parseValueToRem(value: string, rootFontSize: number): number {
  // Ensure value is a string
  if (typeof value !== 'string') {
    return 0
  }
  
  const length = Length.parse(value)
  if (length) {
    const remLength = length.toRem(rootFontSize)
    if (remLength) return remLength.number
  }
  
  // Fallback: try parsing with spacing scale
  const spacingLength = Length.parseWithSpacingFallback(value, rootFontSize)
  if (spacingLength) {
    const remLength = spacingLength.toRem(rootFontSize)
    if (remLength) return remLength.number
  }

  return 0
}

/**
 * Parses a value string to pixels
 * @deprecated Use Length class instead for more robust parsing
 */
export function parseValueToPx(value: string, rootFontSize: number): number {
  return parseValueToRem(value, rootFontSize) * rootFontSize
}

/**
 * Rounds a number to a specified number of decimal places
 * @deprecated Use toPrecision for better floating-point handling
 */
export function round(value: number, decimals: number = 4): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Calculates the clamp() CSS function value for fluid typography/spacing
 *
 * Formula:
 * clamp(minValue, preferredValue, maxValue)
 * where preferredValue = minValue + (maxValue - minValue) * (100vw - minViewport) / (maxViewport - minViewport)
 *
 * Simplified:
 * clamp(minRem, intercept + slope * 100vw, maxRem)
 * where:
 *   slope = (maxRem - minRem) / (maxViewport - minViewport)
 *   intercept = minRem - slope * minViewport
 */
export function calculateClamp(
  minValue: string,
  maxValue: string,
  options: ResolvedFluidOptions
): string {
  const { minViewport, maxViewport, rootFontSize, useRem } = options

  // Parse values using Length class with spacing fallback
  let start = Length.parse(minValue)
  let end = Length.parse(maxValue)
  
  // Try spacing fallback if standard parsing fails
  if (!start) {
    start = Length.parseWithSpacingFallback(minValue, rootFontSize)
  }
  if (!end) {
    end = Length.parseWithSpacingFallback(maxValue, rootFontSize)
  }
  
  // Return empty if parsing fails
  if (!start || !end) return ''

  // Convert to rem for calculations
  const startRem = start.toRem(rootFontSize)
  const endRem = end.toRem(rootFontSize)
  
  if (!startRem || !endRem) return ''

  const minRem = startRem.number
  const maxRem = endRem.number

  // Handle zero values - inherit unit from other value
  if (start.number === 0 && !start.unit) {
    start = new Length(0, end.unit)
  } else if (end.number === 0 && !end.unit) {
    end = new Length(0, start.unit)
  }

  // Convert viewports to rem for calculation
  const minViewportRem = minViewport / rootFontSize
  const maxViewportRem = maxViewport / rootFontSize

  // Handle edge case where min equals max
  if (minRem === maxRem) {
    return useRem ? `${toPrecision(minRem, 4)}rem` : `${toPrecision(minRem * rootFontSize, 4)}px`
  }

  // Calculate precision from max of all input precisions (minimum 2)
  const precision = Math.max(
    getPrecision(minRem),
    getPrecision(maxRem),
    getPrecision(minViewportRem),
    getPrecision(maxViewportRem),
    2
  )

  // Calculate slope (change in value per rem of viewport)
  const slope = (maxRem - minRem) / (maxViewportRem - minViewportRem)

  // Calculate y-intercept
  const intercept = minRem - slope * minViewportRem

  // Handle edge case where slope is effectively 0
  if (Math.abs(slope) < 0.0001) {
    return useRem ? `${toPrecision(minRem, precision)}rem` : `${toPrecision(minRem * rootFontSize, precision)}px`
  }

  // Convert slope to vw units (slope * 100vw)
  const slopeVw = slope * 100

  // Ensure min < max for valid CSS clamp (CSS requires min <= max)
  const clampMin = Math.min(minRem, maxRem)
  const clampMax = Math.max(minRem, maxRem)

  // Format values
  const minFormatted = useRem 
    ? `${toPrecision(clampMin, precision)}rem` 
    : `${toPrecision(clampMin * rootFontSize, precision)}px`
  const maxFormatted = useRem 
    ? `${toPrecision(clampMax, precision)}rem` 
    : `${toPrecision(clampMax * rootFontSize, precision)}px`

  // Build the preferred value expression
  // Format: intercept + slope*vw or slope*vw - |intercept|
  const interceptFormatted = useRem
    ? `${toPrecision(Math.abs(intercept), precision)}rem`
    : `${toPrecision(Math.abs(intercept * rootFontSize), precision)}px`
  const slopeFormatted = toPrecision(slopeVw, precision)

  let preferred: string
  if (intercept === 0) {
    preferred = `${slopeFormatted}vw`
  } else if (intercept > 0) {
    preferred = `${interceptFormatted} + ${slopeFormatted}vw`
  } else {
    // Negative intercept: slope*vw - |intercept|
    preferred = `${slopeFormatted}vw - ${interceptFormatted}`
  }

  return `clamp(${minFormatted}, ${preferred}, ${maxFormatted})`
}

/**
 * Calculates clamp for negative values (used for negative margins, etc.)
 */
export function calculateNegativeClamp(
  minValue: string,
  maxValue: string,
  options: ResolvedFluidOptions
): string {
  const clampValue = calculateClamp(minValue, maxValue, options)

  // If it's a simple value (no clamp), just negate it
  if (!clampValue.startsWith('clamp(')) {
    return `-${clampValue}`
  }

  // For clamp, we need to negate using calc()
  // clamp(min, pref, max) becomes calc(clamp(...) * -1)
  return `calc(${clampValue} * -1)`
}

/**
 * WCAG SC 1.4.4 compliance check
 * Verifies that text can be zoomed to 200% without loss of content
 * 
 * @param startNum - Starting font size in rem
 * @param endNum - Ending font size in rem
 * @param startBP - Starting breakpoint in rem
 * @param endBP - Ending breakpoint in rem
 * @param slope - Calculated slope value
 * @param intercept - Calculated intercept value
 * @returns Object with pass status and optional failing viewport
 */
export function checkSC144(
  startNum: number,
  endNum: number,
  startBP: number,
  endBP: number,
  slope: number,
  intercept: number
): { passes: boolean; failingViewport?: number; failingUnit?: string } {
  // SC 1.4.4 requires text resizable up to 200% without loss
  // At 500% zoom, the effective font size should be >= 2x the font size at 100% zoom
  
  const zoom1 = (vw: number) => clampNumber(startNum, intercept + slope * vw, endNum)
  const zoom5 = (vw: number) => clampNumber(5 * startNum, 5 * intercept + slope * vw, 5 * endNum)

  // Check the clamped points on the lines 2*z1(vw) and zoom5(vw)
  // Fail if zoom5 < 2*zoom1
  if (5 * startNum < 2 * zoom1(5 * startBP)) {
    return { passes: false, failingViewport: startBP * 5, failingUnit: 'rem' }
  }
  if (zoom5(endBP) < 2 * endNum) {
    return { passes: false, failingViewport: endBP, failingUnit: 'rem' }
  }

  return { passes: true }
}

/**
 * Validates that typography values meet WCAG accessibility requirements
 * WCAG 1.4.4 requires text to be resizable up to 200% without loss of content
 * Generally, minimum readable font size is considered 16px (1rem)
 */
export function checkAccessibility(
  minValue: string,
  options: ResolvedFluidOptions,
  utilityType: 'text' | 'other'
): { isValid: boolean; warning?: string } {
  if (!options.checkAccessibility || utilityType !== 'text') {
    return { isValid: true }
  }

  const minLength = Length.parse(minValue)
  if (!minLength) return { isValid: true }
  
  const minPx = minLength.toPx(options.rootFontSize)
  if (!minPx) return { isValid: true }

  // Warn if font size goes below 12px (very small)
  if (minPx.number < 12) {
    return {
      isValid: false,
      warning: `Fluid typography minimum size (${minPx.number}px) may be too small for accessibility. Consider using at least 12px for small text or 16px for body text.`,
    }
  }

  return { isValid: true }
}

/**
 * Parses a fluid value string like "4/8" or "base/2xl" into min and max parts
 */
export function parseFluidString(value: string): { min: string; max: string } | null {
  // Ensure value is a string
  if (typeof value !== 'string') {
    return null
  }

  // Split by "/" - the value should be in format "min/max"
  const parts = value.split('/')

  if (parts.length !== 2) {
    return null
  }

  const [min, max] = parts

  if (!min || !max) {
    return null
  }

  return { min: min.trim(), max: max.trim() }
}

/**
 * Extracts a string value from a Tailwind theme value
 * Handles both string values and object values (like fontSize in Tailwind v4)
 */
function extractStringValue(value: unknown): string | null {
  if (typeof value === 'string') {
    return value
  }

  // Handle array format [fontSize, lineHeight] or [fontSize, { lineHeight, letterSpacing }]
  if (Array.isArray(value) && value.length > 0) {
    const firstValue = value[0]
    if (typeof firstValue === 'string') {
      return firstValue
    }
  }

  // Handle object format { fontSize: '1rem', lineHeight: '1.5' }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    // Check common property names
    for (const key of ['fontSize', 'value', 'size']) {
      if (typeof obj[key] === 'string') {
        return obj[key] as string
      }
    }
  }

  return null
}

/**
 * Resolves Tailwind theme values to actual CSS values
 */
export function resolveThemeValue(
  value: string,
  themeValues: Record<string, unknown>
): string | null {
  // Ensure value is a string
  if (typeof value !== 'string') {
    return null
  }

  // If value is already a CSS value (has unit), return as-is
  if (Length.parse(value)?.unit) {
    return value
  }

  // Try to resolve from theme
  const resolved = themeValues[value]
  if (resolved !== undefined) {
    const extracted = extractStringValue(resolved)
    if (extracted) {
      return extracted
    }
  }

  // If it's a numeric value without unit, treat as Tailwind spacing scale
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const num = parseFloat(value)
    return `${num * 0.25}rem`
  }

  return null
}

/**
 * Advanced clamp calculation with additional features:
 * - Per-utility custom breakpoints
 * - Container query support (cqw)
 * - Debug comments
 * - Unit validation
 */
export function calculateClampAdvanced(
  minValue: string,
  maxValue: string,
  options: ResolvedFluidOptions,
  overrides?: PerUtilityBreakpoints & { 
    negate?: boolean
    useContainerQuery?: boolean 
  }
): { result: string; validation: ValidationResult } {
  const { rootFontSize, useRem, debug } = options
  const minViewport = overrides?.minViewport ?? options.minViewport
  const maxViewport = overrides?.maxViewport ?? options.maxViewport
  const useContainerQuery = overrides?.useContainerQuery ?? options.useContainerQuery
  const negate = overrides?.negate ?? false

  // Parse values using Length class with spacing fallback
  let start = Length.parse(minValue) ?? Length.parseWithSpacingFallback(minValue, rootFontSize)
  let end = Length.parse(maxValue) ?? Length.parseWithSpacingFallback(maxValue, rootFontSize)

  // Return validation error if parsing fails
  if (!start) {
    return {
      result: '',
      validation: {
        valid: false,
        error: FluidError.fromCode('invalid-min', minValue),
      },
    }
  }

  if (!end) {
    return {
      result: '',
      validation: {
        valid: false,
        error: FluidError.fromCode('invalid-max', maxValue),
      },
    }
  }

  // Handle zero values - inherit unit from other value
  if (start.number === 0 && !start.unit) {
    start = new Length(0, end.unit)
  } else if (end.number === 0 && !end.unit) {
    end = new Length(0, start.unit)
  }

  // Validate units match (if not zero)
  if (options.validateUnits && start.number !== 0 && end.number !== 0) {
    if (start.unit !== end.unit) {
      return {
        result: '',
        validation: {
          valid: false,
          error: FluidError.fromCode('mismatched-units', start.cssText, end.cssText),
        },
      }
    }
  }

  // Convert to rem for calculations
  const startRem = start.toRem(rootFontSize)
  const endRem = end.toRem(rootFontSize)

  if (!startRem || !endRem) {
    return {
      result: '',
      validation: {
        valid: false,
        error: FluidError.fromCode('unsupported-unit', start.unit || end.unit || 'unknown'),
      },
    }
  }

  let minRem = startRem.number
  let maxRem = endRem.number

  // Apply negation if requested
  if (negate) {
    minRem *= -1
    maxRem *= -1
  }

  // Convert viewports to rem for calculation
  const minViewportRem = minViewport / rootFontSize
  const maxViewportRem = maxViewport / rootFontSize

  // Handle edge case where values are equal
  if (minRem === maxRem) {
    const value = useRem 
      ? `${toPrecision(minRem, 4)}rem` 
      : `${toPrecision(minRem * rootFontSize, 4)}px`
    return {
      result: value,
      validation: {
        valid: true,
        warning: `Start and end values are equal (${value})`,
      },
    }
  }

  // Validate breakpoints
  if (minViewportRem === maxViewportRem) {
    return {
      result: '',
      validation: {
        valid: false,
        error: FluidError.fromCode('no-change-bp', `${minViewport}px`),
      },
    }
  }

  // Calculate precision from max of all input precisions (minimum 2)
  const precision = Math.max(
    getPrecision(minRem),
    getPrecision(maxRem),
    getPrecision(minViewportRem),
    getPrecision(maxViewportRem),
    2
  )

  // Calculate slope and intercept
  const slope = (maxRem - minRem) / (maxViewportRem - minViewportRem)
  const intercept = minRem - slope * minViewportRem

  // Handle edge case where slope is effectively 0
  if (Math.abs(slope) < 0.0001) {
    const value = useRem 
      ? `${toPrecision(minRem, precision)}rem` 
      : `${toPrecision(minRem * rootFontSize, precision)}px`
    return {
      result: value,
      validation: { valid: true },
    }
  }

  // Calculate slope in vw/cqw units
  const slopeVw = slope * 100
  const viewportUnit = useContainerQuery ? 'cqw' : 'vw'

  // Ensure min < max for valid CSS clamp
  const clampMin = Math.min(minRem, maxRem)
  const clampMax = Math.max(minRem, maxRem)

  // Format values
  const minFormatted = useRem
    ? `${toPrecision(clampMin, precision)}rem`
    : `${toPrecision(clampMin * rootFontSize, precision)}px`
  const maxFormatted = useRem
    ? `${toPrecision(clampMax, precision)}rem`
    : `${toPrecision(clampMax * rootFontSize, precision)}px`

  // Build the preferred value expression
  const interceptFormatted = useRem
    ? `${toPrecision(Math.abs(intercept), precision)}rem`
    : `${toPrecision(Math.abs(intercept * rootFontSize), precision)}px`
  const slopeFormatted = toPrecision(slopeVw, precision)

  let preferred: string
  if (intercept === 0) {
    preferred = `${slopeFormatted}${viewportUnit}`
  } else if (intercept > 0) {
    preferred = `${interceptFormatted} + ${slopeFormatted}${viewportUnit}`
  } else {
    preferred = `${slopeFormatted}${viewportUnit} - ${interceptFormatted}`
  }

  let result = `clamp(${minFormatted}, ${preferred}, ${maxFormatted})`

  // Add debug comment if enabled
  if (debug) {
    const debugComment = `/* fluid from ${start.cssText} at ${minViewport}px to ${end.cssText} at ${maxViewport}px${useContainerQuery ? ' (container)' : ''} */`
    result = `${result} ${debugComment}`
  }

  return {
    result,
    validation: { valid: true },
  }
}

/**
 * Validates that start and end values have matching units
 * Returns detailed validation result
 */
export function validateFluidUnits(
  minValue: string,
  maxValue: string,
  rootFontSize = 16
): ValidationResult {
  const start = Length.parse(minValue) ?? Length.parseWithSpacingFallback(minValue, rootFontSize)
  const end = Length.parse(maxValue) ?? Length.parseWithSpacingFallback(maxValue, rootFontSize)

  if (!start) {
    return {
      valid: false,
      error: FluidError.fromCode('invalid-min', minValue),
    }
  }

  if (!end) {
    return {
      valid: false,
      error: FluidError.fromCode('invalid-max', maxValue),
    }
  }

  // Zero values can adopt any unit
  if (start.number === 0 || end.number === 0) {
    return { valid: true }
  }

  // Units must match
  if (start.unit !== end.unit) {
    return {
      valid: false,
      error: FluidError.fromCode('mismatched-units', start.cssText, end.cssText),
    }
  }

  // Values must be different
  if (start.number === end.number) {
    return {
      valid: false,
      error: FluidError.fromCode('no-change', start.cssText),
    }
  }

  return { valid: true }
}

/**
 * Creates a clamp value with negation
 * Properly handles the negation of fluid clamp values
 */
export function createNegatedClamp(
  minValue: string,
  maxValue: string,
  options: ResolvedFluidOptions,
  overrides?: PerUtilityBreakpoints
): string {
  const { result } = calculateClampAdvanced(minValue, maxValue, options, {
    ...overrides,
    negate: true,
  })
  return result
}

/**
 * Creates a container-query-based clamp value
 * Uses cqw units instead of vw for container-relative sizing
 */
export function createContainerClamp(
  minValue: string,
  maxValue: string,
  options: ResolvedFluidOptions,
  overrides?: PerUtilityBreakpoints
): string {
  const { result } = calculateClampAdvanced(minValue, maxValue, options, {
    ...overrides,
    useContainerQuery: true,
  })
  return result
}
