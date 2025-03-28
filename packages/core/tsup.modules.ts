import { defineConfig } from 'tsup'
import { options } from './tsup.base'

export default defineConfig({
  ...options,
  entry: ['exports/module/*.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  outDir: 'dist/module',
})
