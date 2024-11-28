// tips: 此文件需要保证轻量，不要引入多余的包。
import path from 'path'
import { fileURLToPath } from 'url'

/** 当前文件的绝对路径 低版本的node只有url */
const filename = fileURLToPath(import.meta.url)
/** 以node-karin为根目录的绝对路径 */
export const karinDir = Object.freeze(path.join(filename, '../../../../..').replace(/\\/g, '/'))
/** 是否处于node_modules中 */
export const isPkg = Object.freeze(filename.includes('node_modules'))
/** 默认config目录 */
export const defaultConfigPath = Object.freeze(path.join(karinDir, 'default', 'config'))
/** 默认view目录 */
export const defaultViewPath = Object.freeze(path.join(karinDir, 'default', 'view'))
/** 注释目录 */
export const commentPath = Object.freeze(path.join(karinDir, 'default', 'comment'))

/** 配置根目录 */
export const basePath = Object.freeze(path.join(process.cwd(), '@karinjs'))
/** config目录 */
export const configPath = Object.freeze(path.join(basePath, 'config'))
/** data目录 */
export const dataPath = Object.freeze(path.join(basePath, 'data'))
/** 临时文件存储 */
export const tempPath = Object.freeze(path.join(basePath, 'temp'))
/** db根目录 */
export const dbPath = Object.freeze(path.join(dataPath, 'db'))
/** level目录 */
export const levelPath = Object.freeze(path.join(dbPath, 'level'))
/** 伪redis save-level目录 */
export const redisLevelPath = Object.freeze(path.join(dbPath, 'redis-level'))
/** logs目录 */
export const logsPath = Object.freeze(path.join(process.cwd(), 'logs'))
/** html目录 */
export const htmlPath = Object.freeze(path.join(tempPath, 'html'))
/** pm2配置路径 */
export const pm2Path = Object.freeze(path.join(configPath, 'pm2.yaml'))
