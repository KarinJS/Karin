import './config'
import './admin'
import './install'
import path from 'node:path'
import { testGithub } from './test-url'
import { getPlugins } from '@/plugin/list'
import { router } from '@/server/api/router'
import { fetchPluginList } from './source'
import { handleAppPlugin, handleGitPlugin, handleNpmPlugin, handlePluginFile } from './file'
import { createServerErrorResponse, createSuccessResponse } from '@/server/utils/response'
import type { RequestHandler } from 'express'
import type { GetPluginType } from '@/types/plugin'
import type { PluginLists } from '@/types/server/plugins'
import { getAuthorAvatar, getNpmInfo, getGitInfo } from './info'

/**
 * 获取在线插件列表
 */
const getOnlinePluginList: RequestHandler = async (_req, res) => {
  try {
    const [list, createUrl, localPlugins] = await Promise.all([fetchPluginList(), testGithub(), getPlugins('all', true, true)])

    const pluginMap = new Map<string, PluginLists>()

    /** 先处理本地插件 */
    for (const plugin of localPlugins) {
      const { version, description, homepage, time, license, author } = plugin?.pkgData || {}
      pluginMap.set(plugin.name, {
        installed: true,
        version: str(version),
        type: plugin.type,
        name: plugin.name,
        description: str(description),
        home: str(homepage),
        time: str(time),
        license: {
          name: str(license),
          url: '',
        },
        author: [
          {
            name: str(author),
            home: '',
            avatar: ''
          },
        ],
        repo: [],
        downloads: 0,
        size: 0,
        updated: '',
      })
    }

    /** 处理在线插件，与本地插件信息融合 */
    for (const plugin of list.plugins) {
      let info = null

      switch (plugin.type) {
        case 'npm':
          info = await handleNpmPlugin(plugin)
          break
        case 'git':
          info = await handleGitPlugin(plugin, createUrl)
          break
        case 'app':
          info = await handleAppPlugin(plugin)
          break
      }

      if (!info) continue
      const existingPlugin = pluginMap.get(info.name)
      if (existingPlugin) {
        /** 如果插件已存在，合并信息，保留本地版本和安装状态 */
        pluginMap.set(info.name, {
          ...info,
          installed: existingPlugin.installed,
          version: existingPlugin.installed ? existingPlugin.version : info.version,
          latestVersion: info.version,
          downloads: existingPlugin.downloads,
          size: existingPlugin.size,
          updated: existingPlugin.updated,
        })
        continue
      }

      /** 如果插件不存在，直接添加 */
      pluginMap.set(info.name, {
        ...info,
        latestVersion: info.version,
        downloads: 0,
        size: 0,
        updated: '',
      })
    }

    /** 获取下载量 */
    await Promise.all(
      Array.from(pluginMap.values()).map(async (plugin) => {
        // 处理作者头像
        await Promise.all(
          plugin.author.map(async (item) => {
            item.avatar = getAuthorAvatar(item.home, item.avatar)
          })
        )

        // 获取插件信息
        if (plugin.type === 'npm') {
          const info = await getNpmInfo(plugin.name)
          plugin.downloads = info.downloads
          plugin.size = info.size
          plugin.updated = info.updated
          return
        }

        if (plugin.type === 'git' && !plugin.installed) {
          const repoUrl = plugin.repo[0]?.url || ''
          if (repoUrl) {
            const info = await getGitInfo(repoUrl)
            plugin.downloads = info.downloads
            plugin.updated = info.updated
          }
        }
      })
    )

    /** 排序 */
    const result = Array.from(pluginMap.values())

    result.sort((a, b) => {
      if (a.installed && !b.installed) return -1
      if (!a.installed && b.installed) return 1
      return a.name.localeCompare(b.name)
    })

    createSuccessResponse(res, result)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 兜底
 * @param text 文本
 */
const str = (text: string) => text || '-'

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

/**
 * 获取应用插件的应用列表
 */
const getPluginApps: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body
    const list = await getPlugins('app', true)
    const apps = list.filter((item) => item.name === name)
    /** 只需要文件名称和后缀 */
    const result: string[] = []
    apps.forEach((app) => {
      app.apps.forEach((file) => result.push(path.basename(file)))
    })
    createSuccessResponse(res, result)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

router.post('/plugin/index', getOnlinePluginList)
router.post('/plugin/list', getPluginListRouter)
router.post('/plugin/apps', getPluginApps)
router.post('/plugin/file', handlePluginFile)
