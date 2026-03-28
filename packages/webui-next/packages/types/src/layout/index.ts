/**
 * 终端流发出的日志级别名称。
 */
export type TerminalLogLevel = 'INFO' | 'DEBUG' | 'MARK' | 'ERROR' | 'WARN';

/**
 * 终端日志项。
 */
export interface TerminalLog {
  /**
   * 唯一日志标识符。
   */
  id: string;
  /**
   * 日志时间戳，单位为毫秒。
   */
  timestamp: number;
  /**
   * 日志级别。
   */
  level: TerminalLogLevel;
  /**
   * 日志消息正文。
   */
  message: string;
}

/**
 * 后端健康状态值。
 */
export type BackendHealthStatus = 'ok';

/**
 * 健康 websocket 负载。
 */
export interface BackendHealthMessage {
  /**
   * 当前后端健康状态。
   */
  status: BackendHealthStatus;
  /**
   * 后端启动时间戳，单位为毫秒。
   */
  startedAt: number;
  /**
   * 当前服务器时间戳，单位为毫秒。
   */
  timestamp: number;
  /**
   * 后端运行时间，单位为毫秒。
   */
  uptimeMilliseconds: number;
}
