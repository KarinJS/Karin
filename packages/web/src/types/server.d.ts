export interface ServerResponse<T> {
  message: string
  data: T
}

export type KarinStatus = {
  name: 'karin'
  pid: number
  pm2_id: string
  uptime: number
  version: string
  karin_dev: boolean
  karin_lang: 'ts' | 'js'
  karin_runtime: string
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
