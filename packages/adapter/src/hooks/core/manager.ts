import { logger } from '@karinjs/logger'

/**
 * 钩子配置项
 */
export interface HookOptions {
  /** 优先级，数字越小优先级越高，默认 10000 */
  priority?: number
  /** 超时时间（毫秒），默认 5000ms */
  timeoutMs?: number
  /** 是否忽略钩子执行错误，默认 false */
  swallowErrors?: boolean
}

/**
 * 钩子项
 */
export interface HookItem<TCallback> {
  /** 钩子唯一ID */
  id: number
  /** 优先级 */
  priority: number
  /** 回调函数 */
  callback: TCallback
  /** 配置项 */
  options: HookOptions
}

/**
 * 判断是否为 Promise 对象
 */
export function isThenable (val: any): val is Promise<any> {
  return !!val && (typeof val === 'object' || typeof val === 'function') && typeof val.then === 'function'
}

/**
 * 钩子ID生成器
 */
let hookIdCounter = 0
const generateHookId = () => ++hookIdCounter

/**
 * 通用钩子管理器
 * @template TCallback 回调函数类型
 */
export class HookManager<TCallback extends (...args: any[]) => any> {
  private hooks: HookItem<TCallback>[] = []
  private readonly name: string

  constructor (name: string = 'HookManager') {
    this.name = name
  }

  /**
   * 添加钩子
   * @param callback 回调函数
   * @param options 配置项
   * @returns 钩子ID
   */
  add (callback: TCallback, options: HookOptions = {}): number {
    const id = generateHookId()
    const priority = options.priority ?? 10000

    this.hooks.push({
      id,
      priority,
      callback,
      options,
    })

    // 按优先级排序（数字越小优先级越高）
    this.hooks.sort((a, b) => a.priority - b.priority)

    logger.debug(`[${this.name}] 添加钩子 #${id}，优先级: ${priority}`)
    return id
  }

  /**
   * 移除钩子
   * @param id 钩子ID
   * @returns 是否成功移除
   */
  remove (id: number): boolean {
    const index = this.hooks.findIndex(h => h.id === id)
    if (index === -1) {
      logger.debug(`[${this.name}] 钩子 #${id} 不存在`)
      return false
    }

    this.hooks.splice(index, 1)
    logger.debug(`[${this.name}] 移除钩子 #${id}`)
    return true
  }

  /**
   * 获取所有钩子（只读副本）
   * @returns 钩子列表
   */
  list (): ReadonlyArray<Readonly<HookItem<TCallback>>> {
    return [...this.hooks]
  }

  /**
   * 清空所有钩子
   */
  clear (): void {
    const count = this.hooks.length
    this.hooks = []
    logger.debug(`[${this.name}] 清空所有钩子，共 ${count} 个`)
  }

  /**
   * 获取钩子数量
   */
  get size (): number {
    return this.hooks.length
  }

  /**
   * 触发钩子（带 next 控制流）
   * 钩子需要调用 next() 才会继续执行下一个钩子
   * @param args 传递给回调函数的参数
   * @returns 是否所有钩子都执行完成（所有钩子都调用了 next）
   */
  async emit (...args: any[]): Promise<boolean> {
    if (this.hooks.length === 0) {
      return true
    }

    for (const hook of this.hooks) {
      let nextCalled = false
      const next = () => {
        nextCalled = true
      }

      try {
        // 执行钩子回调
        const result = hook.callback(...args, next)

        // 如果返回 Promise，等待完成
        if (isThenable(result)) {
          await result
        }

        // 检查是否调用了 next()
        if (!nextCalled) {
          logger.debug(`[${this.name}] 钩子 #${hook.id} 未调用 next()，中断执行`)
          return false
        }
      } catch (error) {
        logger.error(`[${this.name}] 钩子 #${hook.id} 执行出错:`, error)

        // 根据配置决定是否继续执行
        if (!hook.options.swallowErrors) {
          return false
        }

        logger.debug(`[${this.name}] 钩子 #${hook.id} 出错但继续执行（swallowErrors=true）`)
      }
    }

    return true
  }

  /**
   * 触发钩子（不需要 next 控制流，全部执行）
   * 适用于后置钩子（post-hooks），不影响主流程
   * @param args 传递给回调函数的参数
   */
  async emitAll (...args: any[]): Promise<void> {
    if (this.hooks.length === 0) {
      return
    }

    for (const hook of this.hooks) {
      try {
        const result = hook.callback(...args)

        if (isThenable(result)) {
          await result
        }
      } catch (error) {
        logger.error(`[${this.name}] 钩子 #${hook.id} 执行出错:`, error)

        // 后置钩子错误不中断其他钩子
        if (!hook.options.swallowErrors) {
          logger.warn(`[${this.name}] 钩子 #${hook.id} 出错，但继续执行其他钩子`)
        }
      }
    }
  }

  /**
   * 触发钩子（并行执行，适用于独立的后置钩子）
   * @param args 传递给回调函数的参数
   */
  async emitParallel (...args: any[]): Promise<void> {
    if (this.hooks.length === 0) {
      return
    }

    await Promise.allSettled(
      this.hooks.map(async hook => {
        try {
          const result = hook.callback(...args)
          if (isThenable(result)) {
            await result
          }
        } catch (error) {
          logger.error(`[${this.name}] 钩子 #${hook.id} 执行出错:`, error)
        }
      })
    )
  }
}
