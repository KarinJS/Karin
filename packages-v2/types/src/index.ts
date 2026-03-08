/** 通用 Promise 或同步值 */
export type Awaitable<T> = T | Promise<T>

// ─── 消息元素 ───

export interface TextElement { type: 'text'; text: string }
export interface ImageElement { type: 'image'; url: string; file?: string }
export interface AtElement { type: 'at'; userId: string }
export interface FaceElement { type: 'face'; id: number }
export interface ReplyElement { type: 'reply'; messageId: string }
export interface ForwardElement { type: 'forward'; messages: Element[][] }

/** 消息元素联合类型，按需扩展 */
export type Element =
  | TextElement
  | ImageElement
  | AtElement
  | FaceElement
  | ReplyElement
  | ForwardElement

// ─── 联系人 ───

export type Scene = 'friend' | 'group' | 'guild' | 'direct'

export interface Contact {
  scene: Scene
  peer: string
  subPeer?: string
}

// ─── 事件基类 ───

export interface BaseEvent {
  /** 事件类型 */
  type: 'message' | 'notice' | 'request'
  /** 事件子类型 */
  subType?: string
  /** bot 自身 ID */
  selfId: string
  /** 触发事件的用户 ID */
  userId: string
  /** 联系人信息 */
  contact: Contact
  /** 秒级时间戳 */
  timestamp: number
}

export interface MessageEvent extends BaseEvent {
  type: 'message'
  /** 消息 ID */
  messageId: string
  /** 原始消息文本（用于正则匹配） */
  rawMessage: string
  /** 消息元素数组 */
  elements: Element[]
}

export interface NoticeEvent extends BaseEvent {
  type: 'notice'
  subType: string
}

export interface RequestEvent extends BaseEvent {
  type: 'request'
  subType: string
}

/** 所有事件联合 */
export type Event = MessageEvent | NoticeEvent | RequestEvent

// ─── 适配器 API ───

export interface AdapterApi {
  /** 发送消息，返回消息 ID */
  sendMessage(contact: Contact, elements: Element[]): Promise<string>
  /** 撤回消息 */
  recallMessage(messageId: string): Promise<void>
}

// ─── Context ───

export interface Context {
  /** 原始事件 */
  event: Event
  /** 适配器 API */
  bot: AdapterApi
  /** 正则匹配结果 */
  match: RegExpExecArray | null
  /** 中间状态，pipe 间传递数据 */
  state: Record<string, unknown>
  /** 触发事件的用户 ID */
  readonly userId: string
  /** bot 自身 ID */
  readonly selfId: string
  /** 联系人信息 */
  readonly contact: Contact
  /** 快捷回复 */
  reply(content: string | Element[]): Promise<string>
}

// ─── Pipe ───

/** 管道函数，return false 表示丢弃事件 */
export type Pipe = (ctx: Context) => Awaitable<false | void>

// ─── DSL 注册条目 ───

export interface CommandEntry {
  name: string
  pattern: RegExp
  fn: (ctx: Context) => Awaitable<void>
  priority: number
  file: string
}

export interface AcceptEntry {
  event: string
  fn: (ctx: Context) => Awaitable<void>
  priority: number
  file: string
}

export interface HandlerEntry {
  key: string
  fn: (ctx: Context) => Awaitable<unknown>
  file: string
}

export interface TaskEntry {
  name: string
  cron: string
  fn: () => Awaitable<void>
  file: string
}

export interface ButtonEntry {
  key: string
  fn: (ctx: Context) => Awaitable<void>
  file: string
}

// ─── 插件实例（npm 插件 start/stop） ───

export interface PluginInstance {
  name: string
  start?(): Awaitable<void>
  stop?(): Awaitable<void>
}

// ─── 配置 ───

/** npm 插件声明：字符串 = 无配置，元组 = 带配置 */
export type PluginEntry =
  | string
  | [string, Record<string, unknown>]

export interface KarinConfig {
  server?: { port?: number; host?: string }
  logger?: { level?: string; daysToKeep?: number }
  permissions?: { master?: string[]; admin?: string[] }
  plugins?: PluginEntry[]
}
