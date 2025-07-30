import { EventEmitter } from '@karinjs/events'

/**
 * 事件管理器
 */
export const emitter = new EventEmitter()

/**
 * 内部事件管理器
 */
export const internalEmitter = emitter.createEvent()
