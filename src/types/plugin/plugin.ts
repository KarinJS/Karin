import schedule from 'node-schedule'
import { Plugin } from 'karin/core'
import { Reply, replyCallback, replyForward } from '../event/reply'
import { KarinNoticeType, KarinRequestType, AllListenEvent, KarinMessageType, PermissionType } from '../event'

/**
 * - 插件根目录名称
 * - 例如: karin-plugin-example
 * - 例如: karin-plugin-example/apps
 * - ### npm包类型: `string`
 * - ### git插件类型: `karin-plugin-${string}`
 */
export type dirName = `karin-plugin-${string}` | string
/**
 * - 插件名称
 * - 例如: index.js index.ts
 */
export type fileName = `${string}.js` | `${string}.ts`

/**
 * 上下文状态
 */
export interface stateArrType {
  [key: string]:
  | { type: 'fnc', fnc: Function }
  | { type: 'class', fnc: Plugin, name: string }
  | { type: 'ctx' }
}

/**
 * - 插件规则
 */
export interface PluginRule {
  /**
   * - 命令正则
   */
  reg: string | RegExp
  /**
   * - 命令执行方法名称
   */
  fnc: string | Function
  /**
   * - 监听子事件
   */
  event?: AllListenEvent
  /**
   * 权限
   */
  permission?: PermissionType
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
   * - 执行方法名称或对应函数
   */
  fnc: string | Function
  /**
   * - 是否显示执行日志 默认为true
   */
  log: boolean | Function
  /**
   * - 停止函数
   */
  schedule?: schedule.Job
}

/**
 * - 按钮规则
 */
export interface PluginButton {
  /**
   * - 按钮命令正则
   */
  reg: string | RegExp
  /**
   * - 执行方法名称
   */
  fnc: string | Function
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
  fnc: string | Function
  /**
   * - handler优先级 不填默认为主优先度
   */
  priority: number
}

/**
 * - 插件信息
 */
export interface AppInfo {
  /**
   * - 插件根目录名称
   * - karin-plugin-example
   * - karin-plugin-example/apps
   * - karin-plugin-example/src/apps
   * - karin-plugin-example/dist/apps
   */
  dir: dirName
  /**
   * - 插件名称 例如: index.js index.ts
   */
  name: fileName
}

/**
 * - 定义一个条件类型，根据是否存在accept方法来决定类型
 */
export type EType<T> = T extends { accept: (e: KarinNoticeType | KarinRequestType) => Promise<void> }
  ? KarinNoticeType | KarinRequestType
  : KarinMessageType

/**
 * - 插件基类
 */
export interface PluginType {
  /**
   * - 插件名称
   */
  name: string
  /**
   * - 插件描述
   * @deprecated 请使用desc
   */
  dsc: string
  /**
   * - 插件描述
   */
  desc: string
  /**
   * - 监听事件 默认为message
   */
  event: AllListenEvent
  /**
   * - 优先级 默认为10000
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
  e: EType<this>
  init?: () => Promise<any>
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
  replyForward: replyForward
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
  getContext: () => stateArrType[string]

  /**
   * - accept标准方法 给通知、请求事件使用
   */
  accept?(e: KarinNoticeType | KarinRequestType): Promise<void>
}

/**
 * - Apps
 */
export interface PluginApps {
  /**
   * - 插件文件信息
   */
  file: AppInfo & {
    /**
     * - 插件类型
     */
    type: 'function' | 'class'
    /**
     * - 插件方法
     */
    Fnc: '' | (new () => PluginType)
  }
  /**
   * - 插件名称
   */
  name: string
  /**
   * - 插件事件
   */
  event: AllListenEvent
  /**
   * - 插件优先级
   * @default 10000
   */
  priority: number
  /**
   * - accept函数
   */
  accept: boolean | Function
  /**
   * - accept函数触发是否打印日志
   */
  log: boolean
  /**
   * - 命令规则
   */
  rule: Array<PluginRule>
  /**
   * - 定时任务
   */
  task: Array<PluginTask>
  /**
   * - 按钮
   */
  button: Array<PluginButton>
  /**
   * - handler
   */
  handler: Array<PluginHandler>
}

/**
 * 未实例化的插件
 */
export type NewMessagePlugin = new (e?: KarinMessageType) => Plugin
