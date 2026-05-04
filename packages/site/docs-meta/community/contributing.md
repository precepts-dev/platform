---
sidebar_position: 1
---

# Contributing to Precepts

This page explains how standards, guidelines, and governance documents are proposed, reviewed, and published on Precepts — and how you can participate.

> **Platform contributors** (developers working on the Docusaurus site, MCP server, or validator) should read the [CONTRIBUTING.md](https://github.com/precepts-dev/platform/blob/main/CONTRIBUTING.md) in the platform repo instead. This page is for **standards authors**: architects, engineers, PMs, UX designers, and domain experts who want to contribute standards content.

---

## How Precepts is structured

Precepts spans three repositories with clean boundaries:

| Repository | What it contains | License |
|---|---|---|
| [`precepts-dev/standards`](https://github.com/precepts-dev/standards) | All standards content (Markdown + YAML frontmatter) | CC BY-SA 4.0 |
| [`precepts-dev/platform`](https://github.com/precepts-dev/platform) | Docusaurus site, MCP server, validator | AGPL 3.0 |
| `precepts-dev/engine` *(private)* | Compliance scanning SaaS | Commercial |

**Standards content always lives in `precepts-dev/standards`.** When a new version of that package is published to npm, the platform site and MCP server update automatically — you never need to touch the platform repo to publish a standard.

---

## Standards lifecycle

Every document moves through the following states:

```
DRAFT → review → MANDATORY | RECOMMENDED | DEPRECATED
```

| Status | Meaning |
|---|---|
| `DRAFT` | Work-in-progress. Content may change. Not enforced. |
| `MANDATORY` | Normative requirement. Must be followed. |
| `RECOMMENDED` | Advisory. Should be followed unless there is a clear reason not to. |
| `DEPRECATED` | Superseded or retired. Kept for historical reference. |

New documents always start as `DRAFT`. Status is promoted via PR review, not unilaterally.

---

## Document types

| Type | Identifier suffix | Purpose |
|---|---|---|
| `standard` | `STD` | Normative, enforceable rules (e.g. `INTG-STD-004`) |
| `guideline` | `GDL` | Advisory recommendations (e.g. `PRD-GDL-001`) |
| `governance` | `GOV` | Cross-cutting process or architectural decisions |
| `best-practice` | `BP` | Opinionated patterns that complement a standard |

---

## How to propose a standard

### 1. Check what already exists

Browse the existing standards to avoid duplication and understand the coverage gaps. The identifier numbering (`INTG-STD-004`, `INTG-STD-008`, etc.) has intentional gaps — reserved identifier ranges exist per discipline.

### 2. Choose a discipline and domain path

Standards are organised by discipline and subdomain:

- `integration/standards/<subdomain>/` — API, events, resilience, observability, data formats, versioning, foundational
- `product/guidelines/` — Product management guidelines
- `ux/standards/` — UX and accessibility standards
- `project-management/standards/` — Delivery and process standards

If the right subdomain directory doesn't exist yet, you can create it — the site auto-generates sidebar labels from directory names.

### 3. Copy the template

Use [`schema/document-standard-template.md`](https://github.com/precepts-dev/standards/blob/main/schema/document-standard-template.md) as your starting point. It is the single unified template for all disciplines.

### 4. Fill in the frontmatter

All fields in the template are required unless marked optional. Key fields:

```yaml
identifier: "INTG-STD-042"       # Assign the next available number for the domain
name: "Your Standard Name"
version: "0.1.0"                  # Start at 0.1.0 for DRAFT
status: "DRAFT"
domain: "INTEGRATION"
documentType: "standard"
```

Versioning follows semver: patch for typo fixes, minor for new fields or status changes, major for breaking changes.

### 5. Write the required sections

Every document must include these body sections:

| Section | Required |
|---|---|
| `## Purpose` | Yes |
| `## Rules` | Yes (standards) |
| `## Examples` | Yes |
| `## References` | Yes |
| `## Rationale` | Yes |
| `## Version History` | Yes |

Use RFC 2119 keywords (**MUST**, **SHOULD**, **MAY**) bolded throughout. Number rules as `### R-1: Title`, `### R-2: Title` for deep-linking.

Keep documents concise: 200–300 lines. Examples should be concept-level (pseudocode or generic), not technology-specific.

### 6. Open a pull request

Submit your PR to [`precepts-dev/standards`](https://github.com/precepts-dev/standards). The CI pipeline automatically validates frontmatter and required sections. Address any validation failures before requesting review.

---

## How to propose a new discipline

Adding a new discipline (e.g. Security, Data Engineering) requires more than a single document:

1. **Open a discussion** in [`precepts-dev/standards`](https://github.com/precepts-dev/standards/discussions) describing the discipline scope, audience, and initial document set.
2. **Author a governance document** (`GOV` type) that defines the discipline's principles, document taxonomy, and enforcement approach.
3. **Submit at least one foundational standard** alongside the governance doc so reviewers can evaluate the taxonomy in context.

New disciplines are approved by the standards board before merging.

---

## What happens after your PR merges

Once your PR merges to `main` in `precepts-dev/standards`:

1. A new version of the `@precepts/standards` npm package is published.
2. A GitHub Actions workflow in `precepts-dev/platform` opens an automated PR to bump the package version.
3. When that PR merges, the site rebuilds and deploys — your standard appears on `docs.precepts.dev` within minutes.
4. The MCP server and `llms.txt` AI index are updated in the same deploy, making your standard immediately queryable by AI agents.

You do not need to touch the platform repository at any point.

---

## Validator

You can run the validator locally before opening a PR:

```bash
# From the precepts-dev/standards repo
pnpm validate          # check frontmatter + required sections
pnpm validate:strict   # treat warnings as errors
```

The same validator runs in CI on every PR.
