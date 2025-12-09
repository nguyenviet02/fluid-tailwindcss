import { describe, it, expect } from 'vitest'
import {
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
} from '../src/validation'
import { Length } from '../src/length'
import type { ResolvedFluidOptions } from '../src/types'

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

describe('isSupportedUnit', () => {
  it('should return true for supported units', () => {
    expect(isSupportedUnit('rem')).toBe(true)
    expect(isSupportedUnit('px')).toBe(true)
    expect(isSupportedUnit('em')).toBe(true)
  })

  it('should return false for unsupported units', () => {
    expect(isSupportedUnit('vw')).toBe(false)
    expect(isSupportedUnit('vh')).toBe(false)
    expect(isSupportedUnit('%')).toBe(false)
    expect(isSupportedUnit(undefined)).toBe(false)
  })
})

describe('SUPPORTED_UNITS', () => {
  it('should contain the standard units', () => {
    expect(SUPPORTED_UNITS).toContain('rem')
    expect(SUPPORTED_UNITS).toContain('px')
    expect(SUPPORTED_UNITS).toContain('em')
    expect(SUPPORTED_UNITS).toHaveLength(3)
  })
})

describe('validateUnitsMatch', () => {
  it('should validate matching units', () => {
    const result = validateUnitsMatch('1rem', '2rem')
    expect(result.valid).toBe(true)
  })

  it('should validate matching px units', () => {
    const result = validateUnitsMatch('16px', '32px')
    expect(result.valid).toBe(true)
  })

  it('should fail for mismatched units', () => {
    const result = validateUnitsMatch('1rem', '16px')
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('mismatched-units')
  })

  it('should allow zero values with any unit', () => {
    const result1 = validateUnitsMatch('0', '2rem')
    expect(result1.valid).toBe(true)

    const result2 = validateUnitsMatch('1rem', '0')
    expect(result2.valid).toBe(true)
  })

  it('should validate Length objects', () => {
    const start = new Length(1, 'rem')
    const end = new Length(2, 'rem')
    const result = validateUnitsMatch(start, end)
    expect(result.valid).toBe(true)
  })

  it('should fail for invalid start value', () => {
    const result = validateUnitsMatch('invalid', '2rem')
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('invalid-min')
  })

  it('should fail for invalid end value', () => {
    const result = validateUnitsMatch('1rem', 'invalid')
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('invalid-max')
  })

  it('should fail for unsupported units', () => {
    const result = validateUnitsMatch('10vw', '20vw')
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('unsupported-unit')
  })
})

describe('validateBreakpointsCompatible', () => {
  it('should validate valid breakpoint range', () => {
    const result = validateBreakpointsCompatible('1rem', 375, 1440, 16)
    expect(result.valid).toBe(true)
  })

  it('should fail when min equals max viewport', () => {
    const result = validateBreakpointsCompatible('1rem', 1440, 1440, 16)
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('no-change-bp')
  })

  it('should fail when min > max viewport', () => {
    const result = validateBreakpointsCompatible('1rem', 1440, 375, 16)
    expect(result.valid).toBe(false)
  })
})

describe('validateValuesAreDifferent', () => {
  it('should pass for different values', () => {
    const result = validateValuesAreDifferent('1rem', '2rem')
    expect(result.valid).toBe(true)
  })

  it('should fail for same values', () => {
    const result = validateValuesAreDifferent('1rem', '1rem')
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('no-change')
  })

  it('should pass for same number different units', () => {
    // This case would fail at validateUnitsMatch, not here
    const result = validateValuesAreDifferent('1rem', '1px')
    expect(result.valid).toBe(true)
  })
})

describe('validateFluidPair', () => {
  it('should validate a complete fluid pair', () => {
    const result = validateFluidPair('1rem', '2rem', defaultOptions)
    expect(result.valid).toBe(true)
  })

  it('should fail for mismatched units', () => {
    const result = validateFluidPair('1rem', '32px', defaultOptions)
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('mismatched-units')
  })

  it('should fail for same values', () => {
    const result = validateFluidPair('1rem', '1rem', defaultOptions)
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('no-change')
  })
})

describe('parseAndValidateFluidPair', () => {
  const themeValues = {
    '4': '1rem',
    '8': '2rem',
    'base': '1rem',
    '2xl': '1.5rem',
  }

  it('should parse and validate valid theme keys', () => {
    const result = parseAndValidateFluidPair('4/8', themeValues, defaultOptions)
    
    if ('valid' in result) {
      expect.fail('Should not return validation result')
    } else {
      expect(result.min).toBeDefined()
      expect(result.max).toBeDefined()
      expect(result.minKey).toBe('4')
      expect(result.maxKey).toBe('8')
    }
  })

  it('should handle CSS values directly', () => {
    const result = parseAndValidateFluidPair('1rem/2rem', themeValues, defaultOptions)
    
    if ('valid' in result) {
      expect.fail('Should not return validation result')
    } else {
      expect(result.minResolved).toBe('1rem')
      expect(result.maxResolved).toBe('2rem')
    }
  })

  it('should fail for invalid format', () => {
    const result = parseAndValidateFluidPair('4', themeValues, defaultOptions)
    
    if ('valid' in result) {
      expect(result.valid).toBe(false)
      expect(result.error?.code).toBe('parse-failed')
    } else {
      expect.fail('Should return validation error')
    }
  })

  it('should fail for unknown theme key', () => {
    const result = parseAndValidateFluidPair('unknown/8', themeValues, defaultOptions)
    
    if ('valid' in result) {
      expect(result.valid).toBe(false)
      expect(result.error?.code).toBe('theme-value-not-found')
    } else {
      expect.fail('Should return validation error')
    }
  })
})

describe('isArbitraryValue', () => {
  it('should detect arbitrary values', () => {
    expect(isArbitraryValue('[1rem/2rem]')).toBe(true)
    expect(isArbitraryValue('[16px/32px]')).toBe(true)
  })

  it('should return false for non-arbitrary values', () => {
    expect(isArbitraryValue('4/8')).toBe(false)
    expect(isArbitraryValue('base/2xl')).toBe(false)
    expect(isArbitraryValue('1rem')).toBe(false)
  })
})

describe('parseArbitraryValue', () => {
  it('should extract value from brackets', () => {
    expect(parseArbitraryValue('[1rem/2rem]')).toBe('1rem/2rem')
    expect(parseArbitraryValue('[16px/32px]')).toBe('16px/32px')
  })

  it('should return null for non-arbitrary values', () => {
    expect(parseArbitraryValue('4/8')).toBeNull()
    expect(parseArbitraryValue('1rem')).toBeNull()
  })
})

describe('createDebugComment', () => {
  it('should create viewport debug comment', () => {
    const comment = createDebugComment('1rem', '2rem', 375, 1440)
    expect(comment).toContain('fluid from 1rem')
    expect(comment).toContain('to 2rem')
    expect(comment).toContain('375px')
    expect(comment).toContain('1440px')
    expect(comment).toContain('viewport')
  })

  it('should create container debug comment', () => {
    const comment = createDebugComment('1rem', '2rem', 375, 1440, true)
    expect(comment).toContain('container')
  })
})

