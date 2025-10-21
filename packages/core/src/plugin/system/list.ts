import fs from 'node:fs'
import path from 'node:path'
import lodash from 'lodash'
import { isTs } from '@/env'
import { createAddEnv } from './env'
import { satisfies } from '@/utils/system'
import { karinPathPlugins } from '@/root'
import { filesByExt, formatPath } from '@/utils/fs/path'
import { writeEnv } from '@/utils/config/file/env'
import { requireFile, requireFileSync } from '@/utils/fs/require'

import type { PkgData, PkgEnv } from '@/utils/fs/pkg'
import type {
  Apps,
  GetPluginType,
  PkgInfo,
  GetPluginReturn,
  GetPluginLocalReturn,
  GetPluginLocalOptions,
} from '@/types/plugin'
import { createPluginMismatchReporter } from './versionCheck'

let isInit = true

/**
 * ===================================================================
 * 缓存管理模块
 * ===================================================================
 */

/**
 * 插件信息缓存结构
 */
type PluginCache = {
  /** 插件名称列表缓存 */
  list: Record<GetPluginType, string[]> | undefined
  /** 插件详细信息缓存 */
  info: Record<GetPluginType, PkgInfo[]> | undefined
}

/**
 * 内存缓存对象
 */
const cache: PluginCache = {
  list: undefined,
  info: undefined,
}

/**
 * 重置缓存
 */
const resetCache = (): void => {
  delete cache.list
  delete cache.info
}

/**
 * 初始化缓存容器
 */
const initCache = (): void => {
  if (!cache.list) {
    cache.list = {} as Record<GetPluginType, string[]>
  }

  if (!cache.info) {
    cache.info = {} as Record<GetPluginType, PkgInfo[]>
  }
}

/**
 * 设置插件列表到缓存并设置过期时间
 * @param type 插件类型
 * @param list 插件列表
 */
const setCachedList = (type: GetPluginType, list: string[]): void => {
  cache.list![type] = list
  setTimeout(() => delete cache?.list?.[type], 60 * 1000)
}

/**
 * 设置插件信息到缓存并设置过期时间
 * @param type 插件类型
 * @param info 插件信息
 */
const setCachedInfo = (type: GetPluginType, info: PkgInfo[]): void => {
  cache.info![type] = info
  setTimeout(() => delete cache?.info?.[type], 60 * 1000)
}

/**
 * 获取缓存的信息（若有效）
 * @param type 插件类型
 * @param isInfo 是否获取详细信息
 * @returns 缓存的数据或undefined
 */
const getCachedData = <T extends boolean> (type: GetPluginType, isInfo?: T): GetPluginReturn<T> | undefined => {
  if (isInfo) {
    if (cache?.info?.[type] && !lodash.isEqual(cache.info[type], cache.info[type])) {
      return cache.info[type] as GetPluginReturn<T>
    }
  } else {
    if (cache?.list?.[type] && !lodash.isEqual(cache.list[type], cache.list[type])) {
      return cache.list[type] as GetPluginReturn<T>
    }
  }
  return undefined
}

/**
 * ===================================================================
 * 插件信息构建模块
 * ===================================================================
 */

/**
 * 创建插件包信息对象
 * @param type 插件类型
 * @param name 插件名称
 * @param dir 插件目录
 * @param apps 应用路径列表
 * @param allApps 所有应用目录列表
 * @param isForce 是否强制更新
 * @returns 插件信息对象
 */
const createPkg = (
  type: PkgInfo['type'],
  name: string,
  dir: string,
  apps: string[],
  allApps: string[],
  isForce: boolean
): PkgInfo => ({
  type,
  name,
  apps,
  allApps,
  dir,
  id: -1,
  get pkgPath () {
    const file = path.join(this.dir, 'package.json')
    return fs.existsSync(file) ? file : ''
  },
  get pkgData () {
    if (!this.pkgPath) return {}
    return requireFileSync(this.pkgPath, { force: isForce })
  },
})

/**
 * 获取app类型插件信息
 * @param info 插件信息数组（会被修改）
 * @param dir 插件目录
 * @param name 插件名称
 * @param ext 文件扩展名
 * @param isForce 是否强制更新
 */
const getAppInfo = async (
  info: PkgInfo[],
  dir: string,
  name: string,
  ext: string[],
  isForce: boolean
): Promise<void> => {
  const apps = filesByExt(dir, ext, 'abs')
  info.push(createPkg('app', name, dir, apps, [dir], isForce))
}

