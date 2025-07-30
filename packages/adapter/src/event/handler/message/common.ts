import utils from '../../utils'
import { handleContext } from '../../context'
import { hooksEmit } from '@karinjs/hooks'
import { config as Cfg } from 'node-karin'

import type { GroupMessage, GroupTempMessage, GuildMessage, DirectMessage, FriendMessage } from '../../abstract'
import type { ClassPluginCache, CommandPluginCache } from '@karinjs/plugin'

export type FilterCallback = (plugin: CommandPluginCache | ClassPluginCache) => boolean

/**
 * @description 通用消息处理辅助函数参数类型
 */
export interface CommonMessageHandlerParams {
  /** 消息事件上下文 */
  ctx: GroupMessage | GroupTempMessage | GuildMessage | DirectMessage | FriendMessage
  /** 基本配置 */
  systemConfig: ReturnType<typeof Cfg['config']>
  /** 事件配置 */
  eventConfig: ReturnType<typeof Cfg['getGroupCfg'] | typeof Cfg['getGuildCfg'] | typeof Cfg['getDirectCfg'] | typeof Cfg['getFriendCfg']>
  /** 是否打印日志 */
  isPrint: boolean
  /** 钩子名称 */
  hookName: string
  /** 特定类型的钩子函数 */
  hook: (ctx: any) => Promise<boolean>
  /** 事件分发回调 */
  dispatch: () => void
}

/**
 * @description 通用消息处理辅助函数
 */
export const handleMessageCommon = async ({
  systemConfig,
  ctx,
  eventConfig,
  isPrint,
  hookName,
  hook,
  dispatch,
}: CommonMessageHandlerParams) => {
  utils.init.message(ctx)
  utils.init.role(ctx, systemConfig)
  utils.init.alias(ctx, eventConfig.alias)
  utils.init.emitEvent(ctx)
  utils.logger.message(ctx, isPrint ? 'info' : 'debug')

  /** 执行特定类型的钩子函数 */
  const hookResult = await hook(ctx)
  if (hookResult === false) {
    logger.debug(`[${ctx.logFnc}] ${logger.yellow(`hooks.${hookName}`)} 已拦截当前事件: ${ctx.eventId}`)
    return
  }

  /** 执行通用消息钩子函数 */
  const commonHookResult = await hooksEmit.message.message(ctx)
  if (commonHookResult === false) {
    logger.debug(`[${ctx.logFnc}] ${logger.yellow('hooks.message')} 已拦截当前事件: ${ctx.eventId}`)
    return
  }

  const context = handleContext(ctx)
  if (context) return ctx

  dispatch()
}
