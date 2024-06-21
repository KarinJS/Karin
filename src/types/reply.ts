import { KarinElement } from './element'

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
) => Promise<{ message_id?: string }>

export type replyCallback = (
  /**
   * 发送的消息
   */
  elements: string | KarinElement | Array<KarinElement | string>,
  /**
   * 重试次数
   */
  retry_count?: number,
) => Promise<{ message_id?: string }>
