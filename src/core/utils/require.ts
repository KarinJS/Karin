import fs from 'fs'
import path from 'path'
import yaml from 'yaml'

export interface CacheEntry<T = any> {
  /** 缓存数据 */
  data: T
  /** 过期时间的时间戳（毫秒） */
  expiry: number | 0
}

export type Parser = (content: string) => any

export type RequireOptions = {
  /** 是否强制读取，不使用缓存 */
  force?: boolean
  /** 过期时间，单位秒，默认300秒，0则永不过期 */
  ex?: number
  /** 文件大小限制，单位字节，默认0无限制 */
  size?: number
  /** 自定义解析器 */
  parser?: Parser
}

export type RequireFunction = <T = any>(
  filePath: string,
  options?: RequireOptions
) => Promise<T>

const cache = new Map<string, CacheEntry>()

/**
 * @description 缓存导入的文件
 * @param filePath 文件路径
 * @param options 选项
 * @returns 返回文件的内容
 */
export const requireFile: RequireFunction = async (filePath, options = {}) => {
  const absPath = path.resolve(filePath)
  const now = Date.now()

  const { force = false, ex = 300, size = 0, parser } = options

  if (!force) {
    const cached = cache.get(absPath)
    if (cached) {
      /**  命中缓存 更新过期时间 */
      if (cached.expiry === 0 || cached.expiry > now) {
        if (ex <= 0) return cached.data
        cached.expiry = now + ex * 1000
        cache.set(absPath, cached)
        return cached.data
      } else {
        cache.delete(absPath)
      }
    }
  }

  const content = await fs.promises.readFile(absPath, 'utf8')

  /** 判断文件大小 字节 */
  if (size > 0 && Buffer.byteLength(content, 'utf8') > size) {
    /** 文件过大 不进行缓存 */
    return parseContent(absPath, content, parser)
  }

  const data = parseContent(absPath, content, parser)

  /** 过期时间 */
  const expiry = ex === 0 ? 0 : now + ex * 1000

  /** 缓存数据 */
  cache.set(absPath, { data, expiry })

  return data
}

/**
 * 根据文件后缀解析内容或使用自定义解析器
 * @param absPath 绝对路径
 * @param content 文件内容
 * @param parser 自定义解析器
 * @returns 解析后的数据
 */
const parseContent = (absPath: string, content: string, parser?: Parser): any => {
  if (parser) return parser(content)

  if (absPath.endsWith('.json')) {
    return JSON.parse(content)
  } else if (absPath.endsWith('.yaml') || absPath.endsWith('.yml')) {
    return yaml.parse(content)
  } else {
    return content
  }
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

/**
 * @description 清除所有缓存
 */
export const clearRequire = () => cache.clear()
