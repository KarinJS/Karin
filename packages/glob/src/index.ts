import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
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
  absPath?: boolean
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
  return typeof options.import === 'string'
    ? (file: string) => {
      return () => import(file).then((m: Record<string, any>) => m[options.import!])
    }
    : (file: string) => {
      return () => import(file)
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
export const importGlob = async <T = unknown>(
  target: string | string[],
  options: GlobOptions = {}
): Promise<GlobResult<T>> => {
  const result: Record<string, () => Promise<T>> = {}
  const raw: Record<string, () => string> = {}
  const absPath: string[] = []

  if (typeof options.cwd !== 'string') options.cwd = process.cwd()
  const importFnc = createImportResult(options)
  const writeFnc = createWrite(result, raw, importFnc, options)
  const formatPath = createFormatPath(options)

  const files = await glob(target, { ...options, withFileTypes: false })

  for (let file of files) {
    file = formatPath(file)
    writeFnc(file)
    absPath.push(file)
  }

  const getPaths = (isAbsPath = false) => {
    if (options.absPath) {
      if (isAbsPath) return absPath
      /** 转相对路径 */
      return absPath.map(p => path.relative(options.cwd!, p).replace(/\\/g, '/'))
    }

    if (isAbsPath) {
      return absPath.map(p => path.resolve(options.cwd!, p).replace(/\\/g, '/'))
    }

    return absPath
  }

  return [result, raw, getPaths]
}

/**
 * 执行动态导入
 * @param target 目标路径
 * @param options 选项
 * @returns 导入结果
 */
export const importGlobEager = async <T = unknown>(
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
