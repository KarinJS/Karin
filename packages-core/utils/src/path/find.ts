import fs from 'node:fs'
import path from 'node:path'
import { format } from './format'

/**
 * 文件查找选项
 */
export interface FindOptions {
  /**
   * 文件扩展名过滤
   * @example ['ts', 'js'] 或 ['.ts', '.js']
   */
  ext?: string | string[]
  /**
   * 返回路径类型
   * - `name`: 仅文件名（默认）
   * - `rel`: 相对路径
   * - `abs`: 绝对路径
   * @default 'name'
   */
  pathsType?: 'name' | 'rel' | 'abs'
  /**
   * 是否递归查找子目录
   * @default false
   * @note 递归时如果 pathsType 为 'name' 将强制返回绝对路径
   */
  recursive?: boolean
}

/**
 * 根据扩展名查找文件
 *
 * @param dirPath - 目录路径
 * @param ext - 文件扩展名
 * @param pathsType - 返回路径类型
 * @param recursive - 是否递归查找
 * @returns 文件路径数组
 *
 * @example
 * ```typescript
 * // 查找所有文件
 * findByExt('./plugins')
 * // => ['index.js', 'config.ts']
 *
 * // 查找 JavaScript 文件
 * findByExt('./plugins', 'js')
 * // => ['index.js', 'utils.js']
 *
 * // 查找多种扩展名
 * findByExt('./plugins', ['.js', '.ts'])
 * // => ['index.js', 'config.ts']
 *
 * // 返回相对路径
 * findByExt('./plugins', 'js', 'rel')
 * // => ['plugins/index.js', 'plugins/utils.js']
 *
 * // 递归查找
 * findByExt('./src', 'ts', 'name', true)
 * // => ['/abs/path/to/src/index.ts', '/abs/path/to/src/utils/helper.ts']
 * ```
 *
 * @public
 */
export const findByExt = (
  dirPath: string,
  ext?: string | string[],
  pathsType: 'name' | 'rel' | 'abs' = 'name',
  recursive = false
): string[] => {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    return []
  }

  const list: string[] = []
  const files = fs.readdirSync(dirPath, { withFileTypes: true })

  // 创建扩展名过滤器
  const extFilter = (() => {
    if (typeof ext === 'string') {
      const extname = ext.startsWith('.') ? ext : `.${ext}`
      return (name: string) => name === extname
    }

    if (Array.isArray(ext)) {
      const extnames = ext.map(v => v.startsWith('.') ? v : `.${v}`)
      return (name: string) => extnames.includes(name)
    }

    return () => true
  })()

  // 创建路径处理器
  const pathHandler = (() => {
    if (pathsType === 'rel') {
      return (dir: string, entry: fs.Dirent) => {
        const file = path.resolve(dir, entry.name)
        const rel = path.relative(process.cwd(), file)
        return format(rel)
      }
    }

    if (pathsType === 'abs' || recursive) {
      return (dir: string, entry: fs.Dirent) => {
        return format(path.resolve(dir, entry.name))
      }
    }

    return (_dir: string, entry: fs.Dirent) => entry.name
  })()

  // 遍历文件
  files.forEach((entry) => {
    if (entry.isDirectory()) {
      if (!recursive) return
      const subPath = path.join(dirPath, entry.name)
      const result = findByExt(subPath, ext, pathsType, recursive)
      list.push(...result)
      return
    }

    if (!extFilter(path.extname(entry.name))) return
    list.push(pathHandler(dirPath, entry))
  })

  return list
}

/**
 * 查找文件（同步）
 *
 * @param dirPath - 目录路径
 * @param options - 查找选项
 * @returns 文件路径数组
 *
 * @example
 * ```typescript
 * // 查找所有文件
 * findFilesSync('./src')
 * // => ['index.ts', 'main.ts']
 *
 * // 查找 TypeScript 文件
 * findFilesSync('./src', { ext: 'ts' })
 * // => ['index.ts', 'main.ts']
 *
 * // 递归查找
 * findFilesSync('./src', { ext: 'ts', recursive: true })
 * // => ['/abs/path/index.ts', '/abs/path/utils/helper.ts']
 * ```
 *
 * @see {@link findFiles} 异步版本
 *
 * @public
 */
