import { logger } from '@karinjs/logger'
import { HookManager } from '../core/manager'

import type { HookOptions, EventCallCallback } from '../types/message'
import type { CreateAccept, CreateClassPlugin, CreateCommand } from '@karinjs/plugin'
import type { Message, Notice, Request as Requests, FriendMessage, GroupMessage, GuildMessage, GroupTempMessage, DirectMessage } from '../../event'

/** 消息事件调用钩子管理器 */
const eventCallMessageManager = new HookManager<EventCallCallback<Message, CreateCommand>>('eventCall.message')
/** 群聊事件调用钩子管理器 */
const eventCallGroupManager = new HookManager<EventCallCallback<GroupMessage, CreateCommand>>('eventCall.group')
/** 频道事件调用钩子管理器 */
const eventCallGuildManager = new HookManager<EventCallCallback<GuildMessage, CreateCommand>>('eventCall.guild')
/** 群临时事件调用钩子管理器 */
const eventCallGroupTempManager = new HookManager<EventCallCallback<GroupTempMessage, CreateCommand>>('eventCall.groupTemp')
/** 好友事件调用钩子管理器 */
const eventCallFriendManager = new HookManager<EventCallCallback<FriendMessage, CreateCommand>>('eventCall.friend')
/** 私聊事件调用钩子管理器 */
const eventCallDirectManager = new HookManager<EventCallCallback<DirectMessage, CreateCommand>>('eventCall.direct')
/** 通知事件调用钩子管理器 */
const eventCallNoticeManager = new HookManager<EventCallCallback<Notice, CreateAccept>>('eventCall.notice')
/** 请求事件调用钩子管理器 */
const eventCallRequestManager = new HookManager<EventCallCallback<Requests, CreateAccept>>('eventCall.request')

/**
 * 事件调用插件钩子
 */
export const eventCall = Object.assign(
  /**
   * 添加通用事件调用钩子
   * @param callback 事件处理回调函数
   * @param options 钩子配置项
   * @returns 钩子ID
   */
  (callback: EventCallCallback<Message, CreateCommand>, options: HookOptions = {}): number => {
    const id = eventCallMessageManager.add(callback, options)
    logger.mark(`[hooks] 添加通用事件调用钩子: ${id}`)
    return id
  },
  {
    /**
     * 添加群聊事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    group (callback: EventCallCallback<GroupMessage, CreateCommand>, options: HookOptions = {}): number {
      const id = eventCallGroupManager.add(callback, options)
      logger.mark(`[hooks] 添加群聊事件调用钩子: ${id}`)
      return id
    },

    /**
     * 添加频道事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    guild (callback: EventCallCallback<GuildMessage, CreateCommand>, options: HookOptions = {}): number {
      const id = eventCallGuildManager.add(callback, options)
      logger.mark(`[hooks] 添加频道事件调用钩子: ${id}`)
      return id
    },

    /**
     * 添加群临时事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    groupTemp (callback: EventCallCallback<GroupTempMessage, CreateCommand>, options: HookOptions = {}): number {
      const id = eventCallGroupTempManager.add(callback, options)
      logger.mark(`[hooks] 添加群临时事件调用钩子: ${id}`)
      return id
    },

    /**
     * 添加好友事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    friend (callback: EventCallCallback<FriendMessage, CreateCommand>, options: HookOptions = {}): number {
      const id = eventCallFriendManager.add(callback, options)
      logger.mark(`[hooks] 添加好友事件调用钩子: ${id}`)
      return id
    },

    /**
     * 添加私聊事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    direct (callback: EventCallCallback<DirectMessage, CreateCommand>, options: HookOptions = {}): number {
      const id = eventCallDirectManager.add(callback, options)
      logger.mark(`[hooks] 添加私聊事件调用钩子: ${id}`)
      return id
    },

    /**
     * 添加通知事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    notice (callback: EventCallCallback<Notice, CreateAccept>, options: HookOptions = {}): number {
      const id = eventCallNoticeManager.add(callback, options)
      logger.mark(`[hooks] 添加通知事件调用钩子: ${id}`)
      return id
    },

    /**
     * 添加请求事件调用钩子
     * @param callback 事件处理回调函数
     * @param options 钩子配置项
     * @returns 钩子ID
     */
    request (callback: EventCallCallback<Requests, CreateAccept>, options: HookOptions = {}): number {
      const id = eventCallRequestManager.add(callback, options)
      logger.mark(`[hooks] 添加请求事件调用钩子: ${id}`)
      return id
    },

    /**
     * 删除钩子
     * @param id 钩子ID
     */
    remove (id: number): void {
      logger.mark(`[hooks] 移除事件调用钩子: ${id}`)
      eventCallMessageManager.remove(id)
      eventCallGroupManager.remove(id)
      eventCallGuildManager.remove(id)
      eventCallGroupTempManager.remove(id)
      eventCallFriendManager.remove(id)
      eventCallDirectManager.remove(id)
      eventCallNoticeManager.remove(id)
      eventCallRequestManager.remove(id)
    },
  }
)

