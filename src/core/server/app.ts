import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import express, { type Express } from 'express'

/**
 * @description 创建 express 服务
 */
export const createExpress = () => {
  const app: Express = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  return app
}

/**
 * @description 创建 WebSocket 服务
 * @param app express 服务
 */
export const createWebSocketServer = (app: Express) => {
  const server = createServer(app)
  const wss = new WebSocketServer({ server })
  return wss
}
