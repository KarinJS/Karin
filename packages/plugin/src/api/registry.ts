/**
 * Registry API - 注册中心
 * @module api/registry
 */

import { cache } from './cache'
import { event } from './event'
import type { PluginType, RegistryItem, RegisterOptions } from '../types'

let idCounter = 0

/**
 * 生成唯一 ID
 */
function generateId (type: PluginType): string {
  return `${type}_${++idCounter}_${Date.now().toString(36)}`
}

/**
 * Registry API 实现
 */
class RegistryManager {
  /** 有效的插件类型 */
  private validTypes: PluginType[] = ['command', 'accept', 'handler', 'button', 'task']

  /**
   * 注册组件
   */
  register<T> (
    type: PluginType,
    instance: T,
    pkg: string,
    file: string,
    options: RegisterOptions = {}
  ): string {
    // 参数验证
    if (!this.validTypes.includes(type)) {
      throw new Error(`[registry] Invalid type: ${type}. Valid types: ${this.validTypes.join(', ')}`)
    }
    if (typeof pkg !== 'string' || !pkg.trim()) {
      throw new Error('[registry] pkg must be a non-empty string')
    }
    if (typeof file !== 'string' || !file.trim()) {
      throw new Error('[registry] file must be a non-empty string')
    }

    const id = generateId(type)
    const item: RegistryItem<T> = {
      id,
      type,
      pkg,
      file,
      priority: typeof options?.priority === 'number' ? options.priority : 0,
      enabled: true,
      instance,
      metadata: options?.metadata,
    }

    cache.instance.add(type, id, item as RegistryItem)
    event.emit('registry:add', { type, id, item: item as RegistryItem })

    return id
  }

  /**
   * 注销组件
   */
  unregister (type: PluginType, id: string): boolean {
    // 参数验证
    if (!this.validTypes.includes(type)) {
      throw new Error(`[registry] Invalid type: ${type}. Valid types: ${this.validTypes.join(', ')}`)
    }
    if (typeof id !== 'string' || !id.trim()) {
      throw new Error('[registry] id must be a non-empty string')
    }

    const success = cache.instance.delete(type, id)
    if (success) {
      event.emit('registry:remove', { type, id })
    }
    return success
  }

  /**
   * 按文件注销所有组件
   */
  unregisterByFile (file: string): number {
    // 参数验证
    if (typeof file !== 'string' || !file.trim()) {
      throw new Error('[registry] file must be a non-empty string')
    }

    const count = cache.instance.deleteByFile(file)
    if (count > 0) {
      event.emit('file:remove', { file, unregistered: count })
    }
    return count
  }

  /**
   * 按包名注销所有组件
   */
  unregisterByPackage (pkg: string): number {
    // 参数验证
    if (typeof pkg !== 'string' || !pkg.trim()) {
      throw new Error('[registry] pkg must be a non-empty string')
    }
    return cache.instance.deleteByPackage(pkg)
  }

  /**
   * 获取组件
   */
  get (type: PluginType, id: string): RegistryItem | undefined {
    // 参数验证
    if (!this.validTypes.includes(type)) {
      throw new Error(`[registry] Invalid type: ${type}. Valid types: ${this.validTypes.join(', ')}`)
    }
    if (typeof id !== 'string' || !id.trim()) {
      throw new Error('[registry] id must be a non-empty string')
    }
    return cache.instance.get(type, id)
  }

  /**
   * 获取某类型的所有组件
   */
  getAll (type: PluginType): RegistryItem[] {
    // 参数验证
    if (!this.validTypes.includes(type)) {
      throw new Error(`[registry] Invalid type: ${type}. Valid types: ${this.validTypes.join(', ')}`)
    }
    return cache.instance.getAll(type)
  }

  /**
   * 获取某文件注册的所有组件
   */
  getByFile (file: string): RegistryItem[] {
    // 参数验证
    if (typeof file !== 'string' || !file.trim()) {
      throw new Error('[registry] file must be a non-empty string')
    }
    return cache.instance.getByFile(file)
  }

  /**
   * 获取某包注册的所有组件
   */
  getByPackage (pkg: string): RegistryItem[] {
    // 参数验证
    if (typeof pkg !== 'string' || !pkg.trim()) {
      throw new Error('[registry] pkg must be a non-empty string')
    }
    return cache.instance.getByPackage(pkg)
  }

  /**
   * 排序（按优先级降序）
   */
  sort (type?: PluginType): void {
    const types: PluginType[] = type
      ? [type]
      : ['command', 'accept', 'handler', 'button', 'task']

    for (const t of types) {
      const store = cache.instance.getStore(t)
      const sorted = Array.from(store.entries())
        .sort(([, a], [, b]) => b.priority - a.priority)

      store.clear()
      for (const [id, item] of sorted) {
        store.set(id, item)
      }
    }

    event.emit('registry:sort', { type })
  }

  /**
   * 启用组件
   */
  enable (type: PluginType, id: string): boolean {
    // 参数验证
    if (!this.validTypes.includes(type)) {
      throw new Error(`[registry] Invalid type: ${type}. Valid types: ${this.validTypes.join(', ')}`)
    }
    if (typeof id !== 'string' || !id.trim()) {
      throw new Error('[registry] id must be a non-empty string')
    }

    const item = cache.instance.get(type, id)
    if (item) {
      item.enabled = true
      return true
    }
    return false
  }

  /**
   * 禁用组件
   */
  disable (type: PluginType, id: string): boolean {
    // 参数验证
    if (!this.validTypes.includes(type)) {
      throw new Error(`[registry] Invalid type: ${type}. Valid types: ${this.validTypes.join(', ')}`)
    }
    if (typeof id !== 'string' || !id.trim()) {
      throw new Error('[registry] id must be a non-empty string')
    }

    const item = cache.instance.get(type, id)
    if (item) {
      item.enabled = false
      return true
    }
    return false
  }

  /**
   * 获取已启用的组件
   */
  getEnabled (type: PluginType): RegistryItem[] {
    // 参数验证
    if (!this.validTypes.includes(type)) {
      throw new Error(`[registry] Invalid type: ${type}. Valid types: ${this.validTypes.join(', ')}`)
    }
    return cache.instance.getAll(type).filter(item => item.enabled)
  }

  /**
   * 统计信息
   */
  stats (): Record<PluginType, number> {
    return {
      command: cache.instance.count('command'),
      accept: cache.instance.count('accept'),
      handler: cache.instance.count('handler'),
      button: cache.instance.count('button'),
      task: cache.instance.count('task'),
    }
  }
}

// 单例
const manager = new RegistryManager()

/**
 * Registry API
 */
export const registry = {
  register: manager.register.bind(manager),
  unregister: manager.unregister.bind(manager),
  unregisterByFile: manager.unregisterByFile.bind(manager),
  unregisterByPackage: manager.unregisterByPackage.bind(manager),
  get: manager.get.bind(manager),
  getAll: manager.getAll.bind(manager),
  getByFile: manager.getByFile.bind(manager),
  getByPackage: manager.getByPackage.bind(manager),
  getEnabled: manager.getEnabled.bind(manager),
  sort: manager.sort.bind(manager),
  enable: manager.enable.bind(manager),
  disable: manager.disable.bind(manager),
  stats: manager.stats.bind(manager),
}

export type RegistryAPI = typeof registry
