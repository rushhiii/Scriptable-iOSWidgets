import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

export type Heading = {
  depth: number;
  title: string;
  slug: string;
};

export type Doc = {
  slug: string;
  title: string;
  description: string;
  section: string;
  content: string;
  headings: Heading[];
  layout: "default" | "landing";
  toc: boolean;
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.join(currentDir, "..", "content", "docs");

function walkDir(dir: string, files: string[] = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

function toSlug(filePath: string) {
  const relativePath = path
    .relative(docsRoot, filePath)
    .replace(/\\/g, "/")
    .replace(/\.mdx$/, "");

  if (relativePath === "index") {
    return "";
  }

  return relativePath.replace(/\/index$/, "");
}

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[*_~`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(content: string) {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const lines = content.split(/\r?\n/);
  let inCode = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      continue;
    }
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) {
      continue;
    }

    const title = stripMarkdown(match[2]);
    headings.push({
      depth: match[1].length,
      title,
      slug: slugger.slug(title),
    });
  }

  return headings;
}

function resolveDocPath(slugSegments: string[]) {
  if (!slugSegments.length) {
    return path.join(docsRoot, "index.mdx");
  }

  const directPath = path.join(docsRoot, ...slugSegments) + ".mdx";
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  return path.join(docsRoot, ...slugSegments, "index.mdx");
}

export function getAllDocs() {
  return walkDir(docsRoot).map((filePath) => toSlug(filePath));
}

export function getDocBySlug(slugSegments: string[]) {
  const filePath = resolveDocPath(slugSegments);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const slug = toSlug(filePath);
  const title = data.title ? String(data.title) : "Documentation";
  const description = data.description ? String(data.description) : "";
  const section = data.section ? String(data.section) : "Documentation";
  const layout = data.layout === "landing" ? "landing" : "default";
  const toc = data.toc === false ? false : true;

  return {
    slug,
    title,
    description,
    section,
    content,
    headings: extractHeadings(content),
    layout,
    toc,
  } satisfies Doc;
}
