import path from 'node:path'
import { fileURLToPath } from 'node:url'
import lodash from 'lodash'

/**
 * 路径分隔符正则表达式
 */
const sep = path.sep === '/' ? /^file:\/\// : /^file:[/]{2,3}/

/**
 * 路径分割结果
 */
export interface SplitResult {
  /** 目录路径 */
  dirname: string
  /** 文件名（包含扩展名） */
  basename: string
}

/**
 * 分割路径为目录和文件名
 *
 * @param filePath - 文件路径
 * @returns 包含 dirname 和 basename 的对象
 *
 * @example
 * ```typescript
 * split('C:/Users/admin/file.txt')
 * // => { dirname: 'C:/Users/admin', basename: 'file.txt' }
 *
 * split('/home/user/project/index.ts')
 * // => { dirname: '/home/user/project', basename: 'index.ts' }
 * ```
 *
 * @public
 */
export const split = (filePath: string): SplitResult => {
  const dirname = path.dirname(filePath).replace(sep, '')
  const basename = path.basename(filePath)
  return { dirname, basename }
}

/**
 * 从路径中提取 npm 包名
 *
 * 支持普通包和组织包（@scope/package）
 *
 * @param filePath - 文件路径
 * @returns 包名，如果不在 node_modules 下则返回 null
 *
 * @example
 * ```typescript
 * // 普通包
 * getPackageName('/project/node_modules/lodash/index.js')
 * // => 'lodash'
 *
 * // 组织包
 * getPackageName('/project/node_modules/@karinjs/utils/index.js')
 * // => '@karinjs/utils'
 *
 * // 不在 node_modules 下
 * getPackageName('/project/src/index.js')
 * // => null
 * ```
 *
 * @public
 */
export const getPackageName = (filePath: string): string | null => {
  // 格式化为绝对路径
  const absPath = path.resolve(filePath).replaceAll('\\', '/')

  const idx = absPath.lastIndexOf('node_modules/')
  if (idx === -1) return null

  const suffix = absPath.slice(idx + 13)
  const parts = suffix.split('/').filter(Boolean)

  if (parts.length === 0) return null

  // 组织包 (@scope/package)
  if (parts[0].startsWith('@')) {
    return parts.length > 1 ? `${parts[0]}/${parts[1]}` : null
  }

  // 普通包
  return parts[0]
}

/**
 * 将 import.meta.url 转换为相对项目根目录的层级
 *
 * 返回需要向上的 `../` 层级数量
 *
 * @param url - import.meta.url
 * @returns 相对路径的层级字符串（如 '../../'）
 *
 * @example
 * ```typescript
 * // 在 plugins/karin-plugin-example/index.ts 中使用
 * urlToPath(import.meta.url)
 * // => '../../'
 *
 * // 在 src/utils/helper.ts 中使用
 * urlToPath(import.meta.url)
 * // => '../../'
 * ```
 *
 * @public
 */
export const urlToPath = (url: string): string => {
  const filePath = fileURLToPath(url)

  // 当前文件到项目根目录的相对路径
  const rel = path.relative(path.dirname(filePath), process.cwd())

  // 相对路径的层级数量
  const upLevelsCount = rel.split(path.sep).length

  return lodash.repeat('../', upLevelsCount)
}
