import { describe, it, expect } from 'vitest'
import {
  fluidUtilities,
  getThemePath,
  getDefaultScale,
  defaultSpacing,
  defaultFontSize,
  defaultLineHeight,
  defaultLetterSpacing,
  defaultBorderRadius,
  defaultBorderWidth,
} from '../src/utilities'

describe('fluidUtilities', () => {
  it('should include all padding utilities', () => {
    expect(fluidUtilities['fl-p']).toBeDefined()
    expect(fluidUtilities['fl-px']).toBeDefined()
    expect(fluidUtilities['fl-py']).toBeDefined()
    expect(fluidUtilities['fl-pt']).toBeDefined()
    expect(fluidUtilities['fl-pr']).toBeDefined()
    expect(fluidUtilities['fl-pb']).toBeDefined()
    expect(fluidUtilities['fl-pl']).toBeDefined()
    expect(fluidUtilities['fl-ps']).toBeDefined()
    expect(fluidUtilities['fl-pe']).toBeDefined()
  })

  it('should include all margin utilities', () => {
    expect(fluidUtilities['fl-m']).toBeDefined()
    expect(fluidUtilities['fl-mx']).toBeDefined()
    expect(fluidUtilities['fl-my']).toBeDefined()
    expect(fluidUtilities['fl-mt']).toBeDefined()
    expect(fluidUtilities['fl-mr']).toBeDefined()
    expect(fluidUtilities['fl-mb']).toBeDefined()
    expect(fluidUtilities['fl-ml']).toBeDefined()
    expect(fluidUtilities['fl-ms']).toBeDefined()
    expect(fluidUtilities['fl-me']).toBeDefined()
  })

  it('should include typography utilities', () => {
    expect(fluidUtilities['fl-text']).toBeDefined()
    expect(fluidUtilities['fl-leading']).toBeDefined()
    expect(fluidUtilities['fl-tracking']).toBeDefined()
  })

  it('should include sizing utilities', () => {
    expect(fluidUtilities['fl-w']).toBeDefined()
    expect(fluidUtilities['fl-h']).toBeDefined()
    expect(fluidUtilities['fl-size']).toBeDefined()
    expect(fluidUtilities['fl-min-w']).toBeDefined()
    expect(fluidUtilities['fl-max-w']).toBeDefined()
    expect(fluidUtilities['fl-min-h']).toBeDefined()
    expect(fluidUtilities['fl-max-h']).toBeDefined()
  })

  it('should include gap utilities', () => {
    expect(fluidUtilities['fl-gap']).toBeDefined()
    expect(fluidUtilities['fl-gap-x']).toBeDefined()
    expect(fluidUtilities['fl-gap-y']).toBeDefined()
  })

  it('should include position utilities', () => {
    expect(fluidUtilities['fl-inset']).toBeDefined()
    expect(fluidUtilities['fl-inset-x']).toBeDefined()
    expect(fluidUtilities['fl-inset-y']).toBeDefined()
    expect(fluidUtilities['fl-top']).toBeDefined()
    expect(fluidUtilities['fl-right']).toBeDefined()
    expect(fluidUtilities['fl-bottom']).toBeDefined()
    expect(fluidUtilities['fl-left']).toBeDefined()
  })

  it('should include border utilities', () => {
    expect(fluidUtilities['fl-rounded']).toBeDefined()
    expect(fluidUtilities['fl-rounded-t']).toBeDefined()
    expect(fluidUtilities['fl-rounded-r']).toBeDefined()
    expect(fluidUtilities['fl-rounded-b']).toBeDefined()
    expect(fluidUtilities['fl-rounded-l']).toBeDefined()
    expect(fluidUtilities['fl-border']).toBeDefined()
  })

  it('should mark negative-supporting utilities correctly', () => {
    // Margin supports negative
    expect(fluidUtilities['fl-m'].supportsNegative).toBe(true)
    expect(fluidUtilities['fl-mt'].supportsNegative).toBe(true)

    // Padding does not support negative
    expect(fluidUtilities['fl-p'].supportsNegative).toBeUndefined()

    // Position supports negative
    expect(fluidUtilities['fl-top'].supportsNegative).toBe(true)
    expect(fluidUtilities['fl-inset'].supportsNegative).toBe(true)
  })

  it('should have correct property definitions', () => {
    expect(fluidUtilities['fl-p'].property).toBe('padding')
    expect(fluidUtilities['fl-px'].property).toEqual(['padding-left', 'padding-right'])
    expect(fluidUtilities['fl-text'].property).toBe('font-size')
    expect(fluidUtilities['fl-gap'].property).toBe('gap')
    expect(fluidUtilities['fl-size'].property).toEqual(['width', 'height'])
  })

  it('should have correct scale definitions', () => {
    expect(fluidUtilities['fl-p'].scale).toBe('spacing')
    expect(fluidUtilities['fl-text'].scale).toBe('fontSize')
    expect(fluidUtilities['fl-leading'].scale).toBe('lineHeight')
    expect(fluidUtilities['fl-tracking'].scale).toBe('letterSpacing')
    expect(fluidUtilities['fl-rounded'].scale).toBe('borderRadius')
    expect(fluidUtilities['fl-border'].scale).toBe('borderWidth')
  })
})

