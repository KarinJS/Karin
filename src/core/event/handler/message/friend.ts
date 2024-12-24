import * as filter from '@/event/handler/filterList'
import { cache } from '@/plugin/cache/cache'
import { config as cfg } from '@/utils'
import { createRawMessage } from '@/utils/message/message'
import { PermissionEnum } from '@/adapter/sender'
import { MiddlewareHandler } from '@/utils/message/middleware'
import { friendAndDirect } from '@/event/handler/message/fnc'
import type { FriendMessage } from '@/event/create/message/friend'
import type { ConfigType, FriendDirectFileCfg } from '@/utils/config/types'

/**
 * @description 好友消息处理器
 * @class FriendHandler
 */
export class FriendHandler {
  ctx!: boolean
  event: FriendMessage
  config: ConfigType
  eventCfg: FriendDirectFileCfg

  constructor (event: FriendMessage) {
    this.event = event
    this.config = cfg.config()
    this.eventCfg = cfg.getFriendCfg(this.event.userId, this.event.selfId)
  }

  async init () {
    const data = createRawMessage(this.event.elements)
    this.event.msg = data.msg
    this.event.rawMessage = data.raw

    filter.setEventRole(this.event)
    filter.alias(this.event, this.eventCfg.alias)
    filter.emit(this.event)
    this.print()
    this.ctx = filter.context(this.event)
    if (this.ctx) return this

    const pass = this.isLimitEvent()

    /** 先调用中间件 */
    const result = await MiddlewareHandler(cache.middleware.recvMsg, this.event, pass)
    if (result) return this

    pass && this.deal()

    return this
  }

  /**
   * 检查是否存在cd中
   * @returns `true` 表示通过 没有在CD中
   */
  get isCD (): boolean {
    const userKey = this.event.userId
    return filter.friendAndDirectCD(this.eventCfg, userKey)
  }

  /**
   * 打印好友消息日志
   * @returns 无返回值
   */
  print () {
    this.event.logText = `[friend:${this.event.userId}(${this.event.sender.nick || ''})]`
    logger.bot('info', this.event.selfId, `好友消息: [${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.rawMessage}`)
  }

  /**
   * 检查当前事件是否受到限制
   * @returns `true` 表示通过
   */
  isLimitEvent () {
    const tips = `[${this.event.userId}]`
    return filter.allFriendFilter(this.event, this.eventCfg, this.isCD, tips)
  }

  /**
   * 判断触发用户是否拥有权限
   * @param permission 权限
   * @returns `true` 表示拥有权限
   */
  permission (permission: `${PermissionEnum}`): boolean {
    if (!permission || permission === 'all') return true

    if (permission === 'master') {
      if (!this.event.isMaster) {
        this.event.reply('暂无权限，只有主人才能操作')
        return false
      }
      return true
    }

    if (permission === 'admin') {
      if (!this.event.isMaster && !this.event.isAdmin) {
        this.event.reply('暂无权限，只有管理员才能操作')
        return false
      }
      return true
    }

    return true
  }

  /**
   * 分发事件给插件处理
   * @returns 无返回值
   */
  async deal () {
    for (const plugin of cache.command) {
      if (plugin.event !== 'message' && plugin.event !== 'message.friend') continue
      /** 好友场景只有这三种权限 非这三种一律跳过 */
      if (plugin.perm !== 'all' && plugin.perm !== 'master' && plugin.perm !== 'admin') continue
      const result = await friendAndDirect(this, plugin)
      if (!result) return
    }

    /** 未找到匹配插件 */
    filter.log(`[${this.event.userId}] 未找到匹配到相应插件: ${this.event.messageId}`)
    MiddlewareHandler(cache.middleware.notFoundMsg, this.event)
  }
}
