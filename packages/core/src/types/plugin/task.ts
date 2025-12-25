import type { Job } from 'node-schedule'
import type { Log, PkgInfo, PluginFile } from './base'

/** 定时任务方法 */
export interface Task {
  /** 插件包基本属性 */
  pkg: PkgInfo
  /** 插件方法基本属性 */
  file: PluginFile<'task'>
  /** 任务名称 */
  name: string
  /** cron表达式 */
  cron: string
  /** 执行方法 */
  fnc: Function
  /** 打印触发插件日志方法 */
  log: Log<false>
  /** schedule */
  schedule?: Job
  /**
   * 任务执行策略
   * - `default`: 默认策略，允许并发执行，即不检查上一次任务是否完成
   * - `skip`: 跳过策略，如果上一次任务未完成，则直接跳过本次执行
   */
  type: 'default' | 'skip'
  /** 运行状态 */
  running: boolean
}
