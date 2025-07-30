import fs from 'node:fs'

/**
 * 检查目录是否存在
 * @param file 文件路径
 * @returns 返回布尔值
 */
export const existsSync = (file: string): boolean => {
  return fs.existsSync(file)
}

/**
 * 检查是否为目录
 * @param file 文件路径
 * @returns 返回布尔值
 */
export const isDirSync = (file: string): boolean => {
  try {
    return fs.statSync(file).isDirectory()
  } catch {
    return false
  }
}

/**
 * 检查是否为文件
 * @param file 文件路径
 * @returns 返回布尔值
 */
export const isFileSync = (file: string): boolean => {
  try {
    return fs.statSync(file).isFile()
  } catch {
    return false
  }
}

/**
 * 递归创建文件夹
 * @param dirname 文件夹路径
 * @returns 返回布尔值 是否创建成功
 */
export const mkdirSync = (dirname: string): boolean => {
  try {
    fs.mkdirSync(dirname, { recursive: true })
    return true
  } catch {
    return false
  }
}

/**
 * 检查目录是否存在 不存在则创建
 * @param file 文件路径
 * @returns 返回布尔值
 */
export const existToMkdirSync = (file: string): boolean => {
  try {
    if (!fs.existsSync(file)) mkdirSync(file)
    return true
  } catch {
    return false
  }
}

export const rmSync = fs.rmSync
