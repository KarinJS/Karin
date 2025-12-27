/**
 * Cache API - 缓存管理
 * @module api/cache
 */

import type { PluginType, PackageCache, RegistryItem, PluginStatus } from '../types'

/**
 * 包缓存存储
 */
class PackageStore {
  private packages = new Map<string, PackageCache>()

  /**
   * 添加包
   */
  add (name: string, data: Omit<PackageCache, 'name'>): void {
    this.packages.set(name, { name, ...data })
  }

  /**
   * 获取包
   */
  get (name: string): PackageCache | undefined {
    return this.packages.get(name)
  }

  /**
   * 检查包是否存在
   */
  has (name: string): boolean {
    return this.packages.has(name)
  }

  /**
   * 删除包
   */
  delete (name: string): boolean {
    return this.packages.delete(name)
  }

  /**
   * 获取所有包
   */
  getAll (): Map<string, PackageCache> {
    return new Map(this.packages)
  }

  /**
   * 获取所有包名
   */
  names (): string[] {
    return Array.from(this.packages.keys())
  }

  /**
   * 更新包状态
   */
  setStatus (name: string, status: PluginStatus): void {
    const pkg = this.packages.get(name)
    if (pkg) {
      pkg.status = status
    }
  }

  /**
   * 添加文件到包
   */
  addFile (name: string, file: string): void {
    const pkg = this.packages.get(name)
    if (pkg) {
      pkg.files.add(file)
    }
  }

  /**
   * 从包中移除文件
   */
  removeFile (name: string, file: string): void {
    const pkg = this.packages.get(name)
    if (pkg) {
      pkg.files.delete(file)
    }
  }

  /**
   * 获取包的所有文件
   */
  getFiles (name: string): string[] {
    const pkg = this.packages.get(name)
    return pkg ? Array.from(pkg.files) : []
  }

  /**
   * 根据文件路径查找包名
   */
  findByFile (file: string): string | null {
    for (const [name, pkg] of this.packages) {
      if (pkg.files.has(file)) {
        return name
      }
    }
    return null
  }

  /**
   * 清空所有包
   */
  clear (): void {
    this.packages.clear()
  }

  /**
   * 包数量
   */
  get size (): number {
    return this.packages.size
  }
}

/**
 * 实例缓存存储（按类型分类）
 */
class InstanceStore {
  private stores = new Map<PluginType, Map<string, RegistryItem>>()

  constructor () {
    // 初始化所有类型的存储
    const types: PluginType[] = ['command', 'accept', 'handler', 'button', 'task']
    for (const type of types) {
      this.stores.set(type, new Map())
    }
  }

  /**
   * 获取某类型的存储
   */
  getStore (type: PluginType): Map<string, RegistryItem> {
    return this.stores.get(type) || new Map()
  }

  /**
   * 添加实例
   */
  add (type: PluginType, id: string, item: RegistryItem): void {
    this.stores.get(type)?.set(id, item)
  }

  /**
   * 获取实例
   */
  get (type: PluginType, id: string): RegistryItem | undefined {
    return this.stores.get(type)?.get(id)
  }

  /**
   * 删除实例
   */
  delete (type: PluginType, id: string): boolean {
    return this.stores.get(type)?.delete(id) ?? false
  }

  /**
   * 获取某类型的所有实例
   */
  getAll (type: PluginType): RegistryItem[] {
    const store = this.stores.get(type)
    return store ? Array.from(store.values()) : []
  }

  /**
   * 按包名获取实例
   */
  getByPackage (pkg: string): RegistryItem[] {
    const result: RegistryItem[] = []
    for (const store of this.stores.values()) {
      for (const item of store.values()) {
        if (item.pkg === pkg) {
          result.push(item)
        }
      }
    }
    return result
  }

  /**
   * 按文件获取实例
   */
  getByFile (file: string): RegistryItem[] {
    const result: RegistryItem[] = []
    for (const store of this.stores.values()) {
      for (const item of store.values()) {
        if (item.file === file) {
          result.push(item)
        }
      }
    }
    return result
  }

