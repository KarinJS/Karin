import { fileURLToPath } from 'node:url'
import { isDir } from './exists'
import { sep } from './file'
import fs from 'node:fs'
import lodash from 'lodash'
import path from 'node:path'

/**
 * 根据文件后缀名从指定路径下读取符合要求的文件
 * @param path - 路径
 * @param ext - 后缀名、或后缀名列表
 * @example
 * ```ts
 * filesByExt('./plugins/karin-plugin-test', '.js')
 * // -> ['1.js', '2.js']
 * filesByExt('./plugins', ['.js', '.ts'])
 * // -> ['1.js', '2.js', '3.ts']
 * ```
 */
export const filesByExt = (filePath: string, ext: string | string[]): string[] => {
  if (!isDir(filePath)) return []
  const files = fs.readdirSync(filePath, { withFileTypes: true })
  const list: string[] = []
  if (!Array.isArray(ext)) ext = [ext]
  files.forEach(v => {
    if (v.isDirectory()) return
    if (ext.includes(path.extname(v.name))) list.push(v.name)
  })
  return list
}

/**
 * 分割路径为文件夹路径和文件名
 * @param filePath - 路径
 * @returns - 文件夹路径和文件名
 * @example
 * ```ts
 * splitPath('C:/Users/admin/1.txt')
 * // -> { dirname: 'C:/Users/admin', basename: '1.txt' }
 * ```
 */
export const splitPath = (filePath: string) => {
  const dirname = path.dirname(filePath).replace(sep, '')
  const basename = path.basename(filePath)
  return { dirname, basename }
}

/**
 * 去掉相对路径的前缀和后缀
 * @param filePath - 相对路径路径
 * @example
 * ```ts
 * getRelPath('./plugins/karin-plugin-example/index.ts')
 * // -> 'plugins/karin-plugin-example/index.ts'
 * ```
 */
export const getRelPath = (filePath: string) => filePath.replace(/\\+/g, '/').replace(/\.+\/+|\/+$/g, '')

/**
 * 根据传入的 import.meta.url 计算相对于项目根目录的路径，返回需要的 '../' 层级。
 * @param url - import.meta.url
 * @returns 相对路径的层级数量，用 '../' 表示
 * @example
 * ```ts
 * // 在 plugins/karin-plugin-example/index.ts 中使用
 * urlToPath(import.meta.url)
 * // -> '../../'
 * ```
 */
export const urlToPath = (url: string) => {
  const filePath = fileURLToPath(url)
  /** 当前文件到项目根目录的相对路径 */
  const relativePath = path.relative(path.dirname(filePath), process.cwd())
  /** 相对路径的层级数量 */
  const upLevelsCount = relativePath.split(path.sep).length
  return lodash.repeat('../', upLevelsCount)
}
