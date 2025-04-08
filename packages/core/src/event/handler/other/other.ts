import { cache } from '@/plugin/cache'
import { listeners } from '@/core/internal'
import { eventCallEmit } from '@/hooks/eventCall'
import { emptyEmit } from '@/hooks/empty'
import { getFriendCfg, getGroupCfg } from '@/utils/config'

import {
  log,
  disableViaAdapter,
  disableViaPluginWhitelist,
  disableViaPluginBlacklist,
} from './handler'

import type { Notice, Request } from '@/types/event'

/**
 * @description 初始化提示信息
 * @param ctx 事件对象
 */
export const initTips = (
  ctx: Notice | Request
) => {
  switch (ctx.subEvent) {
    case 'friendPoke':
      ctx.tips = `戳一戳: ${ctx.content.operatorId} ${ctx.content.action || '戳了戳'} ${ctx.content.targetId}`
      break
    case 'receiveLike':
      ctx.tips = `收到点赞: ${ctx.content.count}`
      break
    case 'friendRecall':
      ctx.tips = `撤回消息: ${ctx.content.messageId}`
      break
    case 'friendFileUploaded':
      ctx.tips = `文件上传: [fid:${ctx.content.fid}] [url:${ctx.content.url}] [name:${ctx.content.name}]`
      break
    case 'friendIncrease':
      ctx.tips = `新增好友: ${ctx.content.targetId}`
      break
    case 'friendDecrease':
      ctx.tips = `好友减少: ${ctx.content.targetId}`
      break
    case 'groupPoke':
      ctx.tips = `戳一戳: ${ctx.content.operatorId} ${ctx.content.action || '戳了戳'} ${ctx.content.targetId}`
      break
    case 'groupMessageReaction':
      ctx.tips = `表情动态: 给消息 ${ctx.content.messageId} ${ctx.content.isSet ? '添加' : '取消'}了表情 ${ctx.content.faceId}`
      break
    case 'groupRecall':
      ctx.tips = `撤回消息: ${ctx.content.messageId}`
      break
    case 'groupFileUploaded':
      ctx.tips = `文件上传: [fid:${ctx.content.fid}] [url:${ctx.content.url}] [name:${ctx.content.name}]`
      break
    case 'groupMemberAdd':
      ctx.tips = `新增成员: [操作者:${ctx.content.operatorId}] [目标成员:${ctx.content.targetId}]`
      break
    case 'groupMemberRemove':
      ctx.tips = `移除成员: [操作者:${ctx.content.operatorId}] [目标成员:${ctx.content.targetId}]`
      break
    case 'groupCardChanged':
      ctx.tips = `名片变动: [操作者:${ctx.content.operatorId}] [目标成员:${ctx.content.targetId}]`
      break
    case 'groupAdminChanged':
      ctx.tips = `管理员变动: ${ctx.content.targetId} 被${ctx.content.isAdmin ? '设置' : '取消'}管理员`
      break
    case 'groupSignIn':
      ctx.tips = `签到: ${ctx.content.targetId}`
      break
    case 'groupMemberTitleUpdate':
      ctx.tips = `头衔变动: ${ctx.content.title}`
      break
    case 'groupHonorChange':
      ctx.tips = `荣誉变更: ${ctx.userId} 获得了 ${ctx.content.honorType} 荣誉`
      break
    case 'groupLuckyKing':
      ctx.tips = `运气王: ${ctx.content.userId} 从 ${ctx.content.userId} 发的红包中获得了运气王`
      break
    case 'groupHighlightsChange': {
      if (ctx.content.isSet) {
        ctx.tips = `设置精华: ${ctx.content.operatorId} 将 ${ctx.content.messageId} 设置为精华消息`
      } else {
        ctx.tips = `取消精华: ${ctx.content.operatorId} 将 ${ctx.content.messageId} 取消精华消息`
      }
      break
    }
    case 'groupMemberBan': {
      if (ctx.content.isBan) {
        ctx.tips = `禁言成员: ${ctx.content.operatorId} 将 ${ctx.content.targetId} 禁言 ${ctx.content.duration}秒`
      } else {
        ctx.tips = `解除禁言: ${ctx.content.operatorId} 解除了 ${ctx.content.targetId} 的禁言`
      }
      break
    }
    case 'groupWholeBan': {
      if (ctx.content.isBan) {
        ctx.tips = `全员禁言: ${ctx.content.operatorId}`
      } else {
        ctx.tips = `解除全员禁言: ${ctx.content.operatorId}`
      }
      break
    }
    default:
    // ctx.tips = `未知子事件: ${JSON.stringify(ctx)}`
  }
}

/**
 * @description 打印控制台日志
 * @param ctx 消息事件对象
 * @param type 事件类型
 * @param prefix 日志前缀
 * @param level 日志等级
 */
export const initPrint = (
  ctx: Notice | Request,
  type: string,
  prefix: string,
  level: 'info' | 'debug' = 'info'
) => {
  ctx.logText = `[${type}:${ctx.userId}(${ctx.sender.nick || ''})]`
  logger.bot(level, ctx.selfId, `${prefix}: [${ctx.userId}(${ctx.sender.nick || ''})] ${ctx.tips}`)
}

/**
 * @description 分发事件给插件处理
 * @param ctx 好友、群通知、请求事件
 * @param config 好友配置
 * @param filter 场景过滤器
 */
export const deal = async (
  ctx: Notice | Request,
  config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>
) => {
  for (const plugin of cache.accept) {
    if (plugin.event !== ctx.event && plugin.event !== `${ctx.event}.${ctx.subEvent}`) {
      continue
    }

    if (ctx.event === 'notice') {
      const result = await eventCallEmit.notice(ctx, plugin)
      if (!result) return
    } else {
      const result = await eventCallEmit.request(ctx, plugin)
      if (!result) return
    }

    const result = await fnc(ctx, plugin, config)
    if (!result) return
  }

  /** 未找到匹配插件 */
  log(ctx.userId, `未找到匹配到相应插件: ${ctx.eventId}`)

  /** 触发未找到匹配插件钩子 */
  if (ctx.event === 'notice') {
    emptyEmit.notice(ctx)
  } else {
    emptyEmit.request(ctx)
  }
}

const fnc = async (
  ctx: Notice | Request,
  plugin: typeof cache.accept[number],
  config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>
) => {
  if (!disableViaAdapter(plugin, ctx.bot.adapter.protocol)) return true
  if (!disableViaPluginWhitelist(plugin, config)) return true
  if (!disableViaPluginBlacklist(plugin, config)) return true

  ctx.logFnc = `[${plugin.pkg.name}][${plugin.file.name}]`
  const logFnc = logger.fnc(ctx.logFnc)
  plugin.log(ctx.selfId, `${logFnc}${ctx.logText}`)

  /** 计算插件处理时间 */
  const start = Date.now()

  try {
    let next = false
    const result = await plugin.fnc(ctx, () => { next = true })
    if (next === false && result === false) {
      next = true
    }

    /** 贪婪匹配下一个 */
    if (next === true) {
      logger.debug(`${ctx.logFnc} 继续匹配下一个插件`)
      return true
    }
    return false
  } catch (cause) {
    listeners.emit('error', new Error(ctx.logFnc, { cause }))
    return false
  } finally {
    plugin.log(ctx.selfId, `${logFnc} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
  }
}
