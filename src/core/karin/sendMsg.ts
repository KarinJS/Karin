import { sendMsg } from '../service'
import { master, admin } from '@/utils/config'
import type { Elements } from '@/types/segment'
import type { Contact } from '@/types/event'

type Message = string | Elements | Array<Elements>

interface SendMsgOptions {
  /** 发送成功后撤回消息时间 */
  recallMsg?: number
  /** @deprecated 已废弃 请使用 `retryCount` */
  retry_count?: number
  /** 重试次数 */
  retryCount?: number
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
