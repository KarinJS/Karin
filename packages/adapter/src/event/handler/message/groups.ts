import utils from '../../utils'
import { hooksEmit } from '@karinjs/hooks'
import { config as Cfg } from '@karinjs/core/config'
import { FilterCallback, handleMessageCommon } from './common'

import type { GroupMessage, GroupTempMessage, GuildMessage } from '../../abstract/message'

/**
 * @description 群聊消息处理器
 * @param ctx 群聊消息事件
 */
export const groupHandler = async (ctx: GroupMessage) => {
  /** 获取配置 */
  const systemConfig = Cfg.config()
  const eventConfig = Cfg.getGroupCfg(ctx.groupId, ctx.selfId)
  const isPrint = utils.filter.groupLogEnabled(ctx, systemConfig)

  /** 定义群聊特定钩子函数 */
  const hook = async (ctx: GroupMessage) => await hooksEmit.message.group(ctx)

  /** 定义过滤回调 */
  const filterCallback: FilterCallback = (plugin) => {
    const { event, permission: perm } = plugin.register.options
    if (event !== 'message' && event !== 'message.group') return false
    if (![
      'all',
      'master',
      'admin',
      'group.owner',
      'group.admin',
    ].includes(perm)) return false
    return true
  }

  await handleMessageCommon({
    ctx,
    systemConfig,
    eventConfig,
    isPrint,
    hookName: 'group',
    hook,
    dispatch: () => _dispatch({
      ctx,
      eventConfig,
      systemConfig,
      cdKey: ctx.groupId,
      isPrint,
      filterCallback,
    }),
  })
}

/**
 * @description 群聊临时消息处理器
 * @param ctx 群聊临时消息事件
 */
export const groupTempHandler = async (ctx: GroupTempMessage) => {
  /** 获取配置 */
  const systemConfig = Cfg.config()
  const eventConfig = Cfg.getGroupCfg(ctx.groupId, ctx.selfId)
  const isPrint = utils.filter.groupLogEnabled(ctx, systemConfig)

  /** 定义群聊临时消息特定钩子函数 */
  const hook = async (ctx: GroupTempMessage) => await hooksEmit.message.group(ctx)

  /** 定义过滤回调 */
  const filterCallback: FilterCallback = (plugin) => {
    const { event, permission: perm } = plugin.register.options
    if (event !== 'message' && event !== 'message.groupTemp') return false
    if (!['all', 'master', 'admin'].includes(perm)) return false
    return true
  }

  await handleMessageCommon({
    ctx,
    systemConfig,
    eventConfig,
    isPrint,
    hookName: 'groupTemp',
    hook,
    dispatch: () => _dispatch({
      ctx,
      eventConfig,
      systemConfig,
      cdKey: ctx.groupId,
      isPrint,
      filterCallback,
    }),
  })
}

/**
 * @description 频道消息处理器
 * @param ctx 频道消息事件
 */
export const guildHandler = async (ctx: GuildMessage) => {
  /** 获取配置 */
  const systemConfig = Cfg.config()
  const eventConfig = Cfg.getGuildCfg(ctx.guildId, ctx.channelId, ctx.selfId)
  const isPrint = utils.filter.guildLogEnabled(ctx, systemConfig)

  /** 定义频道特定钩子函数 */
  const hook = async (ctx: GuildMessage) => await hooksEmit.message.guild(ctx)

  /** 定义过滤回调 */
  const filterCallback: FilterCallback = (plugin) => {
    const { event, permission: perm } = plugin.register.options
    if (event !== 'message' && event !== 'message.guild') return false
    if (![
      'all',
      'master',
      'admin',
      'guild.owner',
      'guild.admin',
    ].includes(perm)) return false
    return true
  }

  await handleMessageCommon({
    ctx,
    systemConfig,
    eventConfig,
    isPrint,
    hookName: 'guild',
    hook,
    dispatch: () => _dispatch({
      ctx,
      eventConfig,
      systemConfig,
      cdKey: `${ctx.guildId}:${ctx.channelId}`,
      isPrint,
      filterCallback,
    }),
  })
}

const _dispatch = ({
  ctx,
  eventConfig,
  systemConfig,
  cdKey,
  isPrint,
  filterCallback,
}: {
  ctx: GuildMessage | GroupTempMessage | GroupMessage,
  eventConfig: ReturnType<typeof Cfg['getGuildCfg'] | typeof Cfg['getGroupCfg']>,
  systemConfig: ReturnType<typeof Cfg['config']>,
  cdKey: string,
  isPrint: boolean,
  filterCallback: FilterCallback
}) => {
  /** 处理冷却时间 */
  const cd = utils.cd.groups(eventConfig, cdKey, ctx.userId)

  /** 消息过滤 */
  const filter = utils.filter.groupEvent(ctx, systemConfig, eventConfig, cd)

  if (!filter) return

  /** 消息分发 */
  utils.dispatch.message.groups(ctx, eventConfig, isPrint, filterCallback)
}
