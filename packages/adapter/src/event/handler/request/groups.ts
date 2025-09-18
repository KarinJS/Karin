import { Bot } from '@karinjs/bot'
import utils from '../../utils'
import { config as cfg } from '@karinjs/core'
import type { GroupRequestEventMap } from '../../types'

/**
 * @description 群请求事件处理器
 * @param ctx 群请求事件
 */
export const groupRequestHandler = async (
  ctx: GroupRequestEventMap[keyof GroupRequestEventMap]
) => {
  // @ts-ignore 编译后文件类型分开了...
  Bot.emit('request', ctx)
  // @ts-ignore
  Bot.emit(`request.${ctx.subEvent}`, ctx)

  /** 基本配置 */
  const config = cfg.config()
  /** 群配置 */
  const group = cfg.getGroupCfg(ctx.groupId, ctx.selfId)

  utils.init.role(ctx, config)
  utils.init.emitEvent(ctx)
  utils.init.request(ctx)
  utils.logger.request(ctx)

  const cd = utils.cd.request(ctx, group, ctx.groupId)
  const filter = utils.filter.groupEvent(ctx, config, group, cd)

  if (!filter) return

  utils.dispatch.request(ctx, group)
}
