#!/usr/bin/env node

/**
 * Generates static/llms.txt from the installed @precepts/standards package.
 *
 * Run before docusaurus build — this file is then served as-is from the site root.
 * The static/llms.txt checked into the repo is the seed; this script overwrites it
 * on every build so it always reflects the currently installed standards version.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STANDARDS_PKG = path.resolve(
  __dirname,
  '..',
  'node_modules',
  '@precepts',
  'standards',
  'standards'
);
const OUT = path.resolve(__dirname, '..', 'static', 'llms.txt');
const SITE_URL = 'https://docs.precepts.dev';

const DOMAIN_LABELS: Record<string, string> = {
  INTEGRATION: 'Integration',
  'PRODUCT-MANAGEMENT': 'Product Management',
  'PROJECT-MANAGEMENT': 'Project Management',
  UX: 'UX',
  SECURITY: 'Security',
};

const DOMAIN_ORDER = [
  'INTEGRATION',
  'PRODUCT-MANAGEMENT',
  'PROJECT-MANAGEMENT',
  'UX',
  'SECURITY',
];

interface Entry {
  identifier: string;
  name: string;
  status: string;
  domain: string;
  urlPath: string;
  description: string;
}

function firstSentence(content: string): string {
  // (?!#) skips the case where Purpose section is empty and next line is a ## header
  const match = content.match(/^## Purpose\s*\n+((?!#)[^\n]+)/m);
  if (!match) return '';
  const text = match[1]
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
  // Match period followed by whitespace+capital (sentence boundary), not decimal points
  const end = text.search(/\.\s+[A-Z]|\.\s*$/);
  return end !== -1 ? text.slice(0, end + 1) : text;
}

function collect(dir: string, base: string): Entry[] {
  const result: Entry[] = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      result.push(...collect(full, base));
    } else if (ent.name.endsWith('.md')) {
      const { data, content } = matter(fs.readFileSync(full, 'utf8'));
      if (!data.identifier || data.status === 'DEPRECATED') continue;
      const rel = path
        .relative(base, full)
        .replace(/\.md$/, '')
        .split(path.sep)
        .join('/');
      result.push({
        identifier: String(data.identifier),
        name: String(data.name ?? ''),
        status: String(data.status ?? ''),
        domain: String(data.domain ?? ''),
        urlPath: rel,
        description: firstSentence(content),
      });
    }
  }
  return result;
}

if (!fs.existsSync(STANDARDS_PKG)) {
  console.error('Error: @precepts/standards not found. Run pnpm install first.');
  process.exit(1);
}

const all = collect(STANDARDS_PKG, STANDARDS_PKG);
all.sort((a, b) => a.identifier.localeCompare(b.identifier));

const byDomain = new Map<string, Entry[]>();
for (const e of all) {
  const d = e.domain || 'UNKNOWN';
  if (!byDomain.has(d)) byDomain.set(d, []);
  byDomain.get(d)!.push(e);
}

const orderedDomains = [
  ...DOMAIN_ORDER.filter((d) => byDomain.has(d)),
  ...[...byDomain.keys()].filter((d) => !DOMAIN_ORDER.includes(d)),
];

const lines: string[] = [
  '# Precepts',
  '',
  '> Multi-discipline standards platform. Machine-readable standards for humans and AI agents.',
  '> Standards are published as Markdown with YAML frontmatter, consumable by agents via MCP, llms.txt, and CLAUDE.md.',
  '',
  '## Schema',
  '',
  'Identifier pattern: [INTG|PRD|PRJ|UX|SEC]-[STD|GDL|GOV|BP]-NNN',
  'Status values: DRAFT, MANDATORY, RECOMMENDED, DEPRECATED',
  'Document types: standard, guideline, governance, best-practice',
  'Domains: INTEGRATION, PRODUCT-MANAGEMENT, PROJECT-MANAGEMENT, UX, SECURITY',
  'Version: semver (patch = typo fix, minor = new fields/status change, major = breaking)',
  '',
  '## Disciplines',
  '',
  `- [Integration Standards](${SITE_URL}/integration/): API design, events, resilience, observability, data formats, naming, encoding, versioning`,
  `- [Product Management](${SITE_URL}/product/): Requirements, roadmapping, prioritization guidelines`,
  `- [UX Standards](${SITE_URL}/ux/): Accessibility, design systems, interaction patterns`,
  `- [Project Management](${SITE_URL}/project-management/): Ceremonies, estimation, delivery practices`,
  '',
];

for (const domain of orderedDomains) {
  const entries = byDomain.get(domain)!;
  const label = DOMAIN_LABELS[domain] ?? domain;
  lines.push(`## ${label}`, '');
  for (const e of entries) {
    const desc = e.description ? `: ${e.description}` : '';
    const cleanUrlPath = e.urlPath.endsWith('/') ? e.urlPath : `${e.urlPath}/`;
    lines.push(
      `- [${e.identifier} ${e.name}](${SITE_URL}/${cleanUrlPath}) [${e.status}]${desc}`
    );
  }
  lines.push('');
}

lines.push(
  '## AI Distribution',
  '',
  'Standards are delivered to AI agents via:',
  `1. This file — AI crawler index at ${SITE_URL}/llms.txt`,
  '2. MCP Server — active querying via Model Context Protocol (see platform repo)',
  '3. CLAUDE.md — auto-loaded context for Claude Code sessions in this repository',
  '',
  '## Source',
  '',
  '- Standards (CC BY-SA 4.0): https://github.com/precepts-dev/standards',
  '- Platform (AGPL 3.0): https://github.com/precepts-dev/platform',
  `- Site: ${SITE_URL}`
);

fs.writeFileSync(OUT, lines.join('\n') + '\n');
console.log(
  `Generated llms.txt with ${all.length} standards across ${orderedDomains.length} domain(s)`
);
