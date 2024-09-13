import * as os from 'os'

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

class OSUtils {
  private cpuUsageMSDefault: number

  constructor () {
    this.cpuUsageMSDefault = 1000 // CPU 利用率默认时间段
  }

  // TODO: 创建系统监控事件以便能随时调用

  /**
   * 获取某时间段 CPU 利用率
   * @param { Number } Options.ms [时间段，默认是 1000ms，即 1 秒钟]
   * @param { Boolean } Options.percentage [true（以百分比结果返回）|false]
   * @returns { Promise }
   */
  async getCPUUsage (options: { cpuUsageMS?: number; percentage?: boolean } = {}): Promise<number | string> {
    const that = this
    let { cpuUsageMS, percentage } = options
    cpuUsageMS = cpuUsageMS || that.cpuUsageMSDefault
    const t1 = that._getCPUInfo() // t1 时间点 CPU 信息

    await sleep(cpuUsageMS)

    const t2 = that._getCPUInfo() // t2 时间点 CPU 信息
    const idle = t2.idle - t1.idle
    const total = t2.total - t1.total
    const usage = 1 - idle / total
    if (percentage) {
      return (usage * 100.0).toFixed(2) + '%'
    }

    return usage * 100
  }

  /**
   * 获取 CPU 信息
   * @returns { Object } CPU 信息
   */
  private _getCPUInfo (): { user: number; sys: number; idle: number; total: number } {
    const cpus = os.cpus()
    let user = 0; let nice = 0; let sys = 0; let idle = 0; let irq = 0; let total = 0

    for (const cpu in cpus) {
      const times = cpus[cpu].times
      user += times.user
      nice += times.nice
      sys += times.sys
      idle += times.idle
      irq += times.irq
    }

    total += user + nice + sys + idle + irq

    return {
      user,
      sys,
      idle,
      total,
    }
  }
}

export default OSUtils
