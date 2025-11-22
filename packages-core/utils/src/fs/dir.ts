import fs from 'node:fs'
import path from 'node:path'

/**
 * 递归创建目录
 *
 * @param dirPath - 目录路径（可以是相对路径或绝对路径）
 * @returns 创建成功返回 `true`，失败返回 `false`
 *
 * @throws 一般不会抛出错误，失败时返回 `false`
 *
 * @example
 * ```typescript
 * // 创建单层目录
 * await mkdir('./data')
 *
 * // 递归创建多层目录
 * await mkdir('./data/logs/2024')
 *
 * // 使用绝对路径
 * await mkdir('/var/log/myapp')
 * ```
 *
 * @see {@link ensureDir} 确保目录存在（不存在则创建）
 *
 * @public
 */
export const mkdir = async (dirPath: string): Promise<boolean> => {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true })
    return true
  } catch {
    return false
  }
}

/**
 * 确保目录存在，不存在则创建
 *
 * 这是 `mkdir` 的语义化别名，更清晰地表达"确保目录存在"的意图
 *
 * @param dirPath - 目录路径（可以是相对路径或绝对路径）
 * @returns 操作成功返回 `true`，失败返回 `false`
 *
 * @throws 一般不会抛出错误，失败时返回 `false`
 *
 * @example
 * ```typescript
 * // 确保数据目录存在
 * await ensureDir('./data')
 *
 * // 确保日志目录存在
 * await ensureDir('./logs/error')
 *
 * // 如果目录已存在，也会返回 true
 * await ensureDir('./existing-dir') // true
 * ```
 *
 * @see {@link mkdir} 创建目录
 *
 * @public
 */
export const ensureDir = async (dirPath: string): Promise<boolean> => {
  try {
    const exists = await fs.promises.access(dirPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false)

    if (!exists) {
      await fs.promises.mkdir(dirPath, { recursive: true })
    }
    return true
  } catch {
    return false
  }
}

/**
 * 读取目录选项
 */
export interface ReadDirOptions {
  /**
   * 文件后缀过滤（可带点或不带点）
   * @example ['ts', 'js'] 或 ['.ts', '.js']
   */
  suffixs?: string[]
}

/**
 * 读取目录下的文件（不递归）
 *
 * @param dirPath - 目录路径
 * @param suffixs - 文件后缀过滤数组（可选）
 * @returns 文件名数组
 *
 * @throws {Error} 当路径不存在时抛出错误
 *
 * @example
 * ```typescript
 * // 读取所有文件
 * const allFiles = readDir('./src')
 * // => ['index.ts', 'main.ts', 'utils.js']
 *
 * // 只读取 TypeScript 文件
 * const tsFiles = readDir('./src', ['ts'])
 * // => ['index.ts', 'main.ts']
 *
 * // 后缀可以带点
 * const jsFiles = readDir('./src', ['.js', '.ts'])
 * // => ['index.ts', 'main.ts', 'utils.js']
 * ```
 *
 * @see {@link readDirRecursive} 递归读取目录
 *
 * @public
 */
export const readDir = (dirPath: string, suffixs: string[] = []): string[] => {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`路径不存在: ${dirPath}`)
  }

  /** 读取文件列表，只保留文件，排除文件夹 */
  let files = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(file => file.isFile())
    .map(file => file.name)

  if (suffixs.length > 0) {
    /** 统一后缀格式为 .suffix */
    const normalizedSuffixs = suffixs.map(suffix =>
      suffix.startsWith('.') ? suffix : `.${suffix}`
    )

    files = files.filter(file => {
      const suffix = path.extname(file)
      return suffix && normalizedSuffixs.includes(suffix)
    })
  }

  return files
}

/**
 * 递归读取目录选项
 */
export interface ReadDirRecursiveOptions {
  /**
   * 仅获取指定后缀的文件（与 exclude 互斥）
   * @example ['yaml', '.json']
   */
  suffixs?: string[]

  /**
   * 排除指定后缀的文件（与 suffixs 互斥）
   * @example ['.yaml', 'json']
   */
  exclude?: string[]

  /**
   * 返回类型
   * - `rel`: 相对路径（默认）
   * - `abs`: 绝对路径
   * @default 'rel'
   */
  returnType?: 'rel' | 'abs'
}

