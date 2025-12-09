/**
 * Validation utilities for fluid-tailwindcss
 * Ensures compatibility of values and breakpoints before applying fluid calculations
 */

import { Length } from './length'
import { FluidError } from './errors'
import type { ResolvedFluidOptions, ValidationResult, FluidValuePair } from './types'

/**
 * Supported CSS units for fluid calculations
 * Values must use the same unit for proper interpolation
 */
export const SUPPORTED_UNITS = ['rem', 'px', 'em'] as const
export type SupportedUnit = (typeof SUPPORTED_UNITS)[number]

/**
 * Check if a unit is supported for fluid calculations
 */
export function isSupportedUnit(unit: string | undefined): unit is SupportedUnit {
  return SUPPORTED_UNITS.includes(unit as SupportedUnit)
}

/**
 * Validates that two length values have compatible units
 * @param start - Starting value (Length or string)
 * @param end - Ending value (Length or string)
 * @returns ValidationResult with details
 */
export function validateUnitsMatch(
  start: Length | string,
  end: Length | string
): ValidationResult {
  const startLen = start instanceof Length ? start : Length.parse(start)
  const endLen = end instanceof Length ? end : Length.parse(end)

  if (!startLen) {
    return {
      valid: false,
      error: FluidError.fromCode('invalid-min', String(start)),
    }
  }

  if (!endLen) {
    return {
      valid: false,
      error: FluidError.fromCode('invalid-max', String(end)),
    }
  }

  // Handle zero values - they can adopt any unit
  if (startLen.number === 0 || endLen.number === 0) {
    return { valid: true }
  }

  // Check if units match
  if (startLen.unit !== endLen.unit) {
    return {
      valid: false,
      error: FluidError.fromCode('mismatched-units', startLen.cssText, endLen.cssText),
    }
  }

  // Check if unit is supported
  if (!isSupportedUnit(startLen.unit)) {
    return {
      valid: false,
      error: FluidError.fromCode('unsupported-unit', startLen.unit || 'none'),
    }
  }

  return { valid: true }
}

/**
 * Validates that breakpoints are compatible with values
 * Breakpoints should use the same unit as values for proper calculations
 */
export function validateBreakpointsCompatible(
  value: Length | string,
  minViewport: number,
  maxViewport: number,
  _rootFontSize: number
): ValidationResult {
  const len = value instanceof Length ? value : Length.parse(value)
  
  if (!len) {
    return {
      valid: false,
      error: FluidError.fromCode('invalid-min', String(value)),
    }
  }

  // Convert viewport to the same unit as value for comparison
  // This is informational - we always use rem internally
  const unit = len.unit

  if (!unit) {
    return { valid: true } // Unitless values are handled differently
  }

  // Check for potential issues
  if (minViewport >= maxViewport) {
    return {
      valid: false,
      error: FluidError.fromCode('no-change-bp', `${minViewport}px`),
    }
  }

  return { valid: true }
}

/**
 * Validates that start and end values are different
 */
export function validateValuesAreDifferent(
  start: Length | string,
  end: Length | string
): ValidationResult {
  const startLen = start instanceof Length ? start : Length.parse(start)
  const endLen = end instanceof Length ? end : Length.parse(end)

  if (!startLen || !endLen) {
    return { valid: true } // Will be caught by other validators
  }

  if (startLen.number === endLen.number && startLen.unit === endLen.unit) {
    return {
      valid: false,
      error: FluidError.fromCode('no-change', startLen.cssText),
    }
  }

  return { valid: true }
}

/**
 * Comprehensive validation for fluid value pair
 * Performs all compatibility checks before calculation
 */
