# Docs Site Template (Tailwind + Next.js)

A fresh, reusable docs starter built from scratch to replace the previous GitBook-based setup.

## Stack

- Next.js App Router
- Tailwind CSS + Typography plugin
- Markdown docs via gray-matter + react-markdown

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000/docs.

## Add docs pages

1. Create markdown files in `content/docs`.
2. Add frontmatter fields:
   - `title`
   - `description`
   - `section`
   - `order`
   - `updated`
3. Use headings (`##` and `###`) to auto-generate the table of contents.

## Project structure

- `src/app/docs/[[...slug]]/page.tsx`: Docs page renderer
- `src/lib/docs.ts`: Markdown loader + nav + toc logic
- `src/components/docs`: Reusable docs shell components
- `content/docs`: Markdown content source

## Customization

- Colors and page atmosphere: `src/app/globals.css`
- Tailwind tokens and typography: `tailwind.config.ts`
- Brand topbar and nav shell: `src/components/docs`
