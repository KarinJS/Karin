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
    let Logger = (level, ...args) => logger[level](...args)
    if (!log) Logger = () => ''

    Logger('info', [
      logger.blue('[exec][开始执行]'),
      `cmd：${cmd}`,
      `cwd：${options?.cwd || process.cwd()}`,
      '--------'
    ].join('\n'))

    execCmd(cmd, options, (error, stdout, stderr) => {
      if (error) {
        Logger('error', [
          logger.red('[exec][执行失败]'),
          `cmd：${cmd}`,
          `cwd：${options?.cwd || process.cwd()}`,
          `Error：${error.message || error.stack || error.toString()}`,
          '--------'
        ].join('\n'))
        return resolve({ status: 'failed', error, stdout, stderr })
      }
      Logger('mark', [
        logger.green('[exec][执行成功]'),
        `cmd：${cmd}`,
        `process.cwd：${options?.cwd || process.cwd()}`,
        `stdout：${stdout}`,
        `stderr：${stderr}`,
        '--------'
      ].join('\n'))
      resolve({ status: 'ok', error, stdout, stderr })
    })
  })
}

export default exec
