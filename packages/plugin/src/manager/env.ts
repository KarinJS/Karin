import type { PackageEnv } from '../pkg'

/**
 * 构建收集环境变量函数返回函数类型
 * @param name 插件名称
 * @param data 环境变量数据
 */
type CreateAddEnvReturn = (
  name: string,
  data: PackageEnv[]
) => void

/**
 * 构建收集环境变量函数
 * @param list 存放数组
 */
export const createAddEnv = (list?: PackageEnv[]): CreateAddEnvReturn => {
  if (!list) {
    return () => { }
  }

  return (name: string, data: PackageEnv[]) => {
    if (!Array.isArray(data)) {
      logger.error(`[addEnv] 插件${name}的env字段不符合规范 已跳过写入`)
      return
    }

    data.forEach(val => {
      const { key, value, comment = '' } = val
      if (!key || !value || typeof key !== 'string' || typeof value !== 'string') {
        logger.warn(
          `[addEnv] 插件${name}的env不符合规范 已跳过\n` +
          `key: ${key}\n` +
          `value: ${value}\n` +
          `comment: ${comment}`
        )
        return
      }

      list.push({
        key,
        value,
        comment: typeof comment !== 'string' ? String(comment) : comment,
      })
    })
  }
}
