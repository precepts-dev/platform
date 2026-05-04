import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Precepts',
  tagline: 'Built for humans. Ready for agents.',
  favicon: 'img/favicon.svg',

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      ({
        hashed: true,
        searchBarShortcutKeymap: "ctrl+shift+f",
      }),
    ]
  ],

  future: {
    v4: true,
  },

  url: 'https://docs.precepts.dev',
  baseUrl: '/',

  organizationName: 'precepts-dev',
  projectName: 'platform',

  onBrokenLinks: 'throw',

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'text/plain',
        title: 'AI Index',
        href: '/llms.txt',
      },
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          async sidebarItemsGenerator({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const items = await defaultSidebarItemsGenerator(args);
            // When positions tie, Docusaurus alphabetically tiebreaks by source
            // path, which can put categories (e.g. "Guidelines") before intro docs
            // (e.g. "Product Management Standards"). Fix: docs sort before categories
            // at each level so intro/landing pages always appear first.
            items.sort((a, b) => {
              if (a.type === 'doc' && b.type === 'category') return -1;
              if (a.type === 'category' && b.type === 'doc') return 1;
              return 0;
            });
            return items;
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/precept-logo-dark.svg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Precepts',
      logo: {
        alt: 'Precepts Logo',
        src: 'img/precept-logo-dark.svg',       // Light mode version
        srcDark: 'img/precept-logo-light.svg', // Dark mode version
      },
      items: [
        {
          type: 'dropdown',
          label: 'Standards',
          position: 'left',
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'integrationSidebar',
              label: 'Integration',
            },
            {
              type: 'docSidebar',
              sidebarId: 'productSidebar',
              label: 'Product Management',
            },
            {
              type: 'docSidebar',
              sidebarId: 'uxSidebar',
              label: 'UX',
            },
            {
              type: 'docSidebar',
              sidebarId: 'projectManagementSidebar',
              label: 'Project Management',
            },
          ],
        },
        {
          href: 'https://github.com/precepts-dev/platform',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          type: 'docSidebar',
          sidebarId: 'communitySidebar',
          label: 'Contributing',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Standards',
          items: [
            {
              label: 'Integration',
              to: '/integration/',
            },
            {
              label: 'Product Management',
              to: '/product/',
            },
            {
              label: 'UX',
              to: '/ux/',
            },
            {
              label: 'Project Management',
              to: '/project-management/',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/dishant-kamble/',
            },
            {
              label: 'X',
              href: 'https://x.com/dishantk',
            },
          ],
        },
        {
          title: 'Open Source',
          items: [
            {
              label: 'Platform',
              href: 'https://github.com/precepts-dev/platform',
            },
            {
              label: 'Standards',
              href: 'https://github.com/precepts-dev/standards',
            },
          ],
        },
        {
          title: 'Tooling',
          items: [
            {
              label: 'MCP Server',
              href: 'https://github.com/precepts-dev/platform/tree/main/packages/mcp-server',
            },
            {
              label: 'llms.txt — AI agent index',
              href: 'https://docs.precepts.dev/llms.txt',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Precepts. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
