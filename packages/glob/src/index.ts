import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import util from 'node:util'
import type { GlobOptions as GlobOptionsType } from 'glob'

export interface GlobOptions extends GlobOptionsType {
  /** 工作目录 */
  cwd?: string,
  /**
   * 返回的import结果
   * @value 'default' | string
   * @example
   * ```ts
   * import.meta.glob('./src/**.ts')
   * // 动态导入=> { './src/index.ts': () => import('./src/index.ts') }
   *
   * import.meta.glob('./src/**.ts', { import: 'default' })
   * // 默认导出=> { './src/index.ts': () => import('./src/index.ts').default }
   *
   * import.meta.glob('./src/**.ts', { import: 'named' })
   * // 命名导出=> { './src/index.ts': () => import('./src/index.ts').named }
   * ```
   */
  import?: 'default' | string,
  /**
   * 返回原始文件内容
   * @example
   * ```ts
   * import.meta.glob('./src/**.ts', { raw: true })
   * // => { './src/index.ts': () => 'console.log("Hello, world!");' }
   * ```
   */
  raw?: boolean,
  /**
   * 返回绝对路径
   * @example
   * ```ts
   * import.meta.glob('./src/**.ts', { path: true })
   * // => { '/Users/karin/Desktop/karin/packages/core/src/index.ts': () => import('./index.ts') }
   * ```
   */
  absPath?: boolean,
  /**
   * 文件匹配钩子
   * @param file 匹配到的文件路径
   * @returns 如果返回 false，则忽略该文件；返回字符串则替换原路径；返回 true 或 undefined 则保持原路径
   * 支持异步操作，可以返回 Promise
   */
  matchHook?: (file: string) => unknown | Promise<unknown>
}

/**
 * 返回结果
 * @param T
 * @description 分别为
 * - 动态导入函数
 * - 原始文件内容函数
 * - 路径列表
 */
export type GlobResult<T> = [
  Record<string, () => Promise<T>>,
  Record<string, () => string>,
  (isAbsPath?: boolean) => string[]
]

export type GlobResultEager<T> = [
  Record<string, T>,
  Record<string, unknown>
]

/**
 * 导入结果
 * @param options
 * @returns
 */
const createImportResult = (options: GlobOptions) => {
  const { cwd } = options

  return typeof options.import === 'string'
    ? (file: string) => {
      return () => import(`file://${path.resolve(cwd!, file)}`).then((m: Record<string, any>) => m[options.import!])
    }
    : (file: string) => {
      return () => import(`file://${path.resolve(cwd!, file)}`)
    }
}

/**
 * 写入结果
 * @param importFnc
 * @param options
 * @returns
 */
const createWrite = (
  result: Record<string, () => Promise<any>>,
  raw: Record<string, () => string>,
  importFnc: ReturnType<typeof createImportResult>,
  options: GlobOptions
) => {
  return options.raw === true
    ? (file: string) => {
      result[file] = importFnc(file)
      raw[file] = () => fs.readFileSync(file, 'utf-8')
    }
    : (file: string) => {
      result[file] = importFnc(file)
    }
}

/**
 * 创建格式化路径函数
 * @param options
 * @returns
 */
const createFormatPath = (options: GlobOptions) => {
  if (options.absPath) {
    return (file: string) => {
      file = path.resolve(options.cwd!, file)
      return file.replace(/\\/g, '/')
    }
  }

  return (file: string) => {
    return path.relative(options.cwd!, file).replace(/\\/g, '/')
  }
}

/**
 * 收集动态导入
 * @param target 目标路径
 * @param options 选项
 * @returns 导入结果
 */
export const importGlob = async <T = unknown> (
  target: string | string[],
  options: GlobOptions = {}
): Promise<GlobResult<T>> => {
  const result: Record<string, () => Promise<T>> = {}
  const raw: Record<string, () => string> = {}
  const paths: string[] = []

  if (typeof options.cwd !== 'string') options.cwd = process.cwd()
  const importFnc = createImportResult(options)
  const writeFnc = createWrite(result, raw, importFnc, options)
  const formatPath = createFormatPath(options)

  const files = await glob(target, { ...options, withFileTypes: false })

  /**
   * 参数归一化，确保有一个 matchHook 函数
   */
  const matchHook = ((): (file: string) => Promise<unknown> => {
    if (!options.matchHook || typeof options.matchHook !== 'function') return () => Promise.resolve()
    if (util.types.isAsyncFunction(options.matchHook)) return options.matchHook as (file: string) => Promise<unknown>
    return (file: string) => Promise.resolve(options.matchHook!(file))
  })()

  /**
   * 处理单个文件
   */
  const processFile = async (file: string): Promise<string | null> => {
    file = formatPath(file)
    const finalResult = await matchHook(file)

    /**
     * 如果返回 false，跳过此文件
     */
    if (finalResult === false) return null

    /**
     * 如果返回字符串，替换路径
     */
    if (typeof finalResult === 'string') {
      return finalResult
    }

    return file
  }

  /**
   * 并发处理所有文件
   */
  const processedFiles = await Promise.all(
    files.map(processFile)
  )

  /**
   * 并发添加到结果中
   */
  await Promise.all(
    processedFiles
      .filter(file => file !== null)
      .map(async (file) => {
        writeFnc(file!)
        paths.push(file!)
      })
  )

  const getPaths = (isAbsPath = false) => {
    if (options.absPath) {
      if (isAbsPath) return paths
      /** 转相对路径 */
      return paths.map(p => path.relative(options.cwd!, p).replace(/\\/g, '/'))
    }

    if (isAbsPath) {
      return paths.map(p => path.resolve(options.cwd!, p).replace(/\\/g, '/'))
    }

    return paths
  }

  return [result, raw, getPaths]
}

/**
 * 执行动态导入
 * @param target 目标路径
 * @param options 选项
 * @returns 导入结果
 */
export const importGlobEager = async <T = unknown> (
  target: string | string[],
  options: Omit<GlobOptions, 'raw'> = {}
): Promise<GlobResultEager<T>> => {
  const [result] = await importGlob<T>(target, options)
  const eager: Record<string, T> = {}
  const error: Record<string, unknown> = {}

  await Promise.all(Object.entries(result).map(async ([key, value]) => {
    try {
      eager[key] = await value()
    } catch (err) {
      error[key] = err
    }
  }))

  return [eager, error]
}

export { glob }
