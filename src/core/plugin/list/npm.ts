import fs from 'node:fs'
import path from 'path'
import { getPluginCache } from '../cache/cache'
import { requireFileSync } from '@/utils/fs/require'
import { Info } from './types'
import { PkgData } from '@/utils/fs/pkg'

const key = {
  list: 'npm:list',
  info: 'npm:list:info',
}

const getPkg = async (name: string): Promise<PkgData> => {
  const data = await requireFileSync(path.join(process.cwd(), 'node_modules', name, 'package.json'))
  return data
}

/**
 * 判断是否为npm插件
 * @param name - npm包名
 */
export const isNpmPlugin = async (name: string) => {
  const data = await getPkg(name)
  return !!data.karin
}

/**
 * @description 获取插件npm插件列表
 * @example
 * ```ts
 * console.log(await getNpmPlugins())
 * // -> ['@karinjs/adapter-qqbot', 'xxxxx']
 * ```
 */
export const getNpmPlugins = async (): Promise<string[]> => {
  const cached = getPluginCache.get(key.list)
  if (cached) return cached

  /** 屏蔽的依赖包列表 */
  const exclude = [
    'art-template',
    'axios',
    'chalk',
    'chokidar',
    'commander',
    'express',
    'level',
    'lodash',
    'log4js',
    'moment',
    'node-karin',
    'node-schedule',
    'redis',
    'ws',
    'yaml',
  ]

  /** 获取package.json */
  const pkg = await requireFileSync('./package.json', { ex: 0 })
  /** 获取dependencies列表 同时排除掉exclude、带@types的 */
  const dependencies = Object.keys(pkg.dependencies).filter((name) => !exclude.includes(name) && !name.startsWith('@types'))
  /** 排除非插件 */
  const list = await Promise.all(dependencies.map(async (name) => {
    const isPlugin = await isNpmPlugin(name)
    return isPlugin ? name : ''
  }))

  list.filter(Boolean)

  /** 1分钟后删除缓存 */
  getPluginCache.set(key.list, list)
  setTimeout(() => getPluginCache.delete(key.list), 60 * 1000)
  return list
}

/**
 * 获取插件npm插件列表详细信息
 */
export const getNpmPluginsInfo = async (): Promise<Info[]> => {
  /** 先读缓存 */
  const cached = getPluginCache.get(key.info)
  if (cached) return cached

  const dirPath = path.join(process.cwd(), 'node_modules')
  /** 插件列表 */
  const list: string[] = await getNpmPlugins()
  /** 插件信息 */
  const info: Info[] = []
  await Promise.all(list.map(async (name) => {
    const pkgPath = path.join(dirPath, name)
    const pkg = await getPkg(name)
    const plugin: Info = {
      type: 'npm',
      apps: [],
      dir: pkgPath,
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
      const appPath = path.join(pkgPath, app)
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
