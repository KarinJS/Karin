import os from 'node:os'
import fs from 'node:fs'
import dotenv from 'dotenv'
import path from 'node:path'
import { createServer } from 'node:net'
import { fileURLToPath } from 'node:url'
import { fork, ChildProcess } from 'node:child_process'

/**
 * 启动选项
 */
interface StartOptions {
  /** 是否需要重新加载依赖 */
  reloadDeps?: boolean
}

/**
 * 进程消息类型
 */
type ProcessMessageType = 'restart' | 'stop' | string

/**
 * 进程消息结构
 */
interface ProcessMessage {
  type: ProcessMessageType
  reloadDeps?: boolean
}

/**
 * 日志级别
 */
enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

/**
 * 进程管理器 - 负责子进程的生命周期管理
 */
class ProcessManager {
  /** 是否已经启动 */
  private isStarted = false
  /** 是否正在重启 */
  private isRestarting = false
  /** 子进程实例 */
  private childProcess: ChildProcess | null = null
  /** 重启延迟时间 */
  private readonly RESTART_DELAY_MS = 200
  /** 模块名称 */
  private readonly MODULE_NAME = 'ProcessManager'
  /** 启动时间 */
  private startTime = Date.now()
  /** 进程统计信息 */
  private processStats = {
    /** 重启次数 */
    restartCount: 0,
    /** 最后重启时间 */
    lastRestartTime: 0,
  }

