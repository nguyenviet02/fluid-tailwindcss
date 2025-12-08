import type { UtilityDefinition } from './types'

/**
 * All supported fluid utilities with their CSS property mappings
 */
export const fluidUtilities: Record<string, UtilityDefinition> = {
  // Padding utilities
  'fl-p': { property: 'padding', scale: 'spacing' },
  'fl-px': { property: ['padding-left', 'padding-right'], scale: 'spacing' },
  'fl-py': { property: ['padding-top', 'padding-bottom'], scale: 'spacing' },
  'fl-pt': { property: 'padding-top', scale: 'spacing' },
  'fl-pr': { property: 'padding-right', scale: 'spacing' },
  'fl-pb': { property: 'padding-bottom', scale: 'spacing' },
  'fl-pl': { property: 'padding-left', scale: 'spacing' },
  'fl-ps': { property: 'padding-inline-start', scale: 'spacing' },
  'fl-pe': { property: 'padding-inline-end', scale: 'spacing' },

  // Margin utilities
  'fl-m': { property: 'margin', scale: 'spacing', supportsNegative: true },
  'fl-mx': { property: ['margin-left', 'margin-right'], scale: 'spacing', supportsNegative: true },
  'fl-my': { property: ['margin-top', 'margin-bottom'], scale: 'spacing', supportsNegative: true },
  'fl-mt': { property: 'margin-top', scale: 'spacing', supportsNegative: true },
  'fl-mr': { property: 'margin-right', scale: 'spacing', supportsNegative: true },
  'fl-mb': { property: 'margin-bottom', scale: 'spacing', supportsNegative: true },
  'fl-ml': { property: 'margin-left', scale: 'spacing', supportsNegative: true },
  'fl-ms': { property: 'margin-inline-start', scale: 'spacing', supportsNegative: true },
  'fl-me': { property: 'margin-inline-end', scale: 'spacing', supportsNegative: true },

  // Typography utilities
  'fl-text': { property: 'font-size', scale: 'fontSize' },
  'fl-leading': { property: 'line-height', scale: 'lineHeight' },
  'fl-tracking': { property: 'letter-spacing', scale: 'letterSpacing' },

  // Sizing utilities
  'fl-w': { property: 'width', scale: 'spacing' },
  'fl-h': { property: 'height', scale: 'spacing' },
  'fl-size': { property: ['width', 'height'], scale: 'spacing' },
  'fl-min-w': { property: 'min-width', scale: 'spacing' },
  'fl-max-w': { property: 'max-width', scale: 'spacing' },
  'fl-min-h': { property: 'min-height', scale: 'spacing' },
  'fl-max-h': { property: 'max-height', scale: 'spacing' },

  // Gap utilities
  'fl-gap': { property: 'gap', scale: 'spacing' },
  'fl-gap-x': { property: 'column-gap', scale: 'spacing' },
  'fl-gap-y': { property: 'row-gap', scale: 'spacing' },

  // Position utilities
  'fl-inset': { property: 'inset', scale: 'spacing', supportsNegative: true },
  'fl-inset-x': { property: ['left', 'right'], scale: 'spacing', supportsNegative: true },
  'fl-inset-y': { property: ['top', 'bottom'], scale: 'spacing', supportsNegative: true },
  'fl-top': { property: 'top', scale: 'spacing', supportsNegative: true },
  'fl-right': { property: 'right', scale: 'spacing', supportsNegative: true },
  'fl-bottom': { property: 'bottom', scale: 'spacing', supportsNegative: true },
  'fl-left': { property: 'left', scale: 'spacing', supportsNegative: true },
  'fl-start': { property: 'inset-inline-start', scale: 'spacing', supportsNegative: true },
  'fl-end': { property: 'inset-inline-end', scale: 'spacing', supportsNegative: true },

  // Border utilities
  'fl-rounded': { property: 'border-radius', scale: 'borderRadius' },
  'fl-rounded-t': { property: ['border-top-left-radius', 'border-top-right-radius'], scale: 'borderRadius' },
  'fl-rounded-r': { property: ['border-top-right-radius', 'border-bottom-right-radius'], scale: 'borderRadius' },
  'fl-rounded-b': { property: ['border-bottom-left-radius', 'border-bottom-right-radius'], scale: 'borderRadius' },
  'fl-rounded-l': { property: ['border-top-left-radius', 'border-bottom-left-radius'], scale: 'borderRadius' },
  'fl-rounded-tl': { property: 'border-top-left-radius', scale: 'borderRadius' },
  'fl-rounded-tr': { property: 'border-top-right-radius', scale: 'borderRadius' },
  'fl-rounded-br': { property: 'border-bottom-right-radius', scale: 'borderRadius' },
  'fl-rounded-bl': { property: 'border-bottom-left-radius', scale: 'borderRadius' },
  'fl-border': { property: 'border-width', scale: 'borderWidth' },
  'fl-border-t': { property: 'border-top-width', scale: 'borderWidth' },
  'fl-border-r': { property: 'border-right-width', scale: 'borderWidth' },
  'fl-border-b': { property: 'border-bottom-width', scale: 'borderWidth' },
  'fl-border-l': { property: 'border-left-width', scale: 'borderWidth' },

  // Scroll margin
  'fl-scroll-m': { property: 'scroll-margin', scale: 'spacing' },
  'fl-scroll-mx': { property: ['scroll-margin-left', 'scroll-margin-right'], scale: 'spacing' },
  'fl-scroll-my': { property: ['scroll-margin-top', 'scroll-margin-bottom'], scale: 'spacing' },
  'fl-scroll-mt': { property: 'scroll-margin-top', scale: 'spacing' },
  'fl-scroll-mr': { property: 'scroll-margin-right', scale: 'spacing' },
  'fl-scroll-mb': { property: 'scroll-margin-bottom', scale: 'spacing' },
  'fl-scroll-ml': { property: 'scroll-margin-left', scale: 'spacing' },

  // Scroll padding
  'fl-scroll-p': { property: 'scroll-padding', scale: 'spacing' },
  'fl-scroll-px': { property: ['scroll-padding-left', 'scroll-padding-right'], scale: 'spacing' },
  'fl-scroll-py': { property: ['scroll-padding-top', 'scroll-padding-bottom'], scale: 'spacing' },
  'fl-scroll-pt': { property: 'scroll-padding-top', scale: 'spacing' },
  'fl-scroll-pr': { property: 'scroll-padding-right', scale: 'spacing' },
  'fl-scroll-pb': { property: 'scroll-padding-bottom', scale: 'spacing' },
  'fl-scroll-pl': { property: 'scroll-padding-left', scale: 'spacing' },

  // Space between (special handling needed)
  'fl-space-x': { property: '--tw-space-x-reverse', scale: 'spacing' },
  'fl-space-y': { property: '--tw-space-y-reverse', scale: 'spacing' },

  // Translate (requires transform)
  'fl-translate-x': { property: '--tw-translate-x', scale: 'spacing', supportsNegative: true },
  'fl-translate-y': { property: '--tw-translate-y', scale: 'spacing', supportsNegative: true },

  // Basis
  'fl-basis': { property: 'flex-basis', scale: 'spacing' },
}

