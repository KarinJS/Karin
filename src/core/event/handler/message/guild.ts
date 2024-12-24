import { config as cfg } from '@/utils'
import { cache } from '@/plugin/cache/cache'
import * as filter from '@/event/handler/filterList'
import { PermissionEnum } from '@/adapter/sender'
import { createRawMessage } from '@/utils/message/message'
import { groupAndGuild } from '@/event/handler/message/fnc'
import { MiddlewareHandler } from '@/utils/message/middleware'
import type { GuildMessage } from '@/event/create/message/guild'
import type { ConfigType, GroupGuildFileCfg } from '@/utils/config/types'

/**
 * @description 频道消息处理器
 * @class GuildMessageHandler
 */
export class GuildMessageHandler {
  ctx!: boolean
  event: GuildMessage
  config: ConfigType
  eventCfg: GroupGuildFileCfg
  isPrint: boolean

  constructor (event: GuildMessage) {
    this.event = event
    this.config = cfg.config()
    this.eventCfg = cfg.getGuildCfg(this.event.guildId, this.event.channelId, this.event.selfId)
    this.isPrint = filter.disableViaChannelLogWhitelist(this.event) && filter.disableViaChannelLogBlacklist(this.event)
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
    const guildKey = `${this.event.guildId}.${this.event.channelId}`
    const userKey = `${guildKey}.${this.event.userId}`
    return filter.groupAndGuildCD(this.eventCfg, guildKey, userKey)
  }

  /**
   * 打印频道消息日志
   * @returns 无返回值
   */
  print () {
    this.event.logText = `[Guild:${this.event.guildId}-${this.event.channelId}-${this.event.userId}(${this.event.sender.nick || ''})]`
    const level = this.isPrint ? 'info' : 'debug'
    logger.bot(level, this.event.selfId, `频道消息：[${this.event.guildId}-${this.event.channelId}-${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.rawMessage}`)
  }

  /**
   * 检查当前事件是否受到限制
   * @returns `true` 表示通过
   */
  isLimitEvent () {
    const tips = `[${this.event.guildId}-${this.event.channelId}][${this.event.userId}]`
    return filter.allGuildFilter(this.event, this.eventCfg, this.isCD, tips)
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

    if (this.event.isGuild) {
      const list = {
        'guild.owner': {
          role: 'owner',
          name: '频道主',
        },
        'guild.admin': {
          role: 'admin',
          name: '频道超管',
        },
      } as const

      const role = list[permission as keyof typeof list]
      if (!role) return true
      if (role.role === 'owner' && this.event.sender?.role === 'owner') return true
      if (role.role === 'admin' && (this.event.sender?.role === 'owner' || this.event.sender?.role === 'admin')) return true

      this.event.reply(`暂无权限，只有${role.name}才能操作`)
      return false
    }

    return true
  }

  /**
   * 分发事件给插件处理
   * @returns 无返回值
   */
  async deal () {
    for (const plugin of cache.command) {
      if (plugin.event !== 'message' && plugin.event !== 'message.guild') continue
      if (plugin.perm === 'guild.admin' || plugin.perm === 'guild.owner') continue
      const result = await groupAndGuild(this, plugin)
      if (!result) return
    }

    /** 未找到匹配插件 */
    filter.log(`[${this.event.guildId}-${this.event.channelId}-${this.event.userId}] 未找到匹配到相应插件: ${this.event.eventId}`)
    MiddlewareHandler(cache.middleware.notFoundMsg, this.event)
  }
}
