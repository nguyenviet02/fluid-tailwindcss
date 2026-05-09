# Resolve Issue #8

## Goal
Allow fluid utilities to generate CSS for Tailwind v4-style non-default numeric spacing values such as `fl-mt-6/15`, without requiring bracket syntax like `fl-mt-[6/15]`.

## Findings
- `src/index.ts` registers each utility through `matchUtilities` with `values: fluidValues` and `modifiers: "any"`.
- The handlers already reconstruct slash syntax from Tailwind v4 modifier parsing: `value="6"`, `modifier="15"` → `6/15`.
- `resolveThemeValue` in `src/clamp.ts` already supports numeric spacing fallback: `15` → `3.75rem`.
- The gap is registration: `generateFluidValues` only includes existing theme keys, so a non-default base value like `15` is rejected before fallback resolution can help.
- Arbitrary bracket syntax works because Tailwind routes it through the arbitrary-value path.

## Tasks
- [ ] Add a failing integration-style test for `fl-mt-6/15` → Verify it produces `margin-top` with a clamp using `1.5rem` and `3.75rem`.
- [ ] Add coverage for another spacing utility such as `fl-pb-10/30` → Verify it produces `padding-bottom` with numeric fallback values.
- [ ] Add coverage for negative numeric fallback, e.g. `neg-fl-mt-6/15` → Verify generated clamp values are negated.
- [ ] Add coverage that theme keys still work, e.g. `fl-p-4/8` → Verify no regression in existing scale-based classes.
- [ ] Update utility registration in `src/index.ts` so spacing-scale fluid utilities can accept numeric values not present in `fluidValues` while preserving autocomplete-friendly known values.
- [ ] Reuse existing parsing and resolution functions: `parseFluidString`, `parseArbitraryValue`, `resolveThemeValue`, `validateFluidUnits`, and `calculateClampAdvanced`.
- [ ] Apply the same matching behavior to normal, space, translate, and negative utility registrations because they share the same value flow.
- [ ] Keep non-spacing scales conservative unless explicitly supported: font size, line height, letter spacing, border radius, and border width should still resolve via theme keys or explicit arbitrary values.
- [ ] Run `npm run test:run` and `npm run lint` → Verify tests and TypeScript pass.

## Done When
- [ ] `fl-mt-6/15` generates CSS without brackets.
- [ ] `fl-pb-10/30` generates CSS without brackets.
- [ ] Existing bracket syntax like `fl-pb-[10/30]` still works.
- [ ] Existing scale syntax like `fl-p-4/8` still works.
- [ ] Invalid or cross-unit pairs still return no CSS and do not introduce noisy warnings outside debug mode.
