import type { HookCache } from '@/types/hooks'

/** 钩子计数器 */
export let hookId = 0

/**
 * 创建新的钩子ID
 */
export const createHookId = () => ++hookId

/**
 * 缓存
 */
export const cache: HookCache = {
  message: {
    message: [],
    friend: [],
    group: [],
    guild: [],
    direct: [],
    groupTemp: [],
  },
  sendMsg: {
    message: [],
    forward: [],
  },
  empty: {
    message: [],
    notice: [],
    request: [],
  },
  eventCall: {
    message: [],
    group: [],
    guild: [],
    groupTemp: [],
    friend: [],
    direct: [],
    notice: [],
    request: [],
  },
}
