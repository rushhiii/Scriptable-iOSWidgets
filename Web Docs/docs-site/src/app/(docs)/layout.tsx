import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/DocsSidebar";
import { DocsSubnav } from "@/components/DocsSubnav";
import { DocsTopbar } from "@/components/DocsTopbar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <header className="site-nav">
        <DocsTopbar />
        <DocsSubnav />
      </header>
      <div className="docs-shell">
        <DocsSidebar />
        {children}
      </div>
    </div>
  );
}
