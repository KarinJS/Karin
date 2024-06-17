import axios from 'axios'

/**
 * 处理基本事件
 */
export default class Process {
  /**
   * @type {import('../index.js').logger}
   */
  logger
  /**
   * @type {import('../index.js').common}
   */
  common
  /**
   * @type {import('../index.js').Config}
   */
  Config

  /**
   * @type {import('../index.js').listener}
   */
  listener

  /**
   * @param {import('../index.js').logger} logger
   * @param {import('../index.js').common} common
   * @param {import('../index.js').Config} Config
   * @param {import('../index.js').listener} listener
   */
  constructor (logger, common, Config, listener) {
    this.logger = logger
    this.common = common
    this.Config = Config
    this.listener = listener
  }

  /**
   * 进程初始化
   * @returns {Process}
   */
  process () {
    /**
     * 启动日志
     */
    this.logger.mark('Karin 启动中...')
    /**
     * 设置标题
     */
    process.title = 'Karin'
    /**
     * 设置时区
     */
    process.env.TZ = 'Asia/Shanghai'
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
    process.on('warning', warning => this.listener.emit('warn', warning))
    /**
     * 捕获错误
     */
    process.on('uncaughtException', error => this.listener.emit('error', error))
    /**
     * 捕获未处理的Promise错误
     */
    process.on('unhandledRejection', error => this.listener.emit('error', error))
    return this
  }

  /**
   * 检查后台进程
   * @returns {Promise<Process>} 是否检测到后台进程
   */
  async check () {
    const host = `http://localhost:${this.Config.Server.http.port}/api`
    /**
     * 使用api来检查后台
     */
    const res = await this.axios(host + '/info', 100)
    if (res) return this

    this.logger.mark(this.logger.red('检测到后台进程 正在关闭'))
    /** 发退出信号 */
    await this.axios(host + '/exit', 10)

    for (let i = 0; i < 50; i++) {
      const res = await this.axios(host + '/info', 100)
      /** 请求成功继续循环 */
      if (!res) continue
      /** 请求异常即代表后台进程已关闭 */
      this.logger.mark(this.logger.green('后台进程已关闭'))
      return this
    }

    /**
     * 走到这里说明后台关闭失败
     * 根据配置文件判断是否继续
     */
    this.logger.error(this.logger.red('后台进程关闭失败，请手动关闭'))
    if (!this.Config.Config.multi_progress) {
      this.logger.error(this.logger.red('当前配置不允许多进程运行，程序即将退出'))
      await this.exit(1)
    }
    this.logger.error(this.logger.red('当前配置允许多进程运行，程序继续运行'))
    return this
  }

  /**
   * 请求
   * @param {string} url
   * @param {number} timeout 超时时间
   * @returns {Promise<boolean>} 是否请求失败
   */
  async axios (url, timeout) {
    try {
      await axios.get(url, { timeout })
      return false
    } catch {
      return true
    }
  }

  /**
   * 退出Karin
   * @param {number} code 退出码
   */
  async exit (code) {
    try {
      const { redis } = await import('#Karin')
      if (redis && redis.save) await redis.save()
      this.logger.mark(`Karin 已停止运行 运行时间：${this.common.uptime()} 退出码：${code || '未知'}`)
    } finally {
      process.exit()
    }
  }
}
