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
import {
  getHash,
  updatePkg,
  checkPkgUpdate,
  updateGitPlugin,
  checkGitPluginUpdate,
} from '@/utils/system/update'
import { getAuthorAvatar, getNpmInfo, getGitInfo } from './info'
import { getPluginListCache, setPluginListCache, paginatePlugins } from './cache'
import type { RequestHandler } from 'express'
import type { GetPluginType } from '@/types/plugin'
import type { PluginLists, PluginUpdateInfo } from '@/types/server/plugins'

/**
 * 获取完整的插件列表
 */
const getFullPluginList = async () => {
  // 并发获取基础数据
  const [list, createUrl, localPlugins] = await Promise.all([
    fetchPluginList(),
    testGithub(),
    getPlugins('all', true, true)
  ])

  const pluginMap = new Map<string, PluginLists>()

  // 并发处理本地插件
  await Promise.all(localPlugins.map(async (plugin) => {
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
  }))

  // 并发处理在线插件
  await Promise.all(list.plugins.map(async (plugin) => {
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

    if (!info) return

    const existingPlugin = pluginMap.get(info.name)
    if (existingPlugin) {
      pluginMap.set(info.name, {
        ...info,
        installed: existingPlugin.installed,
        version: existingPlugin.installed ? existingPlugin.version : info.version,
        latestVersion: info.version,
        downloads: existingPlugin.downloads,
        size: existingPlugin.size,
        updated: existingPlugin.updated,
      })
      return
    }

    pluginMap.set(info.name, {
      ...info,
      latestVersion: info.version,
      downloads: 0,
      size: 0,
      updated: '',
    })
  }))

  // 并发获取下载量和作者信息
  await Promise.all(
    Array.from(pluginMap.values()).map(async (plugin) => {
      await Promise.all([
        // 并发处理作者头像
        Promise.all(
          plugin.author.map(async (item) => {
            item.avatar = getAuthorAvatar(item.home, item.avatar)
          })
        ),
        // 并发获取插件信息
        (async () => {
          if (plugin.type === 'npm') {
            const info = await getNpmInfo(plugin.name)
            plugin.downloads = info.downloads
            plugin.size = info.size
            plugin.updated = info.updated
          } else if (plugin.type === 'git' && !plugin.installed) {
            const repoUrl = plugin.repo[0]?.url || ''
            if (repoUrl) {
              const info = await getGitInfo(repoUrl)
              plugin.downloads = info.downloads
              plugin.updated = info.updated
            }
          }
        })()
      ])
    })
  )

  /** 排序 */
  const result = Array.from(pluginMap.values())
  result.sort((a, b) => {
    if (a.installed && !b.installed) return -1
    if (!a.installed && b.installed) return 1
    return a.name.localeCompare(b.name)
  })

  return result
}

/**
 * 获取在线插件列表
 */
