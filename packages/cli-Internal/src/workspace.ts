/**
 * pnpm-workspace.yaml 跨版本兼容逻辑 (pnpm v9 ~ v12)
 *
 * create-karin 也直接引用此文件 (打包时内联) 请保持无副作用 仅依赖 node 内置模块与 yaml
 *
 * 各版本差异 (实测)：
 * - pnpm 9: 默认执行依赖构建脚本 忽略无法识别的配置项 但 yaml 缺少 packages 字段时任何命令都会报错
 * - pnpm 10.0 ~ 10.4: 默认不执行构建脚本 不读取 yaml 中的配置项 同样要求 packages 字段
 * - pnpm 10.5 ~ 10.25: 读取 yaml 中的 onlyBuiltDependencies packages 字段可省略
 * - pnpm 10.26 ~ 10.x: 同时读取 allowBuilds 与 onlyBuiltDependencies
 * - pnpm 11+: 仅读取 allowBuilds 并默认 strictDepBuilds=true、minimumReleaseAge=1440、blockExoticSubdeps=true
 */

import fs from 'node:fs'
import { isDeepStrictEqual } from 'node:util'
import * as yaml from 'yaml'

/**
 * 构建依赖列表
 * pnpm 10 起默认不再执行依赖的安装脚本 这些包需要显式声明才会执行
 */
export const BUILD_DEPENDENCIES = [
  '@karinjs/node-pty',
  '@karinjs/sqlite3-cjs',
  'canvas',
  'sqlite3',
  'sharp',
  'puppeteer',
  'classic-level',
]

/** 版本号 */
export interface Version {
  major: number
  minor: number
  patch: number
}

/** pnpm-workspace.yaml 内容 */
export interface WorkspaceData {
  lockfile?: boolean
  packages?: string[]
  publicHoistPattern?: string[]
  onlyBuiltDependencies?: string[]
  allowBuilds?: Record<string, boolean>
  strictDepBuilds?: boolean
  minimumReleaseAge?: number
  blockExoticSubdeps?: boolean
  [key: string]: unknown
}

/**
 * 是否为普通对象
 * @param value - 值
 */
export const isPlainObject = (value: unknown): value is Record<string, any> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 数组去重
 * @param arr - 数组
 */
export const dedupe = <T> (arr: T[]) => Array.from(new Set(arr))

/**
 * 解析版本号 兼容 `v` 前缀与多行输出 (取第一个形如 x.y.z 的行)
 * @param version - 版本号字符串
 * @returns 无法解析返回null
 */
export const parseVersion = (version: string | null | undefined): Version | null => {
  const match = /^v?(\d+)\.(\d+)\.(\d+)/m.exec(String(version ?? '').trim())
  if (!match) return null
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) }
}

/**
 * 版本号是否 >= 指定版本
 * @param version - 版本号 为null时返回false
 * @param major - 主版本号
 * @param minor - 次版本号
 */
export const isVersionAtLeast = (version: Version | null, major: number, minor = 0) => {
  if (!version) return false
  return version.major > major || (version.major === major && version.minor >= minor)
}

/**
 * 写入构建脚本白名单与 pnpm 11+ 的兼容配置
 *
 * - 内置构建依赖与 onlyBuiltDependencies 中的条目统一迁移到 allowBuilds 用户显式设为 false 的保持不变
 * - pnpm 11+ 不再读取 onlyBuiltDependencies 迁移后移除该字段
 * - pnpm <= 10 或版本未知时保留 onlyBuiltDependencies 并与 allowBuilds 保持一致
 * - strictDepBuilds、minimumReleaseAge、blockExoticSubdeps 仅在未配置时写入 不覆盖用户的取值
 * @param data - pnpm-workspace.yaml 内容 会被直接修改
 * @param version - 当前pnpm版本 未知时传null
 */
export const applyBuildCompat = (data: WorkspaceData, version: Version | null): WorkspaceData => {
  const allowBuilds: Record<string, boolean> = isPlainObject(data.allowBuilds) ? { ...data.allowBuilds } : {}
  const onlyBuilt = Array.isArray(data.onlyBuiltDependencies)
    ? data.onlyBuiltDependencies.filter((dep): dep is string => typeof dep === 'string' && !!dep)
    : []

  for (const dep of [...BUILD_DEPENDENCIES, ...onlyBuilt]) {
    if (allowBuilds[dep] !== false) allowBuilds[dep] = true
  }
  data.allowBuilds = allowBuilds

  if (version && version.major >= 11) {
    delete data.onlyBuiltDependencies
  } else {
    data.onlyBuiltDependencies = dedupe([...onlyBuilt, ...Object.keys(allowBuilds)])
      .filter(dep => allowBuilds[dep] === true)
  }

  /**
   * pnpm 11+ 默认 true 存在未声明的构建脚本会直接中断安装
   * 关闭后与 pnpm 9/10 行为一致：仅提示警告
   */
  if (typeof data.strictDepBuilds !== 'boolean') data.strictDepBuilds = false

  /**
   * pnpm 11+ 默认 1440 分钟 发布未满24h的版本无法安装
   * 置 0 保持与 pnpm 9 一致：新版本立即可安装
   */
  if (typeof data.minimumReleaseAge !== 'number') data.minimumReleaseAge = 0

  /**
   * pnpm 10.26+/11+ 默认 true 会阻止子依赖使用 git/tarball 来源
   * 部分插件存在 git 子依赖 关闭以保持与 pnpm 9 一致
   */
  if (typeof data.blockExoticSubdeps !== 'boolean') data.blockExoticSubdeps = false

  return data
}

