// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://lookin12142.github.io',
  base: '/test-libro-reclamaciones/',

  integrations: [react(), tailwind()],

  server: {
    port: 3000
  }
});
