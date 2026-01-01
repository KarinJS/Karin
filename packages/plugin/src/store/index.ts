/**
 * 统一存储层 - Store
 *
 * 特性：
 * - 纯函数架构，无 class
 * - EventEmitter 事件驱动，支持 HMR 集成
 * - 文件/包索引，支持快速查找和批量删除
 * - 懒排序 + dirty 标记
 *
 * @module store
 */

import { EventEmitter } from 'events'
import type {
  Store,
  StoreEvents,
  StoreEventListener,
  PluginType,
  PluginTypeMap,
  AnyPlugin,
  GlobalStats,
  PluginStats,
  FileInfo,
  PackageInfo,
} from './types'
import type { CreateHandler } from '../create'

/**
 * 从插件实例提取关键信息的工具函数
 */
function extractPluginInfo (plugin: AnyPlugin): {
  id: string
  file: string
  pkg: string
  priority: number
} {
  // 直接从 BuilderBase 属性中读取
  const p = plugin as any
  return {
    id: p.id ?? '',
    file: p.file?.absPath ?? p.callerPath ?? '',
    pkg: p.packageName ?? '',
    priority: p.priority ?? p.options?.priority ?? 10000,
  }
}

// ==================== 内部创建函数 ====================

function createStore (): Store {
  const emitter = new EventEmitter()

  // ===== 主存储 =====
  // Map<PluginType, Map<pluginId, Plugin>>
  const plugins = new Map<PluginType, Map<string, AnyPlugin>>([
    ['command', new Map()],
    ['accept', new Map()],
    ['handler', new Map()],
    ['button', new Map()],
    ['task', new Map()],
  ])

  // ===== 索引 =====
  // 文件索引: file -> FileInfo
  const fileIndex = new Map<string, FileInfo>()

  // 包索引: pkg -> PackageInfo
  const pkgIndex = new Map<string, PackageInfo>()

  // 插件 ID 到类型的反向索引（用于快速查找）
  const idTypeIndex = new Map<string, PluginType>()

  // Handler 的 key 索引: key -> Set<handlerId>
  const handlerKeyIndex = new Map<string, Set<string>>()

  // ===== 排序缓存 =====
  // Map<PluginType, sortedArray>
  const sortedCache = new Map<PluginType, AnyPlugin[]>()

  // dirty 标记
  const dirty = new Map<PluginType, boolean>([
    ['command', false],
    ['accept', false],
    ['handler', false],
    ['button', false],
    ['task', false],
  ])

  // ==================== 内部工具函数 ====================

  /** 获取排序后的数组（懒排序） */
  function getSorted<T extends PluginType> (type: T): PluginTypeMap[T][] {
    if (!dirty.get(type) && sortedCache.has(type)) {
      return sortedCache.get(type) as PluginTypeMap[T][]
    }

    const map = plugins.get(type) as Map<string, PluginTypeMap[T]>
    const arr = [...map.values()]

    // 按 priority 降序排列（优先级高的在前）
    arr.sort((a, b) => {
      const pa = (a as any).priority ?? 0
      const pb = (b as any).priority ?? 0
      return pb - pa
    })

    sortedCache.set(type, arr)
    dirty.set(type, false)
    emitter.emit('sort', type)

    return arr as PluginTypeMap[T][]
  }

  /** 标记为需要重新排序 */
  function markDirty (type: PluginType): void {
    dirty.set(type, true)
  }

  /** 更新统计 */
  function calcStats (type: PluginType): PluginStats {
    const map = plugins.get(type)!
    let active = 0
    let disabled = 0

    for (const p of map.values()) {
      const info = (p as any).info
      if (info?.disable) {
        disabled++
      } else {
        active++
      }
    }

    return {
      total: map.size,
      active,
      disabled,
    }
  }

  // ==================== Store 实现 ====================

  const store: Store = {
    // ===== 添加 =====
    add<T extends PluginType> (type: T, plugin: PluginTypeMap[T]): void {
      const info = extractPluginInfo(plugin)
      const { id, file, pkg } = info

      if (!id) {
        console.warn('[store] plugin has no id, skip')
        return
      }

      const map = plugins.get(type)!
      map.set(id, plugin)
      idTypeIndex.set(id, type)

      // 更新文件索引
      if (file) {
        let fileInfo = fileIndex.get(file)
        if (!fileInfo) {
          fileInfo = { path: file, pkg, pluginIds: new Set() }
          fileIndex.set(file, fileInfo)
        }
        fileInfo.pluginIds.add(id)
      }

      // 更新包索引
      if (pkg) {
        const pkgInfo = pkgIndex.get(pkg)
        if (pkgInfo) {
          pkgInfo.pluginIds.add(id)
          if (file) {
            pkgInfo.files.add(file)
          }
        }
      }

      // Handler 的 key 索引
      if (type === 'handler') {
        const key = (plugin as any).key
        if (key) {
          if (!handlerKeyIndex.has(key)) {
            handlerKeyIndex.set(key, new Set())
          }
          handlerKeyIndex.get(key)!.add(id)
        }
      }

      markDirty(type)
      emitter.emit('add', type, plugin)
    },

    // ===== 删除 =====
    del (id: string): boolean {
      const type = idTypeIndex.get(id)
      if (!type) return false

      const map = plugins.get(type)!
      const plugin = map.get(id)
      if (!plugin) return false

      const { file, pkg } = extractPluginInfo(plugin)

      // 从 map 删除
      map.delete(id)
      idTypeIndex.delete(id)

      // 从文件索引删除
      if (file) {
        const fileInfo = fileIndex.get(file)
        if (fileInfo) {
          fileInfo.pluginIds.delete(id)
        }
      }

      // 从包索引删除
      if (pkg) {
        const pkgInfo = pkgIndex.get(pkg)
        if (pkgInfo) {
          pkgInfo.pluginIds.delete(id)
        }
      }

      // Handler 的 key 索引
      if (type === 'handler') {
        const key = (plugin as any).key
        if (key) {
          handlerKeyIndex.get(key)?.delete(id)
        }
      }

      markDirty(type)
      emitter.emit('del', type, id, plugin)
      return true
    },

    delByFile (file: string): number {
      const fileInfo = fileIndex.get(file)
      if (!fileInfo || fileInfo.pluginIds.size === 0) return 0

      // 复制一份，因为 del 会修改 Set
      const ids = [...fileInfo.pluginIds]
      for (const id of ids) {
        store.del(id)
      }
      return ids.length
    },

    delByPkg (pkg: string): number {
      const pkgInfo = pkgIndex.get(pkg)
      if (!pkgInfo || pkgInfo.pluginIds.size === 0) return 0

      const ids = [...pkgInfo.pluginIds]
      for (const id of ids) {
        store.del(id)
      }
      return ids.length
    },

    // ===== 查询 =====
    get<T extends PluginType> (type: T): PluginTypeMap[T][] {
      return getSorted(type)
    },

    getAll<T extends PluginType> (type: T): PluginTypeMap[T][] {
      const map = plugins.get(type) as Map<string, PluginTypeMap[T]>
      return [...map.values()]
    },

    getById (id: string): AnyPlugin | undefined {
      const type = idTypeIndex.get(id)
      if (!type) return undefined
      return plugins.get(type)?.get(id)
    },

    getByFile (file: string): AnyPlugin[] {
      const fileInfo = fileIndex.get(file)
      if (!fileInfo) return []

      const result: AnyPlugin[] = []
      for (const id of fileInfo.pluginIds) {
        const p = store.getById(id)
        if (p) result.push(p)
      }
      return result
    },

    getByPkg (pkg: string): AnyPlugin[] {
      const pkgInfo = pkgIndex.get(pkg)
      if (!pkgInfo) return []

      const result: AnyPlugin[] = []
      for (const id of pkgInfo.pluginIds) {
        const p = store.getById(id)
        if (p) result.push(p)
      }
      return result
    },

    has (id: string): boolean {
      return idTypeIndex.has(id)
    },

    // ===== 更新 =====
    update (id: string, key: string, value: unknown): boolean {
      const plugin = store.getById(id)
      if (!plugin) return false

      const p = plugin as any
      const oldVal = p[key]
      p[key] = value

      // 如果是 priority 相关，需要重新排序
      if (key === 'priority' || key === 'options') {
        const type = idTypeIndex.get(id)
        if (type) markDirty(type)
      }

      emitter.emit('update', idTypeIndex.get(id)!, id, key, value, oldVal)
      return true
    },

    disable (id: string): boolean {
      // 标记禁用（存储在单独的 disabled Set 中，或者通过 info 对象）
      // 这里简单实现，实际可能需要更复杂的逻辑
      console.warn('[store] disable not fully implemented yet, id:', id)
      return store.has(id)
    },

    enable (id: string): boolean {
      console.warn('[store] enable not fully implemented yet, id:', id)
      return store.has(id)
    },

    // ===== Handler 特殊操作 =====
    getHandler (key: string): CreateHandler[] {
      const ids = handlerKeyIndex.get(key)
      if (!ids || ids.size === 0) return []

      const handlerMap = plugins.get('handler') as Map<string, CreateHandler>
      const result: CreateHandler[] = []
      for (const id of ids) {
        const h = handlerMap.get(id)
        if (h) result.push(h)
      }

      // 按 priority 排序
      result.sort((a, b) => {
        const pa = (a as any).priority ?? 0
        const pb = (b as any).priority ?? 0
        return pb - pa
      })

      return result
    },

    // ===== 批量操作 =====
    clear (type?: PluginType): void {
      if (type) {
        const map = plugins.get(type)!

        // 清理索引
        for (const [id, plugin] of map) {
          const p = plugin as any
          const file = p.info?.file
          if (file) {
            fileIndex.get(file)?.pluginIds.delete(id)
          }
          const pkg = p.info?.pkg
          if (pkg) {
            pkgIndex.get(pkg)?.pluginIds.delete(id)
          }
          idTypeIndex.delete(id)
        }

        // Handler key 索引
        if (type === 'handler') {
          handlerKeyIndex.clear()
        }

        map.clear()
        sortedCache.delete(type)
        dirty.set(type, false)
        emitter.emit('clear', type)
      } else {
        // 清空所有
        for (const t of plugins.keys()) {
          plugins.get(t)!.clear()
          dirty.set(t, false)
        }
        fileIndex.clear()
        pkgIndex.clear()
        idTypeIndex.clear()
        handlerKeyIndex.clear()
        sortedCache.clear()
        emitter.emit('clear', 'all')
      }
    },

    markDirty,

    // ===== 统计 =====
    stats (): GlobalStats {
      const handlerMap = plugins.get('handler')!
      const handlerKeys = new Set<string>()
      for (const p of handlerMap.values()) {
        const key = (p as any).key
        if (key) handlerKeys.add(key)
      }

      return {
        command: calcStats('command'),
        accept: calcStats('accept'),
        handler: {
          keys: handlerKeys.size,
          ...calcStats('handler'),
        },
        button: calcStats('button'),
        task: calcStats('task'),
        files: fileIndex.size,
        packages: pkgIndex.size,
      }
    },

    // ===== 事件 =====
    on<K extends keyof StoreEvents> (event: K, listener: StoreEventListener<K>): void {
      emitter.on(event, listener as (...args: any[]) => void)
    },

    off<K extends keyof StoreEvents> (event: K, listener: StoreEventListener<K>): void {
      emitter.off(event, listener as (...args: any[]) => void)
    },

    once<K extends keyof StoreEvents> (event: K, listener: StoreEventListener<K>): void {
      emitter.once(event, listener as (...args: any[]) => void)
    },

    // ===== 索引管理 =====
    registerFile (file: string, pkg: string): void {
      if (fileIndex.has(file)) return

      fileIndex.set(file, {
        path: file,
        pkg,
        pluginIds: new Set(),
      })

      // 更新包的文件列表
      const pkgInfo = pkgIndex.get(pkg)
      if (pkgInfo) {
        pkgInfo.files.add(file)
      }
    },

    registerPackage (info: Omit<PackageInfo, 'files' | 'pluginIds'>): void {
      if (pkgIndex.has(info.name)) return

      pkgIndex.set(info.name, {
        ...info,
        files: new Set(),
        pluginIds: new Set(),
      })
    },

    getFileInfo (file: string): FileInfo | undefined {
      return fileIndex.get(file)
    },

    getPackageInfo (pkg: string): PackageInfo | undefined {
      return pkgIndex.get(pkg)
    },

    // ===== 调试 =====
    dump (): unknown {
      const result: Record<string, any> = {}

      for (const [type, map] of plugins) {
        result[type] = [...map.entries()].map(([id, p]) => ({
          id,
          info: (p as any).info,
        }))
      }

      result.fileIndex = Object.fromEntries(
        [...fileIndex.entries()].map(([k, v]) => [
          k,
          { ...v, pluginIds: [...v.pluginIds] },
        ])
      )

      result.pkgIndex = Object.fromEntries(
        [...pkgIndex.entries()].map(([k, v]) => [
          k,
          { ...v, files: [...v.files], pluginIds: [...v.pluginIds] },
        ])
      )

      return result
    },
  }

  return store
}

// ==================== 导出单例 ====================

/** 全局 Store 实例 */
export const store = createStore()

/** 热点缓存 */
export { hotCache } from './hotCache'
export type { HotCacheStats } from './hotCache'

/** 缺失依赖管理器 */
export { missingDeps } from './missingDeps'
export type { DedupedMissingDeps } from './missingDeps'

/** 包列表管理器 */
export { packageList } from './list'
export type { PkgType, PackageListItem, PackageListManager } from './list'

/** 环境变量管理器 */
export { envManager } from './envs'
export type { EnvItem, PackageEnv, EnvConfig, EnvManager } from './envs'

/** 引擎设置管理器 */
export { engineSettings } from './settings'
export type { PluginEngines, EngineSettingsManager } from './settings'

/** 静态目录管理器 */
export { publicManager } from './public'
export type { PublicDir, PublicManager } from './public'

// 导出类型
export * from './types'
