import fs from 'node:fs'
import lodash from 'lodash'
import path from 'node:path'
import { sep } from '../file'
import { fileURLToPath } from 'node:url'
import { requireFileSync } from '../require'

/**
 * 文件查找选项接口
 */
export interface FindFilesOptions {
  /**
   * 后缀名、或后缀名列表
   * @default undefined - 所有文件
   */
  ext?: string | string[] | null
  /**
   * 返回类型
   * @default 'name' - 文件名
   */
  pathsType?: 'name' | 'rel' | 'abs' | null
  /**
   * 是否递归查找子目录
   * @default false - 不递归
   * @note 此项为true时，如果pathsType设置为`name`，强制返回`绝对路径`
   */
  recursive?: boolean
}

/**
 * @description 根据文件后缀名从指定路径下读取符合要求的文件
 * @param path - 路径
 * @param ext - 后缀名、或后缀名列表
 * @param pathsType - `key=返回类型` `name=文件名` `rel=相对路径` `abs=绝对路径` 默认返回文件名
 * @param recursive - 是否递归查找子目录，默认为false 此项为true时，如果pathsType设置为`name`，强制返回`绝对路径`
 * @example
 * ```ts
 * filesByExt('./plugins/karin-plugin-test')
 * // -> ['1.js', '2.js', '3.ts'] 返回全部
 *
 * filesByExt('./plugins/karin-plugin-test', 'js')
 * // -> ['1.js', '2.js'] 处理固定后缀名
 *
 * filesByExt('./plugins', ['.js', '.ts'], 'name')
 * // -> ['1.js', '2.js', '3.ts'] 处理多个后缀名
 *
 * filesByExt('./plugins', '.js', 'rel')
 * // -> ['plugins/1.js', 'plugins/2.js'] 返回相对路径
 *
 * filesByExt('./plugins', '.js', 'abs')
 * // -> ['C:/Users/karin/plugins/1.js', 'C:/Users/karin/plugins/2.js'] 返回绝对路径
 *
 * filesByExt('./plugins', null, null, true)
 * // -> ['1.js', '2.js', '3.ts'] 处理所有文件
 * ```
 */
export const filesByExt = (
  filePath: string,
  ext?: string | string[] | null,
  pathsType: 'name' | 'rel' | 'abs' | null = 'name',
  recursive: boolean = false
): string[] => {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isDirectory()) return []

  const list: string[] = []
  const files = fs.readdirSync(filePath, { withFileTypes: true })

  /**
   * 扩展名过滤器
   */
  const extFilter = (() => {
    if (typeof ext === 'string') {
      const extname = ext.startsWith('.') ? ext : `.${ext}`
      return (name: string) => name === extname
    }

    if (Array.isArray(ext)) {
      const extname = ext.map(v => v.startsWith('.') ? v : `.${v}`)
      return (name: string) => extname.includes(name)
    }

    return () => true
  })()

  /**
   * 返回值处理器
   */
  const pathHandler = (() => {
    if (pathsType === 'rel') {
      return (dir: string, entry: fs.Dirent) => {
        const file = path.resolve(dir, entry.name)
        const rel = path.relative(process.cwd(), file)
        return formatPath(rel)
      }
    }

    if (pathsType === 'abs' || recursive === true) {
      return (dir: string, entry: fs.Dirent) => formatPath(path.resolve(dir, entry.name))
    }

    return (_dir: string, entry: fs.Dirent) => entry.name
  })()

  files.forEach(entry => {
    if (entry.isDirectory()) {
      if (!recursive) return
      const result = filesByExt(path.join(filePath, entry.name), ext, pathsType, recursive)
      return list.push(...result)
    }

    if (!extFilter(entry.name)) return

    list.push(pathHandler(filePath, entry))
  })

  return list
}

/**
 * @description 根据文件后缀名从指定路径下读取符合要求的文件
 * @param dir - 目录路径
 * @param options - 查找选项
 * @example
 * ```ts
 * findFilesSync('./plugins/karin-plugin-test')
 * // -> ['1.js', '2.js', '3.ts'] 返回全部
 *
 * findFilesSync('./plugins/karin-plugin-test', { ext: 'js' })
 * // -> ['1.js', '2.js'] 处理固定后缀名
 *
 * findFilesSync('./plugins', { ext: ['.js', '.ts'], pathsType: 'name' })
 * // -> ['1.js', '2.js', '3.ts'] 处理多个后缀名
 *
 * findFilesSync('./plugins', { ext: '.js', pathsType: 'rel' })
 * // -> ['plugins/1.js', 'plugins/2.js'] 返回相对路径
 *
 * findFilesSync('./plugins', { ext: '.js', pathsType: 'abs' })
 * // -> ['C:/Users/karin/plugins/1.js', 'C:/Users/karin/plugins/2.js'] 返回绝对路径
 *
 * findFilesSync('./plugins', { recursive: true })
 * // -> ['1.js', '2.js', '3.ts'] 处理所有文件
 * ```
 */
