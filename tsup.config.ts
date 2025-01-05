import fs from 'node:fs'
import { URL } from 'node:url'
import { Options } from 'tsup'
import { defineConfig } from 'tsup'

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))

/**
 * @description `tsup` configuration options
 */
export const options: Options = {
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node16',
  splitting: false,
  sourcemap: false,
  clean: false,
  dts: true,
  outDir: 'lib',
  treeshake: false,
  external: Object.keys(pkg.dependencies),
  ignoreWatch: ['src/modules'],
}

export default defineConfig(options)
