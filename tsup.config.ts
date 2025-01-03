import { defineConfig } from 'tsup'
import { rm } from 'fs/promises'

// 清理构建目录
await rm('./lib', { recursive: true, force: true }).catch(() => null)

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'node16',
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  outDir: 'lib',
  treeshake: true,
  external: [
    'art-template',
    'axios',
    'chalk',
    'chokidar',
    'commander',
    'express',
    'level',
    'lodash',
    'log4js',
    'moment',
    'node-schedule',
    'redis',
    'ws',
    'yaml',
  ],

})
