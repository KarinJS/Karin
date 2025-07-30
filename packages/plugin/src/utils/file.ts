import fs from 'node:fs'
import path from 'node:path'
import { requireFile, requireFileSync } from 'node-karin'

/**
 * 获取目录下的所有文件夹名称
 * @param dir 目录路径
 * @returns 返回目录下的所有文件夹名称
 */
export const getFoldersSync = (dir: string) => {
  const files = fs.readdirSync(dir)
  return files.filter(file => fs.statSync(path.join(dir, file)).isDirectory())
}

/**
 * 获取目录下的所有文件夹名称
 * @param dir 目录路径
 * @returns 返回目录下的所有文件夹名称
 */
export const getFolders = async (dir: string) => {
  const files = await fs.promises.readdir(dir)
  const list: string[] = []
  await Promise.all(files.map(async (file) => {
    const filePath = path.join(dir, file)
    const stats = await fs.promises.stat(filePath)
    if (stats.isDirectory()) list.push(file)
  }))
  return list
}

/**
 * 判断package.json是否存在karin字段
 * @param dir package.json路径
 * @returns 返回是否存在karin字段
 */
export const hasKarinField = async (dir: string) => {
  try {
    dir = `${dir}/package.json`
    const packageJson = await requireFile(dir, { ex: 0 })
    return typeof packageJson.karin === 'object'
  } catch {
    return false
  }
}

/**
 * 同步判断package.json是否存在karin字段
 * @param dir package.json路径
 * @returns 返回是否存在karin字段
 */
export const hasKarinFieldSync = (dir: string) => {
  try {
    dir = `${dir}/package.json`
    const packageJson = requireFileSync(dir, { ex: 0 })
    return typeof packageJson.karin === 'object'
  } catch {
    return false
  }
}
