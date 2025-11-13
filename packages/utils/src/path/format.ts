import path from 'node:path'

/**
 * 路径分隔符正则表达式
 */
const sep = path.sep === '/' ? /^file:\/\// : /^file:[/]{2,3}/

/**
 * file:// 协议前缀
 */
const prefix = process.platform === 'win32' ? 'file:///' : 'file://'

/**
 * 格式化选项
 */
export interface FormatOptions {
  /**
   * 当前工作目录
   * @default process.cwd()
   */
  cwd?: string
  /**
   * 返回类型
   * - `abs`: 绝对路径（默认）
   * - `rel`: 相对路径
   * - `fileURL`: file URL
   * @default 'abs'
   */
  type?: 'abs' | 'rel' | 'fileURL'
}

/**
 * 格式化路径，统一分隔符为 `/`
 *
 * 默认返回绝对路径，支持 file URL
 *
 * @param filePath - 文件路径
 * @param options - 格式化选项
 * @returns 格式化后的路径
 *
 * @example
 * ```typescript
 * // 默认返回绝对路径
 * format('C:\\Users\\admin\\project\\..\\file.txt')
 * // => 'C:/Users/admin/file.txt'
 *
 * // 相对路径
 * format('./file.txt', { type: 'rel' })
 * // => 'file.txt'
 *
 * // file URL
 * format('/path/to/file', { type: 'fileURL' })
 * // => 'file:///path/to/file'
 *
 * // 指定工作目录
 * format('./file.txt', { type: 'rel', cwd: '/custom/dir' })
 * // => 'file.txt'
 * ```
 *
 * @public
 */
export const format = (filePath: string, options?: FormatOptions): string => {
  if (!options) {
    return path.resolve(filePath.replace(sep, '')).replaceAll('\\', '/')
  }

  const { type = 'abs', cwd = process.cwd() } = options

  if (type === 'abs') {
    return path.resolve(cwd, filePath.replace(sep, '')).replaceAll('\\', '/')
  }

  if (type === 'rel') {
    return path.relative(cwd, filePath.replace(sep, '')).replaceAll('\\', '/') || '.'
  }

  if (type === 'fileURL') {
    return `${prefix}${path.resolve(cwd, filePath.replace(sep, '')).replaceAll('\\', '/')}`
  }

  return path.resolve(cwd, filePath.replace(sep, '')).replaceAll('\\', '/')
}

/**
 * 解析路径为绝对路径
 *
 * @param filePath - 文件路径
 * @param addPrefix - 是否添加 file:// 前缀
 * @returns 绝对路径
 *
 * @example
 * ```typescript
 * // 解析相对路径
 * resolve('./src/index.ts')
 * // => '/home/user/project/src/index.ts'
 *
 * // 添加 file:// 前缀
 * resolve('./src/index.ts', true)
 * // => 'file:///home/user/project/src/index.ts'
 * ```
 *
 * @public
 */
export const resolve = (filePath: string, addPrefix = false): string => {
  const resolved = path.resolve(filePath.replace(sep, '')).replaceAll('\\', '/')
  return addPrefix ? `${prefix}${resolved}` : resolved
}

/**
 * 获取相对路径
 *
 * @param filePath - 文件路径
 * @returns 相对路径（去除 ./ 和 / 前后缀）
 *
 * @example
 * ```typescript
 * // 去除相对路径前缀
 * relative('./plugins/karin-plugin-example/index.ts')
 * // => 'plugins/karin-plugin-example/index.ts'
 *
 * // 去除尾部斜杠
 * relative('./src/')
 * // => 'src'
 * ```
 *
 * @public
 */
export const relative = (filePath: string): string => {
  return filePath.replace(/\\+/g, '/').replace(/\.+\/+|\/+$/g, '')
}

/**
 * 标准化路径
 *
 * @param filePath - 文件路径
 * @returns 标准化后的路径
 *
 * @example
 * ```typescript
 * normalize('C:\\Users\\..\\admin\\file.txt')
 * // => 'C:/admin/file.txt'
 * ```
 *
 * @public
 */
export const normalize = (filePath: string): string => {
  return path.normalize(filePath).replaceAll('\\', '/')
}
