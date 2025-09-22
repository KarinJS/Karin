import { raceRequest } from '@karinjs/utils'
import { REDIS_PLUGIN_LIST_CACHE_KEY } from '@karinjs/envs'

import type { PluginPackageType } from '../core'

/**
 * 插件基础类型
 */
export interface KarinPluginBase {
  /** 插件包名 */
  name: string
  /**
   * 插件类型
   * - npm: npm 插件
   * - git: git 插件
   * - app: 单应用插件
   */
  type: PluginPackageType
  /** 插件描述 限制 50 长度 */
  description: string
  /** 插件提交到仓库时间 */
  time: string
  /** 插件主页 */
  home: string
  /** 插件许可证 */
  license: {
    /** 许可证名称 */
    name: string
    /** 许可证地址 */
    url: string
  }
  /** 插件作者 */
  author: {
    /** 名字 */
    name: string
    /** 主页 */
    home: string
    /** 头像 仅支持url 如果是github、gitee无需填写 */
    avatar?: string
  }[]
  /** 插件仓库 */
  repo: {
    /** 仓库类型 */
    type: 'github' | 'gitee' | 'gitcode' | 'gitlab' | 'npm'
    /** 仓库地址 */
    url: string
    /** 默认分支 npm类型为空字符串 */
    branch: string
  }[]
}

/**
 * npm 插件类型
 */
export interface KarinNpmPlugin extends KarinPluginBase {
  type: 'npm'
  /** 允许pnpm在安装期间执行脚本的包名列表 */
  allowBuild?: string[]
}

/**
 * git 插件类型
 */
export interface KarinGitPlugin extends KarinPluginBase {
  type: 'git'
}

/**
 * 单应用插件类型
 */
export interface KarinAppPlugin extends KarinPluginBase {
  type: 'apps'
  /** app文件直链 */
  files: {
    /** app插件名称 */
    name: string
    /** 文件直链 */
    url: string
    /** 描述 */
    description?: string
  }[]
}

/**
 * 插件市场类型每个插件的类型
 */
export type KarinPluginType = KarinNpmPlugin | KarinGitPlugin | KarinAppPlugin

/** 插件源地址列表 */
const PLUGIN_SOURCES = [
  'https://registry.npmmirror.com/@karinjs/plugins-list/latest',
  'https://registry.npmjs.com/@karinjs/plugins-list/latest',
  'https://mirrors.cloud.tencent.com/npm/@karinjs/plugins-list/latest',
]

/** 缓存有效期 默认12小时 */
const CACHE_TTL = process.env.PLUGIN_MARKET_CACHE_TTL ? Number(process.env.PLUGIN_MARKET_CACHE_TTL) : 12 * 60 * 60

/**
 * 获取插件市场
 * @param forceUpdate - 是否强制从远程获取，忽略缓存
 * @returns 返回最先成功响应的插件列表
 */
export const getPluginMarket = async (forceUpdate = false): Promise<{ plugins: KarinPluginType[] }> => {
  const { redis } = await import('@karinjs/core')
  if (!forceUpdate) {
    const cachedData = await redis.get(REDIS_PLUGIN_LIST_CACHE_KEY)
    if (cachedData) {
      const data = JSON.parse(cachedData)
      if (data) return data
    }
  }

  const results = await raceRequest<null, { plugins: KarinPluginType[] }>(PLUGIN_SOURCES, { method: 'get' })
  if (!results) throw new Error('无法从任何源获取插件列表')
  results.data.plugins = results.data.plugins.map(v => {
    const plugin: KarinPluginType = {
      ...v,
      // @ts-ignore
      type: (v.type === 'app' ? 'apps' : v.type) as PluginPackageType,
    }

    return plugin
  })

  await redis.set(REDIS_PLUGIN_LIST_CACHE_KEY, JSON.stringify(results.data), { EX: CACHE_TTL })
  logger.debug(`[插件列表] 数据已缓存，有效期${CACHE_TTL}秒`)

  return results.data
}
