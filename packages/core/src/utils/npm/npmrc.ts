import { join } from 'node:path'
import { homedir } from 'node:os'
import { existsSync } from 'node:fs'
import { exec } from '@/utils/system/exec'
import type { NpmrcFileResponse } from '@/types/utils/npm'

/**
 * 获取 .npmrc 文件路径
 * @param type - 类型 global 全局 project 项目
 * @param isCheck - 是否校验文件存在 不存在返回null
 */
export const getNpmrcPath = async <T extends boolean> (
  type: 'global' | 'project',
  isCheck?: T
): Promise<T extends true ? string | null : string> => {
  let dir = ''
  if (type === 'global') {
    const { stdout } = await exec('npm config get userconfig')
    dir = stdout.trim()
  } else {
    dir = join(process.cwd(), '.npmrc')
  }

  if (isCheck && !existsSync(dir)) {
    return null as T extends true ? null : string
  }

  return dir
}

/**
 * 获取 pnpm 配置文件的路径
 * @param isCheck - 是否校验文件存在 不存在返回null
 * - docs: {@link https://pnpm.io/zh/cli/config}
 */
export const getPnpmConfigPath = <T extends boolean> (
  isCheck?: T
): T extends true ? string | null : string => {
  let dir = ''
  if (process.env.XDG_CONFIG_HOME) {
    dir = join(process.env.XDG_CONFIG_HOME, 'pnpm', 'rc')
  }

  const homeDir = homedir()
  const platform = process.platform

  if (platform === 'win32') {
    // Windows 系统
    dir = join(homeDir, 'AppData', 'Local', 'pnpm', 'config', 'rc')
  } else if (platform === 'darwin') {
    // macOS 系统
    dir = join(homeDir, 'Library', 'preferences', 'pnpm', 'rc')
  } else {
    // 其他 Unix-like 系统（例如 Linux）
    dir = join(homeDir, '.config', 'pnpm', 'rc')
  }

  if (isCheck && !existsSync(dir)) {
    return null as T extends true ? null : string
  }

  return dir
}

/**
 * 获取npm、pnpm配置文件列表
 */
export const getNpmConfigList = async () => {
  const list: NpmrcFileResponse[] = []

  const npmrc = await getNpmrcPath('global', true)
  const npmrcProject = await getNpmrcPath('project', true)
  const pnpmrc = getPnpmConfigPath(true)

  if (npmrc) list.push({ path: npmrc, type: 'global', description: 'npm全局配置' })
  if (pnpmrc) list.push({ path: pnpmrc, type: 'pnpm', description: 'pnpm全局配置' })
  if (npmrcProject) list.push({ path: npmrcProject, type: 'project', description: '当前项目配置' })

  return list
}

/**
 * 传入key获取对应的npm配置
 * @param keys - 配置key
 * @returns 配置key和对应的配置值
 */
export const getNpmConfig = async <T extends string | string[]> (
  keys: T
): Promise<T extends string ? string : { key: string; value: string }[]> => {
  if (typeof keys === 'string') {
    const { stdout } = await exec(`npm config get ${keys}`)
    return stdout.trim() as T extends string ? string : { key: string; value: string }[]
  }

  const listResult: { key: string; value: string }[] = []
  for (const key of keys) {
    const { stdout: value } = await exec(`npm config get ${key}`)
    listResult.push({ key, value: value.trim() })
  }

  return listResult as T extends string ? string : { key: string; value: string }[]
}

/**
 * 设置npmrc文件的配置
 * @param key - 配置项
 * @param value - 配置值
 */
export const setNpmConfig = async (key: string, value: string) => {
  await exec(`npm config set ${key} ${value}`)
}