describe('getThemePath', () => {
  it('should return correct theme paths', () => {
    expect(getThemePath('spacing')).toBe('spacing')
    expect(getThemePath('fontSize')).toBe('fontSize')
    expect(getThemePath('lineHeight')).toBe('lineHeight')
    expect(getThemePath('letterSpacing')).toBe('letterSpacing')
    expect(getThemePath('borderRadius')).toBe('borderRadius')
    expect(getThemePath('borderWidth')).toBe('borderWidth')
  })

  it('should default to spacing', () => {
    expect(getThemePath(undefined)).toBe('spacing')
  })
})

describe('getDefaultScale', () => {
  it('should return correct default scales', () => {
    expect(getDefaultScale('spacing')).toBe(defaultSpacing)
    expect(getDefaultScale('fontSize')).toBe(defaultFontSize)
    expect(getDefaultScale('lineHeight')).toBe(defaultLineHeight)
    expect(getDefaultScale('letterSpacing')).toBe(defaultLetterSpacing)
    expect(getDefaultScale('borderRadius')).toBe(defaultBorderRadius)
    expect(getDefaultScale('borderWidth')).toBe(defaultBorderWidth)
  })

  it('should default to spacing', () => {
    expect(getDefaultScale(undefined)).toBe(defaultSpacing)
  })
})

describe('defaultSpacing', () => {
  it('should include Tailwind default spacing values', () => {
    expect(defaultSpacing['0']).toBe('0px')
    expect(defaultSpacing['1']).toBe('0.25rem')
    expect(defaultSpacing['4']).toBe('1rem')
    expect(defaultSpacing['8']).toBe('2rem')
    expect(defaultSpacing['16']).toBe('4rem')
    expect(defaultSpacing['96']).toBe('24rem')
    expect(defaultSpacing['px']).toBe('1px')
  })
})

describe('defaultFontSize', () => {
  it('should include Tailwind default font sizes', () => {
    expect(defaultFontSize['xs']).toBe('0.75rem')
    expect(defaultFontSize['sm']).toBe('0.875rem')
    expect(defaultFontSize['base']).toBe('1rem')
    expect(defaultFontSize['lg']).toBe('1.125rem')
    expect(defaultFontSize['xl']).toBe('1.25rem')
    expect(defaultFontSize['2xl']).toBe('1.5rem')
    expect(defaultFontSize['9xl']).toBe('8rem')
  })
})

describe('defaultBorderRadius', () => {
  it('should include Tailwind default border radius values', () => {
    expect(defaultBorderRadius['none']).toBe('0px')
    expect(defaultBorderRadius['sm']).toBe('0.125rem')
    expect(defaultBorderRadius['DEFAULT']).toBe('0.25rem')
    expect(defaultBorderRadius['lg']).toBe('0.5rem')
    expect(defaultBorderRadius['full']).toBe('9999px')
  })
})

