import { exec as execCmd } from 'child_process'
import logger from '../config/log.js'

/**
 * 执行 shell 命令
 * @param {string} cmd - shell 命令
 * @param {boolean} log - 是否输出日志
 * @param {import('child_process').ExecOptions} options - exec 选项
 * @returns {Promise<{ status: 'ok'|'failed', stdout: string, stderr: string, error: Error }>} - 执行结果
 */
const exec = (cmd, log = true, options = { encoding: 'utf-8' }) => {
  return new Promise((resolve) => {
    let Logger = (data) => logger.mark(`[exec]${data}`)
    if (!log) Logger = () => ''

    Logger(`[开始执行] ${cmd}`)
    execCmd(cmd, options, (error, stdout, stderr) => {
      if (error) {
        Logger(`[执行失败] ${cmd}`)
        return resolve({ status: 'failed', error, stdout, stderr })
      }
      Logger(`[执行成功] ${cmd}`)
      resolve({ status: 'ok', error, stdout, stderr })
    })
  })
}

export default exec
