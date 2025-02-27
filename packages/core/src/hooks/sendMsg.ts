import lodash from 'lodash'
import { isPromise } from 'util/types'
import { cache, createHookId } from './cache'

import type {
  HookOptions,
  NormalMessageCallback,
  ForwardMessageCallback,
  SendMsgHookItem,
} from '@/types/hooks/message'
import type { Contact, Elements, ForwardOptions, NodeElement } from '@/types'

const addHook = <T extends NormalMessageCallback | ForwardMessageCallback> (
  list: SendMsgHookItem<T>[],
  callback: T,
  options: HookOptions = {}
) => {
  const id = createHookId()
  list.push({
    id,
    priority: options.priority ?? 10000,
    callback
  })
  return { id, list: lodash.orderBy(list, ['priority'], ['asc']) }
}

/** 发送消息钩子 */
export const sendMsg = {
  /**
   * 添加普通消息钩子
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  message: (callback: NormalMessageCallback, options: HookOptions = {}) => {
    const { id, list } = addHook(cache.sendMsg.message, callback, options)
    logger.mark(`[hooks] 添加发送消息钩子: ${id}`)
    cache.sendMsg.message = list
    return id
  },
  /**
   * 添加转发消息钩子
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  forward: (callback: ForwardMessageCallback, options: HookOptions = {}) => {
    const { id, list } = addHook(cache.sendMsg.forward, callback, options)
    logger.mark(`[hooks] 添加发送消息钩子: ${id}`)
    cache.sendMsg.forward = list
    return id
  },
  /**
   * 删除钩子
   * @param id 钩子ID
   */
  remove: (id: number) => {
    logger.mark(`[hooks] 移除发送消息钩子: ${id}`)
    cache.sendMsg.message = cache.sendMsg.message.filter(item => item.id !== id)
    cache.sendMsg.forward = cache.sendMsg.forward.filter(item => item.id !== id)
  }
}

/**
 * 通用的钩子触发处理函数
 * @param hooks 钩子列表
 * @param callback 回调函数
 * @returns 是否继续正常流程
 */
const emitHooks = async <T extends NormalMessageCallback | ForwardMessageCallback> (
  hooks: SendMsgHookItem<T>[],
  callback: (hook: SendMsgHookItem<T>, next: () => void) => void | Promise<void>
): Promise<boolean> => {
  let shouldContinue = false

  for (const hook of hooks) {
    const next = () => {
      shouldContinue = true
    }

    const result = callback(hook, next)
    if (isPromise(result)) await result

    if (!shouldContinue) return false
    shouldContinue = false // 重置状态，等待下一个钩子的next调用
  }

  return true // 如果所有钩子都执行完毕，返回true继续正常流程
}

/**
 * 发送消息钩子触发器
 */
export const hooksSendMsgEmit = {
  /**
   * 触发普通消息钩子
   * @param contact 联系人
   * @param elements 消息元素
   * @param retryCount 重试次数
   * @returns 是否继续正常流程
   */
  message: async (contact: Contact, elements: Array<Elements>, retryCount: number = 0) => {
    return emitHooks<NormalMessageCallback>(
      cache.sendMsg.message,
      (hook, next) => hook.callback(contact, elements, retryCount, next)
    )
  },
  /**
   * 触发转发消息钩子
   * @param contact 联系人
   * @param elements 消息元素
   * @param options 转发选项
   * @returns 是否继续正常流程
   */
  forward: async (contact: Contact, elements: Array<NodeElement>, options?: ForwardOptions) => {
    return emitHooks<ForwardMessageCallback>(
      cache.sendMsg.forward,
      (hook, next) => hook.callback(contact, elements, options, next)
    )
  }
}
