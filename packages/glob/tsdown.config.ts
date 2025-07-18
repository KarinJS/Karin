import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: 'src/index.ts',
  dts: {
    resolve: ['glob'],
  },
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  sourcemap: false,
  clean: true,
  treeshake: true,
  // fixedExtension: true,
})
