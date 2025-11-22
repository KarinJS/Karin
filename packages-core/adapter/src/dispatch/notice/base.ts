import { Bot } from '@karinjs/bot'
import { system } from '@karinjs/utils'
import { handleContext } from '../../event'
import { pluginCache } from '@karinjs/plugin'

import type { Config } from '@karinjs/config'
import type { Notice } from '../../event'
import type { CreateAccept } from '@karinjs/plugin'

export class NoticeDispatch {
  /**
   * @description 事件触发
   */
  eventEmit (ctx: Notice) {
    Bot.emit('notice', ctx)
    // @ts-ignore
    Bot.emit(`notice.${ctx.subEvent}`, ctx)
    ctx.bot.account.events.received.total++
    ctx.bot.account.events.received.notice++
  }

  /**
   * @description 热更新指令分发
   * @param next 是否继续执行后续插件
   * @return 是否命中热更新指令
   */
  async hotDispatch (
    msg: string,
    nextFnc: () => void
  ) {
    const hot = pluginCache.instances.command.hot[msg]
    if (!hot) {
      nextFnc()
      return null
    }
    return hot
  }

  /**
   * 过滤插件
   * @param plugin 插件实例
   * @param enable 启用列表
   * @param disable 禁用列表
   */
  filterPlugin (
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
   * 过滤消息插件
   * @param ctx 消息事件上下文
   * @param plugin 插件实例
   * @param enable 启用列表
   * @param disable 禁用列表
   */
  async filter (
    ctx: Notice,
    plugin: CreateAccept,
    enable: string[],
    disable: string[]
  ): Promise<boolean> {
    const filterLog = `[dispatch][${ctx.logText}][${plugin.packageName}][${plugin.file.relPath}][${plugin.name}]`
    const event = plugin.options.event
    if (event !== 'notice' && event === `notice.${ctx.subEvent}`) {
      ctx.bot.logger('debug', `${filterLog} 插件事件不匹配: ${event}`)
      return true
    }

    if (plugin.options.adapter.length > 0 && !plugin.options.adapter.includes(ctx.bot.adapter.protocol)) {
      ctx.bot.logger('debug', `${filterLog} 当前适配器协议: ${ctx.bot.adapter.protocol}, 白名单适配器协议: ${plugin.options.adapter.join(', ')}`)
      return true
    }

    if (plugin.options.dsbAdapter.length > 0 && plugin.options.dsbAdapter.includes(ctx.bot.adapter.protocol)) {
      ctx.bot.logger('debug', `${filterLog} 当前适配器协议: ${ctx.bot.adapter.protocol}, 黑名单适配器协议: ${plugin.options.dsbAdapter.join(', ')}`)
      return true
    }

    if (!this.filterPlugin(plugin, enable, disable)) {
      ctx.bot.logger('debug', `${filterLog} 当前插件被禁用或未在启用列表中`)
      return true
    }

    ctx.logFnc = `[${plugin.packageName}][${plugin.options.name}]`
    return false
  }

  /**
   * 运行插件回调
   * @param ctx 消息事件上下文
   * @param plugin 插件实例
   * @param nextFnc 下一个函数
   */
  async runCallback (
    ctx: Notice,
    plugin: CreateAccept,
    nextFnc: () => void
  ) {
    /** 前缀 */
    const timeStart = Date.now()
    const prefix = `${logger.fnc(ctx.logFnc)}${ctx.logText}`
    Bot.emit('plugin.call', {
      pluginName: plugin.packageName,
      file: plugin.file.absPath,
      functionName: plugin.name,
    })

    ctx.bot.logger('mark', `${prefix} 开始处理`)
    await Promise.resolve(plugin.callback(ctx, nextFnc))
      .catch(async error => {
        nextFnc()
        logger.error(`${prefix} 插件执行出错: ${error.message}\n${error.stack}`)
      })
      .then(async () => {
        const time = logger.green(Date.now() - timeStart + 'ms')
        ctx.bot.logger('mark', `${prefix} 处理完成  耗时: ${time}`)
      })
  }

  /**
   * 初始化主人和管理员标记
   * @param ctx 消息事件上下文
   * @param cfg 配置对象
   * @param boundUserId 绑定用户ID
   * @param userId 消息发送者用户ID
   */
  setMasterAndAdmin (
    ctx: Notice,
    cfg: ReturnType<Config['config']>,
    boundUserId: string,
    userId: string
  ) {
    const { master, admin } = cfg
    const isMaster = master.includes(boundUserId) || master.includes(userId)
    const isAdmin = isMaster || admin.includes(boundUserId) || admin.includes(userId)
    ctx.isMaster = isMaster
    ctx.isAdmin = isAdmin
    system.lock.prop(ctx, 'isMaster')
    system.lock.prop(ctx, 'isAdmin')
  }

  /**
   * 过滤上下文
   * @param ctx 消息事件上下文
   * @param log 日志前缀
   */
  filterContext (
    ctx: Notice,
    log: ReturnType<typeof logger.prefix>
  ) {
    /** 处理上下文 */
    const context = handleContext(ctx)
    if (context) {
      log.debug(`消息被上下文捕获: ${ctx.eventId}`)
      return true
    }
    return false
  }

  /**
   * 过滤群白名单和黑名单
   * @param groupId 群ID
   * @param enable 启用列表
   * @param disable 禁用列表
   * @returns true表示被过滤（不应处理），false表示通过过滤（应该处理）
   */
  filterGroup (
    groupId: string,
    enable: string[],
    disable: string[]
  ): boolean {
    /** 有配置白名单 并且当前群没在白名单中 */
    if (enable.length > 0 && !enable.includes(groupId)) {
      return true
    }

    /** 有配置黑名单 并且当前群在黑名单中 */
    if (disable.length > 0 && disable.includes(groupId)) {
      return true
    }

    return false
  }

  /**
   * 过滤用户白名单和黑名单
   * @param userId 用户ID
   * @param enable 启用列表
   * @param disable 禁用列表
   * @returns true表示被过滤（不应处理），false表示通过过滤（应该处理）
   */
  filterUser (
    userId: string,
    enable: string[],
    disable: string[]
  ): boolean {
    /** 有配置白名单 并且当前用户没在白名单中 */
    if (enable.length > 0 && !enable.includes(userId)) {
      return true
    }

    /** 有配置黑名单 并且当前用户在黑名单中 */
    if (disable.length > 0 && disable.includes(userId)) {
      return true
    }

    return false
  }

  /**
   * 过滤频道白名单和黑名单
   * @param guildId 频道ID
   * @param enable 启用列表
   * @param disable 禁用列表
   * @returns true表示被过滤（不应处理），false表示通过过滤（应该处理）
   */
  filterGuild (
    guildId: string,
    enable: string[],
    disable: string[]
  ): boolean {
    /** 有配置白名单 并且当前频道没在白名单中 */
    if (enable.length > 0 && !enable.includes(guildId)) {
      return true
    }

    /** 有配置黑名单 并且当前频道在黑名单中 */
    if (disable.length > 0 && disable.includes(guildId)) {
      return true
    }

    return false
  }

  /**
   * 过滤子频道白名单和黑名单
   * @param channelId 子频道ID
   * @param enable 启用列表
   * @param disable 禁用列表
   * @returns true表示被过滤（不应处理），false表示通过过滤（应该处理）
   */
  filterChannel (
    channelId: string,
    enable: string[],
    disable: string[]
  ): boolean {
    /** 有配置白名单 并且当前子频道没在白名单中 */
    if (enable.length > 0 && !enable.includes(channelId)) {
      return true
    }

    /** 有配置黑名单 并且当前子频道在黑名单中 */
    if (disable.length > 0 && disable.includes(channelId)) {
      return true
    }

    return false
  }
}
