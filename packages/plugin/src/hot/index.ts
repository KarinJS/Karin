/**
 * 热重载模块
 *
 * 职责：
 * - 监听文件变化
 * - 文件变化时：通过 store 事件卸载旧插件 -> 清理 ESM 缓存 -> 重新加载
 *
 * @module hmr
 */

import path from 'node:path'
import chokidar from 'chokidar'
import { EventEmitter } from 'node:events'
import { formatPath } from '@karinjs/utils'
import { getModuleType } from '@karinjs/envs'
import { store } from '../store'
import { pkgRegistry } from '../package/registry'

import type { FSWatcher, ChokidarOptions } from 'chokidar'

// ==================== 类型定义 ====================

/** HMR 选项 */
export interface HMROptions {
  /** 插件包名称 */
  pluginName?: string
  /** 排除的文件路径（不清理缓存） */
  exclude?: string[]
  /** 当前工作目录 */
  cwd?: string
  /** 忽略规则 */
  ignored?: ChokidarOptions['ignored']
  /** 是否忽略初始扫描 */
  ignoreInitial?: boolean
}

/** 文件变更事件 */
export interface FileChangeEvent {
  /** 事件类型 */
  type: 'add' | 'change' | 'unlink'
  /** 文件绝对路径 */
  file: string
  /** 文件 URL */
  fileUrl: string
}

/** HMR 事件定义 */
export interface HMREvents {
  /** 文件添加 */
  add: [FileChangeEvent]
  /** 文件变更 */
  change: [FileChangeEvent]
  /** 文件删除 */
  unlink: [FileChangeEvent]
  /** 重载完成 */
  reload: [{ file: string; count: number }]
  /** 错误 */
  error: [Error]
}

// ==================== ESM 缓存操作 ====================

/**
 * 加载 ESM 缓存
 */
async function loadESMCache (): Promise<Map<string, unknown> | null> {
  try {
    // Node.js v20.6+
    // @ts-ignore
    const module = await import('node:internal/modules/esm/loader')
    return module.default.getOrInitializeCascadedLoader().loadCache
  } catch {
    try {
      // Node.js v18+
      // @ts-ignore
      const module = await import('node:internal/process/esm_loader')
      return module.default.esmLoader
    } catch {
      return null
    }
  }
}

/**
 * 清理模块缓存
 */
export async function clearModuleCaches (fileUrls: string[]): Promise<number> {
  const cache = await loadESMCache()
  if (!cache) return 0

  let cleared = 0
  for (const url of fileUrls) {
    if (cache.has(url)) {
      cache.delete(url)
      cleared++
    }
  }
  return cleared
}

/**
 * 查找依赖该模块的所有模块
 */
export async function findDependentModules (
  moduleUrl: string,
  exclude: string[] = []
): Promise<string[]> {
  const cache = await loadESMCache()
  if (!cache) return [moduleUrl]

  const result: string[] = []
  const visited = new Set<string>(exclude)

  const collect = async (url: string): Promise<void> => {
    if (visited.has(url)) return
    visited.add(url)
    result.push(url)

    // 遍历缓存查找依赖当前模块的模块
    for (const [cacheUrl, moduleData] of cache.entries()) {
      if (cacheUrl.includes('node_modules') || cacheUrl.includes('node:')) continue
      if (visited.has(cacheUrl)) continue

      const data = moduleData as any
      const linked = data?.javascript?.linked || data?.linked
      if (!linked) continue

      try {
        const modules = await linked
        for (const m of modules) {
          if (m.url === url) {
            await collect(cacheUrl)
            break
          }
        }
      } catch {
        // 忽略错误
      }
    }
  }

  await collect(moduleUrl)
  return result
}

// ==================== HMR 管理器 ====================

/**
 * 创建 HMR 管理器
 */
