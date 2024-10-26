import schedule from 'node-schedule'
import { Reply, replyCallback, replyForward } from '../event/reply'
import { KarinNoticeType, KarinRequestType, AllListenEvent, KarinMessageType, AllMessageSubType, Permission } from '../event'
import { AcceptInfo, ButtonInfo, CommandInfo, HandlerInfo, Plugin, UseForwardMsgFn, UseInfo, UseNotFoundMsgFn, UseRecvMsgFn, UseSendMsgFn, UseSendNoticeFn } from '../../core'
import { KarinAdapter } from '../adapter/base'

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

/** 插件类型枚举 */
export const enum AppsType {
  /** git插件 */
  Git = 'git',
  /** npm插件 */
  Npm = 'npm',
  /** 单个app插件 */
  Js = 'js',
}

/** 插件实现方法类型 */
export const enum MethodType {
  /** 函数 */
  Function = 'function',
  /** 类 */
  Class = 'class',
}

/** plugin基本信息 */
export interface PluginInfoType {
  /** 插件包类型 */
  type: `${AppsType}`
  /** 插件包名称 例: `karin-plugin-example` `@karinjs/adapter-qqbot` */
  plugin: string,
  /** 插件路径 在type为js下，path为空 */
  path: string,
  /** 插件文件名称 index.js index.ts */
  file: string,
}

/** Command规则集信息 */
export interface PluginCommandInfoType {
  /** 插件基本信息的映射key */
  key: number,
  /** 插件包名称 */
  name: CommandInfo['name'],
  /** 插件正则 */
  reg: CommandInfo['reg'],
  /** 插件执行方法 */
  fn: CommandInfo['fn'],
  /** 插件执行方法名称 */
  fnname: CommandInfo['fnname'],
  /** 插件类型 */
  type: `${MethodType}`,
  /** 在type为class的时候 data为class 否则为空字符串 */
  data: (() => PluginType) | undefined,
  /** 插件执行权限 */
  perm: CommandInfo['perm'],
  /** 执行打印日志方法 */
  log: CommandInfo['log'],
  /** 监听的子事件 高于父事件 */
  event: CommandInfo['event']
  /** 优先级 */
  rank: CommandInfo['rank']
  /** 只有对应的适配器才会生效 */
  adapter: Array<KarinAdapter['adapter']['name']>
  /** 指定的适配器无效 */
  notAdapter: Array<KarinAdapter['adapter']['name']>
}

/** accept规则集信息 */
export interface PluginAcceptInfoType {
  /** 插件基本信息的映射key */
  key: number,
  /** 插件包名称 */
  name: AcceptInfo['name'],
  /** 插件执行方法 */
  fn: AcceptInfo['fn'],
  /** 优先级 */
  rank: AcceptInfo['rank'],
  /** 监听事件 */
  event: AcceptInfo['event']
  /** 执行打印日志方法 */
  log: AcceptInfo['log']
  /** 只有对应的适配器才会生效 */
  adapter: Array<KarinAdapter['adapter']['name']>
  /** 指定的适配器无效 */
  notAdapter: Array<KarinAdapter['adapter']['name']>
}

/** task规则集信息 */
export interface PluginTaskInfoType {
  /** 插件基本信息的映射key */
  key: number,
  /** 插件包名称 */
  name: string,
  /** 任务名称 */
  taskname: string,
  /** cron表达式 */
  cron: string,
  /** 任务执行方法 */
  fn: Function,
  /** 在type为class的时候 data为class 否则为空字符串 */
  data: (() => PluginType) | undefined,
  /** 执行打印日志方法 */
  log: Function,
  /** 停止函数 */
  schedule: schedule.Job
}

/** button规则集信息 */
export interface PluginButtonInfoType {
  /** 插件基本信息的映射key */
  key: number,
  /** 插件包名称 */
  name: ButtonInfo['name'],
  /** 插件正则 */
  reg: ButtonInfo['reg'],
  /** 插件执行方法 */
  fn: ButtonInfo['fn'],
  /** 优先级 */
  rank: ButtonInfo['rank']
}

/** handler规则集信息 */
export interface PluginHandlerInfoType {
  /** 插件基本信息的映射key */
  key: number,
  /** 插件包名称 */
  name: HandlerInfo['name'],
  /** handler的处理方法 */
  fn: HandlerInfo['fn'],
  /** 优先级 */
  rank: HandlerInfo['rank'],
}

export interface UseBase<T> {
  /** 插件基本信息的映射key */
  key: number
  /** 插件包名称 */
  name: UseInfo['name']
  /** 插件执行方法 */
  fn: T
  /** 优先级 */
  rank: UseInfo['rank']
}

/** 中间件类型 */
export const enum UseKeyType {
  /** 收到消息后 */
  ReceiveMsg = 'recvMsg',
  /** 回复消息前 */
  ReplyMsg = 'replyMsg',
  /** 发送主动消息前 */
  SendMsg = 'sendMsg',
  /** 发送合并转发前 */
  ForwardMsg = 'forwardMsg',
  /** 消息事件没有找到任何匹配的插件触发 */
  NotFoundMsg = 'notFoundMsg',
}

