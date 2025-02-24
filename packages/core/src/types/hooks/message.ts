import type {
  FriendMessage,
  GroupMessage,
  GuildMessage,
  DirectMessage,
  GroupTempMessage
} from '@/event'
import type { Message } from '@/types/event/event'
import type { Contact } from '@/types/event'
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
 * 发送基础消息回调类型
 * @param contact 联系人
 * @param elements 消息元素
 * @param retryCount 重试次数
 */
export type BaseMessageCallback<T> = (contact: Contact, elements: Array<Elements>, retryCount?: number) => T | Promise<T>

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
 */
export type BaseForwardCallback<T> = (contact: Contact, elements: Array<NodeElement>, options?: ForwardOptions) => T | Promise<T>

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
  /** 未找到匹配插件消息钩子 */
  emptyMessage: MessageHookItem<Message>[]
}
