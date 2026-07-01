import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  // Keep Puppeteer (and its bundled Chromium) out of the SSR/dep bundling — it's
  // imported only from server-only code and resolved at runtime from node_modules.
  ssr: { external: ['puppeteer'] },
  optimizeDeps: { exclude: ['puppeteer'] },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node'
  }
});
