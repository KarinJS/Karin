/**
 * 重载逻辑模块
 *
 * @description
 * 处理 dev 类型插件的热重载逻辑
 *
 * @module hmr/reload
 */

import { formatPath } from '@karinjs/utils'
import { store, pkgRegistry } from '@karinjs/plugin'
import { clearModuleCache, findDependentModules, clearModuleCaches } from './cache'

/**
 * 重载结果
 */
export interface ReloadResult {
  /** 是否成功 */
  success: boolean
  /** 文件路径 */
  file: string
  /** 移除的插件数量 */
  removedCount: number
  /** 新增的插件数量 */
  addedCount: number
  /** 清理的缓存数量 */
  clearedCaches: number
  /** 错误信息 */
  error?: string
}

/**
 * 重载单个 dev 文件
 *
 * @description
 * 1. 删除旧插件（通过 store.delByFile）
 * 2. 清理 ESM 缓存（Node 内部 API）
 * 3. 重新导入模块
 * 4. 新插件自动注册到 store
 *
 * @param file - 文件绝对路径
 * @returns 重载结果
 *
 * @example
 * ```ts
 * const result = await reloadDevFile('/path/to/plugin.ts')
 * if (result.success) {
 *   console.log(`Reloaded: -${result.removedCount} +${result.addedCount}`)
 * }
 * ```
 */
export async function reloadDevFile (file: string): Promise<ReloadResult> {
  try {
    // 1. 获取变更前的插件数量
    const beforePlugins = store.getByFile(file)
    const removedCount = beforePlugins.length

    // 2. 删除旧插件
    store.delByFile(file)

    // 3. 查找依赖该模块的其他模块
    const dependents = findDependentModules(file)

    // 4. 清理所有相关缓存
    const allFiles = [file, ...dependents]
    const clearedCaches = clearModuleCaches(allFiles)

    // 5. 重新导入主模块
    const fileUrl = formatPath(file, { type: 'fileURL' })
    await import(`${fileUrl}?t=${Date.now()}`)

    // 6. 获取新注册的插件数量
    const afterPlugins = store.getByFile(file)
    const addedCount = afterPlugins.length

    return {
      success: true,
      file,
      removedCount,
      addedCount,
      clearedCaches,
    }
  } catch (err) {
    return {
      success: false,
      file,
      removedCount: 0,
      addedCount: 0,
      clearedCaches: 0,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

/**
 * 重载整个 dev 包
 *
 * @param pkgName - 包名
 * @returns 所有文件的重载结果
 */
export async function reloadDevPackage (pkgName: string): Promise<{
  success: boolean
  pkgName: string
  results: ReloadResult[]
}> {
  const files = pkgRegistry.getFiles(pkgName)

  if (files.length === 0) {
    return {
      success: false,
      pkgName,
      results: [],
    }
  }

  // 先删除所有插件
  store.delByPkg(pkgName)

  // 清理所有文件缓存
  clearModuleCaches(files)

  // 重新加载所有文件
  const results: ReloadResult[] = []
  for (const file of files) {
    const result = await reloadDevFile(file)
    results.push(result)
  }

  return {
    success: results.every(r => r.success),
    pkgName,
    results,
  }
}

/**
 * 处理文件添加
 */
export async function handleFileAdd (file: string): Promise<ReloadResult> {
  try {
    const fileUrl = formatPath(file, { type: 'fileURL' })
    await import(`${fileUrl}?t=${Date.now()}`)

    const plugins = store.getByFile(file)

    return {
      success: true,
      file,
      removedCount: 0,
      addedCount: plugins.length,
      clearedCaches: 0,
    }
  } catch (err) {
    return {
      success: false,
      file,
      removedCount: 0,
      addedCount: 0,
      clearedCaches: 0,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

/**
 * 处理文件删除
 */
export function handleFileUnlink (file: string): ReloadResult {
  const beforePlugins = store.getByFile(file)
  const removedCount = beforePlugins.length

  store.delByFile(file)
  clearModuleCache(file)

  return {
    success: true,
    file,
    removedCount,
    addedCount: 0,
    clearedCaches: 1,
  }
}
