import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { resolve: true, only: true },
  outDir: process.argv[2] === 'development' ? 'dist' : '../core/dist/cli',
})
