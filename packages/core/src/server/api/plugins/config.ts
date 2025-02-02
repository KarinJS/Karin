import fs from 'node:fs'
import path from 'node:path'
import { isDev } from '@/env'
import { pathToFileURL } from 'node:url'
import { router } from '@/server/api/router'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'

import type { Apps } from '@/types/plugin'
import type { RequestHandler } from 'express'

const WEB_CONFIG_NAME = 'web.config.js'

interface BaseConfig {
  /** 插件类型 */
  type: Apps,
  /** 插件名称 */
  name: string,
}

/**
 * 获取插件配置路径
 */
const getConfigPath = (options: BaseConfig) => {
  if (options.type === 'npm') {
    const configPath = path.join(process.cwd(), 'node_modules', options.name, WEB_CONFIG_NAME)
    if (!fs.existsSync(configPath)) {
      return null
    }
    return configPath
  }

  /**
    * 2种情况
    * 1. 在plugins下
    * 2. 在根目录
    */
  let configPath = path.join(process.cwd(), 'plugins', options.name, WEB_CONFIG_NAME)
  if (fs.existsSync(configPath)) return configPath

  configPath = path.join(process.cwd(), WEB_CONFIG_NAME)
  if (!fs.existsSync(configPath)) return null

  return configPath
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
      info: Record<string, any>
      components: () => any
      save: (config: Record<string, any>) => void
    }
  }
  return result.default
}

/**
 * 获取插件配置 不存在则返回null
 * @param req 请求
 * @param res 响应
 */
const getConfig: RequestHandler = async (req, res) => {
  const options = req.body as BaseConfig

  /** 只支持git npm */
  if (!['git', 'npm'].includes(options.type)) {
    createServerErrorResponse(res, '不支持的插件类型')
    return
  }

  const configPath = getConfigPath(options)
  if (!configPath) {
    createSuccessResponse(res, null)
    return
  }

  const { components } = await loadConfig(configPath)
  createSuccessResponse(res, components())
}

/**
 * 保存插件配置
 */
const saveConfig: RequestHandler = async (req, res) => {
  const options = req.body as BaseConfig & { config: Record<string, any> }
  const configPath = getConfigPath(options)
  if (!configPath) return

  const { save } = await loadConfig(configPath)
  save(options.config)
  createSuccessResponse(res, null)
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
