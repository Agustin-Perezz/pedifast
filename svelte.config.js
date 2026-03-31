import { resolve } from 'path';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({ runtime: 'nodejs22.x' }),

    alias: {
      $lib: resolve('./src/lib'),
      '$lib/*': resolve('./src/lib/*'),
      $components: resolve('./src/lib/components'),
      '$components/*': resolve('./src/lib/components/*'),
      $schemas: resolve('./src/lib/schemas'),
      '$schemas/*': resolve('./src/lib/schemas/*'),
      $domain: resolve('./src/lib/domain'),
      '$domain/*': resolve('./src/lib/domain/*')
    }
  }
};

export default config;
