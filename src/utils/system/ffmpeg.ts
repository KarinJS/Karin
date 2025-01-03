import { exec } from '@/utils/system/exec'
import type { ExecOptions, ExecReturn } from '@/types/system'

let ffmpegPath = 'ffmpeg'
let ffprobePath = 'ffprobe'
let ffplayPath = 'ffplay'

/** 延迟1秒 不然会阻塞 */
setTimeout(async () => {
  const env = await exec('ffmpeg -version', { booleanResult: true })
  if (!env) {
    const { config } = await import('@/utils/config')
    const cfg = config()
    ffmpegPath = cfg.ffmpegPath ? `"${cfg.ffmpegPath}"` : ffmpegPath
    ffprobePath = cfg.ffprobePath ? `"${cfg.ffprobePath}"` : ffprobePath
    ffplayPath = cfg.ffplayPath ? `"${cfg.ffplayPath}"` : ffplayPath
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
