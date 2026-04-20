import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { getSiteUrl } from '@/lib/site-url';
import './globals.css';

const siteUrl = getSiteUrl();

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

const siteName = 'Scriptable iOS Widgets';
const defaultTitle = `${siteName} Documentation`;
const defaultDescription =
  'Documentation for Scriptable iOS Widgets with setup guides, widget references, and customization walkthroughs for iPhone home screen widgets.';
const defaultOgImage = '/logo_light.png';
const defaultKeywords = [
  'Scriptable iOS Widgets',
  'Scriptable widgets',
  'iPhone home screen widgets',
  'Scriptable app iOS',
  'iOS widget scripts',
  'JavaScript iOS widgets',
  'weather widget scriptable',
  'countdown widget scriptable',
  'GitHub stats widget iOS',
  'Scriptable widget docs',
];

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteName} documentation`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
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
