import express from 'express'
import type { Express } from 'express'
import { createServer } from 'node:http'

/** express 服务 */
export const app: Express = express()
/** http 服务 */
export const server = createServer(app)

/**
 * 监听端口
 * @param port 监听端口
 * @param host 监听地址
 */
export const listen = (port: number, host: string) => {
  server.listen(port, host, () => {
    logger.info(`[server] express 已启动 正在监听: http://${host}:${port}`)
  })
}
