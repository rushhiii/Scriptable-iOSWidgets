import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectRoot = process.cwd();
const contentRoot = path.join(projectRoot, "src", "content", "docs");
const outputPath = path.join(projectRoot, "public", "search-index.json");

function walkDir(dir, files = []) {
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

function stripMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSummary(content) {
  const chunks = content
    .split(/\n\s*\n/)
    .map((chunk) => stripMarkdown(chunk))
    .filter(Boolean);
  return chunks[0] || "";
}

function extractTitle(content, frontmatterTitle) {
  if (frontmatterTitle) {
    return String(frontmatterTitle);
  }
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Documentation";
}

function extractHeadings(content) {
  const headings = [];
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
    if (match) {
      headings.push({
        depth: match[1].length,
        title: stripMarkdown(match[2]),
      });
    }
  }

  return headings;
}

function slugFromFile(filePath) {
  const relativePath = path
    .relative(contentRoot, filePath)
    .replace(/\\/g, "/")
    .replace(/\.mdx$/, "");

  if (relativePath === "index") {
    return "";
  }

  return relativePath.replace(/\/index$/, "");
}

function buildIndex() {
  if (!fs.existsSync(contentRoot)) {
    console.warn("No docs content found at:", contentRoot);
    return [];
  }

  const files = walkDir(contentRoot);
  return files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const { content, data } = matter(raw);
    const slug = slugFromFile(filePath);
    const title = extractTitle(content, data.title);
    const summary = data.description ? String(data.description) : extractSummary(content);
    const headings = extractHeadings(content);

    const href = slug ? `/${slug}/` : "/";

    return {
      title,
      summary,
      headings,
      href,
      section: data.section ? String(data.section) : "Documentation",
    };
  });
}

function writeIndex(items) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
}

const index = buildIndex();
writeIndex(index);
console.log(`Search index generated (${index.length} entries).`);
