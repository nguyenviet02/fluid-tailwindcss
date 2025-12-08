import type { ResolvedFluidOptions } from './types'

/**
 * Parses a value string (e.g., "1.5rem", "24px", "4") to a numeric value in rem
 */
export function parseValueToRem(value: string, rootFontSize: number): number {
  // Ensure value is a string
  if (typeof value !== 'string') {
    return 0
  }
  const trimmed = value.trim()

  // Handle rem values
  if (trimmed.endsWith('rem')) {
    return parseFloat(trimmed)
  }

  // Handle px values
  if (trimmed.endsWith('px')) {
    return parseFloat(trimmed) / rootFontSize
  }

  // Handle em values (treat as rem for simplicity)
  if (trimmed.endsWith('em')) {
    return parseFloat(trimmed)
  }

  // Handle unitless values (assume rem based on Tailwind spacing scale)
  const numValue = parseFloat(trimmed)
  if (!Number.isNaN(numValue)) {
    // If it looks like a Tailwind spacing value (0-96), convert from spacing scale
    // Tailwind spacing: 1 = 0.25rem, 4 = 1rem, etc.
    return numValue * 0.25
  }

  return 0
}

/**
 * Parses a value string to pixels
 */
export function parseValueToPx(value: string, rootFontSize: number): number {
  return parseValueToRem(value, rootFontSize) * rootFontSize
}

/**
 * Rounds a number to a specified number of decimal places
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
 * clamp(minRem, minRem + (slope * 100)vw + intercept, maxRem)
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

  // Parse values to rem
  const minRem = parseValueToRem(minValue, rootFontSize)
  const maxRem = parseValueToRem(maxValue, rootFontSize)

  // Convert viewports to rem for calculation
  const minViewportRem = minViewport / rootFontSize
  const maxViewportRem = maxViewport / rootFontSize

  // Calculate slope (change in value per rem of viewport)
  const slope = (maxRem - minRem) / (maxViewportRem - minViewportRem)

  // Calculate y-intercept
  const intercept = minRem - slope * minViewportRem

  // Convert slope to vw units (slope * 100vw)
  const slopeVw = round(slope * 100, 4)

  // Format the clamp value
  const minFormatted = useRem ? `${round(minRem)}rem` : `${round(minRem * rootFontSize)}px`
  const maxFormatted = useRem ? `${round(maxRem)}rem` : `${round(maxRem * rootFontSize)}px`
  const interceptFormatted = useRem
    ? `${round(intercept)}rem`
    : `${round(intercept * rootFontSize)}px`

  // Build the preferred value expression
  // Format: intercept + slope*vw
  let preferred: string
  if (intercept === 0) {
    preferred = `${slopeVw}vw`
  } else if (intercept > 0) {
    preferred = `${interceptFormatted} + ${slopeVw}vw`
  } else {
    preferred = `${Math.abs(round(intercept))}rem - ${Math.abs(slopeVw)}vw`
    // Reformat for negative intercept
    preferred = `${slopeVw}vw - ${useRem ? `${Math.abs(round(intercept))}rem` : `${Math.abs(round(intercept * rootFontSize))}px`}`
    // Actually, let's handle it properly
    const absIntercept = Math.abs(intercept)
    const absInterceptFormatted = useRem
      ? `${round(absIntercept)}rem`
      : `${round(absIntercept * rootFontSize)}px`
    preferred = `${slopeVw}vw - ${absInterceptFormatted}`
  }

  // Handle edge case where min equals max
  if (minRem === maxRem) {
    return minFormatted
  }

  // Handle edge case where slope is effectively 0
  if (Math.abs(slopeVw) < 0.0001) {
    return minFormatted
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

  // For clamp, we need to negate all values and swap min/max
  // clamp(min, pref, max) becomes clamp(-max, -pref, -min)
  return `calc(${clampValue} * -1)`
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

  const minPx = parseValueToPx(minValue, options.rootFontSize)

  // Warn if font size goes below 12px (very small)
  if (minPx < 12) {
    return {
      isValid: false,
      warning: `Fluid typography minimum size (${minPx}px) may be too small for accessibility. Consider using at least 12px for small text or 16px for body text.`,
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
  if (/^-?\d+(\.\d+)?(rem|px|em)$/.test(value)) {
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

