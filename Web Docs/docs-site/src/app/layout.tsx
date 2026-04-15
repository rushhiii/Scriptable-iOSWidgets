import type { Metadata } from 'next';
import { IBM_Plex_Mono, Fraunces, Space_Grotesk } from 'next/font/google';
import './globals.css';

const sans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Scriptable Docs Template',
  description: 'Reusable docs starter inspired by GitBook style navigation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="font-sans text-ink antialiased">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-glow/25 blur-3xl" />
          <div className="absolute right-[-180px] top-[18%] h-[420px] w-[420px] rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(0,0,0,0.05)_100%)] bg-[length:100%_40px] opacity-20" />
        </div>
        {children}
      </body>
    </html>
  );
}
