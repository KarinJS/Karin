import fs from 'node:fs'

/**
 * 检查目录是否存在 不存在则创建 同步
 * @param userPath 用户配置文件路径
 */
export const exists = (userPath: string): void => {
  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath, { recursive: true })
  }
}

/**
 * 检查是否为目录
 * @param path 路径
 */
export const isDir = (path: string): boolean => {
  try {
    return fs.statSync(path).isDirectory()
  } catch {
    return false
  }
}

/**
 * 检查目录是否存在
 * @param path 路径
 */
export const isExists = (path: string): boolean => {
  try {
    fs.accessSync(path)
    return true
  } catch {
    return false
  }
}
