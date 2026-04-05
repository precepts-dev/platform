# Precepts

Built for humans. Ready for agents.

An AI-native, multi-discipline standards platform. Publish organizational standards in machine-readable format consumable by both humans and AI agents.

## Quick Start

```bash
pnpm install
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

## License

- Content (standards): CC BY-SA 4.0 (in [precepts-dev/standards](https://github.com/precepts-dev/standards))
- Code (this repo): AGPL 3.0
