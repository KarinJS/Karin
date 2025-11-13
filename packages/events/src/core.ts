/**
 * 事件核心模块
 * 提供系统事件处理、状态监控和各种接口构建功能
 * @module @karinjs/events
 */

import os from 'node:os'
import { EventEmitter } from './emitter'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'

/**
 * 回调处理器 代表链接已被函数接收
 * 5秒内如果这个回调没有触发 说明此ws链接无效
 */
export type CallbackHandler = () => void

export interface SystemEventMap {
  /** 错误事件 */
  error: unknown[]
  /** ws:close 事件 */
  ['ws:close']: [WebSocket, IncomingMessage, number, Buffer]
  /** ws:connection 事件 */
  ['ws:connection']: [WebSocket, IncomingMessage, CallbackHandler]
  /** 请求关闭stdin的监听 */
  'process:stdin:close': [void]
  /** process:stdin:close发出后的回调 用于恢复stdin的监听 */
  'process:stdin:resume': [void]
}

/**
 * 系统状态接口定义
 * @interface SystemStatus
 */
export interface SystemStatus {
  /** CPU相关信息 */
  cpu: {
    /** CPU型号 */
    model: string
    /** CPU速度 */
    speed: string
    /** CPU使用率 */
    usage: {
      /** 系统CPU使用率 */
      system: string
      /** Karin进程CPU使用率 */
      karin: string
    }
    /** CPU核心数 */
    core: number
  }
  /** 内存相关信息 */
  memory: {
    /** 总内存 */
    total: string
    /** 内存使用率 */
    usage: {
      /** 系统内存使用率 */
      system: string
      /** Karin进程内存使用率 */
      karin: string
    }
    /** 详细内存信息 */
    details: {
      /** 常驻集大小 */
      rss: string
      /** 总堆大小 */
      heapTotal: string
      /** 已用堆大小 */
      heapUsed: string
      /** 外部内存 */
      external: string
      /** 数组缓冲区 */
      arrayBuffers: string
    }
  }
  /** 系统信息 */
  system: {
    /** 系统架构 */
    arch: string
    /** 主机名 */
    hostname: string
    /** 操作系统名称 */
    osName: string
    /** 操作系统版本 */
    osVersion: string
    /** 平台 */
    platform: string
    /** 系统运行时间 */
    uptime: number
    /** 系统负载平均值(仅Unix系统) */
    loadavg?: number[]
    /** 临时目录路径 */
    tmpdir: string
    /** 用户主目录路径 */
    homedir: string
  }
  /** 进程信息 */
  process: {
    /** Node.js版本 */
    nodeVersion: string
    /** 进程ID */
    pid: number
    /** 进程运行时间 */
    uptime: number
    /** Node.js可执行文件路径 */
    execPath: string
    /** 命令行参数 */
    argv: string[]
    /** 环境变量 */
    env: {
      /** Node环境 */
      nodeEnv?: string
      /** 时区 */
      timezone?: string
    }
    /** 用户信息 */
    user?: {
      /** 用户名 */
      username: string
      /** 用户主目录 */
      homedir: string
      /** Shell类型 */
      shell?: string | null
    }
  }
  /** 网络信息 */
  network?: {
    /** 网络接口列表 */
    interfaces: Record<string, any>
  }
}

/**
 * 系统状态辅助类，用于收集和计算系统资源使用情况
 * @class StatusHelper
 */
export class StatusHelper {
  /** 进程CPU使用情况的初始值 */
  private psCpuUsage = process.cpuUsage()
  /** 进程高精度时间的初始值 */
  private psCurrentTime = process.hrtime()
  /** CPU时间信息的初始值 */
  private cpuTimes = os.cpus().map(cpu => cpu.times)

  /**
   * 替换NaN值为0
   * @param value - 要检查的数值
   * @returns 如果是NaN则返回0，否则返回原值
   */
  private replaceNaN (value: number) {
    return isNaN(value) ? 0 : value
  }

  /**
   * 获取系统CPU信息
   * @returns CPU信息对象，包含使用率、型号、速度和核心数
   */
  private sysCpuInfo () {
    const currentTimes = os.cpus().map(cpu => cpu.times)
    const { total, active } = currentTimes
      .map((times, index) => {
        const prevTimes = this.cpuTimes[index]
        const totalCurrent = times.user + times.nice + times.sys + times.idle + times.irq
        const totalPrev =
          prevTimes.user + prevTimes.nice + prevTimes.sys + prevTimes.idle + prevTimes.irq
        const activeCurrent = totalCurrent - times.idle
        const activePrev = totalPrev - prevTimes.idle
        return {
          total: totalCurrent - totalPrev,
          active: activeCurrent - activePrev,
        }
      })
      .reduce(
        (acc, cur) => ({
          total: acc.total + cur.total,
          active: acc.active + cur.active,
        }),
        { total: 0, active: 0 }
      )
    this.cpuTimes = currentTimes
    return {
      usage: this.replaceNaN((active / total) * 100).toFixed(2),
      model: os.cpus()[0].model,
      speed: os.cpus()[0].speed,
      core: os.cpus().length,
    }
  }

