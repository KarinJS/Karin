import { types } from '@karinjs/utils'
import { BuilderBase } from './base'
import { scheduleJob } from 'node-schedule'
import { store } from '../store'
import type { OptionsBase } from './options'
import type { Job } from 'node-schedule'

/**
 * Task 插件选项
 */
export interface Options extends OptionsBase {

}

/**
 * 格式化后的参数选项类型
 */
type FormatOptions = Required<Omit<Options, 'rank' | 'notAdapter' | 'perm' | 'permission'>>

/**
 * Task 回调函数类型
 */
export type TaskCallback = () => Promise<unknown> | unknown

/**
 * 快速构建定时任务
 * @param name 任务名称
 * @param cron cron表达式
 * @param fnc 执行函数
 * @param options 选项
 */
export const task = (
  name: string,
  cron: string,
  fnc: TaskCallback,
  options: Options
): CreateTask => {
  const result = new CreateTask(name, cron, fnc, options)
  store.add('task', result)
  return result
}

/**
 * Task 构建器
 * @class CreateTask
 */
export class CreateTask extends BuilderBase {
  #taskName: string
  #cron: string
  #callback: TaskCallback
  #options: Required<FormatOptions>
  /** 定时任务对象，由 node-schedule 创建 */
  #schedule: Job | null = null

  constructor (
    name: string,
    cron: string,
    callback: TaskCallback,
    options: Options
  ) {
    super()
    if (!name) throw new Error('[task]: 缺少参数[name]')
    if (!cron) throw new Error('[task]: 缺少参数[cron]')
    if (!callback || typeof callback !== 'function') throw new Error('[task]: 缺少参数或类型错误[fnc]')

    this.#taskName = name
    this.#cron = cron
    this.#callback = callback
    this.#options = CreateTask.options(options)
    this.setLog(this.#options.log)
  }

  /**
   * 标准化 Task 选项
   * @param options 选项
   * @returns 返回格式化后的选项
   */
  static options (
    options: Options
  ): Required<FormatOptions> {
    const name = options.name?.trim()
    if (!name) {
      throw new Error('[task] name 是必填项，且不允许为空')
    }

    return {
      name,
      log: types.bool(options.log, true),
      priority: types.number(options.priority, types.number(options.rank, 10000)),
      adapter: types.array(options.adapter, []),
      dsbAdapter: types.array(options.dsbAdapter, types.array(options.notAdapter, [])),
    }
  }

  /**
   * 当前app名称
   */
  get name (): string {
    return this.#options.name
  }

  get type (): 'task' {
    return 'task'
  }

  /**
   * 任务名称
   * @returns 返回任务名称
   */
  get taskName (): string {
    return this.#taskName
  }

  /**
   * cron表达式
   * @returns 返回cron表达式
   */
  get cron (): string {
    return this.#cron
  }

  /**
   * 插件回调函数
   * @returns 返回插件回调函数
   */
  get callback (): TaskCallback {
    return this.#callback
  }

  /**
   * 优先级
   * @returns 返回优先级
   */
  get priority (): number {
    return this.#options.priority
  }

  /**
   * 插件选项
   * @returns 返回插件选项
   */
  get options (): Required<FormatOptions> {
    return this.#options
  }

  /**
   * 定时任务对象
   * @returns 返回定时任务对象
   * @description node-schedule 的 Job 实例
   */
  get schedule (): Job | null {
    return this.#schedule
  }

  /**
   * 设置定时任务对象
   * @param schedule node-schedule 的 Job 实例
   * @description 如果已有任务在运行，会先停止旧任务
   */
  set schedule (schedule: Job | null) {
    // 先停止旧任务
    if (this.#schedule) {
      this.#schedule.cancel()
    }
    this.#schedule = schedule
  }

  /**
   * 更新任务名称
   * @param name 任务名称
   */
  setTaskName (name: string) {
    this.#taskName = name
  }

  /**
   * 更新cron表达式
   * @param cron cron表达式
   * @description 如果任务正在运行，会自动重启任务使新的 cron 生效
   */
  setCron (cron: string) {
    const wasRunning = this.isRunning()
    this.#cron = cron
    /** 如果任务正在运行，自动重启 */
    if (wasRunning) {
      this.restart()
    }
  }

  /**
   * 更新回调函数
   * @param callback 回调函数
   * @description 如果任务正在运行，会自动重启任务使新的回调生效
   */
  setCallback (callback: TaskCallback) {
    const wasRunning = this.isRunning()
    this.#callback = callback
    /** 如果任务正在运行，自动重启 */
    if (wasRunning) {
      this.restart()
    }
  }

  /**
   * 执行任务回调
   * @description 统一的任务执行逻辑，处理同步和异步回调
   */
  #executeCallback = async (): Promise<void> => {
    this.log(`定时任务 [${this.#taskName}] 开始执行`)
    try {
      await this.#callback()
    } catch (error) {
      throw new Error(`定时任务 [${this.#taskName}] 执行失败`, { cause: error })
    }
  }

  /**
   * 启动定时任务
   * @returns 返回 Job 实例，如果启动失败返回 null
   * @description 使用当前的 cron 表达式和回调函数创建定时任务
   */
  start (): Job | null {
    try {
      /** 如果已有任务在运行，先停止 */
      if (this.#schedule) {
        this.stop()
      }

      /** 创建新的定时任务 */
      const job = scheduleJob(this.#taskName, this.#cron, () => {
        this.#executeCallback().catch(error => logger.error(error))
      })

      if (job) {
        this.#schedule = job
        this.log(`定时任务 [${this.#taskName}] 已启动，cron: ${this.#cron}`)
      } else {
        logger.error(`定时任务 [${this.#taskName}] 启动失败`)
      }

      return job
    } catch (error) {
      logger.error(new Error(`定时任务 [${this.#taskName}] 启动异常`, { cause: error }))
      return null
    }
  }

  /**
   * 停止定时任务
   * @returns 是否成功停止
   */
  stop (): boolean {
    if (!this.#schedule) {
      return false
    }

    try {
      this.#schedule.cancel()
      this.log(`定时任务 [${this.#taskName}] 已停止`)
      this.#schedule = null
      return true
    } catch (error) {
      logger.error(new Error(`定时任务 [${this.#taskName}] 停止失败`, { cause: error }))
      return false
    }
  }

  /**
   * 重启定时任务
   * @returns 返回新的 Job 实例，如果重启失败返回 null
   * @description 先停止旧任务，再启动新任务
   */
  restart (): Job | null {
    this.stop()
    return this.start()
  }

  /**
   * 检查任务是否正在运行
   * @returns 任务是否正在运行
   */
  isRunning (): boolean {
    return this.#schedule !== null
  }

  /**
   * 更新选项
   * @param options Task 选项
   */
  setOptions (options: Options) {
    this.#options = CreateTask.options(options)
  }
}
