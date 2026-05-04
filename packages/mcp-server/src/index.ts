#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRequire } from "node:module";
import path from "node:path";
import { z } from "zod";
import { loadStandards, searchStandards } from "./standards.js";

const require_ = createRequire(import.meta.url);

// Resolve docs root: prefer env var, then locate @precepts/standards via its exported schema file
const DOCS_ROOT =
  process.env.PRECEPTS_DOCS_ROOT ??
  path.join(
    path.dirname(require_.resolve("@precepts/standards/schema/standards.schema.json")),
    "..",
    "standards"
  );

const server = new McpServer({
  name: "precepts-standards",
  version: "0.1.0",
});

// Load standards at startup
const standards = loadStandards(DOCS_ROOT);

// ── Tool: list_standards ──────────────────────────────────────────

server.tool(
  "list_standards",
  "List all available standards. Optionally filter by domain, status, or category.",
  {
    domain: z
      .string()
      .optional()
      .describe(
        "Filter by domain (e.g., integration, product, ux, project)"
      ),
    status: z
      .string()
      .optional()
      .describe("Filter by status (DRAFT, MANDATORY, RECOMMENDED, DEPRECATED)"),
    category: z
      .string()
      .optional()
      .describe("Filter by category (e.g., format, protocol, security)"),
    documentType: z
      .string()
      .optional()
      .describe("Filter by document type (standard, guideline, governance, best-practice)"),
  },
  async ({ domain, status, category, documentType }) => {
    let filtered = standards;

    if (domain) filtered = filtered.filter((s) => s.domain === domain);
    if (status) filtered = filtered.filter((s) => s.metadata.status === status);
    if (category)
      filtered = filtered.filter((s) => s.metadata.category === category);
    if (documentType)
      filtered = filtered.filter((s) => s.metadata.documentType === documentType);

    const listing = filtered.map((s) => ({
      identifier: s.metadata.identifier,
      name: s.metadata.name,
      version: s.metadata.version,
      status: s.metadata.status,
      domain: s.domain,
      documentType: s.metadata.documentType ?? "N/A",
      category: s.metadata.category ?? "N/A",
      summary: s.metadata.machine_summary ?? "",
    }));

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(listing, null, 2),
        },
      ],
    };
  }
);

// ── Tool: get_standard ────────────────────────────────────────────

server.tool(
  "get_standard",
  "Retrieve the full content of a specific standard by its identifier (e.g., INTG-STD-001).",
  {
    identifier: z.string().describe("The standard identifier (e.g., INTG-STD-001)"),
  },
  async ({ identifier }) => {
    const std = standards.find(
      (s) =>
        s.metadata.identifier.toLowerCase() === identifier.toLowerCase()
    );

    if (!std) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Standard "${identifier}" not found. Use list_standards to see available standards.`,
          },
        ],
        isError: true,
      };
    }

    const header = Object.entries(std.metadata)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `--- Metadata ---\n${header}\n\n--- Content ---\n${std.content}`,
        },
      ],
    };
  }
);

// ── Tool: search_standards ────────────────────────────────────────

server.tool(
  "search_standards",
  "Full-text search across all standards. Returns matching standards with their metadata.",
  {
    query: z.string().describe("Search query (searches identifier, name, summary, and body)"),
    domain: z.string().optional().describe("Limit search to a specific domain"),
    status: z.string().optional().describe("Limit search to a specific status"),
  },
  async ({ query, domain, status }) => {
    const results = searchStandards(standards, query, { domain, status });

    const listing = results.map((s) => ({
      identifier: s.metadata.identifier,
      name: s.metadata.name,
      domain: s.domain,
      status: s.metadata.status,
      summary: s.metadata.machine_summary ?? "",
      excerpt: s.content.slice(0, 300) + (s.content.length > 300 ? "..." : ""),
    }));

    return {
      content: [
        {
          type: "text" as const,
          text:
            results.length === 0
              ? `No standards found matching "${query}".`
              : JSON.stringify(listing, null, 2),
        },
      ],
    };
  }
);

// ── Resources: each standard as a resource ────────────────────────

for (const std of standards) {
  server.resource(
    std.metadata.identifier,
    `standards://${std.metadata.identifier}`,
    {
      description: std.metadata.name,
      mimeType: "text/markdown",
    },
    async () => ({
      contents: [
        {
          uri: `standards://${std.metadata.identifier}`,
          mimeType: "text/markdown",
          text: std.content,
        },
      ],
    })
  );
}

// ── Resource: standards index ─────────────────────────────────────

server.resource(
  "standards-index",
  "standards://index",
  {
    description: "Index of all available standards with metadata",
    mimeType: "application/json",
  },
  async () => ({
    contents: [
      {
        uri: "standards://index",
        mimeType: "application/json",
        text: JSON.stringify(
          standards.map((s) => ({
            identifier: s.metadata.identifier,
            name: s.metadata.name,
            version: s.metadata.version,
            status: s.metadata.status,
            domain: s.domain,
            documentType: s.metadata.documentType,
            category: s.metadata.category,
          })),
          null,
          2
        ),
      },
    ],
  })
);

// ── Start server ──────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `Precepts MCP server running. Loaded ${standards.length} standard(s) from ${DOCS_ROOT}`
  );
}

main().catch((err) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});
