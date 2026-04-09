import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { Doc } from "@/lib/docs";
import { DocsToc } from "./DocsToc";
import { mdxComponents } from "./mdx/mdx-components";

export function DocPage({ doc }: { doc: Doc }) {
  return (
    <>
      <section className="content-panel">
        <header className="doc-header">
          <div className="doc-kicker">{doc.section}</div>
          <h1 className="doc-title">{doc.title}</h1>
          {doc.description ? (
            <p className="doc-summary">{doc.description}</p>
          ) : null}
        </header>
        <div className="doc-content">
          <MDXRemote
            source={doc.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
              },
            }}
          />
        </div>
      </section>
      <DocsToc headings={doc.headings} />
    </>
  );
}
