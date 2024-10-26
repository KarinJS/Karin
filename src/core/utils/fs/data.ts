import { Readable } from 'stream'
import { sep } from './file'
import { stream } from './stream'
import axios from 'axios'
import fs from 'node:fs'

/**
 * 将数据转换为不带前缀的base64字符串
 * @param data - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
 * @param options - 选项 http为true时返回http地址
 * @returns 返回base64字符串
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
 */
export const buffer = async <T extends { http: boolean }> (data: unknown, options?: T): Promise<T extends { http: true } ? string : Buffer> => {
  type ResultType = T extends { http: true } ? string : Buffer

  if (typeof data !== 'string') {
    if (Buffer.isBuffer(data)) return data as ResultType
    if (data instanceof Uint8Array) return Buffer.from(data) as ResultType
    if (data instanceof Readable) return await stream(data) as ResultType
    return data as ResultType
  }

  if (data.startsWith('base64://')) {
    return Buffer.from(data.replace('base64://', ''), 'base64') as ResultType
  }

  if (data.startsWith('http')) {
    if (options?.http) return data as ResultType
    const response = await axios.get(data, { responseType: 'arraybuffer' })
    return Buffer.from(response.data) as ResultType
  }

  const files = data.replace(sep, '')
  if (fs.existsSync(files)) return fs.readFileSync(files) as ResultType
  return Buffer.from(data) as ResultType
}
