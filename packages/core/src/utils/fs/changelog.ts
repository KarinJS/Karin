import { CompareMode } from '../system/update'

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
 */
export function logs (options: LogsOptions): string
/**
 * 从指定版本开始提取连续的更新日志
 * @param version 起始版本号
 * @param data `CHANGELOG.md` 文件内容
 * @param length 提取条数，默认为 1
 * @param reverse 是否反向提取；`false` 向后，`true` 向前
 * @param opts 版本号对比模式
 * @returns 拼接后的更新日志字符串；找不到起始版本返回空字符串
 * @description
 * - 起始版本会规范化并回退到不超过目标稳定版的最新版本；
 * - 切片范围将做边界裁剪以避免越界。
 * @deprecated 此调用方式将在未来版本废弃，请改用对象参数重载 logs({ ... }) 进行调用
 */
export function logs (version: string, data: string, length?: number, reverse?: boolean, opts?: CompareMode): string
export function logs (
  arg1: string | LogsOptions,
  arg2?: string,
  lengthParam = 1,
  reverseParam = false,
  optsParam?: CompareMode
): string {
  if (typeof lengthParam !== 'number') {
    throw new TypeError('提取长度必须为数字')
  }

  const isObj = typeof arg1 === 'object'
  const version = isObj ? arg1.version : (arg1 as string)
  const data = isObj ? arg1.data : (arg2 as string)
  const length = isObj ? (arg1.length ?? 1) : (lengthParam ?? 1)
  const reverse = isObj ? (arg1.reverse ?? false) : (reverseParam ?? false)
  const compareMode: CompareMode['compare'] = isObj ? (arg1.compare ?? 'xyz') : (optsParam?.compare ?? 'xyz')

  const list = parseChangelog(data)
  const keys = Object.keys(list)

  const startKey = findFallbackVersionKey(keys, version, { compare: compareMode })
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
 */
export function range (options: RangeOptions): string

/**
 * 提取指定版本区间的更新日志
 * @param data `CHANGELOG.md` 文件内容
 * @param startVersion 起始版本号（较旧）
 * @param endVersion 结束版本号（较新）
 * @param opts 版本号对比模式
 * @returns 拼接后的更新日志字符串；若任一版本无法定位返回空字符串
 * @description
 * - CHANGELOG 的版本排序约定为从新到旧；
 * - 若传入版本不存在，将回退到不超过目标稳定版的最新版本；
 * - 当 `start > end` 时会自动调整为有效区间。
 * @deprecated 此调用方式将在未来版本废弃，请改用对象参数重载 range({ ... }) 进行调用
 */
export function range (data: string, startVersion: string, endVersion: string, opts?: CompareMode): string
export function range (
  arg1: string | RangeOptions,
  startVersionArg?: string,
  endVersionArg?: string,
  optsParam?: CompareMode
): string {
  const isObj = typeof arg1 === 'object'
  const data = isObj ? arg1.data : (arg1 as string)
  const startVersion = isObj ? arg1.startVersion : (startVersionArg as string)
  const endVersion = isObj ? arg1.endVersion : (endVersionArg as string)
  const compareMode: CompareMode['compare'] = isObj ? (arg1.compare ?? 'xyz') : (optsParam?.compare ?? 'xyz')

  const list = parseChangelog(data)
  const keys = Object.keys(list)

  const startKey = findFallbackVersionKey(keys, startVersion, { compare: compareMode })
  const endKey = findFallbackVersionKey(keys, endVersion, { compare: compareMode })
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
const findFallbackVersionKey = (keys: string[], input: string, opts?: CompareMode): string | null => {
  const mode = opts?.compare ?? 'xyz'

  // 精确匹配原始输入
  if (keys.includes(input)) return input

  if (mode === 'xyz') {
    // xyz：优先匹配稳定版，再按“最新但不超过目标稳定版”回退
    const target = normalizeStableVersion(input)
    if (keys.includes(target)) return target
    for (const key of keys) {
      const kval = normalizeStableVersion(key)
      if (compareByMode(kval, target, 'xyz') <= 0) {
        return key
      }
    }
    return null
  }

  // semver：严格比较，预发布 < 稳定版；选择“最新但不超过目标”的版本
  const parsedInput = parseSemverFull(input)
  if (!parsedInput) {
    // 无法解析时退化为 xyz 策略
    const target = normalizeStableVersion(input)
    if (keys.includes(target)) return target
    for (const key of keys) {
      const kval = normalizeStableVersion(key)
      if (compareByMode(kval, target, 'xyz') <= 0) {
        return key
      }
    }
    return null
  }

  for (const key of keys) {
    // 尝试严格解析 key；解析失败时以稳定版降级比较
    const parsedKey = parseSemverFull(key)
    const cmp = parsedKey
      ? compareSemverFull(key, input)
      : compareByMode(key, input, 'xyz')

    if (cmp <= 0) return key
  }
  return null
}

/** 语义化版本解析（忽略构建元数据），返回核心字段与预发布标识 */
type ParsedSemver = {
  major: number
  minor: number
  patch: number
  prerelease: Array<string | number> | null
}

/** 严格语义化版本解析 */
const parseSemverFull = (input: string): ParsedSemver | null => {
  const core = input.split('+')[0]
  const m = core.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-.]+))?$/)
  if (!m) return null
  const prerelease = m[4]
    ? m[4].split('.').map((id) => (/^\d+$/.test(id) ? Number(id) : id))
    : null
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease,
  }
}

