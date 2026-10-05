import fs from 'fs'
import path from 'node:path'
import { MAIN } from './main'
import { pathToFileURL } from 'node:url'
import { execSync } from 'node:child_process'
import { isWorkspaceCompatible, readYamlFile } from './workspace'

/**
 * 检查 pnpm-workspace.yaml 是否已包含 pnpm v10~v12 的兼容配置
 * 旧版本项目缺少 allowBuilds 或旧白名单未迁移时会触发重新初始化以补全配置
 */
const isCompatibleWorkspace = (): boolean => {
  const file = path.join(process.cwd(), 'pnpm-workspace.yaml')
  if (!fs.existsSync(file)) return false
  return isWorkspaceCompatible(readYamlFile(file))
}

/**
 * @description 启动项目
 */
export const start = async () => {
  const indexPath = path.join(process.cwd(), MAIN)
  if (
    !fs.existsSync(indexPath) ||
    !fs.existsSync(path.join(process.cwd(), '.npmrc')) ||
    !fs.readFileSync(path.join(process.cwd(), '.npmrc'))?.includes('public-hoist-pattern[]=*sqlite3*') ||
    !isCompatibleWorkspace()
  ) {
    console.log('检查到项目升级到 1.8.0+ 版本，正在初始化项目...')
    execSync('npx karin init', {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
  }

  await import(pathToFileURL(indexPath).toString())
}

/**
 * @description 开发模式
 */
export const dev = async () => {
  process.env.NODE_ENV = 'development'
  await start()
}
