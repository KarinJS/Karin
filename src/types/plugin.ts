import { KarinNodeElement } from './element'
import { Reply, replyCallback } from './reply'
import { E, Event, Permission, Sub_event } from './types'

/**
 * - 插件根目录名称
 * - 例如: karin-plugin-example
 * - 例如: karin-plugin-example/apps
 */
export type dirName = `karin-plugin-${string}`
/**
 * - 插件名称
 * - 例如: index
 */
export type fileName = `${string}`

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
  reg: RegExp
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
  /**
   * - 打印日志 默认为true
   */
  log?: boolean | Function
}

/**
 * - 定时任务规则
 */
export interface PluginTask {
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
  log: boolean | Function
}

/**
 * - 按钮规则
 */
export interface PluginButton {
  /**
   * - 按钮命令正则
   */
  reg: string
  /**
   * - 执行方法名称
   */
  fnc: string
  /**
   * - 优先级 不填默认为主优先度
   */
  priority: number
}

/**
 * - handler规则
 */
export interface PluginHandler {
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
}

/**
 * - Apps
 */
export interface PluginApps {
  /**
   * - 插件Class
   */
  App: new () => Plugin
  /**
   * - 插件路径信息
   */
  file: {
    /**
     * - 插件根目录名称 例如: karin-plugin-example
     */
    dir: string
    /**
     * - 插件名称 例如: index
     */
    name: string
  }
  /**
   * - 插件名称
   */
  name: string
  /**
   * - 插件事件
   */
  event: Event | `${Event}.${Sub_event}`
  priority: number
  accept: boolean
  rule: Array<PluginRule>
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
  task: Array<PluginTask>
  /**
   * - 命令规则
   */
  rule: Array<PluginRule>
  /**
   * - 按钮
   */
  button: Array<PluginButton>
  /**
   * - handler
   */
  handler: Array<PluginHandler>

  /**
   * - 用户ID 一般上下文使用
   */
  userId?: number

  /**
   * - 上下文超时
   */
  timeout: NodeJS.Timeout | undefined

  /**
   * - 上报事件
   */
  e: E
  /**
   * - 快速回复
   */
  reply: Reply
  /**
   * - 快速回复内部方法 由适配器实现
   */
  replyCallback: replyCallback
  /**
   * - 快速回复合并转发
   */
  replyForward: (msg: KarinNodeElement[]) => Promise<{ message_id?: string }>

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

  /**
   * - accept标准方法 给通知、请求事件使用
   */
  accept?(e: E): Promise<void>
}
