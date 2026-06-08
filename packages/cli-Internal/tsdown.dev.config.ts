import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    emitDtsOnly: true,
    build: false,
    compilerOptions: {
      declarationMap: false,
      sourceMap: false,
    },
  },
  sourcemap: false,
  outDir: 'dist',
  clean: false,
  outExtensions () {
    return {
      js: '.mjs',
      dts: '.d.ts',
    }
  },
})
