import fs from 'node:fs'
import path from 'node:path'
import { filesByExt } from '@/utils/fs/path'
import { getPluginCache } from '../cache/cache'
import type { Info } from './types'
import type { GitPluginName } from './git'

const key = {
  list: 'app:list',
  info: 'app:list:info',
}

/**
 * @description 获取单个app列表
 * @example
 * ```ts
 * console.log(await getAppList('karin-plugin-xxx'))
 * // -> ['karin-plugin-test', 'karin-plugin-xxx']
 * ```
 */
export const getAppPlugins = async (): Promise<GitPluginName[]> => {
  const cached = getPluginCache.get(key.list)
  if (cached) return cached

  const dir = './plugins'
  const files = await fs.promises.readdir(dir, { withFileTypes: true })
  /** 忽略文件、非`karin-plugin-`开头的文件夹、忽略存在`package.json` */
  const list = (await Promise.all(files.map(async v => {
    if (!v.isDirectory()) return ''
    if (!v.name.startsWith('karin-plugin-')) return ''
    if (fs.existsSync(`${dir}/${v.name}/package.json`)) return ''

    return v.name
  }))).filter(Boolean) as string[]

  /** 1分钟后删除缓存 */
  getPluginCache.set(key.list, list)
  setTimeout(() => getPluginCache.delete(key.list), 60 * 1000)
  return list as GitPluginName[]
}

/**
 * 获取单个app插件列表详细信息
 * @description 获取git插件列表详细信息
 * @example
 * ```ts
 * console.log(await getAppPluginsInfo())
 * // -> [{
 * //   type: 'app',
 * //   apps: ['plugins/karin-plugin-test/index.js'],
 * //   path: 'plugins/karin-plugin-test',
 * //   name: 'karin-plugin-test',
 * // }]
 * ```
 */
export const getAppPluginsInfo = async (): Promise<Info[]> => {
  const cached = getPluginCache.get(key.info)
  if (cached) return cached

  /** 插件列表 */
  const list = await getAppPlugins()
  /** 插件信息 */
  const info: Info[] = []

  await Promise.all(list.map(async (name) => {
    const filePath = `${process.cwd()}/plugins/${name}`
    const plugin: Info = {
      type: 'app',
      apps: [],
      dir: filePath,
      name,
    }

    const ext = process.env.karin_app_lang === 'ts' ? ['.ts', '.js'] : ['.js']
    plugin.apps = filesByExt(filePath, ext).map(v => path.join(filePath, v))
    info.push(plugin)
  }))

  /** 1分钟后删除缓存 */
  getPluginCache.set(key.info, info)
  setTimeout(() => getPluginCache.delete(key.info), 60 * 1000)
  return info
}
