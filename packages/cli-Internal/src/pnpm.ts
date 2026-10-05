import os from 'node:os'
import { execSync } from 'node:child_process'
import { parseVersion } from './workspace'
import type { Version } from './workspace'

/** 缓存的pnpm版本 undefined表示尚未获取 */
let PNPM_VERSION: Version | null | undefined

/**
 * 获取当前pnpm版本
 * 在系统临时目录执行 避免项目中不兼容的 pnpm-workspace.yaml 导致命令失败 (pnpm 10.5 以下缺少 packages 字段时任何命令都会报错)
 * @returns 获取失败返回null
 */
export const getPnpmVersion = (): Version | null => {
  if (PNPM_VERSION !== undefined) return PNPM_VERSION
  try {
    const stdout = execSync('pnpm -v', { cwd: os.tmpdir(), stdio: ['ignore', 'pipe', 'pipe'] }).toString()
    PNPM_VERSION = parseVersion(stdout)
  } catch {
    PNPM_VERSION = null
  }
  return PNPM_VERSION
}
