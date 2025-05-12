import fs from 'node:fs'
import { defineConfig } from 'tsup'
import { builtinModules } from 'node:module'
import { options } from './tsup.config.base'

/**
 * 删除dist目录下的出文件夹外的所有文件 不递归删除
 */
if (fs.existsSync('dist')) {
  fs.readdirSync('dist', { withFileTypes: true }).forEach((file) => {
    if (file.isFile()) {
      fs.unlinkSync(`dist/${file.name}`)
    }
  })
}

const entry = [
  'src/index.ts',
  'src/root.ts',
  'src/start/index.ts',
  'src/start/app.ts',
]

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
    banner: 'import EventEmitter from \'events\';',
  },
})
