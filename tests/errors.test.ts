import { describe, it, expect } from 'vitest'
import { 
  FluidError, 
  errorCodes, 
  throwError, 
  ok, 
  err,
  type FluidResult 
} from '../src/errors'

describe('errorCodes', () => {
  it('should have message generators for all error codes', () => {
    expect(typeof errorCodes['missing-min']).toBe('function')
    expect(typeof errorCodes['missing-max']).toBe('function')
    expect(typeof errorCodes['mismatched-units']).toBe('function')
    expect(typeof errorCodes['no-change']).toBe('function')
  })

  it('should generate correct error messages', () => {
    expect(errorCodes['missing-min']()).toBe('Missing minimum value')
    expect(errorCodes['missing-max']()).toBe('Missing maximum value')
    expect(errorCodes['mismatched-units']('1rem', '16px')).toBe(
      'Start "1rem" and end "16px" units don\'t match'
    )
    expect(errorCodes['no-change']('1rem')).toBe('Start and end values are both "1rem"')
  })

  it('should generate accessibility error messages', () => {
    expect(errorCodes['fails-sc-144']('1440px')).toBe(
      'Fails WCAG SC 1.4.4 at viewport 1440px'
    )
    expect(errorCodes['font-too-small'](10)).toBe(
      'Font size 10px may be too small for accessibility'
    )
  })
})

describe('FluidError', () => {
  it('should create an error with message', () => {
    const error = new FluidError('Test error')
    expect(error.message).toBe('Test error')
    expect(error.name).toBe('FluidError')
  })

  it('should create an error with code', () => {
    const error = new FluidError('Test error', 'missing-min')
    expect(error.code).toBe('missing-min')
  })

  describe('fromCode', () => {
    it('should create error from code without args', () => {
      const error = FluidError.fromCode('missing-min')
      expect(error.message).toBe('Missing minimum value')
      expect(error.code).toBe('missing-min')
    })

    it('should create error from code with args', () => {
      const error = FluidError.fromCode('mismatched-units', '1rem', '16px')
      expect(error.message).toBe('Start "1rem" and end "16px" units don\'t match')
      expect(error.code).toBe('mismatched-units')
    })

    it('should be an instance of Error', () => {
      const error = FluidError.fromCode('missing-min')
      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(FluidError)
    })
  })
})

describe('throwError', () => {
  it('should throw a FluidError', () => {
    expect(() => throwError('missing-min')).toThrow(FluidError)
    expect(() => throwError('missing-min')).toThrow('Missing minimum value')
  })

  it('should throw with correct message for parameterized errors', () => {
    expect(() => throwError('mismatched-units', '1rem', '16px')).toThrow(
      'Start "1rem" and end "16px" units don\'t match'
    )
  })
})

describe('Result utilities', () => {
  describe('ok', () => {
    it('should create a success result', () => {
      const result: FluidResult<number> = ok(42)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toBe(42)
      }
    })

    it('should work with complex types', () => {
      const result = ok({ foo: 'bar', num: 123 })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.value).toEqual({ foo: 'bar', num: 123 })
      }
    })
  })

  describe('err', () => {
    it('should create a failure result', () => {
      const result: FluidResult<number> = err('missing-min')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(FluidError)
        expect(result.error.message).toBe('Missing minimum value')
      }
    })

    it('should create a failure result with args', () => {
      const result: FluidResult<string> = err('mismatched-units', '1rem', '16px')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.message).toBe('Start "1rem" and end "16px" units don\'t match')
      }
    })
  })

  it('should allow type narrowing', () => {
    const result: FluidResult<number> = ok(42)
    
    if (result.success) {
      // TypeScript should know result.value is number here
      const value: number = result.value
      expect(value).toBe(42)
    } else {
      // TypeScript should know result.error is FluidError here
      const error: FluidError = result.error
      expect(error).toBeDefined()
    }
  })
})

