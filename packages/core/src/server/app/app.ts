import path from 'node:path'
import express from 'express'
import { ONLINE } from '@/env'
import { router } from '../router'
import { createServer } from 'node:http'
import { rootRouter } from '../system/root'
import { BASE_ROUTER } from '../router/router'
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
    logger.info(`[server] express 正在监听: http://${host}:${port}`)
  })

  listeners.once(ONLINE, () => {
    logger.info('\n--------------------^_^--------------------')
    logger.info(`[server] ${logger.yellow('WebUI 访问地址:')} ${logger.green(`http://127.0.0.1:${port}/web/login?token=${process.env.HTTP_AUTH_KEY}`)}`)
    logger.info(`[server] HTTP  鉴权秘钥: ${logger.green(process.env.HTTP_AUTH_KEY)}`)
    logger.info(`[server] WS    鉴权秘钥: ${logger.green(process.env.WS_SERVER_AUTH_KEY) || logger.yellow('没有设置鉴权秘钥')}`)
    logger.info('-------------------------------------------')
    logger.info(`[OneBot] ${logger.yellow('协议端连接地址:')} ${logger.green(`ws://127.0.0.1:${process.env.HTTP_PORT}`)}`)
    logger.info(`[puppet] 渲染器连接地址: ${logger.green(`ws://127.0.0.1:${process.env.HTTP_PORT}/puppeteer`)}`)
    logger.info('\n-------------------------------------------')
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
  app.get('/web/{*splat}', (_, res) => {
    res.sendFile('index.html', {
      root: path.resolve(webDir),
    })
  })

  /**
   * 不注册全局兜底重定向。
   * 插件可能会在启动后挂载自己的 Web 路由，例如 /my-plugin。
   * 如果这里把所有未命中的路径重定向到 /web，会导致插件 WebUI 被 Karin WebUI 吞掉。
   */
}

/**
 * @internal
 * @description 初始化express
 * @param dir root
 * @param port 监听端口
 * @param host 监听地址
 */
export const initExpress = async (
  dir: typeof root,
  port: number,
  host: string
) => {
  await import('./ws')

  app.use(BASE_ROUTER, router)
  app.get('/', rootRouter)
  web(dir)
  listen(port, host)
}