  /**
   * 计算系统内存使用量（MB）
   * @returns 系统内存使用量的字符串表示（MB）
   */
  private sysMemoryUsage () {
    const { total, free } = { total: os.totalmem(), free: os.freemem() }
    return ((total - free) / 1024 / 1024).toFixed(2)
  }

  /**
   * 计算Karin进程的CPU和内存使用情况
   * @returns 包含CPU使用率和内存使用量的对象
   */
  private karinUsage () {
    const mem = process.memoryUsage()
    const numCpus = os.cpus().length
    const usageDiff = process.cpuUsage(this.psCpuUsage)
    const endTime = process.hrtime(this.psCurrentTime)
    this.psCpuUsage = process.cpuUsage()
    this.psCurrentTime = process.hrtime()
    const usageMS = (usageDiff.user + usageDiff.system) / 1e3
    const totalMS = endTime[0] * 1e3 + endTime[1] / 1e6
    const normPercent = (usageMS / totalMS / numCpus) * 100
    return {
      cpu: this.replaceNaN(normPercent).toFixed(2),
      memory: ((mem.heapTotal + mem.external + mem.arrayBuffers) / 1024 / 1024).toFixed(2),
    }
  }

  /**
   * 获取系统状态信息
   */
  systemStatus (): SystemStatus {
    const karinUsage = this.karinUsage()
    const sysCpuInfo = this.sysCpuInfo()
    const memUsage = process.memoryUsage()

    // 安全获取用户信息
    let userInfo
    try {
      userInfo = os.userInfo()
    } catch (e) {
      userInfo = undefined
    }

    // 安全获取负载信息（仅Unix系统）
    let loadavg
    try {
      loadavg = os.loadavg()
    } catch (e) {
      loadavg = undefined
    }

    return {
      cpu: {
        core: sysCpuInfo.core,
        model: sysCpuInfo.model,
        speed: (sysCpuInfo.speed / 1000).toFixed(2),
        usage: {
          system: sysCpuInfo.usage,
          karin: karinUsage.cpu,
        },
      },
      memory: {
        total: (os.totalmem() / 1024 / 1024).toFixed(2),
        usage: {
          system: this.sysMemoryUsage(),
          karin: karinUsage.memory,
        },
        details: {
          rss: (memUsage.rss / 1024 / 1024).toFixed(2),
          heapTotal: (memUsage.heapTotal / 1024 / 1024).toFixed(2),
          heapUsed: (memUsage.heapUsed / 1024 / 1024).toFixed(2),
          external: (memUsage.external / 1024 / 1024).toFixed(2),
          arrayBuffers: (memUsage.arrayBuffers / 1024 / 1024).toFixed(2),
        },
      },
      system: {
        arch: `${os.platform()} ${os.arch()}`,
        hostname: os.hostname(),
        osName: os.type(),
        osVersion: os.release(),
        platform: os.platform(),
        uptime: os.uptime(),
        loadavg,
        tmpdir: os.tmpdir(),
        homedir: os.homedir(),
      },
      process: {
        nodeVersion: process.version,
        pid: process.pid,
        uptime: process.uptime(),
        execPath: process.execPath,
        argv: process.argv,
        env: {
          nodeEnv: process.env.NODE_ENV,
          timezone: process.env.TZ,
        },
        user: userInfo
          ? {
            username: userInfo.username,
            homedir: userInfo.homedir,
            shell: userInfo.shell,
          }
          : undefined,
      },
      network: {
        interfaces: os.networkInterfaces(),
      },
    }
  }
}

class Emitter extends EventEmitter<SystemEventMap> {
  /** 系统状态辅助类实例 */
  private statusHelper: StatusHelper
  /** 状态更新定时器引用 */
  private interval: NodeJS.Timeout | null = null

  /**
   * 创建事件发射器实例
   * @param time - 状态更新间隔时间（毫秒），默认3000ms
   */
  constructor (time: number = 3000) {
    super()
    this.statusHelper = new StatusHelper()
    this.on('newListener', (event: string) => {
      if (event === 'statusUpdate' && this.listenerCount('statusUpdate') === 0) {
        this.startInterval(time)
      }
    })
    this.on('removeListener', (event: string) => {
      if (event === 'statusUpdate' && this.listenerCount('statusUpdate') === 0) {
        this.stopInterval()
      }
    })
  }

  /**
   * 启动状态更新定时器
   * @param time - 状态更新间隔时间（毫秒）
   */
  private startInterval (time: number) {
    this.interval ??= setInterval(() => {
      const status = this.statusHelper.systemStatus()
      this.emit('statusUpdate', status)
    }, time)
  }

  /**
   * 停止状态更新定时器
   */
  private stopInterval () {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
}

/**
 * 全局事件管理器
 * 用于处理系统级事件、状态更新和各种接口构建
 */
export const emitter = new Emitter()
