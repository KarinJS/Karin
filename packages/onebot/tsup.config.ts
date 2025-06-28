import { defineConfig } from 'tsup'
import { builtinModules } from 'node:module'

export default defineConfig({
  entry: ['src/index.ts'], // 入口文件
  format: ['esm'], // 输出格式
  target: 'node18', // 目标环境
  platform: 'node',
  splitting: false, // 是否拆分文件
  sourcemap: false, // 是否生成 sourcemap
  clean: true, // 是否清理输出目录
  dts: true, // 是否生成 .d.ts 文件
  outDir: 'dist', // 输出目录
  treeshake: true, // 树摇优化
  minify: false, // 压缩代码
  shims: true,
  removeNodeProtocol: false,
  skipNodeModulesBundle: false,
  external: [
    ...builtinModules,
    ...builtinModules.map((node) => `node:${node}`),
  ],
  outExtension () {
    return {
      js: '.mjs',
    }
  },
})
