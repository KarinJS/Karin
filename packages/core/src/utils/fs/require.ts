import yaml from 'yaml'
import fs from 'node:fs'
import path from 'node:path'

export interface CacheEntry<T = any> {
  /** 缓存数据 */
  data: T
  /** 过期时间的时间戳（毫秒） */
  expiry: number | 0
}

export type Parser = (content: string) => any

export type RequireOptions = {
  /** 指定配置文件类型 */
  type?: 'json' | 'yaml' | 'yml'
  /** 文件编码，默认utf-8 */
  encoding?: BufferEncoding
  /** 是否强制读取，不使用缓存 */
  force?: boolean
  /** 过期时间，单位秒，默认300秒，0则永不过期 */
  ex?: number
  /** 文件大小限制，单位字节，默认0无限制 */
  size?: number
  /** 自定义解析器 */
  parser?: Parser
  /** 是否只读缓存，为true时如果缓存不存在则返回undefined */
  readCache?: boolean
}

export type RequireFunction = <T = any>(
  filePath: string,
  options?: RequireOptions
) => Promise<T>

export type RequireFunctionSync = <T = any>(
  filePath: string,
  options?: RequireOptions
) => T

const cache = new Map<string, CacheEntry>()

/**
 * @description 清除指定缓存
 * @param filePath 文件路径
 * @returns 是否清除成功
 */
export const clearRequireFile = (filePath: string) => {
  const absPath = path.resolve(filePath).replace(/\\/g, '/')
  return cache.has(absPath) && cache.delete(absPath)
}

/**
 * @description 清除所有缓存
 */
export const clearRequire = () => cache.clear()

/**
 * 异步导入文件
 * @description 缓存导入的文件 默认缓存300秒
 * @param filePath 文件路径
 * @param options 选项
 * @returns 返回文件的内容
 */
export const requireFile: RequireFunction = async (filePath, options = {}) => {
  const now = Date.now()
  const absPath = path.resolve(filePath).replace(/\\/g, '/')
  const { encoding = 'utf-8', force = false, ex = 300, size = 0, parser, type, readCache } = options

  const data = fileReady(absPath, now, force, ex, readCache)
  if (data !== false) return data

  const content = await fs.promises.readFile(absPath, encoding)
  return fileCache(content, absPath, ex, now, size, encoding, parser, type)
}

/**
 * 同步导入文件
 * @description 缓存导入的文件 默认缓存300秒
 * @param filePath 文件路径
 * @param options 选项
 * @returns 返回文件的内容
 */
export const requireFileSync: RequireFunctionSync = (filePath, options = {}) => {
  const now = Date.now()
  const absPath = path.resolve(filePath).replace(/\\/g, '/')
  const { encoding = 'utf-8', force = false, ex = 300, size = 0, parser, type, readCache } = options

  const data = fileReady(absPath, now, force, ex, readCache)
  if (data !== false) return data

  const content = fs.readFileSync(absPath, encoding)
  return fileCache(content, absPath, ex, now, size, encoding, parser, type)
}

/**
 * @description 导入文件前准备
 * @param absPath 文件绝对路径
 * @param force 是否强制读取，不使用缓存
 * @param now 当前时间
 * @param ex 过期时间
 */
const fileReady = (absPath: string, now: number, force: boolean, ex: number, readCache?: boolean) => {
  if (!force) {
    const cached = cache.get(absPath)
    if (cached) {
      /**  命中缓存 更新过期时间 */
      if (cached.expiry === 0 || cached.expiry > now) {
        if (ex <= 0) return cached.data
        touchRequireFile(absPath, ex)
        return cached.data
      } else {
        cache.delete(absPath)
      }
    }
    /** 如果是只读缓存模式且没有命中缓存，返回undefined */
    if (readCache) return undefined
  }

  return false
}

/**
 * @description 导入文件后续处理
 * @param content 文件内容
 * @param absPath 文件绝对路径
 * @param ex 过期时间
 * @param now 当前时间
 * @param size 文件大小
 * @param encoding 文件编码
 * @param parser 自定义解析器
 * @param options 选项
 * @returns 文件内容
 */
const fileCache = (
  content: string,
  absPath: string,
  ex: number,
  now: number,
  size: number,
  encoding: BufferEncoding,
  parser?: Parser,
  type?: RequireOptions['type']
) => {
  /** 判断文件大小 字节 */
  if (size > 0 && Buffer.byteLength(content, encoding) > size) {
    /** 文件过大 不进行缓存 */
    return parseContent(absPath, content, parser, type)
  }

  /** 自动解析 */
  const data = parseContent(absPath, content, parser, type)
  /** 过期时间 */
  const expiry = ex === 0 ? 0 : now + ex * 1000
  /** 缓存数据 */
  cache.set(absPath, { data, expiry })
  return data
}

/**
 * @description 更新过期时间到最新
 * @param filePath 文件路径
 * @param ex 过期时间
 */
const touchRequireFile = async (filePath: string, ex: number) => {
  // 内部使用的filePath不需要转换为绝对路径 已经是绝对路径了
  const entry = cache.get(filePath)
  if (entry) {
    entry.expiry = Date.now() + ex * 1000
    cache.set(filePath, entry)
  }
}

/**
 * 根据文件后缀解析内容或使用自定义解析器
 * @param absPath 绝对路径
 * @param content 文件内容
 * @param parser 自定义解析器
 * @param options 选项
 * @returns 解析后的数据
 */
const parseContent = (
  absPath: string,
  content: string,
  parser?: Parser,
  type?: RequireOptions['type']
): any => {
  if (parser) return parser(content)

  if (type) {
    if (type === 'json') return JSON.parse(content)
    if (type === 'yaml' || type === 'yml') return yaml.parse(content)
  }

  if (absPath.endsWith('.json')) return JSON.parse(content)
  if (absPath.endsWith('.yaml') || absPath.endsWith('.yml')) return yaml.parse(content)

  return content
}

/** 每60秒检查一次过期时间 */
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of cache.entries()) {
    /** 永不过期 */
    if (entry.expiry === 0) continue
    /** 过期删除 */
    if (entry.expiry <= now) cache.delete(key)
  }
}, 60000)
