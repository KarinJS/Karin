import type { AdapterBase } from 'src/adapter/base'
import { AdapterCommunication } from '@/adapter/adapter'

const list: AdapterBase[] = []

/**
 * 注册适配器
 * @param cla 适配器类
 */
export const registerBot = (type: `${AdapterCommunication}`, cla: AdapterBase) => {
  if (type === AdapterCommunication.REVERSE_WEBSOCKET) {
    logger.info(`[service][注册适配器][反向webSocket] ${cla.adapter.name}: ${cla.adapter.address}`)
  } else if (type === AdapterCommunication.INTERNAL) {
    cla.adapter.address = 'internal://127.0.0.1'
    logger.info(`[service][注册适配器][internal] ${cla.adapter.name}`)
  } else if (type === AdapterCommunication.HTTP) {
    logger.info(`[service][注册适配器][HTTP] ${cla.adapter.name}: ${cla.adapter.address}`)
  } else if (type === AdapterCommunication.WEBSOCKET) {
    logger.info(`[service][注册适配器][正向WebSocket] ${cla.adapter.name}: ${cla.adapter.address}`)
  } else if (type === AdapterCommunication.GRPC) {
    logger.info(`[service][注册适配器][gRPC] ${cla.adapter.name}: ${cla.adapter.address}`)
  }

  list.push(cla)
}

/**
 * 卸载适配器
 * @param selfId 适配器名称
 * @param address 适配器地址
 */
export const unregisterBot = (selfId: string, address?: string) => {
  let index
  if (address) {
    index = list.findIndex(({ adapter }) => adapter.name === selfId && adapter.address === address)
  } else {
    index = list.findIndex(({ adapter }) => adapter.name === selfId)
  }
  if (index !== -1) {
    list.splice(index, 1)
    return true
  }
  return false
}

/**
 * 获取注册的适配器列表
 * @returns 适配器列表
 */
export const getAdapterList = () => list

/**
 * 获取注册的适配器数量
 * @returns 适配器数量
 */
export const getAdapterCount = () => list.length

/**
 * 获取适配器
 * @param name 适配器名称
 * @returns 适配器
 */
export const getAdapter = (name: string) => list.find(item => item.adapter.name === name)

/**
 * 根据BotId获取适配器
 * @param botId BotId
 * @returns 适配器
 */
export const getAdapterByBotId = (botId: string) => list.find(item => item.selfId === botId)
