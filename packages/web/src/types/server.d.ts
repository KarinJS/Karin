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
