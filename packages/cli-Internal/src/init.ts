/**
 * 初始化项目说明
 * 1. @karinjs 目录
 * 2. 创建.npmrc
 * 3. 创建.pnpmfile.cjs
 * 4. 创建pnpm-workspace.yaml
 * 5. 标准化package.json
 * 6. 非开发环境创建plugins/karin-plugin-example
 * 7. 创建基本配置文件
 */

import fs from 'node:fs'
import path from 'node:path'
import { URL, fileURLToPath } from 'node:url'

/**
 * 判断是否处于插件开发环境
 * @param dir 目标目录
 */
const getIsDev = (dir: string) => {
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  const list = [
    'src',
    'tsconfig.json',
    'eslint.config.mjs',
    'eslint.config.js',
    '.prettierrc',
    'vite.config.ts',
    'tsup.config.ts',
  ]

  return list.some(item => fs.existsSync(path.join(dir, item)))
}

/**
 * 递归删除目录
 * @param dirPath - 要删除的目录路径
 */
const removeDirectory = (dirPath: string) => {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true })
  }
}

/**
 * 创建基本目录
 * @param isDev - 是否处于开发环境
 * @param dir - 目标目录
 */
const createDir = (isDev: boolean, dir: string) => {
  const list = [
    'logs',
    'config',
    'data',
    'resource',
    'temp/console',
    'temp/html',
  ]

  list.forEach(item => {
    const dirPath = path.join(dir, '@karinjs', item)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
  })

  if (isDev) return

  const example = path.join(dir, 'plugins', 'karin-plugin-example')
  if (!fs.existsSync(example)) {
    fs.mkdirSync(example, { recursive: true })
  }
}

/**
 * 创建或更新 .npmrc 文件
 * @param dir - 目标目录
 */
const npmrc = (dir: string) => {
  // TODO: 后续改为远程api拉取 动态更新
  const list = [
    'public-hoist-pattern[]=*sqlite3*',
    'public-hoist-pattern[]=*express*',
    'sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/sqlite3',
    'node_sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/sqlite3',
    'better_sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/better-sqlite3',
    'sass_binary_site=https://registry.npmmirror.com/-/binary/node-sass',
    'sharp_binary_host=https://registry.npmmirror.com/-/binary/sharp',
    'sharp_libvips_binary_host=https://registry.npmmirror.com/-/binary/sharp-libvips',
    'canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas',
    '# 19以下版本',
    'puppeteer_download_host=https://registry.npmmirror.com/mirrors',
    '# 20以上版本',
    'PUPPETEER_DOWNLOAD_BASE_URL = https://registry.npmmirror.com/binaries/chrome-for-testing',
  ]

  const npmrc = path.join(dir, '.npmrc')
  if (!fs.existsSync(npmrc)) {
    fs.writeFileSync(npmrc, list.join('\n'))
    return
  }

  const data = fs.readFileSync(npmrc, 'utf-8')
  const newEntries = list.filter(item => {
    const key = item.split('=')[0]
    return !data.includes(key)
  })

  if (newEntries.length > 0) {
    fs.appendFileSync(npmrc, '\n' + newEntries.join('\n'))
  }
}

/**
 * 创建 .pnpmfile.cjs 文件
 * @param isDev - 是否处于开发环境
 * @param dir - 目标目录
 */
const pnpmfile = (isDev: boolean, dir: string) => {
  if (isDev) return

  const pnpmfile = path.join(dir, '.pnpmfile.cjs')
  if (fs.existsSync(pnpmfile)) return

  const content = [
    '// 清空对等依赖中的node-karin',
    'function readPackage (pkg, context) {',
    "  if (pkg?.['peerDependencies']?.['node-karin'] && pkg['peerDependencies']['node-karin'] !== 'file:./lib') {",
    "    delete pkg['peerDependencies']['node-karin']",
    '  }',
    '  return pkg',
    '}',
    'module.exports = {',
    '  hooks: {',
    '    readPackage',
    '  },',
    '}',
  ].join('\n')

  fs.writeFileSync(pnpmfile, content)
}

/**
 * 创建或更新 .env 文件
 * @param dir - 目标目录
 */
