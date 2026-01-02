import { lru } from '../LRU'
import { config } from '@karinjs/config'
import { MessageDispatch } from './base'
import { store } from '@karinjs/plugin'
import { createRawMessage } from '../../event/abstract/raw'
import { MessageHooks, EventCallHooks, EmptyHooks } from '../../hooks'

import type { Config } from '@karinjs/config'
import type { DirectMessage } from '../../event/abstract/message'
import type { CreateCommand } from '@karinjs/plugin'

/**
 * @description 频道私信消息分发类
 */
export class DirectMessageDispatch extends MessageDispatch {
  /** 消息事件上下文 */
  private ctx: DirectMessage
  /** cd */
  private key: {
    userKey: string
  }

  /** 配置 */
  private config: {
    cfg: ReturnType<Config['config']>
    filter: ReturnType<typeof config.filter>
    directConfig: ReturnType<typeof config.getDirectCfg>
  }

  /**
   * 带前缀的日志对象
   * @description `[dispatch][direct:100001(karin)]`
   */
  private logger: ReturnType<typeof logger.prefix>

  constructor (ctx: DirectMessage) {
    super()
    this.ctx = ctx
    this.config = {
      cfg: config.config(),
      filter: config.filter(),
      directConfig: config.getDirectCfg(ctx.userId, ctx.selfId, ctx.srcGuildId),
    }

    this.key = {
      userKey: `direct_id:${this.ctx.userId}`,
    }

    /** 初始化消息指令 */
    const { msg, raw } = createRawMessage(this.ctx.elements)
    this.ctx.msg = msg
    this.ctx.rawMessage = raw
    this.ctx.logText = `[${this.ctx.contact.scene}:${this.ctx.userId}(${this.ctx.sender.nick || ''})]`
    this.logger = logger.prefix(`[dispatch]${this.ctx.logText}`)
  }

  async init () {
    /** 初始化角色权限 */
    const userId = this.ctx.userId
    const boundUserId = `${this.ctx.selfId}@${this.ctx.userId}`

    this.setMasterAndAdmin(this.ctx, this.config.cfg, boundUserId, userId)
    this.setAlias(this.ctx, this.config.directConfig.alias)

    this.print()
    this.eventEmit(this.ctx)

    if (this.filterContext(this.ctx, this.logger)) return

    const responseMode = this.checkResponseMode()
    if (!responseMode) {
      this.logger.debug(`消息不符合响应模式: ${this.ctx.eventId} 当前模式: ${this.getResponseModeDesc()}`)
      return
    }

    if (lru.has(this.key.userKey)) {
      this.logger.debug(`消息处于用户个人CD中: ${this.ctx.eventId}`)
      return
    }

    return this.dispatch()
  }

  /**
   * 打印日志
   */
  private print () {
    const { log_enable_list: enable, log_disable_list: disable } = this.config.filter
    const message = `频道私信消息: [${this.ctx.userId}(${this.ctx.sender.nick || ''})] ${this.ctx.rawMessage}`

    /** 过滤用户 */
    if (this.filterUser(this.ctx.userId, enable.direct, disable.direct)) {
      return logger.bot('debug', this.ctx.selfId, message)
    }

    logger.bot('info', this.ctx.selfId, message)
  }

  /**
   * 处理响应模式
   */
  private checkResponseMode () {
    switch (this.config.directConfig.mode) {
      case 0: return true
      case 1: return this.ctx.isMaster
      case 2: return this.ctx.isAdmin || this.ctx.isMaster
      case 3: return this.ctx.alias.length > 0
      case 4: return this.ctx.isMaster ? true : this.ctx.alias.length > 0
      case 5: return (this.ctx.isAdmin || this.ctx.isMaster) ? true : this.ctx.alias.length > 0
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
      0: '回应所有消息',
      1: '仅回应机器人主人的消息',
      2: '仅回应机器人管理员的消息（包括主人）',
      3: '仅回应包含机器人别名(alias)的消息',
      4: '非主人仅回应包含机器人别名的消息，主人无限制',
      5: '非管理员仅回应包含机器人别名的消息，管理员无限制（包括主人）',
    }

    return botResponseModes[this.config.directConfig.mode] || '不存在该响应模式'
  }

  private async dispatch () {
    this.logger.debug(`[hooks] 开始触发消息钩子: ${this.ctx.eventId}`)

    // 触发全局消息钩子
    const continueAll = await MessageHooks.trigger(this.ctx)
    if (!continueAll) {
      this.logger.debug(`[hooks] 消息钩子中断处理: ${this.ctx.eventId}`)
      return
    }

    // 触发私聊消息钩子
    const continueDirect = await MessageHooks.triggerDirect(this.ctx)
    if (!continueDirect) {
      this.logger.debug(`[hooks] 私聊消息钩子中断处理: ${this.ctx.eventId}`)
      return
    }

    this.logger.debug(`[hooks] 消息钩子触发完成: ${this.ctx.eventId}`)

    let next = false
    const nextFnc = () => {
      next = true
    }

    const enable = [...new Set([...this.config.directConfig.enable, ...this.config.filter.plugin.enable])]
    const disable = [...new Set([...this.config.directConfig.disable, ...this.config.filter.plugin.disable])]

    /** 热点缓存 */
    const hot = await this.hotDispatch(this.ctx.msg, nextFnc)
    hot && await this.executePlugin(hot, enable, disable, nextFnc)
    if (!next) return

    for (const plugin of store.get('command')) {
      if (!plugin.reg.test(this.ctx.msg)) {
        continue
      }

      next = false
      await this.executePlugin(plugin, enable, disable, nextFnc)
      if (!next) return
    }

    this.logger.debug(`频道私信消息未命中任何插件: ${this.ctx.eventId}`)

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
    plugin: CreateCommand,
    enable: string[],
    disable: string[],
    nextFnc: () => void
  ) {
    if (await this.filter(this.ctx, plugin, enable, disable, ['message', 'message.direct'])) {
      return
    }

    // 触发事件调用钩子
    this.logger.debug(`[hooks] 开始触发事件调用钩子: ${this.ctx.eventId} 插件: ${plugin.name}`)
    const continueCall = await EventCallHooks.triggerDirect(this.ctx, plugin)
    if (!continueCall) {
      this.logger.debug(`[hooks] 事件调用钩子中断插件执行: ${this.ctx.eventId} 插件: ${plugin.name}`)
      return nextFnc()
    }
    this.logger.debug(`[hooks] 事件调用钩子触发完成: ${this.ctx.eventId} 插件: ${plugin.name}`)

    return this.runCallback(this.ctx, plugin, nextFnc)
  }
}
