import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  format: 'cjs',
  outDir: 'lib',
  env: {
    FIREBASE_CONFIG: 'true',
  },
});
