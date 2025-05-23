import lodash from 'lodash'
import { groupsCD } from '../other/cd'
import { cache } from '@/plugin/system/cache'
import { context as CTX } from '../other/context'
import { listeners } from '@/core/internal'
import { Permission } from '../other/permission'
import { hooksMessageEmit } from '@/hooks/messaeg'
import { emptyEmit } from '@/hooks/empty'
import { eventCallEmit } from '@/hooks/eventCall'
import { config as cfg, getGroupCfg, getGuildCfg } from '@/utils/config'
import {
  initAlias,
  initEmit,
  initMsg,
  initRole,
  log,
  groupPrint,
  groupFilterEvent,
  guildPrint,
  disableViaAdapter,
  disableViaPluginWhitelist,
  disableViaPluginBlacklist,
} from '../other/handler'

import type { Message } from '@/types/event'
import type { GroupMessage, GroupTempMessage, GuildMessage } from '../../message'

/**
 * @description 群聊消息处理器
 * @param ctx 群聊消息事件
 */
export const groupHandler = async (ctx: GroupMessage) => {
  /** 基本配置 */
  const config = cfg()
  /** 好友配置 */
  const group = getGroupCfg(ctx.groupId, ctx.selfId)
  /** 是否打印日志 */
  const isPrint = groupPrint(ctx, config)

  initMsg(ctx)
  initRole(ctx, config)
  initAlias(ctx, group.alias)
  initEmit(ctx)
  initPrint(ctx, isPrint ? 'info' : 'debug')

  /** 消息钩子 */
  const hook = await hooksMessageEmit.group(ctx)
  if (!hook) {
    logger.debug(`[${ctx.logFnc}] 群消息钩子返回false 跳过当前事件: ${ctx.eventId}`)
    return
  }
  const hook2 = await hooksMessageEmit.message(ctx)
  if (!hook2) {
    logger.debug(`[${ctx.logFnc}] 消息钩子返回false 跳过当前事件: ${ctx.eventId}`)
    return
  }

  const context = CTX(ctx)
  if (context) return ctx

  const cd = groupsCD(group, ctx.groupId, ctx.userId)
  const filter = groupFilterEvent(ctx, config, group, cd)

  if (filter) {
    groupsDeal(ctx, group, isPrint, (plugin: typeof cache.command[number]) => {
      if (plugin.event !== 'message' && plugin.event !== 'message.group') return false
      if (![
        'all',
        'master',
        'admin',
        'group.owner',
        'group.admin',
      ].includes(plugin.permission)) return false
      return true
    })
  }
}

/**
 * @description 群聊临时消息处理器
 * @param ctx 群聊临时消息事件
 */
export const groupTempHandler = async (ctx: GroupTempMessage) => {
  /** 基本配置 */
  const config = cfg()
  /** 好友配置 */
  const group = getGroupCfg(ctx.groupId, ctx.selfId)
  /** 是否打印日志 */
  const isPrint = groupPrint(ctx, config)

  initMsg(ctx)
  initRole(ctx, config)
  initAlias(ctx, group.alias)
  initEmit(ctx)
  initPrint(ctx)

  /** 消息钩子 */
  const hook = await hooksMessageEmit.groupTemp(ctx)
  if (!hook) {
    logger.debug(`[${ctx.logFnc}] 群临时消息钩子返回false 跳过当前事件: ${ctx.eventId}`)
    return
  }
  const hook2 = await hooksMessageEmit.message(ctx)
  if (!hook2) {
    logger.debug(`[${ctx.logFnc}] 消息钩子返回false 跳过当前事件: ${ctx.eventId}`)
    return
  }

  const context = CTX(ctx)
  if (context) return ctx

  const cd = groupsCD(group, ctx.groupId, ctx.userId)
  const filter = groupFilterEvent(ctx, config, group, cd)

  if (filter) {
    groupsDeal(ctx, group, isPrint, (plugin: typeof cache.command[number]) => {
      if (plugin.event !== 'message' && plugin.event !== 'message.groupTemp') return false
      if (!['all', 'master', 'admin'].includes(plugin.permission)) return false
      return true
    })
  }
}

/**
 * @description 频道消息处理器
 * @param ctx 频道消息事件
 */
