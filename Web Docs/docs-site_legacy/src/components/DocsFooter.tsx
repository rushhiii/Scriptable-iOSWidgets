import { Github, Layers, Linkedin, Youtube } from "lucide-react";

const footerColumns = [
  {
    title: "Resources",
    links: [
      { label: "Showcase", href: "https://www.gitbook.com/showcase" },
      { label: "Enterprise", href: "https://www.gitbook.com/enterprise" },
      { label: "Status", href: "https://www.gitbookstatus.com" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "https://www.gitbook.com/careers" },
      { label: "Blog", href: "https://www.gitbook.com/blog" },
      { label: "Community", href: "https://www.gitbook.com/community" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Subprocessors", href: "https://www.gitbook.com/legal/subprocessors" },
      { label: "Terms of Service", href: "https://www.gitbook.com/legal/terms" },
    ],
  },
];

export function DocsFooter() {
  return (
    <footer className="docs-footer" aria-label="Site footer">
      <div className="docs-footer-inner">
        <a className="docs-footer-logo" href="https://www.gitbook.com" target="_blank" rel="noreferrer">
          <Layers className="docs-footer-logo-icon" size={26} aria-hidden="true" />
          <span className="docs-footer-logo-text">GITBOOK</span>
        </a>

        <div className="docs-footer-columns">
          {footerColumns.map((column) => (
            <section key={column.title} className="docs-footer-column" aria-label={column.title}>
              <h3 className="docs-footer-column-title">{column.title}</h3>
              {column.links.map((link) => (
                <a
                  key={link.label}
                  className="docs-footer-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </section>
          ))}
        </div>
      </div>

      <div className="docs-footer-social" aria-label="Social links">
        <a
          className="docs-footer-social-link"
          href="https://github.com/GitbookIO"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <Github size={22} aria-hidden="true" />
        </a>
        <a
          className="docs-footer-social-link"
          href="https://x.com/GitBookIO"
          target="_blank"
          rel="noreferrer"
          aria-label="X"
        >
          <span className="docs-footer-social-x" aria-hidden="true">
            X
          </span>
        </a>
        <a
          className="docs-footer-social-link"
          href="https://www.linkedin.com/company/gitbook"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <Linkedin size={22} aria-hidden="true" />
        </a>
        <a
          className="docs-footer-social-link"
          href="https://www.youtube.com/@GitBook"
          target="_blank"
          rel="noreferrer"
          aria-label="YouTube"
        >
          <Youtube size={22} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