const getOnlinePluginList: RequestHandler = async (req, res) => {
  try {
    const { page = 1, pageSize = 16, refresh = false } = req.body as { page: number; pageSize: number; refresh?: boolean }

    let plugins: PluginLists[] | null = null

    // 如果不是强制刷新，尝试从缓存获取
    if (!refresh) {
      plugins = await getPluginListCache()
    }

    // 如果缓存不存在或强制刷新，则重新获取数据
    if (!plugins) {
      plugins = await getFullPluginList()
      // 设置缓存
      await setPluginListCache(plugins)
    }

    // 分页处理
    const paginatedPlugins = paginatePlugins(plugins, page, pageSize)

    createSuccessResponse(res, {
      list: paginatedPlugins,
      total: plugins.length,
      page,
      pageSize
    })
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
    const plugins = await getPlugins(type, true, true)
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
    const list = await getPlugins('app', true, true)
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

/**
 * 检查 node-karin 更新状态
 */
const checkNodeKarinUpdate = async (): Promise<PluginUpdateInfo | null> => {
  try {
    const result = await checkPkgUpdate('node-karin')
    return {
      name: 'node-karin',
      type: 'npm',
      currentVersion: result.status !== 'error' ? result.local : '',
      hasUpdate: result.status === 'yes',
      ...(result.status === 'yes' ? { latestVersion: result.remote } : {}),
      version: result.status !== 'error' ? result.local : '',
      installed: true,
      description: '',
      home: '',
      time: '',
      license: { name: 'MIT', url: '' },
      author: [{ name: '', home: '', avatar: '' }],
      repo: [],
      downloads: 0,
      size: 0,
      updated: ''
    }
  } catch (error) {
    logger.error('检查 node-karin 更新失败:', error)
    return null
  }
}

/**
 * 获取可更新的插件列表
 */
const getUpdatablePlugins: RequestHandler = async (_req, res) => {
  try {
    // 并发获取 node-karin 和其他插件信息
    const [nodeKarinInfo, plugins] = await Promise.all([
      checkNodeKarinUpdate(),
      getPlugins('all', true, true)
    ])

    const pluginInfos: PluginUpdateInfo[] = nodeKarinInfo ? [nodeKarinInfo] : []

    // 并发处理所有插件的更新检查
    const pluginUpdates = await Promise.all(
      plugins.map(async (plugin) => {
        if (plugin.type === 'app') return null

        let pluginInfo: Partial<PluginUpdateInfo> = {
          ...plugin,
          hasUpdate: false
        }

        if (plugin.type === 'npm') {
          const result = await checkPkgUpdate(plugin.name)
          if (result.status === 'yes') {
            pluginInfo = {
              ...pluginInfo,
              currentVersion: result.local,
              hasUpdate: true,
              latestVersion: result.remote
            }
          } else if (result.status === 'no') {
            pluginInfo = {
              ...pluginInfo,
              currentVersion: result.local,
              hasUpdate: false
            }
          } else {
            logger.error(`检查 ${plugin.name} 更新失败: ${result.error.message}`)
          }
        } else if (plugin.type === 'git') {
          const [hash, updateResult] = await Promise.all([
            getHash(`./plugins/${plugin.name}`),
            checkGitPluginUpdate(`./plugins/${plugin.name}`)
          ])

          pluginInfo = {
            ...pluginInfo,
            currentHash: hash,
            hasUpdate: updateResult.status === 'yes',
            ...(updateResult.status === 'yes'
              ? { updateLog: updateResult.data, updateCount: updateResult.count }
              : {})
          }
        }

        return pluginInfo as PluginUpdateInfo
      })
    )

    pluginInfos.push(...pluginUpdates.filter((info): info is PluginUpdateInfo => info !== null))
    createSuccessResponse(res, pluginInfos)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 批量更新插件
 */
const batchUpdatePlugins: RequestHandler = async (req, res) => {
  try {
    const { plugins } = req.body as { plugins: string[] }
    const list = await getPlugins('all', true, true)

    // 并发处理所有插件的更新
    const results = await Promise.all(
      plugins.map(async (name) => {
        const plugin = list.find(p => p.name === name)
        if (!plugin) {
          return { name, status: 'failed', message: '插件不存在' }
        }

        if (plugin.type === 'npm') {
          const result = await updatePkg(name)
          return {
            name,
            status: result.status,
            message: result.data,
            ...(result.status === 'ok'
              ? { currentVersion: result.local, latestVersion: result.remote }
              : {})
          }
        } else if (plugin.type === 'git') {
          const result = await updateGitPlugin(`./plugins/${name}`)
          return {
            name,
            status: result.status,
            message: result.data,
            ...(result.status === 'ok'
              ? { commit: result.commit }
              : {})
          }
        }

        return { name, status: 'failed', message: '不支持的插件类型' }
      })
    )

    createSuccessResponse(res, results)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

router.post('/plugin/index', getOnlinePluginList)
router.post('/plugin/list', getPluginListRouter)
router.post('/plugin/apps', getPluginApps)
router.post('/plugin/file', handlePluginFile)
router.post('/plugin/updates', getUpdatablePlugins)
router.post('/plugin/update/batch', batchUpdatePlugins)
