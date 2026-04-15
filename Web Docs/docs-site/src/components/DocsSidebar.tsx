"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronRight, Download, Home, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { docsNav, type NavItem } from "@/lib/docs-nav";

function normalizePathForMatch(path: string) {
  const withoutHash = path.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];

  if (withoutQuery === "/") {
    return "/";
  }

  const trimmed = withoutQuery.replace(/\/+$/, "");
  return trimmed || "/";
}

function isActivePath(pathname: string, href: string) {
  const current = normalizePathForMatch(pathname);
  const target = normalizePathForMatch(href);

  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
}

function normalizeHref(href: string) {
  if (href === "/" || href.startsWith("http") || href.includes("#")) {
    return href;
  }
  return href.endsWith("/") ? href : `${href}/`;
}

function isExactPath(pathname: string, href: string) {
  return normalizePathForMatch(pathname) === normalizePathForMatch(href);
}

function hasChildren(item: NavItem): item is NavItem & { children: NavItem[] } {
  return Array.isArray(item.children) && item.children.length > 0;
}

function hasActiveDescendant(pathname: string, item: NavItem): boolean {
  if (!hasChildren(item)) {
    return false;
  }

  return item.children.some((child) => isActivePath(pathname, child.href) || hasActiveDescendant(pathname, child));
}

function collectGroups(items: NavItem[]): NavItem[] {
  const groups: NavItem[] = [];

  for (const item of items) {
    if (hasChildren(item)) {
      groups.push(item);
      groups.push(...collectGroups(item.children));
    }
  }

  return groups;
}

export function DocsSidebar() {
  const pathname = usePathname();
  const iconMap = {
    home: Home,
    download: Download,
    sliders: SlidersHorizontal,
    grid: LayoutGrid,
    list: List,
    book: BookOpen,
  };

  const groups = useMemo(() => collectGroups(docsNav.flatMap((section) => section.items)), []);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};

    for (const group of groups) {
      initial[group.href] = Boolean(group.defaultOpen);
    }

    return initial;
  });

  useEffect(() => {
    setOpenGroups((previous) => {
      const next = { ...previous };

      for (const group of groups) {
        const isActiveGroup = isExactPath(pathname, group.href) || hasActiveDescendant(pathname, group);

        if (isActiveGroup) {
          next[group.href] = true;
        } else if (next[group.href] === undefined) {
          next[group.href] = Boolean(group.defaultOpen);
        }
      }

      return next;
    });
  }, [groups, pathname]);

  const renderItem = (item: NavItem, depth = 0) => {
    const isNested = depth > 0;
    const isCurrentPage = isExactPath(pathname, item.href);
    const isGroup = hasChildren(item);
    const groupIsActive = isGroup ? isCurrentPage : false;
    const isOpen = isGroup ? (openGroups[item.href] ?? Boolean(item.defaultOpen)) : false;
    const iconName = item.icon as keyof typeof iconMap | undefined;
    const Icon = iconName ? iconMap[iconName] : null;
    const linkClass = isNested ? "sidebar-sublink" : "sidebar-link";

    if (!isGroup) {
      return (
        <Link
          key={item.href}
          href={normalizeHref(item.href)}
          className={linkClass}
          data-active={isCurrentPage}
        >
          {!isNested && Icon ? (
            <span className="sidebar-item-icon" aria-hidden="true">
              <Icon size={14} />
            </span>
          ) : null}
          <span>{item.title}</span>
        </Link>
      );
    }

    return (
      <div key={item.href} className="sidebar-group" data-open={isOpen} data-active={groupIsActive}>
        <div className="sidebar-group-row">
          <Link
            href={normalizeHref(item.href)}
            className={`${linkClass} sidebar-link-group`}
            data-active={groupIsActive}
          >
            {!isNested && Icon ? (
              <span className="sidebar-item-icon" aria-hidden="true">
                <Icon size={14} />
              </span>
            ) : null}
            <span>{item.title}</span>
          </Link>
          <button
            type="button"
            className="sidebar-group-toggle"
            onClick={() => {
              setOpenGroups((previous) => ({
                ...previous,
                [item.href]: !isOpen,
              }));
            }}
            data-open={isOpen}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.title}`}
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="sidebar-children">{item.children.map((child) => renderItem(child, depth + 1))}</div>
      </div>
    );
  };

  return (
    <aside className="sidebar">
      {docsNav.map((section) => (
        <div key={section.title} className="sidebar-section">
          <div className="sidebar-title">{section.title}</div>
          <div className="sidebar-section-items">{section.items.map((item) => renderItem(item))}</div>
        </div>
      ))}
    </aside>
  );
}
