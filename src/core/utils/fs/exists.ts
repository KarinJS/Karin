import fs from 'node:fs'

/**
 * 检查目录是否存在 不存在则创建 同步
 * @param userPath 用户配置文件路径
 */
export const existToMkdir = (userPath: string): boolean => {
  try {
    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath, { recursive: true })
    }
    return true
  } catch {
    return false
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
 * 检查路径文件是否存在
 * @param path 路径
 */
export const existsSync = (path: string): boolean => {
  try {
    return fs.existsSync(path)
  } catch {
    return false
  }
}

/**
 * 异步检查路径文件是否存在
 * @param path 路径
 */
export const exists = async (path: string): Promise<boolean> => {
  try {
    await fs.promises.access(path, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}