/**
 * 获取git类型插件信息
 * @param info 插件信息数组（会被修改）
 * @param dir 插件目录
 * @param name 插件名称
 * @param ext 文件扩展名
 * @param isForce 是否强制更新
 * @param env 环境变量收集数组
 */
const getGitInfo = async (
  info: PkgInfo[],
  dir: string,
  name: string,
  ext: string[],
  isForce: boolean,
  env: PkgEnv[] | null
): Promise<void> => {
  const pkg = await requireFile<PkgData>(path.join(dir, 'package.json'))
  if (!pkg || !pkg.karin) {
    info.push(createPkg('git', name, dir, [], [], isForce))
    return
  }

  /** 收集环境变量 */
  if (Array.isArray(pkg.env)) {
    createAddEnv(env)(pkg.name, pkg.env)
  }

  /** 收集应用文件 */
  const apps: string[] = []
  const files: string[] = []
  const allApps: string[] = []

  /** 添加应用路径的辅助函数 */
  const pushApps = (app: string | string[]): void => {
    if (typeof app === 'string') {
      files.push(app)
    } else if (Array.isArray(app)) {
      files.push(...app)
    }
  }

  /** 根据环境决定使用哪些应用路径 */
  if (isTs()) {
    pkg.karin['ts-apps'] && pushApps(pkg.karin['ts-apps'])
  } else {
    pkg.karin.apps && pushApps(pkg.karin.apps)
  }

  /** 处理所有应用路径 */
  await Promise.allSettled(
    files.map(async (app) => {
      const appPath = path.join(dir, app)
      if (!fs.existsSync(appPath)) return
      apps.push(...filesByExt(appPath, ext, 'abs'))
      allApps.push(appPath)
    })
  )

  info.push(createPkg('git', name, dir, apps, allApps, isForce))
}

/**
 * 获取npm类型插件信息
 * @param info 插件信息数组（会被修改）
 * @param dir 插件目录
 * @param name 插件名称
 * @param isForce 是否强制更新
 * @param env 环境变量收集数组
 */
const getNpmInfo = async (
  info: PkgInfo[],
  dir: string,
  name: string,
  isForce: boolean,
  env: PkgEnv[] | null
): Promise<void> => {
  const ext = '.js'
  let apps: string[] = []
  let allApps: string[] = []
  const pkg = await requireFile(path.join(dir, 'package.json'))

  if (!pkg.karin?.apps?.length) {
    info.push(createPkg('npm', name, dir, [], [], isForce))
    return
  }

  /** 收集环境变量 */
  if (Array.isArray(pkg.env)) {
    createAddEnv(env)(pkg.name, pkg.env)
  }

  /** 收集应用文件 */
  const files: string[] = []
  if (typeof pkg.karin.apps === 'string') {
    files.push(pkg.karin.apps)
  } else if (Array.isArray(pkg.karin.apps)) {
    files.push(...pkg.karin.apps)
  }

  /** 处理所有应用路径 */
  await Promise.allSettled(
    files.map(async (app) => {
      const appPath = path.join(dir, app)
      if (!fs.existsSync(appPath)) return
      apps.push(...filesByExt(appPath, ext, 'abs'))
      allApps.push(appPath)
    })
  )

  /** 格式化路径 */
  apps = apps.map(formatPath)
  allApps = allApps.map(formatPath)

  info.push(createPkg('npm', name, dir, apps, allApps, isForce))
}

/**
 * 获取插件详细信息
 * @param list 插件名称列表
 * @param isForce 是否强制更新缓存
 * @param isFirst 是否第一次获取
 * @returns 插件详细信息数组
 */
export const getPluginsInfo = async (
  list: string[],
  isForce: boolean,
  isFirst: boolean
): Promise<PkgInfo[]> => {
  const info: PkgInfo[] = []
  const ext = isTs() ? ['.ts', '.js'] : ['.js']
  const env: PkgEnv[] | null = isFirst ? [] : null

  /** 处理每个插件 */
  await Promise.allSettled(
    list.map(async (v) => {
      const [type, name] = v.split(':')

      if (type === 'app') {
        const file = path.join(karinPathPlugins, name)
        await getAppInfo(info, file, name, ext, isForce)
        return
      }

      if (type === 'git' || type === 'root') {
        const file = type === 'root' ? process.cwd() : path.join(karinPathPlugins, name)
        await getGitInfo(info, file, name, ext, isForce, env)
        return
      }

      if (type === 'npm') {
        const file = path.join(process.cwd(), 'node_modules', name)
        await getNpmInfo(info, file, name, isForce, env)
      }
    })
  )

  /** 处理环境变量 */
  if (env && env.length) {
    logger.debug('[getPluginsInfo] 处理环境变量 同步写入', JSON.stringify(env, null, 2))
    writeEnv(env)
  } else {
    logger.debug('[getPluginsInfo] 处理环境变量 未收集到环境变量 跳过写入')
  }

  return info
}

