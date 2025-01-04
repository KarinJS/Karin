import fs from 'node:fs'
import { URL } from 'node:url'
import { defineConfig } from 'tsup'

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node16',
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  outDir: 'lib',
  treeshake: false,
  external: Object.keys(pkg.dependencies),
})