function createHMR () {
  const emitter = new EventEmitter()
  let watcher: FSWatcher | null = null

  const log = (...args: unknown[]) => {
    if (typeof logger !== 'undefined') {
      logger.info('[hmr]', ...args)
    } else {
      console.log('[hmr]', ...args)
    }
  }

  /**
   * 卸载文件的所有插件
   */
  function unloadFile (file: string): number {
    return store.delByFile(file)
  }

  /**
   * 加载文件
   * 注意：实际的加载逻辑需要外部提供，HMR 只负责事件通知
   */
  async function loadFile (file: string): Promise<void> {
    const fileUrl = formatPath(file, { type: 'fileURL' })
    // 动态 import 文件，触发插件注册
    await import(fileUrl)
  }

  /**
   * 处理文件变更
   */
  async function handleFileChange (
    event: 'add' | 'change' | 'unlink',
    file: string,
    options: HMROptions = {}
  ): Promise<void> {
    const fileUrl = formatPath(file, { type: 'fileURL', cwd: options.cwd })
    const exclude = (options.exclude ?? []).map(p => formatPath(p, { type: 'fileURL' }))

    const changeEvent: FileChangeEvent = { type: event, file, fileUrl }

    try {
      if (event === 'add') {
        await loadFile(file)
        emitter.emit('add', changeEvent)
        log(`add: ${formatPath(file, { type: 'rel' })}`)
        return
      }

      if (event === 'unlink') {
        const count = unloadFile(file)
        // 清理缓存
        const modules = await findDependentModules(fileUrl, exclude)
        await clearModuleCaches(modules)
        emitter.emit('unlink', changeEvent)
        emitter.emit('reload', { file, count })
        log(`unlink: ${formatPath(file, { type: 'rel' })} (${count} plugins removed)`)
        return
      }

      if (event === 'change') {
        // 1. 卸载旧插件
        const count = unloadFile(file)

        // 2. 查找并清理相关缓存
        const modules = await findDependentModules(fileUrl, exclude)
        await clearModuleCaches(modules)

        // 3. 重新加载
        await loadFile(file)

        emitter.emit('change', changeEvent)
        emitter.emit('reload', { file, count })
        log(`change: ${formatPath(file, { type: 'rel' })} (reloaded)`)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      emitter.emit('error', error)
      log(`error: ${error.message}`)
    }
  }

  return {
    /**
     * 启动文件监听
     */
    watch (files: string | string[], options: HMROptions = {}): FSWatcher {
      const exts = getModuleType()

      watcher = chokidar.watch(files, {
        atomic: true,
        ignoreInitial: options.ignoreInitial ?? true,
        cwd: options.cwd,
        ignored: options.ignored ?? ((file, stats) => {
          if (!stats?.isFile()) return true
          return !exts.includes(path.extname(file))
        }),
      })

      watcher.on('all', (event, file) => {
        if (event === 'add' || event === 'change' || event === 'unlink') {
          handleFileChange(event, file, options)
        }
      })

      log(`watching ${Array.isArray(files) ? files.length : 1} paths`)
      return watcher
    },

    /**
     * 停止监听
     */
    async stop (): Promise<void> {
      if (watcher) {
        await watcher.close()
        watcher = null
      }
    },

    /**
     * 手动重载文件
     */
    async reload (file: string, options: HMROptions = {}): Promise<void> {
      await handleFileChange('change', file, options)
    },

    /**
     * 手动卸载文件
     */
    unload (file: string): number {
      return unloadFile(file)
    },

    /**
     * 重载整个包
     */
    async reloadPackage (pkgName: string): Promise<void> {
      const files = pkgRegistry.getFiles(pkgName)
      if (files.length === 0) {
        log(`package ${pkgName} has no files`)
        return
      }

      // 卸载所有插件
      store.delByPkg(pkgName)

      // 清理缓存并重新加载
      for (const file of files) {
        const fileUrl = formatPath(file, { type: 'fileURL' })
        const modules = await findDependentModules(fileUrl)
        await clearModuleCaches(modules)
        await loadFile(file)
      }

      log(`reloaded package: ${pkgName} (${files.length} files)`)
    },

    // 事件
    on<K extends keyof HMREvents> (
      event: K,
      listener: (...args: HMREvents[K]) => void
    ): void {
      emitter.on(event, listener as any)
    },

    off<K extends keyof HMREvents> (
      event: K,
      listener: (...args: HMREvents[K]) => void
    ): void {
      emitter.off(event, listener as any)
    },

    once<K extends keyof HMREvents> (
      event: K,
      listener: (...args: HMREvents[K]) => void
    ): void {
      emitter.once(event, listener as any)
    },

    /** 获取 watcher 实例 */
    get watcher (): FSWatcher | null {
      return watcher
    },
  }
}

/** 全局 HMR 实例 */
export const hmr = createHMR()

// 导出工具函数
export { loadESMCache }

// 导出 Apps 热更新模块
export { createAppsHMR, reloadAppsFile } from './apps'
export type { AppsHMROptions, AppsHMREvents } from './apps'
