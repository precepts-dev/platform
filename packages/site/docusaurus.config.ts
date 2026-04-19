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
          type: 'docSidebar',
          sidebarId: 'integrationSidebar',
          position: 'left',
          label: 'Integrations',
        },
        {
          type: 'docSidebar',
          sidebarId: 'productSidebar',
          position: 'left',
          label: 'Product',
        },
        {
          type: 'docSidebar',
          sidebarId: 'uxSidebar',
          position: 'left',
          label: 'UX',
        },
        {
          type: 'docSidebar',
          sidebarId: 'projectManagementSidebar',
          position: 'left',
          label: 'Project Management',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Integrations',
              to: '/docs/integration/',
            },
            {
              label: 'Product',
              to: '/docs/product/',
            },
            {
              label: 'UX',
              to: '/docs/ux/',
            },
            {
              label: 'Project Management',
              to: '/docs/project-management/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/users/7977273/dishant-kamble',
            },
            {
              label: 'X',
              href: 'https://x.com/dishantk',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/precepts-dev/platform',
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
