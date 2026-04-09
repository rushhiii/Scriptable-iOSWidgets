import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/DocsSidebar";
import { DocsTopbar } from "@/components/DocsTopbar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <DocsTopbar />
      <div className="docs-shell">
        <DocsSidebar />
        {children}
      </div>
    </div>
  );
}
