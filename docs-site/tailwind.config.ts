import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        page: 'rgb(var(--page) / <alpha-value>)',
        pageSoft: 'rgb(var(--page-soft) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        panelStrong: 'rgb(var(--panel-strong) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        brand: 'rgb(var(--brand) / <alpha-value>)',
        brandStrong: 'rgb(var(--brand-strong) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        glow: 'rgb(var(--glow) / <alpha-value>)',
        codebg: 'rgb(var(--code-bg) / <alpha-value>)',
      },
      boxShadow: {
        soft: '0 12px 26px -16px rgba(0, 20, 45, 0.45)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-display)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },
      maxWidth: {
        docs: '1520px',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 540ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
