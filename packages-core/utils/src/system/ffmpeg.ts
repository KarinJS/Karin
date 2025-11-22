import { exec } from './exec'
import type { } from '@karinjs/envs'
import type { ExecOptions, ExecReturn } from './exec'

/**
 * 组合命令
 * @param env 环境变量
 * @param defaultCmd 默认命令
 * @param command 原始命令
 */
const getCommand = (env: string, defaultCmd: string, command: string) => {
  const prefix = env ? `"${env}"` : defaultCmd
  return `${prefix} ${command.replace(new RegExp(`^${defaultCmd}`), '').trim()}`
}

/**
 * @description ffmpeg命令
 * @param cmd 命令
 * @param options 参数
 */
export const ffmpeg = async <T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): Promise<ExecReturn<T>> => {
  const command = getCommand(process.env.FFMPEG_PATH, 'ffmpeg', cmd)
  return exec(command, options)
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
  const command = getCommand(process.env.FFPROBE_PATH, 'ffprobe', cmd)
  return exec(command, options)
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
  const command = getCommand(process.env.FFPLAY_PATH, 'ffplay', cmd)
  return exec(command, options)
}
