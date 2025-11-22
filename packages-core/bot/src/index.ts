import { wrapBotMethods } from './hook'
import { logger } from '@karinjs/logger'
import { EventEmitter } from 'node:events'
import { createRawMessage, makeMessage } from '@karinjs/adapter'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type {
  Contact,
  AdapterType,
  Elements,
  SendMsgResults,
  AdapterCommunication,
  AdapterProtocol,
  SendMessage,
  AdapterEventMap,
} from '@karinjs/adapter'

export interface SendMsgOptions {
  /** 发送成功后撤回消息时间 */
  recallMsg?: number
  /** @deprecated 已废弃 请使用 `retryCount` */
  retry_count?: number
  /** 重试次数 */
  retryCount?: number
}

export interface EventDispatchMaps extends AdapterEventMap {
  /** 发送消息 */
  'send.msg': [Contact]
  /** 发送转发消息 */
  'send.forward': [Contact]
  /** bot状态修改为离线 */
  'bot.offline': [string]
  /** bot状态修改为在线 */
  'bot.online': [string]
  /** ws:connection 事件 */
  'ws:connection': [WebSocket, IncomingMessage]
  /** ws:close 事件 */
  'ws:close': [WebSocket, IncomingMessage, number, Buffer]
  /** 框架加载完成 */
  loaded: []
  /** 调用插件 */
  'plugin.call': [{
    /** 插件包名称 */
    pluginName: string
    /** 插件文件绝对路径 */
    file: string
    /** 插件函数名称 */
    functionName: string
  }]
}

/**
 * Bot管理器类
 */
export class BotManager extends EventEmitter<EventDispatchMaps> {
  #nextIndex: number = 0
  #bots: Array<{ index: number, bot: AdapterType }> = []

  /**
   * 获取Bot
   * @param id 适配器索引 | 适配器协议实现 | 机器人ID
   * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
   * @returns 适配器
   */
  getBot (id: number | AdapterProtocol | string, isProtocol = false): AdapterType | null {
    if (typeof id === 'number') {
      return this.findByIndex(id)
    }

    if (isProtocol) {
      return this.findByProtocol(id as AdapterProtocol)
    }

    return this.findBySelfId(id as string)
  }

  /**
   * 通过索引查找Bot
   * @param index 适配器索引
   * @returns Bot实例或null
   */
  findByIndex (index: number): AdapterType | null {
    return this.#bots.find(item => item.index === index)?.bot || null
  }

  /**
   * 通过协议类型查找Bot
   * @param protocol 适配器协议实现
   * @returns Bot实例或null
   */
  findByProtocol (protocol: AdapterProtocol): AdapterType | null {
    return this.#bots.find(item => item.bot.adapter.protocol === protocol)?.bot || null
  }

  /**
   * 通过BotID查找Bot
   * @param selfId 机器人ID
   * @returns Bot实例或null
   */
  findBySelfId (selfId: string): AdapterType | null {
    return this.#bots.find(item => item.bot.selfId === selfId)?.bot || null
  }

  /**
   * 获取所有Bot类 不包含索引
   * @param state Bot状态 默认返回全部
   * - online: 在线
   * - offline: 离线
   * - initializing: 初始化中
   * @returns Bot类列表
   */
  getAllBot (state?: 'online' | 'offline' | 'initializing') {
    if (state) {
      return this.#bots.filter(item => item.bot.status === state).map(item => item.bot)
    }
    return this.#bots.map(item => item.bot)
  }

  /**
   * 获取所有Bot类 包含索引
   * @returns 注册的Bot列表
   */
  getAllBotList () {
    return this.#bots
  }

  /**
   * 获取所有BotID
   * @returns BotID列表
   */
  getAllBotID () {
    return this.#bots.map(item => item.bot.selfId)
  }

  /**
   * 获取注册的Bot数量
   * @returns Bot数量
   */
  getBotCount () {
    return this.#bots.length
  }

  /**
   * 卸载Bot
   * @param type 卸载类型
   * @param idOrIndex 适配器索引 | 机器人ID
   * @param address 机器人地址
   */
  unregisterBot: UnregisterBot = (type, idOrIndex, address?) => {
    if (type === 'index') {
      return this.removeByIndex(idOrIndex as number)
    }

    if (type === 'selfId') {
      return this.removeBySelfId(idOrIndex as string)
    }

    if (type === 'address' && typeof address === 'string') {
      return this.removeByAddress(idOrIndex as string, address)
    }

    logger.error(`[unregister] 不支持的卸载类型: ${type}`)
    return false
  }

  /**
   * 通过索引移除Bot
   * @param index 适配器索引
   * @returns 是否移除成功
   */
  removeByIndex (index: number): boolean {
    const botIndex = this.#bots.findIndex(item => item.index === index)
    if (botIndex === -1) {
      logger.warn(`[unregister] 未找到索引为 ${index} 的Bot`)
      return false
    }

    const [removed] = this.#bots.splice(botIndex, 1)
    const { selfId, adapter } = removed.bot
    logger.bot('info', selfId, `[unregister] 成功卸载Bot: ${selfId}(${adapter.name})`)
    return true
  }

  /**
   * 通过BotID移除Bot
   * @param selfId 机器人ID
   * @returns 是否移除成功
   */
  removeBySelfId (selfId: string): boolean {
    const index = this.#bots.findIndex(item => item.bot.selfId === selfId)
    if (index === -1) {
      logger.warn(`[unregister] 未找到 self_id 为 ${selfId} 的Bot`)
      return false
    }

    const [removed] = this.#bots.splice(index, 1)
    logger.bot('info', selfId, `[unregister] 成功卸载Bot: ${removed.bot.selfId}(${removed.bot.adapter.name})`)
    return true
  }