export const guildHandler = async (ctx: GuildMessage) => {
  /** 基本配置 */
  const config = cfg()
  /** 好友配置 */
  const group = getGuildCfg(ctx.guildId, ctx.channelId, ctx.selfId)
  /** 是否打印日志 */
  const isPrint = guildPrint(ctx, config)

  initMsg(ctx)
  initRole(ctx, config)
  initAlias(ctx, group.alias)
  initEmit(ctx)
  initPrint(ctx)

  const context = CTX(ctx)
  if (context) return ctx

  /** 消息钩子 */
  hooksMessageEmit.guild(ctx)
  hooksMessageEmit.message(ctx)

  const cd = groupsCD(group, `${ctx.guildId}:${ctx.channelId}`, ctx.userId)
  const filter = groupFilterEvent(ctx, config, group, cd)

  if (filter) {
    groupsDeal(ctx, group, isPrint, (plugin: typeof cache.command[number]) => {
      if (plugin.event !== 'message' && plugin.event !== 'message.guild') return false
      if (![
        'all',
        'master',
        'admin',
        'guild.owner',
        'guild.admin',
      ].includes(plugin.permission)) return false
      return true
    })
  }
}

/**
 * @description 打印控制台日志
 * @param ctx 消息事件对象
 * @param type 事件类型
 * @param prefix 日志前缀
 * @param level 日志等级
 */
const initPrint = (ctx: Message, level: 'info' | 'debug' = 'info') => {
  let idPath: string
  let msgType: string

  if (ctx.isFriend) {
    msgType = '好友消息'
    idPath = ctx.userId
  } else if (ctx.isGroup) {
    msgType = '群消息'
    idPath = `${ctx.groupId}-${ctx.userId}`
  } else if (ctx.isGuild) {
    msgType = '频道消息'
    idPath = `${ctx.guildId}-${ctx.channelId}-${ctx.userId}`
  } else if (ctx.isGroupTemp) {
    msgType = '群临时消息'
    idPath = `${ctx.groupId}-${ctx.userId}`
  } else {
    msgType = '私信消息'
    idPath = ctx.userId
  }

  const nick = ctx.sender.nick || ''
  ctx.logText = `[${ctx.contact.scene}:${idPath}(${nick})]`
  logger.bot(level, ctx.selfId, `${msgType}: [${idPath}(${nick})] ${ctx.rawMessage}`)
}

/**
 * @description 群聊、频道消息处理
 * @param ctx 群聊消息事件
 * @param config 群聊配置
 * @param isPrint 是否打印日志
 * @param filter 场景过滤器
 */
const groupsDeal = async (
  ctx: GroupMessage | GuildMessage | GroupTempMessage,
  config: ReturnType<typeof getGroupCfg>,
  isPrint: boolean,
  filter: (plugin: typeof cache.command[number]) => boolean
) => {
  for (const plugin of cache.command) {
    if (!filter(plugin)) continue
    const result = await groupsCmd(ctx, plugin, config, isPrint)
    if (!result) return
  }

  /** 未找到匹配插件 */
  log(ctx.userId, `未找到匹配到相应插件: ${ctx.messageId}`)

  /** 触发未找到匹配插件消息钩子 */
  emptyEmit.message(ctx)
}

/**
 * @description 调用群聊、频道消息插件
 * @param ctx 群聊消息事件
 * @param plugin 插件缓存对象
 * @param config 群聊配置
 * @param isPrint 是否打印日志
 */
const groupsCmd = async (
  ctx: GroupMessage | GuildMessage | GroupTempMessage,
  plugin: typeof cache.command[number],
  config: ReturnType<typeof getGroupCfg>,
  isPrint: boolean
): Promise<boolean> => {
  const reg = plugin.reg
  if (reg && !reg.test(ctx.msg)) return true
  if (!disableViaAdapter(plugin, ctx.bot.adapter.protocol)) return true
  if (!disableViaPluginWhitelist(plugin, config)) return true
  if (!disableViaPluginBlacklist(plugin, config)) return true

  ctx.logFnc = `[${plugin.pkg.name}][${plugin.file.name}]`
  const logFnc = logger.fnc(ctx.logFnc)
  isPrint && plugin.log(ctx.selfId, `${logFnc}${ctx.logText} ${lodash.truncate(ctx.msg, { length: 100 })}`)

  /** 计算插件处理时间 */
  const start = Date.now()
  if (ctx.isGroup) {
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
    if (!Permission.groups(ctx, plugin)) return false

    /** 是否继续匹配下一个插件 */
    let next = false

    if (plugin.type === 'fnc') {
      const result = await plugin.fnc(ctx, () => { next = true })
      if (next === false && result === false) next = true
    } else {
      const App = new plugin.Cls()
      if (typeof App?.[plugin.file.method as keyof typeof App] !== 'function') {
        return true
      }

      App.e = ctx
      App.next = () => { next = true }
      App.reply = App.e.reply.bind(App.e)
      const result = await (App as any)[plugin.file.method](App.e)
      if (next === false && result === false) next = true
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
    const time = logger.green(Date.now() - start + 'ms')
    const msg = lodash.truncate(ctx.msg, { length: 100 })
    isPrint && plugin.log(ctx.selfId, `${logFnc} ${msg} 处理完成 ${time}`)
  }
}
