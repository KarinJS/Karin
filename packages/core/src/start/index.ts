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
    if (message === 'restart') {
      console.log('收到重启指令，准备重启')
      restart()
    }
  })

  /** 处理子进程退出 */
  child.on('exit', (code, signal) => {
    isStart = false
    console.log(`子进程退出 [PID: ${child?.pid}] 退出码: ${code} 信号: ${signal}`)

    /** 如果不是手动关闭并且不在最小重启间隔内，则自动重启 */
    if (!isClosing && Date.now() - lastStartTime > minRestartInterval) {
      console.log('子进程异常退出，准备重启')
      setTimeout(() => {
        start()
      }, 1000)
    }
  })

  /** 处理子进程错误 */
  child.on('error', (err) => {
    console.error('子进程发生错误:', err)
  })

  return child
}

/**
 * 关闭子进程
 * @returns 是否成功关闭
 */
export const stop = async (): Promise<boolean> => {
  if (!child || child.killed) {
    return true
  }

  /** 标记为正在关闭，防止自动重启 */
  isClosing = true

  return new Promise((resolve) => {
    if (!child) {
      resolve(true)
      return
    }

    /** 设置超时处理 */
    const timeoutId = setTimeout(() => {
      if (child && !child.killed) {
        child.kill('SIGKILL')
      }
      resolve(true)
    }, 5000)

    /** 监听退出事件 */
    child.once('exit', () => {
      clearTimeout(timeoutId)
      resolve(true)
    })

    /** 发送终止信号 */
    child.kill('SIGTERM')
  })
}

/**
 * 重启子进程
 * @returns 新的子进程实例
 */
export const restart = async (): Promise<ChildProcess | null> => {
  child.kill('SIGTERM')
  isStart = false
  child = start()
  return child
}

/**
 * 获取子进程状态
 * @returns 进程状态信息
 */
export const getStatus = () => ({
  running: !!child && !child.killed,
  pid: child?.pid,
  lastStartTime,
  uptime: child ? Date.now() - lastStartTime : 0,
})

/** 主进程退出时清理子进程 */
process.on('exit', () => {
  child.kill('SIGTERM')
})

start()
