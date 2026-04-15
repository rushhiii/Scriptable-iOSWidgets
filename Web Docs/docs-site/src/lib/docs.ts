import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { cache } from 'react';

export type TocItem = {
  depth: 2 | 3;
  text: string;
  id: string;
};

export type DocPage = {
  slug: string[];
  slugPath: string;
  title: string;
  description: string;
  section: string;
  order: number;
  updated: string | null;
  body: string;
  toc: TocItem[];
};

export type NavPage = Pick<DocPage, 'title' | 'description' | 'slug' | 'slugPath'>;

export type NavSection = {
  section: string;
  pages: NavPage[];
};

export type AdjacentDocs = {
  previous: { title: string; slugPath: string } | null;
  next: { title: string; slugPath: string } | null;
};

type Frontmatter = {
  title?: string;
  description?: string;
  section?: string;
  order?: number | string;
  updated?: string;
};

const DOCS_ROOT = path.join(process.cwd(), 'content', 'docs');
const MARKDOWN_FILE_PATTERN = /\.(md|mdx)$/i;

async function readMarkdownFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  const results = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        return readMarkdownFiles(absolutePath);
      }

      if (entry.isFile() && MARKDOWN_FILE_PATTERN.test(absolutePath)) {
        return [absolutePath];
      }

      return [];
    })
  );

  return results.flat();
}

function normalizeSlug(relativePath: string): string[] {
  const unixStyle = relativePath.replace(/\\/g, '/').replace(MARKDOWN_FILE_PATTERN, '');
  const parts = unixStyle.split('/').filter(Boolean);

  if (parts.at(-1) === 'index') {
    parts.pop();
  }

  return parts;
}

function toTitleCase(value: string): string {
  return value
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function stripMarkdownTokens(value: string): string {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[*_~]/g, '')
    .trim();
}

function parseTagAttributes(tagBody: string): Record<string, string> {
  const attributes: Record<string, string> = {};

  for (const match of tagBody.matchAll(/([A-Za-z][A-Za-z0-9_-]*)=(?:"([^"]*)"|'([^']*)')/g)) {
    const key = match[1];
    const value = match[2] ?? match[3] ?? '';
    attributes[key] = value;
  }

  return attributes;
}

function compactWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function stripLegacyLayoutTags(value: string): string {
  return value
    .replace(/<\/?section\b[^>]*>/g, '')
    .replace(/<\/?div\b[^>]*>/g, '')
    .replace(/<p\b[^>]*>/g, '')
    .replace(/<\/p>/g, '\n');
}

function renderLegacyHero(attributesRaw: string): string {
  const attributes = parseTagAttributes(attributesRaw);
  const output: string[] = [];

  if (attributes.title) {
    output.push(`## ${attributes.title}`);
  }

  if (attributes.subtitle) {
    output.push(`**${attributes.subtitle}**`);
  }

  if (attributes.description) {
    output.push(attributes.description);
  }

  const links: string[] = [];
  if (attributes.primaryLabel && attributes.primaryHref) {
    links.push(`[${attributes.primaryLabel}](${attributes.primaryHref})`);
  }
  if (attributes.secondaryLabel && attributes.secondaryHref) {
    links.push(`[${attributes.secondaryLabel}](${attributes.secondaryHref})`);
  }

  if (links.length > 0) {
    output.push(links.join(' | '));
  }

  return output.join('\n\n').trim();
}

function renderLegacyCallout(attributesRaw: string, inner: string): string {
  const attributes = parseTagAttributes(attributesRaw);
  const title = attributes.title || 'Note';
  const contentLines = inner
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const quotedBody = contentLines.map((line) => `> ${line}`).join('\n');

  if (!quotedBody) {
    return `> **${title}**`;
  }

  return [`> **${title}**`, '>', quotedBody].join('\n');
}

function renderLegacyCards(cardBlock: string): string {
  const items: string[] = [];
  const cardPattern = /<Card([^>]*?)(?:\/>|>([\s\S]*?)<\/Card>)/g;

  for (const match of cardBlock.matchAll(cardPattern)) {
    const attributes = parseTagAttributes(match[1] ?? '');
    const title = attributes.title || 'Untitled';
    const href = attributes.href || '#';
    const meta = attributes.meta ? ` - ${attributes.meta}` : '';
    const innerContent = compactWhitespace(stripLegacyLayoutTags(match[2] ?? ''));
    const suffix = innerContent ? `: ${innerContent}` : '';

    items.push(`- [${title}](${href})${meta}${suffix}`);
  }

  return items.join('\n');
}

