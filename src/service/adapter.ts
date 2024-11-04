import { AdapterCommunication } from '@/adapter/adapter'
import { config } from '@start/index'
import type { AdapterBase } from 'src/adapter/base'

const list: AdapterBase[] = []

interface Type {
  /**
   * 注册Http适配器
   * @param type 适配器类型
   * @param adapter 适配器类
   */
  (type: `${AdapterCommunication.HTTP}`, adapter: AdapterBase): void
  /**
   * 注册反向Websocket适配器
   * @param type 适配器类型
   * @param adapter 适配器类
   * @param path url路径 例如`ws://127.0.0.1:7000/ws/onebot/v11`中的`/ws/onebot/v11`
   */
  (type: `${AdapterCommunication.REVERSE_WEBSOCKET}`, adapter: AdapterBase, path: string): void
  /**
   * 注册正向Websocket适配器
   * @param type 适配器类型
   * @param adapter 适配器类
   */
  (type: `${AdapterCommunication.WEBSOCKET}`, adapter: AdapterBase): void
  /**
   * 注册gRPC适配器
   * @param type 适配器类型
   * @param adapter 适配器类
   */
  (type: `${AdapterCommunication.GRPC}`, adapter: AdapterBase): void
  /**
   * 注册内部适配器
   * @param type 适配器类型
   * @param adapter 适配器类
   */
  (type: `${AdapterCommunication.INTERNAL}`, adapter: AdapterBase): void
}

/**
 * 注册适配器
 * @param cla 适配器类
 */
export const registerBot: Type = (type: `${AdapterCommunication}`, cla: AdapterBase, path?: string) => {
  if (type === AdapterCommunication.REVERSE_WEBSOCKET) {
    cla.adapter.address = `ws://127.0.0.1:${config.port}` + path ? `/${path?.replace(/^\//, '')}` : ''
    logger.info(`[service][注册适配器][反向webSocket] ${cla.adapter.name}: ${cla.adapter.address}`)
  } else if (type === AdapterCommunication.INTERNAL) {
    cla.adapter.address = 'internal://127.0.0.1'
    logger.info(`[service][注册适配器][内部] ${cla.adapter.name}`)
  } else if (type === AdapterCommunication.HTTP) {
    logger.info(`[service][注册适配器][HTTP] ${cla.adapter.name}: ${cla.adapter.address}`)
  } else if (type === AdapterCommunication.WEBSOCKET) {
    logger.info(`[service][注册适配器][正向WebSocket] ${cla.adapter.name}: ${cla.adapter.address}`)
  }

  list.push(cla)
}

/**
 * 卸载适配器
 * @param name 适配器名称
 */
export const unregisterBot = (name: string) => {
  const index = list.findIndex(item => item.adapter.name === name)
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

logger.debug('[service] 适配器服务加载完成')
