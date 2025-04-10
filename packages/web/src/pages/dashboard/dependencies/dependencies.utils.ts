import type { Dependency } from 'node-karin'

// 定义过滤模式类型
export type FilterMode = 'all' | 'plugins' | 'updatable'

// 获取npmjs链接
export const getNpmLink = (packageName: string): string => {
  // 如果是@开头的作用域包，需要特殊处理
  if (packageName.startsWith('@')) {
    const [scope, name] = packageName.split('/')
    return `https://www.npmjs.com/package/${scope}%2F${name}`
  }
  return `https://www.npmjs.com/package/${packageName}`
}

/**
 * 判断依赖是否有可用更新
 * @param dependency 依赖对象
 * @returns 是否有可用更新
 */
export const hasUpdate = (dependency: Dependency): boolean => {
  if (!dependency.latest.length) return false

  // 获取最新版本（数组中的最后一个元素）
  const latestVersion = dependency.latest[dependency.latest.length - 1]

  // 直接比较当前版本和最新版本是否相同
  return dependency.current !== latestVersion
}
