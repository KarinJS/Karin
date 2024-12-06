import { config } from '@/utils/config'
import { exec } from '@/utils/system/exec'

let ffmpegPath = 'ffmpeg'
let ffprobePath = 'ffprobe'
let ffplayPath = 'ffplay'

const isFfmpegInstalled = await exec('ffmpeg -version', { booleanResult: true })
if (!isFfmpegInstalled) {
  /** 延迟1秒 */
  setTimeout(() => {
    const cfg = config()
    ffmpegPath = `"${cfg.ffmpegPath}"`
    ffprobePath = `"${cfg.ffprobePath}"`
    ffplayPath = `"${cfg.ffplayPath}"`
  }, 1000)
}

/**
 * @description ffmpeg命令
 * @param cmd 命令
 * @param options 参数
 */
export const ffmpeg = async (cmd: string, options?: Parameters<typeof exec>[1]) => {
  cmd = cmd.replace(/^ffmpeg/, '').trim()
  cmd = `${ffmpegPath} ${cmd}`
  return await exec(cmd, options)
}

/**
 * @description ffprobe命令
 * @param cmd 命令
 * @param options 参数
 */
export const ffprobe = async (cmd: string, options?: Parameters<typeof exec>[1]) => {
  cmd = cmd.replace(/^ffprobe/, '').trim()
  cmd = `${ffprobePath} ${cmd}`
  return await exec(cmd, options)
}

/**
 * @description ffplay命令
 * @param cmd 命令
 * @param options 参数
 */
export const ffplay = async (cmd: string, options?: Parameters<typeof exec>[1]) => {
  cmd = cmd.replace(/^ffplay/, '').trim()
  cmd = `${ffplayPath} ${cmd}`
  return await exec(cmd, options)
}
