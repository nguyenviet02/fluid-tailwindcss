# Testing Guide

## Test Runner

The root package uses Vitest.

```bash
pnpm test:run
```

Use watch mode during development:

```bash
pnpm test
```

## Type and Build Checks

```bash
pnpm lint
pnpm build
```

`pnpm lint` runs TypeScript with `--noEmit`. `pnpm build` runs `tsup` and emits ESM, CJS, and declaration files under `dist/`.

## Test Areas

| File | Focus |
| --- | --- |
| `tests/clamp.test.ts` | clamp formatting, math, accessibility helpers. |
| `tests/length.test.ts` | CSS length parsing and unit conversion. |
| `tests/validation.test.ts` | unit compatibility, value validation, arbitrary value parsing. |
| `tests/errors.test.ts` | typed error messages and result helpers. |
| `tests/utilities.test.ts` | utility definitions and default scales. |
| `tests/generate-fluid-values.test.ts` | plugin registration, O(n) value strategy, numeric spacing values. |
| `tests/tailwind-merge.test.ts` | merge validators, conflict groups, custom merge helpers. |
| `tests/arbitrary-fluid-merge.test.ts` | arbitrary fluid value merge behavior. |
| `tests/advanced-features.test.ts` | negative values, container query mode, debug behavior. |
| `tests/performance.test.ts` | performance expectations. |

## What to Test When Changing Behavior

- New utility: generated CSS declaration and merge conflict behavior.
- Clamp math: exact output for rem/px, negative values, equal values, and invalid units.
- Parser changes: valid and invalid class syntax, arbitrary values, decimal spacing values.
- Tailwind v4 integration: `value` plus `modifier` reconstruction.
- Performance-sensitive generation: preserve O(n) registered values.

## Homepage Checks

The homepage is a Vite React app in `homepage/`.

```bash
cd homepage
pnpm lint
pnpm build
pnpm dev
```

For UI changes, open the dev server and verify the changed section, mobile layout, and navigation behavior when possible.
