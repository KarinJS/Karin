import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'tsdown/config'

const outDir = process.argv[3] === 'development' ? 'dist' : '../core/dist/cli'

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
  outDir,
  hooks: {
    'build:done': async () => {
      if (process.argv[3] === 'development') return

      const file = path.join(process.cwd(), outDir, 'pm2.js')
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      }
      const content = 'import \'node-karin/start\''
      fs.writeFileSync(file, content)
      /** 将d.mts重命名为d.ts */
      const dtsFile = path.join(process.cwd(), outDir, 'index.d.mts')
      if (fs.existsSync(dtsFile)) {
        fs.renameSync(dtsFile, path.join(process.cwd(), outDir, 'index.d.ts'))
      }
    },
  },
})