export function validateFluidPair(
  minValue: string,
  maxValue: string,
  options: ResolvedFluidOptions
): ValidationResult {
  // Check units match
  const unitsResult = validateUnitsMatch(minValue, maxValue)
  if (!unitsResult.valid) return unitsResult

  // Check values are different
  const diffResult = validateValuesAreDifferent(minValue, maxValue)
  if (!diffResult.valid) return diffResult

  // Check breakpoints compatibility
  const bpResult = validateBreakpointsCompatible(
    minValue,
    options.minViewport,
    options.maxViewport,
    options.rootFontSize
  )
  if (!bpResult.valid) return bpResult

  return { valid: true }
}

/**
 * Parses and validates a fluid value pair from a string like "4/8"
 * Returns validated Length objects or validation error
 */
export function parseAndValidateFluidPair(
  value: string,
  themeValues: Record<string, unknown>,
  options: ResolvedFluidOptions
): FluidValuePair | ValidationResult {
  // Parse the "min/max" format
  const parts = value.split('/')
  if (parts.length !== 2) {
    return {
      valid: false,
      error: FluidError.fromCode('parse-failed', value),
    }
  }

  const [minKey, maxKey] = parts.map(s => s.trim())
  if (!minKey || !maxKey) {
    return {
      valid: false,
      error: FluidError.fromCode('parse-failed', value),
    }
  }

  // Resolve theme values
  const minResolved = resolveValue(minKey, themeValues, options.rootFontSize)
  const maxResolved = resolveValue(maxKey, themeValues, options.rootFontSize)

  if (!minResolved) {
    return {
      valid: false,
      error: FluidError.fromCode('theme-value-not-found', minKey),
    }
  }

  if (!maxResolved) {
    return {
      valid: false,
      error: FluidError.fromCode('theme-value-not-found', maxKey),
    }
  }

  // Validate the pair
  const validation = validateFluidPair(minResolved, maxResolved, options)
  if (!validation.valid) {
    return validation
  }

  return {
    min: Length.parse(minResolved)!,
    max: Length.parse(maxResolved)!,
    minKey,
    maxKey,
    minResolved,
    maxResolved,
  }
}

/**
 * Resolves a value key to actual CSS value
 * Handles theme keys, CSS values, and numeric spacing scale
 */
function resolveValue(
  key: string,
  themeValues: Record<string, unknown>,
  _rootFontSize: number
): string | null {
  // If it's already a CSS value with unit
  const parsed = Length.parse(key)
  if (parsed?.unit) {
    return key
  }

  // Try theme lookup
  const themeValue = themeValues[key]
  if (themeValue !== undefined) {
    // Extract string value from various theme formats
    if (typeof themeValue === 'string') {
      return themeValue
    }
    if (Array.isArray(themeValue) && typeof themeValue[0] === 'string') {
      return themeValue[0]
    }
    if (typeof themeValue === 'object' && themeValue !== null) {
      const obj = themeValue as Record<string, unknown>
      for (const prop of ['fontSize', 'value', 'size']) {
        if (typeof obj[prop] === 'string') {
          return obj[prop] as string
        }
      }
    }
  }

  // Try as numeric spacing scale (1 = 0.25rem, 4 = 1rem)
  if (/^-?\d+(\.\d+)?$/.test(key)) {
    const num = parseFloat(key)
    return `${num * 0.25}rem`
  }

  return null
}

/**
 * Creates a debug comment for CSS output
 * Helps with debugging fluid calculations in DevTools
 */
export function createDebugComment(
  minValue: string,
  maxValue: string,
  minViewport: number,
  maxViewport: number,
  isContainer = false
): string {
  const type = isContainer ? 'container' : 'viewport'
  return `/* fluid from ${minValue} at ${minViewport}px to ${maxValue} at ${maxViewport}px (${type}) */`
}

/**
 * Validates arbitrary value syntax [value]
 */
export function parseArbitraryValue(value: string): string | null {
  const match = value.match(/^\[(.*?)\]$/)
  return match ? match[1] : null
}

/**
 * Check if value is an arbitrary value
 */
export function isArbitraryValue(value: string): boolean {
  return /^\[.*\]$/.test(value)
}

