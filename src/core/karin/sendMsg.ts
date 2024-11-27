import { getBot } from '@/service'
import { cache } from '@/plugin/cache/cache'
import { makeMessageLog } from '@/utils/common'
import { listeners } from '@/internal/listeners'
import { makeMessage, MiddlewareHandler } from '@/utils'
import type { Contact, ElementTypes, SendMsgResults } from '@/adapter'

/**
 * 发送主动消息
 * @param uid - Bot的uid
 * @param contact - 目标信息
 * @param elements - 消息内容
 * @param options - 消息选项
 * @param options.recallMsg - 发送成功后撤回消息时间
 * @param options.retryCount - 重试次数
 */
export const sendMsg = async (selfId: string, contact: Contact, elements: string | ElementTypes | Array<ElementTypes>, options: {
  /** 发送成功后撤回消息时间 */
  recallMsg?: number
  /** @deprecated 已废弃 请使用 `retryCount` */
  retry_count?: number
  /** 重试次数 */
  retryCount?: number
} = { recallMsg: 0, retryCount: 1, retry_count: 1 }): Promise<SendMsgResults> => {
  /** 结果 */
  let result: any = {}
  /** 标准化 */
  const NewElements = makeMessage(elements)

  /** 先调用中间件 */
  if (await MiddlewareHandler(cache.middleware.sendMsg, selfId, contact, NewElements)) {
    return result
  }

  const bot = getBot(selfId)
  if (!bot) throw new Error('发送消息失败: 未找到对应Bot实例')
  const { recallMsg } = options
  const retryCount = options.retryCount ?? options.retry_count ?? 1

  const { raw } = makeMessageLog(NewElements)
  if (contact.scene === 'group') {
    logger.bot('info', selfId, `${logger.green('Send Proactive Group')} ${contact.peer}: ${raw}`)
  } else {
    logger.bot('info', selfId, `${logger.green('Send Proactive private')} ${contact.peer}: ${raw}`)
  }

  try {
    listeners.emit('karin:count:send', 1)
    /** 取结果 */
    result = await bot.sendMsg(contact, NewElements, retryCount)
    logger.bot('debug', selfId, `主动消息结果:${JSON.stringify(result, null, 2)}`)
  } catch (error) {
    logger.bot('error', selfId, `主动消息发送失败:${raw}`)
    logger.error(error)
  }

  result.message_id = result.messageId

  /** 快速撤回 */
  if (recallMsg && recallMsg > 0 && result?.messageId) {
    setTimeout(() => bot.recallMsg(contact, result.messageId), recallMsg * 1000)
  }
  return result as SendMsgResults
}
