import exec from './exec.js'

/**
 * 执行 ffmpeg 命令
 * @returns {Promise<(cmd: string) => Promise<import('./exec.js').exec>>}
 */
export default async function ffmpeg (logger, config) {
  let ffmpeg = 'ffmpeg'
  const { status } = await exec('ffmpeg -version', false)
  if (status !== 'ok') {
    logger.debug('ffmpeg 未安装，开始尝试读取配置文件是否存在ffmpeg路径')
    const ffmpegPath = config.Config.ffmpeg_path
    if (!ffmpegPath) {
      logger.warn('ffmpeg 未安装，请安装 ffmpeg 或手动配置 ffmpeg 路径后重启')
      return false
    }
    ffmpeg = `"${ffmpegPath}"`
  }

  // 返回函数
  return async (cmd, log = true, options = { cwd: process.cwd(), encoding: 'utf-8' }) => {
    cmd = cmd.replace(/^ffmpeg/, '').trim()
    cmd = `${ffmpeg} ${cmd}`
    return await exec(cmd, log, options)
  }
}
