import { Bot } from '@karinjs/bot'
import utils from '../../utils'
import { config as cfg } from '@karinjs/core'

import type { FriendRequestEventMap } from '../../types'

/**
 * @description 好友请求事件处理器
 * @param ctx 好友请求事件
 */
export const friendRequestHandler = async (
  ctx: FriendRequestEventMap[keyof FriendRequestEventMap]
) => {
  // @ts-ignore 编译后文件类型分开了...
  Bot.emit('request', ctx)
  // @ts-ignore
  Bot.emit(`request.${ctx.subEvent}`, ctx)

  /** 基本配置 */
  const config = cfg.config()
  /** 好友配置 */
  const friend = cfg.getFriendCfg(ctx.userId, ctx.selfId)

  utils.init.role(ctx, config)
  utils.init.emitEvent(ctx)
  utils.init.request(ctx)
  utils.logger.request(ctx)

  const cd = utils.cd.request(ctx, friend, ctx.userId)
  const filter = utils.filter.privateEvent(ctx, config, friend, cd)
  // TODO: 中间件实现

  if (!filter) return

  utils.dispatch.request(ctx, friend)
}
