import type { ReactNode } from 'react';
import { DocsFooter } from '@/components/docs/Footer';
import { DocsSubnav } from '@/components/docs/Subnav';
import { DocsTopbar } from '@/components/docs/Topbar';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <header className="site-nav">
        <DocsTopbar />
        <DocsSubnav />
      </header>

      {children}

      <DocsFooter />
    </div>
  );
}