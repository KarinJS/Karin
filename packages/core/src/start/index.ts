import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fork, type ChildProcess } from 'node:child_process'

/** 是否已启动 */
let isStart = false
/** 子进程实例 */
let child: ChildProcess

/** 获取当前文件的绝对路径 */
const _filename = fileURLToPath(import.meta.url)
/** 获取当前文件的目录路径 */
const _dirname = path.dirname(_filename)

/** 获取入口文件绝对路径 */
const getMainPath = (): string => {
  const isESM = import.meta.url.includes('.mjs')
  const filePath = path.join(_dirname, isESM ? 'app.mjs' : 'app.ts')

  if (fs.existsSync(filePath)) {
    return filePath
  }

  /** 如果文件不存在说明则是升级了版本 使用硬编码 */
  return path.join(process.cwd(), 'node_modules', 'node-karin', 'dist', 'start', 'app.mjs')
}

/**
 * 启动index.mjs作为子进程
 * @returns 子进程实例
 */
const start = (): ChildProcess => {
  if (isStart) {
    console.log('子进程已在运行中，PID:', child.pid)
    return child
  }

  isStart = true

  /** 使用fork启动子进程 */
  child = fork(getMainPath())

  /** 处理子进程消息 */
  child.on('message', message => {
    try {
      const { port, type, token } = JSON.parse(message as string) || {}
      if (type === 'restart') {
        restart(port, token)
        return
      }

      if (type === 'stop') exit()
    } catch (error) {
      console.error('处理子进程消息时出错:', error)
    }
  })

  /** 处理子进程退出 */
  child.once('exit', exit)
  return child
}

/**
 * 重启子进程
 * @param port 端口号
 * @param token 令牌
 * @param isFetch 是否发送退出信号
 * @returns 新的子进程实例
 */
const restart = async (
  port: number,
  token: string,
  isFetch = true
): Promise<ChildProcess | null> => {
  if (isFetch) {
    await sendExit(port, token)
  }

  /** 等待端口释放，最多尝试10次 */
  let portAvailable = false
  const maxTries = 10
  for (let i = 0; i < maxTries; i++) {
    portAvailable = await checkPort(port)
    if (portAvailable) {
      break
    }
    await sleep(1000)
  }

  if (!portAvailable) {
    console.warn(`警告：端口 ${port} 在多次尝试后仍被占用，可能需要手动处理`)
  }

  /** 重置状态并启动新进程 */
  isStart = false
  child = start()
  return child
}

/**
 * 延迟函数
 * @param ms - 延迟的毫秒数
 * @returns Promise对象，resolved后表示延迟结束
 */
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 检查端口是否被占用
 * @param port 端口号
 * @returns 是否可用（true表示可用，false表示被占用）
 */
const checkPort = (port: number): Promise<boolean> => {
  const server = net.createServer()
  return new Promise((resolve) => {
    server.on('error', () => {
      resolve(false)
    })

    server.listen(port)

    server.once('listening', () => {
      server.close(() => {
        resolve(true)
      })
    })
  })
}

/**
 * 给已有进程发送退出信号
 * @param port 端口号
 * @param token 令牌
 */
const sendExit = async (port: number, token: string) => {
  try {
    const result = await fetch(`http://127.0.0.1:${port}/api/v1/exit`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    if (result.status === 200) {
      console.log(await result.json())
    } else {
      console.log('发送重启请求失败:', result.status)
    }
    await sleep(1000)
  } catch { }
}

/**
 * 退出
 */
const exit = () => {
  try {
    /** 先给子进程发送退出信号 */
    child.kill('SIGTERM')
    /** 再杀一次子进程 */
    process.kill(child.pid!)
  } catch {
    child?.kill()
  } finally {
    process.exit(0)
  }
}

process.on('exit', exit)
start()
