import { exec, handleReturn } from './exec'

/** 获取git仓库本地分支列表返回类型 */
export interface GitLocalBranches {
  /** 默认分支 */
  defaultBranch: string
  /** 本地分支列表 */
  list: string[]
}

/** 获取git仓库远程分支列表返回类型 */
export interface GitRemoteBranches {
  /** 分支名称 */
  branch: string
  /** 短哈希 */
  short: string
  /** 长哈希 */
  hash: string
}

/** 获取最新提交哈希参数 */
export interface GetCommitHashOptions {
  /** 分支名称 默认使用当前分支 */
  branch?: string
  /** 是否返回短哈希 默认返回长哈希 */
  short?: boolean
}

/**
 * 获取本地分支列表
 * @param cwd 仓库路径 默认当前目录
 * @returns 本地分支列表 包含默认分支和分支列表
 * @throws 执行发生错误 例如stdout类型错误
 */
export const getLocalBranches = async (
  cwd: string = process.cwd()
): Promise<GitLocalBranches> => {
  const cmd = 'git --no-pager branch'
  const data = await exec(cmd, { cwd })

  return handleReturn(data, () => {
    /** 默认分支 */
    let defaultBranch = ''
    const list = data.stdout.split('\n').map((line) => {
      line = line.trim()
      if (line.startsWith('*')) {
        line = line.replace('*', '').trim()
        defaultBranch = line
      }

      return line
    })

    return {
      defaultBranch,
      list,
    }
  })
}

/**
 * 获取本地默认分支
 * @param cwd 仓库路径 默认当前目录
 * @returns 默认分支
 */
export const getDefaultBranch = async (cwd: string = process.cwd()) => {
  const { defaultBranch } = await getLocalBranches(cwd)
  return defaultBranch
}

/**
 * 获取git仓库远程分支列表
 * @param cwd 仓库路径
 * @returns 远程分支列表 包含哈希和分支名称
 * @throws 执行发生错误 例如stdout类型错误
 */
export const getRemoteBranches = async (cwd: string): Promise<GitRemoteBranches[]> => {
  const cmd = 'git ls-remote --heads origin'
  const data = await exec(cmd, { cwd })

  return handleReturn(data, () => {
    return data.stdout.split('\n').map((line) => {
      const [hash, ref] = line.trim().split(/\s+/).map((v) => v.trim())
      const branch = ref.replace('refs/heads/', '')
      return { branch, short: hash.slice(0, 7), hash }
    })
  })
}

/**
 * 获取本地最新提交哈希
 * @param cwd 仓库路径
 * @param options.branch 分支名称 默认使用当前分支
 * @param options.short 是否返回短哈希 默认返回长哈希
 * @returns 最新提交哈希
 */
export const getLocalCommitHash = async (
  cwd: string,
  options?: GetCommitHashOptions
) => {
  const branch = options?.branch || 'HEAD'
  const short = options?.short ? '--short' : ''

  const cmd = `git rev-parse ${short} ${branch}`
  const data = await exec(cmd, { cwd })
  return handleReturn(data)
}

/**
 * 获取远程最新提交哈希
 * @description 分支名称支持不带origin/前缀 会自动添加
 * @param cwd 仓库路径
 * @param options.branch 分支名称 默认值`origin/HEAD`
 * @param options.short 是否返回短哈希 默认返回长哈希
 * @returns 远程最新提交哈希
 */
export const getRemoteCommitHash = async (
  cwd: string,
  options?: GetCommitHashOptions
) => {
  let branch = options?.branch || 'origin/HEAD'

  if (!branch.startsWith('origin/')) {
    branch = `origin/${branch}`
  }

  const short = options?.short ? '--short' : ''
  const cmd = `git rev-parse ${short} ${branch}`
  const data = await exec(cmd, { cwd })
  return handleReturn(data)
}
