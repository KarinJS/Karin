import utils from '../../utils'
import { config as cfg } from '@karinjs/core'

import type { GroupNoticeEventMap } from '../../types'

/**
 * @description 群通知处理器
 * @param ctx 群通知事件
 */
export const groupNoticeHandler = async (
  ctx: GroupNoticeEventMap[keyof GroupNoticeEventMap]
) => {
  /** 基本配置 */
  const config = cfg.config()
  /** 群配置 */
  const group = cfg.getGroupCfg(ctx.groupId, ctx.selfId)

  utils.init.role(ctx, config)
  utils.init.emitEvent(ctx)
  utils.init.notice(ctx)
  utils.logger.notice(ctx)

  const cd = utils.cd.notice(ctx, group, ctx.groupId)
  const filter = utils.filter.groupEvent(ctx, config, group, cd)

  if (!filter) return

  utils.dispatch.notice(ctx, group)
}
