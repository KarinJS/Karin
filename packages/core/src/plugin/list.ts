import fs from 'node:fs'
import path from 'node:path'
import { isTsx } from '@/env'
import { filesByExt } from '@/utils/fs/path'
import { pluginDir as dir, karinDir } from '@/root'
import { requireFile, requireFileSync } from '@/utils/fs/require'

import type { GetPluginType, PkgInfo, GetPluginReturn } from '@/types/plugin'

/**
 * 缓存
 */
const cache: {
  list: Record<GetPluginType, string[]> | undefined
  info: Record<GetPluginType, PkgInfo[]> | undefined
} = {
  list: undefined,
  info: undefined,
}

/**
 * 获取插件
 * @param type 获取插件的方式
 * @param isInfo 是否获取插件详细信息 否则返回插件名称列表
 */
export const getPlugins = async<T extends boolean = false> (
  type: GetPluginType,
  isInfo?: T
): Promise<GetPluginReturn<T>> => {
  /** 先走缓存 */
  if (isInfo) {
    if (cache?.info?.[type]) return cache.info[type] as GetPluginReturn<T>
  } else {
    if (cache?.list?.[type]) return cache.list[type] as GetPluginReturn<T>
  }

  if (!cache.list) cache.list = {} as Record<GetPluginType, string[]>
  if (!cache.info) cache.info = {} as Record<GetPluginType, PkgInfo[]>
  if (!['npm', 'all', 'git', 'app'].includes(type)) return []

  const list: string[] = []
  const files = type === 'npm'
    ? []
    : fs.existsSync(dir) ? await fs.promises.readdir(dir, { withFileTypes: true }) : []

  const pluginHandlers: Record<GetPluginType, () => Promise<void>> = {
    app: () => filterApp(files, list),
    git: () => filterGit(files, list),
    npm: () => filterPkg(list),
    all: async () => {
      await Promise.all([
        filterApp(files, list),
        filterGit(files, list),
        filterPkg(list),
      ])
    },
  }

  await pluginHandlers[type]()

  cache.list[type] = list
  setTimeout(() => delete cache?.list?.[type], 60 * 1000)
  if (!isInfo) return list as GetPluginReturn<T>

  const info = await getPluginsInfo(list)
  cache.info[type] = info
  setTimeout(() => delete cache?.info?.[type], 60 * 1000)
  return info as GetPluginReturn<T>
}

/**
 * 获取插件详细信息
 * @param list 插件名称列表
 */
const getPluginsInfo = async (list: string[]): Promise<PkgInfo[]> => {
  const info: PkgInfo[] = []
  const ext = isTsx() ? ['.ts', '.js'] : ['.js']

  await Promise.allSettled(list.map(async (v) => {
    const [type, name] = v.split(':')

    if (type === 'app') {
      const file = path.join(dir, name)
      await getAppInfo(info, file, name, ext)
      return
    }

    if (type === 'git' || type === 'root') {
      const file = type === 'root' ? process.cwd() : path.join(dir, name)
      await getGitInfo(info, file, name, ext)
      return
    }

    if (type === 'npm') {
      const file = path.join(process.cwd(), 'node_modules', name)
      await getNpmInfo(info, file, name)
    }
  }))

  return info
}

const createPkg = (
  type: PkgInfo['type'],
  name: string,
  dir: string,
  apps: string[],
  allApps: string[]
): PkgInfo => {
  return {
    type,
    name,
    apps,
    allApps,
    dir,
    id: -1,
    get pkgPath () {
      const file = path.join(this.dir, 'package.json')
      if (!fs.existsSync(file)) return ''
      return file
    },
    get pkgData () {
      if (!this.pkgPath) return {}
      return requireFileSync(this.pkgPath)
    },
  }
}

/**
 * 获取app插件信息
 * @param dir 插件目录
 * @param name 插件名称
 * @param ext 文件后缀
 */
const getAppInfo = async (info: PkgInfo[], dir: string, name: string, ext: string[]) => {
  const apps = filesByExt(dir, ext, 'abs')
  info.push(createPkg('app', name, dir, apps, [dir]))
}

