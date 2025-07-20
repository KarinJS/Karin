import path from 'node:path'
import '@/service/debug'
import dotenv from 'dotenv'
import root from '@/root'
import { ONLINE } from './env'
import { initConfig } from '@/utils/config/init'
import { initProcess } from './service/process'
import { initPlugin } from './plugin'
import { printStartLog } from './service/start'
import { createDB, createRedis } from '@/core/db'
import { initRender } from '@/adapter/render'
import { initOneBotAdapter } from '@/adapter/onebot'
import { initTaskSystem } from '@/service/task'
import { listeners } from './core/internal/listeners'

export * from '@/service/debug'
export * from '@/root'
export * from '@/service'
export * from '@/core/karin'
export * from '@/utils'
export * from '@/server'
export * from '@/adapter/onebot'
export * from '@/event'
export * from '@/adapter/render/admin/cache'
export * from '@/adapter/render/admin/types'
export * from '@/components'
export * from '@/hooks'
export { renderTpl } from '@/adapter/render/admin/template'
export { AdapterBase } from '@/adapter/base/index'
export { getPlugins } from '@/plugins/list'
// export { Plugin } from '@/plugin/class'
export { karin as default } from '@/core/karin'
export { db } from '@/core/db/kv'
export { redis } from '@/core/db/redis/redis'
export { logger } from '@/utils/logger'

export type * from '@/types'

let isStart = false
if (!process.env.EBV_FILE) process.env.EBV_FILE = '.env'

/**
 * @public
 * @description 启动框架
 */
export const start = async () => {
  if (isStart) {
    console.error('karin 已经启动，请勿重复启动')
    return
  }

  isStart = true

  /**
   * 1. 加载环境变量
   * - 加载环境变量到process.env
   * - 默认从.env文件加载
   */
  dotenv.config({ path: `${path.resolve(process.cwd(), process.env.EBV_FILE!)}` })

  /**
   * 2. 初始化日志模块
   * - 创建日志目录
   * - 初始化日志模块
   */
  // createInnerLogger(root.logsPath)

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
  await initConfig(root)

  /**
   * 4. 打印启动日志
   */
  printStartLog(process.env.KARIN_VERSION)

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
  const { initExpress } = await import('@/server/app/app')
  const { initialize } = await import('@/server/pty/terminalManager')
  await initExpress(root, +process.env.HTTP_PORT, process.env.HTTP_HOST)
  await initTaskSystem(root.karinPathTaskDb)
  await createRedis()
  await createDB()
  await initialize()
  /**
   * 8. 初始化插件
   */
  await initPlugin()

  /**
   * 9. 加载适配器
   */
  await import('@/adapter')
  await initOneBotAdapter()
  await initRender()

  /**
   * 10. 清理HTML缓存
   */
  const { startCleanExpiredFiles } = await import('@/adapter/render/admin/template')
  startCleanExpiredFiles()

  /**
   * 11. 初始化snapka服务
   */
  const {
    initWebSocketPuppeteerServer,
    initSnapkaClient,
    initSnapkaHttp,
  } = await import('@/adapter/snapka/index')
  initWebSocketPuppeteerServer()
  initSnapkaClient()
  initSnapkaHttp()
  listeners.emit(ONLINE, {})

  logger.mark(`karin 启动完成: 耗时 ${logger.green(process.uptime().toFixed(2))} 秒...`)
}
