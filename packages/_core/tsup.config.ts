// import fs from 'node:fs'
import { defineConfig } from 'tsup'
import { options } from './tsup.config.base'
import { glob } from 'glob'

const entry = [
  'src/index.ts',
  'src/root.ts',
  'src/start/index.ts',
  'src/start/app.ts',
  ...glob.sync('src/module/*.ts'),
].map(v => v.replace(/\\/g, '/'))

export default defineConfig({
  ...options,
  clean: false,
  splitting: false,
  entry,
  treeshake: 'recommended',
  dts: {
    resolve: true,
    entry: [
      ...entry,
      'src/global.d.ts',
    ],
  },
  esbuildOptions (options) {
    options.chunkNames = 'chunk/[name]-[hash]'
  },
})
