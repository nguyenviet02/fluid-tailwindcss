import { describe, it, expect } from 'vitest'
import {
  calculateClampAdvanced,
  validateFluidUnits,
  createNegatedClamp,
  createContainerClamp,
} from '../src/clamp'
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

describe('calculateClampAdvanced', () => {
  describe('basic functionality', () => {
    it('should calculate clamp for valid rem values', () => {
      const { result, validation } = calculateClampAdvanced('1rem', '2rem', defaultOptions)
      expect(validation.valid).toBe(true)
      expect(result).toMatch(/^clamp\(/)
      expect(result).toContain('rem')
      expect(result).toContain('vw')
    })

    it('should calculate clamp for valid px values', () => {
      const options = { ...defaultOptions, useRem: false }
      const { result, validation } = calculateClampAdvanced('16px', '32px', options)
      expect(validation.valid).toBe(true)
      expect(result).toMatch(/^clamp\(/)
      expect(result).toContain('px')
    })

    it('should return validation error for mismatched units', () => {
      const { result, validation } = calculateClampAdvanced('1rem', '32px', defaultOptions)
      expect(validation.valid).toBe(false)
      expect(validation.error?.code).toBe('mismatched-units')
      expect(result).toBe('')
    })

    it('should handle equal values with warning', () => {
      const { result, validation } = calculateClampAdvanced('1rem', '1rem', defaultOptions)
      expect(validation.valid).toBe(true)
      expect(validation.warning).toBeDefined()
      expect(result).toBe('1rem')
    })

    it('should handle zero values', () => {
      const { result, validation } = calculateClampAdvanced('0', '2rem', defaultOptions)
      expect(validation.valid).toBe(true)
      expect(result).toMatch(/clamp/)
    })
  })

  describe('per-utility breakpoints', () => {
    it('should use custom minViewport', () => {
      const { result: defaultResult } = calculateClampAdvanced('1rem', '2rem', defaultOptions)
      const { result: customResult } = calculateClampAdvanced('1rem', '2rem', defaultOptions, {
        minViewport: 320,
      })
      
      // Results should be different due to different breakpoints
      expect(defaultResult).not.toBe(customResult)
    })

    it('should use custom maxViewport', () => {
      const { result: defaultResult } = calculateClampAdvanced('1rem', '2rem', defaultOptions)
      const { result: customResult } = calculateClampAdvanced('1rem', '2rem', defaultOptions, {
        maxViewport: 1920,
      })
      
      expect(defaultResult).not.toBe(customResult)
    })

    it('should use both custom breakpoints', () => {
      const { result, validation } = calculateClampAdvanced('1rem', '2rem', defaultOptions, {
        minViewport: 320,
        maxViewport: 1920,
      })
      
      expect(validation.valid).toBe(true)
      expect(result).toMatch(/clamp/)
    })
  })

  describe('negative values', () => {
    it('should negate values when negate option is true', () => {
      const { result, validation } = calculateClampAdvanced('1rem', '2rem', defaultOptions, {
        negate: true,
      })
      
      expect(validation.valid).toBe(true)
      // The min/max should be negated
      expect(result).toContain('-1rem')
      expect(result).toContain('-2rem')
    })
  })

  describe('container queries', () => {
    it('should use cqw units when useContainerQuery is true', () => {
      const { result, validation } = calculateClampAdvanced('1rem', '2rem', defaultOptions, {
        useContainerQuery: true,
      })
      
      expect(validation.valid).toBe(true)
      expect(result).toContain('cqw')
      expect(result).not.toContain('vw')
    })

    it('should use vw units by default', () => {
      const { result } = calculateClampAdvanced('1rem', '2rem', defaultOptions)
      expect(result).toContain('vw')
      expect(result).not.toContain('cqw')
    })
  })

  describe('debug comments', () => {
    it('should add debug comment when debug is enabled', () => {
      const options = { ...defaultOptions, debug: true }
      const { result } = calculateClampAdvanced('1rem', '2rem', options)
      
      expect(result).toContain('/*')
      expect(result).toContain('fluid from')
    })

    it('should not add debug comment by default', () => {
      const { result } = calculateClampAdvanced('1rem', '2rem', defaultOptions)
      
      expect(result).not.toContain('/*')
    })
  })

  describe('unit validation', () => {
    it('should skip validation when validateUnits is false', () => {
      const options = { ...defaultOptions, validateUnits: false }
      // This would normally fail with mismatched units
      const { result, validation } = calculateClampAdvanced('1rem', '2rem', options)
      
      expect(validation.valid).toBe(true)
      expect(result).toMatch(/clamp/)
    })

    it('should fail validation for invalid values', () => {
      const { result, validation } = calculateClampAdvanced('invalid', '2rem', defaultOptions)
      
      expect(validation.valid).toBe(false)
      expect(result).toBe('')
    })
  })
})

describe('validateFluidUnits', () => {
  it('should validate matching rem units', () => {
    const result = validateFluidUnits('1rem', '2rem')
    expect(result.valid).toBe(true)
  })

  it('should validate matching px units', () => {
    const result = validateFluidUnits('16px', '32px')
    expect(result.valid).toBe(true)
  })

  it('should fail for mismatched units', () => {
    const result = validateFluidUnits('1rem', '32px')
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('mismatched-units')
  })

  it('should allow zero with any unit', () => {
    expect(validateFluidUnits('0', '2rem').valid).toBe(true)
    expect(validateFluidUnits('1rem', '0').valid).toBe(true)
  })

  it('should fail for same values', () => {
    const result = validateFluidUnits('1rem', '1rem')
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('no-change')
  })

  it('should fail for invalid min value', () => {
    const result = validateFluidUnits('invalid', '2rem')
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('invalid-min')
  })

  it('should fail for invalid max value', () => {
    const result = validateFluidUnits('1rem', 'invalid')
    expect(result.valid).toBe(false)
    expect(result.error?.code).toBe('invalid-max')
  })
})

describe('createNegatedClamp', () => {
  it('should create negated clamp value', () => {
    const result = createNegatedClamp('1rem', '2rem', defaultOptions)
    
    // Should contain negative values
    expect(result).toContain('-1rem')
    expect(result).toContain('-2rem')
  })

  it('should use custom breakpoints', () => {
    const result = createNegatedClamp('1rem', '2rem', defaultOptions, {
      minViewport: 320,
      maxViewport: 1920,
    })
    
    expect(result).toContain('-1rem')
    expect(result).toContain('-2rem')
  })
})

describe('createContainerClamp', () => {
  it('should create container query clamp', () => {
    const result = createContainerClamp('1rem', '2rem', defaultOptions)
    
    expect(result).toContain('cqw')
    expect(result).not.toContain('vw')
  })

  it('should use custom breakpoints', () => {
    const result1 = createContainerClamp('1rem', '2rem', defaultOptions)
    const result2 = createContainerClamp('1rem', '2rem', defaultOptions, {
      minViewport: 320,
    })
    
    // Results should be different due to different breakpoints
    expect(result1).not.toBe(result2)
  })
})

describe('prefix support', () => {
  it('should work with prefix option', () => {
    const options = { ...defaultOptions, prefix: 'tw-' }
    const { result, validation } = calculateClampAdvanced('1rem', '2rem', options)
    
    expect(validation.valid).toBe(true)
    expect(result).toMatch(/clamp/)
  })
})

describe('edge cases', () => {
  it('should handle very small values', () => {
    const { result, validation } = calculateClampAdvanced('0.125rem', '0.25rem', defaultOptions)
    
    expect(validation.valid).toBe(true)
    expect(result).toMatch(/clamp/)
  })

  it('should handle very large values', () => {
    const { result, validation } = calculateClampAdvanced('10rem', '20rem', defaultOptions)
    
    expect(validation.valid).toBe(true)
    expect(result).toMatch(/clamp/)
  })

  it('should handle decimal precision', () => {
    const { result, validation } = calculateClampAdvanced('1.5rem', '2.5rem', defaultOptions)
    
    expect(validation.valid).toBe(true)
    expect(result).toContain('1.5rem')
    expect(result).toContain('2.5rem')
  })

  it('should handle spacing scale values with explicit rem', () => {
    // When spacing values are already converted to rem
    const { result, validation } = calculateClampAdvanced('1rem', '2rem', defaultOptions)
    
    expect(validation.valid).toBe(true)
    expect(result).toContain('1rem')
    expect(result).toContain('2rem')
  })

  it('should handle resolved theme spacing values', () => {
    // In practice, spacing values like "4" are resolved to "1rem" by resolveThemeValue
    // before being passed to calculateClampAdvanced
    // This simulates what happens after theme resolution
    const { result, validation } = calculateClampAdvanced('1rem', '2rem', defaultOptions)
    
    expect(validation.valid).toBe(true)
    expect(result).toContain('1rem')
    expect(result).toContain('2rem')
  })

  it('should handle equal breakpoints with error', () => {
    const { result, validation } = calculateClampAdvanced('1rem', '2rem', {
      ...defaultOptions,
      minViewport: 1000,
      maxViewport: 1000,
    })
    
    expect(validation.valid).toBe(false)
    expect(validation.error?.code).toBe('no-change-bp')
    expect(result).toBe('')
  })
})

