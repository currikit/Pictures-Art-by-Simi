import { defineConfig } from 'astro/config';

// Replace with the real domain once Simi confirms it.
export default defineConfig({
  site: 'https://simipicsart.in',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
