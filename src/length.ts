/**
 * CSS Length value parser and handler
 * Based on fluid-tailwind's robust length parsing approach
 */

export type RawValue = string | null | undefined

/**
 * Supported CSS length units
 * Reference: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
 */
const lengthUnits = [
  'cm', 'mm', 'Q', 'in', 'pc', 'pt', 'px',  // Absolute units
  'em', 'ex', 'ch', 'rem', 'lh', 'rlh',     // Relative units
  'vw', 'vh', 'vmin', 'vmax',               // Viewport units
  'cqw', 'cqh', 'cqi', 'cqb',               // Container query units
]

/**
 * Regular expression for parsing CSS length values
 * Matches: number + optional unit (e.g., "1.5rem", "24px", "0")
 */
const lengthRegExp = new RegExp(
  `^\\s*([+-]?[0-9]*\\.?[0-9]+(?:[eE][+-]?[0-9]+)?)(${lengthUnits.join('|')})?\\s*$`
)

/**
 * Represents a CSS length value with numeric value and unit
 */
export class Length {
  constructor(
    public number: number,
    public unit?: string
  ) {}

  /**
   * Returns the CSS text representation of this length
   */
  get cssText(): string {
    return `${this.number}${this.unit ?? ''}`
  }

  /**
   * Creates a copy of this Length with the same values
   */
  clone(): Length {
    return new Length(this.number, this.unit)
  }

  /**
   * Returns a new Length with the number negated
   */
  negate(): Length {
    return new Length(-this.number, this.unit)
  }

  /**
   * Checks if this length is equal to another length
   */
  equals(other: Length): boolean {
    return this.number === other.number && this.unit === other.unit
  }

  /**
   * Parses a raw value into a Length object
   * Returns null if the value cannot be parsed as a valid length
   * 
   * @param raw - The value to parse (string, number, null, or undefined)
   * @returns A Length instance or null if parsing fails
   */
  static parse(raw: unknown): Length | null {
    // Handle numeric 0
    if (raw === 0) return new this(0)
    
    // Must be a string to continue
    if (typeof raw !== 'string') return null
    
    // Handle string "0" or "0px", etc.
    const trimmed = raw.trim()
    if (trimmed === '0' || parseFloat(trimmed) === 0) {
      // Try to extract unit from zero value
      const match = trimmed.match(lengthRegExp)
      return new this(0, match?.[2])
    }

    const match = trimmed.match(lengthRegExp)
    if (!match) return null

    const number = parseFloat(match[1])
    if (isNaN(number)) return null

    return new this(number, match[2])
  }

  /**
   * Parses a value with fallback to Tailwind spacing scale
   * If no unit is found, treats the value as a Tailwind spacing multiplier
   * 
   * @param raw - The value to parse
   * @param _rootFontSize - Root font size (unused, kept for API consistency)
   * @returns A Length instance or null if parsing fails
   */
  static parseWithSpacingFallback(raw: unknown, _rootFontSize = 16): Length | null {
    if (typeof raw !== 'string') return null
    
    const trimmed = raw.trim()
    
    // First try standard parsing
    const parsed = this.parse(trimmed)
    if (parsed && parsed.unit) return parsed
    
    // If no unit, treat as Tailwind spacing scale (1 = 0.25rem)
    const num = parseFloat(trimmed)
    if (!isNaN(num)) {
      return new this(num * 0.25, 'rem')
    }
    
    return null
  }

  /**
   * Converts a Length to rem units
   * 
   * @param rootFontSize - Root font size for conversion (default: 16)
   * @returns A new Length in rem units, or null if conversion not possible
   */
  toRem(rootFontSize = 16): Length | null {
    if (!this.unit) return null
    
    switch (this.unit) {
      case 'rem':
        return this.clone()
      case 'px':
        return new Length(this.number / rootFontSize, 'rem')
      case 'em':
        // Treat em as rem for simplicity in fluid calculations
        return new Length(this.number, 'rem')
      default:
        // Cannot convert other units to rem reliably
        return null
    }
  }

  /**
   * Converts a Length to pixel units
   * 
   * @param rootFontSize - Root font size for conversion (default: 16)
   * @returns A new Length in px units, or null if conversion not possible
   */
  toPx(rootFontSize = 16): Length | null {
    if (!this.unit) return null
    
    switch (this.unit) {
      case 'px':
        return this.clone()
      case 'rem':
      case 'em':
        return new Length(this.number * rootFontSize, 'px')
      default:
        // Cannot convert other units to px reliably
        return null
    }
  }
}

