import { describe, it, expect } from 'vitest'
import { Length } from '../src/length'

describe('Length', () => {
  describe('constructor', () => {
    it('should create a Length with number and unit', () => {
      const len = new Length(16, 'px')
      expect(len.number).toBe(16)
      expect(len.unit).toBe('px')
    })

    it('should create a Length with number only', () => {
      const len = new Length(0)
      expect(len.number).toBe(0)
      expect(len.unit).toBeUndefined()
    })
  })

  describe('cssText', () => {
    it('should return CSS text representation', () => {
      expect(new Length(1.5, 'rem').cssText).toBe('1.5rem')
      expect(new Length(24, 'px').cssText).toBe('24px')
      expect(new Length(0).cssText).toBe('0')
    })
  })

  describe('clone', () => {
    it('should create a copy of the Length', () => {
      const original = new Length(16, 'px')
      const clone = original.clone()
      expect(clone.number).toBe(16)
      expect(clone.unit).toBe('px')
      expect(clone).not.toBe(original)
    })
  })

  describe('negate', () => {
    it('should return a negated Length', () => {
      const len = new Length(16, 'px')
      const negated = len.negate()
      expect(negated.number).toBe(-16)
      expect(negated.unit).toBe('px')
    })
  })

  describe('equals', () => {
    it('should return true for equal Lengths', () => {
      const a = new Length(16, 'px')
      const b = new Length(16, 'px')
      expect(a.equals(b)).toBe(true)
    })

    it('should return false for different numbers', () => {
      const a = new Length(16, 'px')
      const b = new Length(24, 'px')
      expect(a.equals(b)).toBe(false)
    })

    it('should return false for different units', () => {
      const a = new Length(1, 'rem')
      const b = new Length(1, 'em')
      expect(a.equals(b)).toBe(false)
    })
  })

  describe('parse', () => {
    it('should parse rem values', () => {
      const len = Length.parse('1.5rem')
      expect(len?.number).toBe(1.5)
      expect(len?.unit).toBe('rem')
    })

    it('should parse px values', () => {
      const len = Length.parse('24px')
      expect(len?.number).toBe(24)
      expect(len?.unit).toBe('px')
    })

    it('should parse em values', () => {
      const len = Length.parse('2em')
      expect(len?.number).toBe(2)
      expect(len?.unit).toBe('em')
    })

    it('should parse viewport units', () => {
      const vw = Length.parse('50vw')
      expect(vw?.number).toBe(50)
      expect(vw?.unit).toBe('vw')

      const vh = Length.parse('100vh')
      expect(vh?.number).toBe(100)
      expect(vh?.unit).toBe('vh')
    })

    it('should parse container query units', () => {
      const cqw = Length.parse('50cqw')
      expect(cqw?.number).toBe(50)
      expect(cqw?.unit).toBe('cqw')
    })

    it('should parse zero values', () => {
      expect(Length.parse(0)?.number).toBe(0)
      expect(Length.parse('0')?.number).toBe(0)
      expect(Length.parse('0px')?.number).toBe(0)
      expect(Length.parse('0rem')?.unit).toBe('rem')
    })

    it('should parse negative values', () => {
      const len = Length.parse('-16px')
      expect(len?.number).toBe(-16)
      expect(len?.unit).toBe('px')
    })

    it('should parse decimal values', () => {
      const len = Length.parse('0.25rem')
      expect(len?.number).toBe(0.25)
      expect(len?.unit).toBe('rem')
    })

    it('should parse scientific notation', () => {
      const len = Length.parse('1e2px')
      expect(len?.number).toBe(100)
      expect(len?.unit).toBe('px')
    })

    it('should handle whitespace', () => {
      const len = Length.parse('  16px  ')
      expect(len?.number).toBe(16)
      expect(len?.unit).toBe('px')
    })

    it('should return null for invalid values', () => {
      expect(Length.parse('invalid')).toBeNull()
      expect(Length.parse(null)).toBeNull()
      expect(Length.parse(undefined)).toBeNull()
      expect(Length.parse('')).toBeNull()
      expect(Length.parse({})).toBeNull()
    })

    it('should parse unitless numbers', () => {
      const len = Length.parse('16')
      expect(len?.number).toBe(16)
      expect(len?.unit).toBeUndefined()
    })
  })

  describe('parseWithSpacingFallback', () => {
    it('should parse standard length values', () => {
      const len = Length.parseWithSpacingFallback('1.5rem')
      expect(len?.number).toBe(1.5)
      expect(len?.unit).toBe('rem')
    })

    it('should convert unitless values to rem using spacing scale', () => {
      // Tailwind spacing: 4 = 1rem (4 * 0.25)
      const len = Length.parseWithSpacingFallback('4')
      expect(len?.number).toBe(1)
      expect(len?.unit).toBe('rem')
    })

    it('should handle spacing scale values', () => {
      // 8 * 0.25 = 2rem
      const len = Length.parseWithSpacingFallback('8')
      expect(len?.number).toBe(2)
      expect(len?.unit).toBe('rem')
    })

    it('should return null for invalid values', () => {
      expect(Length.parseWithSpacingFallback(null)).toBeNull()
      expect(Length.parseWithSpacingFallback('invalid')).toBeNull()
    })
  })

  describe('toRem', () => {
    it('should return clone for rem values', () => {
      const len = new Length(1.5, 'rem')
      const rem = len.toRem()
      expect(rem?.number).toBe(1.5)
      expect(rem?.unit).toBe('rem')
    })

    it('should convert px to rem', () => {
      const len = new Length(32, 'px')
      const rem = len.toRem(16)
      expect(rem?.number).toBe(2)
      expect(rem?.unit).toBe('rem')
    })

    it('should treat em as rem', () => {
      const len = new Length(1.5, 'em')
      const rem = len.toRem()
      expect(rem?.number).toBe(1.5)
      expect(rem?.unit).toBe('rem')
    })

    it('should return null for unsupported units', () => {
      const len = new Length(50, 'vw')
      expect(len.toRem()).toBeNull()
    })

    it('should return null for unitless values', () => {
      const len = new Length(16)
      expect(len.toRem()).toBeNull()
    })
  })

  describe('toPx', () => {
    it('should return clone for px values', () => {
      const len = new Length(24, 'px')
      const px = len.toPx()
      expect(px?.number).toBe(24)
      expect(px?.unit).toBe('px')
    })

    it('should convert rem to px', () => {
      const len = new Length(2, 'rem')
      const px = len.toPx(16)
      expect(px?.number).toBe(32)
      expect(px?.unit).toBe('px')
    })

    it('should convert em to px', () => {
      const len = new Length(1.5, 'em')
      const px = len.toPx(16)
      expect(px?.number).toBe(24)
      expect(px?.unit).toBe('px')
    })

    it('should return null for unsupported units', () => {
      const len = new Length(50, 'vw')
      expect(len.toPx()).toBeNull()
    })
  })
})

