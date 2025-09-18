import utils from '../../utils'
import { Bot } from '@karinjs/bot'
import { hooksEmit } from '@karinjs/hooks'
import { config as Cfg } from '@karinjs/core/config'
import { FilterCallback, handleMessageCommon } from './common'

import type { DirectMessage, FriendMessage } from '../../abstract/message'

/**
 * @description 好友消息处理器
 * @param ctx 好友消息事件
 */
export const friendHandler = async (ctx: FriendMessage) => {
  // @ts-ignore 编译后文件类型分开了...
  Bot.emit('message', ctx)
  // @ts-ignore
  Bot.emit('message.friend', ctx)
  const systemConfig = Cfg.config()
  /** 获取配置 */
  const eventConfig = Cfg.getFriendCfg(ctx.userId, ctx.selfId)

  /** 定义好友消息特定钩子函数 */
  const hook = async (ctx: FriendMessage) => await hooksEmit.message.friend(ctx)

  /** 定义过滤回调 */
  const filterCallback: FilterCallback = (plugin) => {
    const { event, permission } = plugin.register.options

    if (event !== 'message' && event !== 'message.friend') return false
    /** 好友场景只有这三种权限 非这三种一律跳过 */
    if (!['all', 'master', 'admin'].includes(permission)) return false
    return true
  }

  await handleMessageCommon({
    ctx,
    systemConfig,
    eventConfig,
    isPrint: true,
    hookName: 'friend',
    hook,
    dispatch: () => _dispatch({
      ctx,
      eventConfig,
      systemConfig,
      filterCallback,
    }),
  })
}

/**
 * @description 频道私信消息处理器
 * @param ctx 频道私信消息事件
 */
export const directHandler = async (ctx: DirectMessage) => {
  // @ts-ignore 编译后文件类型分开了...
  Bot.emit('message', ctx)
  // @ts-ignore
  Bot.emit('message.direct', ctx)

  const systemConfig = Cfg.config()
  /** 获取配置 */
  const eventConfig = Cfg.getDirectCfg(ctx.userId, ctx.selfId)

  /** 定义频道私信特定钩子函数 */
  const hook = async (ctx: DirectMessage) => await hooksEmit.message.direct(ctx)

  /** 定义过滤回调 */
  const filterCallback: FilterCallback = (plugin) => {
    const { event, permission } = plugin.register.options
    if (event !== 'message' && event !== 'message.direct') return false
    /** 频道私信场景只有这三种权限 非这三种一律跳过 */
    if (!['all', 'master', 'admin'].includes(permission)) return false
    return true
  }

  await handleMessageCommon({
    ctx,
    systemConfig,
    eventConfig,
    isPrint: true,
    hookName: 'direct',
    hook,
    dispatch: () => _dispatch({
      ctx,
      eventConfig,
      systemConfig,
      filterCallback,
    }),
  })
}

const _dispatch = ({
  ctx,
  eventConfig,
  systemConfig,
  filterCallback,
}: {
  ctx: DirectMessage | FriendMessage,
  eventConfig: ReturnType<typeof Cfg['getFriendCfg'] | typeof Cfg['getDirectCfg']>,
  systemConfig: ReturnType<typeof Cfg['config']>,
  filterCallback: FilterCallback
}) => {
  const cd = utils.cd.private(eventConfig, ctx.userId)
  const filter = utils.filter.privateEvent(ctx, systemConfig, eventConfig, cd)

  if (!filter) return

  utils.dispatch.message.private(ctx, eventConfig, filterCallback)
}
