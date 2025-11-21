import { NoticeDispatch } from './base'
import { config } from '@karinjs/config'
import { EventCallHooks } from '../../hooks'
import { pluginCache } from '@karinjs/plugin'

import type { Config } from '@karinjs/config'
import type { Notice } from '../../event/types'
import type { CreateAccept } from '@karinjs/plugin'

/**
 * @description 好友通知事件分发类
 */
export class FriendNoticeDispatch<T extends Notice = Notice> extends NoticeDispatch {
  /** 通知事件上下文 */
  private ctx: T

  /** 配置 */
  private config: {
    cfg: ReturnType<Config['config']>
    filter: ReturnType<typeof config.filter>
    friendConfig: ReturnType<typeof config.getFriendCfg>
  }

  /**
   * 带前缀的日志对象
   * @description `[dispatch][notice][friend:100001]`
   */
  private logger: ReturnType<typeof logger.prefix>

  constructor (ctx: T) {
    super()
    this.ctx = ctx
    this.config = {
      cfg: config.config(),
      filter: config.filter(),
      friendConfig: config.getFriendCfg(ctx.userId, ctx.selfId),
    }

    this.ctx.logText = `[notice][${this.ctx.subEvent}:${this.ctx.userId}]`
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

    return this.dispatch()
  }

  /**
   * 打印日志
   */
  private print () {
    const { log_enable_list: enable, log_disable_list: disable } = this.config.filter
    const message = `好友通知: [${this.ctx.subEvent}][${this.ctx.userId}] ${this.ctx.tips}`

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

    const enable = [...new Set([...this.config.friendConfig.enable, ...this.config.filter.plugin.enable])]
    const disable = [...new Set([...this.config.friendConfig.disable, ...this.config.filter.plugin.disable])]

    for (const plugin of pluginCache.instances.accept) {
      next = false
      await this.executePlugin(plugin, enable, disable, nextFnc)
      if (!next) return
    }

    this.logger.debug(`好友通知未命中任何插件: ${this.ctx.eventId}`)
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
        case 'friendPoke':
          return `戳一戳: ${this.ctx.content.operatorId} ${this.ctx.content.action || '戳了戳'} ${this.ctx.content.targetId}`
        case 'receiveLike':
          return `收到点赞: ${this.ctx.content.count}`
        case 'friendRecall':
          return `撤回消息: ${this.ctx.content.messageId}`
        case 'privateFileUploaded':
          return `文件上传: [fid:${this.ctx.content.fid}] [name:${this.ctx.content.name}]`
        case 'friendIncrease':
          return `新增好友: ${this.ctx.content.targetId}`
        case 'friendDecrease':
          return `好友减少: ${this.ctx.content.targetId}`
        default:
          // @ts-ignore
          return `未知子事件: ${JSON.stringify(this.ctx.rawEvent)}`
      }
    })()
  }
}
