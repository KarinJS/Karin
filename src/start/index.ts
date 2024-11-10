export * as common from '@/utils/common'
export * as config from '@/utils/config'
import * as config from '@/utils/config'
export * from '@service/server'

import { createLogger } from '@/utils/logger/logger'
import { loaderPlugin } from '@plugin/loader'
import { createWebSocketServer } from '@service/server'
import { createExpressWebSocketServer, startServer } from '../server/app'

/** 日志管理器 */
export let logger: ReturnType<typeof createLogger>
/** express服务 */
export let app: ReturnType<typeof createExpressWebSocketServer>['app']

/**
 * 初始化karin
 */
export const run = async () => {
  config.init()
  logger = createLogger({ log4jsCfg: config.config().log4jsCfg })

  logger.mark('Karin 启动中...')
  logger.mark(`当前版本: ${process.env.karin_app_version}`)
  logger.mark('https://github.com/KarinJS/Karin')

  const [
    inputService,
    adapterService,
  ] = await Promise.all([
    import('../adapter/input'),
    import('../service/adapter'),
    loaderPlugin(),
    import('@adapter/onebot/server'),
  ])

  const port = config.port()
  const { app: appServe, wss: wssServe, server: httpServe } = createExpressWebSocketServer(port, config.rootMsg())
  app = appServe
  createWebSocketServer(wssServe)
  await startServer(httpServe, appServe, config.host(), port)
  adapterService.registerBot('internal', new inputService.AdapterInput())

  await new Promise((resolve) => setTimeout(resolve, 50))
  logger.info(`Karin启动完成：耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
}
