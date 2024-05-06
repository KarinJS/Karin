import { promisify } from 'util'
import { exec as execCmd } from 'child_process'
import logger from '../config/log.js'

// Promise 化 exec 函数
const execAsync = promisify(execCmd)

/**
 * 执行 shell 命令
 * @param {string} cmd - shell 命令
 * @returns {Promise<{ ok: boolean, stdout: string, stderr: string, error: Error }>} - 执行结果
 */
export default async function exec (cmd, log = true) {
  let Logger = (data) => logger.mark(`[exec]${data}`)

  if (!log) Logger = () => ''

  Logger(`[开始执行] ${cmd}`)
  try {
    const { stdout, stderr } = await execAsync(cmd)
    Logger(`[执行成功] ${cmd}`)
    return { ok: true, stdout, stderr }
  } catch (error) {
    Logger(`[执行失败] ${cmd}`)
    return { ok: false, error }
  }
}
