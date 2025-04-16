import fs from 'node:fs'
import { defineConfig } from 'tsup'
import { options } from './tsup.base'

/** 删掉index.js index.d.ts */
fs.rmSync('dist/index.js', { force: true })
fs.rmSync('dist/index.d.ts', { force: true })

export default defineConfig({
  ...options,
  clean: true,
  entry: [
    'src/index.ts',
    'src/root.ts',
  ], // 入口文件
  external: [
    ...(options.external || []),
    '@karinjs/node-pty',
    '@karinjs/plugin-webui-network-monitor',
    'dotenv',
    'jsonwebtoken',
    'log4js',
  ],
})
