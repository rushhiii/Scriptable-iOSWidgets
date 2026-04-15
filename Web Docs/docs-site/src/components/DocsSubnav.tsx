"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Home, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { docSubNav } from "@/lib/docs-nav";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function normalizeHref(href: string) {
  if (href === "/" || href.startsWith("http") || href.includes("#")) {
    return href;
  }
  return href.endsWith("/") ? href : `${href}/`;
}

export function DocsSubnav() {
  const pathname = usePathname();
  const iconMap = {
    home: Home,
    download: Download,
    sliders: SlidersHorizontal,
    grid: LayoutGrid,
    list: List,
  };

  return (
    <div className="subnav">
      <div className="subnav-inner">
        <div className="subnav-label">Scriptable iOSWidgets Docs</div>
        <nav className="subnav-links">
          {docSubNav.map((item) => (
            <Link
              key={item.href}
              href={normalizeHref(item.href)}
              className="subnav-link"
              data-active={isActivePath(pathname, item.href)}
            >
              {(() => {
                if (!item.icon) {
                  return null;
                }
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                if (!Icon) {
                  return null;
                }
                return (
                  <span className="nav-icon">
                    <Icon aria-hidden="true" size={15} />
                  </span>
                );
              })()}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
