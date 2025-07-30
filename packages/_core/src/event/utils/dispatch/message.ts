import lodash from 'lodash'
import utils from '../../utils'
import { emptyEmit } from '@/hooks/empty'
import { listeners } from '@/core/internal'
import { eventCallEmit } from '@/hooks/eventCall'
import * as manager from '@/plugins/manager'
import type { getFriendCfg, getGroupCfg } from '@/utils/config'
import type { DirectMessage, FriendMessage, GroupMessage, GroupTempMessage, GuildMessage } from '@/event/types'
import type { FilterCallback } from '@/event/handler/message/common'
import { CommandCache } from '@/core/karin/command'

/**
 * @description 单人场景消息事件分发
 * @param ctx 消息事件
 * @param config 配置
 * @param filter 场景过滤器
 */
export const dispatchPrivateMessageEvent = async (
  ctx: FriendMessage | DirectMessage,
  config: ReturnType<typeof getFriendCfg>,
  filter: FilterCallback
) => {
  await handleMessage(
    ctx,
    config,
    filter,
    (plugin) => (text: string) => plugin.app.log(ctx.selfId, text)
  )
}

/**
 * @description 多人场景消息事件分发
 * @param ctx 消息事件
 * @param config 配置
 * @param isPrint 是否打印日志
 * @param filter 场景过滤器
 */
export const dispatchGroupMessageEvent = async (
  ctx: GroupMessage | GuildMessage | GroupTempMessage,
  config: ReturnType<typeof getGroupCfg>,
  isPrint: boolean,
  filter: FilterCallback
) => {
  await handleMessage(
    ctx,
    config,
    filter,
    (plugin) => (text: string) => isPrint && plugin.app.log(ctx.selfId, text)
  )
}

/**
 * @description 通用消息处理函数
 * @param ctx 消息事件
 * @param config 配置对象
 * @param filter 场景过滤器
 * @param createPrint 创建打印函数的回调
 */
const handleMessage = async <T extends FriendMessage | DirectMessage | GroupMessage | GuildMessage | GroupTempMessage> (
  ctx: T,
  config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>,
  filter: FilterCallback,
  createPrint: (plugin: CommandCache) => (text: string) => void
) => {
  for (const plugin of manager.cache.command) {
    if (!filter(plugin)) continue
    const print = createPrint(plugin)
    const result = await callback(ctx, plugin, config, print)
    if (!result) return
  }

  /** 未找到匹配插件 */
  utils.logger.filter(ctx.logText, `未找到匹配到相应插件: ${ctx.messageId}`)

  /** 触发未找到匹配插件消息钩子 */
  emptyEmit.message(ctx)
}

/**
 * @description 分发事件给插件处理
 * @param ctx 消息事件
 * @param plugin 插件缓存对象
 * @param config 好友配置
 * @param print 打印日志回调函数
 */
const callback = async (
  ctx: FriendMessage | DirectMessage | GroupMessage | GuildMessage | GroupTempMessage,
  plugin: CommandCache,
  config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>,
  print: (text: string) => void
) => {
  const reg = plugin.register.reg
  if (reg && !reg.test(ctx.msg)) return true
  const { adapter, dsbAdapter } = plugin.register.options
  if (!utils.checker.adapterEnabled(
    adapter,
    dsbAdapter,
    ctx.bot.adapter.protocol
  )) return true

  if (!utils.checker.pluginWhitelisted(
    plugin.pkg.name,
    plugin.file.basename,
    plugin.app.name,
    config
  )) return true

  if (!utils.checker.pluginNotBlacklisted(
    plugin.pkg.name,
    plugin.file.basename,
    plugin.app.name,
    config
  )) return true

  ctx.logFnc = `[${plugin.pkg.name}][${plugin.app.name}]`
  const logFnc = logger.fnc(ctx.logFnc)
  print(`${logFnc}${ctx.logText} ${lodash.truncate(ctx.msg, { length: 100 })}`)

  /** 计算插件处理时间 */
  const start = Date.now()
  if (ctx.isFriend) {
    const result = await eventCallEmit.friend(ctx, plugin)
    if (!result) return false
  } else if (ctx.isDirect) {
    const result = await eventCallEmit.direct(ctx, plugin)
    if (!result) return false
  } else if (ctx.isGroup) {
    const result = await eventCallEmit.group(ctx, plugin)
    if (!result) return false
  } else if (ctx.isGuild) {
    const result = await eventCallEmit.guild(ctx, plugin)
    if (!result) return false
  } else if (ctx.isGroupTemp) {
    const result = await eventCallEmit.groupTemp(ctx, plugin)
    if (!result) return false
  }

  const hookResult = await eventCallEmit.message(ctx, plugin)
  if (!hookResult) return false

  try {
    if (ctx.isPrivate) {
      if (!utils.permission.checkPrivate(ctx, plugin.register.options.permission, plugin.register.options.authFailMsg)) {
        return false
      }
    } else {
      if (!utils.permission.checkGroup(ctx, plugin.register.options.permission, plugin.register.options.authFailMsg)) {
        return false
      }
    }

    /** 是否继续匹配下一个插件 */
    let next = false
    const result = await plugin.register.fnc(ctx, () => { next = true })
    if (next === false && typeof result === 'boolean' && result === false) next = true

    /** 贪婪匹配下一个 */
    if (next === true) {
      logger.debug(`${ctx.logFnc} 继续匹配下一个插件`)
      return true
    }
    return false
  } catch (cause) {
    listeners.emit('error', new Error(ctx.logFnc, { cause }))
    return false
  } finally {
    const time = logger.green(Date.now() - start + 'ms')
    const msg = lodash.truncate(ctx.msg, { length: 100 })
    print(`${logFnc} ${msg} 处理完成 ${time}`)
  }
}
