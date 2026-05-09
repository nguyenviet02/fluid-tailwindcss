# Contributing

## Before You Start

Read `ARCHITECTURE.md` and `CLAUDE.md` to understand the package structure and invariants.

## Local Checks

Run these before opening a pull request:

```bash
pnpm test:run
pnpm lint
pnpm build
```

For homepage changes:

```bash
cd homepage
pnpm lint
pnpm build
```

## Pull Request Checklist

- Tests cover the changed behavior.
- Public exports remain intentional.
- `src/utilities.ts` and `src/tailwind-merge/index.ts` are synchronized for new utilities.
- README/homepage examples are updated for user-facing behavior changes.
- `dist/` is not manually edited.

## Commit Scope Suggestions

- `fix`: bug fixes.
- `feat`: new utility or public feature.
- `test`: test-only changes.
- `docs`: documentation changes.
- `chore`: tooling/package maintenance.
