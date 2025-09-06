/**
 * `pm2.json` 类型
 */
export interface PM2 {
  /** 日志最多显示多少行 */
  lines: number
  /** pm2配置 */
  apps: Array<{
    /** 应用名称 */
    name: string
    /** 入口文件 */
    script: string
    /** 自动重启 */
    autorestart: boolean
    /** 最大重启次数 */
    max_restarts: number
    /** 最大内存重启 */
    max_memory_restart: string
    /** 重启延迟 */
    restart_delay: number
    /** 合并日志 */
    merge_logs: boolean
    /** 错误日志路径 */
    error_file: string
    /** 输出日志路径 */
    out_file: string
  }>
}
