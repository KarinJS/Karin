import { RequestDispatch } from './base'
import { config } from '@karinjs/config'
import { EventCallHooks } from '../../hooks'
import { store } from '@karinjs/plugin'

import type { Config } from '@karinjs/config'
import type { CreateAccept } from '@karinjs/plugin'
import type { GroupRequestEventMap } from '../../event/types'

/**
 * @description 群请求事件分发类
 */
export class GroupRequestDispatch<T extends GroupRequestEventMap[keyof GroupRequestEventMap] = GroupRequestEventMap[keyof GroupRequestEventMap]> extends RequestDispatch {
  /** 请求事件上下文 */
  private ctx: T

  /** 配置 */
  private config: {
    cfg: ReturnType<Config['config']>
    filter: ReturnType<typeof config.filter>
    groupConfig: ReturnType<typeof config.getGroupCfg>
  }

  /**
   * 带前缀的日志对象
   * @description `[dispatch][request][group:967068507]`
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

    this.ctx.logText = `[request][${this.ctx.subEvent}:${this.ctx.groupId}]`
    this.logger = logger.prefix(`[dispatch]${this.ctx.logText}`)
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
      this.logger.debug(`群请求功能未启用: ${this.ctx.eventId}`)
      return
    }

    return this.dispatch()
  }

  /**
   * 打印日志
   */
  private print () {
    const { log_enable_list: enable, log_disable_list: disable } = this.config.filter
    const message = `群请求: [${this.ctx.subEvent}][${this.ctx.groupId}] ${this.ctx.tips}`

    /** 过滤群 */
    if (this.filterGroup(this.ctx.groupId, enable.group, disable.group)) {
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

    for (const plugin of store.get('accept')) {
      next = false
      await this.executePlugin(plugin, enable, disable, nextFnc)
      if (!next) return
    }

    this.logger.debug(`群请求未命中任何插件: ${this.ctx.eventId}`)
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
    const continueCall = await EventCallHooks.triggerRequest(this.ctx, plugin)
    if (!continueCall) {
      this.logger.debug(`[hooks] 事件调用钩子中断插件执行: ${this.ctx.eventId} 插件: ${plugin.name}`)
      return nextFnc()
    }
    this.logger.debug(`[hooks] 事件调用钩子触发完成: ${this.ctx.eventId} 插件: ${plugin.name}`)
    await this.runCallback(this.ctx, plugin, nextFnc)
  }

  /**
   * 初始化请求事件的 tips
   */
  private initTips () {
    this.ctx.tips = ((): string => {
      switch (this.ctx.subEvent) {
        case 'groupInvite':
          return `群邀请: ${this.ctx.content.inviterId} 邀请Bot加入群 ${this.ctx.content.groupId}，flag: ${this.ctx.content.flag}`
        case 'groupApply':
          return `群申请: ${this.ctx.content.applierId} 申请加入群 ${this.ctx.content.groupId}，flag: ${this.ctx.content.flag} 验证信息: ${this.ctx.content.comment}`
        default:
          // @ts-ignore
          return `未知子事件: ${JSON.stringify(this.ctx.rawEvent)}`
      }
    })()
  }
}
