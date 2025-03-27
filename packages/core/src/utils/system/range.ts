/** 版本对象类型定义 */
type Version = {
  major: number | null
  minor: number | null
  patch: number | null
  prerelease: string | null
  /**
   * 版本号中对应位置是否为通配符
   * 例如：1.x.0 => { majorWildcard: false, minorWildcard: true, patchWildcard: false }
   */
  majorWildcard: boolean
  minorWildcard: boolean
  patchWildcard: boolean
}

/**
 * 解析版本字符串为版本对象
 * @param version 版本字符串
 * @returns 解析后的版本对象
 */
const parseVersion = (version: string): Version => {
  /** 分离预发布版本 */
  const [versionPart, prerelease] = version.split('-')
  const parts = versionPart.split('.')

  /** 检查各部分是否为通配符 */
  const isWildcard = (part: string): boolean => part === 'x' || part === '*' || part === 'X'

  const majorWildcard = parts.length > 0 && isWildcard(parts[0])
  const minorWildcard = parts.length > 1 && isWildcard(parts[1])
  const patchWildcard = parts.length > 2 && isWildcard(parts[2])

  /** 将数字部分解析为数值，通配符解析为null */
  const parseNumberOrNull = (part: string): number | null => {
    if (!part || isWildcard(part)) return null
    return Number(part) || 0
  }

  return {
    major: parseNumberOrNull(parts[0]),
    minor: parseNumberOrNull(parts[1]),
    patch: parseNumberOrNull(parts[2]),
    prerelease: prerelease || null,
    majorWildcard,
    minorWildcard,
    patchWildcard,
  }
}

/**
 * 比较两个版本
 * @param v1 第一个版本
 * @param v2 第二个版本
 * @returns 比较结果：1(v1>v2), 0(v1=v2), -1(v1<v2)
 */
const compareVersions = (v1: string, v2: string): number => {
  const version1 = parseVersion(v1)
  const version2 = parseVersion(v2)

  /** 比较主版本号 */
  if (version1.major !== version2.major) {
    if (version1.major === null || version2.major === null) return 0 // 通配符匹配
    return version1.major > version2.major ? 1 : -1
  }

  /** 比较次版本号 */
  if (version1.minor !== version2.minor) {
    if (version1.minor === null || version2.minor === null) return 0 // 通配符匹配
    return version1.minor > version2.minor ? 1 : -1
  }

  /** 比较修订号 */
  if (version1.patch !== version2.patch) {
    if (version1.patch === null || version2.patch === null) return 0 // 通配符匹配
    return version1.patch > version2.patch ? 1 : -1
  }

  /**
   * 如果版本号相同，需要比较预发布版本
   * 无预发布版本 > 有预发布版本
   */
  if (version1.prerelease === null && version2.prerelease !== null) {
    return 1
  }

  if (version1.prerelease !== null && version2.prerelease === null) {
    return -1
  }

  /** 两者都有预发布版本，需要比较预发布版本 */
  if (version1.prerelease !== null && version2.prerelease !== null) {
    /**
     * 简化比较，实际上应该更复杂
     * 常见预发布标识符顺序: alpha < beta < rc
     */
    const prereleaseOrder: Record<string, number> = {
      alpha: 1,
      beta: 2,
      rc: 3,
    }

    /**
     * 获取预发布标识符的顺序
     * @param pre 预发布标识符
     */
    const getPrereleaseOrder = (pre: string): number => {
      /** 提取标识符部分（如从 "beta.1" 中提取 "beta"） */
      const identifier = pre.split('.')[0]
      return prereleaseOrder[identifier] || 0
    }

    const order1 = getPrereleaseOrder(version1.prerelease)
    const order2 = getPrereleaseOrder(version2.prerelease)

    if (order1 !== order2) {
      return order1 > order2 ? 1 : -1
    }

    /**
     * 如果标识符相同，比较数字后缀
     * @param pre 预发布标识符
     */
    const getNumericSuffix = (pre: string): number => {
      const parts = pre.split('.')
      return parts.length > 1 ? parseInt(parts[1], 10) || 0 : 0
    }

    const num1 = getNumericSuffix(version1.prerelease)
    const num2 = getNumericSuffix(version2.prerelease)

    if (num1 !== num2) {
      return num1 > num2 ? 1 : -1
    }
  }

  /** 版本完全相同 */
  return 0
}

/**
 * 检查版本是否匹配（考虑通配符）
 * @param version 要检查的版本
 * @param pattern 版本模式（可包含通配符）
 * @returns 是否匹配
 */
