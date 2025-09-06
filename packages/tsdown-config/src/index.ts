/* eslint-disable @stylistic/yield-star-spacing */
/* eslint-disable @stylistic/generator-star-spacing */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown/config'
import { URL } from 'url'

/**
 * 递归遍历 dist 下所有 .d.mts 文件 (生成器形式, 更省内存)
 * @param dir - 目录路径
 */
function* iterateDMtsFiles (dir: string): Iterable<string> {
  if (!fs.existsSync(dir)) return
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* iterateDMtsFiles(full)
      continue
    }
    if (dirent.name.endsWith('.d.mts')) {
      yield full
    }
  }
}

/**
 * 将 .d.mts 重命名为 .d.ts
 */
const renameDMtsToDts = (files: Iterable<string>) => {
  for (const file of files) {
    const target = file.replace(/\.d\.mts$/, '.d.ts')
    if (fs.existsSync(file)) {
      // 若已存在目标文件，先删除以避免异常
      if (fs.existsSync(target)) fs.rmSync(target)
      fs.renameSync(file, target)
    }
  }
}

/**
 * tsdown配置
 * @param fileUrl - import.meta.url
 * @param options - tsdown配置选项
 */
const config = (
  fileUrl: string | URL,
  options: Parameters<typeof defineConfig>[0] = {}
): ReturnType<typeof defineConfig> => {
  const cfg = defineConfig({
    entry: ['src/index.ts'],
    fixedExtension: true, // 固定为mjs
    dts: true,
    format: ['esm'],
    target: 'node18',
    platform: 'node',
    sourcemap: false,
    outDir: 'dist',
    clean: true,
    treeshake: true,
    hooks: {
      'build:done': async () => {
        const root = path.resolve(fileURLToPath(fileUrl), '../', cfg.outDir)
        renameDMtsToDts(iterateDMtsFiles(root))
      },
    },
    ...options,
  })

  return cfg
}

export default config
