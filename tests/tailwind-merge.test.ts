import { describe, it, expect } from 'vitest'
import { 
  twMerge, 
  isFluidValue, 
  withFluid, 
  createTwMerge,
  isArbitraryFluidValue,
  isAnyFluidValue,
  isNegativeFluidValue,
  createPrefixedTwMerge,
  validateFluidClass,
  filterValidFluidClasses,
  twMergeWithValidation,
} from '../src/tailwind-merge'

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

describe('isArbitraryFluidValue', () => {
  it('should match arbitrary fluid values', () => {
    expect(isArbitraryFluidValue('[1rem/2rem]')).toBe(true)
    expect(isArbitraryFluidValue('[16px/32px]')).toBe(true)
    expect(isArbitraryFluidValue('[1.5rem/2.5rem]')).toBe(true)
  })

  it('should not match standard fluid values', () => {
    expect(isArbitraryFluidValue('4/8')).toBe(false)
    expect(isArbitraryFluidValue('base/2xl')).toBe(false)
  })

  it('should not match invalid patterns', () => {
    expect(isArbitraryFluidValue('[1rem]')).toBe(false)
    expect(isArbitraryFluidValue('1rem/2rem')).toBe(false)
  })
})

describe('isAnyFluidValue', () => {
  it('should match standard fluid values', () => {
    expect(isAnyFluidValue('4/8')).toBe(true)
    expect(isAnyFluidValue('base/2xl')).toBe(true)
  })

  it('should match arbitrary fluid values', () => {
    expect(isAnyFluidValue('[1rem/2rem]')).toBe(true)
    expect(isAnyFluidValue('[16px/32px]')).toBe(true)
  })

  it('should not match invalid values', () => {
    expect(isAnyFluidValue('4')).toBe(false)
    expect(isAnyFluidValue('')).toBe(false)
  })
})

describe('isNegativeFluidValue', () => {
  it('should match negative fluid values', () => {
    expect(isNegativeFluidValue('-4/8')).toBe(true)
    expect(isNegativeFluidValue('-base/2xl')).toBe(true)
  })

  it('should match negative arbitrary values', () => {
    expect(isNegativeFluidValue('-[1rem/2rem]')).toBe(true)
  })

  it('should not match positive values', () => {
    expect(isNegativeFluidValue('4/8')).toBe(false)
    expect(isNegativeFluidValue('[1rem/2rem]')).toBe(false)
  })
})

describe('createPrefixedTwMerge', () => {
  it('should create merge function without prefix', () => {
    const merge = createPrefixedTwMerge()
    expect(typeof merge).toBe('function')
  })

  it('should create merge function with custom prefix', () => {
    const merge = createPrefixedTwMerge({ prefix: 'tw-' })
    expect(typeof merge).toBe('function')
  })
})

describe('validateFluidClass', () => {
  it('should validate standard fluid classes', () => {
    const result = validateFluidClass('fl-p-4/8')
    expect(result.valid).toBe(true)
  })

  it('should validate arbitrary fluid classes', () => {
    const result = validateFluidClass('fl-p-[1rem/2rem]')
    expect(result.valid).toBe(true)
  })

  it('should detect unit mismatch in arbitrary values', () => {
    const result = validateFluidClass('fl-p-[1rem/16px]')
    expect(result.valid).toBe(false)
    expect(result.reason).toContain('mismatch')
  })

  it('should pass non-fluid classes', () => {
    const result = validateFluidClass('p-4')
    expect(result.valid).toBe(true)
  })
})

describe('filterValidFluidClasses', () => {
  it('should keep valid fluid classes', () => {
    const result = filterValidFluidClasses('fl-p-4/8 fl-m-2/6')
    expect(result).toBe('fl-p-4/8 fl-m-2/6')
  })

  it('should remove invalid fluid classes', () => {
    const result = filterValidFluidClasses('fl-p-[1rem/16px] fl-m-2/6')
    expect(result).toBe('fl-m-2/6')
  })

  it('should keep non-fluid classes', () => {
    const result = filterValidFluidClasses('p-4 m-2 text-lg')
    expect(result).toBe('p-4 m-2 text-lg')
  })
})

describe('twMergeWithValidation', () => {
  it('should merge valid classes', () => {
    const result = twMergeWithValidation('fl-p-4/8', 'fl-p-6/12')
    expect(result).toBe('fl-p-6/12')
  })

  it('should filter out invalid classes before merging', () => {
    const result = twMergeWithValidation('fl-p-[1rem/16px]', 'fl-m-4/8')
    expect(result).toBe('fl-m-4/8')
    expect(result).not.toContain('fl-p')
  })

  it('should handle mixed valid and invalid classes', () => {
    const result = twMergeWithValidation('p-4', 'fl-p-[1rem/16px]', 'fl-m-4/8')
    expect(result).toBe('p-4 fl-m-4/8')
  })

  it('should handle falsy values', () => {
    const result = twMergeWithValidation('fl-p-4/8', undefined, null, false)
    expect(result).toBe('fl-p-4/8')
  })
})

describe('negative values with twMerge', () => {
  it('should handle negative margin classes', () => {
    const result = twMerge('-fl-m-4/8', '-fl-m-6/12')
    expect(result).toBe('-fl-m-6/12')
  })

  it('should handle negative translate classes', () => {
    const result = twMerge('-fl-translate-x-4/8', 'fl-translate-x-2/6')
    expect(result).toBe('fl-translate-x-2/6')
  })
})

