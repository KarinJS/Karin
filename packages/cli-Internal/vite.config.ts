import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    target: 'node18',
    lib: {
      formats: ['es'],
      fileName: 'index',
      entry: ['src/index.ts'],
    },
    emptyOutDir: true,
    outDir: process.argv[4] === 'development' ? 'dist' : '../core/dist/cli',
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((mod) => `node:${mod}`),
      ],
      output: {
        inlineDynamicImports: true,
        entryFileNames: '[name].mjs',
      },
      cache: false,
    },
    minify: 'terser',
    commonjsOptions: {
      include: [
        /node_modules/,
      ],
    },
  },
})
