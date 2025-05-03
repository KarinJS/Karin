import fs from 'node:fs'
import { URL } from 'node:url'
import { builtinModules } from 'node:module'
import type { Options } from 'tsup'

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))

/**
 * @description `tsup` configuration options
 */
export const options: Options = {
  entry: [], // 入口文件
  format: ['esm'], // 输出格式
  target: 'node18', // 目标环境
  splitting: false, // 是否拆分文件
  sourcemap: false, // 是否生成 sourcemap
  clean: false, // 是否清理输出目录
  dts: true, // 是否生成 .d.ts 文件
  outDir: 'dist', // 输出目录
  treeshake: true, // 树摇优化
  minify: false, // 压缩代码
  shims: false,
  external: [
    ...builtinModules,
    ...builtinModules.map((node) => `node:${node}`),
    ...Object.keys(pkg.dependencies),
    '@karinjs/node-pty',
    '@karinjs/plugin-webui-network-monitor',
    '@karinjs/plugins-list',
  ],
  outExtension () {
    return {
      js: '.mjs',
    }
  },
}