/**
 * 获取git插件信息
 * @param dir 插件目录
 * @param name 插件名称
 * @param ext 文件后缀
 */
const getGitInfo = async (info: PkgInfo[], dir: string, name: string, ext: string[]) => {
  const pkg = await requireFile(path.join(dir, 'package.json'))
  if (!pkg || !pkg.karin) {
    info.push(createPkg('git', name, dir, [], []))
    return
  }

  /** app的绝对路径列表 */
  const apps: string[] = []
  /** apps目录列表 */
  const files: string[] = []
  /** 所有可能包含apps的目录 */
  const allApps: string[] = []

  const pushApps = (app: string | string[]) => {
    if (typeof app === 'string') {
      files.push(app)
    } else if (Array.isArray(app)) {
      files.push(...app)
    }
  }

  if (isTsx() && pkg.karin['ts-apps']) {
    pushApps(pkg.karin['ts-apps'])
  } else if (pkg.karin.apps) {
    pushApps(pkg.karin.apps)
  }

  await Promise.allSettled(files.map(async app => {
    const appPath = path.join(dir, app)
    if (!fs.existsSync(appPath)) return
    apps.push(...filesByExt(appPath, ext, 'abs'))
    allApps.push(appPath)
  }))

  info.push(createPkg('git', name, dir, apps, allApps))
}

/**
 * 获取npm插件信息
 * @param dir 插件目录
 * @param name 插件名称
 */
const getNpmInfo = async (info: PkgInfo[], dir: string, name: string) => {
  const ext = '.js'
  const apps: string[] = []
  const allApps: string[] = []
  const pkg = await requireFile(path.join(dir, 'package.json'))

  if (!pkg.karin?.apps?.length) {
    info.push(createPkg('npm', name, dir, [], []))
    return
  }

  const files: string[] = []
  if (typeof pkg.karin.apps === 'string') {
    files.push(pkg.karin.apps)
  } else if (Array.isArray(pkg.karin.apps)) {
    files.push(...pkg.karin.apps)
  }

  await Promise.allSettled(files.map(async app => {
    const appPath = path.join(dir, app)
    if (!fs.existsSync(appPath)) return
    apps.push(...filesByExt(appPath, ext, 'abs'))
    allApps.push(appPath)
  }))

  info.push(createPkg('npm', name, dir, apps, allApps))
}

/**
 * 判断是否为npm插件
 * @param name pkg名称
 * @returns 是否为pkg插件
 */
export const isNpmPlugin = async (name: string) => {
  try {
    const file = path.join(process.cwd(), 'node_modules', name, 'package.json')
    const pkg = await requireFile(file)
    return !!pkg.karin
  } catch {
    return false
  }
}

const filterApp = async (files: fs.Dirent[], list: string[]) => {
  await Promise.all(files.map(async v => {
    if (!v.isDirectory()) return
    if (!v.name.startsWith('karin-plugin-')) return
    if (fs.existsSync(`${dir}/${v.name}/package.json`)) return

    list.push(`app:${v.name}`)
  }))

  const root = await requireFile('./package.json')
  if (root.name && root.karin) list.push(`root:${root.name}`)
}

const filterGit = async (files: fs.Dirent[], list: string[]) => {
  await Promise.all(files.map(async v => {
    if (!v.isDirectory()) return
    if (!v.name.startsWith('karin-plugin-')) return
    if (!fs.existsSync(path.join(dir, v.name, 'package.json'))) return
    list.push(`git:${v.name}`)
  }))
}

const filterPkg = async (list: string[]) => {
  const karinPkg = await requireFile(path.join(karinDir, 'package.json'))
  const exclude = [...Object.keys(karinPkg.dependencies || {}), ...Object.keys(karinPkg.devDependencies || {})]

  const pkg = await requireFile('./package.json')
  const dependencies = Object.keys(pkg.dependencies || {}).filter((name) => !exclude.includes(name) && !name.startsWith('@types'))

  await Promise.all(dependencies.map(async (name) => {
    const isPlugin = await isNpmPlugin(name)
    if (isPlugin) list.push(`npm:${name}`)
  }))
}
