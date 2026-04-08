---
name: docusaurus
description: >
  Research and fix Docusaurus-related issues including build errors, broken links,
  sidebar configuration, plugin problems, theming, and deployment. Use when any
  Docusaurus issue is reported or when working on site configuration.
argument-hint: "[description of the issue]"
allowed-tools: Bash(pnpm build) Bash(pnpm dev) Bash(pnpm serve) Bash(pnpm --filter @precepts/site *)
---

# Docusaurus Issue Resolution

You are fixing a Docusaurus issue in a pnpm monorepo. The site package is at `packages/site/`.

Installed Docusaurus version:

```!
node -p "require('./packages/site/node_modules/@docusaurus/core/package.json').version" 2>/dev/null || echo "unknown"
```

## Project context

- Docusaurus classic preset, no blog, `onBrokenLinks: 'throw'` (version detected above)
- Content synced from `@precepts/standards` via `packages/site/scripts/sync-standards.ts`
- Presentation files (_category_.json, index.md) owned in `packages/site/docs-meta/`
- Custom `sidebarItemsGenerator` in docusaurus.config.ts for sidebar ordering
- Warm paper + sage theme, DM Sans + JetBrains Mono fonts
- Search plugin: `@easyops-cn/docusaurus-search-local`

## Current state

```!
cd /Users/dishant/personal-workspace/platform && git diff --stat HEAD 2>/dev/null || echo "clean"
```

## Step 1: Diagnose

1. Reproduce the issue:
   - `pnpm build` — check for build errors (broken links throw)
   - `pnpm dev` — test the dev server for rendering issues
2. Read the relevant config files:
   - `packages/site/docusaurus.config.ts` — site config, plugins, sidebar generator
   - `packages/site/sidebars.ts` — sidebar definitions
   - `packages/site/src/css/custom.css` — custom styles
   - `packages/site/src/theme/` — swizzled components
   - `packages/site/docs-meta/` — category and landing page overrides

## Step 2: Research

3. Search the codebase for related code with Grep and Glob
4. Consult Docusaurus docs at https://docusaurus.io for the relevant topic
5. Search for known issues or community solutions if needed

## Step 3: Fix

6. Apply the minimal fix — change only what's necessary
7. If the fix involves sidebar ordering or categories, update `docs-meta/` or `docusaurus.config.ts` (never the synced `docs/` directory)
8. If the fix involves styling, update `src/css/custom.css` or swizzled components

## Step 4: Verify

9. Run `pnpm build` — must pass cleanly
10. Run `pnpm dev` if the fix affects rendering
11. Summarize what was changed and why

## Issue description

$ARGUMENTS
