import fs from 'fs'

/**
 * 检查目录是否存在 不存在则创建 异步
 * @param userPath 用户配置文件路径
 */
export const exists = async (userPath: string): Promise<void> => {
  if (!fs.existsSync(userPath)) {
    await fs.promises.mkdir(userPath, { recursive: true })
  }
}

/**
 * 检查目录是否存在 不存在则创建 同步
 * @param userPath 用户配置文件路径
 */
export const existsSync = (userPath: string): void => {
  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath, { recursive: true })
  }
}
