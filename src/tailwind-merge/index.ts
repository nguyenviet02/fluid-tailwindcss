import { extendTailwindMerge } from 'tailwind-merge'
import type { Config } from 'tailwind-merge'

/**
 * Regex pattern for fluid values: min/max format
 * Matches: 4/8, base/2xl, sm/lg, 0.5/1.5, etc.
 */
const fluidValuePattern = /^[\w.-]+\/[\w.-]+$/

/**
 * Creates a validator function for fluid class values
 */
export function isFluidValue(value: string): boolean {
  return fluidValuePattern.test(value)
}

/**
 * Fluid class group IDs
 */
type FluidClassGroupIds = 
  | 'fluid-p' | 'fluid-px' | 'fluid-py' | 'fluid-pt' | 'fluid-pr' | 'fluid-pb' | 'fluid-pl' | 'fluid-ps' | 'fluid-pe'
  | 'fluid-m' | 'fluid-mx' | 'fluid-my' | 'fluid-mt' | 'fluid-mr' | 'fluid-mb' | 'fluid-ml' | 'fluid-ms' | 'fluid-me'
  | 'fluid-text' | 'fluid-leading' | 'fluid-tracking'
  | 'fluid-w' | 'fluid-h' | 'fluid-size' | 'fluid-min-w' | 'fluid-max-w' | 'fluid-min-h' | 'fluid-max-h'
  | 'fluid-gap' | 'fluid-gap-x' | 'fluid-gap-y'
  | 'fluid-inset' | 'fluid-inset-x' | 'fluid-inset-y' | 'fluid-top' | 'fluid-right' | 'fluid-bottom' | 'fluid-left' | 'fluid-start' | 'fluid-end'
  | 'fluid-rounded' | 'fluid-rounded-t' | 'fluid-rounded-r' | 'fluid-rounded-b' | 'fluid-rounded-l'
  | 'fluid-rounded-tl' | 'fluid-rounded-tr' | 'fluid-rounded-br' | 'fluid-rounded-bl'
  | 'fluid-border' | 'fluid-border-t' | 'fluid-border-r' | 'fluid-border-b' | 'fluid-border-l'
  | 'fluid-space-x' | 'fluid-space-y'
  | 'fluid-translate-x' | 'fluid-translate-y'
  | 'fluid-basis'
  | 'fluid-scroll-m' | 'fluid-scroll-mx' | 'fluid-scroll-my' | 'fluid-scroll-mt' | 'fluid-scroll-mr' | 'fluid-scroll-mb' | 'fluid-scroll-ml'
  | 'fluid-scroll-p' | 'fluid-scroll-px' | 'fluid-scroll-py' | 'fluid-scroll-pt' | 'fluid-scroll-pr' | 'fluid-scroll-pb' | 'fluid-scroll-pl'

/**
 * Configuration to extend tailwind-merge with fluid utility support
 * Uses type assertion to work around strict typing with custom class groups
 */
