import { emitter } from '@karinjs/events'
import type { Event, Message } from '@karinjs/adapter'

/** 上下文缓存 */
export const contextMap = new Map<string, Event>()

/**
 * 检查当前事件是否存在上下文
 * @param event 事件对象
 */
export const checkContext = (event: Event): boolean => {
  const key = event.contact.subPeer
    ? `${event.contact.peer}:${event.contact.subPeer}:${event.userId}`
    : `${event.contact.peer}:${event.userId}`

  if (!contextMap.has(key)) {
    return false
  }

  emitter.emit(`ctx:${key}`, event)
  contextMap.delete(key)
  return true
}

/**
 * 上下文
 * @param e - 消息事件
 * @param options - 上下文选项
 * @returns 返回下文消息事件 如果超时则返回null
 */
export const ctx = async <T = Message> (e: Event, options?: {
  /** 指定用户id触发下文 不指定则使用默认e.user_id */
  userId?: string
  /** 超时时间 默认120秒 */
  time?: number
  /** 超时后是否回复 */
  reply?: boolean
  /** 超时回复文本 默认为'操作超时已取消' */
  replyMsg?: string
}): Promise<T> => {
  const time = options?.time || 120
  const userId = options?.userId || e.userId || e.user_id
  const key = e.contact.subPeer ? `${e.contact.peer}:${e.contact.subPeer}:${userId}` : `${e.contact.peer}:${userId}`
  contextMap.set(key, e)

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const data = contextMap.get(key)
      if (data?.eventId === e.eventId) {
        contextMap.delete(key)
        if (options?.reply) e.reply(options.replyMsg || '操作超时已取消')
        /** 移除监听器 */
        emitter.removeAllListeners(`ctx:${key}`)
        reject(new Error(`接收下文事件超时，已取消下文监听: ${key}`))
        return true
      }
    }, time * 1000)

    emitter.once(`ctx:${key}`, (e: Message) => {
      clearTimeout(timeout)
      resolve(e as T)
    })
  })
}
