import lodash from 'lodash'
import * as filter from '@/event/handler/filterList'
import type { CommandClass, CommandFnc } from '@/plugin'
import type { MessageEventMap } from '@/event/types/types'
import type { GuildMessageHandler } from '@/event/handler/message/guild'
import type { GroupMessageHandler } from '@/event/handler/message/group'
import { DirectHandler } from '@/event/handler/message/direct'
import { FriendHandler } from '@/event/handler/message/friend'

/**
 * 群、频道插件处理函数
 * @param ctx 上下文
 * @param plugin 插件
 * @returns 返回`true`表示继续匹配下一个插件，返回`false`表示停止匹配
 */
export const groupAndGuild = async (
  ctx: GroupMessageHandler | GuildMessageHandler,
  plugin: CommandClass | CommandFnc<keyof MessageEventMap>
): Promise<boolean> => {
  const reg = plugin.reg
  if (reg && !reg.test(ctx.event.msg)) return true
  if (!filter.disableViaAdapter(plugin, ctx.event.bot.adapter.protocol)) return true
  if (!filter.disableViaPluginWhitelist(plugin, ctx.eventCfg)) return true
  if (!filter.disableViaPluginBlacklist(plugin, ctx.eventCfg)) return true

  ctx.event.logFnc = `[${plugin.name}][${plugin.file.method}]`
  const logFnc = logger.fnc(ctx.event.logFnc)
  ctx.isPrint && plugin.log(
    ctx.event.selfId,
    `${logFnc}${ctx.event.logText} ${lodash.truncate(ctx.event.msg, { length: 100 })}`
  )

  /** 计算插件处理时间 */
  const start = Date.now()
  filter.addEventCount(plugin, ctx.event)

  try {
    if (!ctx.permission(plugin.perm)) return false
    let result
    if (plugin.type === 'fnc') {
      result = await plugin.fnc(ctx.event)
    } else {
      const App = new plugin.Cls()
      if (typeof App?.[plugin.file.method as keyof typeof App] !== 'function') {
        return true
      }

      App.e = ctx.event
      App.reply = ctx.event.reply.bind(ctx.event)
      result = await (App as any)[plugin.file.method](App.e)
    }
    /** 贪婪匹配下一个 */
    if (result === false) {
      logger.debug(`${ctx.event.logFnc} 继续匹配下一个插件`)
      return true
    }
    return false
  } catch (error: any) {
    logger.error(`${ctx.event.logFnc}`)
    filter.emitError(error)
    return false
  } finally {
    ctx.isPrint && plugin.log(
      ctx.event.selfId,
      `${logFnc} ${lodash.truncate(ctx.event.msg, { length: 100 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`
    )
  }
}

/**
 * 好友、频道私信插件处理函数
 * @param ctx 上下文
 * @param plugin 插件
 * @returns 返回`true`表示继续匹配下一个插件，返回`false`表示停止匹配
 */
export const friendAndDirect = async (
  ctx: FriendHandler | DirectHandler,
  plugin: CommandClass | CommandFnc<keyof MessageEventMap>
): Promise<boolean> => {
  const reg = plugin.reg
  if (reg && !reg.test(ctx.event.msg)) return true
  if (!filter.disableViaAdapter(plugin, ctx.event.bot.adapter.protocol)) return true
  if (!filter.disableViaPluginWhitelist(plugin, ctx.eventCfg)) return true
  if (!filter.disableViaPluginBlacklist(plugin, ctx.eventCfg)) return true

  ctx.event.logFnc = `[${plugin.name}][${plugin.file.method}]`
  const logFnc = logger.fnc(ctx.event.logFnc)
  plugin.log(ctx.event.selfId, `${logFnc}${ctx.event.logText} ${lodash.truncate(ctx.event.msg, { length: 100 })}`)

  /** 计算插件处理时间 */
  const start = Date.now()
  filter.addEventCount(plugin, ctx.event)

  try {
    if (!ctx.permission(plugin.perm)) return false

    let result
    if (plugin.type === 'fnc') {
      result = await plugin.fnc(ctx.event)
    } else {
      const App = new plugin.Cls()
      if (typeof App?.[plugin.file.method as keyof typeof App] !== 'function') {
        return true
      }

      App.e = ctx.event
      App.reply = ctx.event.reply.bind(ctx.event)
      result = await (App as any)[plugin.file.method](App.e)
    }

    /** 贪婪匹配下一个 */
    if (result === false) {
      logger.debug(`${ctx.event.logFnc} 继续匹配下一个插件`)
      return true
    }
    return false
  } catch (error: any) {
    logger.error(`${ctx.event.logFnc}`)
    filter.emitError(error)
    return false
  } finally {
    plugin.log(
      ctx.event.selfId,
      `${logFnc} ${lodash.truncate(ctx.event.msg, { length: 100 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
  }
}
