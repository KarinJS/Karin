import { karin } from '@/karin'
import { context as ctx } from '@/event/handler/message/context'
import type { Message } from '@/event'

/**
 * 处理事件上下文
 * @param event 事件对象
 */
export const context = (e: Message) => {
  const key = e.contact.subPeer
    ? `${e.contact.peer}:${e.contact.subPeer}:${e.userId}`
    : `${e.contact.peer}:${e.userId}`

  if (!ctx.has(key)) {
    return false
  }

  karin.emit(`ctx:${key}`, e)
  ctx.delete(key)
  return true
}
