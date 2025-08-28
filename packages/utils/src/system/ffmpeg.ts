import { exec } from './exec'
import type { ExecOptions, ExecReturn } from './exec'

let ffmpegPath = 'ffmpeg'
let ffprobePath = 'ffprobe'
let ffplayPath = 'ffplay'

/** 延迟1秒 不然会阻塞 */
setTimeout(async () => {
  const env = await exec('ffmpeg -version', { booleanResult: true })
  if (!env) {
    const ffmpeg = process.env.FFMPEG_PATH
    const ffprobe = process.env.FFPROBE_PATH
    const ffplay = process.env.FFPLAY_PATH

    ffmpegPath = ffmpeg ? `"${ffmpeg}"` : ffmpegPath
    ffprobePath = ffprobe ? `"${ffprobe}"` : ffprobePath
    ffplayPath = ffplay ? `"${ffplay}"` : ffplayPath
  }
}, 1000)

/**
 * @description ffmpeg命令
 * @param cmd 命令
 * @param options 参数
 */
export const ffmpeg = async <T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): Promise<ExecReturn<T>> => {
  cmd = cmd.replace(/^ffmpeg/, '').trim()
  cmd = `${ffmpegPath} ${cmd}`
  return await exec(cmd, options)
}

/**
 * @description ffprobe命令
 * @param cmd 命令
 * @param options 参数
 */
export const ffprobe = async <T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): Promise<ExecReturn<T>> => {
  cmd = cmd.replace(/^ffprobe/, '').trim()
  cmd = `${ffprobePath} ${cmd}`
  return await exec(cmd, options)
}

/**
 * @description ffplay命令
 * @param cmd 命令
 * @param options 参数
 */
export const ffplay = async <T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): Promise<ExecReturn<T>> => {
  cmd = cmd.replace(/^ffplay/, '').trim()
  cmd = `${ffplayPath} ${cmd}`
  return await exec(cmd, options)
}
