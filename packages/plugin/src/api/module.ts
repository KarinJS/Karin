/**
 * Module API - 模块操作
 * @module api/module
 */

import { formatPath } from '@karinjs/utils'
import { cache } from './cache'

/** 是否为开发环境 */
const isDev = process.env.NODE_ENV === 'development' || process.env.KARIN_DEV === 'true'

/** ESM 缓存引用（懒加载） */
let esmCacheRef: Map<string, unknown> | null = null

/** 是否支持 ESM 缓存操作 */
let esmCacheSupported: boolean | null = null

/**
 * ESM 模块加载缓存
 * 支持 Node.js 18+（仅开发环境）
 */
/* istanbul ignore next -- @preserve ESM 内部 API 无法在测试环境访问 */
const loadCache = async (): Promise<Map<string, unknown> | null> => {
  // 生产环境不使用内部 API
  if (!isDev) return null

  // 已缓存
  if (esmCacheRef !== null) return esmCacheRef
  if (esmCacheSupported === false) return null

  try {
    // 尝试获取较新版本 Node.js 的 ESM 缓存 (Node.js v20.6+)
    // @ts-ignore - 访问内部 API
    const mod = await import('node:internal/modules/esm/loader')
    esmCacheRef = mod.default.getOrInitializeCascadedLoader().loadCache
    esmCacheSupported = true
    return esmCacheRef
  } catch {
    try {
      // 尝试获取较旧版本 Node.js 的 ESM 缓存 (Node.js v18+)
      // @ts-ignore - 访问内部 API
      const mod = await import('node:internal/process/esm_loader')
      esmCacheRef = mod.default.esmLoader
      esmCacheSupported = true
      return esmCacheRef
    } catch {
      esmCacheSupported = false
      return null
    }
  }
}

/**
 * 清理 ESM 模块缓存（开发环境）
 * @param fileURLs 模块的 URL 数组
 */
const clearESMCache = async (fileURLs: string | string[]): Promise<void> => {
  const esmCache = await loadCache()
  if (!esmCache) return

  const urls = Array.isArray(fileURLs) ? fileURLs : [fileURLs]
  urls.forEach(url => {
    if (esmCache.has(url)) {
      esmCache.delete(url)
    }
  })
}

/**
 * 查找依赖某模块的所有模块 URL（开发环境）
 * @param moduleUrl 模块的 URL
 * @param exclude 排除的模块 URL 数组
 * @returns 依赖该模块的模块 URL 数组
 */
/* istanbul ignore next -- @preserve ESM 内部 API 无法在测试环境访问 */
const findDependentModulesFromCache = async (
  moduleUrl: string,
  exclude: string[] = []
): Promise<string[]> => {
  const esmCache = await loadCache()
  // 生产环境：只返回当前模块
  if (!esmCache) return [moduleUrl]

  const result: string[] = []
  const visited = new Set<string>(exclude)
  const processing = new Set<string>()

  const collectDependents = async (url: string): Promise<void> => {
    if (visited.has(url) || processing.has(url)) return

    processing.add(url)
    visited.add(url)
    result.push(url)

    const dependentUrls: string[] = []
    const cacheEntries = Array.from(esmCache.entries())

    await Promise.allSettled(cacheEntries.map(async (entry) => {
      const [cacheUrl, moduleData] = entry as [string, Record<string, any>]

      if (cacheUrl.includes('node_modules') || cacheUrl.includes('node:') || visited.has(cacheUrl)) {
        return
      }

      if (moduleData?.javascript?.linked || moduleData?.linked) {
        try {
          const linkedModules = await moduleData.javascript?.linked || moduleData.linked
          const modules = Array.from(linkedModules)

          for (const linkedModule of modules) {
            // @ts-ignore
            if (linkedModule.url === url) {
              dependentUrls.push(cacheUrl)
              break
            }
          }
        } catch {
          // 忽略链接错误
        }
      }
    }))

    if (dependentUrls.length > 0) {
      await Promise.allSettled(
        dependentUrls.map(dependentUrl => collectDependents(dependentUrl))
      )
    }

    processing.delete(url)
  }

  await collectDependents(moduleUrl)
  return result
}

/**
 * Module API 实现
 */
class ModuleManager {
  /** 模块依赖图 */
  private dependencies = new Map<string, Set<string>>()
  /** 反向依赖图（谁依赖了这个模块） */
  private dependents = new Map<string, Set<string>>()
  /** 受保护的模块（不清除缓存） */
  private exclude: string[] = []
  /** 模块版本映射（生产环境用于缓存破坏） */
  private versions = new Map<string, number>()

  /**
   * 是否为开发环境
   */
  get isDev (): boolean {
    return isDev
  }

  /**
   * 设置受保护的模块路径
   */
  setExclude (paths: string[]): void {
    if (!Array.isArray(paths)) {
      throw new Error('[module] setExclude: paths must be an array')
    }
    this.exclude = paths
      .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
      .map(p => formatPath(p, { type: 'fileURL' }))
  }

  /**
   * 获取模块的导入 URL
   * 开发环境：直接返回路径
   * 生产环境：添加版本号查询参数
   */
  getImportUrl (filePath: string, bustCache = false): string {
    // 参数验证
    if (typeof filePath !== 'string' || !filePath.trim()) {
      throw new Error('[module] getImportUrl: filePath must be a non-empty string')
    }

    if (!bustCache) return filePath

    // 生产环境使用版本号
    if (!isDev) {
      const version = (this.versions.get(filePath) ?? 0) + 1
      this.versions.set(filePath, version)
      return `${filePath}?v=${version}`
    }

    // 开发环境使用时间戳（ESM 缓存清理后可正常工作）
    return `${filePath}?t=${Date.now()}`
  }

