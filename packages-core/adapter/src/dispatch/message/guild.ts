import { lru } from '../LRU'
import { config } from '@karinjs/config'
import { MessageDispatch } from './base'
import { pluginCache } from '@karinjs/plugin'
import { createRawMessage } from '../../event/abstract/raw'
import { MessageHooks, EventCallHooks, EmptyHooks } from '../../hooks'

import type { Config } from '@karinjs/config'
import type { GuildMessage } from '../../event/abstract/message'
import type { CreateCommand, CreateClassPlugin } from '@karinjs/plugin'

/**
 * @description 频道消息分发类
 */
export class GuildMessageDispatch extends MessageDispatch {
  /** 消息事件上下文 */
  private ctx: GuildMessage
  /** cd */
  private key: {
    userKey: string
    guildKey: string
  }

  /** 配置 */
  private config: {
    cfg: ReturnType<Config['config']>
    filter: ReturnType<typeof config.filter>
    guildConfig: ReturnType<typeof config.getGuildCfg>
  }

  /**
   * 带前缀的日志对象
   * @description `[dispatch][guild:967068507-777777-100001(karin)]`
   */
  private logger: ReturnType<typeof logger.prefix>

  constructor (ctx: GuildMessage) {
    super()
    this.ctx = ctx
    this.config = {
      cfg: config.config(),
      filter: config.filter(),
      guildConfig: config.getGuildCfg(ctx.guildId, ctx.channelId, ctx.selfId),
    }

    this.key = {
      userKey: `guild_id:${this.ctx.guildId}:${this.ctx.channelId}:${this.ctx.userId}`,
      guildKey: `guild_id:${this.ctx.guildId}:${this.ctx.channelId}`,
    }

    /** 初始化消息指令 */
    const { msg, raw } = createRawMessage(this.ctx.elements)
    this.ctx.msg = msg
    this.ctx.rawMessage = raw
    this.ctx.logText = `[${this.ctx.contact.scene}:${this.ctx.guildId}-${this.ctx.channelId}-${this.ctx.userId}(${this.ctx.sender.nick || ''})]`
    this.logger = logger.prefix(`[dispatch][${this.ctx.logText}]`)
  }

  async init () {
    /** 初始化角色权限 */
    const userId = this.ctx.userId
    const boundUserId = `${this.ctx.selfId}@${this.ctx.userId}`

    this.setMasterAndAdmin(this.ctx, this.config.cfg, boundUserId, userId)
    this.setAlias(this.ctx, this.config.guildConfig.alias)

    this.print()
    this.eventEmit(this.ctx)

    if (this.filterContext(this.ctx, this.logger)) return

    /** 频道成员黑白名单检查 */
    if (this.config.guildConfig.member_disable.includes(this.ctx.userId)) {
      this.logger.debug(`用户在频道黑名单中: ${this.ctx.eventId}`)
      return
    }

    const inWhitelist = this.config.guildConfig.member_enable.length === 0 ||
      this.config.guildConfig.member_enable.includes(this.ctx.userId)

    if (!inWhitelist) {
      this.logger.debug(`用户不在频道白名单中: ${this.ctx.eventId}`)
      return
    }

    const responseMode = this.checkResponseMode()
    if (!responseMode) {
      this.logger.debug(`消息不符合响应模式: ${this.ctx.eventId} 当前模式: ${this.getResponseModeDesc()}`)
      return
    }

    if (lru.has(this.key.userKey)) {
      this.logger.debug(`消息处于用户个人CD中: ${this.ctx.eventId}`)
      return
    }

    if (lru.has(this.key.guildKey)) {
      this.logger.debug(`消息处于频道全局CD中: ${this.ctx.eventId}`)
      return
    }

    return this.dispatch()
  }

  /**
   * 打印日志
   */
  private print () {
    const { log_enable_list: enable, log_disable_list: disable } = this.config.filter
    const message = `频道消息: [${this.ctx.guildId}-${this.ctx.channelId}-${this.ctx.userId}(${this.ctx.sender.nick || ''})] ${this.ctx.rawMessage}`

    /** 过滤频道 */
    if (this.filterGuild(this.ctx.guildId, enable.guild, disable.guild)) {
      return logger.bot('debug', this.ctx.selfId, message)
    }

    /** 过滤子频道 */
    if (this.filterChannel(this.ctx.channelId, enable.channel, disable.channel)) {
      return logger.bot('debug', this.ctx.selfId, message)
    }

    /** 过滤用户 */
    if (this.filterUser(this.ctx.userId, enable.friend, disable.friend)) {
      return logger.bot('debug', this.ctx.selfId, message)
    }

    logger.bot('info', this.ctx.selfId, message)
  }

