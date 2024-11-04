import { AdapterProtocol, AdapterType } from '@/adapter/adapter'

let index = 0
const list: { index: number, adapter: AdapterType }[] = []

type GetBot = {
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

/**
 * 获取适配器
 * @param id 适配器索引 | 适配器协议实现 | 机器人ID
 * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
 * @returns 适配器
 */
export const getBot: GetBot = (id: number | AdapterProtocol | string, isProtocol = false) => {
  try {
    if (typeof id === 'number') {
      return list.find(item => item.index === id)?.adapter || null
    }

    if (isProtocol) {
      return list.find(item => item.adapter.adapter.protocol === id)?.adapter || null
    }

    return list.find(item => item.adapter.selfId === id)?.adapter || null
  } catch {
    return null
  }
}

/**
 * 获取所有Bot类 不包含索引
 * @returns Bot类列表
 */
export const getAllBot = () => {
  return list.map(item => item.adapter)
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
  return list.map(item => item.adapter.selfId)
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
 * @param id 适配器索引
 */
export const removeBot = (id: number) => {
  const index = list.findIndex(item => item.index === id)
  if (index !== -1) {
    const bot = getBot(id)!
    list.splice(index, 1)
    logger.bot('info', bot.selfId, `[service][Bot卸载][${id}]: ${bot.adapter.name}`)
    return true
  }
  return false
}

/**
 * 注册Bot
 * @param bot 适配器
 * @returns 适配器索引
 */
export const registerAdapter = (bot: AdapterType) => {
  const id = ++index
  list.push({ index: id, adapter: bot })
  logger.bot('info', bot.selfId, `[service][Bot注册][${id}]: ${bot.adapter.address}`)
  // TODO: 重写转发api 加入中间件
  return id
}
