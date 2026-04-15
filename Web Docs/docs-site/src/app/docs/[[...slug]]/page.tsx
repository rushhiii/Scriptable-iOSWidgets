import { DocsSidebar } from '@/components/docs/Sidebar';
import { DocsToc } from '@/components/docs/Toc';
import { DocsTopbar } from '@/components/docs/Topbar';
import {
  getAllDocSlugs,
  getDocBySlug,
  getDocsNavigation,
  getFirstDoc,
  getPrevNextDoc,
  slugifyHeading,
} from '@/lib/docs';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import React, { isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type RouteParams = {
  slug?: string[];
};

function flattenText(value: React.ReactNode): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((child) => flattenText(child)).join(' ');
  }

  if (isValidElement(value)) {
    const element = value as React.ReactElement<{ children?: React.ReactNode }>;
    return flattenText(element.props.children);
  }

  return '';
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const slugs = await getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const resolved = await params;

  const targetSlug =
    resolved.slug && resolved.slug.length > 0
      ? resolved.slug
      : (await getFirstDoc())?.slug;

  if (!targetSlug) {
    return {
      title: 'Docs',
      description: 'Reusable documentation template.',
    };
  }

  const doc = await getDocBySlug(targetSlug);

  if (!doc) {
    return {
      title: 'Not Found',
      description: 'The requested docs page was not found.',
    };
  }

  return {
    title: `${doc.title} | Scriptable iOS Widgets`,
    description: doc.description,
  };
}

export default async function DocsPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const resolved = await params;
  const requestedSlug = resolved.slug?.filter(Boolean) || [];

  if (requestedSlug.length === 0) {
    const firstDoc = await getFirstDoc();

    if (!firstDoc) {
      notFound();
    }

    redirect(`/docs/${firstDoc.slugPath}`);
  }

  const [doc, navigation] = await Promise.all([
    getDocBySlug(requestedSlug),
    getDocsNavigation(),
  ]);

  if (!doc) {
    notFound();
  }

  const adjacent = await getPrevNextDoc(doc.slug);

  const markdownComponents: Components = {
    h2: ({ children, ...props }) => (
      <h2
        id={slugifyHeading(flattenText(children))}
        className="scroll-mt-28 font-display text-3xl font-semibold tracking-tight text-ink"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        id={slugifyHeading(flattenText(children))}
        className="scroll-mt-28 font-display text-2xl font-semibold tracking-tight text-ink"
        {...props}
      >
        {children}
      </h3>
    ),
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith('http');

      return (
        <a
          href={href}
          className="font-medium text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-ink"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="rounded-2xl border-l-4 border-brand/70 bg-brand/15 px-5 py-4 text-ink"
        {...props}
      >
        {children}
      </blockquote>
    ),
    pre: ({ children, ...props }) => (
      <pre
        className="overflow-x-auto rounded-2xl border border-line/50 bg-codebg px-4 py-3 text-sm text-[rgb(var(--code-text))]"
        {...props}
      >
        {children}
      </pre>
    ),
    code: ({ children, ...props }) => (
      <code className="font-mono text-[0.9em] text-brand" {...props}>
        {children}
      </code>
    ),
  };

  return (
    <div className="page-shell pb-16">
      <DocsTopbar />

      <div className="mx-auto mt-5 grid w-full max-w-docs grid-cols-12 gap-4 px-4 md:gap-6 md:px-8">
        <div className="col-span-12 lg:col-span-3 fade-in-up">
          <DocsSidebar navigation={navigation} currentSlugPath={doc.slugPath} />
        </div>

        <main className="col-span-12 lg:col-span-6 xl:col-span-6 fade-in-up fade-delay-1">
          <article className="surface-card p-6 md:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand/85">
              {doc.section}
            </p>

            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              {doc.title}
            </h1>

            {doc.description ? (
              <p className="mt-3 max-w-2xl text-base text-muted md:text-lg">{doc.description}</p>
            ) : null}

            {doc.updated ? (
              <p className="mt-5 text-xs uppercase tracking-[0.14em] text-muted/80">
                Updated {doc.updated}
              </p>
            ) : null}

            <div className="prose prose-lg mt-10 max-w-none prose-headings:font-display prose-headings:text-ink prose-p:text-ink/90 prose-strong:text-ink prose-li:text-ink/85 prose-code:text-brand">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {doc.body}
              </ReactMarkdown>
            </div>

            <div className="mt-12 grid gap-3 border-t border-line/40 pt-6 sm:grid-cols-2">
              {adjacent.previous ? (
                <Link
                  href={`/docs/${adjacent.previous.slugPath}`}
                  className="rounded-2xl border border-line/45 bg-panel/55 px-4 py-3 transition-colors hover:border-brand/60 hover:bg-brand/15"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Previous</p>
                  <p className="mt-1 font-medium text-ink">{adjacent.previous.title}</p>
                </Link>
              ) : (
                <div />
              )}

              {adjacent.next ? (
                <Link
                  href={`/docs/${adjacent.next.slugPath}`}
                  className="rounded-2xl border border-line/45 bg-panel/55 px-4 py-3 text-left transition-colors hover:border-brand/60 hover:bg-brand/15"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Next</p>
                  <p className="mt-1 font-medium text-ink">{adjacent.next.title}</p>
                </Link>
              ) : null}
            </div>
          </article>
        </main>

        <div className="col-span-12 xl:col-span-3 fade-in-up fade-delay-2">
          <DocsToc items={doc.toc} />
        </div>
      </div>
    </div>
  );
}
