import fs from 'node:fs'

/**
 * @description 递归创建文件夹 同步
 * @param path - 路径
 * @returns 是否创建成功
 */
export const mkdirSync = (dirname: string) => {
  return fs.mkdirSync(dirname, { recursive: true })
}

/**
 * @description 递归创建文件夹 异步
 * @param path - 路径
 * @returns 是否创建成功
 */
export const mkdir = async (dirname: string) => {
  return await fs.promises.mkdir(dirname, { recursive: true })
}
