# AI Agent Guide

Use this guide when making automated changes in this repository.

## Fast Orientation

This project has two parts:

1. Root package: TypeScript Tailwind CSS plugin published as `fluid-tailwindcss`.
2. `homepage/`: Vite React site that demonstrates and documents the plugin.

The root package is the source of truth. The homepage is a consumer and integration surface.

## Decision Tree

### If the task changes generated CSS output

Edit `src/clamp.ts`, `src/index.ts`, or `src/utilities.ts` depending on whether the change is math, registration, or utility mapping. Add tests that assert actual emitted declarations.

### If the task changes available class names

Update both:

- `src/utilities.ts`
- `src/tailwind-merge/index.ts`

Then add tests for plugin registration and merge conflicts.

### If the task changes parsing or validation

Check these files together:

- `src/length.ts`
- `src/validation.ts`
- `src/clamp.ts`
- `tests/validation.test.ts`
- `tests/length.test.ts`

### If the task changes package exports

Update:

- `src/index.ts`
- `src/types.ts` if new public types are needed
- `package.json` only if a new entry point is required
- `tsup.config.ts` only if build outputs change

### If the task changes homepage UI/docs

Edit files under `homepage/src/`. Run homepage lint/build and manually verify in browser when possible.

## Required Verification by Change Type

| Change Type | Minimum Verification |
| --- | --- |
| Clamp math | `pnpm test:run`, `pnpm lint`, `pnpm build` |
| Utility mapping | `pnpm test:run`, `pnpm lint`, `pnpm build` |
| Merge behavior | `pnpm test:run` with merge tests covered |
| Public types/exports | `pnpm lint`, `pnpm build`, `pnpm test:run` |
| Homepage only | `cd homepage && pnpm lint && pnpm build` plus browser check when possible |

## Public API Surfaces

Treat these as public or user-visible:

- Default export from `fluid-tailwindcss`.
- Named exports from `src/index.ts`.
- Types exported from `src/index.ts`.
- Subpath export `fluid-tailwindcss/tailwind-merge`.
- Utility syntax documented in `README.md`.
- Homepage examples.

## High-Risk Areas

- `src/index.ts` handler reconstruction of `value/modifier` for Tailwind v4.
- `generateFluidValues()` performance behavior.
- `src/tailwind-merge/index.ts` conflict group names matching `tailwind-merge` internals.
- Arbitrary value regexes and unit mismatch validation.
- Package export paths in `package.json`.

## Preferred Implementation Style

- Make the smallest coherent change.
- Add tests next to the behavior being changed.
- Prefer explicit utility mappings over clever generation when public class behavior is involved.
- Keep examples in README/homepage aligned with implementation.
