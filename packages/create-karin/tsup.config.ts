import fs from 'node:fs'
import { URL } from 'node:url'
import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))

/**
 * @description `tsup` configuration options
 */
export const options: Options = {
  entry: ['src/index.ts'], // 入口文件
  format: ['cjs'], // 输出格式
  target: 'node16', // 目标环境
  splitting: false, // 是否拆分文件
  sourcemap: false, // 是否生成 sourcemap
  clean: false, // 是否清理输出目录
  dts: true, // 是否生成 .d.ts 文件
  outDir: 'lib', // 输出目录
  treeshake: false, // 树摇优化
  minify: false, // 压缩代码
  external: Object.keys(pkg.dependencies),
  shims: true,
}

export default defineConfig(options)
