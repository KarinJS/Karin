import axios from 'axios'
import { exec } from '@/utils/system/exec'
import type { NpmRegistryResponse } from '@/types'

/**
 * 获取registry
 */
export const getRegistry = async () => {
  if (process.env.npm_config_registry) {
    return process.env.npm_config_registry
  }

  const registry = await exec('npm config get registry')
  process.env.npm_config_registry = registry.stdout
  return registry.stdout
}

/**
 * 获取一个npm包registry配置
 * @param name - 包名
 * @returns registry
 */
export const getNpmRegistry = async (name: string): Promise<NpmRegistryResponse> => {
  /** 获取npm源 */
  const registry = await getRegistry()
  /** 请求npm源 */
  const response = await axios.get(`${registry}/${name}`)
  return response.data
}

/**
 * 获取一个npm包的最新版本
 * @param name - 包名
 * @returns 最新版本
 */
export const getNpmLatestVersion = async (name: string) => {
  try {
    const result = await getNpmRegistry(name)
    return result['dist-tags'].latest
  } catch (error) {
    logger.debug(new Error(`获取${name}最新版本失败`, { cause: error }))
    return null
  }
}

/** 初始化一下 防止并发 */
getRegistry()
