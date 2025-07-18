import { defineConfig } from 'tsup'
import { options } from '../core/tsup.config.base'

export default defineConfig({
  ...options,
  clean: true,
  splitting: false,
  entry: [
    'src/index.ts',
  ],
  treeshake: 'recommended',
  dts: {
    resolve: true,
  },
})
