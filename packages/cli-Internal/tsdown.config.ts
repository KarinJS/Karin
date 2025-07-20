import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: 'src/index.ts',
  dts: {
    resolve: true,
  },
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  sourcemap: false,
  clean: true,
  treeshake: true,
  outDir: process.argv[3] === 'development' ? 'dist' : '../core/dist/cli',
})
