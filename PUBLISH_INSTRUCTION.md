# Publishing a New Version

## Prerequisites (one-time setup)

1. **Add NPM_TOKEN to GitHub Secrets**
   - Go to https://www.npmjs.com → Access Tokens → Generate New Token (type: **Automation**)
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret", name it `NPM_TOKEN`, paste the token

2. **Push existing tags** (if not done already)
   ```bash
   git push origin --tags
   ```

## Release Workflow

Every time you want to publish a new version:

```bash
# 1. Make sure you're on main with a clean working tree
git checkout main
git pull

# 2. Bump version (pick one)
pnpm version patch   # e.g. 1.1.4 → 1.1.5
pnpm version minor   # e.g. 1.1.4 → 1.2.0
pnpm version major   # e.g. 1.1.4 → 2.0.0

# 3. Push commit + tag
git push origin main --follow-tags
```

Done. The GitHub Action (`.github/workflows/release.yml`) will automatically:

1. Install dependencies
2. Build the project
3. Run tests
4. Publish to npm
5. Create a GitHub Release with auto-generated notes

## What `pnpm version` does

- Bumps the `version` field in `package.json`
- Creates a git commit: `vX.Y.Z`
- Creates a git tag: `vX.Y.Z`

The tag push triggers the release workflow.

## Manual Release (if needed)

If you need to publish without the CI workflow:

```bash
pnpm build
pnpm test:run
pnpm publish
git tag v<version>
git push origin --tags
gh release create v<version> --generate-notes --latest
```
