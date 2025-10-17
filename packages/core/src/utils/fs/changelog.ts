/**
 * 转义正则表达式中的特殊字符
 * @param str 需要转义的字符串
 * @returns 转义后的字符串
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 提取指定版本号的更新日志
 * @param version 版本号，可包含预发布/构建元数据（如 `-beta`）
 * @param data `CHANGELOG.md` 文件内容
 * @returns 命中的更新日志字符串；无法定位返回 `null`
 * @description
 * - 先将版本规范化为稳定版 `x.y.z`；
 * - 不存在时按新 -> 旧顺序回退到不超过目标稳定版的最新版本。
 */
export const log = (version: string, data: string): string | null => {
  const escapedVersion = escapeRegex(version)
  const regex = new RegExp(`## \\[${escapedVersion}\\](.|\\n)*?(?=## \\[|$)`, 'g')
  const match = data.match(regex)
  return match ? match[0] : null
}

/**
 * 从指定版本开始提取连续的更新日志
 * @param version 起始版本号
 * @param data `CHANGELOG.md` 文件内容
 * @param length 提取条数，默认为 1
 * @param reverse 是否反向提取；`false` 向后，`true` 向前
 * @returns 拼接后的更新日志字符串；找不到起始版本返回空字符串
 * @description
 * - 起始版本会规范化并回退到不超过目标稳定版的最新版本；
 * - 切片范围将做边界裁剪以避免越界。
 */
export const logs = (version: string, data: string, length = 1, reverse = false): string => {
  if (typeof length !== 'number') {
    throw new TypeError('提取长度必须为数字')
  }

  const list = parseChangelog(data)
  const keys = Object.keys(list)
  const startKey = findFallbackVersionKey(keys, version)
  if (!startKey) return ''

  const index = keys.indexOf(startKey)
  const start = reverse ? index - length : index
  const end = reverse ? index : index + length

  const sliceStart = Math.max(0, start)
  const sliceEnd = Math.min(keys.length, end)

  const versions = keys.slice(sliceStart, sliceEnd).map((key) => (list[key] ? list[key] : ''))
  return versions.join('')
}

/**
 * 提取指定版本区间的更新日志
 * @param data `CHANGELOG.md` 文件内容
 * @param startVersion 起始版本号（较旧）
 * @param endVersion 结束版本号（较新）
 * @returns 拼接后的更新日志字符串；若任一版本无法定位返回空字符串
 * @description
 * - CHANGELOG 的版本排序约定为从新到旧；
 * - 若传入版本不存在，将回退到不超过目标稳定版的最新版本；
 * - 当 `start > end` 时会自动调整为有效区间。
 */
export const range = (data: string, startVersion: string, endVersion: string): string => {
  const list = parseChangelog(data)
  const keys = Object.keys(list)

  const startKey = findFallbackVersionKey(keys, startVersion)
  const endKey = findFallbackVersionKey(keys, endVersion)
  if (!startKey || !endKey) return ''

  const start = keys.indexOf(startKey)
  const end = keys.indexOf(endKey)

  if (start > end) {
    const versions = keys.slice(end, start).map((key) => (list[key] ? list[key] : ''))
    return versions.join('')
  }

  const versions = keys.slice(start, end).map((key) => (list[key] ? list[key] : ''))
  return versions.join('')
}

/**
 * 对更新日志进行解析并形成对象
 * @param data 更新日志内容
 * @returns 以版本号为键的更新日志对象
 */
export const parseChangelog = (data: string) => {
  const regex = /## \[(.*?)\]([\s\S]*?)(?=## \[|$)/g
  const changelog: Record<string, string> = {}

  for (const match of data.matchAll(regex)) {
    const version = match[1]
    const content = match[0]
    changelog[version] = content
  }

  return changelog
}

/**
 * 将版本字符串规范化为稳定版 `x.y.z` 形式。
 * @param ver 任意版本字符串，例如 `2.6.7-beta.691.8851`
 * @returns 稳定版 `x.y.z`；若不匹配语义版本格式则返回原值
 * @example
 * normalizeStableVersion('2.6.7-beta.691.8851') // '2.6.7'
 */
const normalizeStableVersion = (ver: string): string => {
  const m = ver.match(/(\d+)\.(\d+)\.(\d+)/)
  return m ? `${m[1]}.${m[2]}.${m[3]}` : ver
}

/**
 * 解析语义化版本的主/次/修订号。
 * @param ver 版本字符串，会先进行稳定版规范化
 * @returns `[major, minor, patch]`；无法解析返回 `null`
 */
const parseSemverParts = (ver: string): [number, number, number] | null => {
  const v = normalizeStableVersion(ver)
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)$/)
  return m ? [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)] : null
}

/**
 * 比较两个语义化版本（仅比较主/次/修订，不含预发布）。
 * @param a 版本 A
 * @param b 版本 B
 * @returns 小于 0 表示 `a < b`；等于 0 表示相等；大于 0 表示 `a > b`
 */
const compareSemver = (a: string, b: string): number => {
  const pa = parseSemverParts(a)
  const pb = parseSemverParts(b)
  if (!pa && !pb) return 0
  if (!pa) return -1
  if (!pb) return 1
  if (pa[0] !== pb[0]) return pa[0] - pb[0]
  if (pa[1] !== pb[1]) return pa[1] - pb[1]
  if (pa[2] !== pb[2]) return pa[2] - pb[2]
  return 0
}

/**
 * 在 `CHANGELOG` 的版本键数组中查找最佳匹配。
 * @param keys `parseChangelog` 返回的版本键数组（按新→旧排序）
 * @param input 输入版本（可含预发布/构建元数据）
 * @returns 命中的键；若完全无法定位则返回 `null`
 * @description
 * - 优先精确匹配原始输入；
 * - 其次精确匹配稳定版 `x.y.z`；
 * - 否则按排序选择不超过目标稳定版的最新版本（即“向下回退”）。
 */
const findFallbackVersionKey = (keys: string[], input: string): string | null => {
  if (keys.includes(input)) return input
  const target = normalizeStableVersion(input)
  if (keys.includes(target)) return target
  for (const key of keys) {
    const kval = normalizeStableVersion(key)
    if (compareSemver(kval, target) <= 0) {
      return key
    }
  }
  return null
}