/** 中间件映射 */
export interface UseMapType {
  [UseKeyType.ReceiveMsg]: Array<UseBase<UseRecvMsgFn>>
  [UseKeyType.ReplyMsg]: Array<UseBase<UseSendMsgFn>>
  [UseKeyType.SendMsg]: Array<UseBase<UseSendNoticeFn>>
  [UseKeyType.ForwardMsg]: Array<UseBase<UseForwardMsgFn>>
  [UseKeyType.NotFoundMsg]: Array<UseBase<UseNotFoundMsgFn>>
}

/** 上下文状态 */
export interface stateArrType {
  [key: string]:
  | { type: 'fnc', fnc: Function }
  | { type: 'class', fnc: Plugin, name: string }
  | { type: 'ctx' }
}

/** 插件规则 */
export interface PluginRule {
  /** 命令正则 */
  reg: string | RegExp
  /** 命令执行方法名称 */
  fnc: string | Function
  /** 监听子事件 */
  event?: AllMessageSubType
  /** 优先级 默认为10000 */
  priority?: number
  /** 权限 */
  permission?: `${Permission}`
  /** 打印日志 默认为true */
  log?: boolean | Function
}

/** 定时任务规则 */
export interface PluginTask {
  /** 任务名称 */
  name: string
  /** cron表达式 */
  cron: string
  /** 执行方法名称或对应函数 */
  fnc: string | Function
  /** 是否显示执行日志 默认为true */
  log: boolean | Function
  /** 停止函数 */
  schedule?: schedule.Job
}

/** 按钮规则 */
export interface PluginButton {
  /** 按钮命令正则 */
  reg: string | RegExp
  /** 执行方法名称 */
  fnc: string | Function
}

/** handler规则 */
export interface PluginHandler {
  /** handler支持的事件key */
  key: string
  /** handler的处理方法名称 */
  fnc: string | Function
  /** handler优先级 不填默认为主优先度 */
  priority: number
}

/** 插件信息 */
export interface AppInfo {
  /**
   * - 插件根目录名称
   * - karin-plugin-example
   * - karin-plugin-example/apps
   * - karin-plugin-example/src/apps
   * - karin-plugin-example/dist/apps
   */
  dir: dirName
  /** 插件名称 例如: index.js index.ts */
  name: fileName
}

/** 定义一个条件类型，根据是否存在accept方法来决定类型 */
export type EType<T> = T extends { accept: (e: KarinNoticeType | KarinRequestType) => Promise<void> }
  ? KarinNoticeType | KarinRequestType
  : KarinMessageType

/** 插件基类 */
export interface PluginType {
  /** 插件名称 */
  name: string
  /** 插件描述 */
  desc: string
  /** 监听事件 默认为message */
  event: AllMessageSubType
  /** 优先级 默认为10000 */
  priority: number
  /** 定时任务 */
  task: Array<PluginTask>
  /** 命令规则 */
  rule: Array<PluginRule>
  /** handler */
  handler: Array<PluginHandler>

  /** 用户ID 一般上下文使用 */
  userId?: number

  /** 上下文超时 */
  timeout: NodeJS.Timeout | undefined

  /** 上报事件 */
  e: EType<this>
  init?: () => Promise<any>
  /** 快速回复 */
  reply: Reply
  /** 快速回复内部方法 由适配器实现 */
  replyCallback: replyCallback
  /** 快速回复合并转发 */
  replyForward: replyForward
  /** 构建上下文键 */
  conKey: () => string

  /** 设置上下文状态 */
  setContext: (
    /** 执行方法名称 */
    fnc: string,
    /** 超时后是否回复 */
    reply?: boolean,
    /** 下文超时时间 默认120秒 */
    time?: number,
  ) => void

  /** 获取上下文状态 */
  getContext: () => stateArrType[string]

  /** accept标准方法 给通知、请求事件使用 */
  accept?(e: KarinNoticeType | KarinRequestType): Promise<void>
}

/** Apps */
export interface PluginApps {
  /** 插件文件信息 */
  file: AppInfo & {
    /** 插件类型 */
    type: 'function' | 'class'
    /** 插件方法 */
    Fnc: '' | (new () => PluginType)
  }
  /** 插件名称 */
  name: string
  /** 插件事件 */
  event: AllListenEvent
  /**
   * - 插件优先级
   * @default 10000
   */
  priority: number
  /** accept函数 */
  accept: boolean | Function
  /** accept函数触发是否打印日志 */
  log: boolean
  /** 命令规则 */
  rule: Array<PluginRule>
  /** 定时任务 */
  task: Array<PluginTask>
  /** 按钮 */
  button: Array<PluginButton>
  /** handler */
  handler: Array<PluginHandler>
}

/** 未实例化的插件 */
export type NewMessagePlugin = new (e?: KarinMessageType) => Plugin
