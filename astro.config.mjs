// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
    define: {
      // Shim process for Cloudflare Workers runtime (no Node.js globals)
      'process.env': '({})',
      'process.stdout': '({ write: function(){} })',
      'process.stderr': '({ write: function(){} })',
    },
  },
});