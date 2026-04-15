import Link from 'next/link';

const footerColumns = [
  {
    title: 'Docs',
    links: [
      { label: 'Getting Started', href: '/docs/getting-started' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Widgets', href: '/docs/widgets' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Changelog', href: '/docs/changelog' },
      { label: 'Contributing', href: '/docs/contributing' },
      { label: 'Repository', href: 'https://github.com/rushhiii/Scriptable-IOSWidgets' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Docs Home', href: '/docs' },
      { label: 'Scriptable', href: 'https://scriptable.app' },
    ],
  },
];

export function DocsFooter() {
  return (
    <footer className="docs-footer" aria-label="Site footer">
      <div className="docs-footer-inner">
        <div className="docs-footer-brand">
          <div className="docs-footer-logo" aria-hidden="true">
            SI
          </div>
          <div>
            <p className="docs-footer-name">Scriptable iOS Widgets</p>
            <p className="docs-footer-copy">Docs and widget references for the current release.</p>
          </div>
        </div>

        <div className="docs-footer-columns">
          {footerColumns.map((column) => (
            <section key={column.title} className="docs-footer-column" aria-label={column.title}>
              <h3 className="docs-footer-column-title">{column.title}</h3>
              {column.links.map((link) => {
                const isExternal = link.href.startsWith('http');

                return (
                  <Link
                    key={link.label}
                    className="docs-footer-link"
                    href={link.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noreferrer' : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </section>
          ))}
        </div>
      </div>
    </footer>
  );
}