import { getBot } from '@/service'
import { cache } from '@/plugin/cache/cache'
import { master, admin } from '@/utils/config'
import { makeMessageLog } from '@/utils/common'
import { listeners } from '@/internal/listeners'
import { SEND_MSG } from '@/utils/data/key'
import { makeMessage } from '@/utils/common'
import { MiddlewareHandler } from '@/utils/message/middleware'
import type { Contact, ElementTypes, SendMsgResults } from '@/adapter'

type Message = string | ElementTypes | Array<ElementTypes>

interface SendMsgOptions {
  /** 发送成功后撤回消息时间 */
  recallMsg?: number
  /** @deprecated 已废弃 请使用 `retryCount` */
  retry_count?: number
  /** 重试次数 */
  retryCount?: number
}

/**
 * 发送主动消息
 * @param uid Bot的uid
 * @param contact 目标信息
 * @param elements 消息内容
 * @param options 消息选项
 */
export const sendMsg = async (selfId: string, contact: Contact, elements: Message, options: SendMsgOptions = { recallMsg: 0, retryCount: 1, retry_count: 1 }): Promise<SendMsgResults> => {
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
    listeners.emit(SEND_MSG, contact)
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

interface SendMasterOptions extends SendMsgOptions {
  /** 是否必须为Bot对应的主人/管理员 默认false */
  mustMaster?: boolean
}

interface SendAdminOptions extends SendMsgOptions {
  /** 是否必须为Bot对应的主人/管理员 默认false */
  mustAdmin?: boolean
}

/**
 * 给主人发消息
 * @param selfId Bot的ID
 * @param targetId 主人ID
 * @param elements 消息内容
 * @param options 消息选项
 */
export const sendMaster = async (
  selfId: string,
  targetId: string,
  elements: Message,
  options: SendMasterOptions = { recallMsg: 0, retryCount: 1, mustMaster: false }
) => {
  /** 检查目标是否为主人 */
  const mustMaster = options?.mustMaster ?? false
  const lsit = master()
  if (mustMaster) {
    if (!lsit.includes(`${selfId}@${targetId}`)) {
      throw new Error('发送消息失败: 目标不是Bot的专属主人')
    }
  } else {
    if (!lsit.includes(targetId)) {
      throw new Error('发送消息失败: 目标不是主人')
    }
  }

  const contact = { peer: targetId, scene: 'friend' } as Contact<'friend'>
  return sendMsg(selfId, contact, elements, options)
}

/**
 * 给管理员发消息
 * @param selfId Bot的ID
 * @param targetId 管理员ID
 * @param elements 消息内容
 * @param options 消息选项
 */
export const sendAdmin = async (
  selfId: string,
  targetId: string,
  elements: Message,
  options: SendAdminOptions = { recallMsg: 0, retryCount: 1, mustAdmin: false }
) => {
  /** 检查目标是否为管理员 */
  const mustAdmin = options?.mustAdmin ?? false
  const lsit = admin()
  if (mustAdmin) {
    if (!lsit.includes(`${selfId}@${targetId}`)) {
      throw new Error('发送消息失败: 目标不是Bot的专属管理员')
    }
  } else {
    if (!lsit.includes(targetId)) {
      throw new Error('发送消息失败: 目标不是管理员')
    }
  }

  const contact = { peer: targetId, scene: 'friend' } as Contact<'friend'>
  return sendMsg(selfId, contact, elements, options)
}
