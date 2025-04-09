import type {
  FriendMessage,
  GroupMessage,
  GuildMessage,
  DirectMessage,
  GroupTempMessage,
} from '@/event'
import type { Contact } from '@/types/event'
import type { cache as pluginCache } from '@/plugin/system/cache'
import type { Message, Notice, Request } from '@/types/event/event'
import type { Elements, ForwardOptions, NodeElement } from '@/types/segment'

export type UnionMessage = Message | FriendMessage | GroupMessage | GuildMessage | DirectMessage | GroupTempMessage

/** 调用后继续执行下一个钩子 如果没钩子则继续正常流程 */
export type HookNext = () => void

/** 通用钩子配置项 */
export interface HookOptions {
  /** 优先级，数字越小优先级越高 */
  priority?: number
}

/** 收到消息事件钩子回调函数 */
export type HookCallback<T extends UnionMessage> = (event: T, next: HookNext) => void | Promise<void>

/** 收到消息事件钩子项 */
export interface MessageHookItem<T extends UnionMessage> {
  /** 钩子ID */
  id: number
  /** 钩子优先级 */
  priority: number
  /** 钩子回调函数 */
  callback: HookCallback<T>
}

/**
 * 事件调用插件钩子回调函数
 * @param event 事件
 * @param plugin 插件对象
 * @param next 继续执行下一个钩子的函数
 */
export type EventCallCallback<T, P> = (event: T, plugin: P, next: HookNext) => void | Promise<void>

/** 事件调用插件钩子项 */
export interface EventCallHookItem<T, P> {
  /** 钩子ID */
  id: number
  /** 钩子优先级 */
  priority: number
  /** 钩子回调函数 */
  callback: EventCallCallback<T, P>
}

/**
 * 发送基础消息回调类型
 * @param contact 联系人
 * @param elements 消息元素
 * @param retryCount 重试次数
 * @param next 继续执行下一个钩子的函数
 */
export type BaseMessageCallback<T> = (contact: Contact, elements: Array<Elements>, retryCount: number, next: HookNext) => T | Promise<T>

/**
 * 接收普通消息发送回调类型 这个由开发者调用
 */
export type NormalMessageCallback = BaseMessageCallback<void>

/**
 * 消息钩子触发类型 这个由karin内部调用
 */
export type HookEmitMessage = BaseMessageCallback<boolean>

/**
 * 基础转发消息回调类型
 * @param contact 联系人
 * @param elements 消息元素
 * @param options 转发选项
 * @param next 继续执行下一个钩子的函数
 */
export type BaseForwardCallback<T> = (contact: Contact, elements: Array<NodeElement>, options: ForwardOptions | undefined, next: HookNext) => T | Promise<T>

/**
 * 接收转发消息回调类型 这个由开发者调用
 */
export type ForwardMessageCallback = BaseForwardCallback<void>

/**
 * 转发消息钩子触发类型 这个由karin内部调用
 */
export type HookEmitForward = BaseForwardCallback<boolean>

/** 发送消息钩子项 */
export interface SendMsgHookItem<T extends NormalMessageCallback | ForwardMessageCallback> {
  /** 钩子ID */
  id: number
  /** 钩子优先级 */
  priority: number
  /** 钩子回调函数 */
  callback: T
}

/** 缓存 */
export interface HookCache {
  /** 消息事件钩子 */
  message: {
    message: MessageHookItem<Message>[]
    friend: MessageHookItem<FriendMessage>[]
    group: MessageHookItem<GroupMessage>[]
    guild: MessageHookItem<GuildMessage>[]
    direct: MessageHookItem<DirectMessage>[]
    groupTemp: MessageHookItem<GroupTempMessage>[]
  },
  /** 发送消息事件钩子 */
  sendMsg: {
    /** 普通消息 */
    message: SendMsgHookItem<NormalMessageCallback>[]
    /** 转发消息 */
    forward: SendMsgHookItem<ForwardMessageCallback>[]
  },
  /** 未找到匹配插件钩子 */
  empty: {
    /** 消息 */
    message: MessageHookItem<Message>[]
    /** 通知 */
    notice: GeneralHookItem<Notice>[]
    /** 请求 */
    request: GeneralHookItem<Request>[]
  },
  /** 事件调用插件钩子 */
  eventCall: {
    /** 通用消息事件 */
    message: EventCallHookItem<Message, typeof pluginCache.command[number]>[]
    /** 群聊事件 */
    group: EventCallHookItem<GroupMessage, typeof pluginCache.command[number]>[]
    /** 频道事件 */
    guild: EventCallHookItem<GuildMessage, typeof pluginCache.command[number]>[]
    /** 群临时事件 */
    groupTemp: EventCallHookItem<GroupTempMessage, typeof pluginCache.command[number]>[]
    /** 好友事件 */
    friend: EventCallHookItem<FriendMessage, typeof pluginCache.command[number]>[]
    /** 私聊事件 */
    direct: EventCallHookItem<DirectMessage, typeof pluginCache.command[number]>[]
    /** 通知事件 */
    notice: EventCallHookItem<Notice, typeof pluginCache.accept[number]>[]
    /** 请求事件 */
    request: EventCallHookItem<Request, typeof pluginCache.accept[number]>[]
  }
}

/** 通用事件钩子回调函数 */
export type GeneralHookCallback<T> = (event: T, next: HookNext) => void | Promise<void>

/** 通用事件钩子项 */
export interface GeneralHookItem<T> {
  /** 钩子ID */
  id: number
  /** 钩子优先级 */
  priority: number
  /** 钩子回调函数 */
  callback: GeneralHookCallback<T>
}
