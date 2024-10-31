/** 兼容一下 */
import fs from 'node:fs'

/**
 * 读取 JSON 文件
 * @param path 文件路径
 * @param isThrow 是否抛出异常 默认为`false`
 */
export const readJsonSync = (path: string, isThrow = false): any => {
  try {
    const data = fs.readFileSync(path, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (isThrow) throw error
    return null
  }
}

/**
 * 写入 JSON 文件
 * @param path 文件路径
 * @param data 数据
 * @param isThrow 是否抛出异常 默认为`false`
 */
export const writeJsonSync = (path: string, data: any, isThrow = false): boolean => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    if (isThrow) throw error
    return false
  }
}

/**
 * 异步读取 JSON 文件
 * @param path 文件路径
 *  @param isThrow 是否抛出异常 默认为`false`
 */
export const readJson = async (path: string, isThrow = false): Promise<any> => {
  try {
    const data = await fs.promises.readFile(path, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (isThrow) throw error
    return null
  }
}

/**
 * 异步写入 JSON 文件
 * @param path 文件路径
 * @param data 数据
 * @param isThrow 是否抛出异常 默认为`false`
 */
export const writeJson = async (path: string, data: any, isThrow = false): Promise<boolean> => {
  try {
    await fs.promises.writeFile(path, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    if (isThrow) throw error
    return false
  }
}

/** JSON 文件操作 */
export const json = {
  /** 同步读取 */
  readSync: readJsonSync,
  /** 同步写入 */
  writeSync: writeJsonSync,
  /** 异步读取 */
  read: readJson,
  /** 异步写入 */
  write: writeJson,
}
