import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fork, type ChildProcess } from 'node:child_process'

let isStart = false

/** 状态变量 */
let child: ChildProcess
let lastStartTime = 0
let isClosing = false
const minRestartInterval = 5000 /** 最小重启间隔5秒 */
/** 获取当前文件的绝对路径 */
const _filename = fileURLToPath(import.meta.url)
/** 获取当前文件的目录路径 */
const _dirname = path.dirname(_filename)
/** 入口文件绝对路径 */
const indexPath = path.join(_dirname, import.meta.url.includes('.mjs') ? 'app.mjs' : 'app.ts')

/**
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
  lastStartTime = Date.now()

  /** 使用fork启动子进程 */
  child = fork(indexPath)

  /** 处理子进程消息 */
  child.on('message', message => {
    const { port, type, token } = JSON.parse(message as string) || {}
    if (type === 'restart') {
      restart(port, token)
      return
    }

    if (type === 'stop') {
      process.exit(0)
    }
  })

  /** 处理子进程退出 */
  child.on('exit', (code) => {
    isStart = false

    /** 如果不是手动关闭并且不在最小重启间隔内，则自动重启 */
    if (!isClosing && Date.now() - lastStartTime > minRestartInterval) {
      process.exit(code!)
    }
  })

  /** 处理子进程错误 */
  child.on('error', (err) => {
    console.error('子进程发生错误:', err)
  })

  return child
}

/**
 * 重启子进程
 * @returns 新的子进程实例
 */
const restart = async (
  port: number,
  token: string,
  isFetch = true
): Promise<ChildProcess | null> => {
  isClosing = true
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

/** 主进程退出时清理子进程 */
process.on('exit', () => {
  if (child && !child.killed) {
    child.kill('SIGTERM')
  }
})

start()
