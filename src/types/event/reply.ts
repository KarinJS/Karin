import { KarinElement, NodeElement } from '../element'

export type Reply = (
  /**
   * 发送的消息
   */
  elements: string | KarinElement | Array<KarinElement | string>,
  /**
   * 选项
   */
  options?: {
    /**
     * 是否@回复
     */
    at?: boolean
    /**
     * 是否回复
     */
    reply?: boolean
    /**
     * 发送成功后撤回发送消息的时间
     */
    recallMsg?: number
    /**
     * 重试次数
     */
    retry_count?: number
  },
) => Promise<ReplyReturn>

/**
 * 发送消息后返回信息
 */
export interface ReplyReturn {
  /**
   * 消息ID
   */
  message_id: string
  /** 消息发送时间戳 */
  message_time?: number
  /** 原始结果 QQBot适配器下为数组 */
  raw_data?: any
}

export type replyCallback = (
  /**
   * 发送的消息
   */
  elements: KarinElement[],
  /**
   * 重试次数
   */
  retry_count?: number,
) => Promise<ReplyReturn>

export type replyForward = (msg: NodeElement[]) => Promise<ReplyReturn>
