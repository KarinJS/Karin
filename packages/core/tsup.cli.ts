import { defineConfig } from 'tsup'
import { options } from './tsup.base'

export default defineConfig({
  ...options,
  entry: ['exports/cli/index.ts'],
  format: ['esm'],
  clean: true,
  outDir: 'dist/cli',
  treeshake: true,
  minify: 'terser',
})
