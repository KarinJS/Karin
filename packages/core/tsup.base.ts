import fs from 'node:fs'
import { URL } from 'node:url'
import type { Options } from 'tsup'

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))

const noExternal = []
const external = Object.keys(pkg.dependencies).filter(dep => !noExternal.includes(dep))

/**
 * @description `tsup` configuration options
 */
export const options: Options = {
  entry: [], // 入口文件
  format: ['esm'], // 输出格式
  target: 'node16', // 目标环境
  splitting: false, // 是否拆分文件
  sourcemap: false, // 是否生成 sourcemap
  clean: false, // 是否清理输出目录
  dts: {
    compilerOptions: {
      removeComments: false, // 是否删除注释
      noUnusedLocals: false, // 是否删除未使用的局部变量
      noUnusedParameters: false, // 是否删除未使用的参数
      preserveConstEnums: true, // 是否保留常量枚举
      stripInternal: false, // 是否删除内部注释
      skipLibCheck: true, // 是否跳过库检查
      preserveSymlinks: false, // 是否保留符号链接
      types: ['@types/node']
    }
  }, // 是否生成 .d.ts 文件
  outDir: 'dist', // 输出目录
  treeshake: true, // 树摇优化
  minify: false, // 压缩代码
  ignoreWatch: ['src/modules'],
  shims: false,
  noExternal,
  external,
}
