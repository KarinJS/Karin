import fs from 'node:fs'
import axios from 'axios'
import { sep } from '../file'
import crypto from 'node:crypto'
import { Readable } from 'node:stream'

/**
 * 将数据转换为不带前缀的base64字符串
 * @param data - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
 * @param options - 选项 http为true时返回http地址
 * @returns 返回base64字符串
 * @example
 * ```ts
 * await base64('https://example.com/image.png')
 * await base64('C:/Users/admin/1.txt')
 * await base64('base64://aGVsbG8=')
 * await base64(fs.createReadStream('C:/Users/admin/1.txt'))
 * // -> 'aGVsbG8='
 * ```
 */
export const base64 = async (data: unknown, options = { http: false }): Promise<string> => {
  if (typeof data !== 'string') {
    if (Buffer.isBuffer(data)) return data.toString('base64')
    if (data instanceof Uint8Array) return Buffer.from(data).toString('base64')
    if (data instanceof Readable) return (await stream(data)).toString('base64')
    /** tips: 正常来说应该是走不到这个位置。 */
    return data as string
  }

  if (data.startsWith('base64://')) return data.replace('base64://', '')
  if (data.startsWith('http')) {
    if (options.http) return data
    const response = await axios.get(data, { responseType: 'stream' })
    const buffer = await stream(response.data)
    return buffer.toString('base64')
  }

  const files = data.replace(sep, '')
  if (fs.existsSync(files)) return (await fs.promises.readFile(files)).toString('base64')
  return Buffer.from(data, 'base64').toString('base64')
}

/**
 * 将数据转换为Buffer对象
 * @param data - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
 * @param options - 选项 http为true时返回http地址
 * @returns 返回Buffer对象
 * @example
 * ```ts
 * await buffer('https://example.com/image.png')
 * await buffer('C:/Users/admin/1.txt')
 * await buffer('base64://aGVsbG8=')
 * await buffer(fs.createReadStream('C:/Users/admin/1.txt'))
 * // -> <Buffer ...>
 * ```
 */
export const buffer = async <T extends { http: boolean }> (data: unknown, options?: T): Promise<T extends { http: true } ? string : Buffer> => {
  type ResultType = T extends { http: true } ? string : Buffer

  if (typeof data !== 'string') {
    if (Buffer.isBuffer(data)) return data as ResultType
    if (data instanceof Uint8Array) return Buffer.from(data) as unknown as ResultType
    if (data instanceof Readable) return await stream(data) as ResultType
    return data as ResultType
  }

  if (data.startsWith('base64://')) {
    return Buffer.from(data.replace('base64://', ''), 'base64') as ResultType
  }

  if (data.startsWith('http')) {
    if (options?.http) return data as ResultType
    const response = await axios.get(data, { responseType: 'arraybuffer' })
    return Buffer.from(response.data, 'binary') as ResultType
  }

  const files = data.replace(sep, '')
  if (fs.existsSync(files)) return fs.readFileSync(files) as ResultType
  return Buffer.from(data) as ResultType
}

/**
 * 将数据流对象转换为Buffer对象
 * @param stream - 要转换的数据流对象
 * @returns 返回Buffer对象
 * @example
 * ```ts
 * await stream(fs.createReadStream('C:/Users/admin/1.txt'))
 * // -> <Buffer ...>
 */
export const stream = (stream: Readable) => new Promise<Buffer>((resolve, reject) => {
  const chunks: Buffer[] = []
  stream.on('data', chunk => chunks.push(chunk))
  stream.on('end', () => resolve(Buffer.concat(chunks)))
  stream.on('error', error => reject(error))
})

/**
 * 传入文件路径 转为buffer
 * @param path - 文件路径
 * @returns 返回Buffer对象 如果发生错误则返回null
 */
export const readFile = async (path: string): Promise<Buffer | null> => {
  try {
    const data = await fs.promises.readFile(path)
    return data
  } catch (error) {
    // @ts-ignore
    global?.logger.error(error)
    return null
  }
}

/**
 * 生成随机字符串 包含字母和数字
 * @param length 长度
 * @returns 返回随机字符串
 */
export const randomStr = (length = 8) => {
  return secureRandomStr({ length })
}

/**
 * 生成随机秘钥参数
 * @param options - 选项
 * @returns 返回随机字符串
 */
export interface SecureRandomStrOptions {
  /** 长度 */
  length?: number
  /**
   * 只包含字母
   * @default false
   */
  onlyLetters?: boolean
  /**
   * 只包含大写字母
   * @default false
   */
  onlyUppercase?: boolean
  /**
   * 只包含小写字母
   * @default false
   */
  onlyLowercase?: boolean
  /**
   * 包含数字
   * @default true
   */
  includeNumbers?: boolean
  /**
   * 包含符号
   * @default true
   */
  includeSymbols?: boolean
  /**
   * 排除相似字符
   * @default false

   */
  excludeSimilar?: boolean
  /**
   * 盐
   * @default ''
   */
  salt?: string
  /**
   * 哈希
   * @default false
   */
  hash?: 'sha256' | 'sha512' | 'md5' | false
  /**
   * 哈希格式
   * @default 'hex'
   */
  hashFormat?: 'hex' | 'base64' | 'base64url'
  /**
   * 返回原始和哈希
   * @default false
   */
  returnRawAndHash?: boolean
  /**
   * 从时间生成熵
   * @default false
   */
  entropyFromTime?: boolean
}

type SecureRandomStrReturn<T extends SecureRandomStrOptions> =
  T['hash'] extends string ? T['returnRawAndHash'] extends true ? { raw: string; hash: string } : string : string

/**
 * 生成随机秘钥
 * @param options - 选项
 * @returns 返回随机秘钥
 * @example
 * ```ts
 * const key = secureRandomStr()
 * console.log(key) // -> '1234567890...' 16位
 *
 * const { raw, hash } = secureRandomStr({
 *  hash: 'sha256',
 *  returnRawAndHash: true,
 * })
 * console.log(raw) // -> '1234567890...'
 * console.log(hash) // -> '1234567890...'
 * ```
 */
export const secureRandomStr = <T extends SecureRandomStrOptions> (options?: T): SecureRandomStrReturn<T> => {
  const {
    length = 16,
    onlyLetters = false,
    onlyUppercase = false,
    onlyLowercase = false,
    includeNumbers = true,
    includeSymbols = false,
    excludeSimilar = false,
    salt = '',
    hash = false,
    hashFormat = 'hex',
    returnRawAndHash = false,
    entropyFromTime = false,
  } = options || ({} as SecureRandomStrOptions)

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
      .filter((c) => !confusing.has(c))
      .join('')
  }

  if (!charset.length) {
    throw new Error('字符集为空，请启用至少一个字符源')
  }

  const charsetLen = charset.length
  const maxValidByte = 256 - (256 % charsetLen)

  let result = ''
  while (result.length < length) {
    const byte = crypto.randomBytes(1)[0]
    if (byte < maxValidByte) {
      result += charset[byte % charsetLen]
    }
  }

  const entropy = entropyFromTime ? Date.now().toString(36) : ''

  if (hash) {
    const raw = result + salt + entropy
    const hasher = crypto.createHash(hash).update(raw)
    const digest =
      hashFormat === 'base64url'
        ? hasher.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        : hasher.digest(hashFormat)

    if (returnRawAndHash) {
      return { raw: result, hash: digest } as SecureRandomStrReturn<T>
    }

    return digest as SecureRandomStrReturn<T>
  }

  return result as SecureRandomStrReturn<T>
}
