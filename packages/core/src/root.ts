// tips: 此文件需要保证轻量，不要引入多余的包。
import path from 'path'
import { fileURLToPath } from 'url'

/** 当前文件的绝对路径 cjs */
const filename = fileURLToPath(import.meta.url)

// 新常量定义
/** 以node-karin为根目录的绝对路径 */
export const karinPathRoot = Object.freeze(path.join(filename, '../..').replace(/\\/g, '/'))
/** node-karin主入口文件路径 */
export const karinPathMain = Object.freeze(path.join(karinPathRoot, 'dist', 'index.js'))
/** 插件根目录 */
export const karinPathPlugins = Object.freeze(path.join(process.cwd(), 'plugins'))
/** 是否处于node_modules中 */
export const isPackaged = Object.freeze(filename.includes('node_modules'))

/** 默认config目录 `npm/default/config` */
export const karinPathDefaultConfig = Object.freeze(path.join(karinPathRoot, 'default', 'config'))
/** 默认view目录 `npm/default/view` */
export const karinPathDefaultView = Object.freeze(path.join(karinPathRoot, 'default', 'view'))
/** 注释目录 `npm/default/comment` */
export const karinPathComment = Object.freeze(path.join(karinPathRoot, 'default', 'comment'))

/** 配置根目录 `@karinjs` */
export const karinPathBase = Object.freeze(path.join(process.cwd(), '@karinjs'))
/** config目录 `@karinjs/config` */
export const karinPathConfig = Object.freeze(path.join(karinPathBase, 'config'))
/** data目录 `@karinjs/data` */
export const karinPathData = Object.freeze(path.join(karinPathBase, 'data'))
/** 临时文件存储 `@karinjs/temp` */
export const karinPathTemp = Object.freeze(path.join(karinPathBase, 'temp'))
/** resource目录 `@karinjs/resource` */
export const karinPathResource = Object.freeze(path.join(karinPathBase, 'resource'))
/** db根目录 `@karinjs/data/db` */
export const karinPathDb = Object.freeze(path.join(karinPathData, 'db'))
/** 任务数据库目录 `@karinjs/data/db/task` */
export const karinPathTaskDb = Object.freeze(path.join(karinPathDb, 'task'))
/** 伪redis sqlite3目录 `@karinjs/data/db/redis-sqlite3` */
export const karinPathRedisSqlite3 = Object.freeze(path.join(karinPathDb, 'redis-sqlite3'))
/** kv数据库目录 `@karinjs/data/db/kv` */
export const karinPathKv = Object.freeze(path.join(karinPathDb, 'kv'))
/** logs目录 `@karinjs/logs` */
export const karinPathLogs = Object.freeze(path.join(karinPathBase, 'logs'))
/** html目录 `@karinjs/temp/html` */
export const karinPathHtml = Object.freeze(path.join(karinPathTemp, 'html'))
/** pm2配置路径 `@karinjs/config/pm2.yaml` */
export const karinPathPm2Config = Object.freeze(path.join(karinPathConfig, 'pm2.yaml'))
/** console适配器目录 `@karinjs/temp/console` */
export const karinPathConsole = Object.freeze(path.join(karinPathTemp, 'console'))
/** 沙盒数据目录 `@karinjs/data/sandbox` */
export const karinPathSandboxData = Object.freeze(path.join(karinPathData, 'sandbox'))
/** 沙盒临时数据目录 `@karinjs/temp/sandbox` */
export const karinPathSandboxTemp = Object.freeze(path.join(karinPathTemp, 'sandbox'))

// 保留旧常量，添加deprecated标记
/** @deprecated 请使用 karinPathRoot 代替 */
export const karinDir = karinPathRoot
/** @deprecated 请使用 karinPathMain 代替 */
export const karinMain = karinPathMain
/** @deprecated 请使用 karinPathPlugins 代替 */
export const pluginDir = karinPathPlugins
/** @deprecated 请使用 isPackaged 代替 */
export const isPkg = isPackaged
/** @deprecated 请使用 karinPathDefaultConfig 代替 */
export const defaultConfigPath = karinPathDefaultConfig
/** @deprecated 请使用 karinPathDefaultView 代替 */
export const defaultViewPath = karinPathDefaultView
/** @deprecated 请使用 karinPathComment 代替 */
export const commentPath = karinPathComment
/** @deprecated 请使用 karinPathBase 代替 */
export const basePath = karinPathBase
/** @deprecated 请使用 karinPathConfig 代替 */
export const configPath = karinPathConfig
/** @deprecated 请使用 karinPathData 代替 */
export const dataPath = karinPathData
/** @deprecated 请使用 karinPathTemp 代替 */
export const tempPath = karinPathTemp
/** @deprecated 请使用 karinPathResource 代替 */
export const resourcePath = karinPathResource
/** @deprecated 请使用 karinPathDb 代替 */
export const dbPath = karinPathDb
/** @deprecated 请使用 karinPathRedisSqlite3 代替 */
export const redisSqlite3Path = karinPathRedisSqlite3
/** @deprecated 请使用 karinPathKv 代替 */
export const kvPath = karinPathKv
/** @deprecated 请使用 karinPathLogs 代替 */
export const logsPath = karinPathLogs
/** @deprecated 请使用 karinPathHtml 代替 */
export const htmlPath = karinPathHtml
/** @deprecated 请使用 karinPathPm2Config 代替 */
export const pm2Path = karinPathPm2Config
/** @deprecated 请使用 karinPathConsole 代替 */
export const consolePath = karinPathConsole
/** @deprecated 请使用 karinPathSandboxData 代替 */
export const sandboxDataPath = karinPathSandboxData
/** @deprecated 请使用 karinPathSandboxTemp 代替 */
export const sandboxTempPath = karinPathSandboxTemp

export default {
  // 新常量
  karinPathRoot,
  karinPathMain,
  karinPathPlugins,
  isPackaged,
  karinPathDefaultConfig,
  karinPathDefaultView,
  karinPathComment,
  karinPathBase,
  karinPathConfig,
  karinPathData,
  karinPathTemp,
  karinPathResource,
  karinPathDb,
  karinPathRedisSqlite3,
  karinPathKv,
  karinPathLogs,
  karinPathHtml,
  karinPathPm2Config,
  karinPathConsole,
  karinPathSandboxData,
  karinPathSandboxTemp,
  karinPathTaskDb,

  // 旧常量，保持兼容性
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
  redisSqlite3Path,
  kvPath,
  logsPath,
  htmlPath,
  pm2Path,
  consolePath,
  sandboxDataPath,
  sandboxTempPath,
}
