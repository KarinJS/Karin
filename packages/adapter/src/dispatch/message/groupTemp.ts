import { lru } from '../LRU'
import { Bot } from '@karinjs/bot'
import { config } from '@karinjs/config'
import { emitter } from '@karinjs/events'
import { RECV_MSG } from '@karinjs/envs'
import { MessageDispatch } from './base'
import { pluginCache } from '@karinjs/plugin'
import { createRawMessage } from '../../event/abstract/raw'
import { MessageHooks, EventCallHooks, EmptyHooks } from '../../hooks'

import type { Config } from '@karinjs/config'
import type { GroupTempMessage } from '../../event/abstract/message'
import type { CreateCommand, CreateClassPlugin } from '@karinjs/plugin'

/**
 * @description 群临时会话消息分发类
 * @description 群临时会话是从群里发起的临时私聊，具有以下特点：
 * - 场景性质：私聊性质，但关联着群
 * - contact结构：scene='groupTemp', peer=groupId, subPeer=userId
 * - 配置来源：使用群配置（通过groupId获取）
 * - 权限限制：仅支持 all/master/admin，不支持群角色权限
 * - 无@机器人：因为是私聊性质
 */
export class GroupTempMessageDispatch extends MessageDispatch {
  /** 消息事件上下文 */
  private ctx: GroupTempMessage
  /** cd */
  private key: {
    userKey: string
  }

  /** 配置 */
  private config: {
    cfg: ReturnType<Config['config']>
    filter: ReturnType<typeof config.filter>
    groupConfig: ReturnType<typeof config.getGroupCfg>
  }

  /**
   * 带前缀的日志对象
   * @description `[dispatch][groupTemp:967068507-100001(karin)]`
   */
  private logger: ReturnType<typeof logger.prefix>

  constructor (ctx: GroupTempMessage) {
    super()
    this.ctx = ctx
    this.config = {
      cfg: config.config(),
      filter: config.filter(),
      groupConfig: config.getGroupCfg(ctx.groupId, ctx.selfId),
    }

    this.key = {
      userKey: `group_temp:${this.ctx.groupId}:${this.ctx.userId}`,
    }

    /** 初始化消息指令 */
    const { msg, raw } = createRawMessage(this.ctx.elements)
    this.ctx.msg = msg
    this.ctx.rawMessage = raw
    this.ctx.logText = `[${this.ctx.contact.scene}:${this.ctx.groupId}-${this.ctx.userId}(${this.ctx.sender.nick || ''})]`
    this.logger = logger.prefix(`[dispatch][${this.ctx.logText}]`)
  }

  async init () {
    /** 初始化角色权限 */
    const userId = this.ctx.userId
    const boundUserId = `${this.ctx.selfId}@${this.ctx.userId}`

    this.setMasterAndAdmin(this.ctx, this.config.cfg, boundUserId, userId)
    this.setAlias(this.ctx, this.config.groupConfig.alias)

    this.print()

    // TODO: 待定，可能需要仅开发环境才进行事件发布
    Bot.emit('message', this.ctx)
    Bot.emit('message.groupTemp', this.ctx)

    /** 记录收到消息 */
    emitter.emit(RECV_MSG, this.ctx.contact)

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
    const message = `群临时消息: [${this.ctx.groupId}-${this.ctx.userId}(${this.ctx.sender.nick || ''})] ${this.ctx.rawMessage}`

    /** 有配置白名单 并且当前群没在白名单中 */
    if (enable.group.length > 0 && !enable.group.includes(this.ctx.groupId)) {
      return logger.bot('debug', this.ctx.selfId, message)
    }

    /** 有配置黑名单 并且当前群在黑名单中 */
    if (disable.group.length > 0 && disable.group.includes(this.ctx.groupId)) {
      return logger.bot('debug', this.ctx.selfId, message)
    }

    logger.bot('info', this.ctx.selfId, message)
  }

