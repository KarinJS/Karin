import { store } from './store'

/**
 * @deprecated 此模块已废弃，建议使用 store.pkg.root
 * 以node-karin为根目录的绝对路径
 */
export const karinPathRoot = store.pkg.root

/**
 * @deprecated 此模块已废弃，建议使用 store.pkg.main
 * karin主入口文件路径
 */
export const karinPathMain = store.pkg.main

/**
 * @deprecated 此模块已废弃，建议使用 store.pkg.plugins
 * 插件根目录
 */
export const karinPathPlugins = store.pkg.plugins

/**
 * @deprecated 此模块已废弃，建议使用 store.pkg.isPackaged
 * 是否处于node_modules中
 */
export const isPackaged = store.pkg.isPackaged

/**
 * @deprecated 此模块已废弃，建议使用 store.baseDir
 * 配置根目录 `@karinjs`
 */
export const karinPathBase = store.baseDir

/**
 * @deprecated 此模块已废弃，建议使用 store.core.config
 * config目录 `@karinjs/config`
 */
export const karinPathConfig = store.core.config

/**
 * @deprecated 此模块已废弃，建议使用 store.core.data
 * data目录 `@karinjs/data`
 */
export const karinPathData = store.core.data

/**
 * @deprecated 此模块已废弃，建议使用 store.core.temp
 * 临时文件存储 `@karinjs/temp`
 */
export const karinPathTemp = store.core.temp

/**
 * @deprecated 此模块已废弃，建议使用 store.core.resource
 * resource目录 `@karinjs/resource`
 */
export const karinPathResource = store.core.resource

/**
 * @deprecated 此模块已废弃，建议使用 store.core.db
 * db根目录 `@karinjs/data/db`
 */
export const karinPathDb = store.core.db

/**
 * @deprecated 此模块已废弃，建议使用 store.core.task
 * 任务数据库目录 `@karinjs/data/db/task`
 */
export const karinPathTaskDb = store.core.task

/**
 * @deprecated 此模块已废弃，建议使用 store.core['redis-sqlite']
 * 伪redis sqlite3目录 `@karinjs/data/db/redis-sqlite3`
 */
export const karinPathRedisSqlite3 = store.core['redis-sqlite']

/**
 * @deprecated 此模块已废弃，建议使用 store.core.kv
 * kv数据库目录 `@karinjs/data/db/kv`
 */
export const karinPathKv = store.core.kv

/**
 * @deprecated 此模块已废弃，建议使用 store.core.logs
 * logs目录 `@karinjs/logs`
 */
export const karinPathLogs = store.core.logs

/**
 * @deprecated 此模块已废弃，建议使用 store.core.html
 * html目录 `@karinjs/temp/html`
 */
export const karinPathHtml = store.core.html

/**
 * @deprecated 此模块已废弃，建议使用 `${store.core.config}/pm2.json`
 * pm2配置路径 `@karinjs/config/pm2.json`
 */
export const karinPathPm2Config = `${store.core.config}/pm2.json`

/**
 * @deprecated 此模块已废弃，建议使用 store.core.console
 * console适配器目录 `@karinjs/temp/console`
 */
export const karinPathConsole = store.core.console

/**
 * @deprecated 此模块已废弃，建议使用 store.core.sandbox
 * 沙盒数据目录 `@karinjs/data/sandbox`
 */
export const karinPathSandboxData = store.core.sandbox

/**
 * @deprecated 此模块已废弃，建议使用 store.core.sandboxTemp
 * 沙盒临时数据目录 `@karinjs/temp/sandbox`
 */
export const karinPathSandboxTemp = store.core.sandboxTemp

// 旧版本命名导出 - 向后兼容
/** @deprecated 请使用 store.pkg.root 代替，此模块已废弃 */
export const karinDir = store.pkg.root
/** @deprecated 请使用 store.pkg.main 代替，此模块已废弃 */
export const karinMain = store.pkg.main
/** @deprecated 请使用 store.pkg.plugins 代替，此模块已废弃 */
export const pluginDir = store.pkg.plugins
/** @deprecated 请使用 store.pkg.isPackaged 代替，此模块已废弃 */
export const isPkg = store.pkg.isPackaged
/** @deprecated 请使用 store.baseDir 代替，此模块已废弃 */
export const basePath = store.baseDir
/** @deprecated 请使用 store.core.config 代替，此模块已废弃 */
export const configPath = store.core.config
/** @deprecated 请使用 store.core.data 代替，此模块已废弃 */
export const dataPath = store.core.data
/** @deprecated 请使用 store.core.temp 代替，此模块已废弃 */
export const tempPath = store.core.temp
/** @deprecated 请使用 store.core.resource 代替，此模块已废弃 */
export const resourcePath = store.core.resource
/** @deprecated 请使用 store.core.db 代替，此模块已废弃 */
export const dbPath = store.core.db
/** @deprecated 请使用 store.core['redis-sqlite'] 代替，此模块已废弃 */
export const redisSqlite3Path = store.core['redis-sqlite']
/** @deprecated 请使用 store.core.kv 代替，此模块已废弃 */
export const kvPath = store.core.kv
/** @deprecated 请使用 store.core.logs 代替，此模块已废弃 */
export const logsPath = store.core.logs
/** @deprecated 请使用 store.core.html 代替，此模块已废弃 */
export const htmlPath = store.core.html
/** @deprecated 请使用 `${store.core.config}/pm2.json` 代替，此模块已废弃 */
export const pm2Path = `${store.core.config}/pm2.json`
/** @deprecated 请使用 store.core.console 代替，此模块已废弃 */
export const consolePath = store.core.console
/** @deprecated 请使用 store.core.sandbox 代替，此模块已废弃 */
export const sandboxDataPath = store.core.sandbox
/** @deprecated 请使用 store.core.sandboxTemp 代替，此模块已废弃 */
export const sandboxTempPath = store.core.sandboxTemp
