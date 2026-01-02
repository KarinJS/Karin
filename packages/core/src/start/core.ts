import 'dotenv/config'
import { store } from '@karinjs/store'
import { isDev } from '@karinjs/envs'

let isStart = false

/**
 * 机器人启动类
 * @internal
 * @description 负责管理机器人的启动流程，包括配置加载、日志初始化、数据库连接等
 */
class StartBot {
  /**
   * 获取打印输出对象
   * @returns 包含启动和完成打印方法的对象
   * @description 提供启动和完成时的日志输出方法
   */
  get print () {
    return {
      start: () => {
        logger.mark('Karin 启动中...')
        logger.mark(`当前版本: ${process.env.KARIN_VERSION}`)
        logger.mark('https://github.com/KarinJS/Karin')
      },
      done: () => {
        logger.mark(`karin 启动完成: 耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
      },
    }
  }

  /**
   * 初始化配置和日志系统
   * @returns 返回配置和日志实例对象
   * @description 并行加载配置模块和日志模块，初始化配置并根据配置设置日志系统
   */
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

  /**
   * 初始化数据库连接
   * @param config - 配置实例
   * @returns 返回数据库和Redis实例对象
   * @description 并行创建数据库和Redis连接，返回数据库和Redis实例供后续使用
   */
  async db (config: import('@karinjs/config').Config) {
    const { createDB, createRedis, db, redis } = await import('@karinjs/db')
    await Promise.all([
      createDB(store.core.db),
      createRedis(config.redis(), store.core['redis-sqlite']),
    ])

    return { db, redis }
  }

  /**
   * 初始化管道系统
   * @param logger - 日志实例
   * @returns 返回当前实例以支持链式调用
   * @description 注入日志实例，初始化信号处理，检查并创建管道
   */
  async pipe (logger: import('@karinjs/logger').Logger) {
    const { injectLogger, initSignals, pipe } = await import('@karinjs/core-pipe')
    injectLogger(logger)
    initSignals()
    await pipe.check()
    await pipe.create()
    return this
  }

  /**
   * 加载插件
   * @returns 返回当前实例以支持链式调用
   * @description 运行插件加载器，加载所有已安装的插件
   */
  async pluginLoader () {
    const { pluginLoader } = await import('@karinjs/plugin')
    await pluginLoader.run()
    return this
  }

  /**
   * 设置环境变量
   * @param config - 配置实例
   * @returns 返回当前实例以支持链式调用
   * @description 根据配置设置HTTP服务器相关的环境变量和版本信息
   */
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

  /**
   * 启动控制台适配器
   * @returns 返回当前实例以支持链式调用
   * @description 运行控制台适配器，提供控制台交互功能
   */
  async adapterConsole () {
    const { KARIN_ADAPTER_RUN } = await import('@karinjs/plugin-adapter-console')
    await KARIN_ADAPTER_RUN()
    return this
  }

  /**
   * 启动OneBot适配器
   * @returns 返回当前实例以支持链式调用
   * @description 运行OneBot协议适配器，提供OneBot协议支持
   */
  async adapterOneBot () {
    const { KARIN_ADAPTER_RUN } = await import('@karinjs/plugin-adapter-onebot')
    await KARIN_ADAPTER_RUN()
    return this
  }

  /**
   * 启动HTTP服务器
   * @param config - 配置实例
   * @returns Promise<void>
   * @description 根据配置启动HTTP服务器和WebSocket上下文
   */
  async server (config: import('@karinjs/config').Config) {
    const server = config.server()
    const { runServer, createWebSocketContext } = await import('@karinjs/server')
    await runServer(server.http.port, server.http.host)
    createWebSocketContext()
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

  const run = new StartBot()
  // await run.dotenv()

  const { config, logger } = await run.configAndLogger()
  await run.env(config)
  run.print.start()

  await run.pipe(logger)
  await run.db(config)

  run.server(config)
  run.pluginLoader()
  run.adapterConsole()
  run.adapterOneBot()

  run.print.done()
}
