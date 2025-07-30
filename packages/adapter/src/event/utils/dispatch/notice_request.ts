import utils from '../../utils'
import { hooksEmit } from '@karinjs/hooks'
import { plguinManager } from '@karinjs/plugin'
import { internalEmitter } from '@karinjs/core'

import type { Notice, Request } from '../../types'
import type { AcceptCache } from '@karinjs/plugin'
import type { ConfigPrivateValue, ConfigGroupValue } from '@karinjs/config'

/**
 * @description 通知、请求事件分发
 * @param ctx 事件对象
 * @param config 基本配置
 */
const _dispatchNoticeEvent = async (
  ctx: Notice | Request,
  config: ConfigPrivateValue | ConfigGroupValue
) => {
  for (const plugin of plguinManager.manager.cache.accept) {
    if (
      plugin.register.event !== ctx.event &&
      plugin.register.event !== `${ctx.event}.${ctx.subEvent}`
    ) {
      continue
    }

    if (ctx.event === 'notice') {
      const result = await hooksEmit.eventCall.notice(ctx, plugin)
      if (!result) return
    } else {
      const result = await hooksEmit.eventCall.request(ctx, plugin)
      if (!result) return
    }

    const result = await _callback(ctx, plugin, config)
    if (!result) return
  }

  /** 未找到匹配插件 */
  utils.logger.filter(ctx.userId, `未找到匹配到相应插件: ${ctx.eventId}`)

  /** 触发未找到匹配插件钩子 */
  if (ctx.event === 'notice') {
    hooksEmit.empty.notice(ctx)
  } else {
    hooksEmit.empty.request(ctx)
  }
}

/**
 * 执行插件回调
 * @param ctx 事件对象
 * @param plugin 插件
 * @param config 基本配置
 * @returns 是否继续执行下一个插件
 */
const _callback = async (
  ctx: Notice | Request,
  plugin: AcceptCache,
  config: ConfigPrivateValue | ConfigGroupValue
) => {
  const { adapter, dsbAdapter } = plugin.register.options
  if (!utils.checker.adapterEnabled(
    adapter,
    dsbAdapter,
    ctx.bot.adapter.protocol
  )) return true

  if (!utils.checker.pluginWhitelisted(
    plugin.pkg.name,
    plugin.file.basename,
    plugin.app.name, config
  )) return true

  if (!utils.checker.pluginNotBlacklisted(
    plugin.pkg.name,
    plugin.file.basename,
    plugin.app.name,
    config
  )) return true

  ctx.logFnc = `[${plugin.pkg.name}][${plugin.file.basename}]`
  const logFnc = logger.fnc(ctx.logFnc)
  plugin.app.log(ctx.selfId, `${logFnc}${ctx.logText}`)

  /** 计算插件处理时间 */
  const start = Date.now()

  try {
    let next = false
    // @ts-ignore 循环引用造成的类型错误
    const result = await plugin.register.fnc(ctx, () => { next = true })
    if (next === false && result === false) {
      next = true
    }

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
    plugin.app.log(ctx.selfId, `${logFnc} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
  }
}

/**
 * 分发通知事件
 * @param ctx 事件对象
 * @param config 基本配置
 * @returns 是否继续执行下一个插件
 */
export const dispatchNoticeEvent = async (
  ctx: Notice,
  config: ConfigGroupValue | ConfigPrivateValue
) => {
  return _dispatchNoticeEvent(ctx, config)
}

/**
 * 分发请求事件
 * @param ctx 事件对象
 * @param config 基本配置
 * @returns 是否继续执行下一个插件
 */
export const dispatchRequestEvent = async (
  ctx: Request,
  config: ConfigGroupValue | ConfigPrivateValue
) => {
  return _dispatchNoticeEvent(ctx, config)
}
