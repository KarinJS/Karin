import { defineConfig } from 'tsup'
import { options } from '../../tsup.config.base'

export default defineConfig({
  ...options,
  clean: false,
  splitting: false,
  entry: [
    'src/index.ts',
  ],
  treeshake: 'recommended',
  dts: true,
  esbuildOptions (options) {
    options.chunkNames = 'chunk/[name]-[hash]'
  },
})
