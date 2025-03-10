import fs from 'node:fs'
import axios from 'axios'
import { sep } from './file'
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
    logger.error(error)
    return null
  }
}

/**
 * 生成随机字符串 包含字母和数字
 * @param length 长度
 * @returns 返回随机字符串
 */
export const randomStr = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
