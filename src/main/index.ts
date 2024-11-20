export * from '@/utils'
export * from '@/adapter'
export * from '@/event'
export * from '@/karin'
export * from '@/internal/error'
export * from '@/service'
export * from '@/plugin/index'
export * from '@adapter/render/cache'
export { karin as default } from '@/karin'
export { TypedListeners } from '@/internal/listeners'

import * as config from '@/utils/config'
import { createRedis, createLevelDB } from '@/db'
import { createLogger } from '@/utils/logger/logger'
import { processExit, processHandler } from '@/internal/process'
import { loaderPlugin } from '@/plugin/loader'
import { createWebSocketServer } from '@/service/server'
import { createExpressWebSocketServer, startServer } from '../core/server/app'
import { listeners } from '@/internal/listeners'
import { createClient } from '@adapter/onebot/connect/client'
import { createHttp } from '@adapter/onebot/connect/http'
import { createWebSocketRenderClient } from '@adapter/render/connect/client'
import { createHttpRenderClient } from '@adapter/render/connect/http'
import type { LevelDB, Client } from '@/db'

/** 日志管理器 */
export let logger: ReturnType<typeof createLogger>
/** express服务 */
export let app: ReturnType<typeof createExpressWebSocketServer>['app']
/** redis服务 */
export let redis: Client
/** level服务 */
export let level: LevelDB

/**
 * 初始化karin
 */
export const run = async () => {
  config.init()
  logger = createLogger({ log4jsCfg: config.config().log4jsCfg })
  listeners.on('error', (error: any) => logger.error(error))
  listeners.on('exit', ({ code }) => processExit(code))

  logger.mark('Karin 启动中...')
  logger.mark(`当前版本: ${process.env.karin_app_version}`)
  logger.mark('https://github.com/KarinJS/Karin')

  const [
    redisClient,
    levelClient,
  ] = await Promise.all([createRedis(), createLevelDB()])

  redis = redisClient
  level = levelClient
  processHandler()
  const [
    { AdapterInput },
    { registerBot },
  ] = await Promise.all([
    import('@adapter/input'),
    import('@/service/adapter'),
    import('@adapter/onebot/connect/server'),
    import('@adapter/render/connect/server'),
    createClient(),
    createHttp(),
    loaderPlugin(),
    createWebSocketRenderClient(),
    createHttpRenderClient(),
  ])

  const port = config.port()
  const {
    app: appServe,
    wss: wssServe,
    server: httpServe,
  } = createExpressWebSocketServer(port, config.rootMsg())
  app = appServe
  createWebSocketServer(wssServe)
  await startServer(httpServe, appServe, config.host(), port)
  registerBot('internal', new AdapterInput())
  logger.info(`Karin启动完成：耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
}
