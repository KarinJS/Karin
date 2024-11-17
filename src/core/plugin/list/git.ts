import fs from 'node:fs'
import path from 'node:path'
import { getPluginCache } from '../cache/cache'
import { requireFileSync } from '@/utils/fs/require'
import { PkgData } from '@/utils/fs/pkg'
import { Info } from './types'

/** git插件包名规范 */
export type GitPluginName = `karin-plugin-${string}`

const key = {
  list: 'git:list',
  info: 'git:list:info',
}

const getPkg = (name: string): PkgData | null => {
  try {
    const data = requireFileSync(path.join(process.cwd(), 'pluhins', name, 'package.json'))
    return data
  } catch (error) {
    const data = requireFileSync(path.join(process.cwd(), 'package.json'))
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
  const cached = getPluginCache.get(key.list)
  if (cached) return cached

  const dir = './plugins'
  const files = await fs.promises.readdir(dir, { withFileTypes: true })
  /** 忽略文件、非`karin-plugin-`开头的文件夹、不存在`package.json` */
  let list = await Promise.all(files.map(async v => {
    if (!v.isDirectory()) return ''
    if (!v.name.startsWith('karin-plugin-')) return ''
    if (!fs.existsSync(`${dir + v.name}/package.json`)) return ''
    return v.name
  })) || []

  /** 处理根目录 */
  const root = await requireFileSync('./package.json')
  if (root.name.startsWith('karin-plugin-') && root.karin) list.push(root.name)

  list = list.filter(Boolean)

  /** 1分钟后删除缓存 */
  getPluginCache.set(key.list, list)
  setTimeout(() => getPluginCache.delete(key.list), 60 * 1000)
  return list as GitPluginName[]
}

/**
 * 获取插件git插件列表详细信息
 * @description 获取git插件列表详细信息
 */
export const getGitPluginsInfo = async (): Promise<Info[]> => {
  const cached = getPluginCache.get(key.info)
  if (cached) return cached

  /** 插件列表 */
  const list: {
    /** 插件包根路径 */
    filePath: string,
    /** 插件名称 */
    name: string
  }[] = []

  const dir = process.cwd() + '/plugins'
  const files = fs.readdirSync(dir, { withFileTypes: true })
  await Promise.all(files.map(async v => {
    if (!v.isDirectory()) return
    if (!v.name.startsWith('karin-plugin-')) return
    if (!fs.existsSync(`${dir}${v.name}/package.json`)) return
    list.push({ filePath: `${dir}/${v.name}`, name: v.name })
  }))

  /** 处理根目录 */
  const root = await requireFileSync('./package.json')
  if (root.karin) list.push({ filePath: process.cwd(), name: root.name })

  /** 插件信息 */
  const info: Info[] = []

  await Promise.all(list.map(async ({ filePath, name }) => {
    const pkg = getPkg(name)
    if (!pkg) return
    const plugin: Info = {
      type: 'git',
      apps: [],
      dir: filePath,
      name: pkg.name,
    }

    /** 没有apps */
    if (!pkg.karin?.apps?.length) {
      info.push(plugin)
      return
    }

    const apps: string[] = []
    if (typeof pkg.karin.apps === 'string') {
      apps.push(pkg.karin.apps)
    } else if (Array.isArray(pkg.karin.apps)) {
      apps.push(...pkg.karin.apps)
    }

    await Promise.all(apps.map(async app => {
      const appPath = path.join(filePath, app)
      if (!fs.existsSync(appPath)) return
      plugin.apps.push(appPath)
    }))

    info.push(plugin)
  }))

  /** 1分钟后删除缓存 */
  getPluginCache.set(key.info, info)
  setTimeout(() => getPluginCache.delete(key.info), 60 * 1000)
  return info
}
