/**
 * Type-safe error handling for fluid-tailwindcss
 * Based on fluid-tailwind's error handling approach
 */

/**
 * Error codes with their message generator functions
 * Each key is an error code, and the value is a function that returns the error message
 */
export const errorCodes = {
  // Value parsing errors
  'missing-min': () => 'Missing minimum value',
  'missing-max': () => 'Missing maximum value',
  'invalid-min': (value: string) => `Invalid minimum value: "${value}"`,
  'invalid-max': (value: string) => `Invalid maximum value: "${value}"`,
  
  // Unit errors
  'mismatched-units': (start: string, end: string) =>
    `Start "${start}" and end "${end}" units don't match`,
  'unsupported-unit': (unit: string) =>
    `Unsupported unit "${unit}" - use rem, px, or em`,
  
  // Value validation errors
  'no-change': (value: string) =>
    `Start and end values are both "${value}"`,
  'invalid-viewport': (viewport: string) =>
    `Invalid viewport value: "${viewport}"`,
  
  // Breakpoint errors
  'mismatched-bp-units': (start: string, end: string) =>
    `Start breakpoint "${start}" and end breakpoint "${end}" units don't match`,
  'no-change-bp': (value: string) =>
    `Start and end breakpoints are both "${value}"`,
  'mismatched-bp-val-units': () =>
    `Breakpoint and value units don't match`,
  
  // Accessibility errors
  'fails-sc-144': (failingViewport: string) =>
    `Fails WCAG SC 1.4.4 at viewport ${failingViewport}`,
  'font-too-small': (minPx: number) =>
    `Font size ${minPx}px may be too small for accessibility`,
  
  // Theme errors
  'theme-value-not-found': (key: string) =>
    `Could not find theme value "${key}"`,
  
  // General errors
  'parse-failed': (value: string) =>
    `Failed to parse fluid value: "${value}"`,
} satisfies Record<string, (...args: never[]) => string>

/**
 * Type for error code keys
 */
export type ErrorCode = keyof typeof errorCodes

/**
 * Custom error class for fluid-tailwindcss errors
 * Provides type-safe error creation from error codes
 */
export class FluidError extends Error {
  override name = 'FluidError'
  
  /**
   * The error code associated with this error
   */
  readonly code?: ErrorCode
  
  constructor(message: string, code?: ErrorCode) {
    super(message)
    this.code = code
  }

  /**
   * Creates a FluidError from an error code with type-safe arguments
   * 
   * @param code - The error code
   * @param args - Arguments required by the error message generator
   * @returns A new FluidError instance
   */
  static fromCode<C extends ErrorCode>(
    code: C,
    ...args: Parameters<(typeof errorCodes)[C]>
  ): FluidError {
    const fn = errorCodes[code] as (...args: unknown[]) => string
    const message = fn(...args)
    return new this(message, code)
  }
}

/**
 * Throws a FluidError from an error code
 * 
 * @param code - The error code
 * @param args - Arguments required by the error message generator
 * @throws FluidError
 */
export function throwError<C extends ErrorCode>(
  code: C,
  ...args: Parameters<(typeof errorCodes)[C]>
): never {
  throw FluidError.fromCode(code, ...args)
}

/**
 * Result type for operations that may fail
 * Similar to Rust's Result type
 */
export type FluidResult<T> = 
  | { success: true; value: T }
  | { success: false; error: FluidError }

/**
 * Creates a successful result
 */
export function ok<T>(value: T): FluidResult<T> {
  return { success: true, value }
}

/**
 * Creates a failed result from an error code
 */
export function err<T, C extends ErrorCode>(
  code: C,
  ...args: Parameters<(typeof errorCodes)[C]>
): FluidResult<T> {
  return { success: false, error: FluidError.fromCode(code, ...args) }
}

