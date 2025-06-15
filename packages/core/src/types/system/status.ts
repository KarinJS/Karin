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
