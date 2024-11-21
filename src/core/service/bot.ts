import { Contact, NodeElementType } from '@/adapter'
import { AdapterCommunication, AdapterProtocol, AdapterType, ForwardOptions } from '@/adapter/adapter'
import { cache } from '@/plugin/cache/cache'
import { MiddlewareHandler } from '@/utils'
import { AdapterBase } from '@adapter/base'

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
      logger.bot('info', removed.bot.selfId, `[service][卸载Bot] ${removed.bot.adapter.name} 卸载成功`)
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
  if (type === AdapterCommunication.REVERSE_WEBSOCKET) {
    logger.bot('info', bot.selfId, `[service][注册Bot][正向webSocket] ${bot.adapter.name}: ${bot.adapter.address}`)
  } else if (type === AdapterCommunication.INTERNAL) {
    bot.adapter.address = 'internal://127.0.0.1'
    logger.bot('info', bot.selfId, `[service][注册Bot][internal] ${bot.adapter.name}`)
  } else if (type === AdapterCommunication.HTTP) {
    logger.bot('info', bot.selfId, `[service][注册Bot][HTTP] ${bot.adapter.name}: ${bot.adapter.address}`)
  } else if (type === AdapterCommunication.WEBSOCKET) {
    logger.bot('info', bot.selfId, `[service][注册Bot][反向WebSocket] ${bot.adapter.name}: ${bot.adapter.address}`)
  } else if (type === AdapterCommunication.GRPC) {
    logger.bot('info', bot.selfId, `[service][注册Bot][gRPC] ${bot.adapter.name}: ${bot.adapter.address}`)
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

  return id
}