/**
 * 内部钩子触发器（框架内部调用）
 */
export class EventCallHooks {
  /**
   * 触发通用事件调用钩子
   * @param event 事件
   * @param plugin 插件对象
   * @returns 是否继续处理
   */
  static async triggerMessage (event: Message, plugin: CreateCommand | CreateClassPlugin): Promise<boolean> {
    return await eventCallMessageManager.emit(event, plugin)
  }

  /**
   * 触发群聊事件调用钩子
   * @param event 群聊事件
   * @param plugin 插件对象
   * @returns 是否继续处理
   */
  static async triggerGroup (event: GroupMessage, plugin: CreateCommand | CreateClassPlugin): Promise<boolean> {
    return await eventCallGroupManager.emit(event, plugin)
  }

  /**
   * 触发频道事件调用钩子
   * @param event 频道事件
   * @param plugin 插件对象
   * @returns 是否继续处理
   */
  static async triggerGuild (event: GuildMessage, plugin: CreateCommand | CreateClassPlugin): Promise<boolean> {
    return await eventCallGuildManager.emit(event, plugin)
  }

  /**
   * 触发群临时事件调用钩子
   * @param event 群临时事件
   * @param plugin 插件对象
   * @returns 是否继续处理
   */
  static async triggerGroupTemp (event: GroupTempMessage, plugin: CreateCommand | CreateClassPlugin): Promise<boolean> {
    return await eventCallGroupTempManager.emit(event, plugin)
  }

  /**
   * 触发好友事件调用钩子
   * @param event 好友事件
   * @param plugin 插件对象
   * @returns 是否继续处理
   */
  static async triggerFriend (event: FriendMessage, plugin: CreateCommand | CreateClassPlugin): Promise<boolean> {
    return await eventCallFriendManager.emit(event, plugin)
  }

  /**
   * 触发私聊事件调用钩子
   * @param event 私聊事件
   * @param plugin 插件对象
   * @returns 是否继续处理
   */
  static async triggerDirect (event: DirectMessage, plugin: CreateCommand | CreateClassPlugin): Promise<boolean> {
    return await eventCallDirectManager.emit(event, plugin)
  }

  /**
   * 触发通知事件调用钩子
   * @param event 通知事件
   * @param plugin 插件对象
   * @returns 是否继续处理
   */
  static async triggerNotice (event: Notice, plugin: CreateAccept): Promise<boolean> {
    return await eventCallNoticeManager.emit(event, plugin)
  }

  /**
   * 触发请求事件调用钩子
   * @param event 请求事件
   * @param plugin 插件对象
   * @returns 是否继续处理
   */
  static async triggerRequest (event: Requests, plugin: CreateAccept): Promise<boolean> {
    return await eventCallRequestManager.emit(event, plugin)
  }
}
