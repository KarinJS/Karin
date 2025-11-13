/**
 * 插件实例管理器
 * @description 提供插件实例的获取方法
 */
import type { PluginCacheStorage } from './default'
import type { CreateClassPlugin, CreateCommand } from '../create'

/**
 * Command 专用懒排序类
 * @description 专门处理 command 的复杂排序逻辑，包括原始缓存、正常缓存、启用/禁用列表
 * @performance 采用动态方法绑定策略，排序完成后直接切换到零开销的 getter 方法
 */
export class CommandLazySorter {
  /** 是否正在排序 */
  #isSorting = false
  /** 插件缓存存储引用 */
  readonly #cache: PluginCacheStorage

  constructor (cache: PluginCacheStorage) {
    this.#cache = cache
  }

  /**
   * 获取正常排序的 command 列表
   * @description 首次调用时触发排序，排序完成后切换为直接读取缓存的 getter 方法
   */
  data (): (CreateCommand | CreateClassPlugin)[] {
    return this.normal()
  }

  /**
   * 获取被禁用 command 列表
   * @description 此列表不参与排序，直接返回缓存
   */
  disabled (): (CreateCommand | CreateClassPlugin)[] {
    return this.#cache.instances.command.disabled
  }

  /**
   * 标记为未排序状态，下次访问时重新排序
   * @mutable 修改方法指向
   */
  markDirty (): void {
    this.data = this.normal.bind(this)
  }

  /**
   * 获取启用的 command 实例列表
   * @description 此方法为直接返回缓存 不参与排序
   */
  private enabled (): (CreateCommand | CreateClassPlugin)[] {
    return this.#cache.instances.command.enabled
  }

  /**
   * 获取排序后的 command 列表
   * @description 此方法会修改 `this.data` 的指向
   */
  private normal (): (CreateCommand | CreateClassPlugin)[] {
    if (this.#isSorting) {
      /** 直接获取排序结果 不参与状态修改 */
      return this.sorter()
    }

    /**
     * 1. 标记为正在排序
     * 2. 获取排序结果并更新缓存
     * 3. 将获取方法切换为0开销的 getter 方法
     * 4. 将状态标记初始化
     * 5. 返回排序后的结果
     */
    this.#isSorting = true
    this.#cache.instances.command.enabled = this.sorter()
    this.data = this.enabled.bind(this)
    this.#isSorting = false
    return this.enabled()
  }

  /**
   * 获取排序结果
   * - 对所有 command 和 classPlugin 实例进行排序
   * - 此方法仅获取对应的数据进行排序返回结果 不参与任何状态修改
   * @returns 排序后的实例列表
   */
  private sorter (): (CreateCommand | CreateClassPlugin)[] {
    return [
      ...this.#cache.instances.command.raw.class,
      ...this.#cache.instances.command.raw.command,
    ].sort((a, b) => a.priority - b.priority)
  }
}
