import { Bot } from '@karinjs/bot'
import { config } from '@karinjs/config'
import { system } from '@karinjs/utils'
import { pluginCache } from '@karinjs/plugin'

import type { Config } from '@karinjs/config'
import type { CreateAccept } from '@karinjs/plugin'
import type { FriendNoticeEventMap } from '../../event/types'

/**
 * @description 好友通知事件分发类
 */
export class FriendNoticeDispatch<T extends FriendNoticeEventMap[keyof FriendNoticeEventMap] = FriendNoticeEventMap[keyof FriendNoticeEventMap]> {
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

    /** 发布事件 */
    Bot.emit('notice', this.ctx)
    Bot.emit(`notice.${this.ctx.subEvent}` as any, this.ctx)

    /** 初始化角色权限 */
    const userId = this.ctx.userId
    const boundUserId = `${this.ctx.selfId}@${this.ctx.userId}`
    const { master, admin } = this.config.cfg

    const isMaster = master.includes(boundUserId) || master.includes(userId)
    const isAdmin = isMaster || admin.includes(boundUserId) || admin.includes(userId)
    this.ctx.isMaster = isMaster
    this.ctx.isAdmin = isAdmin
    system.lock.prop(this.ctx, 'isMaster')
    system.lock.prop(this.ctx, 'isAdmin')

    this.print()

    return this.dispatch()
  }

  /**
   * 打印日志
   */
  private print () {
    const { log_enable_list: enable, log_disable_list: disable } = this.config.filter
    const message = `好友通知: [${this.ctx.subEvent}][${this.ctx.userId}] ${this.ctx.tips}`

    /** 有配置白名单 并且当前用户没在白名单中 */
    if (enable.friend.length > 0 && !enable.friend.includes(this.ctx.userId)) {
      return logger.bot('debug', this.ctx.selfId, message)
    }

    /** 有配置黑名单 并且当前用户在黑名单中 */
    if (disable.friend.length > 0 && disable.friend.includes(this.ctx.userId)) {
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
    const filterLog = `[dispatch][${this.ctx.logText}][${plugin.packageName}][${plugin.file.relPath}][${plugin.name}]`
    const event = plugin.options.event
    if (event !== 'notice' && event === `notice.${this.ctx.subEvent}`) {
      this.ctx.bot.logger('debug', `${filterLog} 插件事件不匹配: ${event}`)
      return nextFnc()
    }

    if (plugin.options.adapter.length > 0 && !plugin.options.adapter.includes(this.ctx.bot.adapter.protocol)) {
      this.ctx.bot.logger('debug', `${filterLog} 当前适配器协议: ${this.ctx.bot.adapter.protocol}, 白名单适配器协议: ${plugin.options.adapter.join(', ')}`)
      return nextFnc()
    }

    if (plugin.options.dsbAdapter.length > 0 && plugin.options.dsbAdapter.includes(this.ctx.bot.adapter.protocol)) {
      this.ctx.bot.logger('debug', `${filterLog} 当前适配器协议: ${this.ctx.bot.adapter.protocol}, 黑名单适配器协议: ${plugin.options.dsbAdapter.join(', ')}`)
      return nextFnc()
    }

    if (!this.filterPlugin(plugin, enable, disable)) {
      this.ctx.bot.logger('debug', `${filterLog} 当前插件被禁用或未在启用列表中`)
      return nextFnc()
    }

    this.ctx.logFnc = `[${plugin.packageName}][${plugin.options.name}]`

    /** 前缀 */
    const timeStart = Date.now()
    const prefix = `${logger.fnc(this.ctx.logFnc)}${this.ctx.logText}`

    this.ctx.bot.logger('mark', `${prefix} 开始处理`)
    await Promise.resolve(plugin.callback(this.ctx, nextFnc))
      .catch(async error => {
        nextFnc()
        logger.error(`${prefix} 插件执行出错: ${error.message}\n${error.stack}`)
      })
      .then(async () => {
        const time = logger.green(Date.now() - timeStart + 'ms')
        this.ctx.bot.logger('mark', `${prefix} 处理完成  耗时: ${time}`)
      })
  }

  /**
   * 过滤插件
   * @param plugin 插件实例
   * @param enable 启用列表
   * @param disable 禁用列表
   */
  private filterPlugin (
    plugin: CreateAccept,
    enable: string[],
    disable: string[]
  ) {
    const target = [
      plugin.packageName,
      `${plugin.packageName}:${plugin.file.relPath}`,
      `${plugin.packageName}:${plugin.file.relPath}:${plugin.name}`,
    ]

    if (enable.length > 0) {
      if (!target.some(t => enable.includes(t))) {
        return false
      }

      if (target.some(t => disable.includes(t))) {
        return false
      }
    }

    if (disable.length > 0) {
      if (target.some(t => disable.includes(t))) {
        return false
      }
    }

    return true
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
