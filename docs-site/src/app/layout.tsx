import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

function normalizeSiteUrl(value: string | undefined): URL | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    parsed.hash = '';
    parsed.search = '';

    if (!parsed.pathname.endsWith('/')) {
      parsed.pathname = `${parsed.pathname}/`;
    }

    return parsed;
  } catch {
    return null;
  }
}

const siteUrl =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  normalizeSiteUrl(process.env.VERCEL_URL) ||
  new URL('http://localhost:3000/');

const sans = localFont({
  src: '../../public/fonts/inter-regular.woff2',
  variable: '--font-sans',
  display: 'swap',
});

const display = localFont({
  src: '../../public/fonts/generalsans-medium.woff2',
  variable: '--font-display',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

function ThemeScript() {
  const script = `(function(){
    try {
      var stored = localStorage.getItem('docs-theme');
      var theme = stored || 'dark';
      document.documentElement.dataset.theme = theme;
    } catch (error) {
      document.documentElement.dataset.theme = 'dark';
    }
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'Scriptable iOS Widgets',
    template: '%s | Scriptable iOS Widgets',
  },
  description: 'Modern, customizable documentation for a curated collection of Scriptable widgets.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} theme-gradient tint`}
      data-site-origin={siteUrl.toString()}
      suppressHydrationWarning
    >
      <body className="site-background font-sans text-ink antialiased">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
