import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { siteBase, siteOrigin } from './src/config/site.ts';
import { isSitemapPage } from './src/lib/sitemap.ts';

export default defineConfig({
  site: siteOrigin,
  base: siteBase,
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => isSitemapPage(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
