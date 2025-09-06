import { request } from '@/lib/request'
import { getAccessToken, getUserId } from '@/lib/token'
import { CLOSE_TERMINAL_ROUTER, CREATE_TERMINAL_ROUTER, GET_TERMINAL_LIST_ROUTER } from '@/lib/router'
import type { CreatePty } from 'node-karin'

type TerminalCallback = (data: string) => void
// 增加连接状态回调类型
type ConnectionStatusCallback = (id: string, status: 'connected' | 'disconnected' | 'error', message?: string) => void

interface TerminalConnection {
  ws: WebSocket
  callbacks: Set<TerminalCallback>
  isConnected: boolean
  buffer: string[] // 添加缓存数组
  // 增加连接状态回调
  statusCallbacks: Set<ConnectionStatusCallback>
}

export interface TerminalSession {
  id: string
}

export interface TerminalInfo {
  id: string
  name: string
  lastAccess: number
}

class TerminalManager {
  private connections: Map<string, TerminalConnection> = new Map()
  private readonly MAX_BUFFER_SIZE = 1000 // 限制缓存大小
  // 增加全局状态回调
  private globalStatusCallbacks: Set<ConnectionStatusCallback> = new Set()

  async createTerminal (cols: number, rows: number, shell: CreatePty['shell'], name: string): Promise<TerminalSession> {
    const data = await request.serverPost<TerminalSession, CreatePty>(
      CREATE_TERMINAL_ROUTER,
      { cols, rows, shell, name }
    )
    return data
  }

  /**
   * 关闭终端
   * @param id 终端ID
   */
  async closeTerminal (id: string): Promise<void> {
    await request.serverPost(CLOSE_TERMINAL_ROUTER, { id })
  }

  /**
   * 获取终端列表
   * @returns 终端列表
   */
  async getTerminalList (): Promise<TerminalInfo[]> {
    const data = await request.serverGet<TerminalInfo[]>(GET_TERMINAL_LIST_ROUTER)
    return data
  }

  /**
   * 注册全局连接状态回调
   * @param callback 状态回调函数
   */
  registerGlobalStatusCallback (callback: ConnectionStatusCallback) {
    this.globalStatusCallbacks.add(callback)
    return () => {
      this.globalStatusCallbacks.delete(callback)
    }
  }

  connectTerminal (
    id: string,
    callback: TerminalCallback,
    config?: {
      cols?: number
      rows?: number
      statusCallback?: ConnectionStatusCallback
    }
  ): WebSocket {
    let conn = this.connections.get(id)
    const { cols = 80, rows = 24, statusCallback } = config || {}

    if (!conn) {
      const url = new URL(window.location.href)
      url.protocol = url.protocol.replace('http', 'ws')
      url.pathname = '/terminal/create'

      const token = getAccessToken()
      if (!token) {
        throw new Error('No token found')
      }
      const userId = getUserId()
      if (!userId) {
        throw new Error('No user id found')
      }

      url.searchParams.set('id', id)
      url.searchParams.set('user_id', userId)
      url.searchParams.set('token', token)

      const ws = new WebSocket(url.toString())
      conn = {
        ws,
        callbacks: new Set([callback]),
        isConnected: false,
        buffer: [], // 初始化缓存
        statusCallbacks: new Set(statusCallback ? [statusCallback] : []),
      }

      ws.onmessage = (event) => {
        const data = event.data
        // 保存到缓存
        conn?.buffer.push(data)
        if ((conn?.buffer.length ?? 0) > this.MAX_BUFFER_SIZE) {
          conn?.buffer.shift()
        }
        conn?.callbacks.forEach((cb) => cb(data))
      }

      ws.onopen = () => {
        if (conn) {
          conn.isConnected = true
          // 触发连接成功回调
          conn.statusCallbacks.forEach(cb => cb(id, 'connected'))
          this.globalStatusCallbacks.forEach(cb => cb(id, 'connected'))
        }
        this.sendResize(id, cols, rows)
      }

      ws.onclose = (event) => {
        console.log('终端连接关闭', id, event.code, event.reason)
        if (conn) {
          conn.isConnected = false
          // 触发连接关闭回调
          const message = event.reason || '连接已关闭'
          conn.statusCallbacks.forEach(cb => cb(id, 'disconnected', message))
          this.globalStatusCallbacks.forEach(cb => cb(id, 'disconnected', message))
        }
      }

      ws.onerror = (error) => {
        console.error('终端连接错误', id, error)
        if (conn) {
          conn.isConnected = false
          // 触发连接错误回调
          conn.statusCallbacks.forEach(cb => cb(id, 'error', '连接发生错误'))
          this.globalStatusCallbacks.forEach(cb => cb(id, 'error', '连接发生错误'))
        }
      }

      this.connections.set(id, conn)
    } else {
      conn.callbacks.add(callback)
      // 如果提供了状态回调，添加到集合中
      if (statusCallback) {
        conn.statusCallbacks.add(statusCallback)
      }
      // 恢复历史内容
      conn.buffer.forEach((data) => callback(data))
      // 如果已经连接，立即触发连接状态
      if (conn.isConnected && statusCallback) {
        statusCallback(id, 'connected')
      }
    }

    return conn.ws
  }

  disconnectTerminal (id: string, callback: TerminalCallback, statusCallback?: ConnectionStatusCallback) {
    const conn = this.connections.get(id)
    if (!conn) return

    conn.callbacks.delete(callback)
    if (statusCallback) {
      conn.statusCallbacks.delete(statusCallback)
    }
  }

  /**
   * 检查终端连接状态
   * @param id 终端ID
   * @returns 连接状态
   */
  isTerminalConnected (id: string): boolean {
    const conn = this.connections.get(id)
    return !!conn?.isConnected
  }

  removeTerminal (id: string) {
    const conn = this.connections.get(id)
    if (conn?.ws.readyState === WebSocket.OPEN) {
      conn.ws.close()
    }
    this.connections.delete(id)
  }

  sendInput (id: string, data: string) {
    const conn = this.connections.get(id)
    if (conn?.ws.readyState === WebSocket.OPEN) {
      conn.ws.send(JSON.stringify({ type: 'input', data }))
    }
  }

  sendResize (id: string, cols: number, rows: number) {
    const conn = this.connections.get(id)
    if (conn?.ws.readyState === WebSocket.OPEN) {
      conn.ws.send(JSON.stringify({ type: 'resize', cols, rows }))
    }
  }
}

const terminalManager = new TerminalManager()

export default terminalManager
