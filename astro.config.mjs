import { defineConfig } from 'astro/config';

// SITE and BASE_PATH are set by the GitHub Pages workflow.
// Locally (and on a custom domain) the site lives at the root.
export default defineConfig({
  site: process.env.SITE || 'https://simipicsart.in',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
