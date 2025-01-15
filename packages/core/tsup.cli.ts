import fs from 'node:fs'
import { URL } from 'node:url'
import { defineConfig } from 'tsup'

fs.rmSync('dist/cli', { recursive: true, force: true })
const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))

export default defineConfig({
  entry: ['exports/cli/index.ts'],
  format: ['cjs', 'esm'],
  target: 'node16',
  splitting: false,
  sourcemap: false,
  clean: false,
  dts: true,
  outDir: 'dist/cli',
  treeshake: true,
  external: Object.keys(pkg.dependencies),
})
