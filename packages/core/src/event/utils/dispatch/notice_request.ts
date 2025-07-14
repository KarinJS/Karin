import utils from '..'
import { emptyEmit } from '@/hooks/empty'
import { listeners } from '@/core/internal'
import { eventCallEmit } from '@/hooks/eventCall'
import { plguinManager } from '@/core/load'
import { getFriendCfg, getGroupCfg } from '@/utils/config'

import type { Notice, Request } from '@/types/event'

/**
 * @description 通知、请求事件分发
 * @param ctx 事件对象
 * @param config 基本配置
 */
const _dispatchNoticeEvent = async (
  ctx: Notice | Request,
  config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>
) => {
  for (const plugin of plguinManager.accept) {
    if (
      plugin.register.event !== ctx.event &&
      plugin.register.event !== `${ctx.event}.${ctx.subEvent}`
    ) {
      continue
    }

    if (ctx.event === 'notice') {
      const result = await eventCallEmit.notice(ctx, plugin)
      if (!result) return
    } else {
      const result = await eventCallEmit.request(ctx, plugin)
      if (!result) return
    }

    const result = await _callback(ctx, plugin, config)
    if (!result) return
  }

  /** 未找到匹配插件 */
  utils.logger.filter(ctx.userId, `未找到匹配到相应插件: ${ctx.eventId}`)

  /** 触发未找到匹配插件钩子 */
  if (ctx.event === 'notice') {
    emptyEmit.notice(ctx)
  } else {
    emptyEmit.request(ctx)
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
  plugin: typeof plguinManager.accept[number],
  config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>
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
    listeners.emit('error', new Error(ctx.logFnc, { cause }))
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
  config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>
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
  config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>
) => {
  return _dispatchNoticeEvent(ctx, config)
}