/**
 * Get theme path for a scale type
 */
export function getThemePath(scale: UtilityDefinition['scale']): string {
  switch (scale) {
    case 'fontSize':
      return 'fontSize'
    case 'lineHeight':
      return 'lineHeight'
    case 'letterSpacing':
      return 'letterSpacing'
    case 'borderRadius':
      return 'borderRadius'
    case 'borderWidth':
      return 'borderWidth'
    case 'spacing':
    default:
      return 'spacing'
  }
}

/**
 * Default spacing scale values (Tailwind defaults)
 */
export const defaultSpacing: Record<string, string> = {
  '0': '0px',
  'px': '1px',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
}

/**
 * Default font size scale values (Tailwind defaults)
 */
export const defaultFontSize: Record<string, string> = {
  'xs': '0.75rem',
  'sm': '0.875rem',
  'base': '1rem',
  'lg': '1.125rem',
  'xl': '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
}

/**
 * Default line height scale values
 */
export const defaultLineHeight: Record<string, string> = {
  'none': '1',
  'tight': '1.25',
  'snug': '1.375',
  'normal': '1.5',
  'relaxed': '1.625',
  'loose': '2',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
}

/**
 * Default letter spacing scale values
 */
export const defaultLetterSpacing: Record<string, string> = {
  'tighter': '-0.05em',
  'tight': '-0.025em',
  'normal': '0em',
  'wide': '0.025em',
  'wider': '0.05em',
  'widest': '0.1em',
}

/**
 * Default border radius scale values
 */
export const defaultBorderRadius: Record<string, string> = {
  'none': '0px',
  'sm': '0.125rem',
  'DEFAULT': '0.25rem',
  'md': '0.375rem',
  'lg': '0.5rem',
  'xl': '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  'full': '9999px',
}

/**
 * Default border width scale values
 */
export const defaultBorderWidth: Record<string, string> = {
  'DEFAULT': '1px',
  '0': '0px',
  '2': '2px',
  '4': '4px',
  '8': '8px',
}

/**
 * Get default scale values for a scale type
 */
export function getDefaultScale(scale: UtilityDefinition['scale']): Record<string, string> {
  switch (scale) {
    case 'fontSize':
      return defaultFontSize
    case 'lineHeight':
      return defaultLineHeight
    case 'letterSpacing':
      return defaultLetterSpacing
    case 'borderRadius':
      return defaultBorderRadius
    case 'borderWidth':
      return defaultBorderWidth
    case 'spacing':
    default:
      return defaultSpacing
  }
}