  /**
   * 处理响应模式
   * @description 群临时会话支持类似好友的响应模式，但不支持@机器人（因为是私聊性质）
   * 使用群配置的mode，但逻辑简化为私聊模式：
   * - 0: 回应所有消息
   * - 1: 仅回应主人
   * - 2: 仅回应管理员
   * - 3: 仅回应别名消息
   * - 4-5: 混合模式（权限+别名）
   */
  private checkResponseMode () {
    const mode = this.config.groupConfig.mode

    // 群临时会话不支持@机器人，将包含@的模式转换为对应的简化模式
    switch (mode) {
      case 0: return true
      case 1: return this.ctx.isMaster
      case 2: return this.ctx.isAdmin || this.ctx.isMaster
      case 3: // 原本是@机器人，群临时会话改为所有消息
      case 5: // 原本是@或别名，群临时会话改为所有消息
        return true
      case 4: return this.ctx.alias.length > 0
      case 6: // 原本是非主人需@，群临时会话改为主人模式
        return this.ctx.isMaster
      case 7: // 原本是非管理员需@，群临时会话改为管理员模式
        return this.ctx.isAdmin || this.ctx.isMaster
      case 8: return this.ctx.isMaster ? true : this.ctx.alias.length > 0
      case 9: return (this.ctx.isAdmin || this.ctx.isMaster) ? true : this.ctx.alias.length > 0
      case 10: // 原本是非主人需@或别名，群临时会话改为主人优先+别名
        return this.ctx.isMaster ? true : this.ctx.alias.length > 0
      case 11: // 原本是非管理员需@或别名，群临时会话改为管理员优先+别名
        return (this.ctx.isAdmin || this.ctx.isMaster) ? true : this.ctx.alias.length > 0
      default: return false
    }
  }

  /**
   * 响应模式描述
   * @returns 描述信息
   */
  private getResponseModeDesc (): string {
    const mode = this.config.groupConfig.mode
    const botResponseModes: Record<number, string> = {
      0: '回应所有消息',
      1: '仅回应机器人主人的消息',
      2: '仅回应机器人管理员的消息（包括主人）',
      3: '回应所有消息（群临时会话无@功能）',
      4: '仅回应包含机器人别名的消息',
      5: '回应所有消息（群临时会话无@功能）',
      6: '仅回应机器人主人的消息（群临时会话无@功能）',
      7: '仅回应机器人管理员的消息（群临时会话无@功能）',
      8: '非主人仅回应包含机器人别名的消息，主人无限制',
      9: '非管理员仅回应包含机器人别名的消息，管理员无限制（包括主人）',
      10: '非主人仅回应包含机器人别名的消息，主人无限制',
      11: '非管理员仅回应包含机器人别名的消息，管理员无限制（包括主人）',
    }

    return botResponseModes[mode] || '不存在该响应模式'
  }

  private async dispatch () {
    this.hooksLog.debug(`开始触发消息钩子: ${this.ctx.eventId}`)

    // 触发全局消息钩子
    const continueAll = await MessageHooks.trigger(this.ctx)
    if (!continueAll) {
      this.hooksLog.debug(`消息钩子中断处理: ${this.ctx.eventId}`)
      return
    }

    // 触发群临时消息钩子
    const continueGroupTemp = await MessageHooks.triggerGroupTemp(this.ctx)
    if (!continueGroupTemp) {
      this.hooksLog.debug(`群临时消息钩子中断处理: ${this.ctx.eventId}`)
      return
    }

    this.hooksLog.debug(`消息钩子触发完成: ${this.ctx.eventId}`)

    let next = false
    const nextFnc = () => {
      next = true
    }

    const enable = [...new Set([...this.config.groupConfig.enable, ...this.config.filter.plugin.enable])]
    const disable = [...new Set([...this.config.groupConfig.disable, ...this.config.filter.plugin.disable])]
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

    this.logger.debug(`群临时消息未命中任何插件: ${this.ctx.eventId}`)

    // 触发空插件钩子
    this.hooksLog.debug(`开始触发空插件钩子: ${this.ctx.eventId}`)
    await EmptyHooks.triggerMessage(this.ctx)
    this.hooksLog.debug(`空插件钩子触发完成: ${this.ctx.eventId}`)
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
    // 群临时会话只支持基础权限，不支持群角色权限
    const supportedPermissions = ['all', 'master', 'admin']
    if (!supportedPermissions.includes(plugin.options.permission)) {
      const filterLog = `[dispatch][${this.ctx.logText}][${plugin.packageName}][${plugin.file.relPath}][${plugin.name}]`
      this.ctx.bot.logger('debug', `${filterLog} 群临时会话不支持权限: ${plugin.options.permission}，仅支持: ${supportedPermissions.join(', ')}`)
      return
    }

    if (await this.filter(this.ctx, plugin, enable, disable, ['message', 'message.groupTemp'])) {
      return
    }

    // 触发事件调用钩子
    this.hooksLog.debug(`开始触发事件调用钩子: ${this.ctx.eventId} 插件: ${plugin.name}`)
    const continueCall = await EventCallHooks.triggerGroupTemp(this.ctx, plugin)
    if (!continueCall) {
      this.hooksLog.debug(`事件调用钩子中断插件执行: ${this.ctx.eventId} 插件: ${plugin.name}`)
      return nextFnc()
    }
    this.hooksLog.debug(`事件调用钩子触发完成: ${this.ctx.eventId} 插件: ${plugin.name}`)

    return this.runCallback(this.ctx, plugin, nextFnc)
  }
}
