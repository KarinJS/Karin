import { sendMsg } from '@/karin/sendMsg'
import { MiddlewareHandler } from '@/utils/message/middleware'
import { AdapterBase } from '@adapter/base'
import { cache } from '@/plugin/cache/cache'
import { Contact, NodeElementType, segment } from '@/adapter'
import { AdapterCommunication, AdapterProtocol, AdapterType, ForwardOptions } from '@/adapter/adapter'

let index = 0
const list: { index: number, bot: AdapterType }[] = []

export type GetBot = {
  /**
   * 获取指定Bot类
   * @param index 适配器索引
   */
  (index: number): AdapterType | null
  /**
   * 获取指定Bot类
   * @param protocol 适配器协议实现
   * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
   */
  (protocol: AdapterProtocol, isProtocol: boolean): AdapterType | null
  /**
   * 获取指定Bot类
   * @param botID 机器人ID
   */
  (botID: string): AdapterType | null
}

export type UnregisterBot = {
  /**
   * @description 通过索引ID卸载Bot
   * @param index 适配器索引
   */
  (type: 'index', index: number): boolean
  /**
   * @description 通过BotID卸载Bot
   * @param selfId 机器人ID
   */
  (type: 'selfId', selfId: string): boolean
  /**
   * @description 通过BotID和地址卸载Bot
   * @param type 卸载类型
   * @param selfId 机器人ID
   * @param address 机器人地址
   */
  (type: 'address', selfId: string, address: string): boolean
}

/**
 * 获取Bot
 * @param id 适配器索引 | 适配器协议实现 | 机器人ID
 * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
 * @returns 适配器
 */
export const getBot: GetBot = (id: number | AdapterProtocol | string, isProtocol = false) => {
  try {
    if (typeof id === 'number') {
      return list.find(item => item.index === id)?.bot || null
    }

    if (isProtocol) {
      return list.find(item => item.bot.adapter.protocol === id)?.bot || null
    }

    return list.find(item => item.bot.selfId === id)?.bot || null
  } catch {
    return null
  }
}

/**
 * 获取所有Bot类 不包含索引
 * @returns Bot类列表
 */
export const getAllBot = () => {
  return list.map(item => item.bot)
}

/**
 * 获取所有Bot类 包含索引
 * @returns 注册的Bot列表
 */
export const getAllBotList = () => {
  return list
}

/**
 * 获取所有BotID
 * @returns BotID列表
 */
export const getAllBotID = () => {
  return list.map(item => item.bot.selfId)
}

/**
 * 获取注册的Bot数量
 * @returns Bot数量
 */
export const getBotCount = () => {
  return list.length
}

/**
 * 卸载Bot
 * @param type 卸载方式
 * @param idOrIndex 适配器索引 | 机器人ID
 * @param address 机器人地址
 */
export const unregisterBot: UnregisterBot = (type, idOrIndex, address?) => {
  const findIndexAndRemove = (predicate: (item: { index: number, bot: AdapterType }) => boolean) => {
    const index = list.findIndex(predicate)
    if (index !== -1) {
      const [removed] = list.splice(index, 1)
      logger.bot('info', removed.bot.selfId, `${logger.red('[service][卸载Bot]')} ${removed.bot.adapter.name}`)
      return true
    }

    logger.bot('warn', '', `[service][卸载Bot] 未找到指定Bot: ${JSON.stringify({ type, idOrIndex, address })}`)
    return false
  }

  if (type === 'index') {
    return findIndexAndRemove(item => item.index === idOrIndex)
  }

  if (type === 'selfId') {
    return findIndexAndRemove(({ bot }) => bot.selfId === idOrIndex)
  }

  if (type === 'address') {
    return findIndexAndRemove(({ bot }) => bot.selfId === idOrIndex && bot.adapter.address === address)
  }

  logger.bot('warn', '', `[service][卸载Bot] 未知的卸载方式: ${type}`)
  return false
}

/**
 * 注册Bot
 * @param bot 适配器实例
 * @returns 适配器索引
 */
export const registerBot = (type: `${AdapterCommunication}`, bot: AdapterBase) => {
  const id = ++index
  const tips = (str: string) => logger.green(`[注册Bot][${str}]`)
  if (type === AdapterCommunication.REVERSE_WEBSOCKET) {
    logger.bot('info', bot.selfId, `${tips('正向webSocket')} ${bot.account.name}: ${bot.adapter.address}`)
  } else if (type === AdapterCommunication.INTERNAL) {
    bot.adapter.address = 'internal://127.0.0.1'
    logger.bot('info', bot.selfId, `${tips('internal')} ${bot.account.name}`)
  } else if (type === AdapterCommunication.HTTP) {
    logger.bot('info', bot.selfId, `${tips('HTTP')} ${bot.account.name}: ${bot.adapter.address}`)
  } else if (type === AdapterCommunication.WEBSOCKET) {
    logger.bot('info', bot.selfId, `${tips('反向WebSocket')} ${bot.account.name}: ${bot.adapter.address}`)
  } else if (type === AdapterCommunication.GRPC) {
    logger.bot('info', bot.selfId, `${tips('gRPC')} ${bot.account.name}: ${bot.adapter.address}`)
  }

  list.push({ index: id, bot })

  /**
   * @description 重写转发消息方法 添加中间件
   */
  const sendForwardMsg = bot.sendForwardMsg
  bot.sendForwardMsg = async (contact: Contact, elements: Array<NodeElementType>, options?: ForwardOptions) => {
    /** 先调用中间件 */
    if (await MiddlewareHandler(cache.middleware.forwardMsg, bot, contact, elements)) {
      return { messageId: '', forwardId: '' }
    }
    return sendForwardMsg.call(bot, contact, elements, options)
  }

  setTimeout(async () => {
    const { level } = await import('../../main/index')
    const key = `karin:restart:${bot.selfId}`
    const options = await level.has(key)
    if (!options) return

    try {
      const { selfId, contact, messageId, time } = options
      /** 重启花费时间 保留2位小数 */
      const restartTime = ((Date.now() - time) / 1000).toFixed(2)
      /** 超过2分钟不发 */
      if (Number(restartTime) > 120) {
        return false
      }

      const element = [
        segment.reply(messageId),
        segment.text(`\n重启成功：${restartTime}秒`),
      ]
      await sendMsg(selfId, contact, element)
    } finally {
      await level.del(key)
    }
  }, 10)

  return id
}
