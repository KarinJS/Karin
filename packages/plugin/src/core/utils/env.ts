import { pluginCache } from '../../cache'
import type { PkgEnv } from '../../package'
import type { DefineConfig, PackageEnv } from '../../config'

/**
 * 注入环境变量并返回结果
 * @param packageName - 插件包名称
 * @param key - 环境变量键
 * @param value - 环境变量值
 * @param comment - 注释说明
 * @returns 注入成功返回环境变量对象，失败返回 null
 */
const injectEnvVariable = (
  packageName: string,
  key: string,
  value: string | null | undefined,
  comment: string
): { value: string; comment: string } | null => {
  if (process.env[key]) return null

  if (typeof value !== 'string') {
    logger.warn(`${packageName} env.${key} 的值不符合要求，已跳过注入`)
    return null
  }

  process.env[key] = value
  logger.mark(`[env] ${packageName} 注入环境变量: ${key}=${value} comment: ${comment}`)
  return { value, comment }
}

/**
 * 解析环境变量值
 * @param value - 环境变量值（可能是字符串或对象）
 * @returns 解析后的值和注释
 */
const parseEnvValue = (value: string | { value: string; comment?: string }): {
  value: string
  comment: string
} => {
  if (typeof value === 'string') {
    return { value, comment: '' }
  }
  return {
    value: value.value,
    comment: value.comment || '',
  }
}

/**
 * 创建插件环境变量 (2.0版本)
 * @param packageName - 插件包名称
 * @param envs - 环境变量对象
 */
const createEnvV2 = (packageName: string, envs: DefineConfig['env']) => {
  if (!envs) return
  const result: PackageEnv = {}

  Object.entries(envs).forEach(([key, value]) => {
    const parsed = parseEnvValue(value)
    const injected = injectEnvVariable(packageName, key, parsed.value, parsed.comment)

    if (injected) {
      result[key] = injected
    }
  })

  pluginCache.envs.set(packageName, result)
}

/**
 * 创建插件环境变量 (1.0版本 - 兼容旧版)
 * @param packageName - 插件包名称
 * @param envs - 环境变量数组
 * @deprecated 建议使用 createEnvV2
 */
const createEnvV1 = (packageName: string, envs?: PkgEnv[]) => {
  if (!envs || !Array.isArray(envs) || envs.length === 0) return
  const result: PackageEnv = {}

  envs.forEach((env) => {
    const value = typeof env.value === 'string' ? env.value : null
    const comment = typeof env.comment === 'string' ? env.comment : ''
    const injected = injectEnvVariable(packageName, env.key, value, comment)

    if (injected) {
      result[env.key] = injected
    }
  })

  pluginCache.envs.set(packageName, result)
}

/**
 * 插件环境变量管理器
 */
export const pluginEnv = {
  /** 创建插件环境变量 (2.0版本) */
  create: createEnvV2,
  /** 创建插件环境变量 (1.0版本 - 兼容旧版) */
  createV1: createEnvV1,
}
