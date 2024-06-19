import { resolve } from 'node:path';
import { defineConfig } from '@rsbuild/core';
import { pluginPreact } from '@rsbuild/plugin-preact';

console.log();

export default defineConfig({
  plugins: [pluginPreact()],
  html: {
    template: resolve(__dirname, 'src/index.html'),
  },
  source: {
    define: {
      'process.env.HASH': JSON.stringify(process.env.HASH ?? ''),
    },
  },
});
