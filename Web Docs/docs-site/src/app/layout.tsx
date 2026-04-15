import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  title: {
    default: "Scriptable iOS Widgets",
    template: "%s | Scriptable iOS Widgets",
  },
  description:
    "Modern, customizable documentation for a curated collection of Scriptable widgets.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Scriptable iOS Widgets",
    description:
      "Modern, customizable documentation for a curated collection of Scriptable widgets.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

function ThemeScript() {
  const script = `(function(){
    var stored = localStorage.getItem('docs-theme');
    var theme = stored || 'dark';
    document.documentElement.dataset.theme = theme;
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${monoFont.variable} theme-gradient tint`}
      suppressHydrationWarning
    >
      <body className="site-background">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
