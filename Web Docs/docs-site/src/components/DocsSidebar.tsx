"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/docs-nav";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {docsNav.map((section) => (
        <div key={section.title} className="sidebar-section">
          <div className="sidebar-title">{section.title}</div>
          <div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-link"
                data-active={isActivePath(pathname, item.href)}
              >
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
