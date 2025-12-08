import { describe, it, expect } from 'vitest'
import { twMerge, isFluidValue, withFluid, createTwMerge } from '../src/tailwind-merge'

describe('isFluidValue', () => {
  it('should match valid fluid value patterns', () => {
    expect(isFluidValue('4/8')).toBe(true)
    expect(isFluidValue('base/2xl')).toBe(true)
    expect(isFluidValue('sm/lg')).toBe(true)
    expect(isFluidValue('0.5/1.5')).toBe(true)
    expect(isFluidValue('xs/9xl')).toBe(true)
  })

  it('should not match invalid patterns', () => {
    expect(isFluidValue('4')).toBe(false)
    expect(isFluidValue('')).toBe(false)
    expect(isFluidValue('4/8/12')).toBe(false)
    expect(isFluidValue('/')).toBe(false)
  })
})

describe('twMerge with fluid utilities', () => {
  it('should keep last fluid padding class', () => {
    const result = twMerge('fl-p-4/8', 'fl-p-6/12')
    expect(result).toBe('fl-p-6/12')
  })

  it('should keep last fluid margin class', () => {
    const result = twMerge('fl-m-2/4', 'fl-m-4/8')
    expect(result).toBe('fl-m-4/8')
  })

  it('should keep last fluid text class', () => {
    const result = twMerge('fl-text-base/2xl', 'fl-text-lg/3xl')
    expect(result).toBe('fl-text-lg/3xl')
  })

  it('should resolve conflict between fluid and regular padding', () => {
    // Fluid should override regular
    const result1 = twMerge('p-4', 'fl-p-4/8')
    expect(result1).toBe('fl-p-4/8')

    // Regular should override fluid
    const result2 = twMerge('fl-p-4/8', 'p-4')
    expect(result2).toBe('p-4')
  })

  it('should resolve conflict between fluid and regular margin', () => {
    const result1 = twMerge('m-4', 'fl-m-4/8')
    expect(result1).toBe('fl-m-4/8')

    const result2 = twMerge('fl-m-4/8', 'm-4')
    expect(result2).toBe('m-4')
  })

  it('should handle mixed utilities correctly', () => {
    const result = twMerge('p-4', 'fl-m-4/8', 'text-lg', 'fl-text-base/2xl')
    expect(result).toBe('p-4 fl-m-4/8 fl-text-base/2xl')
  })

  it('should keep different axis utilities separate', () => {
    const result = twMerge('fl-px-4/8', 'fl-py-2/6')
    expect(result).toBe('fl-px-4/8 fl-py-2/6')
  })

  it('should handle gap utilities', () => {
    const result1 = twMerge('gap-4', 'fl-gap-4/8')
    expect(result1).toBe('fl-gap-4/8')

    const result2 = twMerge('fl-gap-x-4/8', 'fl-gap-y-2/6')
    expect(result2).toBe('fl-gap-x-4/8 fl-gap-y-2/6')
  })

  it('should handle sizing utilities', () => {
    const result = twMerge('w-full', 'fl-w-64/96', 'h-screen')
    expect(result).toBe('fl-w-64/96 h-screen')
  })

  it('should handle position utilities', () => {
    const result = twMerge('top-0', 'fl-top-4/8', 'left-0')
    expect(result).toBe('fl-top-4/8 left-0')
  })

  it('should handle border utilities', () => {
    const result = twMerge('rounded-lg', 'fl-rounded-md/xl')
    expect(result).toBe('fl-rounded-md/xl')
  })
})

describe('withFluid configuration', () => {
  it('should export valid configuration object', () => {
    expect(withFluid).toBeDefined()
    expect(withFluid.extend).toBeDefined()
    expect(withFluid.extend?.classGroups).toBeDefined()
    expect(withFluid.extend?.conflictingClassGroups).toBeDefined()
  })

  it('should include all fluid utility class groups', () => {
    const classGroups = withFluid.extend?.classGroups ?? {}
    
    // Check padding groups
    expect(classGroups['fluid-p']).toBeDefined()
    expect(classGroups['fluid-px']).toBeDefined()
    expect(classGroups['fluid-py']).toBeDefined()

    // Check margin groups
    expect(classGroups['fluid-m']).toBeDefined()
    expect(classGroups['fluid-mx']).toBeDefined()
    expect(classGroups['fluid-my']).toBeDefined()

    // Check typography groups
    expect(classGroups['fluid-text']).toBeDefined()
    expect(classGroups['fluid-leading']).toBeDefined()

    // Check sizing groups
    expect(classGroups['fluid-w']).toBeDefined()
    expect(classGroups['fluid-h']).toBeDefined()

    // Check gap groups
    expect(classGroups['fluid-gap']).toBeDefined()
  })
})

describe('createTwMerge', () => {
  it('should create a custom merge function', () => {
    const customMerge = createTwMerge()
    expect(typeof customMerge).toBe('function')
  })

  it('should work with fluid utilities', () => {
    const customMerge = createTwMerge()
    const result = customMerge('fl-p-4/8', 'fl-p-6/12')
    expect(result).toBe('fl-p-6/12')
  })

  it('should accept additional configuration', () => {
    const customMerge = createTwMerge({
      extend: {
        classGroups: {
          'custom-group': ['custom-class'],
        },
      },
    })
    expect(typeof customMerge).toBe('function')
  })
})

