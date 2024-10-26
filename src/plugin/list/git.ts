import fs from 'node:fs'
import path from 'node:path'
import { getPlgsCache } from '../cache/cache'
import { requireFile } from '@/utils/fs/require'
import { type PluginInfo } from './types'

/** git插件包名规范 */
export type GitPluginName = `karin-plugin-${string}`

const key = {
  list: 'git:list',
  info: 'git:list:info',
}

const getPkg = async (name: string) => {
  try {
    const data = await requireFile(path.join(process.cwd(), 'pluhins', name, 'package.json'))
    return data
  } catch (error) {
    const data = await requireFile(path.join(process.cwd(), 'package.json'))
    if (data.name === name) {
      return data
    }
    return null
  }
}

/**
 * @description 获取git插件列表
 * - 在 `0.13.0` 引入了对根目录下的插件的支持
 * - 满足以下条件 根目录也将被视为一个git插件
 * 1. 根目录存在`package.json`
 * 2. `package.json`中`name`不为`node-karin`
 * 3. `package.json`中`name`以`karin-plugin-`开头
 * 4. `package.json`中`karin`字段存在
 * @example
 * ```ts
 * console.log(await getGitPlugins())
 * // -> ['karin-plugin-test', 'karin-plugin-xxx']
 * ```
 */
export const getGitPlugins = async (): Promise<GitPluginName[]> => {
  const cached = getPlgsCache.get(key.list)
  if (cached) return cached

  const dir = './plugins'
  const files = await fs.promises.readdir(dir, { withFileTypes: true })
  /** 忽略文件、非`karin-plugin-`开头的文件夹、不存在`package.json` */
  const list = await Promise.all(files.map(async v => {
    if (!v.isDirectory()) return ''
    if (!v.name.startsWith('karin-plugin-')) return ''
    if (!fs.existsSync(`${dir + v.name}/package.json`)) return ''
    return v.name
  })) || []

  /** 处理根目录 */
  const root = await requireFile('./package.json')
  if (root.name.startsWith('karin-plugin-') && root.karin) list.push(root.name)

  list.filter(Boolean)

  /** 1分钟后删除缓存 */
  getPlgsCache.set(key.list, list)
  setTimeout(() => getPlgsCache.delete(key.list), 60 * 1000)
  return list as GitPluginName[]
}

/**
 * 获取插件git插件列表详细信息
 * @description 获取git插件列表详细信息
 */
export const getGitPluginsInfo = async (): Promise<PluginInfo[]> => {
  const cached = getPlgsCache.get(key.info)
  if (cached) return cached

  /** 插件列表 */
  const list = await getGitPlugins()
  /** 插件信息 */
  const info: PluginInfo[] = []

  await Promise.all(list.map(async (name) => {
    const pkg = await getPkg(name).catch(() => null)
    if (!pkg) return
    const plugin: PluginInfo = {
      type: 'git',
      apps: [],
      main: pkg.data?.main,
      path: pkg.path,
      name: pkg.name,
      pkg: pkg.data,
      version: pkg.data?.version || '0.0.0',
    }

    /** 没有apps */
    if (!pkg.data?.karin?.apps?.length) {
      info.push(plugin)
      return
    }

    const apps: string[] = []
    if (typeof pkg.data.karin.apps === 'string') {
      apps.push(pkg.data.karin.apps)
    } else if (Array.isArray(pkg.data.karin.apps)) {
      apps.push(...pkg.data.karin.apps)
    }

    await Promise.all(apps.map(async app => {
      const appPath = path.join(pkg.path, app)
      if (!fs.existsSync(appPath)) return
      plugin.apps.push(appPath)
    }))
  }))

  /** 1分钟后删除缓存 */
  getPlgsCache.set(key.info, info)
  setTimeout(() => getPlgsCache.delete(key.info), 60 * 1000)
  return info
}
