import type { WebSocket } from 'ws'
import type { spawn } from '@karinjs/node-pty'

/** 终端类型 */
export type TerminalShell = 'powershell.exe' | 'cmd.exe' | 'bash'

/**
 * 创建pty
 */
export interface CreatePty {
  /** 终端名称 */
  name: string
  /** 初始列数 */
  cols: number
  /** 初始行数 */
  rows: number
  /** 终端类型 */
  shell: TerminalShell
}

/**
 * 终端实例
 */
export interface TerminalInstance {
  /** 终端名称 */
  name: string
  /** 终端 */
  pty: ReturnType<typeof spawn>
  /** 最后访问时间 */
  lastAccess: number
  /** 连接的 websocket */
  sockets: Set<WebSocket>
  /** 是否正在关闭 */
  isClosing: boolean
  /** 终端内容缓存 */
  buffer: string
}
