import { logger } from '@karinjs/logger'
import { HookManager } from '../core/manager'

import type {
  FriendMessage,
  GroupMessage,
  GuildMessage,
  DirectMessage,
  GroupTempMessage,
  Message,
} from '../../event'

import type { HookCallback, HookOptions } from '../types/message'

// 创建各类消息的钩子管理器实例
const allMessageManager = new HookManager<HookCallback<Message>>('message.all')
const friendMessageManager = new HookManager<HookCallback<FriendMessage>>('message.friend')
const groupMessageManager = new HookManager<HookCallback<GroupMessage>>('message.group')
const guildMessageManager = new HookManager<HookCallback<GuildMessage>>('message.guild')
const directMessageManager = new HookManager<HookCallback<DirectMessage>>('message.direct')
const groupTempMessageManager = new HookManager<HookCallback<GroupTempMessage>>('message.groupTemp')

/**
 * 消息hook
 */
export const message = Object.assign(
  /**
   * 添加消息钩子
   * @param callback 消息处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  (callback: HookCallback<Message>, options: HookOptions = {}): number => {
    const id = allMessageManager.add(callback, options)
    logger.mark(`[hooks] 添加全部消息钩子: ${id}`)
    return id
  },
  {
    /**
     * 添加好友消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    friend (callback: HookCallback<FriendMessage>, options: HookOptions = {}): number {
      const id = friendMessageManager.add(callback, options)
      logger.mark(`[hooks] 添加好友消息钩子: ${id}`)
      return id
    },

    /**
     * 添加群消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    group (callback: HookCallback<GroupMessage>, options: HookOptions = {}): number {
      const id = groupMessageManager.add(callback, options)
      logger.mark(`[hooks] 添加群消息钩子: ${id}`)
      return id
    },

    /**
     * 添加频道消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    guild (callback: HookCallback<GuildMessage>, options: HookOptions = {}): number {
      const id = guildMessageManager.add(callback, options)
      logger.mark(`[hooks] 添加频道消息钩子: ${id}`)
      return id
    },

    /**
     * 添加临时消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    direct (callback: HookCallback<DirectMessage>, options: HookOptions = {}): number {
      const id = directMessageManager.add(callback, options)
      logger.mark(`[hooks] 添加临时消息钩子: ${id}`)
      return id
    },

    /**
     * 添加群临时消息钩子
     * @param callback 消息处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    groupTemp (callback: HookCallback<GroupTempMessage>, options: HookOptions = {}): number {
      const id = groupTempMessageManager.add(callback, options)
      logger.mark(`[hooks] 添加群临时消息钩子: ${id}`)
      return id
    },

    /**
     * 删除钩子
     * @param id 钩子ID
     */
    remove (id: number): void {
      logger.mark(`[hooks] 移除消息钩子: ${id}`)
      allMessageManager.remove(id)
      friendMessageManager.remove(id)
      groupMessageManager.remove(id)
      guildMessageManager.remove(id)
      directMessageManager.remove(id)
      groupTempMessageManager.remove(id)
    },
  }
)

/**
 * 内部钩子触发器（框架内部调用）
 * 重构后的清晰API
 */
export class MessageHooks {
  /**
   * 触发全部消息钩子
   * @param event 消息事件
   * @returns 是否继续处理消息
   */
  static async trigger (event: Message): Promise<boolean> {
    return await allMessageManager.emit(event)
  }

  /**
   * 触发好友消息钩子
   * @param event 好友消息事件
   * @returns 是否继续处理消息
   */
  static async triggerFriend (event: FriendMessage): Promise<boolean> {
    return await friendMessageManager.emit(event)
  }

  /**
   * 触发群消息钩子
   * @param event 群消息事件
   * @returns 是否继续处理消息
   */
  static async triggerGroup (event: GroupMessage): Promise<boolean> {
    return await groupMessageManager.emit(event)
  }

  /**
   * 触发频道消息钩子
   * @param event 频道消息事件
   * @returns 是否继续处理消息
   */
  static async triggerGuild (event: GuildMessage): Promise<boolean> {
    return await guildMessageManager.emit(event)
  }

  /**
   * 触发私聊消息钩子
   * @param event 私聊消息事件
   * @returns 是否继续处理消息
   */
  static async triggerDirect (event: DirectMessage): Promise<boolean> {
    return await directMessageManager.emit(event)
  }

  /**
   * 触发群临时消息钩子
   * @param event 群临时消息事件
   * @returns 是否继续处理消息
   */
  static async triggerGroupTemp (event: GroupTempMessage): Promise<boolean> {
    return await groupTempMessageManager.emit(event)
  }
}
