import { listener } from './listener'
import { logger, common, config } from 'karin/utils'

/**
 * 处理基本事件
 */
export default class Process {
  /**
   * 进程初始化
   */
  static async process (): Promise<Process> {
    /**
     * 监听挂起信号 在终端关闭时触发
     */
    process.once('SIGHUP', async (code) => await this.exit(code))
    /**
     * 监听中断信号 用户按下 Ctrl + C 时触发
     */
    process.once('SIGINT', async (code) => await this.exit(code))
    /**
     * 监听终止信号 程序正常退出时触发
     */
    process.once('SIGTERM', async (code) => await this.exit(code))
    /**
     * 监听退出信号 windows下程序正常退出时触发
     */
    process.once('SIGBREAK', async (code) => await this.exit(code))
    /**
     * 监听退出信号 与 SIGINT 类似，但会生成核心转储
     */
    process.once('SIGQUIT', async (code) => await this.exit(code))
    /**
     * 监听退出信号 Node.js进程退出时触发
     */
    process.once('exit', async (code) => await this.exit(code))
    /**
     * 捕获警告
     */
    process.on('warning', warning => listener.emit('warn', warning))
    /**
     * 捕获错误
     */
    process.on('uncaughtException', error => listener.emit('error', error))
    /**
     * 捕获未处理的Promise错误
     */
    process.on('unhandledRejection', error => listener.emit('error', error))
    return this
  }

  /**
   * 检查后台进程
   */
  static async check (): Promise<Process> {
    const host = `http://localhost:${config.Server.http.port}/api`
    /**
     * 使用api来检查后台
     */
    const res = await common.axios(host + '/info', 'get', { timeout: 100 })
    if (!res) return this

    logger.mark(logger.red('检测到后台进程 正在关闭'))
    /** 发退出信号 */
    await common.axios(host + '/exit', 'get', { timeout: 10 })

    for (let i = 0; i < 50; i++) {
      const res = await common.axios(host + '/info', 'get', { timeout: 100 })
      /** 请求成功继续循环 */
      if (res) continue
      /** 请求异常即代表后台进程已关闭 */
      logger.mark(logger.green('后台进程已关闭'))
      return this
    }

    /**
     * 走到这里说明后台关闭失败
     * 根据配置文件判断是否继续
     */
    logger.error(logger.red('后台进程关闭失败，请手动关闭'))
    if (!config.Config.multi_progress) {
      logger.error(logger.red('当前配置不允许多进程运行，程序即将退出'))
      await this.exit(1)
    }
    logger.error(logger.red('当前配置允许多进程运行，程序继续运行'))
    return this
  }

  /**
   * 退出Karin
   * @param code 退出码
   */
  static async exit (code: any = 0) {
    try {
      const { redis } = await import('karin/db')
      if (redis && redis.save) await redis.save()
      logger.mark(`Karin 已停止运行 运行时间：${common.uptime()} 退出码：${code || '未知'}`)
    } finally {
      process.exit()
    }
  }
}

Process.process()
