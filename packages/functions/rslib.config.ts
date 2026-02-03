import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [{ format: 'esm', syntax: 'es2017' }],
  output: {
    sourceMap: true,
    target: 'node',
  },
  source: {
    tsconfigPath: './tsconfig.json',
  },
});
