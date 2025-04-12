import type { Dependency } from 'node-karin'

// 定义过滤模式类型
export type FilterMode = 'all' | 'plugins' | 'updatable'

/**
 * 获取npmjs链接
 * @param packageName 包名
 * @returns npmjs包链接
 */
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

/**
 * 创建依赖更新数据
 * @param dep 依赖对象
 * @returns 格式化的更新数据
 */
export const createUpdateData = (
  dep: { name: string; targetVersion: string | null; from?: string }
): { name: string; version: string } => {
  // 优先使用用户选择的目标版本
  if (dep.targetVersion) {
    return {
      name: dep.name,
      version: dep.targetVersion,
    }
  }

  // 检查是否为别名依赖
  const isAlias = dep.from && dep.name !== dep.from

  // 否则使用latest
  return {
    name: dep.name,
    version: isAlias ? `npm:${dep.from}@latest` : 'latest',
  }
}

/**
 * 格式化别名依赖的版本号
 * @param dependency 依赖对象
 * @param version 版本号
 * @returns 格式化后的版本号
 */
export const formatVersionForAlias = (
  dependency: { from?: string; name: string },
  version: string
): string => {
  // 如果name和from不一样，表示是别名依赖
  if (dependency.from && dependency.name !== dependency.from) {
    return `npm:${dependency.from}@${version}`
  }
  return version
}