function normalizeLegacyMdx(content: string): string {
  let normalized = content;

  normalized = normalized.replace(/<Hero([\s\S]*?)\/>/g, (_, attributesRaw) => {
    return `\n${renderLegacyHero(String(attributesRaw))}\n`;
  });

  normalized = normalized.replace(/<Callout([^>]*)>([\s\S]*?)<\/Callout>/g, (_, attributesRaw, inner) => {
    return `\n${renderLegacyCallout(String(attributesRaw), String(inner))}\n`;
  });

  normalized = normalized.replace(/<CardGrid>([\s\S]*?)<\/CardGrid>/g, (_, cardBlock) => {
    return `\n${renderLegacyCards(String(cardBlock))}\n`;
  });

  normalized = stripLegacyLayoutTags(normalized)
    .replace(/<\/?(Card|CardGrid|Callout|Hero)\b[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return normalized;
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractToc(markdown: string): TocItem[] {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .map((line) => /^(##|###)\s+(.+)$/.exec(line))
    .filter((match): match is RegExpExecArray => Boolean(match))
    .map((match) => {
      const text = stripMarkdownTokens(match[2] ?? '');
      return {
        depth: match[1] === '##' ? 2 : 3,
        text,
        id: slugifyHeading(text),
      };
    });
}

function normalizeRequestedSlug(parts: string[]): string {
  return parts.filter(Boolean).map((part) => decodeURIComponent(part)).join('/');
}

const loadDocs = cache(async (): Promise<DocPage[]> => {
  let filePaths: string[] = [];

  try {
    filePaths = await readMarkdownFiles(DOCS_ROOT);
  } catch {
    return [];
  }

  const docs = await Promise.all(
    filePaths.map(async (absolutePath) => {
      const rawFile = await fs.readFile(absolutePath, 'utf8');
      const { data, content } = matter(rawFile);
      const frontmatter = data as Frontmatter;
      const normalizedBody = absolutePath.endsWith('.mdx')
        ? normalizeLegacyMdx(content)
        : content.trim();

      const relativePath = path.relative(DOCS_ROOT, absolutePath);
      const slug = normalizeSlug(relativePath);
      const safeSlug = slug.length > 0 ? slug : ['home'];

      const parsedOrder = Number(frontmatter.order);
      const order = Number.isFinite(parsedOrder) ? parsedOrder : 999;

      return {
        slug: safeSlug,
        slugPath: safeSlug.join('/'),
        title: frontmatter.title?.trim() || toTitleCase(safeSlug.at(-1) || 'Untitled'),
        description: frontmatter.description?.trim() || '',
        section: frontmatter.section?.trim() || 'General',
        order,
        updated: frontmatter.updated?.trim() || null,
        body: normalizedBody,
        toc: extractToc(normalizedBody),
      } satisfies DocPage;
    })
  );

  docs.sort((a, b) => {
    if (a.section !== b.section) {
      return a.section.localeCompare(b.section);
    }

    if (a.order !== b.order) {
      return a.order - b.order;
    }

    return a.title.localeCompare(b.title);
  });

  return docs;
});

export async function getAllDocSlugs(): Promise<string[][]> {
  const docs = await loadDocs();
  return docs.map((doc) => doc.slug);
}

export async function getFirstDoc(): Promise<DocPage | null> {
  const docs = await loadDocs();
  const homeDoc = docs.find((doc) => doc.slugPath === 'home');

  if (homeDoc) {
    return homeDoc;
  }

  const gettingStartedDoc = docs.find((doc) => doc.slugPath === 'getting-started');

  if (gettingStartedDoc) {
    return gettingStartedDoc;
  }

  return docs[0] || null;
}

export async function getDocBySlug(slugParts: string[]): Promise<DocPage | null> {
  const docs = await loadDocs();
  const slugPath = normalizeRequestedSlug(slugParts);

  return docs.find((doc) => doc.slugPath === slugPath) || null;
}

export async function getDocsNavigation(): Promise<NavSection[]> {
  const docs = await loadDocs();
  const sectionMap = new Map<string, NavSection>();

  for (const doc of docs) {
    const section = sectionMap.get(doc.section) || { section: doc.section, pages: [] };
    section.pages.push({
      title: doc.title,
      description: doc.description,
      slug: doc.slug,
      slugPath: doc.slugPath,
    });
    sectionMap.set(doc.section, section);
  }

  return Array.from(sectionMap.values());
}

export async function getPrevNextDoc(slugParts: string[]): Promise<AdjacentDocs> {
  const docs = await loadDocs();
  const slugPath = normalizeRequestedSlug(slugParts);
  const currentIndex = docs.findIndex((doc) => doc.slugPath === slugPath);

  if (currentIndex < 0) {
    return { previous: null, next: null };
  }

  const previousDoc = currentIndex > 0 ? docs[currentIndex - 1] : null;
  const nextDoc = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;

  return {
    previous: previousDoc
      ? {
          title: previousDoc.title,
          slugPath: previousDoc.slugPath,
        }
      : null,
    next: nextDoc
      ? {
          title: nextDoc.title,
          slugPath: nextDoc.slugPath,
        }
      : null,
  };
}
