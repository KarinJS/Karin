/**
 * Node.js ESM 缓存清理模块
 *
 * @description
 * 使用 Node.js 内部 API 清理 ESM 模块缓存
 * 仅用于 dev 类型插件的热更新
 *
 * @module hmr/cache
 */

import { formatPath } from '@karinjs/utils'

/**
 * ESM 模块加载器类型
 */
interface ESMLoader {
  loadCache: Map<string, unknown>
  moduleRegistries?: Map<unknown, Map<string, unknown>>
}

/**
 * 获取 ESM 加载器实例
 * @returns ESM 加载器或 null
 */
function getESMLoader (): ESMLoader | null {
  try {
    // Node.js 内部 API，用于访问 ESM 缓存
    // @ts-expect-error - 访问 Node 内部 API
    const loader = globalThis[Symbol.for('nodejs.esm.loader')]
    return loader ?? null
  } catch {
    return null
  }
}

/**
 * 清理单个模块的 ESM 缓存
 *
 * @param file - 文件绝对路径
 * @returns 是否成功清理
 *
 * @example
 * ```ts
 * const cleared = clearModuleCache('/path/to/module.ts')
 * if (cleared) {
 *   console.log('Cache cleared, ready for reimport')
 * }
 * ```
 */
export function clearModuleCache (file: string): boolean {
  const loader = getESMLoader()
  if (!loader?.loadCache) {
    return false
  }

  const fileUrl = formatPath(file, { type: 'fileURL' })
  let deleted = false

  // 删除主模块缓存
  if (loader.loadCache.has(fileUrl)) {
    loader.loadCache.delete(fileUrl)
    deleted = true
  }

  // 删除带时间戳的缓存变体
  for (const key of loader.loadCache.keys()) {
    if (key.startsWith(fileUrl) && key.includes('?t=')) {
      loader.loadCache.delete(key)
      deleted = true
    }
  }

  return deleted
}

/**
 * 批量清理模块缓存
 *
 * @param files - 文件路径数组
 * @returns 清理的模块数量
 *
 * @example
 * ```ts
 * const count = clearModuleCaches([
 *   '/path/to/module1.ts',
 *   '/path/to/module2.ts'
 * ])
 * console.log(`Cleared ${count} modules`)
 * ```
 */
export function clearModuleCaches (files: string[]): number {
  let count = 0
  for (const file of files) {
    if (clearModuleCache(file)) {
      count++
    }
  }
  return count
}

/**
 * 查找依赖指定模块的所有模块
 *
 * @description
 * 在 ESM 缓存中查找所有导入了指定模块的模块，
 * 用于级联清理依赖链
 *
 * @param targetFile - 目标文件路径
 * @returns 依赖该模块的文件路径数组
 */
export function findDependentModules (targetFile: string): string[] {
  const loader = getESMLoader()
  if (!loader?.loadCache) {
    return []
  }

  const targetUrl = formatPath(targetFile, { type: 'fileURL' })
  const dependents: string[] = []

  // 遍历缓存查找依赖
  for (const [url, moduleRecord] of loader.loadCache.entries()) {
    if (url === targetUrl) continue

    // 检查模块是否依赖目标模块
    const record = moduleRecord as any
    if (record?.importMeta?.url || record?.url) {
      // 简化检查：如果模块记录中包含目标 URL 的引用
      try {
        const deps = record.dependencies || record.imports || []
        if (Array.isArray(deps) && deps.some((dep: string) => dep.includes(targetUrl))) {
          dependents.push(url.replace('file:///', '').replace(/\//g, '/'))
        }
      } catch {
        // 忽略解析错误
      }
    }
  }

  return dependents
}

/**
 * 获取当前 ESM 缓存统计
 *
 * @returns 缓存统计信息
 */
export function getCacheStats (): {
  available: boolean
  size: number
  modules: string[]
} {
  const loader = getESMLoader()
  if (!loader?.loadCache) {
    return { available: false, size: 0, modules: [] }
  }

  return {
    available: true,
    size: loader.loadCache.size,
    modules: Array.from(loader.loadCache.keys()),
  }
}

/**
 * 清理所有以指定前缀开始的模块缓存
 *
 * @param prefix - URL 前缀
 * @returns 清理的模块数量
 */
export function clearCacheByPrefix (prefix: string): number {
  const loader = getESMLoader()
  if (!loader?.loadCache) {
    return 0
  }

  const prefixUrl = formatPath(prefix, { type: 'fileURL' })
  let count = 0

  for (const key of loader.loadCache.keys()) {
    if (key.startsWith(prefixUrl)) {
      loader.loadCache.delete(key)
      count++
    }
  }

  return count
}
