import path from 'node:path'
import express from 'express'
import { createServer } from 'node:http'
import { router } from './api/router'
import { listeners } from '@/core/internal/listeners'

import type root from '@/root'
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
 */
const listen = (port: number, host: string) => {
  server.listen(port, host, () => {
    logger.info(`[server] express 已启动 正在监听: http://${host}:${port}`)
  })

  listeners.once('online', () => {
    logger.info(`[server] webui 已启动 访问地址: ${logger.green(`http://127.0.0.1:${port}/web`)}`)
    /** logger会记录到日志文件中 */
    console.log(`[server] http鉴权token: ${logger.green(process.env.HTTP_AUTH_KEY)}`)
    console.log(`[server] ws鉴权token: ${logger.green(process.env.WS_SERVER_AUTH_KEY)}`)
  })
}

/**
 * web 服务
 */
const web = (dir: typeof root) => {
  /** web静态文件目录 */
  const webDir = path.join(dir.karinDir, 'dist/web')
  /** 静态文件 */
  app.use('/web', express.static(webDir))
  /** 沙盒数据 一般存储用户头像 */
  app.use('/sandbox/data', express.static(dir.sandboxDataPath))
  /** 沙盒临时文件 一般存储临时文件 */
  app.use('/sandbox/file', express.static(dir.sandboxTempPath))

  /** 处理 /web 路径下的所有请求，确保 SPA 路由可以正常工作 */
  app.get('/web/*', (req, res) => {
    res.sendFile(path.join(webDir, 'index.html'))
  })

  listeners.once('online', () => {
    setTimeout(() => {
      /**
       * 5秒后将所有根路径请求重定向到 /web
       * 等5秒是因为插件可能也使用了部分路由
       */
      app.get('/', (req, res) => {
        res.redirect('/web')
      })
    }, 5000)
  })
}

/**
 * @internal
 * @description 初始化express
 * @param dir root
 * @param port 监听端口
 * @param host 监听地址
 */
export const initExpress = (
  dir: typeof root,
  port: number,
  host: string,
) => {
  app.use('/api/v1', router)
  web(dir)
  listen(port, host)
}
