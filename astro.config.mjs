import { defineConfig } from 'astro/config';

export default defineConfig({
  // Needed for Astro.url to resolve absolute URLs, and required if
  // @astrojs/sitemap is added later.
  site: 'https://rawanaladdin.com',
  output: 'static',
  build: {
    format: 'file'
  }
});
