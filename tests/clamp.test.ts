import { describe, it, expect } from 'vitest'
import {
  calculateClamp,
  parseValueToRem,
  parseValueToPx,
  parseFluidString,
  resolveThemeValue,
  checkAccessibility,
  round,
} from '../src/clamp'
import type { ResolvedFluidOptions } from '../src/types'

const defaultOptions: ResolvedFluidOptions = {
  minViewport: 375,
  maxViewport: 1440,
  useRem: true,
  rootFontSize: 16,
  checkAccessibility: true,
}

describe('parseValueToRem', () => {
  it('should parse rem values correctly', () => {
    expect(parseValueToRem('1rem', 16)).toBe(1)
    expect(parseValueToRem('2.5rem', 16)).toBe(2.5)
    expect(parseValueToRem('0.25rem', 16)).toBe(0.25)
  })

  it('should parse px values correctly', () => {
    expect(parseValueToRem('16px', 16)).toBe(1)
    expect(parseValueToRem('32px', 16)).toBe(2)
    expect(parseValueToRem('8px', 16)).toBe(0.5)
  })

  it('should parse em values as rem', () => {
    expect(parseValueToRem('1em', 16)).toBe(1)
    expect(parseValueToRem('1.5em', 16)).toBe(1.5)
  })

  it('should parse unitless values as Tailwind spacing scale', () => {
    expect(parseValueToRem('4', 16)).toBe(1) // 4 * 0.25 = 1rem
    expect(parseValueToRem('8', 16)).toBe(2) // 8 * 0.25 = 2rem
    expect(parseValueToRem('1', 16)).toBe(0.25) // 1 * 0.25 = 0.25rem
  })

  it('should handle zero values', () => {
    expect(parseValueToRem('0', 16)).toBe(0)
    expect(parseValueToRem('0px', 16)).toBe(0)
    expect(parseValueToRem('0rem', 16)).toBe(0)
  })
})

describe('parseValueToPx', () => {
  it('should convert rem to px correctly', () => {
    expect(parseValueToPx('1rem', 16)).toBe(16)
    expect(parseValueToPx('2rem', 16)).toBe(32)
  })

  it('should keep px values as-is', () => {
    expect(parseValueToPx('24px', 16)).toBe(24)
    expect(parseValueToPx('16px', 16)).toBe(16)
  })
})

describe('round', () => {
  it('should round to specified decimal places', () => {
    expect(round(1.23456789, 4)).toBe(1.2346)
    expect(round(1.23456789, 2)).toBe(1.23)
    expect(round(1.5, 0)).toBe(2)
  })
})

describe('parseFluidString', () => {
  it('should parse valid fluid strings', () => {
    expect(parseFluidString('4/8')).toEqual({ min: '4', max: '8' })
    expect(parseFluidString('base/2xl')).toEqual({ min: 'base', max: '2xl' })
    expect(parseFluidString('sm/lg')).toEqual({ min: 'sm', max: 'lg' })
    expect(parseFluidString('0.5/1.5')).toEqual({ min: '0.5', max: '1.5' })
  })

  it('should handle spaces correctly', () => {
    expect(parseFluidString(' 4 / 8 ')).toEqual({ min: '4', max: '8' })
  })

  it('should return null for invalid strings', () => {
    expect(parseFluidString('4')).toBeNull()
    expect(parseFluidString('4/8/12')).toBeNull()
    expect(parseFluidString('')).toBeNull()
    expect(parseFluidString('/')).toBeNull()
  })
})

describe('resolveThemeValue', () => {
  const themeValues = {
    '4': '1rem',
    '8': '2rem',
    'base': '1rem',
    '2xl': '1.5rem',
  }

  it('should resolve theme keys', () => {
    expect(resolveThemeValue('4', themeValues)).toBe('1rem')
    expect(resolveThemeValue('8', themeValues)).toBe('2rem')
    expect(resolveThemeValue('base', themeValues)).toBe('1rem')
  })

  it('should pass through CSS values', () => {
    expect(resolveThemeValue('1.5rem', themeValues)).toBe('1.5rem')
    expect(resolveThemeValue('24px', themeValues)).toBe('24px')
  })

  it('should convert numeric values to rem', () => {
    expect(resolveThemeValue('6', {})).toBe('1.5rem') // 6 * 0.25
    expect(resolveThemeValue('10', {})).toBe('2.5rem') // 10 * 0.25
  })

  it('should return null for unknown theme keys', () => {
    expect(resolveThemeValue('unknown', themeValues)).toBeNull()
  })
})

describe('calculateClamp', () => {
  it('should generate correct clamp for spacing values', () => {
    const result = calculateClamp('1rem', '2rem', defaultOptions)
    
    // Should return clamp(minRem, preferred, maxRem)
    expect(result).toMatch(/^clamp\(/)
    expect(result).toContain('1rem')
    expect(result).toContain('2rem')
    expect(result).toContain('vw')
  })

  it('should generate correct clamp for px values', () => {
    const options = { ...defaultOptions, useRem: false }
    const result = calculateClamp('16px', '32px', options)
    
    expect(result).toMatch(/^clamp\(/)
    expect(result).toContain('16px')
    expect(result).toContain('32px')
  })

  it('should return simple value when min equals max', () => {
    const result = calculateClamp('1rem', '1rem', defaultOptions)
    expect(result).toBe('1rem')
  })

  it('should handle the example case ~p-6/10', () => {
    // ~p-6/10 means padding from spacing 6 (1.5rem) to spacing 10 (2.5rem)
    const result = calculateClamp('1.5rem', '2.5rem', defaultOptions)
    
    expect(result).toMatch(/^clamp\(/)
    expect(result).toContain('1.5rem')
    expect(result).toContain('2.5rem')
    expect(result).toContain('vw')
  })

  it('should calculate correct viewport-based values', () => {
    // For min: 1.5rem, max: 2.5rem
    // minViewport: 375px = 23.4375rem
    // maxViewport: 1440px = 90rem
    // slope = (2.5 - 1.5) / (90 - 23.4375) = 1 / 66.5625 ≈ 0.01502
    // intercept = 1.5 - 0.01502 * 23.4375 ≈ 1.148
    // vw factor = slope * 100 ≈ 1.502vw
    const result = calculateClamp('1.5rem', '2.5rem', defaultOptions)
    
    // The result should contain values close to these
    expect(result).toContain('1.5rem')
    expect(result).toContain('2.5rem')
  })
})

describe('checkAccessibility', () => {
  it('should return valid for non-text utilities', () => {
    const result = checkAccessibility('0.5rem', defaultOptions, 'other')
    expect(result.isValid).toBe(true)
    expect(result.warning).toBeUndefined()
  })

  it('should return valid for reasonable font sizes', () => {
    const result = checkAccessibility('1rem', defaultOptions, 'text')
    expect(result.isValid).toBe(true)
  })

  it('should warn for small font sizes', () => {
    const result = checkAccessibility('0.5rem', defaultOptions, 'text') // 8px
    expect(result.isValid).toBe(false)
    expect(result.warning).toBeDefined()
    expect(result.warning).toContain('accessibility')
  })

  it('should respect checkAccessibility option', () => {
    const options = { ...defaultOptions, checkAccessibility: false }
    const result = checkAccessibility('0.5rem', options, 'text')
    expect(result.isValid).toBe(true)
  })
})