/**
 * ===================================================================
 * 插件收集模块
 * ===================================================================
 */

/**
 * 收集App类型插件
 * @param files 目录项列表
 * @param list 结果列表（会被修改）
 */
const collectAppPlugins = async (files: fs.Dirent[], list: string[]): Promise<void> => {
  await Promise.all(
    files.map(async (v) => {
      if (!v.isDirectory()) return
      if (!v.name.startsWith('karin-plugin-')) return
      if (fs.existsSync(`${karinPathPlugins}/${v.name}/package.json`)) return

      list.push(`app:${v.name}`)
    })
  )
}

/**
 * 收集Git类型插件
 * @param files 目录项列表
 * @param list 结果列表（会被修改）
 */
// collectGitPlugins(...)
const collectGitPlugins = async (files: fs.Dirent[], list: string[]): Promise<void> => {
  const reporter = createPluginMismatchReporter()
  await Promise.all(
    files.map(async (v) => {
      if (!v.isDirectory()) return
      if (!v.name.startsWith('karin-plugin-')) return
      if (!fs.existsSync(path.join(karinPathPlugins, v.name, 'package.json'))) return

      /** 验证版本兼容性（同时支持 engines.karin 与 node-karin peer/deps/devDeps） */
      const pkg = await requireFile<PkgData>(path.join(karinPathPlugins, v.name, 'package.json'))
      const required =
        pkg?.karin?.engines?.karin ||
        pkg?.engines?.karin ||
        pkg?.peerDependencies?.['node-karin'] ||
        pkg?.dependencies?.['node-karin'] ||
        pkg?.devDependencies?.['node-karin']

      const range = required ? String(required).replace(/^workspace:|^link:/, '').trim() : ''
      if (range && !satisfies(range, process.env.KARIN_VERSION)) {
        reporter.add(v.name, range)
        return
      }

      list.push(`git:${v.name}`)
    })
  )

  /** 打印版本不符插件 */
  await reporter.flush(isInit)

  /** 检查根目录是否为插件 */
  const root = await requireFile('./package.json')
  if (root.name && root.karin) list.push(`root:${root.name}`)
}

/**
 * 要排除的NPM包列表
 */
const NPM_EXCLUDE_LIST = [
  '@karinjs/node-pty',
  '@karinjs/plugin-webui-network-monitor',
  '@karinjs/plugins-list',
  '@types/express',
  '@types/lodash',
  '@types/node-schedule',
  '@types/ws',
  'art-template',
  'axios',
  'chalk',
  'chokidar',
  'commander',
  'dotenv',
  'express',
  'level',
  'lodash',
  'log4js',
  'moment',
  'node-schedule',
  'redis',
  'ws',
  'yaml',
  'sqlite3',
]

/**
 * 收集NPM类型插件
 * @param list 结果列表（会被修改）
 */
// collectNpmPlugins(...)
const collectNpmPlugins = async (list: string[]): Promise<void> => {
  logger.debug('[collectNpmPlugins] 开始收集NPM插件')
  const rootPkg = await requireFile('./package.json', { force: true })
  const reporter = createPluginMismatchReporter()

  /** 获取所有依赖并排除不需要的 */
  const dependencies = [
    ...Object.keys(rootPkg.dependencies || {}),
    ...Object.keys(rootPkg.devDependencies || {}),
  ].filter((name) => !NPM_EXCLUDE_LIST.includes(name) && !name.startsWith('@types'))

  /** 检查每个依赖是否为karin插件 */
  await Promise.allSettled(
    dependencies.map(async (name) => {
      const file = path.join(process.cwd(), 'node_modules', name, 'package.json')
      const depPkg = await requireFile<PkgData>(file)
      if (!depPkg.karin) return

      /** 统一解析兼容要求：karin.engines.karin、package.engines.karin、peer/deps/devDeps 中的 node-karin */
      const required =
        depPkg?.karin?.engines?.karin ||
        depPkg?.engines?.karin ||
        depPkg?.peerDependencies?.['node-karin'] ||
        depPkg?.dependencies?.['node-karin'] ||
        depPkg?.devDependencies?.['node-karin']

      if (required) {
        /** 规整可能出现的非语义化前缀（workspace/link） */
        const range = String(required).replace(/^workspace:|^link:/, '').trim()
        if (!satisfies(range, process.env.KARIN_VERSION)) {
          reporter.add(name, range)
          return
        }
      }

      list.push(`npm:${name}`)
    })
  )

  /** 打印版本不符插件 */
  await reporter.flush(isInit)
}

