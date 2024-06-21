import logger from './logger'
import { exec as execCmd } from 'child_process'

/**
 * 执行 shell 命令
 * @param cmd 命令
 * @param log 是否打印日志
 * @param options 选项
 */
export const exec = (
  cmd: string,
  log = true,
  options = { cwd: process.cwd(), encoding: 'utf-8' },
): Promise<{
  /**
   * - 执行状态
   */
  status: 'ok' | 'failed'
  /**
   * - 错误信息
   */
  error: Error | null
  stdout: string | ''
  stderr: string | ''
}> => {
  return new Promise(resolve => {
    const logMessage = (level: 'trace' | 'debug' | 'mark' | 'info' | 'warn' | 'error' | 'fatal', message: string) => {
      if (log) logger[level](message)
    }

    const logType = (status: string) => {
      switch (status) {
        case '开始执行':
          return logger.yellow('[exec][开始执行]')
        case 'ok':
          return logger.green('[exec][执行成功]')
        case 'failed':
          return logger.red('[exec][执行失败]')
      }
    }

    const formatMessage = (status: string, details: string) => [logType(status), `cmd: ${cmd}`, `cwd: ${options.cwd || process.cwd()}`, details, '--------'].join('\n')

    logMessage('info', formatMessage('开始执行', ''))

    execCmd(cmd, options, (error, stdout, stderr) => {
      if (error) {
        logMessage('error', formatMessage('failed', `Error: ${error.message || error.stack || error.toString()}`))
        return resolve({ status: 'failed', error, stdout, stderr })
      }
      logMessage('mark', formatMessage('ok', `stdout: ${stdout}\nstderr: ${stderr}`))
      resolve({ status: 'ok', error, stdout, stderr })
    })
  })
}

export default exec
