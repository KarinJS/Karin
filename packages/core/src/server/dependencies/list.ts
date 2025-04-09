import axios from 'axios'
import { exec } from '@/utils/system/exec'
import { requireFileSync } from '@/utils/fs/require'
import { createBadRequestResponse, createSuccessResponse } from '../utils/response'
import { REDIS_DEPENDENCIES_LIST_CACHE_KEY, REDIS_DEPENDENCIES_LIST_CACHE_EXPIRE } from '@/env/key/redis'

import type { RequestHandler, Request, Response } from 'express'
import type { DependenciesApiResponse, PnpmDependencies, PnpmDependency } from '@/types/server'

/**
 * 获取项目依赖列表
 */
export const getDependenciesListRouter: RequestHandler = async (req, res) => {
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
  const list: DependenciesApiResponse[] = []
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
          key as DependenciesApiResponse['type']
        ))
      })
    })
  }

  await Promise.allSettled(promises)
  await setCache(list)
  return createSuccessResponse(res, list)
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
  list: DependenciesApiResponse[],
  key: string,
  value: PnpmDependency,
  type: DependenciesApiResponse['type']
) => {
  if (!key || !value?.version) {
    return
  }

  try {
    /** 获取npm源 */
    const registry = await getRegistry()
    /** 请求npm源 */
    const response = await axios.get(`${registry}/${key}`)
    /** 获取版本列表 */
    const versions = Object.keys(response.data.versions || {})

    /** 获取最新的15个版本 数组最后就是最新的版本 不足15个就返回全部 */
    const latest = versions.slice(-15).filter(Boolean)

    /** type以pkg中的为准 */
    if (pkg.dependencies?.[key]) {
      type = 'dependencies'
    } else if (pkg.devDependencies?.[key]) {
      type = 'devDependencies'
    } else if (pkg.peerDependencies?.[key]) {
      type = 'peerDependencies'
    } else if (pkg.optionalDependencies?.[key]) {
      type = 'optionalDependencies'
    }

    list.push({
      name: key,
      type,
      current: value.version,
      latest,
    })
  } catch (error) {
    logger.debug(`[getDependenciesInfo] 获取${key}的版本信息失败`, error)
  }
}

/**
 * 获取registry
 */
const getRegistry = async () => {
  if (process.env.npm_config_registry) {
    return process.env.npm_config_registry
  }

  const registry = await exec('npm config get registry')
  process.env.npm_config_registry = registry.stdout
  return registry.stdout
}

/**
 * 获取缓存
 * @param req - 请求
 * @param res - 响应
 */
const getCache = async (req: Request, res: Response) => {
  if (req.query?.force || req.body?.force) {
    return null
  }

  const { redis } = await import('@/index')
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
const setCache = async (data: DependenciesApiResponse[]) => {
  const { redis } = await import('@/index')
  await redis.set(
    REDIS_DEPENDENCIES_LIST_CACHE_KEY,
    JSON.stringify(data),
    { EX: REDIS_DEPENDENCIES_LIST_CACHE_EXPIRE }
  )
}

/** 初始化一下防止并发获取 */
getRegistry()
