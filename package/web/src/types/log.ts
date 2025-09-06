/** 日志等级 */
export type LogLevel = 'trac' | 'debu' | 'info' | 'warn' | 'erro' | 'fata' | 'mark'
/** 过滤等级 */
export type FilterLevel = LogLevel | 'all'

/** 日志行缓存 */
export interface LogItem {
  timestamp: string
  level: LogLevel
  message: string
  raw: string
}
