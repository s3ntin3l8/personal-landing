// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://s3ntin3l8.de',
  vite: { plugins: [tailwindcss()] },
});
