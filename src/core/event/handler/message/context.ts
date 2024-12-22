import type { Event } from '@/event/types'

/** 上下文缓存 */
export const context = new Map<string, Event>()
