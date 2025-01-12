import { noticeRequestCD } from '../other/cd'
import { initPrint, initTips, deal } from '../other/other'
import { config as cfg, getFriendCfg } from '@/utils/config'

import {
  privateFilterEvent,
  initEmit,
  initRole,
} from '../other/handler'

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

  initRole(ctx, config)
  initEmit(ctx)
  initTips(ctx)
  initPrint(ctx, 'friend', '好友请求')

  const cd = noticeRequestCD(ctx, friend, ctx.userId)
  const filter = privateFilterEvent(ctx, config, friend, cd)
  // TODO: 中间件实现

  if (filter) deal(ctx, friend)
}
