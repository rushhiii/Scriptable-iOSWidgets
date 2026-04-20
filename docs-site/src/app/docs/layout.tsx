import type { ReactNode } from 'react';
import { DocsFooter } from '@/components/docs/Footer';
import { DocsSubnav } from '@/components/docs/Subnav';
import { DocsTranslationSync } from '@/components/docs/TranslationSync';
import { DocsTopbar } from '@/components/docs/Topbar';
import { getDocsNavigation } from '@/lib/docs';

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const navigation = await getDocsNavigation();
  const resourcesLinks =
    navigation
      .find((section) => section.section === 'Resources')
      ?.pages.map((page) => ({ title: page.title, href: `/docs/${page.slugPath}` })) ?? [];

  return (
    <div className="page-shell">
      <DocsTranslationSync />

      <header className="site-nav">
        <DocsTopbar />
        <DocsSubnav resourcesLinks={resourcesLinks} />
      </header>

      {children}

      <DocsFooter />
    </div>
  );
}