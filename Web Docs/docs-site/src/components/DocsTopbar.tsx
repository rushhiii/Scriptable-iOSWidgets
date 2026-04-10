"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, List } from "lucide-react";
import { topNav } from "@/lib/docs-nav";
import { SearchCommand } from "@/components/SearchCommand";
import { ThemeToggle } from "@/components/ThemeToggle";

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

export function DocsTopbar() {
  const pathname = usePathname();
  const iconMap = {
    home: Home,
    book: BookOpen,
    list: List,
  };

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true" />
            <span>Scriptable iOS Widgets</span>
          </Link>
          <nav className="topnav">
            {topNav.map((item) => (
              <Link
                key={item.href}
                href={normalizeHref(item.href)}
                className="topnav-link"
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
                      <Icon aria-hidden="true" size={16} />
                    </span>
                  );
                })()}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="topbar-center">
          <SearchCommand />
        </div>
        <div className="topbar-right">
          <a
            className="action-button action-button-primary"
            href="https://github.com/rushhiii/Scriptable-IOSWidgets"
            target="_blank"
            rel="noreferrer"
          >
            Visit Repo
          </a>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
