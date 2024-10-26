import type schedule from 'node-schedule'
import type { PluginsType } from '../list/types'
import type { ButtonElementType, ElementTypes, KeyboardElementType } from '@/adapter/segment'
import type { Message } from '@/event'
import type { Contact } from '@/adapter/contact'
import type { AdapterType } from '@/adapter/adapter'
import type { MessageEventMap, NoticeEventMap, RequestEventMap } from '@/event/types'
import { PermissionEnum } from '@/adapter/sender'

/** 插件索引值的类型 */
export interface PlgsIndex {
  /** 插件名称 */
  name: string
  /** 插件类型 */
  type: PluginsType
  /** 插件目录 */
  dir: string
}

/** apps列表的类型 */
export interface PlgsApp {
  /** 索引 对应插件索引，用于查询一些基础信息 */
  index: number
  /** 文件名称 */
  filename: string
  /** 文件相对路径 */
  filepath: string
}

/** 插件方法类型 */
export type fncType = 'accept' | 'command' | 'task' | 'button' | 'handler' | 'middleware'

interface Base {
  /** 索引 */
  index: number
  /** 插件名称 由开发者提供 */
  name: string
  /** 插件方法类型 */
  fncType: fncType
  /** 插件执行方法名称 */
  fncname: string
}

interface Log {
  /** 打印触发插件日志方法 */
  log: Function
}

interface AdapterBase {
  /** 生效的适配器 */
  adapter: string[] // TODO: 类型
  /** 禁用的适配器 */
  dsbAdapter: string[] // TODO: 类型
}

/** 通用参数 */
type PluginOptions = Base & Log & AdapterBase
/** 通知、请求事件联合类型 */
type NoticeAndRequest = NoticeEventMap & RequestEventMap

/** accept类型 */
export type Accept<T extends keyof NoticeAndRequest = keyof NoticeAndRequest> = T extends keyof NoticeAndRequest
  ? PluginOptions & {
    fncType: 'accept'
    /** 优先级 */
    rank: number,
    /** 监听事件 */
    event: T,
    /** 执行方法 */
    fnc: (e: NoticeAndRequest[T]) => Promise<void> | void
  }
  : never

/** command base类型 */
interface CommandBase extends PluginOptions {
  fncType: 'command'
  /** 插件类型 */
  type: 'class' | 'fnc'
  /** 插件正则 */
  reg: RegExp
  /** 插件触发权限 例如只有主人才可触发 */
  perm: `${PermissionEnum}`
}

/** command class类型 */
export interface CommandClass extends CommandBase {
  type: 'class'
  /** 插件类 */
  cls: Function // TODO: 类型
}

/** command fnc类型 */
export type CommandFnc<T extends keyof MessageEventMap = keyof MessageEventMap> = T extends keyof MessageEventMap
  ? CommandBase & {
    type: 'fnc'
    /** 监听事件 */
    event: T
    /** 执行方法 */
    fnc: (e: MessageEventMap[T]) => Promise<boolean> | boolean
  }
  : never

/** task类型 */
export interface Task extends Base, Log {
  fncType: 'task'
  type: 'class' | 'fnc'
  /** 任务名称 */
  task: string
  /** cron表达式 */
  cron: string
  /** 执行方法 */
  fnc: Function
  /** schedule */
  schedule: schedule.Job
}

type ButtonType = ButtonElementType | KeyboardElementType | Array<ButtonElementType | KeyboardElementType>

/** button类型 */
export interface Button extends Base {
  fncType: 'button'
  /** 插件正则 */
  reg: RegExp
  /** 优先级 */
  rank: number
  /** 执行方法 */
  fnc: (
    /** 是否继续匹配下一个按钮 默认否 调用后则继续 */
    next: () => void,
    /** 消息事件 可能不存在~ */
    e?: Message,
    /** 自定义参数 */
    ...args: any[]
  ) => Promise<ButtonType> | ButtonType
}

/** handler类型 */
export interface Handler extends Base {
  fncType: 'handler'
  /** 优先级 */
  rank: number
  /** 入口key */
  key: string
  /** handler的处理方法 */
  fnc: <T = any>(
    /** 自定义参数 由调用方传递 */
    args: { [key: string]: any },
    /** 调用后将继续执行下一个handler */
    next: (msg?: string) => void,
  ) => Promise<T> | T
}

/** 中间件type类型 */
export type MiddlewareType = 'recvMsg' | 'replyMsg' | 'sendMsg' | 'forwardMsg' | 'notFoundMsg'

/** 中间件基类 */
interface MiddlewareBase extends Base {
  fncType: 'middleware'
  /** 中间件方法类型 */
  type: MiddlewareType
  /** 优先级 */
  rank: number
}

/** 收到消息后 */
export interface RecvMsg extends MiddlewareBase {
  type: 'recvMsg'
  fnc: (
    /** 消息事件对象 */
    e: Message,
    /** 调用后将继续执行下一个中间件 */
    next: () => void,
    /** 调用后将退出此条消息的后续处理 不再执行匹配插件 */
    exit: () => void
  ) => Promise<void> | void
}

/** 回复消息前 */
export interface ReplyMsg extends MiddlewareBase {
  type: 'replyMsg'
  fnc: (
    /** 消息事件对象 */
    e: Message,
    /** 回复的消息体 */
    element: ElementTypes[],
    /** 调用后将继续执行下一个中间件 */
    next: () => void,
    /** 调用后将退出此条消息的后续处理 不再执行匹配插件 */
    exit: () => void
  ) => Promise<void> | void
}

/** 发送主动消息前 */
export interface SendMsg extends MiddlewareBase {
  type: 'sendMsg'
  fnc: (
    /** 发送bot的id */
    id: string,
    /** 发送目标 */
    contact: Contact,
    /** 发送的消息体 */
    element: ElementTypes[],
    /** 调用后将继续执行下一个中间件 */
    next: () => void,
    /** 调用后将退出此条消息的后续处理 不再执行匹配插件 */
    exit: () => void
  ) => Promise<void> | void
}

/** 发送合并转发前 */
export interface ForwardMsg extends MiddlewareBase {
  type: 'forwardMsg'
  fnc: (
    /** 发送bot的id */
    bot: AdapterType,
    /** 发送目标 */
    contact: Contact,
    /** 发送的消息体 */
    element: ElementTypes[],
    /** 调用后将继续执行下一个中间件 */
    next: () => void,
    /** 调用后将退出此条消息的后续处理 不再执行匹配插件 */
    exit: () => void
  ) => Promise<void> | void
}

/** 消息事件没有找到任何匹配的插件触发 */
export interface NotFoundMsg extends MiddlewareBase {
  type: 'notFoundMsg'
  fnc: (
    /** 消息事件对象 */
    e: Message,
    /** 调用后将继续执行下一个中间件 */
    next: () => void,
    /** 调用后将退出此条消息的后续处理 不再执行匹配插件 */
    exit: () => void
  ) => Promise<void> | void
}

/** 缓存 */
export interface Cache {
  accept: Accept[],
  command: Array<CommandClass | CommandFnc>,
  task: Array<Task>,
  button: Button[],
  handler: Handler[],
  middleware: Array<RecvMsg | ReplyMsg | SendMsg | ForwardMsg | NotFoundMsg>
}
