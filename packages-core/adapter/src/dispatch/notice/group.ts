import { NoticeDispatch } from './base'
import { config } from '@karinjs/config'
import { EventCallHooks } from '../../hooks'
import { pluginCache } from '@karinjs/plugin'

import type { Config } from '@karinjs/config'
import type { CreateAccept } from '@karinjs/plugin'
import type { GroupNoticeEventMap } from '../../event/types'

/**
 * @description 群通知事件分发类
 */
export class GroupNoticeDispatch<T extends GroupNoticeEventMap[keyof GroupNoticeEventMap] = GroupNoticeEventMap[keyof GroupNoticeEventMap]> extends NoticeDispatch {
  /** 通知事件上下文 */
  private ctx: T

  /** 配置 */
  private config: {
    cfg: ReturnType<Config['config']>
    filter: ReturnType<typeof config.filter>
    groupConfig: ReturnType<typeof config.getGroupCfg>
  }

  /**
   * 带前缀的日志对象
   * @description `[dispatch][notice][group:967068507]`
   */
  private logger: ReturnType<typeof logger.prefix>

  constructor (ctx: T) {
    super()
    this.ctx = ctx
    this.config = {
      cfg: config.config(),
      filter: config.filter(),
      groupConfig: config.getGroupCfg(ctx.groupId, ctx.selfId),
    }

    this.ctx.logText = `[notice][${this.ctx.subEvent}:${this.ctx.groupId}]`
    this.logger = logger.prefix(`[dispatch][${this.ctx.logText}]`)
  }

  async init () {
    /** 初始化 tips */
    this.initTips()
    this.eventEmit(this.ctx)

    /** 初始化角色权限 */
    const userId = this.ctx.userId
    const boundUserId = `${this.ctx.selfId}@${this.ctx.userId}`
    this.setMasterAndAdmin(this.ctx, this.config.cfg, boundUserId, userId)

    this.print()

    if (!this.config.groupConfig.enable) {
      this.logger.debug(`群通知功能未启用: ${this.ctx.eventId}`)
      return
    }

    return this.dispatch()
  }

  /**
   * 打印日志
   */
  private print () {
    const { log_enable_list: enable, log_disable_list: disable } = this.config.filter
    const message = `群通知: [${this.ctx.subEvent}][${this.ctx.groupId}-${this.ctx.userId}] ${this.ctx.tips}`

    /** 过滤群 */
    if (this.filterGroup(this.ctx.groupId, enable.group, disable.group)) {
      return logger.bot('debug', this.ctx.selfId, message)
    }

    /** 过滤用户 */
    if (this.filterUser(this.ctx.userId, enable.friend, disable.friend)) {
      return logger.bot('debug', this.ctx.selfId, message)
    }

    logger.bot('info', this.ctx.selfId, message)
  }

  private async dispatch () {
    let next = false
    const nextFnc = () => {
      next = true
    }

    const enable = [...new Set([...this.config.groupConfig.enable, ...this.config.filter.plugin.enable])]
    const disable = [...new Set([...this.config.groupConfig.disable, ...this.config.filter.plugin.disable])]

    for (const plugin of pluginCache.instances.accept) {
      next = false
      await this.executePlugin(plugin, enable, disable, nextFnc)
      if (!next) return
    }

    this.logger.debug(`群通知未命中任何插件: ${this.ctx.eventId}`)
  }

  /**
   * 执行插件
   * @param plugin 插件实例
   * @param enable 启用列表
   * @param disable 禁用列表
   * @param nextFnc 下一个函数
   */
  private async executePlugin (
    plugin: CreateAccept,
    enable: string[],
    disable: string[],
    nextFnc: () => void
  ) {
    if (await this.filter(this.ctx, plugin, enable, disable)) {
      return
    }

    // 触发事件调用钩子
    this.logger.debug(`[hooks] 开始触发事件调用钩子: ${this.ctx.eventId} 插件: ${plugin.name}`)
    const continueCall = await EventCallHooks.triggerNotice(this.ctx, plugin)
    if (!continueCall) {
      this.logger.debug(`[hooks] 事件调用钩子中断插件执行: ${this.ctx.eventId} 插件: ${plugin.name}`)
      return nextFnc()
    }
    this.logger.debug(`[hooks] 事件调用钩子触发完成: ${this.ctx.eventId} 插件: ${plugin.name}`)
    await this.runCallback(this.ctx, plugin, nextFnc)
  }

  /**
   * 初始化通知事件的 tips
   */
  private initTips () {
    this.ctx.tips = ((): string => {
      switch (this.ctx.subEvent) {
        case 'groupPoke':
          return `戳一戳: ${this.ctx.content.operatorId} ${this.ctx.content.action || '戳了戳'} ${this.ctx.content.targetId}`
        case 'groupMessageReaction':
          return `表情动态: 给消息 ${this.ctx.content.messageId} ${this.ctx.content.isSet ? '添加' : '取消'}了表情 ${this.ctx.content.faceId}`
        case 'groupRecall':
          return `撤回消息: ${this.ctx.content.messageId}`
        case 'groupFileUploaded':
          return `文件上传: [fid:${this.ctx.content.fid}] [name:${this.ctx.content.name}]`
        case 'groupMemberAdd':
          return `新增成员: [操作者:${this.ctx.content.operatorId}] [目标成员:${this.ctx.content.targetId}]`
        case 'groupMemberRemove':
          return `移除成员: [操作者:${this.ctx.content.operatorId}] [目标成员:${this.ctx.content.targetId}]`
        case 'groupCardChanged':
          return `名片变动: [操作者:${this.ctx.content.operatorId}] [目标成员:${this.ctx.content.targetId}]`
        case 'groupAdminChanged':
          return `管理员变动: ${this.ctx.content.targetId} 被${this.ctx.content.isAdmin ? '设置' : '取消'}管理员`
        case 'groupSignIn':
          return `签到: ${this.ctx.content.targetId}`
        case 'groupMemberTitleUpdate':
          return `头衔变动: ${this.ctx.content.title}`
        case 'groupHonorChange':
          return `荣誉变更: ${this.ctx.userId} 获得了 ${this.ctx.content.honorType} 荣誉`
        case 'groupLuckyKing':
          return `运气王: ${this.ctx.content.userId} 从 ${this.ctx.content.userId} 发的红包中获得了运气王`
        case 'groupHighlightsChange':
          return this.ctx.content.isSet
            ? `设置精华: ${this.ctx.content.operatorId} 将 ${this.ctx.content.messageId} 设置为精华消息`
            : `取消精华: ${this.ctx.content.operatorId} 将 ${this.ctx.content.messageId} 取消精华消息`
        case 'groupMemberBan':
          return this.ctx.content.isBan
            ? `禁言成员: ${this.ctx.content.operatorId} 将 ${this.ctx.content.targetId} 禁言 ${this.ctx.content.duration}秒`
            : `解除禁言: ${this.ctx.content.operatorId} 解除了 ${this.ctx.content.targetId} 的禁言`
        case 'groupWholeBan':
          return this.ctx.content.isBan
            ? `全员禁言: ${this.ctx.content.operatorId}`
            : `解除全员禁言: ${this.ctx.content.operatorId}`
        default:
          // @ts-ignore
          return `未知子事件: ${JSON.stringify(this.ctx.rawEvent)}`
      }
    })()
  }
}
