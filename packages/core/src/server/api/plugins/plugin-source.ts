import axios from 'axios'
import type { OnlinePluginInfo } from '@/types/server/plugins'

/** 插件源地址列表 */
const PLUGIN_SOURCES = [
  'https://registry.npmmirror.com/@karinjs/plugins-list/latest',
  'https://registry.npmjs.com/@karinjs/plugins-list/latest',
] as const

/**
 * 从多个源获取插件列表
 * @returns 返回最先成功响应的插件列表
 */
export const fetchPluginList = async (): Promise<OnlinePluginInfo<'all'>> => {
  const requests = PLUGIN_SOURCES.map(async url => {
    const time = Date.now()
    try {
      const response = await axios.get<OnlinePluginInfo<'all'>>(url)
      logger.info(`[插件列表] 从 ${url} 获取成功 耗时${logger.yellow(Date.now() - time + '')}ms`)
      return response.data
    } catch (error) {
      logger.error(error)
      return null
    }
  })

  const results = await Promise.race(requests)
  if (!results) {
    throw new Error('无法从任何源获取插件列表')
  }

  return results
}

/**
 * race 请求
 */
export const raceRequest = async <T> (urls: string[]): Promise<T | null> => {
  const requests = urls.map(async url => {
    try {
      const response = await axios.get<T>(url, { timeout: 10000 })
      return response.data
    } catch {
      return null
    }
  })

  const results = await Promise.race(requests)
  return results
}
