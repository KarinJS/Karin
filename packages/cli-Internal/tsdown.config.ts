import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'node18',
  platform: 'node',
  dts: {
    build: false,
    compilerOptions: {
      declarationMap: false,
      sourceMap: false,
    },
  },
  sourcemap: false,
  minify: false,
  outDir: 'dist',
  clean: true,
  deps: {
    alwaysBundle: ['commander', 'yaml'],
    onlyBundle: false,
  },
  outExtensions ({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
      dts: '.d.ts',
    }
  },
})
