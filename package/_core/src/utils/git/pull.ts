import { exec } from './exec'
import { getLocalCommitHash, getRemoteCommitHash } from './branch'

import type { ExecOptions } from './exec'
import type { ExecException } from 'node:child_process'

/** Git Pull 选项接口 */
export type GitPullOptions = ExecOptions & {
  /** 自定义命令，默认为 'git pull' */
  customCmd?: string
  /** 是否强制拉取 使用后将本地分支强制与远程分支同步 */
  force?: boolean
  /** 如果强制拉取 同步的远程分支名称 默认`origin/HEAD` 需要携带`origin/`前缀 */
  remote?: string
  /** 超时 */
  timeout?: number
}

/** Git Pull 返回类型 */
export interface GitPullResult {
  /** 是否成功 */
  status: boolean
  /** 更新详情 */
  hash: {
    /** 更新前哈希 */
    before: string
    /** 更新后哈希 */
    after: string
  }
  /** 更新信息 */
  data: string
}

/**
 * 构建pull返回值
 * @param status 是否成功
 * @param currentHash 当前哈希
 * @param remoteHash 远程哈希
 * @param data 更新信息
 * @param prefix data前缀
 * @returns 返回值
 */
const pullResult = (
  status: boolean,
  currentHash: string,
  remoteHash: string,
  data: string | ExecException,
  prefix = ''
): GitPullResult => {
  return {
    status,
    data: typeof data === 'string' ? data : `${prefix}${data.message || data.stack || '未知错误'}`,
    hash: {
      before: currentHash,
      after: remoteHash,
    },
  }
}

/**
 * 拉取git仓库 俗称`更新git插件`
 * @param cwd 工作目录 默认当前目录
 * @param options 选项
 * @returns 拉取结果
 */
export const gitPull = async (
  cwd: string,
  options: GitPullOptions = {}
): Promise<GitPullResult> => {
  try {
    /** 先记录当前哈希 */
    const currentHash = await getLocalCommitHash(cwd)
    /** 获取远程哈希 */
    const remoteHash = await getRemoteCommitHash(cwd)

    if (currentHash === remoteHash) {
      return pullResult(false, currentHash, remoteHash, '当前已经是最新版本')
    }

    /** 如果是强制拉取 则直接丢弃全部修改 将分支强制与远程分支同步 */
    if (options.force) {
      const remote = options.remote || 'origin/HEAD'
      const fetchResult = await exec('git fetch origin', { cwd, ...options })
      if (fetchResult.error) {
        return pullResult(false, currentHash, remoteHash, fetchResult.error, '同步远程分支失败: ')
      }

      const resetResult = await exec(`git reset --hard ${remote}`, { cwd, ...options })
      if (resetResult.error) {
        return pullResult(false, currentHash, remoteHash, resetResult.error, '强制同步远程分支失败: ')
      }

      /** 重新获取哈希 */
      const hash = await getLocalCommitHash(cwd)
      return pullResult(true, currentHash, hash, '本地分支已强制与远程分支同步')
    }

    /** 正常拉取 */
    const cmd = options.customCmd || 'git pull'
    const { error } = await exec(cmd, { ...options, cwd })
    if (error) {
      return pullResult(false, currentHash, remoteHash, error, '更新失败: ')
    }

    /** 重新获取哈希 */
    const hash = await getLocalCommitHash(cwd)
    return pullResult(true, currentHash, hash, '更新成功')
  } catch (error) {
    return pullResult(false, '', '', (error as Error).message, '发生错误: ')
  }
}
