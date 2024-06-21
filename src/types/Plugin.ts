import { Reply, replyCallback } from './Reply'
import { E, Event, Permission, Sub_event } from './Types'

/**
 * 上下文状态
 */
export interface stateArr {
  [key: string]: {
    plugin: Plugin
    fnc: string
  }
}

/**
 * - 插件规则
 */
export interface PluginRule {
  /**
   * - 命令正则
   */
  reg: string
  /**
   * - 命令执行方法名称
   */
  fnc: string
  /**
   * - 子事件
   */
  event?: Event | `${Event}.${Sub_event}`
  /**
   * - 子权限
   */
  permission?: Permission
}

/**
 * - 插件基类
 */
export interface Plugin {
  /**
   * - 插件名称
   */
  name: string
  /**
   * - 插件描述
   */
  dsc: string
  /**
   * - 监听事件 默认为message
   */
  event: Event | `${Event}.${Sub_event}`
  /**
   * - 优先级 默认为5000
   */
  priority: number
  /**
   * - 定时任务
   */
  task: Array<{
    /**
     * - 任务名称
     */
    name: string
    /**
     * - cron表达式
     */
    cron: string
    /**
     * - 执行方法名称
     */
    fnc: string
    /**
     * - 是否显示执行日志 默认为true
     */
    log?: boolean
  }>
  /**
   * - 命令规则
   */
  rule: Array<PluginRule>
  /**
   * - 按钮
   */
  button: Array<{
    /**
     * - 按钮命令正则
     */
    key: string
    /**
     * - 执行方法名称
     */
    fnc: string
    /**
     * - 优先级 不填默认为主优先度
     */
    priority: number
  }>
  /**
   * - handler
   */
  handler: Array<{
    /**
     * - handler支持的事件key
     */
    key: string
    /**
     * - handler的处理方法名称
     */
    fnc: string
    /**
     * - handler优先级 不填默认为主优先度
     */
    priority: number
  }>

  /**
   * - 上报事件
   */
  e: E
  /**
   * - 快速回复
   */
  reply: Reply
  /**
   * - 快速回复内部方法
   */
  replyForward: replyCallback

  /**
   * - 构建上下文键
   */
  conKey: () => string

  /**
   * - 设置上下文状态
   */
  setContext: (
    /**
     * - 执行方法名称
     */
    fnc: string,
    /**
     * - 超时后是否回复
     */
    reply?: boolean,
    /**
     * - 下文超时时间 默认120秒
     */
    time?: number,
  ) => void

  /**
   * - 获取上下文状态
   */
  getContext: () => {
    /**
     * - 插件实例
     */
    plugin: Plugin
    /**
     * - 执行方法名称
     */
    fnc: string
  }
}