/**
 * 递归读取目录下的所有文件（异步版本）
 *
 * @param dirPath - 目录路径
 * @param options - 配置选项
 * @returns 文件路径数组
 *
 * @throws {Error} 当路径不存在时抛出错误
 *
 * @example
 * ```typescript
 * // 读取所有文件（相对路径）
 * const files = await readDirRecursive('./src')
 * // => ['index.ts', 'utils/helper.ts', 'components/Button.tsx']
 *
 * // 只读取 TypeScript 文件
 * const tsFiles = await readDirRecursive('./src', {
 *   suffixs: ['ts', 'tsx']
 * })
 * // => ['index.ts', 'components/Button.tsx']
 *
 * // 排除测试文件
 * const sourceFiles = await readDirRecursive('./src', {
 *   exclude: ['.test.ts', '.spec.ts']
 * })
 *
 * // 返回绝对路径
 * const absFiles = await readDirRecursive('./src', {
 *   returnType: 'abs'
 * })
 * // => ['/home/user/project/src/index.ts', ...]
 * ```
 *
 * @see {@link readDirRecursiveSync} 同步版本
 * @see {@link readDir} 非递归版本
 *
 * @public
 */
export const readDirRecursive = async (
  dirPath: string,
  options: ReadDirRecursiveOptions = {}
): Promise<string[]> => {
  const { suffixs = [], exclude = [], returnType = 'rel' } = options
  const result: string[] = []

  const readRecursive = async (currentDir: string, prefix = '') => {
    const files = await fs.promises.readdir(currentDir, { withFileTypes: true })

    await Promise.all(
      files.map(async (file) => {
        const relativePath = path.join(prefix, file.name)
        const fullPath = path.join(currentDir, file.name)

        if (file.isDirectory()) {
          await readRecursive(fullPath, relativePath)
        } else if (file.isFile()) {
          const suffix = path.extname(file.name)

          // 处理文件后缀筛选逻辑
          if (suffixs.length > 0) {
            const normalizedSuffixs = suffixs.map(s => s.startsWith('.') ? s : `.${s}`)
            if (normalizedSuffixs.includes(suffix)) {
              result.push(returnType === 'abs' ? fullPath : relativePath)
            }
          } else if (exclude.length > 0) {
            const normalizedExclude = exclude.map(s => s.startsWith('.') ? s : `.${s}`)
            if (!normalizedExclude.includes(suffix)) {
              result.push(returnType === 'abs' ? fullPath : relativePath)
            }
          } else {
            result.push(returnType === 'abs' ? fullPath : relativePath)
          }
        }
      })
    )
  }

  if (!fs.existsSync(dirPath)) {
    throw new Error(`路径不存在: ${dirPath}`)
  }

  await readRecursive(dirPath)
  return result
}

/**
 * 递归读取目录下的所有文件（同步版本）
 *
 * @param dirPath - 目录路径
 * @param options - 配置选项
 * @returns 文件路径数组
 *
 * @throws {Error} 当路径不存在时抛出错误
 *
 * @example
 * ```typescript
 * // 读取所有文件（相对路径）
 * const files = readDirRecursiveSync('./src')
 * // => ['index.ts', 'utils/helper.ts', 'components/Button.tsx']
 *
 * // 只读取 YAML 文件
 * const yamlFiles = readDirRecursiveSync('./config', {
 *   suffixs: ['yaml', 'yml']
 * })
 *
 * // 返回绝对路径
 * const absFiles = readDirRecursiveSync('./src', {
 *   returnType: 'abs'
 * })
 * ```
 *
 * @see {@link readDirRecursive} 异步版本
 * @see {@link readDir} 非递归版本
 *
 * @public
 */
export const readDirRecursiveSync = (
  dirPath: string,
  options: ReadDirRecursiveOptions = {}
): string[] => {
  const { suffixs = [], exclude = [], returnType = 'rel' } = options
  const result: string[] = []

  const readRecursive = (currentDir: string, prefix = '') => {
    const files = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const file of files) {
      const relativePath = path.join(prefix, file.name)
      const fullPath = path.join(currentDir, file.name)

      if (file.isDirectory()) {
        readRecursive(fullPath, relativePath)
      } else if (file.isFile()) {
        const suffix = path.extname(file.name)

        // 处理文件后缀筛选逻辑
        if (suffixs.length > 0) {
          const normalizedSuffixs = suffixs.map(s => s.startsWith('.') ? s : `.${s}`)
          if (normalizedSuffixs.includes(suffix)) {
            result.push(returnType === 'abs' ? fullPath : relativePath)
          }
        } else if (exclude.length > 0) {
          const normalizedExclude = exclude.map(s => s.startsWith('.') ? s : `.${s}`)
          if (!normalizedExclude.includes(suffix)) {
            result.push(returnType === 'abs' ? fullPath : relativePath)
          }
        } else {
          result.push(returnType === 'abs' ? fullPath : relativePath)
        }
      }
    }
  }

  if (!fs.existsSync(dirPath)) {
    throw new Error(`路径不存在: ${dirPath}`)
  }

  readRecursive(dirPath)
  return result
}