export const findFilesSync = (dirPath: string, options: FindOptions = {}): string[] => {
  return findByExt(
    dirPath,
    options.ext,
    options.pathsType || 'name',
    options.recursive || false
  )
}

/**
 * 查找文件（异步）
 *
 * @param dirPath - 目录路径
 * @param options - 查找选项
 * @returns 文件路径数组
 *
 * @example
 * ```typescript
 * // 查找所有文件
 * await findFiles('./src')
 * // => ['index.ts', 'main.ts']
 *
 * // 查找 TypeScript 文件
 * await findFiles('./src', { ext: 'ts' })
 * // => ['index.ts', 'main.ts']
 *
 * // 返回绝对路径
 * await findFiles('./src', { ext: 'ts', pathsType: 'abs' })
 * // => ['/abs/path/to/src/index.ts', '/abs/path/to/src/main.ts']
 * ```
 *
 * @see {@link findFilesSync} 同步版本
 *
 * @public
 */
export const findFiles = async (
  dirPath: string,
  options: FindOptions = {}
): Promise<string[]> => {
  try {
    const stat = await fs.promises.stat(dirPath)
    if (!stat.isDirectory()) return []
  } catch {
    return []
  }

  const { ext, pathsType = 'name', recursive = false } = options
  const list: string[] = []
  const files = await fs.promises.readdir(dirPath, { withFileTypes: true })

  // 创建扩展名过滤器
  const extFilter = (() => {
    if (typeof ext === 'string') {
      const extname = ext.startsWith('.') ? ext : `.${ext}`
      return (name: string) => name === extname
    }

    if (Array.isArray(ext)) {
      const extnames = ext.map(v => v.startsWith('.') ? v : `.${v}`)
      return (name: string) => extnames.includes(name)
    }

    return () => true
  })()

  // 创建路径处理器
  const pathHandler = (() => {
    if (pathsType === 'rel') {
      return (dir: string, entry: fs.Dirent) => {
        const file = path.resolve(dir, entry.name)
        const rel = path.relative(process.cwd(), file)
        return format(rel)
      }
    }

    if (pathsType === 'abs' || recursive) {
      return (dir: string, entry: fs.Dirent) => {
        return format(path.resolve(dir, entry.name))
      }
    }

    return (_dir: string, entry: fs.Dirent) => entry.name
  })()

  // 遍历文件
  await Promise.all(
    files.map(async (entry) => {
      if (entry.isDirectory()) {
        if (!recursive) return
        const subPath = path.join(dirPath, entry.name)
        const result = await findFiles(subPath, options)
        list.push(...result)
        return
      }

      if (!extFilter(path.extname(entry.name))) return
      list.push(pathHandler(dirPath, entry))
    })
  )

  return list
}

/**
 * 查找目录（异步）
 *
 * @param dirPath - 目录路径
 * @param options - 选项
 * @returns 目录名称数组
 *
 * @example
 * ```typescript
 * // 获取子目录名称
 * await findDirs('./src')
 * // => ['utils', 'components']
 *
 * // 获取绝对路径
 * await findDirs('./src', { isAbs: true })
 * // => ['/abs/path/to/src/utils', '/abs/path/to/src/components']
 * ```
 *
 * @see {@link findDirsSync} 同步版本
 *
 * @public
 */
export const findDirs = async (
  dirPath: string,
  options: { isAbs?: boolean } = {}
): Promise<string[]> => {
  const list: string[] = []
  const dirs = await fs.promises.readdir(dirPath)

  await Promise.all(
    dirs.map(async (name) => {
      const fullPath = path.join(dirPath, name)
      const stat = await fs.promises.stat(fullPath)

      if (stat.isDirectory()) {
        list.push(options.isAbs ? fullPath : name)
      }
    })
  )

  return list
}

