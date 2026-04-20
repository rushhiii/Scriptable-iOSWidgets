---
title: Getting Started
description: Launch a clean docs site quickly and keep the structure reusable.
section: Foundations
order: 1
updated: April 15, 2026
---

# Getting Started

This starter is designed for teams who want GitBook-like information architecture without framework lock-in.

## What you get

- Persistent top navigation and quick search placeholder.
- Section-based sidebar generated from markdown frontmatter.
- Automatic table of contents from level-two and level-three headings.
- A visual system powered by Tailwind tokens, not one-off utility noise.

## Add your first page

Create a markdown file under content/docs.

Example file path:

`content/docs/guides/my-new-page.md`

Each file supports frontmatter keys:

- title
- description
- section
- order
- updated

### Slug rules

- index.md becomes the folder slug.
- Nested folders become nested URLs.
- File names are converted directly to URL segments.

## Ship checklist

1. Replace starter markdown with your product docs.
2. Tune colors and typography in globals.css and tailwind.config.ts.
3. Wire the search input to your preferred index provider.
4. Add analytics, auth, and edit links as needed.
