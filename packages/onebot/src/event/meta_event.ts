import { EventPostType } from './event'
import type { EventBase } from './event'

/**
 * 元事件类型枚举
 */
export enum MetaEventType {
  /** 生命周期 */
  Lifecycle = 'lifecycle',
  /** 心跳 */
  Heartbeat = 'heartbeat',
}

/**
 * 生命周期子类型枚举
 */
export enum LifecycleSubType {
  /** OneBot 启用 */
  Enable = 'enable',
  /** OneBot 停用 */
  Disable = 'disable',
  /** WebSocket 连接成功 */
  Connect = 'connect',
}

/**
 * 元事件基础接口
 */
export interface MetaEvent extends EventBase {
  /** 元事件 */
  post_type: EventPostType.MetaEvent
}

/**
 * 生命周期元事件
 */
export interface LifecycleMetaEvent extends MetaEvent {
  /** 元事件类型 */
  meta_event_type: MetaEventType.Lifecycle
  /** 事件子类型 */
  sub_type: LifecycleSubType
}

/**
 * 心跳元事件
 */
export interface HeartbeatMetaEvent extends MetaEvent {
  /** 元事件类型 */
  meta_event_type: MetaEventType.Heartbeat
  /** 状态信息 */
  status: Record<string, unknown>
  /** 到下次心跳的间隔，单位毫秒 */
  interval: number
}

/** OneBot 元事件类型 */
export type OneBotMetaEvent = LifecycleMetaEvent | HeartbeatMetaEvent