/** 新文件的键顺序 */
const KEY_ORDER = [
  'lockfile',
  'packages',
  'publicHoistPattern',
  'allowBuilds',
  'strictDepBuilds',
  'minimumReleaseAge',
  'blockExoticSubdeps',
  'onlyBuiltDependencies',
]

/**
 * 生成 karin 项目的 pnpm-workspace.yaml 内容 (karin init 与 create-karin 共用)
 *
 * 始终包含 packages 字段：pnpm 10.5 以下缺少该字段时任何命令都会报错
 * @param data - 已有内容 会被直接修改
 * @param options.isDev - 是否处于插件开发环境 生产环境会加入 plugins/*
 * @param options.version - 当前pnpm版本 未知时传null
 */
export const applyKarinWorkspace = (
  data: WorkspaceData,
  options: { isDev: boolean, version: Version | null }
): WorkspaceData => {
  if (typeof data.lockfile !== 'boolean') {
    data.lockfile = false
  }

  if (!Array.isArray(data.packages)) {
    data.packages = []
  }

  if (!options.isDev) {
    const packages = data.packages.map(v => v === 'plugins/**' ? 'plugins/*' : v)
    if (!packages.includes('plugins/*')) packages.push('plugins/*')
    data.packages = dedupe(packages)
  }

  /** 依赖提升 */
  const publicHoistPattern = Array.isArray(data.publicHoistPattern) ? data.publicHoistPattern : []
  data.publicHoistPattern = dedupe(['*sqlite3*', '*express*', ...publicHoistPattern])

  applyBuildCompat(data, options.version)

  const result: WorkspaceData = {}
  for (const key of KEY_ORDER) {
    if (Object.hasOwn(data, key)) result[key] = data[key]
  }
  return Object.assign(result, data)
}

/**
 * pnpm-workspace.yaml 是否已包含 pnpm v10 ~ v12 的兼容配置
 * 缺少 allowBuilds 或 onlyBuiltDependencies 中存在未迁移的条目时返回 false (pnpm 11+ 不再读取旧白名单)
 * @param data - pnpm-workspace.yaml 内容
 */
export const isWorkspaceCompatible = (data: unknown): boolean => {
  if (!isPlainObject(data) || !isPlainObject(data.allowBuilds)) return false
  const allowBuilds = data.allowBuilds
  const onlyBuilt: unknown[] = Array.isArray(data.onlyBuiltDependencies) ? data.onlyBuiltDependencies : []
  return onlyBuilt.every(dep => typeof dep !== 'string' || Object.hasOwn(allowBuilds, dep))
}

/**
 * 读取 yaml 文件 文件不存在、解析失败或顶层不是对象时返回空对象
 * @param file - 文件路径
 */
export const readYamlFile = <T extends Record<string, any> = WorkspaceData> (file: string): T => {
  try {
    if (!fs.existsSync(file)) return {} as T
    const data = yaml.parse(fs.readFileSync(file, 'utf-8'))
    return (isPlainObject(data) ? data : {}) as T
  } catch {
    return {} as T
  }
}

/**
 * 将差异写入 yaml 节点 普通对象逐个键对比 以保留其中未变化条目的注释
 * @param doc - yaml 文档
 * @param path - 节点路径
 * @param before - 修改前的值
 * @param after - 修改后的值
 */
const setYamlValue = (doc: yaml.Document, path: string[], before: unknown, after: unknown) => {
  if (isPlainObject(before) && isPlainObject(after) && yaml.isMap(doc.getIn(path, true))) {
    for (const key of Object.keys(before)) {
      if (!Object.hasOwn(after, key)) doc.deleteIn([...path, key])
    }
    for (const [key, value] of Object.entries(after)) {
      if (!isDeepStrictEqual(before[key], value)) setYamlValue(doc, [...path, key], before[key], value)
    }
    return
  }

  doc.setIn(path, doc.createNode(after))
}

/**
 * 读取并更新 yaml 文件 只改动发生变化的键 保留文件中原有的注释、顺序与引号风格
 * 文件不存在、解析失败或顶层不是对象时按空对象处理并重新生成
 * @param file - 文件路径
 * @param update - 接收当前内容的副本 返回修改后的内容
 * @returns 是否写入了文件
 */
export const updateYamlFile = <T extends Record<string, any> = WorkspaceData> (
  file: string,
  update: (data: T) => T
): boolean => {
  let doc: yaml.Document | undefined
  if (fs.existsSync(file)) {
    const parsed = yaml.parseDocument(fs.readFileSync(file, 'utf-8'))
    if (!parsed.errors.length && yaml.isMap(parsed.contents)) doc = parsed
  }

  let changed = !doc
  doc ??= new yaml.Document({})

  const before = doc.toJS() as T
  const after = update(structuredClone(before))

  for (const key of Object.keys(before)) {
    if (Object.hasOwn(after, key)) continue
    doc.delete(key)
    changed = true
  }

  for (const [key, value] of Object.entries(after)) {
    if (isDeepStrictEqual(before[key], value)) continue
    setYamlValue(doc, [key], before[key], value)
    changed = true
  }

  if (changed) fs.writeFileSync(file, doc.toString(), 'utf-8')
  return changed
}
