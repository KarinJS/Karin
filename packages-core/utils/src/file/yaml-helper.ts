import fs from 'node:fs'
import yaml from 'yaml'

/**
 * YAML 读取选项
 */
export interface YamlReadOptions {
  /** 文件编码 @default 'utf-8' */
  encoding?: BufferEncoding
  /** 解析失败时的默认值 */
  defaultValue?: any
}

/**
 * YAML 写入选项
 */
export interface YamlWriteOptions {
  /** 文件编码 @default 'utf-8' */
  encoding?: BufferEncoding
}

/**
 * 读取 YAML 文件（异步）
 *
 * @param filePath - 文件路径
 * @param options - 读取选项
 * @returns YAML 对象
 *
 * @throws {Error} 当文件不存在或 YAML 格式错误时抛出
 *
 * @example
 * ```typescript
 * // 读取 YAML 文件
 * const config = await readYaml('./config.yaml')
 *
 * // 指定默认值
 * const config = await readYaml('./config.yaml', { defaultValue: {} })
 * ```
 *
 * @see {@link readYamlSync} 同步版本
 *
 * @public
 */
export const readYaml = async <T = any> (
  filePath: string,
  options: YamlReadOptions = {}
): Promise<T> => {
  const { encoding = 'utf-8', defaultValue } = options

  try {
    const content = await fs.promises.readFile(filePath, encoding)
    return yaml.parse(content)
  } catch (error) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw error
  }
}

/**
 * 读取 YAML 文件（同步）
 *
 * @param filePath - 文件路径
 * @param options - 读取选项
 * @returns YAML 对象
 *
 * @throws {Error} 当文件不存在或 YAML 格式错误时抛出
 *
 * @example
 * ```typescript
 * // 读取 YAML 文件
 * const config = readYamlSync('./config.yaml')
 *
 * // 指定默认值
 * const config = readYamlSync('./config.yaml', { defaultValue: {} })
 * ```
 *
 * @see {@link readYaml} 异步版本
 *
 * @public
 */
export const readYamlSync = <T = any> (
  filePath: string,
  options: YamlReadOptions = {}
): T => {
  const { encoding = 'utf-8', defaultValue } = options

  try {
    const content = fs.readFileSync(filePath, encoding)
    return yaml.parse(content)
  } catch (error) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw error
  }
}

/**
 * 写入 YAML 文件（异步）
 *
 * @param filePath - 文件路径
 * @param data - 要写入的数据
 * @param options - 写入选项
 * @returns void
 *
 * @throws {Error} 当无法写入文件时抛出
 *
 * @example
 * ```typescript
 * // 写入 YAML 文件
 * await writeYaml('./config.yaml', { key: 'value' })
 * ```
 *
 * @see {@link writeYamlSync} 同步版本
 *
 * @public
 */
export const writeYaml = async (
  filePath: string,
  data: any,
  options: YamlWriteOptions = {}
): Promise<void> => {
  const { encoding = 'utf-8' } = options
  const content = yaml.stringify(data)
  await fs.promises.writeFile(filePath, content, encoding)
}

/**
 * 写入 YAML 文件（同步）
 *
 * @param filePath - 文件路径
 * @param data - 要写入的数据
 * @param options - 写入选项
 * @returns void
 *
 * @throws {Error} 当无法写入文件时抛出
 *
 * @example
 * ```typescript
 * // 写入 YAML 文件
 * writeYamlSync('./config.yaml', { key: 'value' })
 * ```
 *
 * @see {@link writeYaml} 异步版本
 *
 * @public
 */
export const writeYamlSync = (
  filePath: string,
  data: any,
  options: YamlWriteOptions = {}
): void => {
  const { encoding = 'utf-8' } = options
  const content = yaml.stringify(data)
  fs.writeFileSync(filePath, content, encoding)
}

/**
 * YamlEditor 类（保持兼容）
 *
 * 提供对 YAML 文件的高级编辑功能，包括：
 * - 增删改查键值对
 * - 数组操作
 * - 注释管理
 * - 链式调用
 *
 * @see {@link YamlEditor} 详细文档请参考 yaml.ts
 *
 * @public
 */
export { YamlEditor, yaml, read, write, save, comment, applyComments } from './yaml'
