import { defineConfig } from 'tsup'
import { options } from './tsup.config.base'

export default defineConfig({
  ...options,
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { resolve: true, only: true },
  outDir: 'dist',
})
