import { exec as execChild } from 'node:child_process'
import type { ExecException } from 'node:child_process'

/** 执行命令参数类型 */
export type ExecOptions = Parameters<typeof execChild>[1]

/**
 * 执行命令
 * @param cmd 命令
 * @param options 选项
 * @returns 执行结果
 */
export const exec = (cmd: string, options?: ExecOptions) => {
  return new Promise<{
    status: boolean
    error: ExecException | null
    stdout: string
    stderr: string
  }>((resolve) => {
    const timeout = (options?.timeout || 30) * 1000
    const timer = setTimeout(() => {
      resolve({
        status: false,
        error: new Error('命令执行超时'),
        stdout: '',
        stderr: '命令执行超时',
      })
    }, timeout)

    const child = execChild(cmd, options, (error, stdout, stderr) => {
      clearTimeout(timer)
      stderr = stderr.toString().trim()
      stdout = stdout.toString().trim()
      const status = !error

      resolve({ status, error, stdout, stderr })
    })

    child.stdin?.write('\n')
  })
}

/**
 * 返回值处理
 * @param data 执行结果
 * @param callback 回调函数
 * @returns 执行结果
 */
export const handleReturn = <T = string> (data: {
  status: boolean
  error: ExecException | null
  stdout: string
  stderr: string
}, callback?: () => T): T => {
  if (data.error || typeof data.stdout !== 'string') {
    throw data.error || new Error('stdout 类型错误')
  }

  if (callback) {
    return callback()
  }

  return data.stdout as T
}
