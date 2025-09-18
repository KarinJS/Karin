/**
 * 事件核心模块
 * 提供系统事件处理、状态监控和各种接口构建功能
 * @module @karinjs/events
 */

import os from 'node:os'
import { Bot } from '@karinjs/bot'
import { EventEmitter } from './emitter'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { Contact, Event, FriendSender, GroupSender, Scene } from '@karinjs/adapter'
import type {
  WS_CLOSE,
  WS_CONNECTION,
  WS_CLOSE_ONEBOT,
  WS_CLOSE_PUPPETEER,
  WS_CONNECTION_SNAPKA,
  WS_CONNECTION_ONEBOT,
  WS_CONNECTION_PUPPETEER,
  WS_CONNECTION_TERMINAL,
} from '@karinjs/envs'

/**
 * 回调处理器 代表链接已被函数接收
 * 5秒内如果这个回调没有触发 说明此ws链接无效
 */
export type CallbackHandler = () => void

export interface SystemEventMap {
  /** 错误事件 */
  error: unknown[]
  /** ws:close 事件 */
  [WS_CLOSE]: [WebSocket, IncomingMessage, number, Buffer]
  /** ws:close:onebot 事件 */
  [WS_CLOSE_ONEBOT]: [WebSocket, IncomingMessage, number, Buffer]
  /** ws:close:puppeteer 事件 */
  [WS_CLOSE_PUPPETEER]: [WebSocket, IncomingMessage, number, Buffer]

  /** ws:connection 事件 */
  [WS_CONNECTION]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:snapka 连接事件 */
  [WS_CONNECTION_SNAPKA]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:terminal 事件 */
  [WS_CONNECTION_TERMINAL]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:onebot 事件 */
  [WS_CONNECTION_ONEBOT]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:puppeteer 事件 */
  [WS_CONNECTION_PUPPETEER]: [WebSocket, IncomingMessage, CallbackHandler]
  /** 上下文事件 */
  [key: `ctx:${string}`]: [Event]
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

/**
 * 事件发射器类，继承自EventEmitter，处理系统事件并提供状态更新
 * @class Emitter
 * @extends EventEmitter<SystemEventMap>
 */
export class Emitter extends EventEmitter<SystemEventMap> {
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

  /** 框架名称 */
  public name: 'karin' = 'karin'

  /**
   * 构建好友contact
   * @deprecated 请使用 `contact.friend` 代替
   * @param scene `friend`
   * @param peer 用户id
   * @param name 昵称
   */
  contact (scene: 'friend', peer: string, name?: string): Contact<'friend'>
  /**
   * 构建群contact
   * @deprecated 请使用 `contact.friend` 代替
   * @param scene `group`
   * @param peer 群号
   * @param name 昵称
   */
  contact (scene: 'group', peer: string, name?: string): Contact<'group'>
  /**
   * 构建频道contact
   * @deprecated 请使用 `contact.guild` 代替
   * @param scene `guild`
   * @param peer 频道id
   * @param subPeer 子频道id
   * @param name 频道名称
   */
  contact (scene: 'guild', peer: string, subPeer: string, name?: string): Contact<'guild'>
  /**
   * 构建频道私信contact
   * @deprecated 请使用 `contact.direct` 代替
   * @param scene `direct`
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: 'direct', peer: string, subPeer: string, name?: string): Contact<'direct'>
  /**
   * 构建临时群会话contact
   * @deprecated 请使用 `contact.groupTemp` 代替
   * @param scene `groupTemp`
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: 'groupTemp', peer: string, subPeer: string, name?: string): Contact<'groupTemp'>
  /**
   * 构建contact
   * @deprecated 请直接导入 `contact` 代替
   * @param scene 场景
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: Scene, peer: string, subPeer?: string, name?: string): Contact {
    if (scene === 'guild' || scene === 'direct' || scene === 'groupTemp') {
      return { scene, peer, subPeer, name } as Contact
    } else {
      return { scene, peer, subPeer: undefined, name } as Contact
    }
  }

  /**
   * 构建群contact
   * @deprecated 请使用 `contact.group` 替代
   * @param peer - 群号
   * @param name - 群名
   */
  contactGroup (peer: Contact['peer'], name?: string): Contact<'group'> {
    return { scene: 'group', peer, subPeer: undefined, name: name || '' }
  }

  /**
   * 构建好友contact
   * @deprecated 请使用 `contact.friend` 替代
   * @param peer - 用户id
   * @param name - 昵称
   */
  contactFriend (peer: Contact['peer'], name?: string): Contact<'friend'> {
    return { scene: 'friend', peer, subPeer: undefined, name: name || '' }
  }

