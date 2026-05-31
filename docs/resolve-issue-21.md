# Resolve Issue #21: Layout Viewport Options

## Goal

Add `minLayoutViewport` and `maxLayoutViewport` options so fluid values match exact design breakpoints (e.g. Figma artboards) while the fluid scaling continues beyond those points until clamped at the global viewport boundaries.

## Problem

Currently, `minViewport` and `maxViewport` serve dual purposes:
1. The points where min/max values are reached
2. The clamp boundaries (where scaling stops)

Users working with Figma need values to match at specific layout widths (e.g. 480px mobile, 1024px desktop) but want fluid scaling to continue beyond those points for a smoother experience on very small or very large screens.

## Proposed Syntax

### Global config

```css
@plugin "fluid-tailwindcss" {
  minViewport: 375;
  maxViewport: 1440;
  minLayoutViewport: 480;
  maxLayoutViewport: 1024;
}
```

### Behavior

With `fl-p-4/8` (16px → 32px):

| Viewport | Current behavior | New behavior (with layout viewports) |
|----------|-----------------|--------------------------------------|
| 375px | 16px (clamped) | ~12.7px (clamped) |
| 480px | ~18.5px (scaling) | 16px (matches Figma mobile) |
| 900px | ~25px (scaling) | ~28.4px (scaling) |
| 1024px | ~27px (scaling) | 32px (matches Figma desktop) |
| 1440px | 32px (clamped) | ~44.2px (clamped) |

### Math

```
slope = (maxValue - minValue) / (maxLayoutViewport - minLayoutViewport)
      = (32 - 16) / (1024 - 480)
      = 0.0294 px/px

extrapolatedMin = minValue - slope * (minLayoutViewport - minViewport)
                = 16 - 0.0294 * (480 - 375)
                = 12.91px

extrapolatedMax = maxValue + slope * (maxViewport - maxLayoutViewport)
                = 32 + 0.0294 * (1440 - 1024)
                = 44.24px

Result: clamp(12.91px, <slope based on 375→1440 range>, 44.24px)
```

The slope in the clamp formula uses the **viewport** range (375→1440) since that's the actual vw scaling range. The layout viewports only determine where the "design values" land on that line.

## Examples

### Example 1: Typography matching Figma

```css
@plugin "fluid-tailwindcss" {
  minViewport: 375;
  maxViewport: 1920;
  minLayoutViewport: 768;
  maxLayoutViewport: 1440;
}
```

```html
<h1 class="fl-text-2xl/5xl">Heading</h1>
```

- At 768px → exactly `1.5rem` (matches tablet Figma)
- At 1440px → exactly `3rem` (matches desktop Figma)
- Below 768px → keeps shrinking until clamped at 375px
- Above 1440px → keeps growing until clamped at 1920px

### Example 2: Spacing with breathing room

```css
@plugin "fluid-tailwindcss" {
  minViewport: 320;
  maxViewport: 1600;
  minLayoutViewport: 375;
  maxLayoutViewport: 1440;
}
```

```html
<section class="fl-px-4/16">
  Content with fluid horizontal padding
</section>
```

- At 375px → exactly `1rem` padding
- At 1440px → exactly `4rem` padding
- At 320px → slightly less than 1rem (extrapolated)
- At 1600px → slightly more than 4rem (extrapolated)

### Example 3: Without layout viewports (no change)

If `minLayoutViewport` / `maxLayoutViewport` are not set, behavior is identical to current:

```css
@plugin "fluid-tailwindcss" {
  minViewport: 375;
  maxViewport: 1440;
}
```

```html
<div class="fl-p-4/8">Same as today</div>
```

## Tasks

- [ ] Add `minLayoutViewport` and `maxLayoutViewport` to `FluidOptions` in `src/types.ts` (with lowercase aliases for Prettier).
- [ ] Add the fields to `ResolvedFluidOptions` (optional, default to `undefined`).
- [ ] Update option resolution in `src/index.ts` to pass layout viewports through.
- [ ] Add an extrapolation function in `src/clamp.ts` that recalculates min/max values when layout viewports are present.
- [ ] Ensure the extrapolation works with both `rem` and `px` output modes.
- [ ] Ensure per-utility breakpoint ranges (`fl-p-4/8--md-lg`) still override correctly — layout viewports should NOT apply when a per-class range is specified.
- [ ] Add tests: global layout viewport config produces correct extrapolated clamp values.
- [ ] Add tests: layout viewports are ignored when per-utility breakpoint range is used.
- [ ] Add tests: omitting layout viewports produces identical output to current behavior (no regression).
- [ ] Add tests: edge case where `minLayoutViewport === minViewport` (no extrapolation on min side).
- [ ] Run `pnpm test:run` and `pnpm lint` → verify all pass.

## Constraints

- Layout viewports must be between the global viewport boundaries: `minViewport <= minLayoutViewport < maxLayoutViewport <= maxViewport`.
- If layout viewports equal the global viewports, behavior is identical to current (no-op).
- Validation should warn if layout viewports are outside the global viewport range.
- This is purely additive — no breaking changes to existing behavior.

## Done When

- [ ] `fl-p-4/8` with layout viewports produces extrapolated clamp values.
- [ ] `fl-text-base/2xl` with layout viewports produces correct fluid typography.
- [ ] Omitting layout viewports produces identical output to current version.
- [ ] Per-utility breakpoint ranges bypass layout viewport extrapolation.
- [ ] All existing tests still pass.
