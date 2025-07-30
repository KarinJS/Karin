import { emitter } from '@karinjs/core'
import type { Event } from '@karinjs/adapter'

/** 上下文缓存 */
const ctxCache = new Map<string, Event>()

/**
 * 处理事件上下文
 * @param event 事件对象
 */
export const handleContext = (event: Event) => {
  const key = event.contact.subPeer
    ? `${event.contact.peer}:${event.contact.subPeer}:${event.userId}`
    : `${event.contact.peer}:${event.userId}`

  if (!ctxCache.has(key)) {
    return false
  }

  emitter.emit(`ctx:${key}`, event)
  ctxCache.delete(key)
  return true
}

/**
 * 上下文
 * @param e - 消息事件
 * @param options - 上下文选项
 * @returns 返回下文消息事件 如果超时则返回null
 */
export const context = async <T = Event> (e: Event, options?: {
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
  ctxCache.set(key, e)

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const data = ctxCache.get(key)
      if (data?.eventId === e.eventId) {
        ctxCache.delete(key)
        if (options?.reply) e.reply(options.replyMsg || '操作超时已取消')
        /** 移除监听器 */
        emitter.removeAllListeners(`ctx:${key}`)
        reject(new Error(`接收下文事件超时，已取消下文监听: ${key}`))
        return true
      }
    }, time * 1000)

    emitter.once(`ctx:${key}`, (event: Event) => {
      clearTimeout(timeout)
      resolve(event as T)
    })
  })
}
