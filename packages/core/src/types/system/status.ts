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
