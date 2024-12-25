export * from '@/utils'
export * from '@/adapter'
export * from '@/event'
export * from '@/karin'
export * from '@/service'
export * from '@/plugin'
export * from '@adapter/index'
export * from '@/internal/error'
export { app } from '@/server/app'
export { karin as default } from '@/karin'
export { default as axios } from 'axios'
export { default as moment } from 'moment'
export { default as schedule } from 'node-schedule'

import * as config from '@/utils/config'
import { createRedis, createLevelDB } from '@/db'
import { createLogger } from '@/utils/logger/logger'
import { setDefault } from '@/env/env'
import { processHandler, checkProcess } from '@/internal/process'
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
export let logger = createLogger()
/** redis服务 */
export let redis: Client
/** level服务 */
export let level: LevelDB

/**
 * 初始化karin
 */
export const run = async () => {
  processHandler()
  config.init()
  logger = createLogger({ log4jsCfg: config.config().log4jsCfg })
  listeners.on('error', (error: unknown) => logger.error(error))

  logger.mark('Karin 启动中...')
  logger.mark(`当前版本: ${process.env.karin_app_version}`)
  logger.mark('https://github.com/KarinJS/Karin')

  setDefault()
  await checkProcess(config.port())
  const [
    redisClient,
    levelClient,
  ] = await Promise.all([createRedis(), createLevelDB()])

  redis = redisClient
  level = levelClient
  const [
    { AdapterConsole },
    { registerBot },
  ] = await Promise.all([
    import('@adapter/input'),
    import('@/service/bot'),
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
  createWebSocketServer(wssServe)
  await startServer(httpServe, appServe, config.host(), port)
  registerBot('internal', new AdapterConsole())
  logger.info(`Karin启动完成：耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
}
