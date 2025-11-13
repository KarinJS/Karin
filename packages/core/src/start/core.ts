import 'dotenv/config'
import path from 'node:path'
import { store } from '@karinjs/store'
import { isDev } from '@karinjs/envs'
// import paths from '@karinjs/store'
// import { initDB } from '../db'
// import { pluginLoader } from '@karinjs/plugin'
// import { ONLINE } from '@karinjs/envs'
// import { emitter } from '@karinjs/events'
// import { createSystemConfig } from '../config'
// import { createDB, createRedis, createTaskDB } from '@karinjs/db'
// import { configureLogger } from '@karinjs/logger'
// import { registerBot } from '../bot'
// import { initSignals, injectLogger, pipe } from '@karinjs/plugin-process'

let isStart = false
if (!process.env.EBV_FILE) process.env.EBV_FILE = '.env'

class InitBot {
  async dotenv () {
    const { default: dotenv } = await import('dotenv')
    const envFile = process.env.ENV_FILE || process.env.EBV_FILE || '.env'
    dotenv.config({ path: `${path.resolve(process.cwd(), envFile)}`, override: true })
    return this
  }

  async configAndLogger () {
    const [
      { config },
      { logger, configureLogger },
    ] = await Promise.all([
      import('@karinjs/config'),
      import('@karinjs/logger'), // 导入的原因是先加载一个默认的日志模块 因为读取配置需要日志
    ])

    await config.init()
    const loggerCfg = config.logger()
    const opt = {
      dir: store.core.logs,
      isDev: isDev(),
      color: loggerCfg.fnc_color,
      level: loggerCfg.level as 'info',
      daysToKeep: loggerCfg.days_to_keep,
    }
    configureLogger(opt)
    return { config, logger }
  }

  async db (config: import('@karinjs/config').Config) {
    const { createDB, createRedis, db, redis } = await import('@karinjs/db')
    await Promise.all([
      createDB(store.core.db),
      createRedis(config.redis(), store.core['redis-sqlite']),
    ])

    return { db, redis }
  }

  async pipe (logger: import('@karinjs/logger').Logger) {
    const { injectLogger, initSignals, pipe } = await import('@karinjs/plugin-process')
    injectLogger(logger)
    initSignals()
    await pipe.check()
    await pipe.create()
    return this
  }

  async pluginLoader () {
    const { pluginLoader } = await import('@karinjs/plugin')
    await pluginLoader.run()
    return this
  }

  async env (config: import('@karinjs/config').Config) {
    const server = config.server()
    process.env.HTTP_HOST = String(server.http.host)
    process.env.HTTP_PORT = String(server.http.port)
    process.env.HTTP_AUTH_KEY = String(server.http.auth_key)
    process.env.HTTP_WEBUI_USER = String(server.http.username)
    process.env.HTTP_WEBUI_KEY = String(server.http.password)

    const { version } = config.pkg()

    process.versions.karin = version
    process.env.VERSION = version
    process.env.KARIN_VERSION = version
    return this
  }

  async adapterConsole (logger: import('@karinjs/logger').Logger) {
    const name = '@karinjs/plugin-adapter-console' as const
    const { AdapterConsole } = await import('@karinjs/plugin-adapter-console')
    logger.debug(`${name} 开始加载...`)
    const consoleAdapter = AdapterConsole.getInstance()
    await consoleAdapter.init()
    const { registerBot } = await import('../bot')
    registerBot('other', consoleAdapter)
    logger.debug(`${name} 加载完成~`)
    return this
  }
}

/**
 * @public
 * @description 启动框架
 */
export const start = async () => {
  if (isStart) {
    throw new Error(`karin 已经启动，请勿重复启动: ${process.pid}`)
  }

  isStart = true

  const initializer = new InitBot()
  await initializer.dotenv()
  const { config, logger } = await initializer.configAndLogger()
  await initializer.env(config)

  logger.mark('Karin 启动中...')
  logger.mark(`当前版本: ${process.env.KARIN_VERSION}`)
  logger.mark('https://github.com/KarinJS/Karin')

  await initializer.pipe(logger)
  await initializer.db(config)
  initializer.pluginLoader()
  initializer.adapterConsole(logger)
  // /**
  //  * 3. 初始化配置文件
  //  * - 初始化基本文件目录
  //  * - 读取package.json
  //  * - 设置版本号到环境变量
  //  * - 设置运行环境到环境变量
  //  * - 清空dir.consolePath目录 保留目录
  //  * - 生成配置文件给予用户编辑
  //  * - 初始化配置文件缓存
  //  */
  // await createSystemConfig()
  // process.env.VERSION = config.pkg().version
  // process.env.KARIN_VERSION = config.pkg().version
  // await initDB()

  // /**
  //  * 4. 打印启动日志
  //  */
  // logger.mark('Karin 启动中...')
  // logger.mark(`当前版本: ${process.env.KARIN_VERSION}`)
  // logger.mark('https://github.com/KarinJS/Karin')

  // /**
  //  * 5. 初始化进程
  //  * - 捕获异常信号
  //  * - 检查是否存在后台进程
  //  * - 关闭后台进程
  //  */
  // injectLogger(logger)
  // initSignals()
  // await pipe.check()
  // await pipe.create()

  // /**
  //  * 6. 初始化express
  //  * - 初始化express
  //  * - 设置路由
  //  * - 设置静态文件目录
  //  * - 设置根路径请求
  //  */
  // const { initExpress, initialize } = await import('@karinjs/server')
  // await Promise.all([
  //   initExpress(paths, +process.env.HTTP_PORT, process.env.HTTP_HOST),
  //   createTaskDB(paths.karinPathTaskDb),
  //   createRedis(config.redis(), paths.karinPathRedisSqlite3),
  //   createDB(paths.karinPathKv),
  //   initialize(),
  // ])

  // /**
  //  * 8. 初始化插件
  //  */
  // pluginLoader.run()

  // /**
  //  * 9. 加载适配器
  //  */
  // import('@karinjs/plugin-adapter-console')
  //   .then(({ AdapterConsole }) => {
  //     logger.debug('@karinjs/plugin-adapter-console 开始加载...')
  //     const consoleAdapter = AdapterConsole.getInstance()
  //     registerBot('other', consoleAdapter)
  //     logger.debug('@karinjs/plugin-adapter-console 加载完成')
  //   })

  // import('@karinjs/adapter-onebot')
  //   .then(({ OneBotCore }) => {
  //     logger.debug('@karinjs/adapter-onebot 适配器开始加载...')
  //     const OneBotAdapter = OneBotCore.getInstance()
  //     OneBotAdapter.init().then(() => {
  //       logger.debug('@karinjs/adapter-onebot 适配器加载完成')
  //     })
  //   })

  // import('@karinjs/render')
  //   .then(({ initRender }) => {
  //     logger.debug('@karinjs/render 开始加载...')
  //     initRender().then(() => {
  //       logger.debug('@karinjs/render 加载完成')
  //     })
  //   })

  // // /**
  // //  * 10. 清理HTML缓存
  // //  */
  // // const { startCleanExpiredFiles } = await import('@karinjs/render')
  // // startCleanExpiredFiles()

  // // /**
  // //  * 11. 初始化snapka服务
  // //  */
  // // const {
  // //   initWebSocketPuppeteerServer,
  // //   initSnapkaClient,
  // //   initSnapkaHttp,
  // // } = await import('@/adapter/snapka/index')
  // // initWebSocketPuppeteerServer()
  // // initSnapkaClient()
  // // initSnapkaHttp()
  // emitter.emit(ONLINE, {})

  logger.mark(`karin 启动完成: 耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
}
