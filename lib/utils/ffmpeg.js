import exec from './exec.js'
import logger from '../config/log.js'
import Cfg from '../config/config.js'

/**
 * 执行 ffmpeg 命令
 * @param {string} cmd - ffmpeg 命令
 * @returns {Promise<{ ok: boolean, stdout: string, stderr: string, error: Error }>} - 执行结果
 */
export default async function ffmpeg (cmd) {
  let ffmpeg = 'ffmpeg'
  let { ok } = await exec('ffmpeg -version', false)
  if (!ok) {
    logger.debug('ffmpeg 未安装，开始尝试读取配置文件是否存在ffmpeg路径')
    const ffmpegPath = Cfg.Config.ffmpeg_path
    if (!ffmpegPath) {
      throw new Error('ffmpeg 未安装，请安装 ffmpeg 或配置 ffmpeg 路径')
    }
    ffmpeg = `"${ffmpegPath}"`
  }

  cmd = cmd.replace(/^ffmpeg/, '').trim()
  cmd = `${ffmpeg} ${cmd}`

  // 执行 ffmpeg 命令
  return await exec(cmd)
}
