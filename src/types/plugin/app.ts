import { AllMessageSubType, AllNoticeSubType, AllRequestSubType, ButtonElement, Contact, KarinAdapter, KarinElement, KarinMessage, KarinMessageType, KarinNoticeType, KarinRequestType, KeyBoardElement, NewMessagePlugin, NodeElement, Permission, UseMapType } from 'karin/types'

export const enum AppType {
  Command = 'command',
  Task = 'task',
  Handler = 'handler',
  Button = 'button',
  Accept = 'accept',
  Use = 'use',
}

export interface AppBase {
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
export interface CommandInfo extends AppBase {
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
  /** 只有对应的适配器才会生效 */
  adapter: Array<KarinAdapter['adapter']['name']>
  /** 指定的适配器无效 */
  notAdapter: Array<KarinAdapter['adapter']['name']>
}

/** task规则集类型 */
export interface TaskInfo extends Omit<AppBase, 'rank'> {
  type: `${AppType.Task}`
  /** 任务名称 */
  fnname: string
  /** cron表达式 */
  cron: string
}

/** handler规则集类型 */
export interface HandlerInfo extends Omit<AppBase, 'log'> {
  type: `${AppType.Handler}`
  /** 入口秘钥 */
  key: string
  /** 实现方法 */
  fn: (
    /** 自定义参数 由调用方传递 */
    args: { [key: string]: any },
    /** 停止循环函数 调用后则不再继续执行下一个处理器 */
    next: (msg?: string) => void,
  ) => Promise<any>
}

/** button规则集类型 */
export interface ButtonInfo extends Omit<AppBase, 'log'> {
  type: `${AppType.Button}`
  /** 正则 */
  reg: RegExp
  fn: (
    /** 是否继续匹配下一个按钮 默认否 调用后则继续 */
    next: () => void,
    /** 消息事件 可能不存在~ */
    e?: KarinMessage,
    /** 自定义参数 */
    ...args: any[]
  ) => Promise<ButtonElement | KeyBoardElement | Array<ButtonElement | KeyBoardElement>>
}

/** accept规则集类型 */
export interface AcceptInfo extends AppBase {
  fn: (e: KarinNoticeType | KarinRequestType) => Promise<boolean>
  type: `${AppType.Accept}`
  /** 监听事件 */
  event: `${AllNoticeSubType}` | `${AllRequestSubType}`
  /** 只有对应的适配器才会生效 */
  adapter: Array<KarinAdapter['adapter']['name']>
  /** 指定的适配器无效 */
  notAdapter: Array<KarinAdapter['adapter']['name']>
}

/**
 * 初始化消息前 中间件实现方法
 */
export type UseRecvMsgFn = (
  /** 消息事件方法 */
  e: KarinMessageType,
  /** 是否继续执行下一个中间件 */
  next: () => void,
  /** 是否退出此条消息 不再执行匹配插件 */
  exit: () => void
) => Promise<void>

/**
 * 回复消息前 中间件实现方法
 */
export type UseSendMsgFn = (
  /** 消息事件方法 */
  e: KarinMessageType,
  /** 回复的消息体 */
  element: KarinElement[],
  /** 是否继续执行下一个中间件 */
  next: () => void,
  /** 是否不发送此条消息 */
  exit: () => void
) => Promise<void>

/**
 * 发送主动消息前 中间件实现方法
 */
export type UseSendNoticeFn = (
  /** 发送的bot */
  uid: string,
  /** 发送目标 */
  contact: Contact,
  /** 发送的消息体 */
  element: KarinElement[],
  /** 是否继续执行下一个中间件 */
  next: () => void,
  /** 是否不发送此条消息 */
  exit: () => void
) => Promise<void>

/**
 * 发送合并转发前 中间件实现方法
 */
export type UseForwardMsgFn = (
  bot: KarinAdapter,
  /** 发送的目标信息 */
  contact: Contact,
  /** 发送的消息体 */
  elements: Array<NodeElement>,
  /** 是否继续执行下一个中间件 */
  next: () => void,
  /** 是否不发送此条消息 */
  exit: () => void
) => Promise<void>

/**
 * 消息事件没有找到任何匹配的插件触发 中间件实现方法
 */
export type UseNotFoundMsgFn = (
  /** 消息事件方法 */
  e: KarinMessageType,
  /** 是否继续执行下一个中间件 */
  next: () => void,
  /** 是否退出此条消息 不再执行匹配插件 */
  exit: () => void
) => Promise<void>

/** use规则集类型 */
export interface UseInfo<T extends keyof UseMapType = keyof UseMapType> extends Omit<AppBase, 'log'> {
  type: `${AppType.Use}`
  /** 中间件类型key */
  key: `${T}`
  /** 中间件实现方法 */
  fn: UseMapType[T][number]['fn']
}
