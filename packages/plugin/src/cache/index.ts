/**
 * 插件缓存 v2.0 - 单一入口
 * @description 导出 PluginCache 和相关类型
 */
import { defaultCache } from './default'
import { createRegister } from './register'
import { createUnregister } from './unregister'
import { createList } from './list'
import { createPackage } from './package'
import { createSettings } from './settings'
import { createPublic } from './public'
import { createEnvs } from './envs'
import { createStats } from './stats'
import { InstanceManager } from './instances'
import { createMissingDeps } from './missingDeps'
import { CommandHotCache } from './hot'

export * from './default'
export * from './hot'

/**
 * 插件缓存管理器
 * @description 统一管理插件的注册、卸载、列表和包信息
 */
class PluginCache {
  /** 日志工具 */
  logger = logger.prefix('[pluginCache]')

  /** 插件缓存存储对象 */
  #cache = defaultCache()

  /** 插件实例管理器 */
  #instances = new InstanceManager(this.#cache)

  /** 插件注册器 */
  #register = createRegister(this.#cache)

  /** 插件卸载器 */
  #unregister = createUnregister(this.#cache, this.#instances)

  /** 插件列表管理器 */
  #list = createList(this.#cache)

  /** 插件包管理器 */
  #package = createPackage(this.#cache)

  /** 插件版本引擎管理器 */
  #settings = createSettings(this.#cache)

  /** 插件静态目录管理器 */
  #public = createPublic(this.#cache)

  /** 插件环境变量管理器 */
  #envs = createEnvs(this.#cache)

  /** 插件统计管理器 */
  #stats = createStats(this.#cache)

  /** 插件缺失依赖管理器 */
  #missingDeps = createMissingDeps(this.#cache)

  /** 命令热点缓存系统 */
  #hotCache = new CommandHotCache()

  /**
   * 获取插件注册器
   * @returns 插件注册器对象
   */
  get register () {
    return this.#register
  }

  /**
   * 获取插件卸载器
   * @returns 插件卸载器对象
   */
  get unregister () {
    return this.#unregister
  }

  /**
   * 获取插件列表管理器
   * @returns 插件列表管理器对象
   */
  get list () {
    return this.#list
  }

  /**
   * 获取插件包管理器
   * @returns 插件包管理器对象
   */
  get package () {
    return this.#package
  }

  /**
   * 获取插件版本引擎管理器
   * @returns 插件版本引擎管理器对象
   */
  get settings () {
    return this.#settings
  }

  /**
   * 获取插件静态目录管理器
   * @returns 插件静态目录管理器对象
   */
  get public () {
    return this.#public
  }

  /**
   * 获取插件环境变量管理器
   * @returns 插件环境变量管理器对象
   */
  get envs () {
    return this.#envs
  }

  /**
   * 获取全局统计信息
   * @returns 统计信息对象
   * @example
   * ```ts
   * const stats = pluginCache.stats
   * // -> { pkg: 10, command: 50, accept: 20, ... }
   * ```
   */
  get stats () {
    return this.#stats.get()
  }

  /**
   * 获取全局实例
   * @returns 全局实例对象
   * @example
   * ```ts
   * const instances = pluginCache.instances
   * // -> { accept: [...], button: [...], command: [...], ... }
   * ```
   */
  get instances () {
    return this.#instances
  }

  /**
   * 获取插件缺失依赖管理器
   * @returns 缺失依赖管理器对象
   * @example
   * ```ts
   * const missingDeps = pluginCache.missingDeps
   * // 获取所有缺失依赖
   * const all = missingDeps.get()
   * // 获取指定插件的缺失依赖
   * const deps = missingDeps.getByPackage('karin-plugin-example')
   * ```
   */
  get missingDeps () {
    return this.#missingDeps
  }

  /**
   * 获取命令热点缓存系统
   * @returns 热点缓存系统对象
   * @example
   * ```ts
   * const hotCache = pluginCache.hotCache
   * // 追踪命令使用
   * hotCache.track(ctx.msg, command)
   * // 查询热点缓存
   * const command = hotCache.query(ctx.msg)
   * // 获取统计信息
   * const stats = hotCache.getStats()
   * ```
   */
  get hotCache () {
    return this.#hotCache
  }
}

export const pluginCache = new PluginCache()
