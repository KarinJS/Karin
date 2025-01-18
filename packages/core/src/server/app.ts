import path from 'node:path'
import express from 'express'
import { karinDir } from '@/root'
import { router } from './api/router'
import { createServer } from 'node:http'
import { listeners } from '@/core/internal'
import { authMiddleware } from './middleware'

import type { Express } from 'express'

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

  listeners.once('online', () => {
    logger.info(`[server] webui 已启动 正在监听: http://${host}:${port}/web`)
    /** logger会记录到日志文件中 */
    console.log(`[server] http鉴权token: ${logger.green(process.env.HTTP_AUTH_KEY)}`)
    console.log(`[server] ws鉴权token: ${logger.green(process.env.WS_SERVER_AUTH_KEY)}`)
  })
}

/**
 * web 服务
 */
export const web = () => {
  /** web静态文件目录 */
  const webDir = path.join(karinDir, 'dist/web')
  const staticFiles = express.static(webDir)

  /** 所有 /web 开头的路由都指向静态文件 */
  app.use('/web', staticFiles)

  /** 处理 /web 路径下的所有请求，确保 SPA 路由可以正常工作 */
  app.get('/web/*', (req, res) => {
    res.sendFile(path.join(webDir, 'index.html'))
  })

  listeners.once('online', () => {
    /** 处理根路径请求 */
    app.get('/', (req, res) => {
      res.redirect('/web')
    })
  })
}

/** 中间件鉴权 */
app.use(authMiddleware)
app.use('/api/v1', router)
web()
