/**
 * 插件实例管理器
 * @description 提供插件实例的获取方法
 */
import { isDev } from '@karinjs/envs'
import { CommandLazySorter } from './instances.lazy.command'
import type { PluginCacheStorage } from './default'
import type { CreateAccept, CreateButton, CreateHandler } from '../create'

/**
 * 通用懒排序类
 * @template T - 数组元素类型
 */
class LazySorter<T> {
  /** 标记数据是否需要重新排序 */
  private isDirty = true

  /** 获取原始数组的方法 */
  private readonly getArray: () => T[]

  /** 设置排序后数组的方法 */
  private readonly setArray: (arr: T[]) => void

  /** 排序函数 */
  private readonly sortFn: (arr: T[]) => T[]

  /**
   * 数据获取方法
   * @description 动态方法，根据排序状态在 sorter 和 getter 之间切换
   * @immutable 只读取数据，不修改状态（但首次调用会触发异步排序）
   */
  data: () => T[]

  constructor (options: {
    /**
     * 获取原始数组的方法
     * @description 每次调用 data() 时都会调用此方法获取最新的原始数据
     * @immutable 此方法不应修改原始数组
     */
    getArray: () => T[]
    /**
     * 设置排序后数组的方法
     * @description 在异步排序完成后调用，用于将排序后的数组写回缓存
     * @mutable 此方法会修改缓存中的数组引用
     */
    setArray: (arr: T[]) => void
    /**
     * 排序函数
     * @description 在异步微任务中调用，对数组进行排序
     * @mutable 此方法会修改传入数组的顺序（原地排序）
     * @param arr - 待排序的数组
     * @returns 排序后的数组（通常是同一个数组引用）
     */
    sortFn: (arr: T[]) => T[]
  }) {
    this.getArray = options.getArray
    this.setArray = options.setArray
    this.sortFn = options.sortFn
    this.data = this.sorter.bind(this)
  }

  /**
   * 排序器方法（首次调用或标记为脏后调用）
   * @description 获取原始数据，标记为已处理，然后在微任务中异步排序
   * @immutable 不直接修改数据，只是获取并返回原始数组
   */
  private sorter (): T[] {
    if (this.isDirty === false) {
      return this.getArray()
    }

    this.isDirty = false
    const arr = this.getArray()
    Promise.resolve().then(() => {
      this.data = this.getter.bind(this)
      this.setArray(this.sortFn(arr))
    })
    return arr
  }

  /**
   * 获取器方法（排序完成后调用）
   * @description 直接返回已排序的数组
   * @immutable 只读取缓存，不修改任何数据
   */
  private getter (): T[] {
    return this.getArray()
  }

  /**
   * 标记为未排序状态
   * @description 下次调用 data() 时会重新触发排序流程
   * @mutable 修改内部状态标记，切换 data 方法指向
   */
  markDirty () {
    this.isDirty = true
    this.data = this.sorter.bind(this)
  }
}

/**
 * 插件实例管理器类
 * @description 采用懒排序方式获取各类插件实例
 */
export class InstanceManager {
  /** 插件缓存存储引用 */
  #cache: PluginCacheStorage

  /** accept 类型实例的懒排序器 */
  #acceptSorter: LazySorter<CreateAccept>

  /** button 类型实例的懒排序器 */
  #buttonSorter: LazySorter<CreateButton>

  /** command 类型实例的专用排序器 */
  #commandSorter: CommandLazySorter

  /** handler 类型实例的懒排序器映射表（按事件键分组） */
  #handlerSorters: Map<string, LazySorter<CreateHandler>>

