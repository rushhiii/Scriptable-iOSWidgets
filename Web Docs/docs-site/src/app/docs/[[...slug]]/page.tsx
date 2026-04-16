import { DocsSidebar } from '@/components/docs/Sidebar';
import { DocsToc } from '@/components/docs/Toc';
import { FloatingThemeToggle } from '@/components/docs/FloatingThemeToggle';
import {
  getAllDocSlugs,
  getDocBySlug,
  getDocsNavigation,
  getFirstDoc,
  getPrevNextDoc,
  slugifyHeading,
} from '@/lib/docs';
import { inferDocIconName, type DocIconName } from '@/lib/doc-icons';
import {
  Blocks,
  BookOpen,
  Download,
  FileText,
  Home,
  LayoutGrid,
  List,
  Map as MapIcon,
  Rocket,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import React, { isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

type RouteParams = {
  slug?: string[];
};

const titleIconMap: Record<DocIconName, LucideIcon> = {
  home: Home,
  rocket: Rocket,
  download: Download,
  sliders: SlidersHorizontal,
  grid: LayoutGrid,
  list: List,
  book: BookOpen,
  blocks: Blocks,
  map: MapIcon,
  file: FileText,
};

function DocTitleIcon({ name }: { name: DocIconName }) {
  const IconComponent = titleIconMap[name];

  return <IconComponent size={34} strokeWidth={1.8} aria-hidden="true" />;
}

function normalizeDocHref(href?: string): string | undefined {
  if (!href) {
    return href;
  }

  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href;
  }

  if (/^https?:\/\//.test(href)) {
    return href;
  }

  if (!href.startsWith('/')) {
    return href;
  }

  if (href === '/docs' || href.startsWith('/docs/')) {
    return href;
  }

  return `/docs${href}`;
}

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
  const hasToc = doc.toc.length > 0;
  const titleIcon = inferDocIconName(doc.section, doc.slugPath);

  const tocIdsByBase = new Map<string, string[]>();
  for (const item of doc.toc) {
    const baseId = slugifyHeading(item.text) || 'section';
    const idsForBase = tocIdsByBase.get(baseId) ?? [];
    idsForBase.push(item.id);
    tocIdsByBase.set(baseId, idsForBase);
  }

  const headingUseCounts = new Map<string, number>();
  const fallbackUseCounts = new Map<string, number>();

  const resolveHeadingId = (headingText: string) => {
    const baseId = slugifyHeading(headingText) || 'section';

    const seenForBase = headingUseCounts.get(baseId) ?? 0;
    headingUseCounts.set(baseId, seenForBase + 1);

    const tocIds = tocIdsByBase.get(baseId);
    const tocId = tocIds?.[seenForBase];

    if (tocId) {
      return tocId;
    }

    const fallbackSeen = fallbackUseCounts.get(baseId) ?? 0;
    fallbackUseCounts.set(baseId, fallbackSeen + 1);

    return fallbackSeen === 0 ? baseId : `${baseId}-${fallbackSeen}`;
  };

  const markdownComponents: Components = {
    h2: ({ children, ...props }) => {
      const headingText = flattenText(children);
      return (
        <h2 id={resolveHeadingId(headingText)} {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const headingText = flattenText(children);
      return (
        <h3 id={resolveHeadingId(headingText)} {...props}>
          {children}
        </h3>
      );
    },
    a: ({ href, children, ...props }) => {
      const normalizedHref = normalizeDocHref(href);
      const isExternal = normalizedHref?.startsWith('http');

      return (
        <a
          href={normalizedHref}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },
    blockquote: ({ children, ...props }) => <blockquote {...props}>{children}</blockquote>,
    pre: ({ children, ...props }) => <pre {...props}>{children}</pre>,
    code: ({ children, ...props }) => <code {...props}>{children}</code>,
  };

  return (
    <>
      <div className={hasToc ? 'docs-shell' : 'docs-shell docs-shell-no-toc'}>
        <DocsSidebar navigation={navigation} currentSlugPath={doc.slugPath} />

        <main className="content-panel fade-in">
          <article>
            <header className="doc-header">
              <p className="doc-kicker">{doc.section}</p>

              <div className="doc-title-row">
                {titleIcon ? (
                  <span className="doc-title-icon">
                    <DocTitleIcon name={titleIcon} />
                  </span>
                ) : null}
                <h1 className="doc-title">{doc.title}</h1>
              </div>

              {doc.description ? <p className="doc-summary">{doc.description}</p> : null}
            </header>

            <div className="doc-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {doc.body}
              </ReactMarkdown>
            </div>

            <div className="card-grid" style={{ marginTop: '2.25rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              {adjacent.previous ? (
                <Link
                  href={`/docs/${adjacent.previous.slugPath}`}
                  className="card"
                >
                  <p className="card-meta">Previous</p>
                  <p className="card-title">{adjacent.previous.title}</p>
                </Link>
              ) : (
                <div />
              )}

              {adjacent.next ? (
                <Link
                  href={`/docs/${adjacent.next.slugPath}`}
                  className="card"
                >
                  <p className="card-meta">Next</p>
                  <p className="card-title">{adjacent.next.title}</p>
                </Link>
              ) : null}
            </div>

            {doc.updated ? (
              <p className="doc-kicker" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
                Updated {doc.updated}
              </p>
            ) : null}
          </article>
        </main>

        {hasToc ? <DocsToc items={doc.toc} /> : null}
      </div>

      <FloatingThemeToggle />
    </>
  );
}
