import fs, { createReadStream, createWriteStream } from 'node:fs'
import path from 'node:path'
import { execSync } from './exec'
import { spawn } from 'node:child_process'

import { pipeline } from 'node:stream/promises'

const pm2Dir = path.join(process.cwd(), '@karinjs/config/pm2.json')

/**
 * 读取PM2配置文件
 * @returns 配置对象，若文件不存在则返回null
 */
const readPm2Config = (): any | null => {
  if (!fs.existsSync(pm2Dir)) {
    console.log(`[pm2] 配置文件不存在 请检查 ${pm2Dir} 是否存在`)
    return null
  }
  return JSON.parse(fs.readFileSync(pm2Dir, 'utf-8'))
}

/**
 * 确保日志目录存在
 * @param dirPath 目录路径
 * @returns 目录是否已创建成功
 */
const ensureLogDir = (dirPath: string): boolean => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`[pm2] 创建日志目录: ${dirPath}`)
    return true
  }
  return false
}

/**
 * 将字节大小转换为可读格式
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的大小字符串
 */
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * 按大小切割日志文件
 * @param logPath 日志文件路径
 * @param logDirPath 日志目录路径
 * @param logType 日志类型
 * @param maxSizeMB 最大日志大小(MB)
 * @returns 是否进行了切割
 */
const rotateLogFile = async (
  logPath: string,
  logDirPath: string,
  logType: string,
  maxSizeMB: number
): Promise<boolean> => {
  if (!fs.existsSync(logPath)) return false

  const stats = fs.statSync(logPath)
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  const minKeepSizeBytes = 2 * 1024 * 1024 // 无论如何至少保留2MB内容

  console.log(`[pm2] 检查${logType}日志文件: ${logPath}`)
  console.log(`[pm2] 当前大小: ${formatBytes(stats.size)}, 切割阈值: ${formatBytes(maxSizeBytes)}`)

  /** 如果文件大小小于最大限制，不处理 */
  if (stats.size < maxSizeBytes) {
    console.log(`[pm2] ${logType}日志文件大小未超过阈值，无需切割\n`)
    return false
  }

  const fileName = path.basename(logPath)
  const timestamp = Date.now()
  const archivedName = `${fileName}.${timestamp}`
  const archivedPath = path.join(logDirPath, archivedName)

  console.log(`\n[pm2] 准备切割${logType}日志文件:`)
  console.log(`[pm2] - 源文件: ${logPath}`)
  console.log(`[pm2] - 归档文件名称: ${archivedName}`)
  console.log(`[pm2] - 归档文件路径: ${archivedPath}`)

  try {
    /** 将当前日志内容复制到归档文件 */
    const sourceStream = createReadStream(logPath)
    const destStream = createWriteStream(archivedPath)
    await pipeline(sourceStream, destStream)

    /** 保留原始文件的访问权限 */
    const originalMode = fs.statSync(logPath).mode

    /** 计算需要保留的内容大小 */
    const fileSize = stats.size
    const keepSize = Math.max(
      minKeepSizeBytes,
      Math.floor(fileSize / 5) // 保留原大小的1/5或至少2MB
    )

    console.log(`[pm2] 将保留${formatBytes(keepSize)}内容到新的日志文件中`)

    const keepBuffer = Buffer.alloc(keepSize)

    const fd = fs.openSync(logPath, 'r')
    fs.readSync(fd, keepBuffer, 0, keepSize, fileSize - keepSize)
    fs.closeSync(fd)

    /** 使用保留的内容重写日志文件 */
    fs.writeFileSync(logPath, keepBuffer)
    fs.chmodSync(logPath, originalMode)

    console.log(`[pm2] 日志已按大小切割: ${logType} => ${archivedName}`)
    console.log(`[pm2] 原始文件大小: ${formatBytes(stats.size)}, 归档后保留: ${formatBytes(keepSize)}`)
    console.log(`[pm2] 归档文件完整路径: ${archivedPath}`)
    return true
  } catch (err) {
    console.error(`[pm2] 切割日志失败: ${logType}`, err)
    return false
  }
}

/**
 * 清理过期日志文件
 * @param errorLogBaseName 错误日志文件基本名称
 * @param outLogBaseName 输出日志文件基本名称
 * @param logDirPath 日志目录路径
 * @param maxLogDays 保留日志的最大天数，0表示不清理
 */
