import fs from 'node:fs'
import { URL } from 'node:url'
import { defineConfig } from 'tsup'

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))
const noExternal = ['jsonwebtoken', 'systeminformation', 'commander']
const external = Object.keys(pkg.dependencies).filter(dep => !noExternal.includes(dep))

export default defineConfig({
  entry: ['exports/cli/index.ts'],
  format: ['cjs', 'esm'],
  target: 'node16',
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  outDir: 'dist/cli',
  treeshake: true,
  external,
  noExternal,
})
