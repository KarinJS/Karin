import express from 'express'
import { logger } from '@karinjs/logger'
import { createServer } from 'node:http'
import { getAvailablePort, isPortFree } from '../utils'

import type { Express } from 'express'

/**
 * @public
 * @description express 服务
 */
export const app: Express = express()
/**
 * @public
 * @description http 服务
 */
export const server = createServer(app)

/**
 * 监听端口
 * @param port 监听端口
 * @param host 监听地址
 * @returns http 服务实例
 */
export const runServer = async (port: number, host: string) => {
  if (await isPortFree(host, port)) {
    server.listen(port, host, () => {
      logger.info(`express 正在监听: http://${host}:${port}`)
    })
    return
  }

  logger.warn(`端口 ${port} 已被占用, 正在寻找可用端口...`)
  const availablePort = await getAvailablePort(host, port, 50)
  if (!availablePort) {
    logger.fatal(`已尝试寻找50次, 未能找到可用端口, 请释放端口 ${port} 后重试`)
    process.exit(1)
  }

  logger.mark(`找到可用端口: ${logger.green(availablePort)}, 正在启动服务...`)
  server.listen(availablePort, host, () => {
    logger.info(`express 正在监听: http://${host}:${availablePort}`)
  })
}
