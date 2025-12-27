/**
 * Loader API - 加载器
 * @module api/loader
 */

import { cache } from './cache'
import { event } from './event'
import { registry } from './registry'
import { moduleApi } from './module'
import type { LoadFileOptions, LoadResult, PluginSource } from '../types'

/**
 * 动态导入模块（带缓存处理）
 * 开发环境：清理 ESM 缓存后使用时间戳
 * 生产环境：使用版本号查询参数绕过缓存
 */
async function dynamicImport (filePath: string, bustCache = false): Promise<unknown> {
  const url = moduleApi.getImportUrl(filePath, bustCache)
  return import(url)
}

/**
 * Loader API 实现
 */
class LoaderManager {
  /**
   * 加载单个文件
   */
  async loadFile (filePath: string, options: LoadFileOptions = {}): Promise<LoadResult> {
    const { force = false, pkg, silent = false } = options

    try {
      // 如果强制重新加载，先清除缓存
      if (force) {
        registry.unregisterByFile(filePath)
        moduleApi.clearCache(filePath, true)
      }

      // 推断包名
      const pkgName = pkg || moduleApi.getPackageByFile(filePath)

      // 导入模块
      const mod = await dynamicImport(filePath, force)

      // 处理导出的内容
      const registered = await this.processModule(mod, pkgName || 'unknown', filePath)

      if (!silent && registered > 0) {
        console.log(`[loader] loaded: ${filePath} (${registered} components)`)
      }

      return {
        success: true,
        file: filePath,
        pkg: pkgName || undefined,
        registered,
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      if (!silent) {
        console.error(`[loader] failed to load: ${filePath}`, err)
      }
      return {
        success: false,
        file: filePath,
        registered: 0,
        error: err,
      }
    }
  }

  /**
   * 加载整个包
   */
  async loadPackage (pkgPath: string, _source: PluginSource = 'npm'): Promise<LoadResult[]> {
    event.emit('plugin:load:start', { pkg: pkgPath })

    const files = cache.package.getFiles(pkgPath)
    const results: LoadResult[] = []
    let totalRegistered = 0

    for (const file of files) {
      const result = await this.loadFile(file, { pkg: pkgPath })
      results.push(result)
      totalRegistered += result.registered
    }

    event.emit('plugin:load:done', { pkg: pkgPath, registered: totalRegistered })
    return results
  }

  /**
   * 重新加载文件
   */
  async reloadFile (filePath: string): Promise<LoadResult> {
    return this.loadFile(filePath, { force: true })
  }

  /**
   * 重新加载包
   */
  async reloadPackage (pkgName: string): Promise<LoadResult[]> {
    // 注销所有组件
    registry.unregisterByPackage(pkgName)

    // 清除所有文件缓存
    const files = moduleApi.getFilesByPackage(pkgName)
    for (const file of files) {
      moduleApi.clearCache(file, true)
    }

    // 重新加载
    event.emit('plugin:reload', {
      pkg: pkgName,
      result: { success: true, file: pkgName, registered: 0 },
    })

    return this.loadPackage(pkgName)
  }

  /**
   * 导入模块
   */
  async importModule (filePath: string, bustCache = false): Promise<unknown> {
    return dynamicImport(filePath, bustCache)
  }

  /**
   * 处理模块导出
   * @internal
   */
  private async processModule (
    mod: unknown,
    _pkg: string,
    _file: string
  ): Promise<number> {
    if (!mod || typeof mod !== 'object') return 0

    let count = 0
    const exports = mod as Record<string, unknown>

    // 遍历所有导出
    for (const [, value] of Object.entries(exports)) {
      if (this.isRegistrable(value)) {
        // 这里需要识别导出的是什么类型的组件
        // 暂时跳过，由 create DSL 负责注册
        count++
      }
    }

    return count
  }

  /**
   * 检查是否可注册
   * @internal
   */
  private isRegistrable (value: unknown): boolean {
    // 检查是否是函数或对象
    return typeof value === 'function' || (typeof value === 'object' && value !== null)
  }

  /**
   * 添加包到缓存
   */
  addPackage (
    name: string,
    path: string,
    source: PluginSource,
    version = '0.0.0'
  ): void {
    cache.package.add(name, {
      version,
      path,
      source,
      status: 'loaded',
      files: new Set(),
    })
  }

  /**
   * 添加文件到包
   */
  addFileToPackage (pkgName: string, file: string): void {
    cache.package.addFile(pkgName, file)
  }
}

// 单例
const manager = new LoaderManager()

/**
 * Loader API
 */
export const loader = {
  loadFile: manager.loadFile.bind(manager),
  loadPackage: manager.loadPackage.bind(manager),
  reloadFile: manager.reloadFile.bind(manager),
  reloadPackage: manager.reloadPackage.bind(manager),
  importModule: manager.importModule.bind(manager),
  addPackage: manager.addPackage.bind(manager),
  addFileToPackage: manager.addFileToPackage.bind(manager),
}

export type LoaderAPI = typeof loader
