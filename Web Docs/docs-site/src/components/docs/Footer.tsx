import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';

const FOOTER_LOGO_LIGHT_URL = '/logo_light.svg';
const FOOTER_LOGO_DARK_URL = '/logo_dark.svg';

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
        <div className="docs-footer-logo">
          <span className="docs-footer-logo-icon" aria-hidden="true">
            <img className="docs-footer-logo-image docs-footer-logo-image-light" src={FOOTER_LOGO_LIGHT_URL} alt="" />
            <img className="docs-footer-logo-image docs-footer-logo-image-dark" src={FOOTER_LOGO_DARK_URL} alt="" />
          </span>
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

      <div className="docs-footer-social" aria-label="Social links">
        <Link
          className="docs-footer-social-link"
          href="https://github.com/rushhiii/Scriptable-IOSWidgets"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <FontAwesomeIcon icon={faGithub} size="lg" aria-hidden="true" />
        </Link>
        <Link
          className="docs-footer-social-link"
          href="https://www.linkedin.com/in/rushhiii"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedin} size="lg" aria-hidden="true" />
        </Link>
        <Link
          className="docs-footer-social-link"
          href="https://rushhiii.github.io/Scriptable-IOSWidgets/"
          target="_blank"
          rel="noreferrer"
          aria-label="Portfolio"
        >
          <FontAwesomeIcon icon={faGlobe} size="lg" aria-hidden="true" />
        </Link>
        <Link
          className="docs-footer-social-link"
          href="mailto:rushiofficial1205@gmail.com"
          aria-label="Gmail"
        >
          <FontAwesomeIcon icon={faEnvelope} size="lg" aria-hidden="true" />
        </Link>
      </div>
    </footer>
  );
}