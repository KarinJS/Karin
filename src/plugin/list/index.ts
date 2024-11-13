import { getAppPluginsInfo } from './app'
import { getGitPluginsInfo } from './git'
import { getNpmPluginsInfo } from './npm'
import type { Info } from './types'

/**
 * @description 获取所有插件详细信息列表
 */
export const gitAllPlugin = async (): Promise<Info[]> => {
  const list = await Promise.all([
    getAppPluginsInfo(),
    getGitPluginsInfo(),
    getNpmPluginsInfo(),
  ])

  return list.flat()
}
