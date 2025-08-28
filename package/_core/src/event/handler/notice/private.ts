import utils from '../../utils'
import { config as cfg, getFriendCfg } from '@/utils/config'

import type { FriendNoticeEventMap } from '@/types/event'

/**
 * @description 好友通知处理器
 * @param ctx 好友通知事件
 */
export const friendNoticeHandler = async (
  ctx: FriendNoticeEventMap[keyof FriendNoticeEventMap]
) => {
  /** 基本配置 */
  const config = cfg()
  /** 好友配置 */
  const friend = getFriendCfg(ctx.userId, ctx.selfId)

  utils.init.role(ctx, config)
  utils.init.emitEvent(ctx)
  utils.init.notice(ctx)
  utils.logger.notice(ctx)

  const cd = utils.cd.notice(ctx, friend, ctx.userId)
  const filter = utils.filter.privateEvent(ctx, config, friend, cd)

  if (!filter) return

  utils.dispatch.notice(ctx, friend)
}
