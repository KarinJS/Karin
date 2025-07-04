import os from 'node:os'
import { EventEmitter } from 'node:events'
import type { SystemStatus } from '@/types/system/status'

export class StatusHelper {
  private psCpuUsage = process.cpuUsage()
  private psCurrentTime = process.hrtime()
  private cpuTimes = os.cpus().map(cpu => cpu.times)

  private replaceNaN (value: number) {
    return isNaN(value) ? 0 : value
  }

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

  private sysMemoryUsage () {
    const { total, free } = { total: os.totalmem(), free: os.freemem() }
    return ((total - free) / 1024 / 1024).toFixed(2)
  }

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

class StatusHelperSubscription extends EventEmitter {
  private statusHelper: StatusHelper
  private interval: NodeJS.Timeout | null = null

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

  private startInterval (time: number) {
    this.interval ??= setInterval(() => {
      const status = this.statusHelper.systemStatus()
      this.emit('statusUpdate', status)
    }, time)
  }

  private stopInterval () {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
}

export const statusListener = new StatusHelperSubscription()
