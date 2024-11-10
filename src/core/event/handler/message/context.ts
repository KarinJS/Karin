import type { Message } from '@/event/joint'

/** 上下文缓存 */
export const context = new Map<string, Message>()
