import logger from '../core/logger'
import { exec as execCmd, ExecOptions } from 'child_process'

/**
 * 执行 shell 命令
 * @param cmd 命令
 * @param log 是否打印日志
 * @param options 选项
 */
export const exec = async (
  cmd: string,
  log = true,
  options: ExecOptions = { cwd: process.cwd() }
): Promise<{ status: 'ok' | 'failed', error: Error | null, stdout: string, stderr: string }> => {
  const logType = (status: 'start' | 'ok' | 'failed') => ({
    start: '[exec][开始执行]',
    ok: '[exec][执行成功]',
    failed: '[exec][执行失败]',
  })[status]

  const logMessage = (status: 'start' | 'ok' | 'failed', details = '') => {
    if (log) {
      const colorFunc = {
        start: logger.yellow,
        ok: logger.green,
        failed: logger.red,
      }[status]

      logger.info([
        colorFunc(logType(status)),
        `cmd: ${cmd}`,
        `cwd: ${options.cwd}`,
        details,
        '--------',
      ].join('\n'))
    }
  }

  logMessage('start')

  return new Promise(resolve => {
    execCmd(cmd, options, (error, stdout = '', stderr = '') => {
      const status = error ? 'failed' : 'ok'
      logMessage(status, error ? `Error: ${error.message}` : `stdout: ${stdout}\nstderr: ${stderr}`)
      resolve({ status, error, stdout, stderr })
    })
  })
}

/**
 * 执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 */
export const execs = (
  cmd: string,
  options: ExecOptions = { cwd: process.cwd() }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    execCmd(cmd, options, (error, stdout) => {
      if (error) return reject(error)
      resolve(stdout.trim())
    })
  })
}

export default exec
