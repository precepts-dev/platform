import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface StandardMetadata {
  identifier: string;
  name: string;
  version: string;
  status: "DRAFT" | "MANDATORY" | "RECOMMENDED" | "DEPRECATED";
  domain?: string;
  documentType?: "standard" | "guideline" | "governance" | "best-practice";
  category?: string;
  appliesTo?: string[];
  dependsOn?: string[];
  supersedes?: string;
  machine_summary?: string;
  [key: string]: unknown;
}

export interface Standard {
  metadata: StandardMetadata;
  content: string;
  filePath: string;
  domain: string;
}

/**
 * Recursively find all .md files under a directory.
 */
function findMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md") && !entry.name.startsWith("_")) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Infer the domain from the file path.
 * e.g., docs/integration/standards/INTG-STD-001.md → "integration"
 */
function inferDomain(filePath: string, docsRoot: string): string {
  const relative = path.relative(docsRoot, filePath);
  const parts = relative.split(path.sep);
  return parts[0] ?? "unknown";
}

/**
 * Load and parse all standards documents from the docs directory.
 */
export function loadStandards(docsRoot: string): Standard[] {
  const standards: Standard[] = [];
  const files = findMarkdownFiles(docsRoot);

  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      // Only include files with an identifier (i.e., actual standards/guidelines)
      if (!data.identifier) continue;

      standards.push({
        metadata: data as StandardMetadata,
        content,
        filePath,
        domain: inferDomain(filePath, docsRoot),
      });
    } catch (err) {
      console.error(`Skipping unparsable file: ${filePath}`, err);
    }
  }

  return standards;
}

/**
 * Simple full-text search across standards.
 */
export function searchStandards(
  standards: Standard[],
  query: string,
  filters?: {
    domain?: string;
    status?: string;
    category?: string;
  }
): Standard[] {
  const queryLower = query.toLowerCase();

  return standards.filter((std) => {
    // Apply filters first
    if (filters?.domain && std.domain !== filters.domain) return false;
    if (filters?.status && std.metadata.status !== filters.status) return false;
    if (filters?.category && std.metadata.category !== filters.category)
      return false;

    // Full-text search across identifier, name, content, and machine_summary
    const searchable = [
      std.metadata.identifier,
      std.metadata.name,
      std.metadata.machine_summary ?? "",
      std.content,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(queryLower);
  });
}
