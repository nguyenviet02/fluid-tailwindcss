# tailwind-fluid

Build better responsive designs in less code using CSS `clamp()` for TailwindCSS v3 & v4.

[![npm version](https://badge.fury.io/js/tailwind-fluid.svg)](https://badge.fury.io/js/tailwind-fluid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Works with every utility** - Padding, margin, font-size, width, height, gap, and more
- **Full IntelliSense support** - Autocomplete for all fluid utilities in VS Code
- **First-class tailwind-merge support** - Properly resolves conflicts with regular utilities
- **Accessibility compliance** - Warns about font sizes that may be too small
- **TailwindCSS v4 compatible** - Works with the new CSS-first configuration
- **TailwindCSS v3 compatible** - Also works with traditional JavaScript configuration

## Installation

```bash
npm install tailwind-fluid
# or
pnpm add tailwind-fluid
# or
yarn add tailwind-fluid
```

## Quick Start

### 1. Add the plugin to your CSS file

TailwindCSS v4 uses a CSS-first approach. Add the plugin using the `@plugin` directive:

```css
/* app.css */
@import "tailwindcss";
@plugin "tailwind-fluid";
```

### 2. Use fluid utilities in your HTML

```html
<h1 class="fl-text-2xl/5xl fl-p-4/8">
  Fluid Typography and Spacing
</h1>
```

This generates:

```css
.fl-text-2xl\/5xl {
  font-size: clamp(1.5rem, 1.0282rem + 2.0657vw, 3rem);
}
.fl-p-4\/8 {
  padding: clamp(1rem, 0.5282rem + 2.0657vw, 2rem);
}
```

## Usage with TailwindCSS v3

While this plugin is primarily designed for TailwindCSS v4, it can also work with **TailwindCSS v3** using the traditional JavaScript configuration approach.

### Installation for v3

Since the package specifies `tailwindcss ^4.0.0` as a peer dependency, you'll need to install with the `--legacy-peer-deps` flag:

```bash
npm install tailwind-fluid --legacy-peer-deps
# or
pnpm add tailwind-fluid --ignore-peer-deps
# or
yarn add tailwind-fluid --ignore-engines
```

### Configuration for v3

Add the plugin to your `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-fluid')({
      minViewport: 375,
      maxViewport: 1440,
      useRem: true,
      rootFontSize: 16,
      checkAccessibility: true,
    })
  ]
}
```

### Usage in v3

The fluid utilities work the same way in v3:

```html
<h1 class="fl-text-2xl/5xl fl-p-4/8">
  Fluid Typography and Spacing
</h1>
```

> **Note:** The CSS-based `@plugin` directive is **not available** in TailwindCSS v3. You must use the JavaScript configuration approach shown above.

## Syntax

The fluid utility syntax is:

```
fl-{utility}-{min}/{max}
```

Where:
- `fl-` is the prefix that indicates a fluid utility
- `{utility}` is any supported Tailwind utility (p, m, text, w, h, gap, etc.)
- `{min}` is the minimum value from the Tailwind scale
- `{max}` is the maximum value from the Tailwind scale

### Examples

| Class | Description |
|-------|-------------|
| `fl-p-4/8` | Fluid padding from 1rem to 2rem |
| `fl-text-base/2xl` | Fluid font-size from 1rem to 1.5rem |
| `fl-m-2/6` | Fluid margin from 0.5rem to 1.5rem |
| `fl-gap-4/8` | Fluid gap from 1rem to 2rem |
| `fl-w-64/96` | Fluid width from 16rem to 24rem |

## Configuration

### Default Options

The plugin uses these defaults:

```javascript
{
  minViewport: 375,   // Minimum viewport width in pixels
  maxViewport: 1440,  // Maximum viewport width in pixels
  useRem: true,       // Use rem units (vs px)
  rootFontSize: 16,   // Root font size for rem calculations
  checkAccessibility: true  // Warn about small font sizes
}
```

### Custom Configuration

#### Option A: CSS-based configuration (Recommended for TailwindCSS v4)

```css
@import "tailwindcss";
@plugin "tailwind-fluid" {
  minViewport: 320;
  maxViewport: 1920;
}
```

#### Option B: Legacy JavaScript config

If you need JavaScript-based configuration, you can use the `@config` directive to load a traditional config file:

```css
/* app.css */
@import "tailwindcss";
@config "./tailwind.config.js";
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('tailwind-fluid')({
      minViewport: 320,
      maxViewport: 1920,
      useRem: true,
      rootFontSize: 16,
      checkAccessibility: true,
    })
  ]
}
```

## Supported Utilities

### Spacing

| Utility | CSS Property |
|---------|-------------|
| `fl-p` | `padding` |
| `fl-px` | `padding-left`, `padding-right` |
| `fl-py` | `padding-top`, `padding-bottom` |
| `fl-pt`, `fl-pr`, `fl-pb`, `fl-pl` | Individual padding |
| `fl-ps`, `fl-pe` | `padding-inline-start`, `padding-inline-end` |
| `fl-m` | `margin` |
| `fl-mx` | `margin-left`, `margin-right` |
| `fl-my` | `margin-top`, `margin-bottom` |
| `fl-mt`, `fl-mr`, `fl-mb`, `fl-ml` | Individual margin |
| `fl-ms`, `fl-me` | `margin-inline-start`, `margin-inline-end` |

### Typography

| Utility | CSS Property |
|---------|-------------|
| `fl-text` | `font-size` |
| `fl-leading` | `line-height` |
| `fl-tracking` | `letter-spacing` |

### Sizing

| Utility | CSS Property |
|---------|-------------|
| `fl-w` | `width` |
| `fl-h` | `height` |
| `fl-size` | `width` + `height` |
| `fl-min-w` | `min-width` |
| `fl-max-w` | `max-width` |
| `fl-min-h` | `min-height` |
| `fl-max-h` | `max-height` |

### Layout

| Utility | CSS Property |
|---------|-------------|
| `fl-gap` | `gap` |
| `fl-gap-x` | `column-gap` |
| `fl-gap-y` | `row-gap` |
| `fl-inset` | `inset` |
| `fl-top`, `fl-right`, `fl-bottom`, `fl-left` | Positioning |
| `fl-space-x` | Space between (horizontal) |
| `fl-space-y` | Space between (vertical) |

### Border

| Utility | CSS Property |
|---------|-------------|
| `fl-rounded` | `border-radius` |
| `fl-rounded-t`, `fl-rounded-r`, `fl-rounded-b`, `fl-rounded-l` | Side radius |
| `fl-rounded-tl`, `fl-rounded-tr`, `fl-rounded-br`, `fl-rounded-bl` | Corner radius |
| `fl-border` | `border-width` |

### Transform

| Utility | CSS Property |
|---------|-------------|
| `fl-translate-x` | `--tw-translate-x` |
| `fl-translate-y` | `--tw-translate-y` |

### Scroll

| Utility | CSS Property |
|---------|-------------|
| `fl-scroll-m`, `fl-scroll-mx`, `fl-scroll-my` | Scroll margin |
| `fl-scroll-p`, `fl-scroll-px`, `fl-scroll-py` | Scroll padding |

## Tailwind Merge Integration

The package includes first-class support for `tailwind-merge`. This ensures fluid utilities properly conflict with their non-fluid counterparts.

### Basic Usage

```javascript
import { twMerge } from 'tailwind-fluid/tailwind-merge'

// Fluid utility wins (last one)
twMerge('p-4', 'fl-p-4/8')  // => 'fl-p-4/8'

// Regular utility wins (last one)
twMerge('fl-p-4/8', 'p-4')  // => 'p-4'

// Different utilities are preserved
twMerge('fl-p-4/8', 'fl-m-2/6', 'text-lg')  // => 'fl-p-4/8 fl-m-2/6 text-lg'
```

### Extending Your Own tailwind-merge

```javascript
import { extendTailwindMerge } from 'tailwind-merge'
import { withFluid } from 'tailwind-fluid/tailwind-merge'

const twMerge = extendTailwindMerge(withFluid, {
  // Your additional config
})
```

### Creating a Custom Instance

```javascript
import { createTwMerge } from 'tailwind-fluid/tailwind-merge'

const twMerge = createTwMerge({
  // Additional tailwind-merge config
})
```

## How It Works

The plugin uses the CSS `clamp()` function to create fluid values that smoothly transition between a minimum and maximum value based on the viewport width.

### The Formula

```
clamp(minValue, preferredValue, maxValue)
```

Where the preferred value is calculated as:

```
preferredValue = minValue + (maxValue - minValue) * ((100vw - minViewport) / (maxViewport - minViewport))
```

This simplifies to:

```
clamp(minRem, intercept + slope * 100vw, maxRem)
```

### Example Calculation

For `fl-p-6/10` (padding from 1.5rem to 2.5rem):

- Min viewport: 375px (23.4375rem)
- Max viewport: 1440px (90rem)
- Min value: 1.5rem
- Max value: 2.5rem

```
slope = (2.5 - 1.5) / (90 - 23.4375) = 0.01502
intercept = 1.5 - 0.01502 * 23.4375 = 1.148rem
vw factor = 0.01502 * 100 = 1.502vw
```

Result:
```css
padding: clamp(1.5rem, 1.148rem + 1.502vw, 2.5rem)
```

## Accessibility

The plugin includes accessibility checks for typography utilities. When `checkAccessibility` is enabled (default), it warns if fluid typography minimum sizes are below recommended thresholds:

- Below 12px: Warning issued (may be too small for readability)
- WCAG 1.4.4 recommends allowing text to scale up to 200% without loss of content

To disable accessibility checks:

```css
@plugin "tailwind-fluid" {
  checkAccessibility: false;
}
```

## IntelliSense Support

The plugin automatically works with the official Tailwind CSS IntelliSense extension. All fluid utilities will show up in autocomplete with their generated CSS values.

For best results, ensure you have the latest version of the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) VS Code extension installed.

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:run -- --coverage

# Watch mode
npm run test
```

### Versioning

Follow semantic versioning:
- **Patch** (1.0.x): Bug fixes
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## Browser Support

CSS `clamp()` is supported in all modern browsers:
- Chrome 79+
- Firefox 75+
- Safari 13.1+
- Edge 79+

For older browser support, consider using a PostCSS plugin like [postcss-clamp](https://github.com/nicksheffield/postcss-clamp).

## TypeScript Support

The package is written in TypeScript and includes full type definitions. Import types as needed:

```typescript
import type { FluidOptions, ResolvedFluidOptions } from 'tailwind-fluid'
```

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting a PR.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit: `git commit -am 'Add new feature'`
6. Push: `git push origin feature/my-feature`
7. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

Inspired by:
- [fluid.tw](https://fluid.tw)
- [tailwind-clamp](https://github.com/nicolas-cusan/tailwind-clamp)
- [Utopia](https://utopia.fyi)

## Related Projects

- [TailwindCSS](https://tailwindcss.com)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [clamp calculator](https://min-max-calculator.9elements.com/)