  /**
   * 按包名删除所有实例
   */
  deleteByPackage (pkg: string): number {
    let count = 0
    for (const store of this.stores.values()) {
      for (const [id, item] of store) {
        if (item.pkg === pkg) {
          store.delete(id)
          count++
        }
      }
    }
    return count
  }

  /**
   * 按文件删除所有实例
   */
  deleteByFile (file: string): number {
    let count = 0
    for (const store of this.stores.values()) {
      for (const [id, item] of store) {
        if (item.file === file) {
          store.delete(id)
          count++
        }
      }
    }
    return count
  }

  /**
   * 清空某类型
   */
  clearType (type: PluginType): void {
    this.stores.get(type)?.clear()
  }

  /**
   * 清空所有
   */
  clear (): void {
    for (const store of this.stores.values()) {
      store.clear()
    }
  }

  /**
   * 获取某类型的数量
   */
  count (type: PluginType): number {
    return this.stores.get(type)?.size ?? 0
  }

  /**
   * 获取总数量
   */
  get totalCount (): number {
    let total = 0
    for (const store of this.stores.values()) {
      total += store.size
    }
    return total
  }
}

/**
 * 自定义数据存储
 */
class DataStore {
  private data = new Map<string, unknown>()

  set<T> (key: string, value: T): void {
    this.data.set(key, value)
  }

  get<T> (key: string): T | undefined {
    return this.data.get(key) as T | undefined
  }

  has (key: string): boolean {
    return this.data.has(key)
  }

  delete (key: string): boolean {
    return this.data.delete(key)
  }

  clear (): void {
    this.data.clear()
  }
}

// 单例实例
const packageStore = new PackageStore()
const instanceStore = new InstanceStore()
const dataStore = new DataStore()

/**
 * Cache API
 */
export const cache = {
  /**
   * 包缓存
   */
  package: {
    add: packageStore.add.bind(packageStore),
    get: packageStore.get.bind(packageStore),
    has: packageStore.has.bind(packageStore),
    delete: packageStore.delete.bind(packageStore),
    getAll: packageStore.getAll.bind(packageStore),
    names: packageStore.names.bind(packageStore),
    setStatus: packageStore.setStatus.bind(packageStore),
    addFile: packageStore.addFile.bind(packageStore),
    removeFile: packageStore.removeFile.bind(packageStore),
    getFiles: packageStore.getFiles.bind(packageStore),
    findByFile: packageStore.findByFile.bind(packageStore),
    clear: packageStore.clear.bind(packageStore),
    get size () {
      return packageStore.size
    },
  },

  /**
   * 实例缓存
   */
  instance: {
    add: instanceStore.add.bind(instanceStore),
    get: instanceStore.get.bind(instanceStore),
    delete: instanceStore.delete.bind(instanceStore),
    getAll: instanceStore.getAll.bind(instanceStore),
    getStore: instanceStore.getStore.bind(instanceStore),
    getByPackage: instanceStore.getByPackage.bind(instanceStore),
    getByFile: instanceStore.getByFile.bind(instanceStore),
    deleteByPackage: instanceStore.deleteByPackage.bind(instanceStore),
    deleteByFile: instanceStore.deleteByFile.bind(instanceStore),
    clearType: instanceStore.clearType.bind(instanceStore),
    clear: instanceStore.clear.bind(instanceStore),
    count: instanceStore.count.bind(instanceStore),
    get totalCount () {
      return instanceStore.totalCount
    },
  },

  /**
   * 自定义数据存储
   */
  data: {
    set: dataStore.set.bind(dataStore),
    get: dataStore.get.bind(dataStore),
    has: dataStore.has.bind(dataStore),
    delete: dataStore.delete.bind(dataStore),
    clear: dataStore.clear.bind(dataStore),
  },

  /**
   * 清空所有缓存
   */
  clearAll (): void {
    packageStore.clear()
    instanceStore.clear()
    dataStore.clear()
  },
}

export type CacheAPI = typeof cache
