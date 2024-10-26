import { isDir } from './exists'
import { sep } from './file'
import fs from 'node:fs'
import path from 'node:path'

/**
 * 根据文件后缀名从指定路径下读取符合要求的文件
 * @param path - 路径
 * @param ext - 后缀名、或后缀名列表
 * @example common.filesByExt('./plugins', '.js')
 * @example common.filesByExt('./plugins', ['.js', '.ts'])
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
