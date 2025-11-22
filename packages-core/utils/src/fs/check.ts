import fs from 'node:fs'

/**
 * 检查文件或目录是否存在
 *
 * @param filePath - 文件或目录的绝对路径
 * @returns 如果文件/目录存在返回 `true`，否则返回 `false`
 *
 * @throws 当 `filePath` 不是有效路径时可能抛出错误
 *
 * @example
 * ```typescript
 * // 检查文件是否存在
 * const fileExists = await exists('/path/to/file.txt')
 * console.log(fileExists) // true 或 false
 *
 * // 检查目录是否存在
 * const dirExists = await exists('/path/to/directory')
 * console.log(dirExists) // true 或 false
 * ```
 *
 * @see {@link isFile} 检查是否为文件
 * @see {@link isDir} 检查是否为目录
 *
 * @public
 */
export const exists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}

/**
 * 检查路径是否为目录
 *
 * @param filePath - 文件或目录的绝对路径
 * @returns 如果是目录返回 `true`，否则返回 `false`
 *
 * @throws 当路径不存在或无法访问时返回 `false` 而不抛出错误
 *
 * @example
 * ```typescript
 * // 检查是否为目录
 * const isDirectory = await isDir('/path/to/directory')
 * if (isDirectory) {
 *   console.log('这是一个目录')
 * }
 *
 * // 对文件调用将返回 false
 * const result = await isDir('/path/to/file.txt')
 * console.log(result) // false
 * ```
 *
 * @see {@link exists} 检查是否存在
 * @see {@link isFile} 检查是否为文件
 *
 * @public
 */
export const isDir = async (filePath: string): Promise<boolean> => {
  try {
    const stat = await fs.promises.stat(filePath)
    return stat.isDirectory()
  } catch {
    return false
  }
}

/**
 * 检查路径是否为文件
 *
 * @param filePath - 文件或目录的绝对路径
 * @returns 如果是文件返回 `true`，否则返回 `false`
 *
 * @throws 当路径不存在或无法访问时返回 `false` 而不抛出错误
 *
 * @example
 * ```typescript
 * // 检查是否为文件
 * const isRegularFile = await isFile('/path/to/file.txt')
 * if (isRegularFile) {
 *   console.log('这是一个文件')
 * }
 *
 * // 对目录调用将返回 false
 * const result = await isFile('/path/to/directory')
 * console.log(result) // false
 * ```
 *
 * @see {@link exists} 检查是否存在
 * @see {@link isDir} 检查是否为目录
 *
 * @public
 */
export const isFile = async (filePath: string): Promise<boolean> => {
  try {
    const stat = await fs.promises.stat(filePath)
    return stat.isFile()
  } catch {
    return false
  }
}
