import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: 'src/module/yaml.ts',
  dts: {
    resolve: true,
    emitDtsOnly: true,
  },
  outDir: 'dist/module',
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  sourcemap: false,
  clean: false,
  treeshake: true,
})
