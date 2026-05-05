import fs from 'node:fs';
import path from 'node:path';

// Dirs inside docs/ that are platform metadata, not standards disciplines
const PLATFORM_DIRS = new Set(['community']);

// Known acronyms that should be fully uppercased regardless of how the
// standards package writes them in _category_.json (e.g. "Ux" → "UX")
const ACRONYMS = ['UX', 'API', 'UI', 'HTTP', 'REST', 'SQL', 'URL'];
const ACRONYM_RE = new RegExp(`\\b(${ACRONYMS.join('|')})\\b`, 'gi');

function normaliseLabel(label: string): string {
  return label.replace(ACRONYM_RE, (m) => m.toUpperCase());
}

export function toSidebarId(dirName: string): string {
  return dirName.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()) + 'Sidebar';
}

export interface Discipline {
  dirName: string;
  sidebarId: string;
  label: string;
}

export function discoverDisciplines(docsDir: string): Discipline[] {
  if (!fs.existsSync(docsDir)) return [];

  return fs
    .readdirSync(docsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !PLATFORM_DIRS.has(e.name))
    .map((e) => {
      const dirName = e.name;
      const categoryFile = path.join(docsDir, dirName, '_category_.json');
      let label = dirName
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      if (fs.existsSync(categoryFile)) {
        try {
          const cat = JSON.parse(fs.readFileSync(categoryFile, 'utf-8')) as { label?: string };
          if (cat.label) label = cat.label;
        } catch {
          // keep title-cased fallback
        }
      }

      return { dirName, sidebarId: toSidebarId(dirName), label: normaliseLabel(label) };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}
