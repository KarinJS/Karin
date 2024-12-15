import { karin } from '@/karin'
import type { Event } from '@/event'
import type { PluginTypes } from '@/event/handler/filterList/types'

/**
 * 事件分发
 * @param event 事件对象
 */
export const emit = (event: any) => {
  // // TODO: 总觉得没必要再进行分发一次 这里下个版本再去掉 先兼容旧版 2024年10月31日14:33:53
  // karin.emit(event.event, event)
  // const key = `${event.event}.${event.subEvent}` as any
  // karin.emit(key, event)
}

/**
 * 事件调用次数+1
 * @param plugin 插件对象
 * @param event 事件对象
 */
export const addEventCount = (plugin: PluginTypes, event: Event) => {
  karin.emit('karin:count:fnc', { name: plugin.info.name, file: plugin.file, event })
}

/**
 * 错误事件分发
 * @param error 错误对象
 */
export const emitError = (error: Error) => {
  karin.emit('error', error)
}
