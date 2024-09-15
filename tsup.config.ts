import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['./src/index.ts'],
  minify: true,
  dts: true,
  shims: true,
  clean: true,
  skipNodeModulesBundle: true,
});
