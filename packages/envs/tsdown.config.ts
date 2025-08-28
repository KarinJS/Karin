import fs from 'node:fs'
import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: 'src/index.ts',
  fixedExtension: true, // 固定为mjs
  dts: {
    resolve: true,
  },
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  sourcemap: false,
  clean: true,
  treeshake: true,
  hooks: {
    'build:done': async () => {
      /** 将d.mts重命名为d.ts */
      const dtsFile = './dist/index.d.mts'
      if (fs.existsSync(dtsFile)) {
        fs.renameSync(dtsFile, './dist/index.d.ts')
      }
    },
  },
})