export const withFluid = {
  extend: {
    classGroups: {
      // Padding utilities
      'fluid-p': [{ 'fl-p': [isFluidValue] }],
      'fluid-px': [{ 'fl-px': [isFluidValue] }],
      'fluid-py': [{ 'fl-py': [isFluidValue] }],
      'fluid-pt': [{ 'fl-pt': [isFluidValue] }],
      'fluid-pr': [{ 'fl-pr': [isFluidValue] }],
      'fluid-pb': [{ 'fl-pb': [isFluidValue] }],
      'fluid-pl': [{ 'fl-pl': [isFluidValue] }],
      'fluid-ps': [{ 'fl-ps': [isFluidValue] }],
      'fluid-pe': [{ 'fl-pe': [isFluidValue] }],

      // Margin utilities
      'fluid-m': [{ 'fl-m': [isFluidValue] }],
      'fluid-mx': [{ 'fl-mx': [isFluidValue] }],
      'fluid-my': [{ 'fl-my': [isFluidValue] }],
      'fluid-mt': [{ 'fl-mt': [isFluidValue] }],
      'fluid-mr': [{ 'fl-mr': [isFluidValue] }],
      'fluid-mb': [{ 'fl-mb': [isFluidValue] }],
      'fluid-ml': [{ 'fl-ml': [isFluidValue] }],
      'fluid-ms': [{ 'fl-ms': [isFluidValue] }],
      'fluid-me': [{ 'fl-me': [isFluidValue] }],

      // Typography utilities
      'fluid-text': [{ 'fl-text': [isFluidValue] }],
      'fluid-leading': [{ 'fl-leading': [isFluidValue] }],
      'fluid-tracking': [{ 'fl-tracking': [isFluidValue] }],

      // Sizing utilities
      'fluid-w': [{ 'fl-w': [isFluidValue] }],
      'fluid-h': [{ 'fl-h': [isFluidValue] }],
      'fluid-size': [{ 'fl-size': [isFluidValue] }],
      'fluid-min-w': [{ 'fl-min-w': [isFluidValue] }],
      'fluid-max-w': [{ 'fl-max-w': [isFluidValue] }],
      'fluid-min-h': [{ 'fl-min-h': [isFluidValue] }],
      'fluid-max-h': [{ 'fl-max-h': [isFluidValue] }],

      // Gap utilities
      'fluid-gap': [{ 'fl-gap': [isFluidValue] }],
      'fluid-gap-x': [{ 'fl-gap-x': [isFluidValue] }],
      'fluid-gap-y': [{ 'fl-gap-y': [isFluidValue] }],

      // Position utilities
      'fluid-inset': [{ 'fl-inset': [isFluidValue] }],
      'fluid-inset-x': [{ 'fl-inset-x': [isFluidValue] }],
      'fluid-inset-y': [{ 'fl-inset-y': [isFluidValue] }],
      'fluid-top': [{ 'fl-top': [isFluidValue] }],
      'fluid-right': [{ 'fl-right': [isFluidValue] }],
      'fluid-bottom': [{ 'fl-bottom': [isFluidValue] }],
      'fluid-left': [{ 'fl-left': [isFluidValue] }],
      'fluid-start': [{ 'fl-start': [isFluidValue] }],
      'fluid-end': [{ 'fl-end': [isFluidValue] }],

      // Border utilities
      'fluid-rounded': [{ 'fl-rounded': [isFluidValue] }],
      'fluid-rounded-t': [{ 'fl-rounded-t': [isFluidValue] }],
      'fluid-rounded-r': [{ 'fl-rounded-r': [isFluidValue] }],
      'fluid-rounded-b': [{ 'fl-rounded-b': [isFluidValue] }],
      'fluid-rounded-l': [{ 'fl-rounded-l': [isFluidValue] }],
      'fluid-rounded-tl': [{ 'fl-rounded-tl': [isFluidValue] }],
      'fluid-rounded-tr': [{ 'fl-rounded-tr': [isFluidValue] }],
      'fluid-rounded-br': [{ 'fl-rounded-br': [isFluidValue] }],
      'fluid-rounded-bl': [{ 'fl-rounded-bl': [isFluidValue] }],
      'fluid-border': [{ 'fl-border': [isFluidValue] }],
      'fluid-border-t': [{ 'fl-border-t': [isFluidValue] }],
      'fluid-border-r': [{ 'fl-border-r': [isFluidValue] }],
      'fluid-border-b': [{ 'fl-border-b': [isFluidValue] }],
      'fluid-border-l': [{ 'fl-border-l': [isFluidValue] }],

      // Space utilities
      'fluid-space-x': [{ 'fl-space-x': [isFluidValue] }],
      'fluid-space-y': [{ 'fl-space-y': [isFluidValue] }],

      // Translate utilities
      'fluid-translate-x': [{ 'fl-translate-x': [isFluidValue] }],
      'fluid-translate-y': [{ 'fl-translate-y': [isFluidValue] }],

      // Basis
      'fluid-basis': [{ 'fl-basis': [isFluidValue] }],

      // Scroll margin
      'fluid-scroll-m': [{ 'fl-scroll-m': [isFluidValue] }],
      'fluid-scroll-mx': [{ 'fl-scroll-mx': [isFluidValue] }],
      'fluid-scroll-my': [{ 'fl-scroll-my': [isFluidValue] }],
      'fluid-scroll-mt': [{ 'fl-scroll-mt': [isFluidValue] }],
      'fluid-scroll-mr': [{ 'fl-scroll-mr': [isFluidValue] }],
      'fluid-scroll-mb': [{ 'fl-scroll-mb': [isFluidValue] }],
      'fluid-scroll-ml': [{ 'fl-scroll-ml': [isFluidValue] }],

      // Scroll padding
      'fluid-scroll-p': [{ 'fl-scroll-p': [isFluidValue] }],
      'fluid-scroll-px': [{ 'fl-scroll-px': [isFluidValue] }],
      'fluid-scroll-py': [{ 'fl-scroll-py': [isFluidValue] }],
      'fluid-scroll-pt': [{ 'fl-scroll-pt': [isFluidValue] }],
      'fluid-scroll-pr': [{ 'fl-scroll-pr': [isFluidValue] }],
      'fluid-scroll-pb': [{ 'fl-scroll-pb': [isFluidValue] }],
      'fluid-scroll-pl': [{ 'fl-scroll-pl': [isFluidValue] }],
    },
    conflictingClassGroups: {
      // Fluid padding conflicts with regular padding
      'fluid-p': ['p'],
      'fluid-px': ['px'],
      'fluid-py': ['py'],
      'fluid-pt': ['pt'],
      'fluid-pr': ['pr'],
      'fluid-pb': ['pb'],
      'fluid-pl': ['pl'],
      'fluid-ps': ['ps'],
      'fluid-pe': ['pe'],

      // Fluid margin conflicts with regular margin
      'fluid-m': ['m'],
      'fluid-mx': ['mx'],
      'fluid-my': ['my'],
      'fluid-mt': ['mt'],
      'fluid-mr': ['mr'],
      'fluid-mb': ['mb'],
      'fluid-ml': ['ml'],
      'fluid-ms': ['ms'],
      'fluid-me': ['me'],

      // Typography
      'fluid-text': ['font-size'],
      'fluid-leading': ['leading'],
      'fluid-tracking': ['tracking'],

      // Sizing
      'fluid-w': ['w'],
      'fluid-h': ['h'],
      'fluid-size': ['size'],
      'fluid-min-w': ['min-w'],
      'fluid-max-w': ['max-w'],
      'fluid-min-h': ['min-h'],
      'fluid-max-h': ['max-h'],

      // Gap
      'fluid-gap': ['gap'],
      'fluid-gap-x': ['gap-x'],
      'fluid-gap-y': ['gap-y'],

      // Position
      'fluid-inset': ['inset'],
      'fluid-inset-x': ['inset-x'],
      'fluid-inset-y': ['inset-y'],
      'fluid-top': ['top'],
      'fluid-right': ['right'],
      'fluid-bottom': ['bottom'],
      'fluid-left': ['left'],
      'fluid-start': ['start'],
      'fluid-end': ['end'],

      // Border
      'fluid-rounded': ['rounded'],
      'fluid-rounded-t': ['rounded-t'],
      'fluid-rounded-r': ['rounded-r'],
      'fluid-rounded-b': ['rounded-b'],
      'fluid-rounded-l': ['rounded-l'],
      'fluid-rounded-tl': ['rounded-tl'],
      'fluid-rounded-tr': ['rounded-tr'],
      'fluid-rounded-br': ['rounded-br'],
      'fluid-rounded-bl': ['rounded-bl'],
      'fluid-border': ['border-w'],
      'fluid-border-t': ['border-w-t'],
      'fluid-border-r': ['border-w-r'],
      'fluid-border-b': ['border-w-b'],
      'fluid-border-l': ['border-w-l'],

      // Space
      'fluid-space-x': ['space-x'],
      'fluid-space-y': ['space-y'],

      // Translate
      'fluid-translate-x': ['translate-x'],
      'fluid-translate-y': ['translate-y'],

      // Basis
      'fluid-basis': ['basis'],

      // Scroll margin
      'fluid-scroll-m': ['scroll-m'],
      'fluid-scroll-mx': ['scroll-mx'],
      'fluid-scroll-my': ['scroll-my'],
      'fluid-scroll-mt': ['scroll-mt'],
      'fluid-scroll-mr': ['scroll-mr'],
      'fluid-scroll-mb': ['scroll-mb'],
      'fluid-scroll-ml': ['scroll-ml'],

      // Scroll padding
      'fluid-scroll-p': ['scroll-p'],
      'fluid-scroll-px': ['scroll-px'],
      'fluid-scroll-py': ['scroll-py'],
      'fluid-scroll-pt': ['scroll-pt'],
      'fluid-scroll-pr': ['scroll-pr'],
      'fluid-scroll-pb': ['scroll-pb'],
      'fluid-scroll-pl': ['scroll-pl'],

      // Regular classes conflict with fluid classes
      'p': ['fluid-p'],
      'px': ['fluid-px'],
      'py': ['fluid-py'],
      'pt': ['fluid-pt'],
      'pr': ['fluid-pr'],
      'pb': ['fluid-pb'],
      'pl': ['fluid-pl'],
      'ps': ['fluid-ps'],
      'pe': ['fluid-pe'],
      'm': ['fluid-m'],
      'mx': ['fluid-mx'],
      'my': ['fluid-my'],
      'mt': ['fluid-mt'],
      'mr': ['fluid-mr'],
      'mb': ['fluid-mb'],
      'ml': ['fluid-ml'],
      'ms': ['fluid-ms'],
      'me': ['fluid-me'],
      'font-size': ['fluid-text'],
      'leading': ['fluid-leading'],
      'tracking': ['fluid-tracking'],
      'w': ['fluid-w'],
      'h': ['fluid-h'],
      'size': ['fluid-size'],
      'min-w': ['fluid-min-w'],
      'max-w': ['fluid-max-w'],
      'min-h': ['fluid-min-h'],
      'max-h': ['fluid-max-h'],
      'gap': ['fluid-gap'],
      'gap-x': ['fluid-gap-x'],
      'gap-y': ['fluid-gap-y'],
      'inset': ['fluid-inset'],
      'inset-x': ['fluid-inset-x'],
      'inset-y': ['fluid-inset-y'],
      'top': ['fluid-top'],
      'right': ['fluid-right'],
      'bottom': ['fluid-bottom'],
      'left': ['fluid-left'],
      'start': ['fluid-start'],
      'end': ['fluid-end'],
      'rounded': ['fluid-rounded'],
      'rounded-t': ['fluid-rounded-t'],
      'rounded-r': ['fluid-rounded-r'],
      'rounded-b': ['fluid-rounded-b'],
      'rounded-l': ['fluid-rounded-l'],
      'rounded-tl': ['fluid-rounded-tl'],
      'rounded-tr': ['fluid-rounded-tr'],
      'rounded-br': ['fluid-rounded-br'],
      'rounded-bl': ['fluid-rounded-bl'],
      'border-w': ['fluid-border'],
      'border-w-t': ['fluid-border-t'],
      'border-w-r': ['fluid-border-r'],
      'border-w-b': ['fluid-border-b'],
      'border-w-l': ['fluid-border-l'],
      'space-x': ['fluid-space-x'],
      'space-y': ['fluid-space-y'],
      'translate-x': ['fluid-translate-x'],
      'translate-y': ['fluid-translate-y'],
      'basis': ['fluid-basis'],
      'scroll-m': ['fluid-scroll-m'],
      'scroll-mx': ['fluid-scroll-mx'],
      'scroll-my': ['fluid-scroll-my'],
      'scroll-mt': ['fluid-scroll-mt'],
      'scroll-mr': ['fluid-scroll-mr'],
      'scroll-mb': ['fluid-scroll-mb'],
      'scroll-ml': ['fluid-scroll-ml'],
      'scroll-p': ['fluid-scroll-p'],
      'scroll-px': ['fluid-scroll-px'],
      'scroll-py': ['fluid-scroll-py'],
      'scroll-pt': ['fluid-scroll-pt'],
      'scroll-pr': ['fluid-scroll-pr'],
      'scroll-pb': ['fluid-scroll-pb'],
      'scroll-pl': ['fluid-scroll-pl'],
    },
  },
}

/**
 * Pre-configured tailwind-merge instance with fluid support
 */
export const twMerge = extendTailwindMerge(withFluid as unknown as Config<FluidClassGroupIds, string>)

/**
 * Helper function to create a custom tailwind-merge instance with fluid support
 * and additional custom configuration
 */
export function createTwMerge(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalConfig?: any
) {
  if (additionalConfig) {
    // First extend with fluid config, then with additional config
    return extendTailwindMerge(
      withFluid as unknown as Config<FluidClassGroupIds, string>,
      additionalConfig
    )
  }
  
  // Just return with fluid config
  return extendTailwindMerge(withFluid as unknown as Config<FluidClassGroupIds, string>)
}
