import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import { createServer } from 'node:http'
import { createBrotliDecompress } from 'node:zlib'
import getMimeType from '../utils/getMimeType'
import { rootRouter } from '../system/root'
import { listeners } from '@/core/internal/listeners'
import { router } from '../router'
import { BASE_ROUTER } from '../router/router'

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
    logger.info(`[server] webui 已启动 访问地址: ${logger.green(`http://127.0.0.1:${port}/web/login?token=${process.env.HTTP_AUTH_KEY}`)}`)
    logger.info(`[server] http鉴权token: ${logger.green(process.env.HTTP_AUTH_KEY)}`)
    logger.info(`[server] ws鉴权token: ${logger.green(process.env.WS_SERVER_AUTH_KEY)}`)
    logger.info(`[server] OneBot11: ${logger.green(`ws://127.0.0.1:${port}`)}`)
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

  listeners.once('online', () => {
    setTimeout(() => {
      /**
       * 5秒后将所有根路径请求重定向到 /web
       * 等5秒是因为插件可能也使用了部分路由
       */
      app.all('/{*splat}', (_, res) => {
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
export const initExpress = async (
  dir: typeof root,
  port: number,
  host: string
) => {
  const webDir = path.join(dir.karinDir, 'dist/web')
  app.use('/web', (req, res, next) => {
    const filePath = path.join(webDir, req.path)
    const brPath = `${filePath}.br`
    const acceptEncoding = req.headers['accept-encoding'] || ''

    if (fs.existsSync(brPath)) {
      if (acceptEncoding.includes('br')) {
        // 客户端支持 Brotli，直接返回 br 文件
        res.set({
          'Content-Encoding': 'br',
          'Content-Type': getMimeType(req.path),
          'Cache-Control': 'public, max-age=604800',
        })
        req.url = `${req.url}.br`
        return express.static(webDir)(req, res, next)
      } else {
        // 客户端不支持 Brotli，动态解压后返回原始内容（异步）
        res.set({
          'Content-Encoding': 'identity',
          'Content-Type': getMimeType(req.path),
          'Cache-Control': 'public, max-age=604800',
        })
        const readStream = fs.createReadStream(brPath)
        const decompressStream = createBrotliDecompress()
        readStream.pipe(decompressStream).pipe(res)
        return
      }
    }

    next()
  })

  await import('./ws')

  app.use(BASE_ROUTER, router)
  app.get('/', rootRouter)
  web(dir)
  listen(port, host)
}
