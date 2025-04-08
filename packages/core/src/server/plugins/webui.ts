import fs from 'node:fs'
import path from 'node:path'
import { exec } from '@/utils/system/exec'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'
import type { RequestHandler } from 'express'

interface PluginInfo {
  name: string
  installed: boolean
  description: string
  version?: string
}

interface VersionCache {
  data: {
    currentVersion: string | null
    availableVersions: string[]
    hasMoreVersions?: boolean
  }
  timestamp: number
}

/** 版本缓存对象，键为插件名，值为缓存数据和时间戳 */
const versionCache: Record<string, VersionCache> = {}
/** 缓存有效期（毫秒） */
const CACHE_TTL = 2 * 60 * 1000 // 2分钟

/**
 * 插件列表
 */
const plugins: PluginInfo[] = [
  {
    name: '@karinjs/node-pty',
    installed: false, // 会在运行时检测并更新
    description: '提供终端功能支持，允许您在WebUI中使用命令行终端。安装此插件后可使用终端功能。',
  },
  {
    name: '@karinjs/plugin-webui-network-monitor',
    installed: false, // 会在运行时检测并更新
    description: '网络监控插件，提供网络流量、连接等监控功能，可视化展示系统网络状态。',
  },
]

/**
 * 安装webui插件
 */
export const installWebui: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return createServerErrorResponse(res, 'name不能为空')
    }

    if (!plugins.some(p => p.name === name)) {
      return createServerErrorResponse(res, '非法插件')
    }

    const workspace = path.join(process.cwd(), 'pnpm-workspace.yaml')
    const isWorkspace = fs.existsSync(workspace)

    const result = await exec(`pnpm install ${name}${isWorkspace ? ' -w' : ''}`)
    return createSuccessResponse(res, {
      status: result.status,
      data: result.status ? '安装成功' : result.error?.message || '安装失败',
    })
  } catch (error) {
    logger.error(`[webui] 安装webui插件失败: ${req.body.name}`)
    logger.error(error)
    return createServerErrorResponse(res, `安装webui插件失败: ${(error as Error).message}`)
  }
}

/**
 * 卸载webui插件
 */
export const uninstallWebui: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return createServerErrorResponse(res, 'name不能为空')
    }

    if (!plugins.some(p => p.name === name)) {
      return createServerErrorResponse(res, '非法插件')
    }

    const result = await exec(`pnpm uninstall ${name}`)
    return createSuccessResponse(res, {
      status: result.status,
      data: result.status ? '卸载成功' : result.error?.message || '卸载失败',
    })
  } catch (error) {
    logger.error(`[webui] 卸载webui插件失败: ${req.body.name}`)
    logger.error(error)
    return createServerErrorResponse(res, `卸载webui插件失败: ${(error as Error).message}`)
  }
}

/**
 * 获取webui插件列表
 */
export const getWebuiPluginList: RequestHandler = async (req, res) => {
  try {
    /**
     * 检查每个插件是否已安装，并获取版本号
     */
    const updatedPlugins = await Promise.all(plugins.map(async plugin => {
      const modulePath = path.join(process.cwd(), 'node_modules', plugin.name)
      const isInstalled = fs.existsSync(modulePath)

      let version
      if (isInstalled) {
        try {
          const pkgPath = path.join(modulePath, 'package.json')
          if (fs.existsSync(pkgPath)) {
            const pkgContent = fs.readFileSync(pkgPath, 'utf-8')
            const pkg = JSON.parse(pkgContent)
            version = pkg.version
          }
        } catch (error) {
          logger.error(`[webui] 读取插件版本失败: ${plugin.name}`)
        }
      }

      return {
        ...plugin,
        installed: isInstalled,
        version,
      }
    }))

    return createSuccessResponse(res, updatedPlugins)
  } catch (error) {
    logger.error('[webui] 获取插件列表失败')
    logger.error(error)
    return createServerErrorResponse(res, `获取插件列表失败: ${(error as Error).message}`)
  }
}

/**
 * 获取WebUI插件可用版本
 */
export const getWebuiPluginVersions: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return createServerErrorResponse(res, 'name不能为空')
    }

    if (!plugins.some(p => p.name === name)) {
      return createServerErrorResponse(res, '非法插件')
    }

    // 检查缓存是否存在且有效
    const now = Date.now()
    const cachedData = versionCache[name]
    if (cachedData && (now - cachedData.timestamp < CACHE_TTL)) {
      logger.debug(`[webui] 使用缓存的版本信息: ${name}`)
      return createSuccessResponse(res, cachedData.data)
    }

    /**
     * 获取当前安装的版本（如果已安装）
     */
    let currentVersion = null
    const pkgPath = path.join(process.cwd(), 'node_modules', name, 'package.json')

    if (fs.existsSync(pkgPath)) {
      try {
        const pkgContent = fs.readFileSync(pkgPath, 'utf-8')
        const pkg = JSON.parse(pkgContent)
        currentVersion = pkg.version
      } catch (error) {
        logger.error(`[webui] 读取插件版本失败: ${name}`)
      }
    }

    /**
     * 从npm获取可用版本
     */
    logger.info(`[webui] 获取插件 ${name} 的版本信息`)
    const result = await exec(`npm view ${name} versions --json`)
    if (!result.status) {
      return createServerErrorResponse(res, `获取版本信息失败: ${result.error?.message}`)
    }

    try {
      let versions = JSON.parse(result.stdout)
      versions = Array.isArray(versions) ? versions : [versions]

      /** 反转数组，让最新版本排在前面 */
      versions.reverse()
      /** 限制返回的版本数量为20个 */
      const limitedVersions = versions.slice(0, 20)

      const responseData = {
        currentVersion,
        availableVersions: limitedVersions,
        hasMoreVersions: versions.length > 20,
      }

      // 更新缓存
      versionCache[name] = {
        data: responseData,
        timestamp: now,
      }

      return createSuccessResponse(res, responseData)
    } catch (error) {
      return createServerErrorResponse(res, `解析版本信息失败: ${(error as Error).message}`)
    }
  } catch (error) {
    logger.error(`[webui] 获取插件版本失败: ${req.body.name}`)
    logger.error(error)
    return createServerErrorResponse(res, `获取插件版本失败: ${(error as Error).message}`)
  }
}

/**
 * 更新WebUI插件到指定版本
 */
export const updateWebuiPluginVersion: RequestHandler = async (req, res) => {
  try {
    const { name, version } = req.body
    if (!name || !version) {
      return createServerErrorResponse(res, 'name和version不能为空')
    }

    if (!plugins.some(p => p.name === name)) {
      return createServerErrorResponse(res, '非法插件')
    }

    const workspace = path.join(process.cwd(), 'pnpm-workspace.yaml')
    const isWorkspace = fs.existsSync(workspace)

    const result = await exec(`pnpm install ${name}@${version}${isWorkspace ? ' -w' : ''}`)
    return createSuccessResponse(res, {
      status: result.status,
      data: result.status ? '更新成功' : result.error?.message || '更新失败',
    })
  } catch (error) {
    logger.error(`[webui] 更新插件版本失败: ${req.body.name}@${req.body.version}`)
    logger.error(error)
    return createServerErrorResponse(res, `更新插件版本失败: ${(error as Error).message}`)
  }
}