/** 严格语义化版本比较（SemVer 2.0.0） */
const compareSemverFull = (a: string, b: string): number => {
  const pa = parseSemverFull(a)
  const pb = parseSemverFull(b)
  if (!pa || !pb) return 0
  if (pa.major !== pb.major) return pa.major > pb.major ? 1 : -1
  if (pa.minor !== pb.minor) return pa.minor > pb.minor ? 1 : -1
  if (pa.patch !== pb.patch) return pa.patch > pb.patch ? 1 : -1

  const ra = pa.prerelease
  const rb = pb.prerelease
  if (!ra && !rb) return 0
  if (!ra && rb) return 1
  if (ra && !rb) return -1

  const len = Math.max(ra!.length, rb!.length)
  for (let i = 0; i < len; i++) {
    const ai = ra![i]
    const bi = rb![i]
    if (ai === undefined) return -1
    if (bi === undefined) return 1

    const aNum = typeof ai === 'number'
    const bNum = typeof bi === 'number'
    if (aNum && bNum) {
      if (ai !== bi) return (ai as number) > (bi as number) ? 1 : -1
    } else if (aNum !== bNum) {
      return aNum ? -1 : 1
    } else {
      if (ai !== bi) return String(ai) > String(bi) ? 1 : -1
    }
  }
  return 0
}

/** 根据对比模式选择比较器：xyz 使用稳定版比较，semver 使用严格语义化比较 */
const compareByMode = (a: string, b: string, mode: 'xyz' | 'semver'): number => {
  if (mode === 'xyz') {
    const an = normalizeStableVersion(a)
    const bn = normalizeStableVersion(b)
    return compareSemver(an, bn)
  }
  return compareSemverFull(a, b)
}

/** logs 方法的配置 */
type LogsOptions = {
  /** 起始版本号 */
  version: string
  /** CHANGELOG.md 内容 */
  data: string
  /**
   * 提取条数
   * @default 1
   */
  length?: number
  /**
   * 是否反向提取
   * @default false
   */
  reverse?: boolean
  /**
   * 版本号对比模式，怎么对比才算是有更新
   *
   * **xyz 模式（默认）**
   * - 只看前三段数字 `X.Y.Z`，忽略预发布/构建后缀。
   * - 示例：
   *   - 本地 `2.6.7`，远程 `2.6.8` → 有更新
   *   - 本地 `2.6.7-beta.1`，远程 `2.6.7` → 无更新（都视为 `2.6.7`）
   *   - 本地 `1.0.0+20230101`，远程 `1.0.1` → 有更新（只看 `1.0.0` vs `1.0.1`）
   *   - 本地 `3.2.0-rc.3`，远程 `3.2.0` → 无更新（都视为 `3.2.0`）
   *
   * **semver 模式（语义化版本）**
   * - 严格遵循 [SemVer](https://semver.org/) 规则。
   * - 示例：
   *   - 本地 `2.6.7-beta.1`，远程 `2.6.6` → 本地更高，已最新，不提示升级
   *   - 本地 `1.0.0-alpha`，远程 `1.0.0` → 远程更高，提示升级
   *   - 本地 `1.0.0+20230101`，远程 `1.0.0` → 仅比较版本核心，不比较构建元数据，视为相同
   *   - 本地 `2.0.0-beta.2`，远程 `2.0.0-beta.10` → 远程更高，提示升级（按预发布号逐段比较）
   *   - 本地 `3.1.0-rc.1`，远程 `3.1.0` → 远程更高，提示升级（稳定版 > 预发布）
   *
   * @default 'xyz'
   */
  compare?: CompareMode['compare']
}

/** range 方法的配置 */
type RangeOptions = {
  /** CHANGELOG.md 内容 */
  data: string
  /** 起始版本号（较旧） */
  startVersion: string
  /** 结束版本号（较新） */
  endVersion: string
  /**
   * 版本号对比模式，怎么对比才算是有更新
   *
   * **xyz 模式（默认）**
   * - 只看前三段数字 `X.Y.Z`，忽略预发布/构建后缀。
   * - 示例：
   *   - 本地 `2.6.7`，远程 `2.6.8` → 有更新
   *   - 本地 `2.6.7-beta.1`，远程 `2.6.7` → 无更新（都视为 `2.6.7`）
   *   - 本地 `1.0.0+20230101`，远程 `1.0.1` → 有更新（只看 `1.0.0` vs `1.0.1`）
   *   - 本地 `3.2.0-rc.3`，远程 `3.2.0` → 无更新（都视为 `3.2.0`）
   *
   * **semver 模式（语义化版本）**
   * - 严格遵循 [SemVer](https://semver.org/) 规则。
   * - 示例：
   *   - 本地 `2.6.7-beta.1`，远程 `2.6.6` → 本地更高，已最新，不提示升级
   *   - 本地 `1.0.0-alpha`，远程 `1.0.0` → 远程更高，提示升级
   *   - 本地 `1.0.0+20230101`，远程 `1.0.0` → 仅比较版本核心，不比较构建元数据，视为相同
   *   - 本地 `2.0.0-beta.2`，远程 `2.0.0-beta.10` → 远程更高，提示升级（按预发布号逐段比较）
   *   - 本地 `3.1.0-rc.1`，远程 `3.1.0` → 远程更高，提示升级（稳定版 > 预发布）
   *
   * @default 'xyz'
   */
  compare?: CompareMode['compare']
}
