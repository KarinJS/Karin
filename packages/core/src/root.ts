// tips: 此文件需要保证轻量，不要引入多余的包。
import path from 'path'
import { fileURLToPath } from 'url'

/** 当前文件的绝对路径 cjs */
const filename = fileURLToPath(import.meta.url)
/** 以node-karin为根目录的绝对路径 */
export const karinDir = Object.freeze(path.join(filename, '../..').replace(/\\/g, '/'))
/** node-karin */
export const karinMain = Object.freeze(path.join(karinDir, 'dist', 'index.js'))
/** 插件跟目录 */
export const pluginDir = Object.freeze(path.join(process.cwd(), 'plugins'))

/** 是否处于node_modules中 */
export const isPkg = Object.freeze(filename.includes('node_modules'))
/** 默认config目录 `npm/default/config` */
export const defaultConfigPath = Object.freeze(path.join(karinDir, 'default', 'config'))
/** 默认view目录 `npm/default/view` */
export const defaultViewPath = Object.freeze(path.join(karinDir, 'default', 'view'))
/** 注释目录 `npm/default/comment` */
export const commentPath = Object.freeze(path.join(karinDir, 'default', 'comment'))

/** 配置根目录 `@karinjs` */
export const basePath = Object.freeze(path.join(process.cwd(), '@karinjs'))
/** config目录 `@karinjs/config` */
export const configPath = Object.freeze(path.join(basePath, 'config'))
/** data目录 `@karinjs/data` */
export const dataPath = Object.freeze(path.join(basePath, 'data'))
/** 临时文件存储 `@karinjs/temp` */
export const tempPath = Object.freeze(path.join(basePath, 'temp'))
/** resource目录 `@karinjs/resource` */
export const resourcePath = Object.freeze(path.join(basePath, 'resource'))
/** db根目录 `@karinjs/data/db` */
export const dbPath = Object.freeze(path.join(dataPath, 'db'))
/** 伪redis sqlite3目录 `@karinjs/data/db/redis-sqlite3` */
export const redisSqlite3Path = Object.freeze(path.join(dbPath, 'redis-sqlite3'))
/** kv数据库目录 `@karinjs/data/db/kv` */
export const kvPath = Object.freeze(path.join(dbPath, 'kv'))
/** logs目录 `@karinjs/logs` */
export const logsPath = Object.freeze(path.join(basePath, 'logs'))
/** html目录 `@karinjs/temp/html` */
export const htmlPath = Object.freeze(path.join(tempPath, 'html'))
/** pm2配置路径 `@karinjs/config/pm2.yaml` */
export const pm2Path = Object.freeze(path.join(configPath, 'pm2.yaml'))
/** console适配器目录 `@karinjs/temp/console` */
export const consolePath = Object.freeze(path.join(tempPath, 'console'))
/** 沙盒数据目录 `@karinjs/data/sandbox` */
export const sandboxDataPath = Object.freeze(path.join(dataPath, 'sandbox'))
/** 沙盒临时数据目录 `@karinjs/temp/sandbox` */
export const sandboxTempPath = Object.freeze(path.join(tempPath, 'sandbox'))

export default {
  karinDir,
  karinMain,
  pluginDir,
  isPkg,
  defaultConfigPath,
  defaultViewPath,
  commentPath,
  basePath,
  configPath,
  dataPath,
  tempPath,
  resourcePath,
  dbPath,
  logsPath,
  htmlPath,
  pm2Path,
  consolePath,
  sandboxDataPath,
  sandboxTempPath,
}
