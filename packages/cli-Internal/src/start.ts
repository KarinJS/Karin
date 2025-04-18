import path from 'node:path'
import { MAIN } from './main'
import { pathToFileURL } from 'node:url'

/**
 * @description 启动项目
 */
export const start = async () => {
  const indexPath = path.join(process.cwd(), MAIN)
  await import(pathToFileURL(indexPath).toString())
}

/**
 * @description 开发模式
 */
export const dev = async () => {
  process.env.NODE_ENV = 'development'
  await start()
}
