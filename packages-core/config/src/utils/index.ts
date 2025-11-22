import { existsSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { findCmdPath } from '@karinjs/utils'

type ValueType = string | number | boolean | object | undefined

/**
 * 类型检查并返回值或默认值
 * @param type 期望的类型
 * @param value 要检查的值
 * @param defaultValue 默认值
 * @returns 如果类型匹配返回值，否则返回默认值
 */
export const checkType = <T> (type: ValueType, value: any, defaultValue: T): T => {
  // eslint-disable-next-line valid-typeof
  return typeof value === type ? value : defaultValue
}

/**
 * 过滤数组字符串
 * @description 过滤掉非字符串或长度为0的元素
 * @param arr 待过滤的数组
 * @returns 过滤后的字符串数组
 */
export const filterStringArray = (arr: any): string[] => {
  if (!Array.isArray(arr)) return []
  return arr.filter(item => typeof item === 'string' && item.length > 0)
}

/**
 * 解析正则表达式字符串为 RegExp 对象
 * @description 从 /pattern/flags 格式的字符串中提取模式和标志
 * @param regexStr 正则表达式字符串 如 "/^小Q/" 或 "/(小Q|机器人)/i"
 * @returns RegExp 对象，解析失败返回 null
 * @example
 * ```ts
 * parseRegexString("/^小Q/")       // => /^小Q/
 * parseRegexString("/(小Q|机器人)/i") // => /(小Q|机器人)/i
 * parseRegexString("/test/gi")     // => /test/gi
 * ```
 */
const parseRegexString = (regexStr: string): RegExp | null => {
  const match = regexStr.match(/^\/(.*)\/([gimsuvy]*)$/)
  if (!match) return null
  try {
    const [, pattern, flags] = match
    return new RegExp(pattern, flags)
  } catch {
    return null
  }
}

/**
 * 安全创建正则表达式
 * @param pattern 正则表达式模式
 * @param flags 正则表达式标志
 * @returns RegExp 对象，失败返回 null
 */
const safeRegExp = (pattern: string, flags?: string): RegExp | null => {
  try {
    return new RegExp(pattern, flags)
  } catch {
    return null
  }
}

/**
 * 转换别名数组为正则表达式数组
 * @description
 * - 普通字符串: 转换为前缀匹配正则 如 "小Q" -> /^小Q/
 * - //包裹的字符串: 解析为正则 如 "/(小Q|机器人)/i" -> /(小Q|机器人)/i
 * @param arr 别名数组
 * @returns 转换后的正则表达式数组
 * @example
 * ```ts
 * convertAliasToRegex(["小Q", "机器人"])
 * // => [/^小Q/, /^机器人/]
 *
 * convertAliasToRegex(["/(小Q|机器人)/i"])
 * // => [/(小Q|机器人)/i]
 * ```
 */
export const convertAliasToRegex = (arr: any): RegExp[] => {
  return filterStringArray(arr).reduce<RegExp[]>((result, item) => {
    // 尝试解析为正则表达式格式
    const regex = parseRegexString(item) || safeRegExp(`^${item}`)
    if (regex) result.push(regex)
    return result
  }, [])
}

/**
 * 生成随机密码
 * 使用 crypto.randomBytes 生成密码学安全的随机字符串
 * 包含大小写字母、数字和 URL 安全字符 (-_)
 * @param length 密码长度，默认16
 * @returns 随机密码字符串
 */
export const generateRandomPassword = (length: number = 8): string => {
  const bytesNeeded = Math.ceil(length / 2)
  return randomBytes(bytesNeeded).toString('hex').slice(0, length)
}

/**
 * 密码校验工具
 * @description 要求长度至少8位 必须有2种及以上类型，如果已经是SHA256哈希则直接通过
 */
const validatePassword = (password: string): boolean => {
  /** sha256 */
  if (/^[a-f0-9]{64}$/i.test(password)) return true

  if (password.length < 8) return false

  let typesCount = 0
  if (/[a-z]/.test(password)) typesCount++ // 小写字母
  if (/[A-Z]/.test(password)) typesCount++ // 大写字母
  if (/[0-9]/.test(password)) typesCount++ // 数字
  if (/[^a-zA-Z0-9]/.test(password)) typesCount++ // 特殊字符

  return typesCount >= 2
}

/**
 * 获取密码
 * @description 如果密码不符合要求则会随机生成一个新的密码
 * @param password 待校验的密码
 * @param type 密码类型描述 用于日志输出
 */
export const getValidPassword = (password: unknown): {
  /** 是否通过安全校验 */
  valid: boolean,
  /** 实际密码 */
  value: string
} => {
  if (typeof password !== 'string' || !validatePassword(password)) {
    return {
      valid: false,
      value: generateRandomPassword(),
    }
  }

  return { valid: true, value: password }
}

/**
 * 用户名校验工具
 * @description 要求长度大于6位
 */
const validateUsername = (username: string): boolean => {
  return username.length > 6
}

/**
 * 获取用户名
 * @description 如果用户名不符合要求则会随机生成一个新的用户名
 * @param username 待校验的用户名
 * @param type 用户名类型描述 用于日志输出
 */
export const getValidUsername = (username: unknown): {
  /** 是否通过安全校验 */
  valid: boolean,
  /** 实际用户名 */
  value: string
} => {
  if (typeof username !== 'string' || !validateUsername(username)) {
    return {
      valid: false,
      value: generateRandomPassword(8),
    }
  }

  return {
    valid: true,
    value: username,
  }
}

/**
 * 获取 FFmpeg 相关工具路径
 * @param path 配置的路径
 * @param command 命令名称（ffmpeg/ffprobe/ffplay）
 * @returns 有效路径或从环境变量中查找到的路径
 */
export const getFfmpegPath = (path: unknown, command: 'ffmpeg' | 'ffprobe' | 'ffplay'): string => {
  if (typeof path === 'string' && path.length > 0 && existsSync(path)) {
    return path
  }

  const foundPath = findCmdPath(command)
  if (foundPath) {
    return foundPath
  }

  return ''
}
