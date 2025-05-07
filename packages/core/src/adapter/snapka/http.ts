import axios from 'axios'
import path from 'node:path'
import crypto from 'node:crypto'
import { getRenderCfg } from '@/utils/config'
import { renderTemplate } from '../render/admin/template'
import { unregisterRender, registerRender } from '../render/admin/cache'

import type { Renders } from '@/types'
import type { Snapka } from '../render'

const snapkaMap = new Map<string, { close: () => void, pingTimer?: NodeJS.Timeout }>()

/**
 * 创建snapka http
 * @param options 配置
 */
export const createSnapkaHttp = async (options: Renders['http_server'][number]) => {
  if (!options.isSnapka || !options.enable) return

  const authorization = `Bearer ${crypto.createHash('sha256').update(options.token).digest('hex')}`
  /** 测试是否可以连接 */
  const url = path.dirname(options.url) + `/ping?token=${authorization}`

  const test = async () => {
    try {
      const result = await axios.get(url)
      return result.data
    } catch (error) {
      return false
    }
  }

  /** 初始化前先ping测试连接 */
  const pingResult = await test()
  if (!pingResult) {
    logger.error(`无法连接到 Snapka-http 服务: ${options.url}，将在后台继续尝试连接`)
  }

  /**
   * 截图函数
   */
  const render = async <T extends Snapka> (data: T) => {
    data = renderTemplate(data)
    try {
      const result = await axios.post(options.url, data, {
        headers: {
          Authorization: authorization,
        },
      })
      if (result.status === 200 && result.data?.code === 200) {
        return result.data.data
      }
      throw new Error('请求失败:', { cause: result.data })
    } catch (error) {
      logger.error(`Snapka-http 服务请求异常: ${options.url}`, error)
      throw error
    }
  }

  /** ping定时器 */
  let pingTimer: NodeJS.Timeout | undefined
  /** 连续失败次数 */
  let consecutiveFailures = 0
  /** 注册render */
  const index = registerRender('snapka-http', render)

  /**
   * 关闭snapka http
   */
  const close = () => {
    if (pingTimer) {
      clearInterval(pingTimer)
      pingTimer = undefined
    }
    snapkaMap.delete(options.url)
    unregisterRender(index)
  }

  /**
   * 启动ping检测
   */
  const startPingInterval = () => {
    pingTimer = setInterval(async () => {
      const isAlive = await test()
      if (isAlive) {
        if (consecutiveFailures > 0) {
          logger.info(`Snapka-http 服务 ${options.url} 恢复连接`)
          consecutiveFailures = 0
        }
      } else {
        consecutiveFailures++
        logger.error(`Snapka-http 服务连接异常 (${consecutiveFailures}次): ${options.url}，将继续尝试重连`)
      }
    }, 10000)
  }

  startPingInterval()
  snapkaMap.set(options.url, { close, pingTimer })

  return {
    render,
    close,
  }
}

/**
 * 初始化snapka http
 */
export const initSnapkaHttp = async () => {
  const cfg = getRenderCfg()
  for (const options of cfg.http_server) {
    await createSnapkaHttp(options)
  }
}

/**
 * 断开snapka http
 * @param url 地址
 */
export const disconnectSnapkaHttp = (url: string) => {
  const handler = snapkaMap.get(url)
  if (handler) {
    handler.close()
  }
}
