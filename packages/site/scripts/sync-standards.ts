#!/usr/bin/env node

/**
 * Syncs standards from @precepts/standards package into the local docs/ directory.
 *
 * docs/ is a build artifact for Docusaurus — the source of truth for standard
 * content is the precepts-standards repo. Docusaurus presentation artifacts
 * (_category_.json, index.md landing pages) are owned by this repo in docs-meta/.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STANDARDS_PKG = path.resolve(
  __dirname,
  '..',
  'node_modules',
  '@precepts',
  'standards',
  'standards'
);
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const DOCS_META = path.resolve(__dirname, '..', 'docs-meta');

if (!fs.existsSync(STANDARDS_PKG)) {
  console.error('Error: @precepts/standards package not found. Run pnpm install first.');
  process.exit(1);
}

// Clean slate
fs.rmSync(DOCS_DIR, { recursive: true, force: true });

// Step 1: Copy standard content from the package, skipping Docusaurus artifacts
const SKIP_FILES = new Set(['_category_.json', 'index.md']);

function copyStandards(src: string, dest: string): number {
  let count = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      count += copyStandards(srcPath, destPath);
    } else if (!SKIP_FILES.has(entry.name)) {
      if (entry.name.endsWith('.md')) {
        // Apply MDX safety pass: `<digit` breaks the MDX compiler (treats it as
        // a JSX tag). Add a space so `<1` becomes `< 1` — visually identical but
        // safe for both MDX and plain-Markdown consumers.
        const raw = fs.readFileSync(srcPath, 'utf-8');
        const safe = raw.replace(/<(\d)/g, '< $1');
        fs.writeFileSync(destPath, safe, 'utf-8');
        count++;
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  return count;
}

const standardsCount = copyStandards(STANDARDS_PKG, DOCS_DIR);

// Step 2: Overlay platform-owned Docusaurus metadata (landing pages + categories)
let metaCount = 0;

if (fs.existsSync(DOCS_META)) {
  fs.cpSync(DOCS_META, DOCS_DIR, { recursive: true });
  const metaFiles = fs.readdirSync(DOCS_META, { recursive: true });
  metaCount = metaFiles.filter((f) => {
    const name = String(f);
    return name.endsWith('.md') || name.endsWith('.json');
  }).length;
}

// Step 3: Auto-generate _category_.json for any directory that doesn't have one.
// This ensures new folders added to the standards repo get a reasonable sidebar
// label without requiring a manual docs-meta/ entry. Labels are derived from
// directory names (e.g. "data-formats" → "Data Formats"). To override the
// auto-generated label or set a position, add an entry in docs-meta/.
function toLabel(dirName: string): string {
  return dirName
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

let autoGenCount = 0;

function generateMissingCategories(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const subdirs = entries.filter((e) => e.isDirectory());

  for (const sub of subdirs) {
    const subPath = path.join(dir, sub.name);
    const categoryFile = path.join(subPath, '_category_.json');

    if (!fs.existsSync(categoryFile)) {
      fs.writeFileSync(
        categoryFile,
        JSON.stringify({ label: toLabel(sub.name) }) + '\n'
      );
      autoGenCount++;
    }

    generateMissingCategories(subPath);
  }
}

generateMissingCategories(DOCS_DIR);

// Step 4: Copy CHANGELOG.md to docs/community/changelog.md
const CHANGELOG_SRC = path.resolve(__dirname, '..', 'CHANGELOG.md');
const CHANGELOG_DEST = path.resolve(DOCS_DIR, 'community', 'changelog.md');
if (fs.existsSync(CHANGELOG_SRC)) {
  fs.mkdirSync(path.dirname(CHANGELOG_DEST), { recursive: true });

  const raw = fs.readFileSync(CHANGELOG_SRC, 'utf-8');
  // Strip the package-name H1 (e.g. "# @precepts/site\n") — the frontmatter
  // title renders as the page heading instead.
  const body = raw.replace(/^#[^\n]*\n\n?/, '');

  const changelogWithFrontmatter = `---
id: changelog
title: Changelog
sidebar_label: Changelog
sidebar_position: 1
slug: /changelog
---

${body}`;

  fs.writeFileSync(CHANGELOG_DEST, changelogWithFrontmatter, 'utf-8');
}

const parts = [`Synced ${standardsCount} standards from @precepts/standards into docs/`];
if (metaCount > 0) parts.push(`${metaCount} platform metadata files`);
if (autoGenCount > 0) parts.push(`${autoGenCount} auto-generated categories`);
console.log(parts.length > 1 ? `${parts[0]} (+ ${parts.slice(1).join(', ')})` : parts[0]);
