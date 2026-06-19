# CLAUDE.md

This file gives AI agents project-specific guidance for working in this repository.

## Project Summary

`fluid-tailwindcss` is a TypeScript Tailwind CSS plugin that creates fluid responsive utilities such as `fl-text-base/2xl` and `fl-p-4/8`. It emits CSS `clamp()` declarations and ships a `fluid-tailwindcss/tailwind-merge` integration.

A Vite React homepage lives in `homepage/` and consumes the package through the pnpm workspace.

## Read First

Before code changes, read:

1. `ARCHITECTURE.md` for project structure and invariants.
2. The specific source file you will edit.
3. The matching tests in `tests/`.

## Important Files

- `src/index.ts`: Tailwind plugin registration and public exports.
- `src/clamp.ts`: fluid math and clamp generation.
- `src/variables.ts`: resolution, namespacing, and config/theme extensions for fluid variables.
- `src/utilities.ts`: supported `fl-*` utility definitions.
- `src/tailwind-merge/index.ts`: merge groups and conflict behavior.
- `src/types.ts`: public and internal TypeScript types.
- `tests/`: Vitest test suite.
- `homepage/src/`: React documentation/demo site.

## Coding Rules

- Prefer small, targeted changes.
- Do not edit `dist/` manually.
- Do not add broad abstractions unless the current change needs them.
- Keep public exports and type declarations stable unless the task is explicitly breaking.
- Avoid comments unless they explain a non-obvious invariant or Tailwind-specific behavior.
- Keep implementation and tests synchronized.

## Tailwind Plugin Rules

- Tailwind v4 slash classes arrive as `value` plus `extra.modifier`; reconstruct `min/max` before parsing.
- Negative fluid utilities use `neg-fl-*`, not `-fl-*`, for plugin-generated utilities.
- Bare numeric spacing values must keep working, including decimals such as `fl-mt-4.5/10`.
- Lowercase option aliases such as `minviewport` and `checkaccessibility` are intentional for CSS `@plugin` compatibility.
- Unit validation should reject incompatible arbitrary values while allowing zero to adopt the other value's unit.
- Fluid CSS Variables must be namespaced under `--fluid-<name>` in `:root` and registered as theme key extensions pointing to `var(--fluid-<name>)` to avoid colliding with Tailwind's generated custom properties.

## Synchronization Checklist

When adding or changing a fluid utility:

1. Update `src/utilities.ts`.
2. Update plugin registration in `src/index.ts` if special handling is needed.
3. Update `src/tailwind-merge/index.ts` class groups/conflicts.
4. Add or update tests in `tests/`.
5. Run validation commands.

## Validation Commands

From the repository root:

```bash
pnpm test:run
pnpm lint
pnpm build
```

If pnpm is unavailable, use npm equivalents:

```bash
npm run test:run
npm run lint
npm run build
```

For homepage changes from `homepage/`:

```bash
pnpm lint
pnpm build
pnpm dev
```

For UI changes, manually inspect the homepage in a browser when possible.

## Common Pitfalls

- Forgetting to update `tailwind-merge` groups after adding a new utility.
- Breaking Tailwind v4 slash modifier reconstruction.
- Generating O(n²) min/max pairs instead of preserving O(n) value registration.
- Producing noisy warnings for cross-unit theme scales outside debug mode.
- Treating `dist/` as source of truth.
