import lodash from 'lodash'
import { getPlugins } from '@karinjs/plugin'
import { exec, requireFileSync, getNpmRegistry } from '@karinjs/utils'
import { createBadRequestResponse, createServerErrorResponse, createSuccessResponse } from '../utils/response'
import { REDIS_DEPENDENCIES_LIST_CACHE_KEY, REDIS_DEPENDENCIES_LIST_CACHE_EXPIRE } from '@karinjs/envs'

import type { RequestHandler, Request, Response } from 'express'

/**
 * dependencies value类型
 */
export interface PnpmDependency {
  /** 依赖来源 */
  from: string
  /** 依赖版本 */
  version: string
  /** 依赖路径 */
  path: string
  /** 依赖下载地址 在link下不存在 例如 https://registry.npmjs.org/@types/node/-/node-18.19.84.tgz */
  resolved?: string
}

/**
 * `pnpm list --depth=0 --json`命令返回类型
 */
export interface PnpmDependencies {
  /** 项目名称 */
  name: string
  /** 项目版本 */
  version: string
  /** 项目路径 */
  path: string
  /** 是否为私有项目 */
  private: boolean
  /** 项目依赖 */
  dependencies: Record<string, PnpmDependency>
  /** 项目开发依赖 */
  devDependencies: Record<string, PnpmDependency>
  /** 未保存的依赖 */
  unsavedDependencies: Record<string, PnpmDependency>
}

/**
 * dependenciesApi响应类型
 */
export interface Dependency {
  /** 依赖名称 */
  name: string
  /** 是否为karin插件 */
  isKarinPlugin: boolean
  /** 当前版本 */
  current: string
  /** 最新的15个版本 */
  latest: string[]
  /** package.json中的值 如果不存在会返回空字符串 */
  packageValue: string
  /**
   * 依赖类型
   * - dependencies: 生产依赖
   * - devDependencies: 开发依赖
   * - unsavedDependencies: 未保存依赖
   * - peerDependencies: 对等依赖
   * - optionalDependencies: 可选依赖
  */
  type: 'dependencies' | 'devDependencies' | 'unsavedDependencies' | 'peerDependencies' | 'optionalDependencies'
  /**
  * 依赖来源
  * - 此处最大的作用就是用于区分别名安装的依赖
  * - 例如`lodash@npm:@karinjs/lodash` 这里的值就会是`@karinjs/lodash`
  */
  from: string
}

/**
 * 获取项目依赖列表
 */
export const getDependenciesListRouter: RequestHandler = async (req, res) => {
  try {
    const cache = await getCache(req, res)
    if (cache) {
      return createSuccessResponse(res, cache)
    }

    const { stdout, error } = await exec('pnpm list --depth=0 --json')
    if (error) {
      return createBadRequestResponse(res, error.message)
    }

    /** 并发请求 */
    const promises: Promise<void>[] = []
    /** 返回给前端的依赖列表 */
    let list: Dependency[] = []
    /** package.json */
    const pkg = requireFileSync('./package.json', { force: true })
    /** 当前依赖列表 */
    const dependencies = JSON.parse(stdout) as PnpmDependencies[]

    /** 遍历当前依赖列表 转换格式 */
    for (const dependency of dependencies) {
      Object.entries(dependency).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          return
        }

        Object.entries(value).forEach(([k, v]) => {
          promises.push(getDependenciesInfo(
            pkg,
            list,
            k,
            v as PnpmDependency,
            key as Dependency['type']
          ))
        })
      })
    }

    await Promise.allSettled(promises)
    const npmPlugin = await getPlugins('npm')
    list.forEach(item => {
      item.isKarinPlugin = npmPlugin.some(plugin => plugin === `npm:${item.name}`)
    })

    /**
     * 依赖类型权重映射
     * 权重越小优先级越高
     */
    const typeWeightMap: Record<Dependency['type'], number> = {
      dependencies: 1, // 生产依赖
      devDependencies: 2, // 开发依赖
      peerDependencies: 3, // 对等依赖
      optionalDependencies: 4, // 可选依赖
      unsavedDependencies: 5, // 临时依赖
    }

    list = lodash.sortBy(list, [
      // 1. 首先按照是否是node-karin插件排序（取反，使node-karin排在前面）
      item => !(item.name === 'node-karin'),
      // 2. 然后按照是否是karin插件排序
      'isKarinPlugin',
      // 3. 然后按照依赖类型权重排序
      item => typeWeightMap[item.type],
      // 4. 最后按照名称排序
      'name',
    ])

    await setCache(list)
    return createSuccessResponse(res, list)
  } catch (error) {
    logger.error('[getDependenciesListRouter]', error)
    return createServerErrorResponse(res, error instanceof Error ? error.message : String(error))
  }
}

/**
 * 获取依赖信息
 * @param pkg - 项目package.json
 * @param list - 依赖列表
 * @param key - 依赖名称
 * @param value - 依赖信息
 * @param type - 依赖类型
 */
const getDependenciesInfo = async (
  pkg: Record<string, any>,
  list: Dependency[],
  key: string,
  value: PnpmDependency,
  type: Dependency['type']
) => {
  if (!key || !value?.version) {
    return
  }

  try {
    /** 获取版本列表 */
    const registry = await getNpmRegistry(value.from)
    const versions = Object.keys(registry.versions)

    /** 获取最新的15个版本 数组最后就是最新的版本 不足15个就返回全部 */
    const latest = versions.slice(-15).filter(Boolean)

    let packageValue = ''
    /** type以pkg中的为准 */
    if (pkg.dependencies?.[key]) {
      type = 'dependencies'
      packageValue = pkg.dependencies?.[key]
    } else if (pkg.devDependencies?.[key]) {
      type = 'devDependencies'
      packageValue = pkg.devDependencies?.[key]
    } else if (pkg.peerDependencies?.[key]) {
      type = 'peerDependencies'
      packageValue = pkg.peerDependencies?.[key]
    } else if (pkg.optionalDependencies?.[key]) {
      type = 'optionalDependencies'
      packageValue = pkg.optionalDependencies?.[key]
    }

    list.push({
      name: key,
      type,
      from: value.from,
      current: value.version,
      isKarinPlugin: false,
      latest,
      packageValue,
    })
  } catch (error) {
    logger.debug(`[getDependenciesInfo] 获取${key}的版本信息失败`, error)
  }
}

/**
 * 获取缓存
 * @param req - 请求
 * @param res - 响应
 */
const getCache = async (req: Request, _: Response) => {
  if (req.body?.force) {
    return null
  }

  const { redis } = await import('@karinjs/core')
  const cache = await redis.get(REDIS_DEPENDENCIES_LIST_CACHE_KEY)
  if (cache) {
    const data = JSON.parse(cache)
    if (!Array.isArray(data)) {
      await redis.del(REDIS_DEPENDENCIES_LIST_CACHE_KEY)
      return null
    }

    return data
  }

  return null
}

/**
 * 设置缓存
 * @param data - 依赖列表
 */
const setCache = async (data: Dependency[]) => {
  const { redis } = await import('@karinjs/core')
  await redis.set(
    REDIS_DEPENDENCIES_LIST_CACHE_KEY,
    JSON.stringify(data),
    { EX: REDIS_DEPENDENCIES_LIST_CACHE_EXPIRE }
  )
}
