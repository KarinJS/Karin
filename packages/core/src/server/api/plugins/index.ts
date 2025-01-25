import { router } from '@/server/api/router'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'
import type { RequestHandler } from 'express'
import type { GetPluginType } from '@/types/plugin'
import type { KarinBase } from '@/types/server/plugins'
import { testGithub } from './test-url'
import { fetchPluginList } from './plugin-source'
import { handleAppPlugin, handleGitPlugin, handleNpmPlugin } from './plugin-handler'
import { getPlugins } from '@/plugin/list'

/**
 * 获取在线插件列表
 */
const getOnlinePluginList: RequestHandler = async (_req, res) => {
  try {
    const list: KarinBase<'all'> = []
    const [plugins, createUrl] = await Promise.all([fetchPluginList(), testGithub()])

    for (const plugin of plugins.plugins) {
      let result = null

      switch (plugin.type) {
        case 'npm':
          result = await handleNpmPlugin(plugin)
          break
        case 'git':
          result = await handleGitPlugin(plugin, createUrl)
          break
        case 'app':
          result = await handleAppPlugin(plugin)
          break
      }

      if (result) {
        list.push(result)
      }
    }

    createSuccessResponse(res, list)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 获取已安装插件列表详情
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

router.post('/plugin/index', getOnlinePluginList)
router.post('/plugin/list', getPluginListRouter)
