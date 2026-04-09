import Link from "next/link";
import { SearchCommand } from "./SearchCommand";
import { ThemeToggle } from "./ThemeToggle";

export function DocsTopbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true" />
          <span>Scriptable Widgets Docs</span>
        </Link>
        <div className="topbar-actions">
          <SearchCommand />
          <ThemeToggle />
          <a
            className="action-button"
            href="https://github.com/rushhiii/Scriptable-IOSWidgets"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
