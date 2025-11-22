import crypto from 'node:crypto'

/**
 * 哈希算法类型
 */
export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512'

/**
 * 哈希选项
 */
export interface HashOptions {
  /** 哈希算法 @default 'md5' */
  algorithm?: HashAlgorithm
  /** 输出格式 @default 'hex' */
  encoding?: 'hex' | 'base64'
}

/**
 * 计算字符串或 Buffer 的哈希值
 *
 * @param data - 要计算哈希的数据
 * @param options - 哈希选项
 * @returns 哈希值
 *
 * @example
 * ```typescript
 * // MD5 哈希
 * const hash = createHash('hello world')
 * console.log(hash) // 5eb63bbbe01eeed093cb22bb8f5acdc3
 *
 * // SHA256 哈希
 * const hash = createHash('hello world', { algorithm: 'sha256' })
 *
 * // Base64 编码
 * const hash = createHash('hello world', { encoding: 'base64' })
 * ```
 *
 * @public
 */
export const createHash = (
  data: string | Buffer,
  options: HashOptions = {}
): string => {
  const { algorithm = 'md5', encoding = 'hex' } = options

  return crypto
    .createHash(algorithm)
    .update(data)
    .digest(encoding)
}

/**
 * 计算 MD5 哈希值
 *
 * @param data - 要计算哈希的数据
 * @param encoding - 输出编码 @default 'hex'
 * @returns MD5 哈希值
 *
 * @example
 * ```typescript
 * const hash = md5('hello world')
 * console.log(hash) // 5eb63bbbe01eeed093cb22bb8f5acdc3
 * ```
 *
 * @public
 */
export const md5 = (data: string | Buffer, encoding: 'hex' | 'base64' = 'hex'): string => {
  return createHash(data, { algorithm: 'md5', encoding })
}

/**
 * 计算 SHA256 哈希值
 *
 * @param data - 要计算哈希的数据
 * @param encoding - 输出编码 @default 'hex'
 * @returns SHA256 哈希值
 *
 * @example
 * ```typescript
 * const hash = sha256('hello world')
 * ```
 *
 * @public
 */
export const sha256 = (data: string | Buffer, encoding: 'hex' | 'base64' = 'hex'): string => {
  return createHash(data, { algorithm: 'sha256', encoding })
}
