import { getPlugins } from '@/plugin/system/list'
import {
  createSuccessResponse,
  createServerErrorResponse,
} from '@/server/utils/response'
import { getLocalCommitHash, getRemoteCommitHash } from '@/utils/git'

import type { RequestHandler } from 'express'
import type { PluginAdminListResponse } from '@/types/server/plugins'

/**
 * @webui 插件管理 获取插件列表Api
 */
export const getPluginListPluginAdmin: RequestHandler = async (_, res) => {
  try {
    const list: PluginAdminListResponse[] = []
    const git = await getPlugins('git', true)
    const app = await getPlugins('app', true)

    await Promise.all(git.map(async plugin => {
      try {
        /** 本地最新提交哈希 */
        const version = await getLocalCommitHash(plugin.dir, { short: true })
        /** 远程最新提交哈希 */
        const latestHash = await getRemoteCommitHash(plugin.dir, { short: true })
        list.push({
          type: 'git',
          id: plugin.pkgData.name,
          name: plugin.name,
          version,
          latestHash,
        })
      } catch (error) {
        logger.error(error)
      }
    }))

    app.forEach(plugin => {
      list.push({
        type: 'app',
        id: plugin.pkgData.name,
        name: plugin.name,
        version: '',
        latestHash: '',
      })
    })

    createSuccessResponse(res, list)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}
