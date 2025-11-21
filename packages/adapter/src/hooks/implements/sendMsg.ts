import { logger } from '@karinjs/logger'
import { HookManager } from '../core/manager'

import type {
  HookOptions,
  NormalMessageCallback,
  ForwardMessageCallback,
  AfterMessageCallback,
  AfterForwardMessageCallback,
} from '../types/message'
import type { Contact } from '../../event'
import type { SendForwardMessageResponse, SendMsgResults } from '../../adapter'
import type { ForwardOptions, NodeElement, SendElement } from '../../segment'

// 创建四个钩子管理器实例
const messageManager = new HookManager<NormalMessageCallback>('sendMsg.message')
const forwardManager = new HookManager<ForwardMessageCallback>('sendMsg.forward')
const afterMessageManager = new HookManager<AfterMessageCallback>('sendMsg.afterMessage')
const afterForwardManager = new HookManager<AfterForwardMessageCallback>('sendMsg.afterForward')

/** 发送消息钩子 */
export const sendMsg = {
  /**
   * 添加普通消息钩子 `也就是调用 bot.sendMsg 时触发 此时会先进入这个 hook 才会到 bot.sendMsg`
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  message: (callback: NormalMessageCallback, options: HookOptions = {}): number => {
    const id = messageManager.add(callback, options)
    logger.mark(`[hooks] 添加发送消息钩子: ${id}`)
    return id
  },

  /**
   * 添加转发消息钩子 `也就是调用 bot.sendForwardMsg 时触发 此时会先进入这个 hook 才会到 bot.sendForwardMsg`
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  forward: (callback: ForwardMessageCallback, options: HookOptions = {}): number => {
    const id = forwardManager.add(callback, options)
    logger.mark(`[hooks] 添加转发消息钩子: ${id}`)
    return id
  },

  /**
   * 添加普通消息发送后钩子 `也就是调用 bot.sendMsg 处理完成返回结果前触发 此时会先进入这个 hook 才会正常返回结果`
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  afterMessage: (callback: AfterMessageCallback, options: HookOptions = {}): number => {
    const id = afterMessageManager.add(callback, options)
    logger.mark(`[hooks] 添加发送消息后钩子: ${id}`)
    return id
  },

  /**
   * 添加转发消息发送后钩子 `也就是调用 bot.sendForwardMsg 处理完成返回结果前触发 此时会先进入这个 hook 才会正常返回结果`
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  afterForward: (callback: AfterForwardMessageCallback, options: HookOptions = {}): number => {
    const id = afterForwardManager.add(callback, options)
    logger.mark(`[hooks] 添加转发消息后钩子: ${id}`)
    return id
  },

  /**
   * 删除钩子
   * @param id 钩子ID
   */
  remove: (id: number): void => {
    logger.mark(`[hooks] 移除发送消息钩子: ${id}`)
    messageManager.remove(id)
    forwardManager.remove(id)
    afterMessageManager.remove(id)
    afterForwardManager.remove(id)
  },
}

/**
 * 内部钩子触发器（框架内部调用）
 * 重构后的清晰API，不再使用 hooksSendMsgEmit 的命名
 */
export class SendMsgHooks {
  /**
   * 触发普通消息钩子（前置钩子，可阻止发送）
   * @param contact 联系人
   * @param elements 消息元素
   * @param retryCount 重试次数
   * @returns 是否继续发送消息
   */
  static async beforeMessage (contact: Contact, elements: Array<SendElement>, retryCount: number = 0): Promise<boolean> {
    return await messageManager.emit(contact, elements, retryCount)
  }

  /**
   * 触发转发消息钩子（前置钩子，可阻止发送）
   * @param contact 联系人
   * @param elements 消息元素
   * @param options 转发选项
   * @returns 是否继续发送消息
   */
  static async beforeForward (contact: Contact, elements: Array<NodeElement>, options?: ForwardOptions): Promise<boolean> {
    return await forwardManager.emit(contact, elements, options)
  }

  /**
   * 触发普通消息发送后钩子（后置钩子，不影响发送）
   * @param contact 联系人
   * @param elements 消息元素
   * @param result 消息发送结果
   */
  static async afterMessage (contact: Contact, elements: Array<SendElement>, result: SendMsgResults): Promise<void> {
    // 后置钩子不需要 next 控制流，使用 emitAll 全部执行
    await afterMessageManager.emitAll(contact, elements, result)
  }

  /**
   * 触发转发消息发送后钩子（后置钩子，不影响发送）
   * @param contact 联系人
   * @param elements 消息元素
   * @param result 转发消息发送结果
   * @param options 转发选项
   */
  static async afterForward (contact: Contact, elements: Array<NodeElement>, result: SendForwardMessageResponse, options?: ForwardOptions): Promise<void> {
    // 后置钩子不需要 next 控制流，使用 emitAll 全部执行
    await afterForwardManager.emitAll(contact, elements, result, options)
  }
}
