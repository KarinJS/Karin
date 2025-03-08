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
 * 提取从当前 core 版本到最新 core 版本之间的所有更新日志
 * @param releases 所有版本信息
 * @param currentCoreVersion 当前 core 版本
 * @returns 更新日志
 */
export const extractUpdateLogs = (releases: GithubRelease[], currentCoreVersion: string): GithubRelease[] => {
  // 找到最新 core 版本
  releases
    .filter(release => isCoreVersion(release.tag_name))
    .reduce((latest, current) => {
      return compareVersion(current.tag_name, latest.tag_name) > 0 ? current : latest
    }, { tag_name: currentCoreVersion } as GithubRelease)

  // 提取从当前 core 版本到最新 core 版本之间的所有更新日志
  return releases.filter(release => {
    return compareVersion(release.tag_name, currentCoreVersion) > 0
  })
}
