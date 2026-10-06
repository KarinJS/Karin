import fs from 'node:fs'
import path from 'node:path'
/** 与 karin init 共用同一份实现 (打包时内联) 避免两处维护构建依赖列表与兼容配置 */
import { applyKarinWorkspace, updateYamlFile } from '../../../cli-Internal/src/workspace'
import type { Version, WorkspaceData } from '../../../cli-Internal/src/workspace'

/**
 * 在首次 pnpm add 之前写入 pnpm-workspace.yaml 已存在时与原有配置合并
 *
 * - 内容与 karin init 生成的一致：构建脚本白名单、pnpm 11+ 的 strictDepBuilds/minimumReleaseAge/blockExoticSubdeps 兼容项
 * - 始终包含 packages 字段：pnpm 10.5 以下缺少该字段时任何命令都会报错 因此后续 pnpm add 需要追加 -w
 * - 用户已有的配置 (包括显式设为 false 的 allowBuilds 条目) 保持不变
 * @param dir - 项目目录
 * @param version - 当前pnpm版本 未知时传null
 * @param isDev - 是否为插件开发项目 生产项目会加入 plugins/*
 */
export const prepareWorkspace = (dir: string, version: Version | null, isDev = false) => {
  const file = path.join(dir, 'pnpm-workspace.yaml')
  return updateYamlFile<WorkspaceData>(file, data => applyKarinWorkspace(data, { isDev, version }))
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
