import { config } from '@/utils/config'
import { exec } from '@/utils/system/exec'

let ffmpegPath = 'ffmpeg'
let ffprobePath = 'ffprobe'
let ffplayPath = 'ffplay'

const checkFfmpeg = async () => {
  const logs = await exec('ffmpeg -version')
  return logs.stdout && logs.stdout.includes('ffmpeg version')
}

const isFfmpegInstalled = await checkFfmpeg()
if (!isFfmpegInstalled) {
  /** 延迟1秒 */
  setTimeout(() => {
    const cfg = config()
    ffmpegPath = cfg.ffmpegPath ? `"${cfg.ffmpegPath}"` : ffmpegPath
    ffprobePath = cfg.ffprobePath ? `"${cfg.ffprobePath}"` : ffprobePath
    ffplayPath = cfg.ffplayPath ? `"${cfg.ffplayPath}"` : ffplayPath
  }, 1000)
}

/**
 * @description ffmpeg命令
 * @param cmd 命令
 * @param options 参数
 */
export const ffmpeg = async <K extends boolean = false>(
  cmd: string,
  options?: Parameters<typeof exec>[1] & { booleanResult?: K }
) => {
  cmd = cmd.replace(/^ffmpeg/, '').trim()
  cmd = `${ffmpegPath} ${cmd}`
  return await exec<K>(cmd, options)
}

/**
 * @description ffprobe命令
 * @param cmd 命令
 * @param options 参数
 */
export const ffprobe = async <K extends boolean = false>(
  cmd: string,
  options?: Parameters<typeof exec>[1] & { booleanResult?: K }
) => {
  cmd = cmd.replace(/^ffprobe/, '').trim()
  cmd = `${ffprobePath} ${cmd}`
  return await exec(cmd, options)
}

/**
 * @description ffplay命令
 * @param cmd 命令
 * @param options 参数
 */
export const ffplay = async <K extends boolean = false>(
  cmd: string,
  options?: Parameters<typeof exec>[1] & { booleanResult?: K }
) => {
  cmd = cmd.replace(/^ffplay/, '').trim()
  cmd = `${ffplayPath} ${cmd}`
  return await exec(cmd, options)
}
