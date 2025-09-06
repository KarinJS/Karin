import fs from 'node:fs'
import axios from 'axios'
import lodash from 'lodash'
import { URL, fileURLToPath } from 'node:url'
import { WebSocket } from 'ws'
import crypto from 'node:crypto'
import { listeners } from '@/core/internal'
import { sendWsScreenshotRequest } from './request'
import { renderTemplate } from '../render/admin/template'
import { unregisterRender, registerRender } from '../render/admin/cache'
import { createWsResponseKey } from './key'
import { isPublic } from '@/utils/fs/static'

import type { Renders } from '@/types'
import type { Snapka, SnapkaResult } from '../render'

/** 前缀 */
const PREFIX = '[snapka-ws-clinet] '
/** 客户端缓存 */
const snapkaMap = new Map<string, { client: WebSocket, close: () => void }>()

/**
 * 创建snapka客户端
 * @param clientOptions 客户端配置
 * @returns 客户端
 */
export const createSnapkaClient = (
  clientOptions: Renders['ws_client'][number]
) => {
  let index = -1
  let isReconnect = true
  let reconnectTimer: NodeJS.Timeout | undefined

  /** 客户端配置 */
  const { enable, url, token, reconnectTime = 5000, heartbeatTime = 30000, isSnapka = false } = clientOptions
  /** 如果未启用或不是snapka模式则直接返回 */
  if (!enable || !isSnapka) return
  /** 生成鉴权 */
  const authorization = token ? `Bearer ${crypto.createHash('sha256').update(token).digest('hex')}` : undefined

  /**
   * 关闭客户端
   */
  const close = () => {
    isReconnect = false
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = undefined
    }
    client?.close()
    snapkaMap.delete(url)
  }

  /**
   * 创建客户端
   */
  const client = token
    ? new WebSocket(url, {
      headers: {
        authorization: `Bearer ${crypto.createHash('sha256').update(token).digest('hex')}`,
      },
    })
    : new WebSocket(url)

  /**
   * 关闭客户端
   */
  const fnc = (isPrint = true) => {
    client.removeAllListeners()
    client?.close()
    index > 0 && unregisterRender(index)
    if (!isReconnect) {
      isPrint && logger.error(`${PREFIX}连接关闭: ${url}`)
      return
    }

    isPrint && logger.error(`${PREFIX}连接关闭: ${url} ${reconnectTime / 1000}s 后重连...`)
    reconnectTimer = setTimeout(() => createSnapkaClient(clientOptions), reconnectTime)
  }

  client.once('open', () => {
    const timer = setInterval(() => client.ping(), heartbeatTime)
    if (snapkaMap.has(url)) snapkaMap.get(url)?.close()
    snapkaMap.set(url, { client, close })

    client.once('close', () => {
      clearInterval(timer)
      fnc()
    })

    setTimeout(() => {
      if (client.readyState !== WebSocket.OPEN) return
      logger.info(`${PREFIX}连接成功: ${url}`)
      index = registerRender('snapka', render)
      client.on('message', async (event) => onMessage(client, url, event, authorization))
    }, 3000)
  })

  client.on('error', (error) => {
    logger.error(`${PREFIX}连接错误: ${error}`)
    fnc(false)
  })

  /**
   * 截图函数
   */
  const render = <T extends Snapka> (options: T) => {
    options = renderTemplate(options)
    return sendWsScreenshotRequest<SnapkaResult<T>>(client, options)
  }

  return {
    render,
    close,
  }
}

/**
 * 收到消息事件
 * @param client 客户端
 * @param url 地址
 * @param event 事件
 * @param authorization 授权
 */
const onMessage = async (
  client: WebSocket,
  url: string,
  event: WebSocket.RawData,
  authorization?: string
) => {
  const raw = event.toString()
  // const { type, retcode, status, echo, data } = JSON.parse(raw)
  const options = JSON.parse(raw)
  logger.debug(`${PREFIX}收到消息: ${lodash.truncate(raw, { length: 300 })}`)
  if (options.type === 'response') {
    const key = createWsResponseKey(options.echo)
    return listeners.emit(key, options)
  }

  if (options.type !== 'request') {
    return logger.error(`${PREFIX}收到未知消息: ${raw}`)
  }

  if (options.action === 'uploadFile') {
    const file = fileURLToPath(options.params.path)
    logger.debug(`${PREFIX}收到上传文件请求: ${options.params.path}`)
    if (!isPublic(file)) {
      logger.error(`${PREFIX}上传文件失败: 非法的路径，${file} 没有处于允许静态资源目录下`)
      /** 失败了需要发一个响应 不然snapka会一直等待 */
      client.send(JSON.stringify({
        type: 'response',
        action: 'uploadFile',
        echo: options.echo,
        status: 'failed',
        data: '非法的路径，没有处于允许静态资源目录下',
      }))
      return
    }

    const target = new URL(url)
    target.protocol = url.startsWith('wss') ? 'https:' : 'http:'
    target.pathname = options.params.uploadPath

    try {
      await axios.post(target.toString(),
        {
          echo: options.echo,
          file: `base64://${fs.readFileSync(file, 'base64')}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authorization,
          },
        })
    } catch (error) {
      logger.error(new Error(`${PREFIX}上传文件失败: ${error}`, { cause: error }))
      /** 失败了需要发一个响应 不然snapka会一直等待 */
      client.send(JSON.stringify({
        type: 'response',
        action: 'uploadFile',
        echo: options.echo,
        status: 'failed',
        data: (error as Error).message,
      }))
    }
  }
}

/**
 * 初始化snapka客户端
 */
export const initSnapkaClient = async () => {
  const { getRenderCfg } = await import('@/utils/config')
  const cfg = getRenderCfg()
  cfg.ws_client.forEach((item) => {
    createSnapkaClient(item)
  })
}

/**
 * 断开snapka客户端
 * @param url 地址
 */
export const disconnectSnapkaClient = (url: string) => {
  const cache = snapkaMap.get(url)
  if (!cache) return
  cache.close()
  snapkaMap.delete(url)
}

/**
 * 新增snapka客户端
 * @param clientOptions 客户端配置
 */
export const addSnapkaClient = (clientOptions: Renders['ws_client'][number]) => {
  createSnapkaClient(clientOptions)
}
