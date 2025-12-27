/**
 * 引擎版本检查器 - 极简版
 * @module core/engines
 */

import { cache } from '../api/cache'

/**
 * 检查插件的 engines 配置是否符合要求
 * @param packageName - 插件包名称
 * @param engines - package.json 中的 engines.karin 配置
 * @param ignoreEngines - 是否忽略引擎版本检查
 * @returns 是否符合要求
 */
const check = (
  packageName: string,
  engines?: string,
  ignoreEngines: boolean = false
): boolean => {
  if (!engines || ignoreEngines) {
    return true
  }

  const version = process.env.KARIN_VERSION
  if (!version) return true

  try {
    // 简化版本检查，支持基本格式
    const matches = satisfiesVersion(version, engines)
    if (!matches) {
      cache.engines.set(packageName, { version: engines, ignoreEngines })
    }
    return matches
  } catch {
    return true
  }
}

/**
 * 简化版本满足检查
 * @param current - 当前版本
 * @param required - 要求的版本范围
 */
function satisfiesVersion (current: string, required: string): boolean {
  // 尝试使用 semver，如果不可用则使用简化检查
  try {
    const semver = require('semver')
    return semver.satisfies(current, required, { includePrerelease: true, loose: true })
  } catch {
    // 简化检查
    const cleanCurrent = current.replace(/^v/, '').split('-')[0]
    const cleanRequired = required.replace(/^[>=^~]+/, '').replace(/\.x/g, '.0')

    const currentParts = cleanCurrent.split('.').map(Number)
    const requiredParts = cleanRequired.split('.').map(Number)

    // 基本的版本比较
    if (required.startsWith('>=')) {
      for (let i = 0; i < 3; i++) {
        if (currentParts[i] > requiredParts[i]) return true
        if (currentParts[i] < requiredParts[i]) return false
      }
      return true
    }

    if (required.startsWith('^')) {
      // 主版本必须相同
      if (currentParts[0] !== requiredParts[0]) return false
      // 当前版本必须 >= 要求版本
      for (let i = 1; i < 3; i++) {
        if (currentParts[i] > requiredParts[i]) return true
        if (currentParts[i] < requiredParts[i]) return false
      }
      return true
    }

    // 精确匹配
    return cleanCurrent === cleanRequired
  }
}

/**
 * 打印不符合 engines 要求的插件包提示信息
 */
const print = (): void => {
  const result = cache.engines.get() as Record<string, { version: string, ignoreEngines: boolean }>
  const keys = Object.keys(result)
  if (!result || keys.length === 0) {
    return
  }

  const karinVersion = process.env.KARIN_VERSION || 'unknown'

  console.warn('')
  console.warn('⚠️  插件兼容性警告')
  console.warn('─'.repeat(50))
  console.warn(`当前 Karin 版本: ${karinVersion}`)
  console.warn('─'.repeat(50))
  console.warn('以下插件包不符合 engines 版本要求:\n')

  keys.forEach((pluginName, index) => {
    const info = result[pluginName]
    const count = `[${index + 1}/${keys.length}]`
    console.warn(`  ${count} ✗ ${pluginName}`)
    if (info?.version) {
      console.warn(`      要求版本: ${info.version || '未知'}`)
    }
  })

  console.warn('')
  console.warn('提示: 这些插件可能无法正常工作，请更新插件或升级 Karin 版本')
  console.warn('─'.repeat(50))
  console.warn('')
}

/**
 * 引擎检查器
 */
export const engines = { check, print }
