import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

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
      suppressHydrationWarning
    >
      <body className="site-background font-sans text-ink antialiased">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
