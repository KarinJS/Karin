import axios from 'axios'
import { getPlugins } from '@/plugin/list'
import { router } from '@/server/api/router'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'

import type { RequestHandler } from 'express'
import type { GetPluginType } from '@/types/plugin'

/** 插件源地址列表 */
const PLUGIN_SOURCES = [
  'https://raw.github.site/KarinJS/files/refs/heads/main/plugins.json',
  'https://raw.github.store/KarinJS/files/refs/heads/main/plugins.json',
  'https://raw.githubusercontent.com/KarinJS/files/refs/heads/main/plugins.json',
  // 讲道理这两个延迟好大啊。。特别是gitcode 一天同步一次 但是他是最快的...
  'https://gitee.com/KarinJS/files/raw/main/plugins.json',
  'https://raw.gitcode.com/karinjs/file/raw/main/plugins.json'
]

interface PluginAuthor {
  name: string
  email: string
  home: string
}

interface PluginRepo {
  type: string
  url: string
}

interface PluginInfo {
  name: string
  package_name: string
  type: string
  description: string
  license: string
  time: string
  author: PluginAuthor[]
  repo: PluginRepo[]
}

interface PluginResponse {
  plugins: PluginInfo[]
}

/**
 * 从多个源获取插件列表
 * @returns 返回最先成功响应的插件列表
 */
const fetchPluginList = async (): Promise<PluginInfo[]> => {
  const requests = PLUGIN_SOURCES.map(url =>
    axios.get<PluginResponse>(url)
      .then(response => {
        console.log(url)
        return response.data.plugins
      })
      .catch((error) => {
        logger.error(error)
        return null
      })
  )

  const results = await Promise.race(requests)
  if (!results) {
    throw new Error('无法从任何源获取插件列表')
  }

  return results
}

/**
 * 获取在线插件列表
 * @description 从多个源获取可用的插件列表，返回最快响应的源的数据
 */
const getOnlinePluginList: RequestHandler = async (_req, res) => {
  try {
    const plugins = await fetchPluginList()
    createSuccessResponse(res, plugins)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

router.post('/plugin/index', getOnlinePluginList)

/**
 * 获取已安装插件列表详情
 * @description 获取插件列表详情，包含插件的基本信息
 */
const getPluginListRouter: RequestHandler = async (req, res) => {
  try {
    const { type = 'all' } = req.query as { type?: GetPluginType }
    const plugins = await getPlugins(type, true)
    createSuccessResponse(res, plugins)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

router.post('/plugin/list', getPluginListRouter)
