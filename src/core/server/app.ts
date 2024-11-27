import express, { type Express } from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'

/**
 * @description 创建 express、WebSocketServer 服务
 * @param port 端口号
 * @param list `/` 路由返回的随机消息列表
 */
export const createExpressWebSocketServer = (port: number, list?: string[]) => {
  const app: Express = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  if (!list || list.length === 0) {
    list = [
      '愿此行，终抵群星。',
      '就像你带我回家那样，我会带你回家。',
      '该踏上新的旅途了。在不远的将来，你坚信自己能找到所有问题的答案。',
      '每一颗星星，都是一个奇迹！',
      '了解的事越多，就越喜欢这片星空。',
      '目标就如星辰一般，并非都是遥不可及哟。',
      '雪霁银妆素，桔高映琼枝。',
      '若知是梦何须醒，不比真如一相会。',
    ]
  }
  app.get('/info', (req, res) => {
    const msg = list[Math.floor(Math.random() * list.length)]
    res.status(200).send({ code: 0, msg })
  })

  const server = createServer(app)
  /**
   * tips: 这里必须要这样 否则编译出来的d.ts会变成以下类型
   * ```ts
   * import("ws").Server<typeof import("ws"), typeof import("http").IncomingMessage>
   * // => 命名空间“"./node_modules/.pnpm/@types+ws@8.5.13/node_modules/@types/ws/index"”没有已导出的成员“Server”。
   * ```
   */
  const wss: import('ws').WebSocketServer = new WebSocketServer({ server })

  wss.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.fatal(`[service][websocket] 端口 ${port} 已被占用，无法启动 WebSocket 服务`)
    } else {
      logger.fatal(`[service][websocket] WebSocket服务启动失败: ${error.message}`)
    }

    throw error
  })

  return {
    /** express 服务 */
    app,
    /** WebSocketServer 服务 */
    wss,
    /** http 服务 */
    server,
  }
}

/**
 * @description 启动 http 服务
 * @param httpServe express 服务
 * @param host 主机地址
 * @param port 端口号
 */
export const startServer = async (httpServe: ReturnType<typeof createExpressWebSocketServer>['server'], app: Express, host: string, port: number) => {
  const list = await import('./api')
  for (const key in list) {
    if (key === 'onebot') {
      app.post('/', (req, res) => list[key as keyof typeof list](req, res))
      app.post(`/${key}`, (req, res) => list[key as keyof typeof list](req, res))
      continue
    }
    app.get(`/${key}`, (req, res) => list[key as keyof typeof list](req, res))
  }

  httpServe.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.fatal(`[service][express] 端口 ${port} 已被占用，无法启动 http 服务`)
    } else {
      logger.fatal(`[service][express] http服务启动失败: ${error.message}`)
    }

    throw error
  })

  httpServe.listen(port, host, () => {
    logger.info(`[service][express] http服务启动成功，正在监听: http://${host}:${port}`)
  })
}
