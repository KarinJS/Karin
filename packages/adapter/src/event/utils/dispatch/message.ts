import lodash from 'lodash'
import utils from '../../utils'
import { hooksEmit } from '@karinjs/hooks'
import { plguinManager } from '@karinjs/plugin'
import { internalEmitter } from '@karinjs/core'

import type { MessageEventMap } from '../../types'
import type { CommandCache } from '@karinjs/plugin'
import type { FilterCallback } from '../../handler/message/common'
import type { ConfigPrivateValue, ConfigGroupValue } from '@karinjs/config'
import type { DirectMessage, FriendMessage, GroupMessage, GroupTempMessage, GuildMessage } from '../../abstract/message'

/**
 * @description 单人场景消息事件分发
 * @param ctx 消息事件
 * @param config 配置
 * @param filter 场景过滤器
 */
export const dispatchPrivateMessageEvent = async (
  ctx: FriendMessage | DirectMessage,
  config: ConfigPrivateValue,
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
  config: ConfigGroupValue,
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
const handleMessage = async <T extends FriendMessage | DirectMessage | GroupMessage | GuildMessage | GroupTempMessage>(
  ctx: T,
  config: ConfigPrivateValue | ConfigGroupValue,
  filter: FilterCallback,
  createPrint: (plugin: CommandCache) => (text: string) => void
) => {
  for (const plugin of plguinManager.manager.cache.command) {
    if (!filter(plugin)) continue
    const print = createPrint(plugin)
    const result = await callback(ctx, plugin, config, print)
    if (!result) return
  }

  /** 未找到匹配插件 */
  utils.logger.filter(ctx.logText, `未找到匹配到相应插件: ${ctx.messageId}`)

  /** 触发未找到匹配插件消息钩子 */
  hooksEmit.empty.message(ctx)
}

/**
 * @description 分发事件给插件处理
 * @param ctx 消息事件
 * @param plugin 插件缓存对象
 * @param config 好友配置
 * @param print 打印日志回调函数
 */
const callback = async (
  ctx: MessageEventMap[keyof MessageEventMap],
  plugin: CommandCache,
  config: ConfigPrivateValue | ConfigGroupValue,
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
    const result = await hooksEmit.eventCall.friend(ctx, plugin)
    if (!result) return false
  } else if (ctx.isDirect) {
    const result = await hooksEmit.eventCall.direct(ctx, plugin)
    if (!result) return false
  } else if (ctx.isGroup) {
    const result = await hooksEmit.eventCall.group(ctx, plugin)
    if (!result) return false
  } else if (ctx.isGuild) {
    const result = await hooksEmit.eventCall.guild(ctx, plugin)
    if (!result) return false
  } else if (ctx.isGroupTemp) {
    const result = await hooksEmit.eventCall.groupTemp(ctx, plugin)
    if (!result) return false
  }

  const hookResult = await hooksEmit.eventCall.message(ctx, plugin)
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
    // @ts-ignore 循环引用造成的类型错误
    const result = await plugin.register.fnc(ctx, () => { next = true })
    if (next === false && typeof result === 'boolean' && result === false) next = true

    /** 贪婪匹配下一个 */
    if (next === true) {
      logger.debug(`${ctx.logFnc} 继续匹配下一个插件`)
      return true
    }
    return false
  } catch (cause) {
    internalEmitter.emit('error', new Error(ctx.logFnc, { cause }))
    return false
  } finally {
    const time = logger.green(Date.now() - start + 'ms')
    const msg = lodash.truncate(ctx.msg, { length: 100 })
    print(`${logFnc} ${msg} 处理完成 ${time}`)
  }
}
