import path from 'node:path'
import { getPlugins } from '@/plugin/system/list'
import {
  createSuccessResponse,
  createServerErrorResponse,
} from '@/server/utils/response'
import { getLocalCommitHash, getRemoteCommitHash } from '@/utils/git'

import type { RequestHandler } from 'express'
import type { LoadedPluginCacheList } from '@/types/plugin/cache'
import type { PluginAdminListResponse } from '@/types/server/plugins'
import { cache } from '@/plugin/system'

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
      plugin.apps.forEach(v => {
        list.push({
          type: 'app',
          id: plugin.name,
          name: `${plugin.name}/${path.basename(v)}`,
          version: '',
          latestHash: '',
        })
      })
    })

    createSuccessResponse(res, list)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * @webui 获取已加载命令插件缓存信息列表
 */
export const getLoadedCommandPluginCacheList: RequestHandler = async (_, res) => {
  try {
    const list: LoadedPluginCacheList[] = []
    /**
     * @example
     * ```ts
     * {
     *  'karin-plugin-example': {
     *    'index.ts': ['fnc'],
     *  }
     * }
     * ```
     */
    const map: Record<string, Record<string, { pluginName: string; method: string }[]>> = {}

    cache.command.forEach(plugin => {
      const { name: key } = plugin.pkg
      if (!map[key]) {
        map[key] = {}
      }

      if (!map[key][plugin.file.basename]) {
        map[key][plugin.file.basename] = []
      }

      map[key][plugin.file.basename].push({
        pluginName: plugin.file.name,
        method: plugin.file.method,
      })
    })

    Object.keys(map).forEach(key => {
      const files: LoadedPluginCacheList['files'] = []
      Object.keys(map[key]).forEach(file => {
        files.push({
          fileName: file,
          command: map[key][file],
        })
      })
      list.push({
        name: key,
        files,
      })
    })

    createSuccessResponse(res, list)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}
