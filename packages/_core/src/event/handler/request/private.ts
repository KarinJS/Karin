import utils from '../../utils'
import { config as cfg, getFriendCfg } from '@/utils/config'

import type { FriendRequestEventMap } from '@/types/event'

/**
 * @description 好友请求事件处理器
 * @param ctx 好友请求事件
 */
export const friendRequestHandler = async (
  ctx: FriendRequestEventMap[keyof FriendRequestEventMap]
) => {
  /** 基本配置 */
  const config = cfg()
  /** 好友配置 */
  const friend = getFriendCfg(ctx.userId, ctx.selfId)

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
