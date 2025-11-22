import fs from 'node:fs'

/**
 * 读取文件内容（异步）
 *
 * @param filePath - 文件路径
 * @param encoding - 文件编码，默认 'utf-8'
 * @returns 文件内容字符串
 *
 * @throws {Error} 当文件不存在或无法读取时抛出错误
 *
 * @example
 * ```typescript
 * // 读取文本文件
 * const content = await readFile('./README.md')
 * console.log(content)
 *
 * // 指定编码
 * const content = await readFile('./data.txt', 'utf-8')
 * ```
 *
 * @public
 */
export const readFile = async (filePath: string, encoding: BufferEncoding = 'utf-8'): Promise<string> => {
  return await fs.promises.readFile(filePath, encoding)
}

/**
 * 写入文件内容（异步）
 *
 * @param filePath - 文件路径
 * @param content - 要写入的内容
 * @param encoding - 文件编码，默认 'utf-8'
 * @returns void
 *
 * @throws {Error} 当无法写入文件时抛出错误
 *
 * @example
 * ```typescript
 * // 写入文本文件
 * await writeFile('./output.txt', 'Hello World')
 *
 * // 指定编码
 * await writeFile('./data.txt', 'Content', 'utf-8')
 * ```
 *
 * @public
 */
export const writeFile = async (filePath: string, content: string, encoding: BufferEncoding = 'utf-8'): Promise<void> => {
  await fs.promises.writeFile(filePath, content, encoding)
}

/**
 * 复制文件列表（异步）
 *
 * @param files - 需要复制的文件列表
 * @param sourcePath - 源文件路径
 * @param targetPath - 目标文件路径
 * @returns void
 *
 * @throws {Error} 当无法复制文件时抛出错误
 *
 * @example
 * ```typescript
 * // 复制多个文件
 * await copyFiles(
 *   ['config.yaml', 'settings.json'],
 *   './template',
 *   './user'
 * )
 * ```
 *
 * @see {@link copyFilesSync} 同步版本
 *
 * @public
 */
export const copyFiles = async (files: string[], sourcePath: string, targetPath: string): Promise<void> => {
  await Promise.all(
    files.map(async (file) => {
      const sourceFile = `${sourcePath}/${file}`
      const targetFile = `${targetPath}/${file}`
      if (!fs.existsSync(targetFile)) {
        await fs.promises.copyFile(sourceFile, targetFile)
      }
    })
  )
}

/**
 * 复制文件列表（同步）
 *
 * @param files - 需要复制的文件列表
 * @param sourcePath - 源文件路径
 * @param targetPath - 目标文件路径
 * @returns void
 *
 * @throws {Error} 当无法复制文件时抛出错误
 *
 * @example
 * ```typescript
 * // 复制多个文件
 * copyFilesSync(
 *   ['config.yaml', 'settings.json'],
 *   './template',
 *   './user'
 * )
 * ```
 *
 * @see {@link copyFiles} 异步版本
 *
 * @public
 */
export const copyFilesSync = (files: string[], sourcePath: string, targetPath: string): void => {
  files.forEach((file) => {
    const sourceFile = `${sourcePath}/${file}`
    const targetFile = `${targetPath}/${file}`
    if (!fs.existsSync(targetFile)) {
      fs.copyFileSync(sourceFile, targetFile)
    }
  })
}
