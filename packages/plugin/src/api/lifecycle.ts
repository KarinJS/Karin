/**
 * Lifecycle API - 生命周期管理
 * @module api/lifecycle
 */

import { cache } from './cache'
import { event } from './event'
import { registry } from './registry'
import { moduleApi } from './module'
import type { PluginStatus, PackageInfo } from '../types'

/**
 * Lifecycle API 实现
 */
class LifecycleManager {
  /**
   * 启用插件包
   */
  async enable (pkgName: string): Promise<void> {
    // 防御性检查
    if (typeof pkgName !== 'string' || !pkgName.trim()) {
      throw new Error('Package name must be a non-empty string')
    }

    const pkg = cache.package.get(pkgName)
    if (!pkg) {
      throw new Error(`Package not found: ${pkgName}`)
    }

    // 启用所有组件
    const items = registry.getByPackage(pkgName)
    for (const item of items) {
      registry.enable(item.type, item.id)
    }

    cache.package.setStatus(pkgName, 'enabled')
    event.emit('plugin:enable', { pkg: pkgName })
  }

  /**
   * 禁用插件包（保留注册但不响应事件）
   */
  async disable (pkgName: string): Promise<void> {
    // 防御性检查
    if (typeof pkgName !== 'string' || !pkgName.trim()) {
      throw new Error('Package name must be a non-empty string')
    }

    const pkg = cache.package.get(pkgName)
    if (!pkg) {
      throw new Error(`Package not found: ${pkgName}`)
    }

    // 禁用所有组件
    const items = registry.getByPackage(pkgName)
    for (const item of items) {
      registry.disable(item.type, item.id)
    }

    cache.package.setStatus(pkgName, 'disabled')
    event.emit('plugin:disable', { pkg: pkgName })
  }

  /**
   * 卸载插件包（完全移除）
   */
  async unload (pkgName: string): Promise<void> {
    // 防御性检查
    if (typeof pkgName !== 'string' || !pkgName.trim()) {
      throw new Error('Package name must be a non-empty string')
    }

    const pkg = cache.package.get(pkgName)
    if (!pkg) {
      throw new Error(`Package not found: ${pkgName}`)
    }

    // 注销所有组件
    registry.unregisterByPackage(pkgName)

    // 清除模块缓存
    const files = moduleApi.getFilesByPackage(pkgName)
    for (const file of files) {
      moduleApi.clearCache(file, true)
      moduleApi.clearDependencies(file)
    }

    // 删除包缓存
    cache.package.delete(pkgName)

    event.emit('plugin:unload', { pkg: pkgName })
  }

  /**
   * 获取插件状态
   */
  getStatus (pkgName: string): PluginStatus {
    if (typeof pkgName !== 'string' || !pkgName) return 'unloaded'
    const pkg = cache.package.get(pkgName)
    return pkg?.status ?? 'unloaded'
  }

  /**
   * 获取所有已加载的包
   */
  getLoadedPackages (): PackageInfo[] {
    const packages = cache.package.getAll()
    const result: PackageInfo[] = []

    for (const [name, pkg] of packages) {
      const components = registry.getByPackage(name).length
      result.push({
        name,
        version: pkg.version,
        status: pkg.status,
        path: pkg.path,
        files: Array.from(pkg.files),
        components,
      })
    }

    return result
  }

  /**
   * 检查包是否已加载
   */
  isLoaded (pkgName: string): boolean {
    if (typeof pkgName !== 'string' || !pkgName) return false
    return cache.package.has(pkgName)
  }

  /**
   * 检查包是否已启用
   */
  isEnabled (pkgName: string): boolean {
    if (typeof pkgName !== 'string' || !pkgName) return false
    const pkg = cache.package.get(pkgName)
    return pkg?.status === 'enabled'
  }
}

// 单例
const manager = new LifecycleManager()

/**
 * Lifecycle API
 */
export const lifecycle = {
  enable: manager.enable.bind(manager),
  disable: manager.disable.bind(manager),
  unload: manager.unload.bind(manager),
  getStatus: manager.getStatus.bind(manager),
  getLoadedPackages: manager.getLoadedPackages.bind(manager),
  isLoaded: manager.isLoaded.bind(manager),
  isEnabled: manager.isEnabled.bind(manager),
}

export type LifecycleAPI = typeof lifecycle
