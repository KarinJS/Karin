import { noticeRequestCD } from '../other/cd'
import { config as cfg, getGroupCfg } from '@/utils/config'
import { deal, initPrint, initTips } from '../other/other'

import {
  initEmit,
  initRole,
  groupFilterEvent,
} from '../other/handler'

import type { GroupRequestEventMap } from '@/types/event'

/**
 * @description 群请求事件处理器
 * @param ctx 群请求事件
 */
export const groupRequestHandler = async (
  ctx: GroupRequestEventMap[keyof GroupRequestEventMap]
) => {
  /** 基本配置 */
  const config = cfg()
  /** 群配置 */
  const group = getGroupCfg(ctx.groupId, ctx.selfId)

  initRole(ctx, config)
  initEmit(ctx)
  initTips(ctx)
  initPrint(ctx, 'group', '群请求')

  const cd = noticeRequestCD(ctx, group, ctx.groupId)
  const filter = groupFilterEvent(ctx, config, group, cd)

  if (filter) deal(ctx, group)
}
