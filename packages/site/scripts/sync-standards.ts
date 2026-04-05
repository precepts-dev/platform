#!/usr/bin/env node

/**
 * Syncs standards from @precepts/standards package into the local docs/ directory.
 * docs/ is a build artifact for Docusaurus - the source of truth is precepts-standards repo.
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

if (!fs.existsSync(STANDARDS_PKG)) {
  console.error('Error: @precepts/standards package not found. Run pnpm install first.');
  process.exit(1);
}

// Remove existing docs and copy fresh from package
if (fs.existsSync(DOCS_DIR)) {
  fs.rmSync(DOCS_DIR, { recursive: true });
}

fs.cpSync(STANDARDS_PKG, DOCS_DIR, { recursive: true });

const files = fs.readdirSync(DOCS_DIR, { recursive: true });
const count = files.filter((f) => String(f).endsWith('.md')).length;

console.log(`Synced ${count} files from @precepts/standards into docs/`);
