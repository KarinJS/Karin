import { AllMessageSubType, AllNoticeSubType, AllRequestSubType, KarinMessageType, KarinNoticeType, KarinRequestType, NewMessagePlugin, Permission, UseMapType } from 'karin/types'

export const enum AppType {
  Command = 'command',
  Task = 'task',
  Handler = 'handler',
  Button = 'button',
  Accept = 'accept',
  Use = 'use',
}

interface AppInfo {
  /** 实现方法 */
  fn: Function
  /** 插件名称 */
  name: string,
  /** 插件类型 */
  type: `${AppType}`,
  /** 插件优先级 */
  rank: number,
  /** 执行方法打印日志函数 */
  log: Function,
}

/** command规则集类型 */
export interface CommandInfo extends AppInfo {
  fn: (e: KarinMessageType) => Promise<boolean>
  /** 插件执行方法名称 */
  fnname: string
  type: `${AppType.Command}`
  /** 监听事件 */
  event: `${AllMessageSubType}`,
  /** 正则 */
  reg: RegExp
  /** 权限 */
  perm: `${Permission}`
  /** class */
  data: NewMessagePlugin | ''
}

/** task规则集类型 */
export interface TaskInfo extends Omit<AppInfo, 'rank'> {
  type: `${AppType.Task}`
  /** 任务名称 */
  fnname: string
  /** cron表达式 */
  cron: string
}

/** handler规则集类型 */
export interface HandlerInfo extends Omit<AppInfo, 'log'> {
  type: `${AppType.Handler}`
  /** 入口秘钥 */
  key: string
}

/** button规则集类型 */
export interface ButtonInfo extends AppInfo {
  type: `${AppType.Button}`
  /** 正则 */
  reg: RegExp
}

/** accept规则集类型 */
export interface AcceptInfo extends AppInfo {
  fn: (e: KarinNoticeType | KarinRequestType) => Promise<boolean>
  type: `${AppType.Accept}`
  /** 监听事件 */
  event: `${AllNoticeSubType}` | `${AllRequestSubType}`
}

/** use规则集类型 */
export interface UseInfo extends Omit<AppInfo, 'log'> {
  type: `${AppType.Use}`
  /** 中间件类型key */
  key: `${keyof UseMapType}`
}
