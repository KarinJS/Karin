import { listeners } from '@/core/internal'
import { Event, Message } from '@/types/event'

/** 上下文缓存 */
export const ctx = new Map<string, Event>()

/**
 * 处理事件上下文
 * @param event 事件对象
 */
export const context = (event: Message) => {
  const key = event.contact.subPeer
    ? `${event.contact.peer}:${event.contact.subPeer}:${event.userId}`
    : `${event.contact.peer}:${event.userId}`

  if (!ctx.has(key)) {
    return false
  }

  listeners.emit(`ctx:${key}`, event)
  ctx.delete(key)
  return true
}
