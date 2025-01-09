import fs from 'node:fs'
import { URL, fileURLToPath } from 'node:url'
import { Options } from 'tsup'
import { defineConfig } from 'tsup'

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))

/** 兼容@karinjs/karin-types */
const packagesDir = new URL('packages', import.meta.url)
const file = fileURLToPath(packagesDir) + '/types/index.d.ts'
if (!fs.existsSync(file)) fs.writeFileSync(file, '')

/**
 * @description `tsup` configuration options
 */
export const options: Options = {
  entry: ['src/index.ts'], // 入口文件
  format: ['esm'], // 输出格式
  target: 'node16', // 目标环境
  splitting: false, // 是否拆分文件
  sourcemap: false, // 是否生成 sourcemap
  clean: false, // 是否清理输出目录
  dts: true, // 是否生成 .d.ts 文件
  outDir: 'lib', // 输出目录
  treeshake: true, // 树摇优化
  minify: true, // 压缩代码
  external: Object.keys(pkg.dependencies),
  ignoreWatch: ['src/modules'],
}

export default defineConfig(options)