  /**
   * 构建频道contact
   * @deprecated 请使用 `contact.guild` 替代
   * @param peer - 频道id
   * @param subPeer - 子频道id
   * @param name - 频道名称
   * @param subName - 子频道名称
   * @returns 频道contact
   */
  contactGuild (peer: string, subPeer: string, name?: string, subName?: string): Contact<'guild'> {
    return { scene: 'guild', peer, subPeer, name: name || '', subName: subName || '' }
  }

  /**
   * 构建临时群会话contact
   * @deprecated 请使用 `contact.groupTemp` 替代
   * @param peer - 群号
   * @param subPeer - 子id
   * @param name - 群名
   */
  contactGroupTemp (peer: string, subPeer: string, name?: string): Contact<'groupTemp'> {
    return { scene: 'groupTemp', peer, subPeer, name: name || '' }
  }

  /**
   * 构建消息事件私聊发送者信息
   * @deprecated 请使用 `contact.friend` 替代
   * @param userId 发送者ID
   * @param nick 昵称
   * @param sex 性别
   * @param age 年龄
   * @param uid 隐藏字段 uid
   * @param uin 隐藏字段 uin
   */
  friendSender (
    userId: number | string,
    nick: string,
    sex: FriendSender['sex'] = 'unknown',
    age?: number,
    uid?: string,
    uin?: number
  ): FriendSender {
    return { userId: String(userId), nick, sex, age, uid, uin, name: nick }
  }

  /**
   * 构建消息事件群聊发送者信息
   * @deprecated 请使用 `sender.group` 替代
   * @param userId - 发送者QQ号
   * @param role - 发送者在群的角色身份（非群、频道场景为`unknown`）
   * @param nick - 发送者昵称
   * @param sex - 发送者性别
   * @param age - 发送者年龄
   * @param card - 群名片/备注
   * @param area - 地区
   * @param level - 成员等级
   * @param title - 专属头衔
   * @param uid - 发送者uid
   * @param uin - 发送者uin
   * @returns 群聊发送者信息对象
   */
  groupSender (
    /** 发送者QQ号 */
    userId: number | string,
    /** 发送者在群的角色身份 非群、频道场景为`unknown` */
    role: GroupSender['role'],
    /** 发送者昵称 */
    nick?: string,
    /** 发送者性别 */
    sex?: GroupSender['sex'],
    /** 发送者年龄 */
    age?: number,
    /** 群名片/备注 */
    card?: string,
    /** 地区 */
    area?: string,
    /** 成员等级 */
    level?: number,
    /** 专属头衔 */
    title?: string,
    /** 发送者uid */
    uid?: string,
    /** 发送者uin */
    uin?: number
  ): GroupSender

  /**
   * 构建消息事件群聊发送者信息
   * @deprecated 请使用 `sender.group` 替代
   * @param userId 发送者ID
   * @param nick 昵称
   * @param role 角色
   * @param sex 性别
   * @param age 年龄
   * @param card 群名片/备注
   * @param area 地区
   * @param level 成员等级
   * @param title 专属头衔
   * @param uid 隐藏字段 uid
   * @param uin 隐藏字段 uin
   */
  groupSender (
    /** 发送者QQ号 */
    userId: number | string,
    /** 发送者在群的角色身份 非群、频道场景为`unknown` */
    role?: GroupSender['role'],
    /** 发送者昵称 */
    nick?: string,
    /** 发送者性别 */
    sex?: GroupSender['sex'],
    /** 发送者年龄 */
    age?: number,
    /** 群名片/备注 */
    card?: string,
    /** 地区 */
    area?: string,
    /** 成员等级 */
    level?: number,
    /** 专属头衔 */
    title?: string,
    /** 发送者uid */
    uid?: string,
    /** 发送者uin */
    uin?: number
  ): GroupSender {
    return {
      userId: String(userId),
      role: role || 'unknown',
      nick: nick || '',
      sex,
      age,
      card,
      area,
      level,
      title,
      uid,
      uin,
      name: nick || '',
    }
  }

  /**
   * 根据索引获取Bot
   * @param index - Bot的索引id
   */
  getBotByIndex (index: number) {
    return Bot.getBot(index)
  }

  /**
   * 获取注册的Bot数量
   * @returns Bot数量
   */
  getBotCount () {
    return Bot.getBotCount()
  }

  /**
   * 获取所有Bot列表
   * @param isIndex - 是否返回包含的索引列表 默认`false` 返回Bot列表
   */
  getBotAll<T extends boolean = false> (isIndex?: T): T extends true
    ? ReturnType<typeof Bot.getAllBotList>
    : ReturnType<typeof Bot.getAllBot> {
    if (isIndex) return Bot.getAllBotList() as any
    return Bot.getAllBot().map((item) => item) as any
  }
}

/**
 * 全局事件管理器
 * 用于处理系统级事件、状态更新和各种接口构建
 */
export const emitter = new Emitter()

/**
 * 内部事件管理器
 * 用于框架内部组件间通信，与全局事件管理器隔离
 */
export const coreEmitter = emitter.createEvent()