export const findFilesSync = (filePath: string, options: FindFilesOptions = {}): string[] => {
  return filesByExt(
    filePath,
    options.ext,
    options.pathsType || 'name',
    options.recursive || false
  )
}

/**
 * @description 根据文件后缀名从指定路径下读取符合要求的文件（异步版本）
 * @param dir - 目录路径
 * @param options - 查找选项
 * @example
 * ```ts
 * await findFiles('./plugins/karin-plugin-test')
 * // -> ['1.js', '2.js', '3.ts'] 返回全部
 *
 * await findFiles('./plugins/karin-plugin-test', { ext: 'js' })
 * // -> ['1.js', '2.js'] 处理固定后缀名
 *
 * await findFiles('./plugins', { ext: ['.js', '.ts'], pathsType: 'name' })
 * // -> ['1.js', '2.js', '3.ts'] 处理多个后缀名
 *
 * await findFiles('./plugins', { ext: '.js', pathsType: 'rel' })
 * // -> ['plugins/1.js', 'plugins/2.js'] 返回相对路径
 *
 * await findFiles('./plugins', { ext: '.js', pathsType: 'abs' })
 * // -> ['C:/Users/karin/plugins/1.js', 'C:/Users/karin/plugins/2.js'] 返回绝对路径
 *
 * await findFiles('./plugins', { recursive: true })
 * // -> ['1.js', '2.js', '3.ts'] 处理所有文件
 * ```
 */
export const findFiles = async (
  filePath: string,
  options: FindFilesOptions = {}
): Promise<string[]> => {
  try {
    const stat = await fs.promises.stat(filePath)
    if (!stat.isDirectory()) return []
  } catch {
    return []
  }

  const { ext, pathsType = 'name', recursive = false } = options
  const list: string[] = []
  const files = await fs.promises.readdir(filePath, { withFileTypes: true })

  /**
   * 扩展名过滤器
   */
  const extFilter = (() => {
    if (typeof ext === 'string') {
      const extname = ext.startsWith('.') ? ext : `.${ext}`
      return (name: string) => name === extname
    }

    if (Array.isArray(ext)) {
      const extname = ext.map(v => v.startsWith('.') ? v : `.${v}`)
      return (name: string) => extname.includes(name)
    }

    return () => true
  })()

  /**
   * 返回值处理器
   */
  const pathHandler = (() => {
    if (pathsType === 'rel') {
      return (dir: string, entry: fs.Dirent) => {
        const file = path.resolve(dir, entry.name)
        const rel = path.relative(process.cwd(), file)
        return formatPath(rel)
      }
    }

    if (pathsType === 'abs' || recursive === true) {
      return (dir: string, entry: fs.Dirent) => formatPath(path.resolve(dir, entry.name))
    }

    return (_dir: string, entry: fs.Dirent) => entry.name
  })()

  await Promise.all(
    files.map(async (entry) => {
      if (entry.isDirectory()) {
        if (!recursive) return
        const result = await findFiles(path.join(filePath, entry.name), options)
        list.push(...result)
        return
      }

      if (!extFilter(entry.name)) return

      list.push(pathHandler(filePath, entry))
    })
  )

  return list
}

/**
 * 标准化文件路径 统一使用/分隔符
 * @param file - 路径
 * @param absPath - 返回绝对路径 默认为true
 * @param prefix - 添加file://前缀 默认为false
 * @returns 标准化后的路径
 */
export const absPath = (file: string, absPath = true, prefix = false): string => {
  file = file.replace(/\\/g, '/')
  if (file.startsWith('file://')) file = file.replace(sep, '')

  file = path.normalize(file)
  if (absPath) file = path.resolve(file)
  if (prefix) file = 'file://' + file
  return file.replace(/\\/g, '/')
}

/**
 * @description 分割路径为文件夹路径和文件名
 * @param filePath - 路径
 * @returns - 文件夹路径和文件名
 * @example
 * ```ts
 * splitPath('C:/Users/admin/1.txt')
 * // -> { dirname: 'C:/Users/admin', basename: '1.txt' }
 * ```
 */
export const splitPath = (filePath: string) => {
  const dirname = path.dirname(filePath).replace(sep, '')
  const basename = path.basename(filePath)
  return { dirname, basename }
}

