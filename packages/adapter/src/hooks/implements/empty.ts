import { logger } from '@karinjs/logger'
import { HookManager } from '../core/manager'

import type { Message, Notice, Request as Requests } from '@karinjs/adapter'
import type { HookOptions, HookCallback, GeneralHookCallback } from '../types/message'

// 创建钩子管理器实例
const emptyMessageManager = new HookManager<HookCallback<Message>>('empty.message')
const emptyNoticeManager = new HookManager<GeneralHookCallback<Notice>>('empty.notice')
const emptyRequestManager = new HookManager<GeneralHookCallback<Requests>>('empty.request')

/**
 * 未找到匹配插件钩子
 */
export const empty = Object.assign(
  /**
   * 添加未找到匹配插件消息钩子
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  (callback: HookCallback<Message>, options: HookOptions = {}): number => {
    const id = emptyMessageManager.add(callback, options)
    logger.mark(`[hooks] 添加未找到匹配插件消息钩子: ${id}`)
    return id
  },
  {
    /**
     * 添加未找到匹配插件消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    message (callback: HookCallback<Message>, options: HookOptions = {}): number {
      const id = emptyMessageManager.add(callback, options)
      logger.mark(`[hooks] 添加未找到匹配插件消息钩子: ${id}`)
      return id
    },

    /**
     * 添加未找到匹配插件通知钩子
     * @param callback 通知处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    notice (callback: GeneralHookCallback<Notice>, options: HookOptions = {}): number {
      const id = emptyNoticeManager.add(callback, options)
      logger.mark(`[hooks] 添加未找到匹配插件通知钩子: ${id}`)
      return id
    },

    /**
     * 添加未找到匹配插件请求钩子
     * @param callback 请求处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    request (callback: GeneralHookCallback<Requests>, options: HookOptions = {}): number {
      const id = emptyRequestManager.add(callback, options)
      logger.mark(`[hooks] 添加未找到匹配插件请求钩子: ${id}`)
      return id
    },

    /**
     * 删除未找到匹配插件钩子
     * @param id 钩子ID
     */
    remove (id: number): void {
      logger.mark(`[hooks] 移除未找到匹配插件钩子: ${id}`)
      emptyMessageManager.remove(id)
      emptyNoticeManager.remove(id)
      emptyRequestManager.remove(id)
    },
  }
)

/**
 * 内部钩子触发器（框架内部调用）
 */
export class EmptyHooks {
  /**
   * 触发未找到匹配插件消息钩子
   * @param event 消息事件
   * @returns 是否继续处理
   */
  static async triggerMessage (event: Message): Promise<boolean> {
    return await emptyMessageManager.emit(event)
  }

  /**
   * 触发未找到匹配插件通知钩子
   * @param event 通知事件
   * @returns 是否继续处理
   */
  static async triggerNotice (event: Notice): Promise<boolean> {
    return await emptyNoticeManager.emit(event)
  }

  /**
   * 触发未找到匹配插件请求钩子
   * @param event 请求事件
   * @returns 是否继续处理
   */
  static async triggerRequest (event: Requests): Promise<boolean> {
    return await emptyRequestManager.emit(event)
  }
}