  /**
   * 重置模块版本（用于卸载）
   */
  resetVersion (filePath: string): void {
    this.versions.delete(filePath)
  }

  /**
   * 清除模块缓存（ESM）
   */
  async clearCache (filePath: string, recursive = false): Promise<void> {
    // 参数验证
    if (typeof filePath !== 'string' || !filePath.trim()) {
      throw new Error('[module] clearCache: filePath must be a non-empty string')
    }

    const fileUrl = formatPath(filePath, { type: 'fileURL' })

    if (recursive) {
      // 查找所有依赖该模块的模块
      const deps = await findDependentModulesFromCache(fileUrl, this.exclude)
      await clearESMCache(deps)
    } else {
      await clearESMCache(fileUrl)
    }
  }

  /**
   * 清除多个模块缓存
   */
  async clearCaches (fileURLs: string[]): Promise<void> {
    // 参数验证
    if (!Array.isArray(fileURLs)) {
      throw new Error('[module] clearCaches: fileURLs must be an array')
    }
    const validUrls = fileURLs.filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
    if (validUrls.length === 0) return
    await clearESMCache(validUrls)
  }

  /**
   * 查找依赖某文件的所有模块（ESM 缓存）
   */
  async findDependentModules (filePath: string): Promise<string[]> {
    // 参数验证
    if (typeof filePath !== 'string' || !filePath.trim()) {
      throw new Error('[module] findDependentModules: filePath must be a non-empty string')
    }
    const fileUrl = formatPath(filePath, { type: 'fileURL' })
    return findDependentModulesFromCache(fileUrl, this.exclude)
  }

  /**
   * 查找依赖某文件的所有模块（本地依赖图）
   */
  findDependents (filePath: string): string[] {
    // 参数验证
    if (typeof filePath !== 'string' || !filePath.trim()) {
      throw new Error('[module] findDependents: filePath must be a non-empty string')
    }

    const result: string[] = []
    const visited = new Set<string>()

    const traverse = (file: string) => {
      if (visited.has(file)) return
      visited.add(file)

      const deps = this.dependents.get(file)
      if (deps) {
        for (const dep of deps) {
          result.push(dep)
          traverse(dep)
        }
      }
    }

    traverse(filePath)
    return result
  }

  /**
   * 查找某文件依赖的所有模块
   */
  findDependencies (filePath: string): string[] {
    // 参数验证
    if (typeof filePath !== 'string' || !filePath.trim()) {
      throw new Error('[module] findDependencies: filePath must be a non-empty string')
    }

    const result: string[] = []
    const visited = new Set<string>()

    const traverse = (file: string) => {
      if (visited.has(file)) return
      visited.add(file)

      const deps = this.dependencies.get(file)
      if (deps) {
        for (const dep of deps) {
          result.push(dep)
          traverse(dep)
        }
      }
    }

    traverse(filePath)
    return result
  }

  /**
   * 根据文件路径获取所属包名
   */
  getPackageByFile (filePath: string): string | null {
    return cache.package.findByFile(filePath)
  }

  /**
   * 根据包名获取所有文件
   */
  getFilesByPackage (pkgName: string): string[] {
    return cache.package.getFiles(pkgName)
  }

  /**
   * 注册依赖关系
   */
  addDependency (from: string, to: string): void {
    // 参数验证
    if (typeof from !== 'string' || !from.trim()) {
      throw new Error('[module] addDependency: from must be a non-empty string')
    }
    if (typeof to !== 'string' || !to.trim()) {
      throw new Error('[module] addDependency: to must be a non-empty string')
    }

    // from 依赖 to
    if (!this.dependencies.has(from)) {
      this.dependencies.set(from, new Set())
    }
    this.dependencies.get(from)!.add(to)

    // to 被 from 依赖
    if (!this.dependents.has(to)) {
      this.dependents.set(to, new Set())
    }
    this.dependents.get(to)!.add(from)
  }

  /**
   * 清除文件的依赖关系
   */
  clearDependencies (filePath: string): void {
    // 参数验证
    if (typeof filePath !== 'string' || !filePath.trim()) {
      throw new Error('[module] clearDependencies: filePath must be a non-empty string')
    }

    // 清除该文件的依赖
    const deps = this.dependencies.get(filePath)
    if (deps) {
      for (const dep of deps) {
        this.dependents.get(dep)?.delete(filePath)
      }
      this.dependencies.delete(filePath)
    }

    // 清除被其他文件依赖的关系
    const depts = this.dependents.get(filePath)
    if (depts) {
      for (const dept of depts) {
        this.dependencies.get(dept)?.delete(filePath)
      }
      this.dependents.delete(filePath)
    }
  }

  /**
   * 清空所有依赖关系
   */
  clear (): void {
    this.dependencies.clear()
    this.dependents.clear()
  }
}

// 单例
const manager = new ModuleManager()

/**
 * Module API
 */
export const moduleApi = {
  /** 是否为开发环境 */
  get isDev () { return manager.isDev },
  setExclude: manager.setExclude.bind(manager),
  clearCache: manager.clearCache.bind(manager),
  clearCaches: manager.clearCaches.bind(manager),
  findDependentModules: manager.findDependentModules.bind(manager),
  findDependents: manager.findDependents.bind(manager),
  findDependencies: manager.findDependencies.bind(manager),
  getPackageByFile: manager.getPackageByFile.bind(manager),
  getFilesByPackage: manager.getFilesByPackage.bind(manager),
  addDependency: manager.addDependency.bind(manager),
  clearDependencies: manager.clearDependencies.bind(manager),
  clear: manager.clear.bind(manager),
  getImportUrl: manager.getImportUrl.bind(manager),
  resetVersion: manager.resetVersion.bind(manager),
}

export type ModuleAPI = typeof moduleApi
