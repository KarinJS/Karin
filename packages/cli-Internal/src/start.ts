import fs from 'fs'
import path from 'node:path'
import { MAIN } from './main'
import { pathToFileURL } from 'node:url'
import { execSync } from 'node:child_process'

/**
 * @description 启动项目
 */
export const start = async () => {
  const indexPath = path.join(process.cwd(), MAIN)
  if (
    !fs.existsSync(indexPath) ||
    !fs.existsSync(path.join(process.cwd(), '.npmrc')) ||
    !fs.readFileSync(path.join(process.cwd(), '.npmrc'))?.includes('public-hoist-pattern[]=*sqlite3*')
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
