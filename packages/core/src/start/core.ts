import dotenv from 'dotenv'
import path from 'node:path'
import paths from '@karinjs/paths'
import { initDB } from '../db'
import { core } from '@karinjs/plugin'
import { ONLINE } from '@karinjs/envs'
import { emitter } from '@karinjs/events'
import { initProcess } from '@karinjs/utils'
import { config, createSystemConfig } from '../config'
import { createDB, createRedis, createTaskDB } from '@karinjs/db'
import { configureLogger } from '@karinjs/logger'
import { registerBot } from '../bot'

let isStart = false
if (!process.env.EBV_FILE) process.env.EBV_FILE = '.env'

/**
 * @public
 * @description 启动框架
 */
export const start = async () => {
  if (isStart) {
    throw new Error(`karin 已经启动，请勿重复启动: ${process.pid}`)
  }

  isStart = true

  /**
   * 1. 加载环境变量
   * - 加载环境变量到process.env
   * - 默认从.env文件加载
   */
  dotenv.config({ path: `${path.resolve(process.cwd(), process.env.EBV_FILE!)}`, override: true })

  /**
   * 2. 初始化日志模块
   * - 创建日志目录
   * - 初始化日志模块
   */
  configureLogger(paths.karinPathLogs)

  /**
   * 3. 初始化配置文件
   * - 初始化基本文件目录
   * - 读取package.json
   * - 设置版本号到环境变量
   * - 设置运行环境到环境变量
   * - 清空dir.consolePath目录 保留目录
   * - 生成配置文件给予用户编辑
   * - 初始化配置文件缓存
   */
  await createSystemConfig()
  process.env.KARIN_VERSION = config.pkg().version
  await initDB()

  /**
   * 4. 打印启动日志
   */
  logger.mark('Karin 启动中...')
  logger.mark(`当前版本: ${process.env.KARIN_VERSION}`)
  logger.mark('https://github.com/KarinJS/Karin')

  /**
   * 5. 初始化进程
   * - 捕获异常信号
   * - 检查是否存在后台进程
   * - 关闭后台进程
   */
  await initProcess(+process.env.HTTP_PORT)

  /**
   * 6. 初始化express
   * - 初始化express
   * - 设置路由
   * - 设置静态文件目录
   * - 设置根路径请求
   */
  const { initExpress, initialize } = await import('@karinjs/server')
  await Promise.all([
    initExpress(paths, +process.env.HTTP_PORT, process.env.HTTP_HOST),
    createTaskDB(paths.karinPathTaskDb),
    createRedis(config.redis(), paths.karinPathRedisSqlite3),
    createDB(paths.karinPathKv),
    initialize(),
  ])

  /**
   * 8. 初始化插件
   */
  await core.load()

  /**
   * 9. 加载适配器
   */
  import('@karinjs/adapter-console')
    .then(({ AdapterConsole }) => {
      logger.debug('@karinjs/adapter-console 开始加载...')
      const consoleAdapter = AdapterConsole.getInstance()
      registerBot('other', consoleAdapter)
      logger.debug('@karinjs/adapter-console 加载完成')
    })

  import('@karinjs/adapter-onebot')
    .then(({ OneBotCore }) => {
      logger.debug('@karinjs/adapter-onebot 适配器开始加载...')
      const OneBotAdapter = OneBotCore.getInstance()
      OneBotAdapter.init().then(() => {
        logger.debug('@karinjs/adapter-onebot 适配器加载完成')
      })
    })

  import('@karinjs/render')
    .then(({ initRender }) => {
      logger.debug('@karinjs/render 开始加载...')
      initRender().then(() => {
        logger.debug('@karinjs/render 加载完成')
      })
    })

  // /**
  //  * 10. 清理HTML缓存
  //  */
  // const { startCleanExpiredFiles } = await import('@karinjs/render')
  // startCleanExpiredFiles()

  // /**
  //  * 11. 初始化snapka服务
  //  */
  // const {
  //   initWebSocketPuppeteerServer,
  //   initSnapkaClient,
  //   initSnapkaHttp,
  // } = await import('@/adapter/snapka/index')
  // initWebSocketPuppeteerServer()
  // initSnapkaClient()
  // initSnapkaHttp()
  emitter.emit(ONLINE, {})

  logger.mark(`karin 启动完成: 耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
}
