import fs from 'node:fs'
import path from 'node:path'

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

/**
 * 序列化 allowBuilds 键值对
 * @param deps - 依赖列表
 */
const serializeAllowBuilds = (deps: string[]) => {
  return deps.map(dep => `  '${dep}': true`).join('\n')
}

/**
 * 生成 pnpm v9 ~ v12 通用兼容的 pnpm-workspace.yaml 内容
 *
 * - pnpm 9 无法识别的配置项会被忽略 不影响原有行为
 * - pnpm 10 依赖 onlyBuiltDependencies 白名单才会执行构建脚本
 * - pnpm 10.26+/11+ 改用 allowBuilds 并默认开启 strictDepBuilds (存在未声明的构建脚本会直接报错)
 * - pnpm 11+ 默认 minimumReleaseAge=1440 (发布未满24h的版本无法安装)、blockExoticSubdeps=true (子依赖禁止git/tarball来源)
 * 注意：不写入 packages 键 避免项目被识别为工作区导致 pnpm add 需要追加 -w 参数
 * packages 由后续 karin init 合并写入
 *
 * @param pnpmMajor - 当前pnpm主版本号 传-1或未传时视为无法确定 (会同时写入 onlyBuiltDependencies)
 */
export const buildWorkspaceYaml = (pnpmMajor = -1): string => {
  const lines: string[] = [
    '# Karin pnpm v9 ~ v12 兼容配置 旧版本pnpm会忽略无法识别的配置项',
    '# pnpm 10 起默认不执行依赖构建脚本 allowBuilds/onlyBuiltDependencies 为构建脚本白名单',
    'lockfile: false',
  ]

  lines.push(
    'publicHoistPattern:',
    "  - '*sqlite3*'",
    "  - '*express*'"
  )

  /** pnpm 10.x 专用 10.26 起被 allowBuilds 取代 11+ 不再读取 */
  if (pnpmMajor <= 10) {
    lines.push('onlyBuiltDependencies:')
    BUILD_DEPENDENCIES.forEach(dep => lines.push(`  - '${dep}'`))
  }

  lines.push('allowBuilds:')
  BUILD_DEPENDENCIES.forEach(dep => lines.push(serializeAllowBuilds([dep])))
  lines.push(
    '# pnpm 11+ 默认开启 存在未声明的构建脚本会直接中断安装 关闭以保持与 pnpm 9 一致',
    'strictDepBuilds: false',
    '# pnpm 11+ 默认1440分钟 发布未满24h的版本无法安装 置0保持与 pnpm 9 一致',
    'minimumReleaseAge: 0',
    '# pnpm 10.26+/11+ 默认开启 会阻止子依赖使用git/tarball来源 关闭以保持与 pnpm 9 一致',
    'blockExoticSubdeps: false'
  )

  return lines.join('\n') + '\n'
}

/**
 * 在目标目录写入 pnpm-workspace.yaml (已存在则跳过)
 * @param dir - 目标目录
 * @param pnpmMajor - 当前pnpm主版本号
 * @returns 是否写入
 */
export const writeWorkspaceConfig = (dir: string, pnpmMajor = -1): boolean => {
  const file = path.join(dir, 'pnpm-workspace.yaml')
  if (fs.existsSync(file)) return false
  fs.writeFileSync(file, buildWorkspaceYaml(pnpmMajor))
  return true
}

/**
 * 清理 pnpm init 产生的版本托管字段
 *
 * pnpm 10+ 的 pnpm init 会写入 devEngines (托管node版本)
 * pnpm 12 的 pnpm init 还会写入 packageManager (锁定pnpm版本)
 * 二者都会让 pnpm 自动下载/切换运行时版本 与 karin 的部署方式冲突
 * @param dir - 项目目录
 * @returns 是否有修改
 */
export const cleanPkgAfterPnpmInit = (dir: string): boolean => {
  const file = path.join(dir, 'package.json')
  try {
    const pkg = JSON.parse(fs.readFileSync(file, 'utf-8'))
    let dirty = false
    if (pkg.devEngines) {
      delete pkg.devEngines
      dirty = true
    }
    if (typeof pkg.packageManager === 'string' && pkg.packageManager.startsWith('pnpm@')) {
      delete pkg.packageManager
      dirty = true
    }
    if (dirty) fs.writeFileSync(file, JSON.stringify(pkg, null, 2))
    return dirty
  } catch {
    return false
  }
}
