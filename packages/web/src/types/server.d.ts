export interface ServerResponse<T> {
  message: string
  data: T
}

export interface KarinStatus {
  name: 'karin'
  pid: number
  pm2_id: string
  uptime: number
  version: string
  karin_dev: boolean
  karin_lang: string
  karin_runtime: string
}

export interface NetworkStatus {
  timestamp: number
  upload: number
  download: number
  totalSent: number
  totalReceived: number
}

export interface SystemStatus {
  cpu: {
    model: string
    speed: string
    usage: {
      system: string
      karin: string
    }
    core: number
  }
  memory: {
    total: string
    usage: {
      system: string
      karin: string
    }
  }
  arch: string
}
