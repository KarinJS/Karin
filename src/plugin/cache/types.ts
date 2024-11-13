import type { FSWatcher } from 'chokidar'
import type { Message } from '@/event'
import type schedule from 'node-schedule'
import type { AppsType } from '../list/types'
import type { Contact } from '@/adapter/contact'
import type { AdapterProtocol, AdapterType } from '@/adapter/adapter'
import type { MessageEventMap, NoticeEventMap, RequestEventMap } from '@/event/types/types'
import type { ButtonElementType, ElementTypes, KeyboardElementType } from '@/adapter/segment'
import { PermissionEnum } from '@/adapter/sender'
import { Plugin } from '@plugin/class'

/** 插件索引值的类型 */
export interface PluginIndex {
  /** 插件类型 */
  type: AppsType
  /** 插件名称 */
  name: string
  /** 插件根目录 */
  dir: string
  /** package.json绝对路径 app类型的插件为'' */
  pkgPath: string
}

/** apps列表的类型 */
export interface PluginApp {
  /** 索引 对应插件索引，用于查询一些基础信息 */
  index: number
  /** 文件名称 */
  filename: string
  /** 文件相对路径 */
  filepath: string
}

/** 插件方法类型 */
export type fileType = 'accept' | 'command' | 'task' | 'button' | 'handler' | 'middleware'

interface Base {
  /** 索引 */
  index: number
  /** 插件名称 如果没有设置则是插件类型 */
  name: fileType | string
  /** 插件包信息 */
  get info (): PluginIndex
  /** app文件信息 */
  file: {
    /** app类型 `accept` `command` `task` `button` `handler` `middleware` */
    type: fileType,
    /** app目录：`/root/karin/plugins/karin-plugin-example` */
    dirname: string
    /** app文件名：`index.ts` `index.js` */
    basename: string
    /** app函数方法名称 */
    method: string
    /** app绝对路径 */
    get path (): string
  }
}

interface Log {
  /** 打印触发插件日志方法 */
  log: Function
}

interface AdapterBase {
  /** 生效的适配器 */
  adapter: Array<`${AdapterProtocol}`>
  /** 禁用的适配器 */
  dsbAdapter: Array<`${AdapterProtocol}`>
}

/** 通用参数 */
type PluginOptions = Base & Log & AdapterBase
/** 通知、请求事件联合类型 */
export type NoticeAndRequest = NoticeEventMap & RequestEventMap

/** accept类型 */
export type Accept<T extends keyof NoticeAndRequest = keyof NoticeAndRequest> = PluginOptions & {
  file: Omit<PluginOptions['file'], 'type'> & { type: 'accept' }
  /** 优先级 */
  rank: number,
  /** 监听事件 */
  event: T,
  /** 执行方法 */
  fnc: (e: NoticeAndRequest[T]) => Promise<boolean> | boolean
}
/** command base类型 */
export interface CommandBase extends PluginOptions {
  file: Omit<PluginOptions['file'], 'type'> & { type: 'command' }
  /** 插件类型 */
  type: 'class' | 'fnc'
  /** 插件正则 */
  reg: RegExp
  /** 优先级 */
  rank: number
  /** 插件触发权限 例如只有主人才可触发 */
  perm: `${PermissionEnum}`
}

/** command class类型 */
export interface CommandClass extends CommandBase {
  type: 'class'
  /** 插件类 */
  Cls: new () => Plugin
  /** 监听事件 */
  event: keyof MessageEventMap
}

/** command fnc类型 */
export type CommandFnc<T extends keyof MessageEventMap = keyof MessageEventMap> = CommandBase & {
  type: 'fnc'
  /** 监听事件 */
  event: T
  /** 优先级 */
  rank: number
  /** 执行方法 */
  fnc: (e: MessageEventMap[T]) => Promise<boolean> | boolean
}

/** task类型 */
export interface Task extends Base, Log {
  file: Omit<PluginOptions['file'], 'type'> & { type: 'task' }
  /** 任务名称 */
  name: string
  /** cron表达式 */
  cron: string
  /** 执行方法 */
  fnc: Function
  /** schedule */
  schedule?: schedule.Job
}

type ButtonType = ButtonElementType | KeyboardElementType | Array<ButtonElementType | KeyboardElementType>

/** button类型 */
export interface Button extends Base {
  file: Omit<PluginOptions['file'], 'type'> & { type: 'button' }
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
  file: Omit<PluginOptions['file'], 'type'> & { type: 'handler' }
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
  file: Omit<PluginOptions['file'], 'type'> & { type: 'middleware' }
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
    /** 此条消息是否通过限制 黑白名单冷却等 */
    pass: boolean,
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

export type Middleware = RecvMsg | ReplyMsg | SendMsg | ForwardMsg | NotFoundMsg

export interface Count {
  accept: number
  command: number
  task: number
  button: number
  handler: {
    /** 入口key */
    key: number
    /** handler处理函数 */
    fnc: number
  }
  middleware: number
}

/** 缓存 */
export interface Cache {
  /** 插件索引 */
  index: Record<number, PluginIndex>
  /** accept */
  accept: Accept[],
  /** command */
  command: Array<CommandClass | CommandFnc>,
  /** 定时任务 */
  task: Array<Task>,
  /** 按钮 */
  button: Button[],
  /** 插件数量统计 */
  count: Count
  /** 插件名称:缺失的依赖 */
  missing: Map<string, string>
  /** apps监听 */
  watcher: Map<string, FSWatcher>
  /** handler */
  handler: Record<string, Handler[]>
  /** 中间件 */
  middleware: {
    /** 收到消息后 */
    recvMsg: Array<RecvMsg>,
    /** 回复消息前 */
    replyMsg: Array<ReplyMsg>,
    /** 发送主动消息前 */
    sendMsg: Array<SendMsg>,
    /** 发送合并转发前 */
    forwardMsg: Array<ForwardMsg>,
    /** 消息事件没有找到任何匹配的插件触发 */
    notFoundMsg: Array<NotFoundMsg>
  },
}
