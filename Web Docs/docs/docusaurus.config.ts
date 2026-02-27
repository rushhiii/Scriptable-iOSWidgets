import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Scriptable iOS Widgets',
  tagline: 'The ultimate handbook for iOS widgets',
  favicon: 'https://raw.githubusercontent.com/rushhiii/Scriptable-iOSWidgets/dd745134a5b46c44529d629a6fa9f0229980b3fe/.assets/favicon_sr.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'rushhiii', // Your GitHub org/user name.
  projectName: 'Scriptable-IOSWidgets', // Your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/rushhiii/Scriptable-IOSWidgets/edit/main/Web%20Docs/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/rushhiii/Scriptable-IOSWidgets/edit/main/Web%20Docs/docs/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
      defaultMode: 'dark',
    },
    navbar: {
      title: 'Scriptable iOS Widgets',
      logo: {
        alt: 'Scriptable iOS Widgets Logo',
        src: 'https://raw.githubusercontent.com/rushhiii/Scriptable-iOSWidgets/dd745134a5b46c44529d629a6fa9f0229980b3fe/.assets/favicon_sr.png',
      },
      items: [
        {type: 'doc', docId: 'home', position: 'right', label: 'Home'},
        {type: 'doc', docId: 'overview', position: 'right', label: 'Overview'},
        {type: 'doc', docId: 'installation', position: 'right', label: 'Installation'},
        // {type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Widget Library'},
        {href: 'https://github.com/rushhiii/Scriptable-IOSWidgets', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Overview', to: '/docs/overview'},
            {label: 'Installation', to: '/docs/installation'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/rushhiii/Scriptable-IOSWidgets'},
            {label: 'Discord', href: 'https://discord.gg/your-discord-link'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Widget Library', to: '/docs/widgets/weather-widget'},
            {label: 'Contributing', to: '/docs/contributing'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} rushhiii. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/docs/',
            from: ['/'],
          },
        ],
      },
    ],
  ],
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@700;800&display=swap',
      },
    },
  ],
};

export default config;