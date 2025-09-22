import fs from 'node:fs'
import path from 'node:path'
import { requireFile, requireFileSync } from '@karinjs/utils'

/**
 * 获取目录下的所有文件夹名称
 * @param dir 目录路径
 * @returns 返回目录下的所有文件夹名称
 */
export const getFoldersSync = (dir: string): string[] => {
  const files = fs.readdirSync(dir)
  return files.filter(file => fs.statSync(path.join(dir, file)).isDirectory())
}

/**
 * 获取目录下的所有文件夹名称
 * @param dir 目录路径
 * @returns 返回目录下的所有文件夹名称
 */
export const getFolders = async (dir: string): Promise<string[]> => {
  const files = await fs.promises.readdir(dir)
  const list: string[] = []
  await Promise.all(files.map(async (file: string) => {
    const filePath = path.join(dir, file)
    const stats = await fs.promises.stat(filePath)
    if (stats.isDirectory()) list.push(file)
  }))
  return list
}

/**
 * 判断package.json是否存在karin字段
 * @param filePath package.json文件路径
 * @returns 返回是否存在karin字段
 */
export const hasKarinField = async (filePath: string): Promise<boolean> => {
  try {
    const packageJson = await requireFile(filePath, { ex: 0 })
    return typeof packageJson.karin === 'object'
  } catch {
    return false
  }
}

/**
 * 同步判断package.json是否存在karin字段
 * @param filePath package.json文件路径
 * @returns 返回是否存在karin字段
 */
export const hasKarinFieldSync = (filePath: string): boolean => {
  try {
    const packageJson = requireFileSync(filePath, { ex: 0 })
    return typeof packageJson.karin === 'object'
  } catch {
    return false
  }
}
