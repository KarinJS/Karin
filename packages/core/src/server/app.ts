import express from 'express'
import { createServer } from 'node:http'
import { router } from './api/router'
import { router as webRouter } from './api/web/router'
import path from 'path'
import type { Express } from 'express'

/** express 服务 */
export const app: Express = express()
/** http 服务 */
export const server = createServer(app)

// TODO: 静态文件服务
app.use('/web', express.static(path.join(process.cwd(), 'web')))
app.use('/api/web', webRouter)

app.use('/v1', router)

/**
 * 监听端口
 * @param port 监听端口
 * @param host 监听地址
 */
export const listen = (port: number, host: string) => {
  server.listen(port, host, () => {
    logger.info(`[server] express 已启动 正在监听: http://${host}:${port}`)
    /** logger会记录到日志文件中 */
    console.log(`[server] http鉴权token: ${logger.green(process.env.HTTP_AUTH_KEY)}`)
    console.log(`[server] ws鉴权token: ${logger.green(process.env.WS_SERVER_AUTH_KEY)}`)
  })
}