/**
 * @description 去掉相对路径的前缀和后缀
 * @param filePath - 相对路径路径
 * @example
 * ```ts
 * getRelPath('./plugins/karin-plugin-example/index.ts')
 * // -> 'plugins/karin-plugin-example/index.ts'
 * ```
 */
export const getRelPath = (filePath: string) => filePath.replace(/\\+/g, '/').replace(/\.+\/+|\/+$/g, '')

/**
 * 根据传入的 import.meta.url 计算相对于项目根目录的路径，返回需要的 '../' 层级。
 * @param url - import.meta.url
 * @returns 相对路径的层级数量，用 '../' 表示
 * @example
 * ```ts
 * // 在 plugins/karin-plugin-example/index.ts 中使用
 * urlToPath(import.meta.url)
 * // -> '../../'
 * ```
 */
export const urlToPath = (url: string) => {
  const filePath = fileURLToPath(url)
  /** 当前文件到项目根目录的相对路径 */
  const rel = path.relative(path.dirname(filePath), process.cwd())
  /** 相对路径的层级数量 */
  const upLevelsCount = rel.split(path.sep).length
  return lodash.repeat('../', upLevelsCount)
}

/**
 * @description 检查目标路径是否处于根路径下
 * @param root 根路径
 * @param target 目标路径
 * @param isAbs 是否将传入的路径转为绝对路径
 * @returns 返回布尔值
 */
export const isSubPath = (root: string, target: string, isAbs = true) => {
  if (isAbs) {
    root = path.resolve(root)
    target = path.resolve(target)
  }

  /** 相对路径 */
  const relative = path.relative(root, target)
  /** 检查是否以 `..` 开头或是否为空路径 如果是则代表目标路径不处于根路径下 */
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
}

/**
 * @description 将路径统一格式
 * - 绝对路径
 * - 统一分隔符`/`
 * @param filePath - 路径
 * @returns 统一格式后的路径
 */
export const formatPath = (filePath: string) => {
  return path.resolve(filePath).replace(/\\/g, '/')
}

/**
 * @description 比较两个路径是否相同
 * @param path1 - 第一个路径
 * @param path2 - 第二个路径
 * @returns 是否相同
 * @example
 * ```ts
 * isPathEqual('C:\\Users\\admin', 'C:/Users/admin')
 * // -> true
 * isPathEqual('./folder', 'folder')
 * // -> true
 * ```
 */
export const isPathEqual = (path1: string, path2: string) => {
  /** 先直接判断 */
  if (path1 === path2) return true

  /** 格式化后第二次比较 */
  path1 = formatPath(path1)
  path2 = formatPath(path2)
  if (path1 === path2) return true

  /** 判断是否为windows */
  if (process.platform === 'win32') {
    return path1.toLowerCase() === path2.toLowerCase()
  }

  return false
}

/**
 * 获取目录下的所有文件夹
 * @param dir 目录
 * @returns 文件夹列表
 */
export const getDirs = async (dir: string, options: {
  /** 返回绝对路径 默认返回文件夹名称 */
  isAbs?: boolean
} = {}) => {
  const list: string[] = []
  const dirs = await fs.promises.readdir(dir)
  await Promise.all(dirs.map(async (v) => {
    const stat = await fs.promises.stat(path.join(dir, v))
    if (!stat.isDirectory()) return

    list.push(options.isAbs ? path.join(dir, v) : v)
  }))

  return list
}

/**
 * 获取目录下的所有文件夹
 * @param dir 目录
 * @returns 文件夹列表
 */
export const getDirsSync = (dir: string) => {
  const list: string[] = []
  const dirs = fs.readdirSync(dir)
  dirs.forEach(v => {
    const stat = fs.statSync(path.join(dir, v))
    if (!stat.isDirectory()) return

    list.push(v)
  })

  return list
}

/**
 * 获取node_modules下的插件
 */
export const getNodeModules = async () => {
  const pkg = requireFileSync(path.join(process.cwd(), 'package.json'), { ex: 0 })

  let list: string[] = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]

  /** 过滤node-karin */
  list = list.filter(v => !v.includes('node-karin'))

  return list
}

/**
 * 获取node_modules下的插件
 * @description `node-karin` 会被过滤掉
 */
export const getNodeModulesSync = () => {
  const pkg = requireFileSync(path.join(process.cwd(), 'package.json'), { ex: 0 })

  let list: string[] = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]

  /** 过滤node-karin */
  list = list.filter(v => !v.includes('node-karin'))

  return list
}
