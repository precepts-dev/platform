# Precepts Platform

Built for humans. Ready for agents.

An AI-native, multi-discipline standards platform. Publish organizational standards in machine-readable format consumable by both humans and AI agents.

## Quick Start

```bash
# Install dependencies across the monorepo
pnpm install

# Start the Docusaurus development server
pnpm dev
```

## Repository Structure

```
packages/
  site/               # Docusaurus 3.9 site (renders standards for humans)
  mcp-server/         # MCP server (serves standards to AI agents via MCP)
  validator/          # CLI validator (checks frontmatter and required sections)
.github/workflows/    # CI/CD (validation, deployment, releases)
```

Standards content lives in a separate repo: [precepts-dev/standards](https://github.com/precepts-dev/standards)

## Architecture

This is the **platform** repo (`precepts-dev/platform`). It is a pnpm workspace monorepo that consumes standards from `@precepts/standards` and provides:

- **Docusaurus site** - renders standards for humans at [precepts.dev](https://precepts.dev)
- **MCP server** - serves standards to AI agents via Model Context Protocol
- **Validator** - validates standard frontmatter and required sections

## MCP Server (`@precepts/mcp-server`)

The Model Context Protocol (MCP) server exposes Precepts standards governed in [precepts-dev/standards](https://github.com/precepts-dev/standards) as tools and resources for AI agents.

### Commands

From the root directory, you can run:

``` bash
# Run the MCP server in development mode (auto-reload via tsx)
pnpm mcp:dev

# Build the MCP server
pnpm mcp:build
```

> **Environment Variables:** `PRECEPTS_DOCS_ROOT` (Optional) is the absolute path to the folder containing your standards markdown files. Defaults to the location of the installed `@precepts/standards` package's standards folder.

### MCP Tools & Resources

#### Tools

- `list_standards(domain?, status?, category?, documentType?)` - Lists all available standards.
- `get_standard(identifier)` - Retrieves full markdown content of a specific standard (e.g., `INTG-STD-008`).
- `search_standards(query, domain?, status?)` - Runs a full-text search across all standards.

#### Resources

- `standards://index` - A JSON-formatted index of all standards.
- `standards://{identifier}` - Markdown content of a specific standard (e.g., `standards://INTG-STD-008`).

### How to Use? (e.g. Claude Desktop)

Add the following to your Claude Desktop configuration file (typically at `~/Library/Application Support/Claude/claude_desktop_config.json` on **macOS**):

```json
{
  "mcpServers": {
    "precepts-standards": {
      "command": "node",
      "args": [
        "/absolute/path/to/platform/packages/mcp-server/dist/index.js"
      ],
      "env": {
        "PRECEPTS_DOCS_ROOT": "/absolute/path/to/standards/standards"
      }
    }
  }
}
```

> **Note:** Make sure you build the package (`pnpm mcp:build`) before starting Claude Desktop.

## License

- Content (standards): CC BY-SA 4.0 (in [precepts-dev/standards](https://github.com/precepts-dev/standards))
- Code (this repo): AGPL 3.0
