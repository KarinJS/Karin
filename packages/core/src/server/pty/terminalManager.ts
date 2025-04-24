import os from 'node:os'
import { URL } from 'node:url'
import { WebSocket } from 'ws'
import { randomUUID } from 'node:crypto'
import { auth } from '../common/common'
import { listeners } from '@/core/internal'
import { WS_CONNECTION_TERMINAL } from '@/utils'

import type { IncomingMessage } from 'node:http'
import type { TerminalInstance, TerminalShell } from '@/types/server/pty'

/**
 * 终端实例集合
 */
const terminals: Map<string, TerminalInstance> = new Map()

/**
 * PTY 模块
 */
let pty: any | null = null

/**
 * 检查 PTY 插件是否已安装
 */
export const isPtyInstalled = async (): Promise<boolean> => {
  try {
    /** 不要直接import 不然打包之后会有类型问题 */
    const name = '@karinjs/node-pty'
    pty = await import(name)
    return true
  } catch (error) {
    return false
  }
}

/**
 * 初始化终端管理器
 */
export const initialize = async () => {
  const installed = await isPtyInstalled()
  if (!installed) {
    logger.debug('[terminal] PTY 模块未安装，终端功能不可用')
    return
  }

  try {
    await pty!.init()
  } catch (error) {
    logger.error('[terminal] 初始化失败')
    logger.error(error)
    return
  }

  listeners.on(WS_CONNECTION_TERMINAL, (
    socket: WebSocket,
    request: IncomingMessage,
    call: () => void
  ) => {
    try {
      call()

      const url = new URL(request.url || '', 'ws://localhost')
      const terminalId = url.searchParams.get('id')!
      const userId = url.searchParams.get('user_id')!
      const token = url.searchParams.get('token')!

      if (!token || !terminalId || !userId) {
        socket.close()
        logger.info(`[terminal] 非法请求: ${request.url}`)
        return
      }

      const verifyStatus = auth.terminalAuth(token, userId)
      if (!verifyStatus) {
        socket.close()
        logger.info(`[terminal] 鉴权失败: ${request.url}`)
        return
      }

      const instance = terminals.get(terminalId)
      if (!instance) {
        socket.close()
        logger.info(`[terminal] 终端不存在: ${request.url}`)
        return
      }

      instance.sockets.add(socket)
      instance.lastAccess = Date.now()

      /** 发送当前终端内容给新连接 */
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'output', data: instance.buffer }))
      }

      socket.on('message', (data) => {
        if (instance && !instance.isClosing) {
          const result = JSON.parse(data.toString())
          if (result.type === 'input') {
            instance.pty.write(result.data)
          }
          // 处理 resize 消息
          if (result.type === 'resize') {
            instance.pty.resize(result.cols, result.rows)
          }
        }
      })

      socket.on('close', () => {
        logger.info(`[terminal] 终端连接关闭: ${terminalId}`)
        instance.sockets.delete(socket)
        if (instance.sockets.size === 0 && !instance.isClosing) {
          instance.isClosing = true
          if (os.platform() === 'win32') {
            process.kill(instance.pty.pid)
          } else {
            instance.pty.kill()
          }
        }
      })
    } catch (error) {
      logger.error(`[terminal] 初始化失败: ${request.url}`)
      logger.error(error)
      socket.close()
    }
  })
}

/**
 * 创建终端
 * @param shell 终端类型
 * @param cols 列数
 * @param rows 行数
 * @returns 终端实例
 */
export const createTerminal = async (
  name: string = 'xterm-256color',
  shell: TerminalShell,
  cols: number = 80,
  rows: number = 30
) => {
  if (!pty) {
    throw new Error('终端管理器未初始化或插件未安装')
  }

  const id = randomUUID()
  const term = pty.spawn(shell, [], {
    name: 'xterm-256color',
    cols,
    rows,
    cwd: process.cwd(),
    env: {
      ...process.env,
      LANG: os.platform() === 'win32' ? 'chcp 65001' : 'zh_CN.UTF-8',
      TERM: 'xterm-256color',
    },
  })

  /** 终端实例 */
  const instance: TerminalInstance = {
    pty: term,
    lastAccess: Date.now(),
    sockets: new Set(),
    isClosing: false,
    buffer: '',
    name,
  }

  term.onData((data: unknown) => {
    // 追加数据到 buffer
    instance.buffer += data
    // 发送数据给已连接的 websocket
    instance.sockets.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'output', data }))
      }
    })
  })

  term.onExit(() => {
    closeTerminal(id)
  })

  terminals.set(id, instance)
  // 返回生成的 id 及对应实例，方便后续通知客户端使用该 id
  return { id, instance }
}

/**
 * 关闭终端
 * @param id 终端ID
 */
export const closeTerminal = (id: string) => {
  const instance = terminals.get(id)
  if (instance) {
    if (!instance.isClosing) {
      instance.isClosing = true
      if (os.platform() === 'win32') {
        process.kill(instance.pty.pid)
      } else {
        instance.pty.kill()
      }
    }
    instance.sockets.forEach((ws) => ws.close())
    terminals.delete(id)
  }
}

/**
 * 获取终端
 * @param id 终端ID
 * @returns 终端实例
 */
export const getTerminal = (id: string) => {
  return terminals.get(id)
}

/**
 * 获取终端列表
 * @returns 终端列表
 */
export const getTerminalList = () => {
  return Array.from(terminals.keys()).map((id) => ({
    id,
    lastAccess: terminals.get(id)!.lastAccess,
    name: terminals.get(id)!.name,
  }))
}

initialize()