  /**
   * 处理响应模式
   */
  private checkResponseMode () {
    switch (this.config.guildConfig.mode) {
      case 0: return true
      case 1: return this.ctx.isMaster
      case 2: return this.ctx.isAdmin || this.ctx.isMaster
      case 3: return this.ctx.atBot
      case 4: return this.ctx.alias.length > 0
      case 5: return this.ctx.atBot || this.ctx.alias.length > 0
      case 6: return this.ctx.isMaster ? true : this.ctx.atBot
      case 7: return (this.ctx.isAdmin || this.ctx.isMaster) ? true : this.ctx.atBot
      case 8: return this.ctx.isMaster ? true : this.ctx.alias.length > 0
      case 9: return (this.ctx.isAdmin || this.ctx.isMaster) ? true : this.ctx.alias.length > 0
      case 10: return this.ctx.isMaster ? true : (this.ctx.atBot || this.ctx.alias.length > 0)
      case 11: return (this.ctx.isAdmin || this.ctx.isMaster) ? true : (this.ctx.atBot || this.ctx.alias.length > 0)
      default: return false
    }
  }

  /**
   * 响应模式描述
   * @param mode 响应模式编号
   * @returns 描述信息
   */
  private getResponseModeDesc (): string {
    const botResponseModes: Record<number, string> = {
      0: '回应所有消息，无任何限制',
      1: '仅回应机器人主人的消息',
      2: '仅回应机器人管理员的消息（包括主人）',
      3: '仅回应包含 @机器人的消息',
      4: '仅回应包含机器人别名(alias)的消息',
      5: '回应 @机器人 的消息或包含机器人别名的消息',
      6: '非主人仅回应 @机器人 的消息，主人无限制',
      7: '非管理员仅回应 @机器人 的消息，管理员无限制（包括主人）',
      8: '非主人仅回应包含机器人别名的消息，主人无限制',
      9: '非管理员仅回应包含机器人别名的消息，管理员无限制（包括主人）',
      10: '非主人仅回应 @机器人 或别名消息，主人无限制',
      11: '非管理员仅回应 @机器人 或别名消息，管理员无限制（包括主人）',
    }

    return botResponseModes[this.config.guildConfig.mode] || '不存在该响应模式'
  }

  private async dispatch () {
    this.logger.debug(`[hooks] 开始触发消息钩子: ${this.ctx.eventId}`)

    // 触发全局消息钩子
    const continueAll = await MessageHooks.trigger(this.ctx)
    if (!continueAll) {
      this.logger.debug(`[hooks] 消息钩子中断处理: ${this.ctx.eventId}`)
      return
    }

    // 触发频道消息钩子
    const continueGuild = await MessageHooks.triggerGuild(this.ctx)
    if (!continueGuild) {
      this.logger.debug(`[hooks] 频道消息钩子中断处理: ${this.ctx.eventId}`)
      return
    }

    this.logger.debug(`[hooks] 消息钩子触发完成: ${this.ctx.eventId}`)

    let next = false
    const nextFnc = () => {
      next = true
    }

    const enable = [...new Set([...this.config.guildConfig.enable, ...this.config.filter.plugin.enable])]
    const disable = [...new Set([...this.config.guildConfig.disable, ...this.config.filter.plugin.disable])]
    /** 热点缓存 */
    const hot = await this.hotDispatch(this.ctx.msg, nextFnc)
    if (hot) {
      await this.executePlugin(hot, enable, disable, nextFnc)
      if (!next) return
    }

    for (const plugin of pluginCache.instances.normal) {
      if (!plugin.reg.test(this.ctx.msg)) {
        continue
      }

      next = false
      await this.executePlugin(plugin, enable, disable, nextFnc)
      if (!next) return
    }

    this.logger.debug(`频道消息未命中任何插件: ${this.ctx.eventId}`)

    // 触发空插件钩子
    this.logger.debug(`[hooks] 开始触发空插件钩子: ${this.ctx.eventId}`)
    await EmptyHooks.triggerMessage(this.ctx)
    this.logger.debug(`[hooks] 空插件钩子触发完成: ${this.ctx.eventId}`)
  }

  /**
   * 执行插件
   * @param plugin 插件实例
   * @param enable 启用列表
   * @param disable 禁用列表
   * @param nextFnc 下一个函数
   */
  private async executePlugin (
    plugin: CreateCommand | CreateClassPlugin,
    enable: string[],
    disable: string[],
    nextFnc: () => void
  ) {
    if (await this.filter(this.ctx, plugin, enable, disable, ['message', 'message.guild'])) {
      return
    }

    // 触发事件调用钩子
    this.logger.debug(`[hooks] 开始触发事件调用钩子: ${this.ctx.eventId} 插件: ${plugin.name}`)
    const continueCall = await EventCallHooks.triggerGuild(this.ctx, plugin)
    if (!continueCall) {
      this.logger.debug(`[hooks] 事件调用钩子中断插件执行: ${this.ctx.eventId} 插件: ${plugin.name}`)
      return nextFnc()
    }
    this.logger.debug(`[hooks] 事件调用钩子触发完成: ${this.ctx.eventId} 插件: ${plugin.name}`)

    return this.runCallback(this.ctx, plugin, nextFnc)
  }
}
