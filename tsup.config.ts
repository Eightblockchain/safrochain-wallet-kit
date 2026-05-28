import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Peer dependencies must NOT be bundled
  external: [
    'react',
    'react-dom',
    '@cosmos-kit/react',
    '@cosmos-kit/core',
  ],
  // No esbuild plugins — consumers using vite-plugin-node-polyfills require a
  // plugin-free build input.
});
