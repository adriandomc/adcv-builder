import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    csp: {
      mode: 'hash',
      directives: {
        'default-src': ['self'],
        'img-src': ['self', 'data:', 'https:'],
        'style-src': ['self', 'unsafe-inline']
      }
    },
    alias: {
      $components: 'src/components',
      $styles: 'src/styles'
    }
  }
};

export default config;
