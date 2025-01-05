import { listeners } from '@/core/internal'
import type { Server } from '@/types/config'

/** http post bot列表 */
const botList = new Map<string, { token: string, isAuth: true } | { token: null, isAuth: false }>()

/**
 * @description 注册一个http post bot
 * @param selfId 机器人ID
 * @param token 鉴权token 用于校验请求是否合法
 */
export const registerHttpBot = (selfId: string, token?: string) => {
  if (!token) {
    botList.set(selfId, { token: null, isAuth: false })
  } else {
    botList.set(selfId, { token, isAuth: true })
  }

  logger.debug(`[service][onebot-post][注册Bot] ${selfId}`)
}

/**
 * @description 卸载一个http post bot
 * @param selfId 机器人ID
 */
export const unregisterHttpBot = (selfId: string) => {
  botList.delete(selfId)
  logger.debug(`[service][onebot-post][卸载Bot] ${selfId}`)
}

/**
 * @description 获取鉴权token
 * @param selfId 机器人ID
 */
export const getHttpBotToken = (selfId: string) => {
  return botList.get(selfId)
}

/**
 * @description 更新鉴权token
 * @param selfId 机器人ID
 * @param token 鉴权token
 */
export const updateHttpBotToken = (selfId: string, token?: string) => {
  const bot = botList.get(selfId)
  if (!bot) return
  if (!token) {
    botList.set(selfId, { token: null, isAuth: false })
    return
  }

  botList.set(selfId, { token, isAuth: true })
}

listeners.on('watch:file', (type: string, old: Server, data: Server) => {
  if (type !== 'server') return

  if (!data.onebotHttp || !Array.isArray(data.onebotHttp)) {
    logger.debug('没有配置onebotHttp 已跳过')
    return true
  }

  for (let { selfId, api, token } of data.onebotHttp) {
    if (selfId === 'default') {
      continue
    }

    selfId = String(selfId)
    token = String(token)
    if (!selfId || !api || !api.startsWith('http')) {
      logger.bot('error', selfId, '请配置正确的 onebot http 信息')
      continue
    }
    updateHttpBotToken(selfId, token)
  }
})