const createOrUpdateEnv = (dir: string) => {
  /** 生成随机6位字母key */
  const generateRandomKey = (type: 'http' | 'ws') => {
    if (type === 'http' && process.env.HTTP_AUTH_KEY) {
      return process.env.HTTP_AUTH_KEY
    }
    if (type === 'ws' && process.env.WS_SERVER_AUTH_KEY) {
      return process.env.WS_SERVER_AUTH_KEY
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    return Array.from({ length: 6 }, () => {
      return chars.charAt(Math.floor(Math.random() * chars.length))
    }).join('')
  }

  const envData = [
    '# 是否启用HTTP',
    'HTTP_ENABLE=true',
    '# HTTP监听端口',
    'HTTP_PORT=7777',
    '# HTTP监听地址',
    'HTTP_HOST=0.0.0.0',
    '# HTTP鉴权秘钥 仅用于karin自身Api',
    `HTTP_AUTH_KEY=${generateRandomKey('http')}`,
    '# ws_server鉴权秘钥',
    `WS_SERVER_AUTH_KEY=${generateRandomKey('ws')}`,
    '\n',
    '# 是否启用Redis 关闭后将使用内部虚拟Redis',
    'REDIS_ENABLE=true',
    '# 重启是否调用pm2 如果不调用则会直接关机 此配置适合有进程守护的程序',
    'PM2_RESTART=true',
    '\n',
    '# 日志等级',
    'LOG_LEVEL=info',
    '# 日志保留天数',
    'LOG_DAYS_TO_KEEP=7',
    '# 日志文件最大大小 如果此项大于0则启用日志分割',
    'LOG_MAX_LOG_SIZE=0',
    '# logger.fnc颜色',
    'LOG_FNC_COLOR="#E1D919"',
    '# 日志实时Api最多支持同时连接数',
    'LOG_API_MAX_CONNECTIONS=5',
    '\n',
    '# ffmpeg',
    'FFMPEG_PATH=',
    '# ffprobe',
    'FFPROBE_PATH=',
    '# ffplay',
    'FFPLAY_PATH=',
    'RUNTIME=node',
    'NODE_ENV=production',
    'TSX_WATCH=false',
  ]

  const env = path.join(dir, '.env')
  if (!fs.existsSync(env)) {
    fs.writeFileSync(env, envData.join('\n'))
    return
  }

  const value = fs.readFileSync(env, 'utf-8')
  const newEntries = envData.filter(item => {
    if (item.includes('#')) return false
    const key = item.split('=')[0]
    return !value.includes(key)
  })

  if (newEntries.length > 0) {
    fs.appendFileSync(env, '\n' + newEntries.join('\n'))
  }
}

/**
 * 创建 pnpm-workspace.yaml 文件
 * @param isDev - 是否处于开发环境
 * @param dir - 目标目录
 */
const createWorkspace = (isDev: boolean, dir: string) => {
  if (isDev) return

  const workspace = path.join(dir, 'pnpm-workspace.yaml')
  if (fs.existsSync(workspace)) return

  const content = "packages:\n  - 'plugins/*'\n"
  fs.writeFileSync(workspace, content)
}

/**
 * 生成配置文件
 * @param dir - 目标目录
 */
const createConfigFile = (dir: string) => {
  /* @vite-ignore */
  const pkgDir = fileURLToPath(new URL('../..', import.meta.url))
  const defCfg = path.join(pkgDir, 'default', 'config')
  /** 读取默认目录下的所有json文件 遍历复制到目标目录 */
  const files = fs.readdirSync(defCfg)
  files.forEach(file => {
    /** 忽略非json文件 */
    if (!file.endsWith('.json')) return
    /** 默认配置文件路径 */
    const filePath = path.join(defCfg, file)
    /** 目标配置目录 */
    const targetPath = path.join(dir, '@karinjs', 'config')
    /** 目标配置文件路径 */
    const targetFile = path.join(targetPath, file)
    /** 如果目标配置文件不存在，则复制默认配置文件 */
    if (!fs.existsSync(targetFile)) {
      fs.copyFileSync(filePath, targetFile)
      return
    }

    /** 如果已存在 则合并一下配置 */
    const defData = fs.readFileSync(filePath, 'utf-8')
    const targetData = fs.readFileSync(targetFile, 'utf-8')
    const mergedData = { ...JSON.parse(defData), ...JSON.parse(targetData) }
    if (file.includes('pm2.json')) {
      mergedData.apps[0].script = 'index.mjs'
    }

    fs.writeFileSync(targetFile, JSON.stringify(mergedData, null, 2))
  })
}

/**
 * 修改package.json
 * @param isDev - 是否处于开发环境
 * @param dir - 目标目录
 */
const modifyPackageJson = (isDev: boolean, dir: string) => {
  const pkgDir = path.join(dir, 'package.json')
  const pkg = (() => {
    try {
      return JSON.parse(fs.readFileSync(pkgDir, 'utf-8'))
    } catch {
      return {}
    }
  })()

  // 永恒是猪 scripts都为空
  if (!pkg.scripts) pkg.scripts = {}
  if (!pkg.name) pkg.name = 'karin-project'
  if (!pkg.version) pkg.version = '1.0.0'
  pkg.type = 'module'

  if (!isDev) {
    if (!pkg.scripts.ki) pkg.scripts.ki = 'ki'
    if (!pkg.scripts.karin) pkg.scripts.karin = 'ki'
    if (!pkg.scripts.app) pkg.scripts.app = 'node index.mjs'
    if (!pkg.scripts.start) pkg.scripts.start = 'node index.mjs'
    if (!pkg.scripts.pm2) pkg.scripts.pm2 = 'pm2 start @karinjs/config/pm2.json'
    if (!pkg.scripts.stop) pkg.scripts.stop = 'ki stop'
    if (!pkg.scripts.rs) pkg.scripts.rs = 'ki rs'
    if (!pkg.scripts.log) pkg.scripts.log = 'ki log'
    if (!pkg.scripts.up) pkg.scripts.up = 'ki up'
  }

  if (!isDev && !pkg?.dependencies?.['node-karin']) {
    if (!pkg.dependencies) pkg.dependencies = {}
    pkg.dependencies['node-karin'] = 'latest'
  }

  /** pnpm10无力适配... */
  if (pkg.pnpm) delete pkg.pnpm
  fs.writeFileSync(pkgDir, JSON.stringify(pkg, null, 2))
  return pkg
}

/**
 * 生成入口文件
 * @param isDev - 是否处于开发环境
 * @param dir - 目标目录
 */
const createEntryFile = (isDev: boolean, dir: string) => {
  /** 处于开发环境 */
  if (isDev) {
    if (fs.existsSync(`${dir}/src`)) {
      fs.writeFileSync(path.join(dir, 'src', 'app.ts'), 'import(\'node-karin/start\')')
      return
    }
  }

  const entryFile = path.join(dir, 'index.mjs')
  if (fs.existsSync(entryFile)) return
  fs.writeFileSync(entryFile, `(() => {
  import('node-karin/start')
})()
`)
}

/**
 * 如果强制更新，删除指定的文件和目录
 * @param dir - 目标目录
 */
const removeFilesIfForced = (dir: string) => {
  // 删除 @karinjs 目录
  removeDirectory(path.join(dir, '@karinjs'))

  // 删除 .pnpmfile.cjs 文件
  const pnpmfilePath = path.join(dir, '.pnpmfile.cjs')
  if (fs.existsSync(pnpmfilePath)) {
    fs.unlinkSync(pnpmfilePath)
  }

  // 删除入口文件 index.mjs
  const entryFilePath = path.join(dir, 'index.mjs')
  if (fs.existsSync(entryFilePath)) {
    fs.unlinkSync(entryFilePath)
  }

  // 删除 .env 文件
  const envPath = path.join(dir, '.env')
  if (fs.existsSync(envPath)) {
    fs.unlinkSync(envPath)
  }
}

/**
 * 入口函数
 * @param force - 是否强制初始化
 * @param dev - 是否开发模式
 */
export const init = async (force?: boolean) => {
  const dir = process.env.INIT_CWD || process.cwd()
  const isDev = getIsDev(dir)

  // 如果是强制更新，先删除指定的文件和目录
  if (force) {
    removeFilesIfForced(dir)
  }

  createDir(isDev, dir)
  createWorkspace(isDev, dir)
  createConfigFile(dir)
  modifyPackageJson(isDev, dir)
  npmrc(dir)
  pnpmfile(isDev, dir)
  createEntryFile(isDev, dir)
  createOrUpdateEnv(dir)

  if (process.env.KARIN_CLI) {
    console.log('[cli] 初始化完成 请使用 pnpm app 启动项目')
    process.exit(0)
  }
}
