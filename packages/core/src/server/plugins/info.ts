import axios from 'axios'
import { exec } from '@/utils/system/exec'

/**
 * 获取作者头像
 * @param home 作者主页
 * @param avatar 头像
 */
export const getAuthorAvatar = (home: string, avatar?: string) => {
  if (avatar) return avatar
  if (home.includes('https://github.com')) {
    return `${home}.png`
  }

  if (home.includes('https://gitee.com')) {
    return `${home}.png`
  }

  // TODO:gitcode 和 gitlab待补充
  return ''
}

/**
 * 传入一个本地git仓库路径 获取仓库地址
 * @param cwd 本地git仓库路径
 */
export const getRepoUrl = async (cwd: string) => {
  const { stdout } = await exec('git remote get-url origin', { cwd })
  return stdout?.trim() || ''
}

/**
 * 获取npm包的下载量
 * @param name npm包名
 */
export const getPackageDownloads = async (name: string) => {
  /** 获取当前年份 */
  const year = new Date().getFullYear()
  const dateRange = `${year}-01-01:${year}-12-31`

  try {
    // 获取 npm 下载量（使用 race 机制）
    const npmApi = [
      'https://api.npmjs.org/downloads/point',
      'https://npmapi.ikechan8370.com/downloads/point',
    ]
    const npmApiList = npmApi.map((item) => `${item}/${dateRange}/${name}`)
    const npmDownloads = await Promise.race(
      npmApiList.map((item) => axios.get(item, { timeout: 5000 }))
    ).then(result => result.data.downloads).catch(() => 0)

    // 获取 cnpm 下载量
    const cnpmDownloads = await axios.get(
      `https://registry.npmmirror.com/downloads/range/${dateRange}/${name}`,
      { timeout: 5000 }
    ).then(result => {
      if (!result.data.downloads?.length) return 0
      return result.data.downloads.reduce(
        (total: number, item: any) => total + (item.downloads || 0),
        0
      )
    }).catch(() => 0)

    // 返回 npm 和 cnpm 下载量之和
    return npmDownloads + cnpmDownloads
  } catch (error) {
    logger.error(`[getPackageDownloads] ${name} 获取下载量失败:`)
    logger.error(error)
  }

  return 0
}

/**
 * 获取npm包的基本信息
 * @param name npm包名
 */
export const getPackageInfo = async (name: string) => {
  const registry = [
    'https://registry.npmjs.org',
    'https://registry.npmmirror.com',
  ]

  const registryList = registry.map((item) => `${item}/${name}`)

  try {
    const registryResult = await Promise.race(registryList.map((item) => axios.get(item, { timeout: 5000 })))

    if (registryResult.status === 200) {
      /** 最新版本 */
      const latest = registryResult.data['dist-tags'].latest
      /** 包大小 */
      const size = registryResult.data.versions[latest].dist.unpackedSize
      /** 更新时间: 2025-02-07T07:02:10.971Z 格式为 ISO 8601 */
      const updated = registryResult.data.time.modified

      return { size, updated }
    }
  } catch (error) {
    logger.error(`[getPackageInfo] ${name} 获取包信息失败:`)
    logger.error(error)
  }

  return { size: 0, updated: '' }
}

/**
 * 获取npm仓库的下载量、大小、更新时间
 * @param name npm包名
 */
export const getNpmInfo = async (name: string) => {
  const [downloads, packageInfo] = await Promise.all([
    getPackageDownloads(name),
    getPackageInfo(name)
  ])

  return {
    downloads,
    size: packageInfo.size,
    updated: packageInfo.updated,
  }
}

/**
 * 获取 GitHub 仓库信息
 * @param repoUrl GitHub 仓库地址
 */
export const getGitHubInfo = async (repoUrl: string) => {
  try {
    // 从 URL 中提取用户名和仓库名
    const match = repoUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)/)
    if (!match) return { updated: '', downloads: 0 }

    const [, owner, repo] = match
    const cleanRepo = repo.replace('.git', '')

    // 使用 GitHub API 获取仓库信息
    const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}`
    const response = await axios.get(apiUrl, { timeout: 5000 })

    if (response.status === 200) {
      const {
        pushed_at: pushedAt,
        stargazers_count: stargazersCount,
        forks_count: forksCount,
        watchers_count: watchersCount
      } = response.data
      return {
        updated: pushedAt, // ISO 8601 格式
        downloads: stargazersCount + forksCount + watchersCount // 使用 star 数、fork 数和 watch 数之和作为受欢迎度指标
      }
    }
  } catch (error) {
    logger.error(`[getGitHubInfo] 获取 GitHub 仓库信息失败: ${repoUrl}`)
    logger.error(error)
  }

  return { updated: '', downloads: 0 }
}

/**
 * 获取 Gitee 仓库信息
 * @param repoUrl Gitee 仓库地址
 */
export const getGiteeInfo = async (repoUrl: string) => {
  try {
    // 从 URL 中提取用户名和仓库名
    const match = repoUrl.match(/gitee\.com[/:]([^/]+)\/([^/.]+)/)
    if (!match) return { updated: '', downloads: 0 }

    const [, owner, repo] = match
    const cleanRepo = repo.replace('.git', '')

    // 使用 Gitee API 获取仓库信息
    const apiUrl = `https://gitee.com/api/v5/repos/${owner}/${cleanRepo}`
    const response = await axios.get(apiUrl, { timeout: 5000 })

    if (response.status === 200) {
      const {
        pushed_at: pushedAt,
        stargazers_count: stargazersCount,
        forks_count: forksCount
      } = response.data
      return {
        updated: pushedAt, // ISO 8601 格式
        downloads: stargazersCount + forksCount // 使用 star 数和 fork 数之和作为下载量的替代指标
      }
    }
  } catch (error) {
    logger.error(`[getGiteeInfo] 获取 Gitee 仓库信息失败: ${repoUrl}`)
    logger.error(error)
  }

  return { updated: '', downloads: 0 }
}

/**
 * 获取 Git 仓库信息
 * @param repoUrl Git 仓库地址
 */
export const getGitInfo = async (repoUrl: string) => {
  if (!repoUrl) return { updated: '', downloads: 0 }

  if (repoUrl.includes('github.com')) {
    return getGitHubInfo(repoUrl)
  }

  if (repoUrl.includes('gitee.com')) {
    return getGiteeInfo(repoUrl)
  }

  return { updated: '', downloads: 0 }
}
