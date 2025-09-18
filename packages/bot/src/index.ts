import EventEmitter from 'node:events'
import { logger } from '@karinjs/logger'
import { hooksEmit } from '@karinjs/hooks'
import { createRawMessage, makeMessage, segment } from '@karinjs/adapter'

import type {
  Contact,
  AdapterType,
  Elements,
  ForwardOptions,
  NodeElement,
  SendMsgResults,
  AdapterCommunication,
  AdapterProtocol,
  SendMessage,
  AdapterEventMap,
} from '@karinjs/adapter'

interface SendMsgOptions {
  /** 发送成功后撤回消息时间 */
  recallMsg?: number
  /** @deprecated 已废弃 请使用 `retryCount` */
  retry_count?: number
  /** 重试次数 */
  retryCount?: number
}

/**
 * Bot管理器类
 */
export class BotManager extends EventEmitter<AdapterEventMap> {
  #index: number = 0
  #list: { index: number, bot: AdapterType }[] = []

  /**
   * 获取Bot
   * @param id 适配器索引 | 适配器协议实现 | 机器人ID
   * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
   * @returns 适配器
   */
  getBot (id: number | AdapterProtocol | string, isProtocol = false): AdapterType | null {
    try {
      if (typeof id === 'number') {
        return this.#list.find(item => item.index === id)?.bot || null
      }

      if (isProtocol) {
        return this.#list.find(item => item.bot.adapter.protocol === id)?.bot || null
      }

      return this.#list.find(item => item.bot.selfId === id)?.bot || null
    } catch {
      return null
    }
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
      return this.#list.filter(item => item.bot.status === state).map(item => item.bot)
    }
    return this.#list.map(item => item.bot)
  }

  /**
   * 获取所有Bot类 包含索引
   * @returns 注册的Bot列表
   */
  getAllBotList () {
    return this.#list
  }

  /**
   * 获取所有BotID
   * @returns BotID列表
   */
  getAllBotID () {
    return this.#list.map(item => item.bot.selfId)
  }

  /**
   * 获取注册的Bot数量
   * @returns Bot数量
   */
  getBotCount () {
    return this.#list.length
  }

  /**
   * 卸载Bot
   * @param type 卸载方式
   * @param idOrIndex 适配器索引 | 机器人ID
   * @param address 机器人地址
   */
  unregisterBot: UnregisterBot = (type, idOrIndex, address?) => {
    const findIndexAndRemove = (predicate: (item: { index: number, bot: AdapterType }) => boolean) => {
      const index = this.#list.findIndex(predicate)
      if (index !== -1) {
        const [removed] = this.#list.splice(index, 1)
        logger.bot('info', removed.bot.selfId, `${logger.red('[service][卸载Bot]')} ${removed.bot.adapter.name}`)
        return true
      }

      logger.warn(`[service][卸载Bot] 未找到指定Bot: ${JSON.stringify({ type, idOrIndex, address })}`)
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

    logger.warn(`[service][卸载Bot] 未知的卸载方式: ${type}`)
    return false
  }

  /**
   * 注册Bot
   * @param communication 适配器通信实例
   * @param bot 适配器实例
   * @returns 适配器索引
   */
  registerBot (communication: AdapterCommunication, bot: AdapterType) {
    const id = ++this.#index
    this.#list.push({ index: id, bot })

    if (!bot.adapter.communication) {
      bot.adapter.communication = communication
    }

    /**
     * @description 重写
     */
    const originSendMsg = bot.sendMsg
    const originSendForwardMsg = bot.sendForwardMsg
    bot.sendMsg = async (
      contact: Contact,
      elements: Array<Elements>,
      retryCount?: number
    ) => {
      const hook = await hooksEmit.sendMsg.message(contact, elements, retryCount)
      if (!hook) return { messageId: '', time: -1, rawData: '', message_id: '', messageTime: -1 }

      /** 重试sendMsg */
      try {
        const result = await originSendMsg.call(bot, contact, elements, retryCount)
        /** 触发发送消息后钩子 */
        await hooksEmit.sendMsg.afterMessage(contact, elements, result)
        return result
      } catch (error) {
        if (typeof retryCount === 'number' && retryCount > 0) {
          return bot.sendMsg(contact, elements, retryCount - 1)
        }
        throw error
      }
    }

    bot.sendForwardMsg = async (
      contact: Contact,
      elements: Array<NodeElement>,
      options?: ForwardOptions
    ) => {
      const hook = await hooksEmit.sendMsg.forward(contact, elements, options)
      if (!hook) return { messageId: '', forwardId: '' }
      const result = await originSendForwardMsg.call(bot, contact, elements, options)
      /** 触发发送转发消息后钩子 */
      await hooksEmit.sendMsg.afterForward(contact, elements, result, options)
      return result
    }

    setTimeout(async () => {
      const { db } = await import('@karinjs/db')
      const key = `karin:restart:${bot.selfId}`
      const options = await db.get<{ selfId: string, contact: Contact, messageId: string, time: number }>(key)
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
        await this.sendMsg(selfId, contact, element)
      } finally {
        await db.del(key)
      }
    }, 10)

    /** 延迟执行 */
    setTimeout(() => {
      logger.bot('info', bot.selfId, `${logger.green('[registerBot]')}[${bot.adapter.name}]: ${bot.account.name} ${bot.adapter.address}`)
    }, 1000)

    return id
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
    /** 结果 */
    let result: any = {}
    /** 标准化 */
    const newElements = makeMessage(elements)

    const bot = this.getBot(selfId)
    if (!bot) throw new Error('发送消息失败: 未找到对应Bot实例')
    const { recallMsg } = options
    const retryCount = options.retryCount ?? options.retry_count ?? 1

    const { raw } = createRawMessage(newElements)
    if (contact.scene === 'group') {
      logger.bot('info', selfId, `${logger.green('Send Proactive Group')} ${contact.peer}: ${raw}`)
    } else {
      logger.bot('info', selfId, `${logger.green('Send Proactive private')} ${contact.peer}: ${raw}`)
    }

    try {
      await Promise.all([
        async () => {
          result = await bot.sendMsg(contact, newElements, retryCount)
        },
        async () => {
          const [
            { SEND_MSG },
            { emitter },
          ] = await Promise.all([
            import('@karinjs/envs'),
            import('@karinjs/events'),
          ])
          emitter.emit(SEND_MSG, contact)
        },
      ])
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
