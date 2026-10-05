import fs from 'node:fs'
import path from 'node:path'
import * as yaml from 'yaml'
import { getPnpmMajorVersion, isPnpmAtLeast } from '@/env'

/**
 * pnpm 10 起默认不再执行依赖的安装脚本 这些包需要显式声明才会执行
 */
export const KARIN_BUILD_DEPENDENCIES = [
  '@karinjs/node-pty',
  '@karinjs/sqlite3-cjs',
  'canvas',
  'sqlite3',
  'sharp',
  'puppeteer',
  'classic-level',
]

/**
 * @description pnpm 是否支持 --allow-build 参数 (v10.4+)
 */
export const isPnpmAllowBuildSupported = () => isPnpmAtLeast(10, 4)

/**
 * @description 将包持久化到 pnpm-workspace.yaml 的构建脚本白名单
 *
 * pnpm 10.26+/11+ 使用 allowBuilds 10.x 使用 onlyBuiltDependencies
 * 同时写入两份 旧版本会忽略无法识别的配置项 以保证 pnpm v9 ~ v12 行为一致
 * @param packages - 包名列表
 * @returns 是否写入成功 文件不存在或解析失败返回false
 */
export const addWorkspaceAllowBuilds = async (packages: string[]): Promise<boolean> => {
  const list = Array.isArray(packages) ? packages.filter(p => typeof p === 'string' && p.trim()) : []
  if (!list.length) return false

  const file = path.join(process.cwd(), 'pnpm-workspace.yaml')
  if (!fs.existsSync(file)) return false

  let data: Record<string, any> = {}
  try {
    data = yaml.parse(fs.readFileSync(file, 'utf-8')) || {}
  } catch {
    return false
  }

  /** allowBuilds: pnpm 10.26+/11+/12+ 用户显式设为 false 的不覆盖 */
  const allowBuilds: Record<string, boolean> = (
    data.allowBuilds && typeof data.allowBuilds === 'object' && !Array.isArray(data.allowBuilds)
  )
    ? { ...data.allowBuilds }
    : {}

  list.forEach((pkg) => {
    if (allowBuilds[pkg] !== false) allowBuilds[pkg] = true
  })

  const major = getPnpmMajorVersion()
  if (major <= 10) {
    /** onlyBuiltDependencies: pnpm 10.x 专用 */
    const onlyBuilt: string[] = Array.isArray(data.onlyBuiltDependencies) ? data.onlyBuiltDependencies : []
    data.onlyBuiltDependencies = Array.from(new Set([...list, ...onlyBuilt]))
  }

  data.allowBuilds = allowBuilds
  fs.writeFileSync(file, yaml.stringify(data), 'utf-8')
  return true
}