const matchesPattern = (version: string, pattern: string): boolean => {
  const versionObj = parseVersion(version)
  const patternObj = parseVersion(pattern)

  // 主版本号必须匹配（除非是通配符）
  if (!patternObj.majorWildcard && versionObj.major !== patternObj.major) {
    return false
  }

  // 次版本号必须匹配（除非是通配符）
  if (!patternObj.minorWildcard && versionObj.minor !== patternObj.minor) {
    return false
  }

  // 修订版本号必须匹配（除非是通配符）
  if (!patternObj.patchWildcard && versionObj.patch !== patternObj.patch) {
    return false
  }

  // 如果没有预发布部分，则匹配成功
  if (patternObj.prerelease === null) {
    return true
  }

  // 如果pattern有预发布版本，但version没有，则不匹配
  if (patternObj.prerelease !== null && versionObj.prerelease === null) {
    return false
  }

  // 如果都有预发布版本，则比较预发布版本
  if (patternObj.prerelease !== null && versionObj.prerelease !== null) {
    return compareVersions(version, pattern) === 0
  }

  return true
}

/**
 * 解析范围条件
 * @param condition 条件字符串
 * @returns 解析后的操作符和版本
 */
const parseRangeCondition = (condition: string): { operator: string; version: string } => {
  const operators = ['>=', '<=', '>', '<', '^']
  let operator = ''
  let version = condition

  /** 检查是否有操作符 */
  for (const op of operators) {
    if (condition.startsWith(op)) {
      operator = op
      version = condition.substring(op.length)
      break
    }
  }

  return { operator, version }
}

/**
 * 检查版本是否满足单个条件
 * @param version 版本
 * @param condition 条件
 * @returns 是否满足条件
 */
const satisfiesCondition = (version: string, condition: string): boolean => {
  const { operator, version: rangeVersion } = parseRangeCondition(condition)

  // 处理包含通配符的版本匹配
  if (rangeVersion.includes('x') || rangeVersion.includes('*') || rangeVersion.includes('X')) {
    if (operator === '') {
      // 精确通配符匹配
      return matchesPattern(version, rangeVersion)
    }
    // 其他操作符与通配符组合暂不支持
    return false
  }

  const comparison = compareVersions(version, rangeVersion)

  /** 提前声明变量，避免在case块中声明 */
  const parsedRange = parseVersion(rangeVersion)
  let upperBound: string

  switch (operator) {
    case '>':
      return comparison > 0
    case '>=':
      return comparison >= 0
    case '<':
      return comparison < 0
    case '<=':
      return comparison <= 0
    case '^':
      /**
       * ^1.0.0 表示 >=1.0.0 <2.0.0
       * ^0.1.0 表示 >=0.1.0 <0.2.0
       */

      /** 检查下界 */
      if (compareVersions(version, rangeVersion) < 0) {
        return false
      }

      if (parsedRange.major === 0) {
        /** ^0.y.z 的上界是 0.(y+1).0 */
        upperBound = `0.${parsedRange.minor! + 1}.0`
      } else {
        /** ^x.y.z 的上界是 (x+1).0.0 */
        upperBound = `${parsedRange.major! + 1}.0.0`
      }

      return compareVersions(version, upperBound) < 0
    default:
      /** 精确匹配 */
      return comparison === 0
  }
}

/**
 * 一个简单的版本范围检查函数
 * @param range 版本范围
 * @param version 版本
 * @description 检查版本是否在范围内
 * @example
 * ```ts
 * console.log(range('^1.0.0', '1.0.1')) // true
 * console.log(range('^1.0.0', '2.0.0')) // false
 * console.log(range('^1.0.0', '0.0.1')) // false
 * console.log(range('>=1.0.0', '1.0.0')) // true
 * console.log(range('>=1.0.0', '0.0.1')) // false
 * console.log(range('<=1.0.0', '1.0.0')) // true
 * console.log(range('<=1.0.0', '2.0.0')) // false
 * console.log(range('>=1.0.0 <2.0.0', '1.0.0')) // true
 * console.log(range('1.0.0-alpha', '1.0.0-beta')) // false
 * console.log(range('1.0.0-beta', '1.0.0-alpha')) // false
 * console.log(range('^1.0.0-beta', '1.0.0-alpha')) // false
 * console.log(range('>=1.0.0-beta', '1.0.0-alpha')) // false
 * console.log(range('^1.0.0-alpha', '1.0.0-beta')) // true
 * console.log(range('^1.0.0-beta', '1.0.0-beta')) // true
 * console.log(range('^1.0.0-alpha', '1.0.0-alpha')) // true
 *
 * // 通配符示例
 * console.log(range('1.0.x', '1.0.1')) // true
 * console.log(range('1.0.x', '1.1.0')) // false
 * console.log(range('1.x.x', '1.2.3')) // true
 * console.log(range('1.x.0', '1.2.0')) // true
 * console.log(range('1.x.0', '1.2.1')) // false
 * ```
 */
export const range = (range: string, version: string): boolean => {
  /** 处理复合条件（用空格分隔的多个条件） */
  const conditions = range.split(' ')

  /** 所有条件都必须满足 */
  return conditions.every(condition => satisfiesCondition(version, condition))
}
