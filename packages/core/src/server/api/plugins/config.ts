import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
import { isDev, isTsx } from '@/env'
import { pathToFileURL } from 'node:url'
import { router } from '@/server/api/router'
import { requireFileSync } from '@/utils/fs/require'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'

import type { Apps } from '@/types/plugin'
import type { RequestHandler } from 'express'
import type { PkgData } from '@/utils/fs/pkg'
import type { GetConfigResponse, LocalApiResponse } from '@/types/server/local'

interface BaseConfig {
  /** 插件类型 */
  type: Apps,
  /** 插件名称 */
  name: string,
}

/**
 * 从package.json中获取web配置路径
 * @param pkg package.json内容
 * @param baseDir 基础目录
 * @returns web配置路径或null
 */
const getWebConfigPathFromPkg = (pkg: PkgData, baseDir: string): string | null => {
  if (!pkg.karin) return null

  if (isTsx() && pkg.karin['ts-web']) {
    return path.join(baseDir, pkg.karin['ts-web'])
  }

  if (pkg.karin.web) return path.join(baseDir, pkg.karin.web)
  return null
}

/**
 * 获取NPM插件配置路径
 * @param name 插件名称
 * @returns 配置路径或null
 */
const getNpmPluginConfigPath = (name: string): string | null => {
  const dir = path.join(process.cwd(), 'node_modules', name)
  if (fs.existsSync(dir)) {
    const pkg = requireFileSync<PkgData>(path.join(dir, 'package.json'))
    const configPath = getWebConfigPathFromPkg(pkg, dir)
    if (configPath) return configPath
  }

  /** 开发环境检查根目录 */
  if (isDev()) {
    const rootPkgPath = path.join(process.cwd(), 'package.json')
    const pkg = requireFileSync<PkgData>(rootPkgPath)
    if (pkg?.name === name) {
      return getWebConfigPathFromPkg(pkg, process.cwd())
    }
  }

  return null
}

/**
 * 获取本地插件配置路径
 * @param name 插件名称
 * @returns 配置路径或null
 */
const getLocalPluginConfigPath = (name: string): string | null => {
  const pluginDir = path.join(process.cwd(), 'plugins', name)
  if (fs.existsSync(pluginDir)) {
    const pkg = requireFileSync<PkgData>(path.join(pluginDir, 'package.json'))
    return getWebConfigPathFromPkg(pkg, pluginDir)
  }

  const pkg = requireFileSync<PkgData>(path.join(process.cwd(), 'package.json'))
  return getWebConfigPathFromPkg(pkg, process.cwd()) || null
}

/**
 * 获取插件配置路径
 * @param options 插件配置
 * @returns 配置路径
 */
const getConfigPath = (options: BaseConfig): string | null => {
  switch (options.type) {
    case 'npm':
      return getNpmPluginConfigPath(options.name)
    case 'git':
      return getLocalPluginConfigPath(options.name)
    default:
      return null
  }
}

/**
 * 加载插件配置
 * @param configPath 配置路径
 */
const loadConfig = async (configPath: string) => {
  /** 如果处于开发环境，则使用动态导入 */
  const result = await import(
    `${pathToFileURL(configPath).toString()}${isDev() ? '?t=' + Date.now() : ''}`
  ) as {
    default: {
      info: LocalApiResponse
      components: () => any
      save: (config: Record<string, any>) =>
        { success: boolean, message: string } |
        Promise<{ success: boolean, message: string }>
    }
  }
  return result.default
}

/**
 * 传入type id 返回web.config配置
 * @param type 插件类型
 * @param id 插件id
 * @param fnc 配置文件不符合要求时回调
 * @returns web.config配置
 */
export const getWebConfig = async (type: Apps, id: string, fnc?: () => void) => {
  /** 只支持git npm */
  if (!['git', 'npm'].includes(type)) {
    return null
  }

  const webConfig = getConfigPath({ type, name: id })

  if (!webConfig) {
    return null
  }

  /** 获取文件名称 不包含后缀 */
  const baseName = path.basename(webConfig, path.extname(webConfig))
  if (baseName !== 'web.config') {
    return null
  }

  return await loadConfig(webConfig)
}

/**
 * 获取插件配置 不存在则返回null
 * @param req 请求
 * @param res 响应
 */
const getConfig: RequestHandler = async (req, res) => {
  const options = req.body as BaseConfig
  if (!options.type || !options.name) {
    createServerErrorResponse(res, '参数错误')
    return
  }

  const config = await getWebConfig(options.type, options.name, () => {
    logger.error(`[plugin] 插件${options.name}的web配置文件名称不正确: 需要以 web.config 命名`)
    createSuccessResponse(res, null)
  })

  if (!config) {
    return createServerErrorResponse(res, '参数错误')
  }

  const list: Record<string, any>[] = []
  let result = config.components()
  result = util.types.isPromise(result) ? await result : result

  result.forEach((item: any) => {
    if (typeof item?.toJSON === 'function') {
      list.push(item.toJSON())
    } else {
      if (typeof item === 'object' && item !== null) {
        list.push(item)
      }
    }
  })

  const data: GetConfigResponse = {
    options: list as GetConfigResponse['options'],
    info: config.info
  }

  createSuccessResponse(res, data)
}

/**

 * 保存插件配置
 */
const saveConfig: RequestHandler = async (req, res) => {
  const options = req.body as BaseConfig & { config: Record<string, any> }
  const configPath = getConfigPath(options)
  if (!configPath) return createServerErrorResponse(res, '参数错误')

  const { save } = await loadConfig(configPath)
  const result = save(options.config)
  const response = util.types.isPromise(result) ? await result : result
  createSuccessResponse(res, response || { success: true, message: '没有返回值哦 φ(>ω<*) ' })
}

/**
 * 判断插件是否存在配置
 */
const isConfigExist: RequestHandler = async (req, res) => {
  const options = req.body as BaseConfig
  const configPath = getConfigPath(options)
  createSuccessResponse(res, typeof configPath === 'string')
}

router.post('/plugin/config/get', getConfig)
router.post('/plugin/config/save', saveConfig)
router.post('/plugin/config/is-exist', isConfigExist)