  // ANSI 颜色代码
  private readonly COLORS = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    reset: '\x1b[0m',
  }

  constructor () {
    process.on('exit', this.stop.bind(this))
    this.logSystemInfo()
  }

  /**
   * 启动子进程
   */
  public start (options: StartOptions = {}): ChildProcess {
    if (this.isAlreadyRunning()) {
      this.log(`子进程已在运行 | PID: ${this.childProcess!.pid}`)
      return this.childProcess!
    }

    this.isStarted = true
    const entryPath = this.resolveEntryPath()
    const args = options.reloadDeps ? [`--reload-timestamp=${Date.now()}`] : []

    this.childProcess = fork(entryPath, args)
    const pid = this.childProcess.pid

    this.setupEventListeners()
    this.log(`启动子进程 | PID: ${pid} | 入口: ${path.basename(entryPath)} | 参数: ${args.join(' ') || '无'}`)

    return this.childProcess
  }

  /**
   * 重启子进程
   */
  public async restart (reloadDeps = false): Promise<ChildProcess | null> {
    if (!this.childProcess) {
      this.logWarn('重启失败 | 原因: 子进程不存在 | 操作: 直接启动新进程')
      return this.start({ reloadDeps })
    }

    const oldPid = this.childProcess.pid
    this.isRestarting = true
    this.processStats.restartCount++
    this.processStats.lastRestartTime = Date.now()

    this.log(`准备重启子进程 | 当前PID: ${oldPid} | 重载依赖: ${reloadDeps ? '是' : '否'} | 重启次数: ${this.processStats.restartCount}`)

    try {
      await this.terminateChildProcess()
      this.isStarted = false
      const newChild = this.start({ reloadDeps })
      const duration = Date.now() - this.processStats.lastRestartTime

      this.log(`重启完成 | 旧PID: ${oldPid} | 新PID: ${newChild.pid} | 耗时: ${duration}ms`)
      return newChild
    } catch (error: any) {
      if (error.code === 'ESRCH') {
        this.logWarn(`重启过程中发现进程已不存在 | 错误码: ${error.code} | 操作: 启动新进程`)
        this.isStarted = false
        return this.start({ reloadDeps: true })
      }

      this.logError(`重启失败 | 错误: ${error.message} | 代码: ${error.code || '未知'}`)
      return null
    } finally {
      this.isRestarting = false
    }
  }

  /**
   * 停止子进程并退出父进程
   */
  public stop (): void {
    if (this.childProcess) {
      const pid = this.childProcess.pid
      const uptime = this.getProcessUptime()

      this.log(`正在关闭子进程 | PID: ${pid} | 运行时间: ${uptime}`)
      this.terminateChildProcess(false)
      this.childProcess = null
      this.isStarted = false
      this.isRestarting = false
    }

    const totalUptime = this.getTotalUptime()
    this.log(`父进程退出 | 总运行时间: ${totalUptime} | 重启次数: ${this.processStats.restartCount}`)
    process.exit(0)
  }

  /**
   * 检查子进程是否已经在运行
   */
  private isAlreadyRunning (): boolean {
    return this.isStarted && this.childProcess !== null
  }

  /**
   * 设置子进程事件监听器
   */
  private setupEventListeners (): void {
    if (!this.childProcess) return

    this.childProcess.on('message', this.handleChildMessage.bind(this))
    this.childProcess.once('exit', this.handleChildExit.bind(this))
  }

  /**
   * 处理子进程发送的消息
   */
  private async handleChildMessage (message: unknown): Promise<void> {
    if (typeof message !== 'string') return

    try {
      const { type, reloadDeps } = JSON.parse(message) as ProcessMessage

      if (type === 'restart') {
        this.log(`收到消息 | 类型: restart | 重载依赖: ${reloadDeps ? '是' : '否'}`)
        const child = await this.restart(reloadDeps)

        if (!child) {
          this.logWarn('重启操作失败 | 无法获取新的子进程')
        } else {
          this.childProcess = child
        }
        return
      }

      if (type === 'stop') {
        this.log('收到消息 | 类型: stop | 操作: 停止进程')
        this.stop()
        return
      }

      this.logWarn(`收到未知消息 | 类型: ${type || '未知'} | 内容: ${JSON.stringify(message).substring(0, 100)}`)
    } catch (error) {
      this.logError(`消息处理错误 | 原始消息: ${String(message).substring(0, 50)}`, error)
    }
  }

  /**
   * 处理子进程退出事件
   */
  private handleChildExit (code: number | null, signal: string | null): void {
    const exitType = signal ? `信号: ${signal}` : `退出码: ${code ?? '未知'}`
    const uptime = this.getProcessUptime()

    this.log(`子进程退出 | ${exitType} | 运行时间: ${uptime}`)

    if (!this.isRestarting) {
      this.stop()
    }
  }

  /**
   * 等待端口释放
   * @param port - 需要检查的端口号
   * @param maxAttempts - 最大尝试次数
   * @param interval - 检查间隔(ms)
   * @returns 端口是否可用
   */
  private async waitForPortRelease (port: number, maxAttempts = 30, interval = 500): Promise<boolean> {
    const checkPort = (port: number): Promise<boolean> => {
      return new Promise(resolve => {
        const server = createServer()

        server.once('error', () => {
          server.close()
          resolve(false)
        })

        server.once('listening', () => {
          server.close()
          resolve(true)
        })

        server.listen(port, '127.0.0.1')
      })
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const available = await checkPort(port)
      if (available) {
        this.log(`端口 ${port} 已释放，可以使用`)
        return true
      }

      this.logWarn(`端口 ${port} 仍被占用，等待释放... (${attempt + 1}/${maxAttempts})`)
      try {
        // cnm 去死吧
        process.kill(this?.childProcess!.pid!)
      } catch { }
      await new Promise(resolve => setTimeout(resolve, interval))
    }

    this.logError(`端口 ${port} 在 ${maxAttempts} 次尝试后仍被占用`)
    return false
  }

  /**
   * 获取HTTP端口号
   * @returns HTTP端口号
   */
  private getHttpPort (): number {
    try {
      // 读取根目录的.env文件
      const envPath = path.resolve(process.cwd(), '.env')
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath))
        if (envConfig.HTTP_PORT) {
          return Number(envConfig.HTTP_PORT)
        }
      }

      // 如果根目录没有.env文件或没有HTTP_PORT，返回默认值7777
      return 7777
    } catch (error) {
      this.logWarn(`读取HTTP端口失败: ${(error as Error).message}，使用默认端口7777`)
      return 7777
    }
  }

  /**
   * 终止子进程
   */
  private async terminateChildProcess (waitForTermination = true): Promise<void> {
    if (!this.childProcess) return

    try {
      const pid = this.childProcess.pid
      this.log(`发送终止信号 | PID: ${pid} | 信号: SIGTERM`)
      this.childProcess.kill('SIGTERM')

      if (waitForTermination) {
        this.log(`等待进程终止 | PID: ${pid} | 超时: ${this.RESTART_DELAY_MS}ms`)
        await new Promise(resolve => setTimeout(resolve, this.RESTART_DELAY_MS))
      }

      const port = this.getHttpPort()
      await this.waitForPortRelease(port)

      try {
        if (this?.childProcess?.pid) {
          this.log(`确保进程终止 | PID: ${pid} | 发送强制终止信号`)
          process.kill(this.childProcess.pid)
        }
      } catch { /* 忽略进程已终止的错误 */ }
    } catch { /* 忽略终止过程中的错误 */ }
  }

  /**
   * 解析子进程入口文件路径
   */
  private resolveEntryPath (): string {
    const currentFilePath = fileURLToPath(import.meta.url)
    const currentDirPath = path.dirname(currentFilePath)

    const isESM = import.meta.url.includes('.mjs')
    const localEntryPath = path.join(currentDirPath, isESM ? 'app.mjs' : 'app.ts')

    return fs.existsSync(localEntryPath)
      ? localEntryPath
      : path.join(process.cwd(), 'node_modules', 'node-karin', 'dist', 'start', 'app.mjs')
  }

  /**
   * 获取当前时间戳，格式为 HH:MM:SS.mmm
   */
  private getTimestamp (): string {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0')

    return `${hours}:${minutes}:${seconds}.${milliseconds}`
  }

  /**
   * 创建日志前缀
   */
  private createLogPrefix (level: LogLevel): string {
    const timestamp = this.getTimestamp()
    const prefix = `[Karin][${timestamp}][${level}]`

    return `${this.COLORS.green}${prefix}${this.COLORS.reset}`
  }

  /**
   * 获取进程运行时间的友好字符串
   */
  private getProcessUptime (): string {
    if (!this.childProcess?.pid) return '0s'
    const uptime = (Date.now() - this.processStats.lastRestartTime) / 1000

    if (uptime < 60) return `${uptime.toFixed(1)}s`
    if (uptime < 3600) return `${(uptime / 60).toFixed(1)}m`
    return `${(uptime / 3600).toFixed(1)}h`
  }

  /**
   * 获取总运行时间的友好字符串
   */
  private getTotalUptime (): string {
    const uptime = (Date.now() - this.startTime) / 1000

    if (uptime < 60) return `${uptime.toFixed(1)}s`
    if (uptime < 3600) return `${(uptime / 60).toFixed(1)}m`
    return `${(uptime / 3600).toFixed(1)}h`
  }

  /**
   * 输出系统信息
   */
  private logSystemInfo (): void {
    const nodeVersion = process.version
    const platform = `${os.platform()} ${os.release()}`
    const cpus = os.cpus().length
    const memory = `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`

    this.log(`系统信息 | Node: ${nodeVersion} | 平台: ${platform} | CPU核心: ${cpus} | 内存: ${memory}`)
  }

  /**
   * 日志输出方法
   */
  private log (message: string): void {
    console.log(`${this.createLogPrefix(LogLevel.INFO)} [${this.MODULE_NAME}] ${message}`)
  }

  private logWarn (message: string): void {
    console.warn(`${this.createLogPrefix(LogLevel.WARN)} [${this.MODULE_NAME}] ${message}`)
  }

  private logError (message: string, error?: unknown): void {
    console.error(`${this.createLogPrefix(LogLevel.ERROR)} [${this.MODULE_NAME}] ${message}`, error || '')
  }

  // private logDebug(message: string): void {
  //   console.debug(`${this.createLogPrefix(LogLevel.DEBUG)} [${this.MODULE_NAME}] ${message}`)
  // }
}

new ProcessManager().start()
