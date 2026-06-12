# @precepts/mcp-server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes Precepts standards as tools and resources for AI agents. 

This server allows AI agents to read, search, and list standards, guidelines, and governance documents, making it easier for agents to understand and strictly adhere to organizational standards.

## Features

### Tools
- **`list_standards`**: List all available standards. Supports filtering by domain, status, category, and document type.
- **`get_standard`**: Retrieve the full content of a specific standard by its identifier (e.g., `INTG-STD-001`).
- **`search_standards`**: Full-text search across all standards, searching identifiers, names, summaries, and body content.

### Resources
- **`standards://index`**: An index of all available standards and their metadata in JSON format.
- **`standards://[identifier]`**: Direct access to the content of a specific standard by its identifier (e.g., `standards://INTG-STD-001`).

## How to Run

### Via npx
You can run the server directly using `npx`:
```bash
npx @precepts/mcp-server
```

### In Claude Desktop / Any MCP Client
To add this to your Claude Desktop configuration (`claude_desktop_config.json`) or any other MCP-compatible client:
```json
{
  "mcpServers": {
    "precepts-standards": {
      "command": "npx",
      "args": [
        "-y",
        "@precepts/mcp-server"
      ]
    }
  }
}
```

## Configuration

By default, the server will locate standard documents via the installed `@precepts/standards` package.

You can override the root directory for standard documents by providing the `PRECEPTS_DOCS_ROOT` environment variable. This is useful when testing local standards:
```bash
PRECEPTS_DOCS_ROOT=/path/to/your/standards npx @precepts/mcp-server
```

## Development

Install dependencies and build the server:
```bash
pnpm install
pnpm build
```

Start the server locally from the built files:
```bash
pnpm start
```

For development (executes TypeScript directly):
```bash
pnpm dev
```