const cleanupLogFiles = (
  errorLogBaseName: string,
  outLogBaseName: string,
  logDirPath: string,
  maxLogDays: number
): void => {
  if (maxLogDays <= 0) {
    console.log(`[pm2] 日志保留天数设置为${maxLogDays}，将保留所有日志文件`)
    return
  }

  const files = fs.readdirSync(logDirPath)

  /** 按照日志类型分别清理 */
  const cleanupByLogType = (baseName: string, logType: string): void => {
    /** 构建正则表达式，匹配以baseName开头，后面跟着时间戳的文件 */
    const filePattern = new RegExp(`^${baseName.replace(/\./g, '\\.')}\\.(\\d+)$`)

    const logFiles = files
      .filter(file => filePattern.test(file))
      .map(file => {
        const match = file.match(filePattern)
        return {
          file,
          timestamp: match ? parseInt(match[1], 10) : 0,
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp) /** 按时间戳降序排序 */

    /** 删除超出保留天数的文件 */
    const now = Date.now()
    const maxAgeMs = maxLogDays * 24 * 60 * 60 * 1000

    let deletedCount = 0
    logFiles.forEach(item => {
      if (now - item.timestamp > maxAgeMs) {
        const filePath = path.join(logDirPath, item.file)
        fs.unlinkSync(filePath)
        const fileDate = new Date(item.timestamp).toISOString().split('T')[0]
        deletedCount++
        console.log(`[pm2] 删除过期${logType}日志: ${item.file} (${fileDate})`)
      }
    })

    if (deletedCount > 0) {
      console.log(`[pm2] 共删除${deletedCount}个超过${maxLogDays}天的${logType}日志文件`)
    }
  }

  /** 清理两种类型的日志 */
  cleanupByLogType(errorLogBaseName, '错误')
  cleanupByLogType(outLogBaseName, '输出')
}

/**
 * 异步切割PM2日志文件
 * 根据大小分别切割输出日志和错误日志
 * @returns Promise对象
 */
const rotateLogs = async (): Promise<void> => {
  const config = readPm2Config()
  if (!config) return

  try {
    /** 最大保留天数 */
    let maxLogDays = Number(config.maxLogDays) ?? 14
    /** 最大错误日志大小 */
    let maxErrorLogSize = Number(config.maxErrorLogSize)
    /** 最大输出日志大小 */
    let maxOutLogSize = Number(config.maxOutLogSize)

    /** 默认14天，0表示不清理保留所有日志 */
    if (isNaN(maxLogDays) || maxLogDays < 0) maxLogDays = 14
    /** 默认50MB */
    if (isNaN(maxErrorLogSize) || maxErrorLogSize < 1) maxErrorLogSize = 50
    /** 默认50MB */
    if (isNaN(maxOutLogSize) || maxOutLogSize < 1) maxOutLogSize = 50

    if (maxLogDays === 0) {
      console.log('[pm2] 日志保留策略: 保留所有日志，不进行清理')
    } else {
      console.log(`[pm2] 日志保留策略: 最长${maxLogDays}天`)
    }

    /** 获取日志文件路径 */
    const errorLogPath = path.resolve(process.cwd(), config.apps[0].error_file)
    const outLogPath = path.resolve(process.cwd(), config.apps[0].out_file)

    const logDirPath = path.dirname(errorLogPath)
    /** 确保日志目录存在 */
    if (ensureLogDir(logDirPath)) return

    /** 获取日志文件基本名称 */
    const errorLogBaseName = path.basename(errorLogPath)
    const outLogBaseName = path.basename(outLogPath)

    /** 切割两种日志文件 */
    await rotateLogFile(outLogPath, logDirPath, '输出', maxOutLogSize)
    await rotateLogFile(errorLogPath, logDirPath, '错误', maxErrorLogSize)

    /** 清理过期日志文件 */
    cleanupLogFiles(errorLogBaseName, outLogBaseName, logDirPath, maxLogDays)
  } catch (error) {
    console.error('[pm2] 日志切割过程中发生错误:', error)
  }
}

/**
 * 升级脚本路径
 * @param config PM2配置对象
 */
const upgradeScriptPath = (config: any): void => {
  const script = 'index.mjs'
  if (config.apps[0].script !== script) {
    config.apps[0].script = script
    fs.writeFileSync(pm2Dir, JSON.stringify(config, null, 2))
  }
}

/**
 * 检查初始化
 */
const checkInitialization = (): void => {
  const script = 'index.mjs'
  if (!fs.existsSync(script)) {
    console.log('正在升级到1.8.0版本...')
    execSync('npx ki init', { cwd: process.cwd() })
    console.log('升级成功 正在启动pm2服务...')
  }
}

/**
 * PM2启动
 */
const start = async (): Promise<void> => {
  /** 启动前切割日志 */
  rotateLogs()

  console.log('[pm2] 启动中...')

  const config = readPm2Config()
  if (!config) {
    process.exit(1)
  }

  /** 升级旧版本入口 */
  upgradeScriptPath(config)

  /** 检查初始化 */
  checkInitialization()

  const { error } = execSync(`pm2 start ${pm2Dir}`, { cwd: process.cwd() })
  if (error) {
    console.log('[pm2] 启动失败')
    console.log(error)
    process.exit(1)
  }

  console.log('[pm2] 启动成功')
  console.log('[pm2] 重启服务: pnpm rs')
  console.log('[pm2] 查看日志: pnpm log')
  console.log('[pm2] 停止服务: pnpm stop')
  console.log('[pm2] 查看监控: pm2 monit')
  console.log('[pm2] 查看列表: pm2 list')
  process.exit(0)
}

/**
 * 查看PM2日志
 */
const log = async (): Promise<void> => {
  /** 查看日志前切割日志 */
  rotateLogs()

  const config = readPm2Config()
  if (!config) {
    console.log('[pm2] 如果是新项目，请先前台启动生成配置文件: pnpm app')
    process.exit(1)
  }

  try {
    /** 前缀 */
    const prefix = process.platform === 'win32' ? 'pm2.cmd' : 'pm2'
    spawn(prefix, ['logs', config.apps[0].name, '--lines', config.lines || 1000], { stdio: 'inherit', shell: true })
  } catch (error) {
    console.error('[pm2] 发生未知错误: 请检查pm2是否安装 【npm install -g pm2】')
    console.error(error)
    process.exit(1)
  }
}

/**
 * 停止PM2服务
 */
const stop = async (): Promise<void> => {
  /** 停止前切割日志 */
  rotateLogs()

  const config = readPm2Config()
  if (!config) {
    console.log('[pm2] 如果是新项目，请先前台启动生成配置文件: pnpm app')
    process.exit(1)
  }

  execSync(`pm2 stop ${config.apps[0].name}`, { cwd: process.cwd() })
  console.log('[pm2] 停止成功')
  process.exit(0)
}

/**
 * 重启PM2服务
 * @param force 是否强制重启
 */
const restart = async (force?: boolean): Promise<void> => {
  /** 重启前切割日志 */
  rotateLogs()
  try {
    const forceRestart = () => {
      const appName = readPm2Config()?.apps?.[0]?.name || 'karin'
      execSync(`pm2 delete ${appName}`, { cwd: process.cwd() })
      execSync(`pm2 start ${pm2Dir}`, { cwd: process.cwd() })
      console.log('[pm2] 重启成功')
    }

    console.log('[pm2] 重启中...')

    if (!fs.existsSync(pm2Dir)) {
      console.log(`[pm2] 配置文件不存在 请检查 ${pm2Dir} 是否存在`)
      console.log('[pm2] 如果是新项目，请先前台启动生成配置文件: pnpm app')
      process.exit(1)
    }

    if (force) {
      forceRestart()
      process.exit(0)
    }

    const appName = readPm2Config()?.apps?.[0]?.name || 'karin'
    if (!appName) {
      process.exit(1)
    }

    /** 先尝试直接重启 */
    execSync(`pm2 restart ${appName}`, { cwd: process.cwd() })
    console.log('[pm2] 重启成功')
    process.exit(0)
  } catch (error) {
    console.log('[pm2] 尝试直接重启失败 尝试删除服务并重新启动')
    const appName = readPm2Config()?.apps?.[0]?.name || 'karin'
    execSync(`pm2 delete ${appName}`, { cwd: process.cwd() })
    execSync(`pm2 start ${pm2Dir}`, { cwd: process.cwd() })
    console.log('[pm2] 重启成功')
    process.exit(0)
  }
}

export const pm2 = {
  start,
  log,
  stop,
  restart,
}