  /**
   * 通过BotID和地址移除Bot
   * @param selfId 机器人ID
   * @param address 机器人地址
   * @returns 是否移除成功
   */
  removeByAddress (selfId: string, address: string): boolean {
    const index = this.#bots.findIndex(
      item => item.bot.selfId === selfId && item.bot.adapter.address === address
    )
    if (index === -1) {
      logger.warn(`[unregister] 未找到 self_id 为 ${selfId}, address 为 ${address} 的Bot`)
      return false
    }

    const [removed] = this.#bots.splice(index, 1)
    logger.bot('info', selfId, `[unregister] 成功卸载Bot: ${selfId}(${removed.bot.adapter.name})`)
    return true
  }

  /**
   * 注册Bot
   * @param communication 适配器通信实例
   * @param bot 适配器实例
   * @returns 适配器索引
   */
  registerBot (communication: AdapterCommunication, bot: AdapterType) {
    const index = ++this.#nextIndex
    this.#bots.push({ index, bot })

    if (!bot.adapter.communication) {
      bot.adapter.communication = communication
    }

    wrapBotMethods(bot)
    const { name, address } = bot.adapter
    const accountName = bot.account.name
    logger.bot('info', bot.selfId, `${logger.green('[registerBot]')}[${name}]: ${accountName} ${address}`)
    return index
  }

  /**
   * 发送主动消息
   * @param selfId Bot的id
   * @param contact 目标信息
   * @param elements 消息内容
   * @param options 消息选项
   */
  async sendMsg (
    selfId: string,
    contact: Contact,
    elements: SendMessage,
    options: SendMsgOptions = { recallMsg: 0, retryCount: 1, retry_count: 1 }
  ): Promise<SendMsgResults> {
    const bot = this.getBot(selfId)
    if (!bot) {
      throw new Error('发送消息失败: 未找到对应Bot实例')
    }

    const normalizedElements = makeMessage(elements)
    const retryCount = options.retryCount ?? options.retry_count ?? 1

    this.#logOutgoingMessage(selfId, contact, normalizedElements)
    const result = await this.#executeSendMsg(bot, selfId, contact, normalizedElements, retryCount)
    this.#scheduleRecall(bot, contact, result, options.recallMsg)

    return result
  }

  #logOutgoingMessage (selfId: string, contact: Contact, elements: Array<Elements>): void {
    const { raw } = createRawMessage(elements)
    const scene = contact.scene.charAt(0).toUpperCase() + contact.scene.slice(1)
    logger.bot('info', selfId, `${logger.green(`Send Proactive ${scene}`)} ${contact.peer}: ${raw}`)
  }

  async #executeSendMsg (
    bot: AdapterType,
    selfId: string,
    contact: Contact,
    elements: Array<Elements>,
    retryCount: number
  ): Promise<SendMsgResults> {
    let result: SendMsgResults = {
      messageId: '',
      time: -1,
      rawData: '',
      message_id: '',
      messageTime: -1,
    }

    try {
      result = await bot.sendMsg(contact, elements, retryCount)
      result.message_id = result.messageId

      logger.bot('debug', selfId, `主动消息结果:${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      const { raw } = createRawMessage(elements)
      logger.bot('error', selfId, `主动消息发送失败:${raw}`)
      logger.error(error)
    }

    return result
  }

  #scheduleRecall (bot: AdapterType, contact: Contact, result: SendMsgResults, recallMsg?: number): void {
    if (recallMsg && recallMsg > 0 && result?.messageId) {
      setTimeout(() => bot.recallMsg(contact, result.messageId), recallMsg * 1000)
    }
  }
}

/**
 * @public
 * bot管理器
 */
export const Bot = new BotManager()

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
  return Bot.getBot(id, isProtocol as boolean)
}

/**
 * 获取所有Bot类 不包含索引
 * @returns Bot类列表
 */
export const getAllBot = () => {
  return Bot.getAllBot()
}

/**
 * 获取所有Bot类 包含索引
 * @returns 注册的Bot列表
 */
export const getAllBotList = () => {
  return Bot.getAllBotList()
}

/**
 * 获取所有BotID
 * @returns BotID列表
 */
export const getAllBotID = () => {
  return Bot.getAllBotID()
}

/**
 * 获取注册的Bot数量
 * @returns Bot数量
 */
export const getBotCount = () => {
  return Bot.getBotCount()
}

/**
 * 卸载Bot
 * @param type 卸载方式
 * @param idOrIndex 适配器索引 | 机器人ID
 * @param address 机器人地址
 */
export const unregisterBot: UnregisterBot = (type, idOrIndex, address?) => {
  // @ts-ignore
  return Bot.unregisterBot(type, idOrIndex, address)
}

/**
 * 注册Bot
 * @param communication 适配器通信实例
 * @param bot 适配器实例
 * @returns 适配器索引
 */
export const registerBot = (communication: AdapterCommunication, bot: AdapterType) => {
  return Bot.registerBot(communication, bot)
}

/**
 * 发送主动消息
 * @param selfId Bot的id
 * @param contact 目标信息
 * @param elements 消息内容
 * @param options 消息选项
 */
export const sendMsg = async (
  selfId: string,
  contact: Contact,
  elements: SendMessage,
  options: SendMsgOptions = { recallMsg: 0, retryCount: 1, retry_count: 1 }
): Promise<SendMsgResults> => {
  return Bot.sendMsg(selfId, contact, elements, options)
}
