import os from 'node:os'
import { red } from 'kolorist'
import { ALIYUN_REGISTRY } from './registry'
import { exec } from './exec'
import { isVersionAtLeast, parseVersion } from '../../../cli-Internal/src/workspace'
import type { Version } from '../../../cli-Internal/src/workspace'

/** pnpm检测结果 */
export interface PnpmInfo {
  /** 版本号 未安装或无法运行时为空字符串 */
  version: string
  /** 解析后的版本号 */
  parsed: Version | null
  /** 已安装但当前Node.js版本过低无法运行时 pnpm要求的最低Node.js版本 */
  requiredNode: string
}

/**
 * 检测当前pnpm
 *
 * 在系统临时目录执行 避免当前目录中不兼容的 pnpm-workspace.yaml 导致命令失败 (pnpm 10.5 以下缺少 packages 字段时任何命令都会报错)
 * pnpm 11 在 Node.js 版本过低时会输出 `This version of pnpm requires at least Node.js vX` 并直接退出 此时无法获取版本号
 */
export const detectPnpm = async (): Promise<PnpmInfo> => {
  const { stdout, stderr } = await exec('pnpm --version', { cwd: os.tmpdir() })
  const parsed = parseVersion(stdout)
  if (parsed) {
    return { version: `${parsed.major}.${parsed.minor}.${parsed.patch}`, parsed, requiredNode: '' }
  }

  const required = /requires at least Node\.js v?(\d+(?:\.\d+)*)/i.exec(`${stdout}\n${stderr}`)
  return { version: '', parsed: null, requiredNode: required?.[1] ?? '' }
}

/**
 * 检查pnpm与当前Node.js版本是否兼容
 *
 * - pnpm 11 要求 Node.js >= 22.13：Node.js 20 下仅输出警告仍可运行 更低版本直接退出
 * - pnpm 12 为原生二进制 不依赖 Node.js 版本
 * @param info - pnpm检测结果
 * @param nodeVersion - 当前Node.js版本
 * @returns 提示信息 兼容时返回空字符串
 */
export const getPnpmNodeWarning = (info: PnpmInfo, nodeVersion = process.versions.node): string => {
  if (info.requiredNode) {
    return `检测到已安装的 pnpm 要求 Node.js >= ${info.requiredNode}，当前 Node.js v${nodeVersion} 无法运行`
  }

  if (info.parsed?.major === 11 && !isVersionAtLeast(parseVersion(nodeVersion), 22, 13)) {
    return `检测到 pnpm v${info.version} 要求 Node.js >= 22.13，当前 Node.js v${nodeVersion} 可能无法正常运行`
  }

  return ''
}

/**
 * install pnpm
 * @param suffix - 镜像源后缀
 * @packages retry - 重试次数
 * @returns boolean
 */
export const installPnpm = async (
  suffix: string,
  retry: number = 0
): Promise<boolean> => {
  const cmd = `npm install -g pnpm@^9${suffix ? ` --registry=${suffix}` : ''}`
  try {
    const { stdout } = await exec(cmd)
    return stdout.length > 0
  } catch (error) {
    if (retry > 0) {
      /** 重试一次 使用阿里云兜底 */
      console.log(red(`[pnpm] 安装失败，正在使用 ${ALIYUN_REGISTRY} 重试...`))
      return installPnpm(ALIYUN_REGISTRY, retry - 1)
    }

    throw new Error(red('pnpm 安装失败，请检查你的网络环境'))
  }
}
