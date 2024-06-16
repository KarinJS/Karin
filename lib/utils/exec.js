import { exec as execCmd } from 'child_process'

/**
 * 执行 shell 命令
 * @param {string} cmd - shell 命令
 * @param {boolean} [log=true] - 是否输出日志
 * @param {import('child_process').ExecOptions} [options={ cwd: process.cwd(), encoding: 'utf-8' }] - exec 选项
 * @returns {Promise<{ status: 'ok'|'failed', stdout: string, stderr: string, error: Error }>} - 执行结果
 */
export const exec = (cmd, log = true, options = { cwd: process.cwd(), encoding: 'utf-8' }) => {
  return new Promise((resolve) => {
    const logger = global.logger || console

    const logMessage = (level, message) => {
      if (log) logger[level](message)
    }

    const formatMessage = (status, details) => [
      logger[status === 'ok' ? 'green' : 'red'](`[exec][${status === 'ok' ? '执行成功' : '执行失败'}]`),
      `cmd: ${cmd}`,
      `cwd: ${options.cwd || process.cwd()}`,
      details,
      '--------',
    ].join('\n')

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
