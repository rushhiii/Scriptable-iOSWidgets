"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronDown, Home, List } from "lucide-react";
import { topNav, type NavItem } from "@/lib/docs-nav";
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

function hasChildren(item: NavItem): item is NavItem & { children: NavItem[] } {
  return Array.isArray(item.children) && item.children.length > 0;
}

function isTopItemActive(pathname: string, item: NavItem) {
  if (isActivePath(pathname, item.href)) {
    return true;
  }

  if (!hasChildren(item)) {
    return false;
  }

  return item.children.some((child) => isActivePath(pathname, child.href));
}

export function DocsTopbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const topNavRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!topNavRef.current) {
        return;
      }

      if (!topNavRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

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

        </div>
        <div className="topbar-center">
          <SearchCommand />
        </div>
        <div className="topbar-right">
          <nav className="topnav" ref={topNavRef}>
            {topNav.map((item) => {
              const isActive = isTopItemActive(pathname, item);
              const iconName = item.icon as keyof typeof iconMap | undefined;
              const Icon = iconName ? iconMap[iconName] : null;

              if (!hasChildren(item)) {
                return (
                  <Link
                    key={item.href}
                    href={normalizeHref(item.href)}
                    className="topnav-link"
                    data-active={isActive}
                  >
                    {Icon ? (
                      <span className="nav-icon">
                        <Icon aria-hidden="true" size={16} />
                      </span>
                    ) : null}
                    <span>{item.title}</span>
                  </Link>
                );
              }

              const isOpen = openDropdown === item.href;

              return (
                <div
                  key={item.href}
                  className="topnav-item topnav-item-dropdown"
                  onMouseEnter={() => {
                    setOpenDropdown(item.href);
                  }}
                  onMouseLeave={() => {
                    setOpenDropdown((current) => (current === item.href ? null : current));
                  }}
                >
                  <button
                    type="button"
                    className="topnav-link topnav-link-dropdown"
                    data-active={isActive}
                    data-open={isOpen}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() => {
                      setOpenDropdown((current) => (current === item.href ? null : item.href));
                    }}
                  >
                    {Icon ? (
                      <span className="nav-icon">
                        <Icon aria-hidden="true" size={16} />
                      </span>
                    ) : null}
                    <span>{item.title}</span>
                    <ChevronDown className="topnav-caret" aria-hidden="true" size={14} />
                  </button>
                  <div className="topnav-dropdown" data-open={isOpen} role="menu" aria-label={`${item.title} menu`}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={normalizeHref(child.href)}
                        className="topnav-dropdown-link"
                        data-active={isActivePath(pathname, child.href)}
                        role="menuitem"
                        onClick={() => {
                          setOpenDropdown(null);
                        }}
                      >
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

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
