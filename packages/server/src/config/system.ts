import { config } from '@karinjs/core'

/**
 * 获取 `karin` 系统配置
 * @param file 配置文件名称类型
 * @returns 详细配置
 */
export const getSystemConfig = async (file: string) => {
  if (file === 'config') {
    return config.config()
  }

  if (file === 'adapter') {
    return config.adapter()
  }

  if (file === 'groups') {
    return config.groups(true)
  }

  if (file === 'privates') {
    return config.privates(true)
  }

  if (file === 'render') {
    return config.render()
  }

  if (file === 'redis') {
    return config.redis()
  }

  if (file === 'pm2') {
    return config.pm2()
  }

  if (file === 'env') {
    return config.getEnv()
  }

  return null
}

/** `karin` 系统配置类型 */
export type SetSystemConfig = Parameters<typeof config.setConfig>[0]

/**
 * 保存 `karin` 系统配置
 * @param file 配置文件名称类型
 * @param data 配置数据
 * @returns 保存配置
 */
export const setSystemConfig = async (file: SetSystemConfig, data: Record<string, any>) => {
  const list: SetSystemConfig[] = ['config', 'adapter', 'render', 'pm2', 'redis', 'groups', 'privates', 'env']

  if (!list.includes(file)) return false
  config.setConfig(file, data)
  return true
}
