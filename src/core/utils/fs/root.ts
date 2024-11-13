// tips: 此文件需要保证轻量，不要引入多余的包。
import path from 'path'
import { fileURLToPath } from 'url'

/** 当前文件的绝对路径 低版本的node只有url */
const filename = fileURLToPath(import.meta.url)
/** 以node-karin为根目录的绝对路径 */
export const karinDir = Object.freeze(path.join(filename, '../../../../..').replace(/\\/g, '/'))
/** 是否处于node_modules中 */
export const isPkg = Object.freeze(filename.includes('node_modules'))
/** 默认config路径 */
export const defaultConfigPath = Object.freeze(path.join(karinDir, 'default', 'config'))
/** 默认view路径 */
export const defaultViewPath = Object.freeze(path.join(karinDir, 'default', 'view'))

/** 配置根路径 */
export const basePath = Object.freeze(path.join(process.cwd(), '@karinjs'))
/** config路径 */
export const configPath = Object.freeze(path.join(basePath, 'config'))
/** data路径 */
export const dataPath = Object.freeze(path.join(basePath, 'data'))
/** 临时文件存储 */
export const tempPath = Object.freeze(path.join(basePath, 'temp'))
