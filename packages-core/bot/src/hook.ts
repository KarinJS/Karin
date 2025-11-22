import { Bot } from '@karinjs/bot'
import { coreHooks } from '@karinjs/adapter/hooks'

import type {
  AdapterType,
  SendMsgResults,
} from '@karinjs/adapter'

const sendMsg = async (
  ctx: AdapterType,
  original: AdapterType['sendMsg'],
  contact: Parameters<AdapterType['sendMsg']>[0],
  elements: Parameters<AdapterType['sendMsg']>[1],
  retryCount?: Parameters<AdapterType['sendMsg']>[2]
): Promise<SendMsgResults> => {
  /** 事件发射 */
  Bot.emit('send.msg', contact)
  ctx.account.events.sent.message++

  const allowed = await coreHooks.sendMsg.beforeMessage(contact, elements, retryCount)
  if (!allowed) {
    return { messageId: '', time: -1, rawData: {}, message_id: '', messageTime: -1 }
  }

  try {
    const result = await original.call(ctx, contact, elements, retryCount)
    await coreHooks.sendMsg.afterMessage(contact, elements, result)
    return result
  } catch (error) {
    if (typeof retryCount === 'number' && retryCount > 0) {
      return ctx.sendMsg(contact, elements, retryCount - 1)
    }
    throw error
  }
}

const sendForwardMsg = async (
  ctx: AdapterType,
  original: AdapterType['sendForwardMsg'],
  contact: Parameters<AdapterType['sendForwardMsg']>[0],
  elements: Parameters<AdapterType['sendForwardMsg']>[1],
  options?: Parameters<AdapterType['sendForwardMsg']>[2]
) => {
  /** 事件发射 */
  Bot.emit('send.forward', contact)
  ctx.account.events.sent.forward++

  const allowed = await coreHooks.sendMsg.beforeForward(contact, elements, options)
  if (!allowed) {
    return { messageId: '', forwardId: '' }
  }

  const result = await original.call(ctx, contact, elements, options)
  await coreHooks.sendMsg.afterForward(contact, elements, result, options)
  return result
}

/**
 * 包装 Bot 的消息发送方法，添加 Hook 拦截
 * @param ctx Bot 实例
 */
export const wrapBotMethods = (ctx: AdapterType): void => {
  const originalSendMsg = ctx.sendMsg
  const originalSendForwardMsg = ctx.sendForwardMsg

  ctx.sendMsg = (...args) => sendMsg(ctx, originalSendMsg, ...args)
  ctx.sendForwardMsg = (...args) => sendForwardMsg(ctx, originalSendForwardMsg, ...args)
}
