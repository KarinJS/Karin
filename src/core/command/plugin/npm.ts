import fs from 'node:fs'
import path from 'path'
import { PluginInfo } from '@/plugin/types'
import { requireFile } from '@/utils/require'
import { pluginPkg } from '../fs/pkg'

/** npm包信息 */
export interface NpmInfo {
  /** npm包名 */
  name: string
  /** npm包路径 */
  path: string
  /** npm包的package.json对象 */
  data: PluginInfo['pkg']
  /** 是否为npm插件 */
  isPlugin: boolean
}

/** 缓存 */
const cache = new Map<string, any>()

/**
 * 判断是否为npm插件
 * @param name - npm包名
 */
export const isNpmPlugin = async (name: string) => {
  const info = await pluginPkg(name)
  return info.isPlugin
}

/** 获取插件npm包插件名称列表 */
export const getPluginNpmName = async () => {
  const strKey = 'string[]'
  const cached = cache.get(strKey)
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
  const pkg = await requireFile('./package.json', { ex: 0 })
  /** 获取dependencies列表 同时排除掉exclude、带@types的 */
  const dependencies = Object.keys(pkg.dependencies).filter((name) => !exclude.includes(name) && !name.startsWith('@types'))
  /** 排除非插件 */
  const list = await Promise.all(dependencies.map(async (name) => {
    const isPlugin = await isNpmPlugin(name)
    return isPlugin ? name : ''
  }))

  list.filter(Boolean)

  cache.set(strKey, list)
  /** 1分钟后删除缓存 */
  setTimeout(() => cache.delete(strKey), 60 * 1000)
  return list
}

/**
 * 获取插件npm包列表
 * @param showDetails - 是否返回注册plugin格式的信息 默认只返回插件npm包名
 */
export const getPluginNpm = async <T extends boolean = false> (showDetails: T) => {
  const strKey = 'string[]'
  const infoKey = 'info[]'

  /** 先读缓存 */
  const key = showDetails ? infoKey : strKey
  const cached = cache.get(key)
  if (cached) return cached

  /** 插件名称列表 */
  let list: string[] = []
  if (showDetails) {
    /** 尝试走缓存拿list */
    const cached = cache.get(strKey)
    list = cached || (await getPluginNpmName())
  } else {
    list = await getPluginNpmName()
  }

  if (!showDetails) return list as T extends true ? string[] : string

  const info: PluginInfo[] = []
  for (const name of list) {
    const pkg = await pluginPkg(name)
    const plugin: PluginInfo = {
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
      continue
    }

    if (typeof pkg.data.karin.apps === 'string') {
      const appPath = path.join(pkg.path, pkg.data.karin.apps)
      if (fs.existsSync(appPath)) plugin.apps.push(appPath)
      continue
    }

    for (const app of pkg.data.karin.apps) {
      const appPath = path.join(pkg.path, app)
      if (!fs.existsSync(appPath)) continue
      plugin.apps.push(appPath)
    }
  }

  cache.set(infoKey, info)
  /** 1分钟后删除缓存 */
  setTimeout(() => cache.delete(infoKey), 60 * 1000)
  return info as T extends true ? PluginInfo[] : string[]
}
