import { karin } from '@/karin'
import { EVENT_COUNT, RECV_MSG } from '@/utils/data/key'
import type { Event } from '@/event'
import type { PluginTypes } from '@/event/handler/filterList/types'

/**
 * 事件分发
 * @param event 事件对象
 */
export const emit = (event: any) => {
  karin.emit(RECV_MSG, event.contact)
}

/**
 * 事件调用次数+1
 * @param plugin 插件对象
 * @param event 事件对象
 */
export const addEventCount = (plugin: PluginTypes, event: Event) => {
  karin.emit(EVENT_COUNT, { plugin, event })
}

/**
 * 错误事件分发
 * @param error 错误对象
 */
export const emitError = (error: Error) => {
  karin.emit('error', error)
}
