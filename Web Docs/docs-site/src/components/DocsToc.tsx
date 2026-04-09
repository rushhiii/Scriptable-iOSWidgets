import type { Heading } from "@/lib/docs";

export function DocsToc({ headings }: { headings: Heading[] }) {
  if (!headings.length) {
    return null;
  }

  return (
    <aside className="toc">
      <div className="toc-title">On this page</div>
      {headings.map((heading) => (
        <a
          key={heading.slug}
          className="toc-link"
          href={`#${heading.slug}`}
          style={{ paddingLeft: heading.depth === 3 ? "1rem" : undefined }}
        >
          {heading.title}
        </a>
      ))}
    </aside>
  );
}