/**
 * 查找目录（同步）
 *
 * @param dirPath - 目录路径
 * @param options - 选项
 * @returns 目录名称数组
 *
 * @example
 * ```typescript
 * // 获取子目录名称
 * findDirsSync('./src')
 * // => ['utils', 'components']
 *
 * // 获取绝对路径
 * findDirsSync('./src', { isAbs: true })
 * // => ['/abs/path/to/src/utils', '/abs/path/to/src/components']
 * ```
 *
 * @see {@link findDirs} 异步版本
 *
 * @public
 */
export const findDirsSync = (
  dirPath: string,
  options: { isAbs?: boolean } = {}
): string[] => {
  const list: string[] = []
  const dirs = fs.readdirSync(dirPath)

  dirs.forEach((name) => {
    const fullPath = path.join(dirPath, name)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      list.push(options.isAbs ? fullPath : name)
    }
  })

  return list
}

/**
 * 查找 node_modules 下的包（异步）
 *
 * 自动过滤 `node-karin` 相关包
 *
 * @returns 包名数组
 *
 * @example
 * ```typescript
 * const packages = await findNodeModules()
 * // => ['lodash', '@karinjs/utils', 'axios']
 * ```
 *
 * @see {@link findNodeModulesSync} 同步版本
 *
 * @public
 */
export const findNodeModules = async (): Promise<string[]> => {
  const pkgPath = path.join(process.cwd(), 'package.json')

  try {
    const content = await fs.promises.readFile(pkgPath, 'utf-8')
    const pkg = JSON.parse(content)

    const list = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]

    // 过滤 node-karin
    return list.filter(v => !v.includes('node-karin'))
  } catch {
    return []
  }
}

/**
 * 查找 node_modules 下的包（同步）
 *
 * 自动过滤 `node-karin` 相关包
 *
 * @returns 包名数组
 *
 * @example
 * ```typescript
 * const packages = findNodeModulesSync()
 * // => ['lodash', '@karinjs/utils', 'axios']
 * ```
 *
 * @see {@link findNodeModules} 异步版本
 *
 * @public
 */
export const findNodeModulesSync = (): string[] => {
  const pkgPath = path.join(process.cwd(), 'package.json')

  try {
    const content = fs.readFileSync(pkgPath, 'utf-8')
    const pkg = JSON.parse(content)

    const list = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]

    // 过滤 node-karin
    return list.filter(v => !v.includes('node-karin'))
  } catch {
    return []
  }
}

/**
 * 从系统环境变量查找可执行文件
 * @param command 命令名称
 * @returns 找到返回完整路径，未找到返回空字符串
 * @example
 * ```typescript
 * const ffmpegPath = findCmdPath('ffmpeg')
 * if (ffmpegPath) {
 *   console.log(`找到 ffmpeg，路径为：${ffmpegPath}`)
 * } else {
 *   console.log('未找到 ffmpeg，请确保已安装并配置环境变量')
 * }
 * ```
 */
export const findCmdPath = (() => {
  const isWin = process.platform === 'win32'
  const PATHS = (process.env.PATH || '').split(isWin ? ';' : ':').filter(Boolean)

  if (isWin) {
    const EXTS = ['.exe', '.cmd', '.bat', '']
    return (cmd: string): string | null => {
      for (let i = 0; i < PATHS.length; i++) {
        const dir = PATHS[i]
        for (let j = 0; j < EXTS.length; j++) {
          const full = path.join(dir, cmd + EXTS[j])
          if (fs.existsSync(full)) return full.replaceAll('\\', '/')
        }
      }
      return null
    }
  }

  return (cmd: string): string | null => {
    for (let i = 0; i < PATHS.length; i++) {
      const full = path.join(PATHS[i], cmd)
      if (fs.existsSync(full)) return full
    }
    return null
  }
})()
