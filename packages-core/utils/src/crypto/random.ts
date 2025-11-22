import crypto from 'node:crypto'

/**
 * 随机字符串选项
 */
export interface RandomStringOptions {
  /** 字符串长度 @default 16 */
  length?: number
  /** 仅字母 @default false */
  onlyLetters?: boolean
  /** 仅大写 @default false */
  onlyUppercase?: boolean
  /** 仅小写 @default false */
  onlyLowercase?: boolean
  /** 包含数字 @default true */
  includeNumbers?: boolean
  /** 包含符号 @default false */
  includeSymbols?: boolean
  /** 排除相似字符（O0Il1） @default false */
  excludeSimilar?: boolean
}

/**
 * 生成安全的随机字符串
 *
 * @param options - 随机字符串选项
 * @returns 随机字符串
 *
 * @example
 * ```typescript
 * // 默认 16 位字符串
 * const str = randomString()
 *
 * // 32 位字符串
 * const str = randomString({ length: 32 })
 *
 * // 仅字母
 * const str = randomString({ onlyLetters: true })
 *
 * // 包含符号
 * const str = randomString({ includeSymbols: true })
 *
 * // 排除相似字符
 * const str = randomString({ excludeSimilar: true })
 * ```
 *
 * @public
 */
export const randomString = (options: RandomStringOptions = {}): string => {
  const {
    length = 16,
    onlyLetters = false,
    onlyUppercase = false,
    onlyLowercase = false,
    includeNumbers = true,
    includeSymbols = false,
    excludeSimilar = false,
  } = options

  let charset = ''
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (onlyLetters) {
    if (onlyUppercase) charset += upper
    else if (onlyLowercase) charset += lower
    else charset += upper + lower
  } else {
    if (onlyUppercase) charset += upper
    else if (onlyLowercase) charset += lower
    else charset += upper + lower

    if (includeNumbers) charset += numbers
    if (includeSymbols) charset += symbols
  }

  if (excludeSimilar) {
    const confusing = new Set(['O', '0', 'I', 'l', '1'])
    charset = charset
      .split('')
      .filter(c => !confusing.has(c))
      .join('')
  }

  const bytes = crypto.randomBytes(length)
  let result = ''

  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length]
  }

  return result
}

/**
 * 生成随机十六进制字符串
 *
 * @param length - 字节长度 @default 16
 * @returns 十六进制字符串
 *
 * @example
 * ```typescript
 * const hex = randomHex()
 * console.log(hex) // '4a7b2c8d...' (32 个字符)
 *
 * const hex = randomHex(32)
 * console.log(hex) // 64 个字符
 * ```
 *
 * @public
 */
export const randomHex = (length = 16): string => {
  return crypto.randomBytes(length).toString('hex').slice(0, length)
}

/**
 * 生成 UUID v4
 *
 * @returns UUID 字符串
 *
 * @example
 * ```typescript
 * const uuid = randomUUID()
 * console.log(uuid) // 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
 * ```
 *
 * @public
 */
export const randomUUID = (): string => {
  return crypto.randomUUID()
}

/**
 * 生成 HTTP 鉴权密钥
 *
 * @param length - 密钥长度 @default 32
 * @returns 鉴权密钥
 *
 * @example
 * ```typescript
 * const key = generateSecret()
 * process.env.HTTP_AUTH_KEY = key
 * ```
 *
 * @public
 */
export const generateSecret = (length = 32): string => {
  return randomString({ length, includeSymbols: true })
}