  constructor (cache: PluginCacheStorage) {
    this.#cache = cache

    // 初始化 accept 排序器：优先级高的排在前面 (降序)
    this.#acceptSorter = new LazySorter({
      getArray: () => this.#getAcceptArray(),
      setArray: (arr) => this.#setAcceptArray(arr),
      sortFn: (arr) => this.#sortByPriorityDesc(arr),
    })

    // 初始化 button 排序器：优先级低的排在前面 (升序)
    this.#buttonSorter = new LazySorter({
      getArray: () => this.#getButtonArray(),
      setArray: (arr) => this.#setButtonArray(arr),
      sortFn: (arr) => this.#sortByPriorityAsc(arr),
    })

    this.#commandSorter = new CommandLazySorter(cache)

    this.#handlerSorters = new Map()
  }

  /**
   * 获取 accept 原始数组
   * @immutable 只读取缓存，不修改数据
   */
  #getAcceptArray (): CreateAccept[] {
    return this.#cache.instances.accept
  }

  /**
   * 设置 accept 排序后的数组
   * @mutable 修改缓存中的数组引用
   */
  #setAcceptArray (arr: CreateAccept[]): void {
    this.#cache.instances.accept = arr
  }

  /**
   * 获取 button 原始数组
   * @immutable 只读取缓存，不修改数据
   */
  #getButtonArray (): CreateButton[] {
    return this.#cache.instances.button
  }

  /**
   * 设置 button 排序后的数组
   * @mutable 修改缓存中的数组引用
   */
  #setButtonArray (arr: CreateButton[]): void {
    this.#cache.instances.button = arr
  }

  /**
   * 获取 handler 原始数组
   * @immutable 只读取缓存，不修改数据
   */
  #getHandlerArray (key: string): CreateHandler[] {
    return this.#cache.instances.handler[key] || []
  }

  /**
   * 设置 handler 排序后的数组
   * @mutable 修改缓存中的数组引用
   */
  #setHandlerArray (key: string, arr: CreateHandler[]): void {
    this.#cache.instances.handler[key] = arr
  }

  /**
   * 按优先级降序排序 (优先级高的在前)
   * @mutable 原地修改数组顺序
   */
  #sortByPriorityDesc<T extends { priority: number }> (arr: T[]): T[] {
    return arr.sort((a, b) => b.priority - a.priority)
  }

  /**
   * 按优先级升序排序 (优先级低的在前)
   * @mutable 原地修改数组顺序
   */
  #sortByPriorityAsc<T extends { priority: number }> (arr: T[]): T[] {
    return arr.sort((a, b) => a.priority - b.priority)
  }

  /**
   * 获取或创建指定 key 的 handler 懒排序器
   * @param key - handler 事件键
   */
  #getHandlerSorter (key: string) {
    if (!this.#handlerSorters.has(key)) {
      // 为指定 key 创建 handler 排序器：优先级高的排在前面 (降序)
      this.#handlerSorters.set(key, new LazySorter({
        getArray: () => this.#getHandlerArray(key),
        setArray: (arr) => this.#setHandlerArray(key, arr),
        sortFn: (arr) => this.#sortByPriorityDesc(arr),
      }))
    }
    return this.#handlerSorters.get(key)!
  }

  /**
   * 获取全局实例
   * @description 仅在开发模式下返回可变对象，生产模式下返回 null
   * @returns 全局实例对象
   * @immutable 只读取缓存，不修改数据
   * @example
   * ```ts
   * const instances = instanceManager.get()
   * // -> { accept: [...], button: [...], command: [...], ... }
   * ```
   */
  get instances () {
    if (isDev()) return this.#cache.instances
    return null
  }

  /**
   * 获取 accept 实例列表（按优先级排序）
   * @immutable 只读取缓存，不修改数据
   */
  get accept () {
    return this.#acceptSorter.data()
  }

  /**
   * 获取 button 实例列表
   * @immutable 只读取缓存，不修改数据
   */
  get button () {
    return this.#buttonSorter.data()
  }

  /**
   * 获取 command 热点实例列表
   * @immutable 只读取缓存，不修改数据
   */
  get hot () {
    return this.#cache.instances.command.hot
  }

  /**
   * 获取 command 正常实例列表（按优先级排序）
   * @description 仅包含未被禁用的实例
   */
  get normal () {
    return this.#commandSorter.data()
  }

  /**
   * 获取 command 禁用实例列表
   * @immutable 只读取缓存，不修改数据
   */
  get disabled () {
    return this.#commandSorter.disabled()
  }

  /**
   * 获取 command 实例列表
   * @immutable 只读取缓存，不修改数据
   */
  get command () {
    return {
      normal: this.normal,
      hot: this.hot,
      disabled: this.disabled,
    }
  }

  /**
   * 获取 task 实例列表
   * @immutable 只读取缓存，不修改数据
   */
  get task () {
    return this.#cache.instances.task
  }

  /**
   * 获取 handler 实例列表
   * @param key - handler 事件键
   * @immutable 只读取缓存，不修改数据
   * @example
   * ```ts
   * const handlers = instanceManager.handler('handler.message')
   * ```
   */
  handler (key: string) {
    return this.#getHandlerSorter(key).data()
  }

  /**
   * 标记指定类型的实例为未排序状态
   * @param type - 实例类型
   * @param key - handler 类型时需要指定 key
   * @mutable 修改内部排序器的状态标记
   * @example
   * ```ts
   * instanceManager.markAsUnsorted('accept')
   * instanceManager.markAsUnsorted('handler', 'handler.message')
   * instanceManager.markAsUnsorted('command') // 标记 command 所有缓存
   * ```
   */
  markAsUnsorted (type: keyof PluginCacheStorage['instances'], key?: string) {
    switch (type) {
      case 'accept':
        this.#acceptSorter.markDirty()
        break
      case 'button':
        this.#buttonSorter.markDirty()
        break
      case 'command':
        this.#commandSorter.markDirty()
        break
      case 'handler':
        if (key) {
          const sorter = this.#handlerSorters.get(key)
          if (sorter) sorter.markDirty()
        } else {
          // 标记所有 handler 为脏
          this.#handlerSorters.forEach(sorter => sorter.markDirty())
        }
        break
    }
  }
}
