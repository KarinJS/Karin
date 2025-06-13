import type { GithubRelease } from '@/types/release'

/**
 * 版本号转为数字
 * @param version 版本号
 * @returns 版本号数字
 */
export const versionToNumber = (version: string): number => {
  // 去掉前缀
  const versionWithoutPrefix = version.replace(/^[a-zA-Z]+-v/, '')
  const versionArray = versionWithoutPrefix.split('.')
  const versionNumber =
    parseInt(versionArray[2]) +
    parseInt(versionArray[1]) * 100 +
    parseInt(versionArray[0]) * 10000

  return versionNumber
}

/**
 * 比较版本号
 * @see https://github.com/NapNeko/NapCatQQ/blob/main/napcat.webui/src/utils/version.ts
 * @param version1 版本号1
 * @param version2 版本号2
 * @returns 比较结果
 * 0: 相等
 * 1: version1 > version2
 * -1: version1 < version2
 */
export const compareVersion = (version1: string, version2: string): number => {
  const versionNumber1 = versionToNumber(version1)
  const versionNumber2 = versionToNumber(version2)

  if (versionNumber1 === versionNumber2) {
    return 0
  }

  return versionNumber1 > versionNumber2 ? 1 : -1
}

/**
 * 判断是否是主包版本
 * @param version 版本号
 * @returns 是否是主包版本
 */
export const isCoreVersion = (version: string): boolean => {
  return version.startsWith('core-v')
}

/**
 * 判断是否是指定的包类型
 */
export const getPackageType = (tagName: string): string | null => {
  if (tagName.startsWith('core-v')) return 'core'
  if (tagName.startsWith('web-v')) return 'web'
  if (tagName.startsWith('cli-v')) return 'cli'
  if (tagName.startsWith('create-karin-v') || tagName.startsWith('create-v')) return 'create-karin'
  return null
}

/**
 * 提取从当前 core 版本到最新 core 版本之间的所有更新日志
 * @param releases 所有版本信息
 * @param currentCoreVersion 当前 core 版本（纯版本号，如 '1.10.3'）
 * @returns 更新日志
 */
export const extractUpdateLogs = (releases: GithubRelease[], currentCoreVersion: string): GithubRelease[] => {
  // 只关注这四个包的更新日志
  const targetPackages = ['core', 'web', 'cli', 'create-karin']

  // 过滤出目标包的所有版本
  const targetReleases = releases.filter(release => {
    const packageType = getPackageType(release.tag_name)
    return packageType && targetPackages.includes(packageType)
  })

  // 构造当前 core 版本的完整 tag_name
  const currentCoreTagName = `core-v${currentCoreVersion}`

  // 检查当前 core 版本是否在 releases 中
  const currentCoreRelease = targetReleases.find(release => release.tag_name === currentCoreTagName)

  // 如果当前 core 版本不在 releases 中，返回所有目标包的更新日志
  if (!currentCoreRelease) {
    return targetReleases.sort((a, b) => {
      // 按发布时间倒序排列（最新的在前）
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }

  // 找到最新的 core 版本
  const coreReleases = targetReleases.filter(release => getPackageType(release.tag_name) === 'core')
  const latestCoreRelease = coreReleases.reduce((latest, current) => {
    return compareVersion(current.tag_name, latest.tag_name) > 0 ? current : latest
  }, currentCoreRelease)

  // 如果当前版本已经是最新版本，返回空数组
  if (compareVersion(latestCoreRelease.tag_name, currentCoreTagName) <= 0) {
    return []
  }

  // 获取当前 core 版本和最新 core 版本的发布时间
  const currentCoreTime = new Date(currentCoreRelease.created_at)
  const latestCoreTime = new Date(latestCoreRelease.created_at)

  // 提取在这个时间范围内的所有目标包更新日志
  return targetReleases.filter(release => {
    const releaseTime = new Date(release.created_at)
    // 包含时间范围内的所有版本（不包括当前 core 版本本身）
    return releaseTime > currentCoreTime && releaseTime <= latestCoreTime
  }).sort((a, b) => {
    // 按发布时间倒序排列（最新的在前）
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}
