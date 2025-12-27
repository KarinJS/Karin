/**
 * 命名管道模块
 * 使用命名管道实现进程唯一性检查和进程间通信
 */
import fs from 'node:fs'
import net from 'node:net'
import { store } from '@karinjs/store'
import { execSync } from 'node:child_process'

const pipeName = 'karin_pipe'

/**
 * 检查进程唯一性
 * @returns 是否存在
 */
const checkProcessUnique = async () => {
  /** 命名管道路径 */
  const dir = store.pipe.getPath(pipeName)
  return new Promise<void>((resolve) => {
    const client = net.connect(dir)

    client.once('connect', () => {
      client.write('exit')
      const timer = setTimeout(() => {
        client.destroy()
        resolve()
      }, 200)

      client.once('close', () => {
        clearTimeout(timer)
        /** 非Windows删掉管道 */
        if (process.platform !== 'win32' && fs.existsSync(dir)) {
          fs.unlinkSync(dir)
        }
        resolve()
      })
    })

    client.once('error', () => resolve())
  })
}

/**
 * 创建命名管道服务器
 * @returns 管道服务器实例
 */
const createPipe = async (): Promise<net.Server> => {
  const pipePath = store.pipe.getPath(pipeName)
  if (process.platform !== 'win32' && fs.existsSync(pipePath)) {
    fs.unlinkSync(pipePath)
  }

  return new Promise<net.Server>((resolve, reject) => {
    const server = net.createServer((socket) => {
      socket.on('data', (data) => pipeMessageHandler(server, socket, data))

      socket.on('error', (reject))
      socket.on('close', (reject))
    })

    server.listen(pipePath, () => resolve(server))
  })
}

/**
 * 处理收到的管道消息
 * @param _server - 管道服务器实例
 * @param socket - 连接的套接字
 * @param data - 收到的数据
 */
const pipeMessageHandler = (
  _server: net.Server,
  socket: net.Socket,
  data: Buffer
) => {
  const message = data.toString().trim()
  if (message === 'exit') {
    logger.info('[pipe] 收到退出消息，正在退出进程...')
    if (process.env.pm_id) {
      execSync(`npx pm2 delete ${process.env.pm_id}`, { stdio: 'ignore' })
    }

    process.exit()
  }

  if (message === 'envs') {
    socket.write(JSON.stringify({
      pm_id: process.env.pm_id,
      version: process.env.VERSION,
      pid: process.pid,
      ppid: process.ppid,
    }, null, 2))
  }
}

/**
 * 管道模块
 */
export const pipe = {
  /**
   * 检查进程唯一性
   */
  check: checkProcessUnique,
  /**
   * 创建命名管道
   */
  create: createPipe,
}
