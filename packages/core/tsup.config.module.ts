import { defineConfig } from 'tsup'
import { options } from './tsup.config.base'

export default defineConfig({
  ...options,
  tsconfig: 'tsconfig.node.json',
  entry: ['module/*.ts'],
  format: ['esm'],
  clean: true,
  outDir: 'dist/module',
})
