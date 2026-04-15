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

async function readMarkdownFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  const results = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        return readMarkdownFiles(absolutePath);
      }

      if (entry.isFile() && absolutePath.endsWith('.md')) {
        return [absolutePath];
      }

      return [];
    })
  );

  return results.flat();
}

function normalizeSlug(relativePath: string): string[] {
  const unixStyle = relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
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

      const relativePath = path.relative(DOCS_ROOT, absolutePath);
      const slug = normalizeSlug(relativePath);
      const safeSlug = slug.length > 0 ? slug : ['getting-started'];

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
        body: content.trim(),
        toc: extractToc(content),
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
