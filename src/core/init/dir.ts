import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
/** 获取当前npm包的根目录 */
export const karinDir = path.resolve(filename, '../../../..').replace(/\/$/, '')

/** 当前是否处于npm包环境 否则代表处于开发环境 */
export const isPkg = karinDir.includes('node_modules')