/**
 * 收集所有类型插件
 * @param files 目录项列表
 * @param list 结果列表（会被修改）
 */
const collectAllPlugins = async (files: fs.Dirent[], list: string[]): Promise<void> => {
  await Promise.all([
    collectAppPlugins(files, list),
    collectGitPlugins(files, list),
    collectNpmPlugins(list),
  ])
}

/**
 * ===================================================================
 * 主函数模块
 * ===================================================================
 */

/**
 * 获取插件
 * @param type 获取插件的方式
 * @param isInfo 是否获取插件详细信息，否则返回插件名称列表
 * @param isForce 是否强制更新缓存
 * @param _isFirst 是否第一次获取
 * @returns 插件列表或详细信息
 * @version 1.0.0
 * ```json // 注意 返回非详细信息时候，插件名称会附带类型前缀
 * [
 *  "npm:plugin-name",
 *  "git:plugin-name",
 *  "app:plugin-name"
 * ]
 * ```
 */
export const getPlugins = async <T extends boolean = false> (
  type: GetPluginType,
  isInfo?: T,
  isForce: boolean = false,
  _isFirst: boolean = false
): Promise<GetPluginReturn<T>> => {
  /** 强制更新时重置缓存 */
  if (isForce) {
    resetCache()
  }

  /** 尝试从缓存获取数据 */
  const cachedData = getCachedData<T>(type, isInfo)
  if (cachedData) {
    return cachedData
  }

  /** 初始化缓存容器 */
  initCache()

  /** 验证插件类型 */
  if (!['npm', 'all', 'git', 'app'].includes(type)) return [] as GetPluginReturn<T>

  /** 获取目录文件列表（npm类型不需要读取目录） */
  const list: string[] = []
  const files = type === 'npm'
    ? []
    : fs.existsSync(karinPathPlugins) ? await fs.promises.readdir(karinPathPlugins, { withFileTypes: true }) : []

  /** 根据类型收集插件 */
  switch (type) {
    case 'app':
      await collectAppPlugins(files, list)
      break
    case 'git':
      await collectGitPlugins(files, list)
      break
    case 'npm':
      await collectNpmPlugins(list)
      break
    case 'all':
      await collectAllPlugins(files, list)
      break
  }

  /** 缓存插件列表 */
  setCachedList(type, list)

  /** 如果不需要详细信息，直接返回列表 */
  if (!isInfo) {
    return list as GetPluginReturn<T>
  }

  /** 获取插件详细信息 */
  const info = await getPluginsInfo(list, isForce, _isFirst)

  /** 缓存插件详细信息 */
  setCachedInfo(type, info)

  /** 更新初始化状态 */
  if (isInit) isInit = false

  return info as GetPluginReturn<T>
}

/**
 * 判断是否为npm插件
 * @param name 包名称
 * @returns 是否为karin插件
 */
export const isNpmPlugin = async (name: string): Promise<boolean> => {
  try {
    const file = path.join(process.cwd(), 'node_modules', name, 'package.json')
    const pkg = await requireFile(file)
    return !!pkg.karin
  } catch {
    return false
  }
}

/**
 * 获取本地插件
 * @param type 获取插件的方式
 * @param options 获取插件的选项
 * @returns 插件列表或详细信息
 * @version 1.8.0
 */
export const getPluginLocal = async <T extends boolean = false, R extends boolean = false> (
  type: GetPluginType,
  options: GetPluginLocalOptions<T, R> = {}
): Promise<GetPluginLocalReturn<T, R>> => {
  if (options.info) {
    const result = await getPlugins(type, true, options.force, false)
    return result as GetPluginLocalReturn<T, R>
  }

  if (!options.returnType) {
    const result = await getPlugins(type, false, options.force, false)
    return result as GetPluginLocalReturn<T, R>
  }

  const list: { name: string, type: Apps }[] = []
  const promise = []
  const createGetPlugin = async (type: Apps) => {
    const result = await getPlugins(type, false, options.force, false)
    result.forEach(name => list.push({ name, type }))
  }

  if (type === 'all') {
    promise.push(createGetPlugin('app'))
    promise.push(createGetPlugin('git'))
    promise.push(createGetPlugin('npm'))
  } else {
    promise.push(createGetPlugin(type))
  }

  await Promise.allSettled(promise)
  return list as GetPluginLocalReturn<T, R>
}
