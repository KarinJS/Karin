/**
 * Event API - 事件系统
 * @module api/event
 *
 * 直接复用 @karinjs/events 的 emitter
 */

import { emitter, type EventEmitter, type SystemEventMap } from '@karinjs/events'

/**
 * Event API 类型
 * 使用 EventEmitter<SystemEventMap> 作为类型，避免私有属性导出问题
 */
export type EventAPI = EventEmitter<SystemEventMap>

/**
 * Event API
 * 直接导出 @karinjs/events 的 emitter
 */
export const event: EventAPI = emitter as EventAPI
