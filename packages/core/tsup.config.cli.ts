import { defineConfig } from 'tsup'
import { options } from './tsup.config.base'

export default defineConfig({
  ...options,
  tsconfig: 'tsconfig.node.json',
  entry: ['exports/cli/index.ts'],
  format: ['esm'],
  clean: true,
  outDir: 'dist/cli',
  treeshake: true,
  minify: 'terser',
})
