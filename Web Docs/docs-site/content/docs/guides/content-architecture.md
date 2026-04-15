---
title: Content Architecture
description: Keep large docs maintainable with predictable page ownership.
section: Guides
order: 1
updated: April 15, 2026
---

# Content Architecture

Treat docs like product code: modular, versioned, and reviewable.

## Recommended folder map

Use section folders to mirror your mental model:

- foundations
- guides
- components
- references
- release-notes

## Frontmatter conventions

Use `order` for local page sorting inside a section and `section` for top-level grouping.

### Keep naming human

Prefer explicit titles over shorthand. For example, use "Theming and Brand" rather than "Theme" if the page includes voice and visual decisions.

## Ownership model

Give each section an owner and a backup reviewer. This prevents stale pages and avoids single-maintainer bottlenecks.

## Editing workflow

1. Open a docs branch.
2. Update markdown only.
3. Capture screenshots for UI-impacting guides.
4. Merge after technical and editorial review.
