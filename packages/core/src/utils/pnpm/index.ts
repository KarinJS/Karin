import fs from 'node:fs'
import path from 'node:path'
import * as yaml from 'yaml'
import { isPnpmAtLeast } from '@/env'

/**
 * @description pnpm 是否支持 --allow-build 参数 (v10.4+)
 */
export const isPnpmAllowBuildSupported = () => isPnpmAtLeast(10, 4)

/**
 * @description 获取 pnpm-workspace.yaml 路径
 */
const getWorkspaceFile = () => path.join(process.cwd(), 'pnpm-workspace.yaml')

/**
 * @description 获取用户在 allowBuilds 中显式设为 false 的包
 */
const getDeniedBuilds = (): Set<string> => {
  try {
    const file = getWorkspaceFile()
    if (!fs.existsSync(file)) return new Set()
    const allowBuilds = yaml.parse(fs.readFileSync(file, 'utf-8'))?.allowBuilds
    if (!allowBuilds || typeof allowBuilds !== 'object' || Array.isArray(allowBuilds)) return new Set()
    return new Set(Object.keys(allowBuilds).filter(key => allowBuilds[key] === false))
  } catch {
    return new Set()
  }
}

/**
 * @description 备份 pnpm-workspace.yaml
 * @returns 还原函数 将文件恢复为备份时的内容 (备份时不存在则删除)
 */
export const backupWorkspaceFile = () => {
  const file = getWorkspaceFile()
  const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : null

  return () => {
    try {
      if (content === null) {
        if (fs.existsSync(file)) fs.rmSync(file)
        return
      }

      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf-8') !== content) {
        fs.writeFileSync(file, content, 'utf-8')
      }
    } catch (error) {
      logger.error('[pnpm] 还原 pnpm-workspace.yaml 失败', error)
    }
  }
}

/**
 * @description 生成安装时允许执行构建脚本的参数
 *
 * - pnpm 10.4 以下不支持 --allow-build (pnpm 9 默认执行构建脚本 无需声明)
 * - pnpm 会自行将这些包写入 pnpm-workspace.yaml 的白名单 (10.5~10.25 为 onlyBuiltDependencies 10.26+ 为 allowBuilds) 无需手动写入
 * - 跳过用户在 allowBuilds 中显式设为 false 的包 否则 pnpm 会以 ERR_PNPM_OVERRIDING_IGNORED_BUILT_DEPENDENCIES 中断安装
 * - pnpm 在安装失败时同样会写入白名单 安装失败后需调用 restore 还原 避免未安装成功的包被永久授权
 * @param packages - 允许执行构建脚本的包名列表
 */
export const prepareAllowBuild = (packages: unknown) => {
  const list = Array.isArray(packages)
    ? Array.from(new Set(packages.filter((p): p is string => typeof p === 'string').map(p => p.trim()).filter(Boolean)))
    : []

  if (!list.length || !isPnpmAllowBuildSupported()) {
    return { args: [] as string[], restore: () => { } }
  }

  const denied = getDeniedBuilds()
  const args = list.filter(pkg => !denied.has(pkg)).map(pkg => `--allow-build=${pkg}`)
  return { args, restore: args.length ? backupWorkspaceFile() : () => { } }
}
