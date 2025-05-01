import { Link } from '@heroui/link'
import { Chip } from '@heroui/chip'
import { Avatar } from '@heroui/avatar'
import { FaUser } from 'react-icons/fa6'
import { Tooltip } from '@heroui/tooltip'
import { BadgeCheck } from 'lucide-react'
import { Card, CardBody } from '@heroui/card'
import { useState, useEffect } from 'react'
import { formatTimeAgo, formatNumber } from '@/lib/utils'
import { MarketPluginInstallButton } from './MarketPluginInstallButton'
import { InstalledPluginButton } from '@/components/plugin/installed_plugin_button'
import { IoRefreshOutline, IoDownloadOutline, IoSync } from 'react-icons/io5'
import { getPackageDownloads, getPackageInfo } from './npmjs'

import type { FC } from 'react'
import type { PluginMarketResponse } from 'node-karin'

/**
 * 缓存配置
 */
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000 // 缓存有效期：24小时
const LOCAL_STORAGE_PREFIX = 'plugin_npm_cache_'

/**
 * 缓存类型定义
 */
interface CacheData<T> {
  timestamp: number
  data: T
}

/**
 * 从localStorage获取缓存数据
 * @param key 缓存键
 * @returns 缓存数据或undefined
 */
const getCache = <T,> (key: string): CacheData<T> | undefined => {
  try {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`)
    if (cached) {
      const data = JSON.parse(cached) as CacheData<T>
      if (Date.now() - data.timestamp <= CACHE_EXPIRATION) {
        return data
      }
    }
  } catch (error) {
    console.error('[getCache] 获取缓存数据失败:', error)
  }
  return undefined
}

/**
 * 保存数据到localStorage缓存
 * @param key 缓存键
 * @param data 要缓存的数据
 */
const setCache = <T,> (key: string, data: T): void => {
  try {
    const cacheData: CacheData<T> = {
      timestamp: Date.now(),
      data,
    }
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, JSON.stringify(cacheData))
  } catch (error) {
    console.error('[setCache] 保存缓存数据失败:', error)
  }
}

/**
 * 卡片安装图标组件
 * @param installed - 是否已安装
 * @param onClick - 点击事件
 * @returns 返回卡片安装图标组件
 */
const IsInstallIcon: FC<{
  installed: boolean
  onClick?: () => void
}> = ({ installed }) => {
  if (installed) {
    return (
      <Tooltip content='已安装'>
        <div className='relative flex items-center justify-center'>
          <div className='w-4 h-4 flex items-center justify-center'>
            <BadgeCheck className='w-full h-full text-success-500/90 dark:text-success-400/90 stroke-[2]' />
          </div>
        </div>
      </Tooltip>
    )
  }
  return <></>
}

/**
 * 插件名称组件
 * @param plugin - 插件信息
 * @returns 返回插件名称组件
 */
const PluginName: FC<{ plugin: PluginMarketResponse }> = ({ plugin }) => {
  if (plugin.local.home) {
    return (
      <Tooltip content='点击访问插件主页'>
        <Link
          href={plugin.local.home}
          isExternal
          className='text-sm font-medium text-default-900 hover:text-primary-500 transition-colors truncate'
        >
          {plugin.local.name}
        </Link>
      </Tooltip>
    )
  }

  return (
    <span className='text-sm font-medium text-default-900 truncate'>{plugin.local.name}</span>
  )
}

/**
 * 插件描述组件
 * @param plugin - 插件信息
 * @returns 返回插件描述组件
 */
const PluginDescription: FC<{ plugin: PluginMarketResponse }> = ({ plugin }) => {
  const getDefaultDescription = (name: string) => {
    const descriptions = [
      '为您的工作流程带来更多可能性和效率提升',
      '简单易用且功能强大的插件，助力开发体验',
      '为项目开发锦上添花的得力助手',
      '提升开发效率的智能工具，让工作更轻松',
      '优化您的开发流程，提供更好的使用体验',
      '为您的项目增添新的维度和可能性',
      '智能且高效的开发工具，助力效率提升',
      '让开发更简单，让创作更有趣',
      '为您的工作流程带来智能化的解决方案',
      '提供专业的开发支持，让工作更高效',
    ]

    /** 种子 */
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    /** 索引 */
    const index = seed % descriptions.length

    /** 将插件名称插入描述中，使其更加个性化 */
    return descriptions[index].replace(/您的|开发/, () => {
      const keywords = ['您的', name, '开发']
      return keywords[seed % keywords.length]
    })
  }

  /**
   * 截断文本并添加省略号
   * @param text - 需要截断的文本
   * @param maxLength - 最大长度
   * @returns 截断后的文本
   */
  const truncateText = (text: string): string => {
    /** 一行大约可显示的字符数 */
    const charsPerLine = 40
    /** 两行最多可显示的字符数 */
    const maxChars = charsPerLine * 2

    if (text.length <= maxChars) {
      return text
    }

    /** 在合适的位置截断，优先在标点符号或空格处 */
    let truncateIndex = maxChars
    /** 从最大长度向前查找适合的截断位置（标点符号或空格） */
    for (let i = maxChars; i > maxChars - 10; i--) {
      if ([',', '.', '，', '。', '；', ';', ' ', '、'].includes(text[i])) {
        truncateIndex = i + 1
        break
      }
    }

    return text.substring(0, truncateIndex) + '...'
  }

  const description = !plugin.local.description
    ? getDefaultDescription(plugin.local.name)
    : plugin.local.description

  /** 处理可能过长的描述 */
  const displayText = truncateText(description)

  return (
    <p className='text-xs text-default-500 line-clamp-2 leading-relaxed' title={plugin.local.description}>
      {displayText}
    </p>
  )
}

/**
 * 卡片头像组件
 * @param plugin - 插件信息
 * @returns 返回卡片头像组件
 */
const CardAvatar: FC<{ plugin: PluginMarketResponse }> = ({ plugin }) => {
  if (!plugin.author) {
    return (
      <Avatar
        isBordered
        size='sm'
        icon={<FaUser />}
        className='bg-default-100 border-white dark:border-default-800'
      />
    )
  }

  return (
    <Tooltip
      content={
        <div className='text-center'>
          <p className='text-sm text-default-600'>{plugin.author.name}</p>
          {
            plugin.author.home &&
            (
              <p className='text-xs text-default-400'>点击访问主页</p>
            )
          }
        </div>
      }
    >
      {plugin.author.home
        ? (
          <Link href={plugin.author.home} isExternal>
            <Avatar
              isBordered
              size='sm'
              src={plugin.author.avatar || 'https://avatar.vercel.sh/ikenxuan'}
              className='bg-default-100 border-white dark:border-default-800'
            />
          </Link>
        )
        : (
          <Avatar
            isBordered
            size='sm'
            src={plugin.author.avatar || 'https://avatar.vercel.sh/ikenxuan'}
            className='bg-default-100 border-white dark:border-default-800'
          />
        )}
    </Tooltip>
  )
}

/**
 * 插件下载量和更新时间组件
 * @param name 插件名称
 * @param isRefreshing 是否正在刷新
 * @returns 返回下载量和更新时间组件
 */
const NpmInfo: FC<{ name: string, isRefreshing: boolean }> = ({ name, isRefreshing }) => {
  const [downloads, setDownloads] = useState<number | null>(null)
  const [updated, setUpdated] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    /**
     * 异步获取 NPM 包信息
     */
    const fetchNpmInfo = async () => {
      if (!name || name === '-') {
        setLoading(false)
        setDownloads(0)
        setUpdated(null)
        return
      }

      setLoading(true)

      const downloadsCacheKey = `${name}_downloads`
      const updatedCacheKey = `${name}_updated`

      const downloadsCache = getCache<number>(downloadsCacheKey)
      const updatedCache = getCache<string>(updatedCacheKey)

      if (!isRefreshing && downloadsCache?.data !== undefined && updatedCache?.data) {
        // 使用缓存
        setDownloads(downloadsCache.data)
        setUpdated(updatedCache.data)
        setLoading(false)
      } else {
        // 强制获取新数据或缓存无效/不存在
        try {
          setError(false)

          // 使用Promise.allSettled确保即使一个请求失败也能继续处理
          const results = await Promise.allSettled([
            getPackageDownloads(name),
            getPackageInfo(name),
          ])

          if (results[0].status === 'fulfilled') {
            setDownloads(results[0].value)
            setCache(downloadsCacheKey, results[0].value)
          } else {
            setDownloads(0)
          }

          if (results[1].status === 'fulfilled') {
            setUpdated(results[1].value.updated)
            if (results[1].value.updated) {
              setCache(updatedCacheKey, results[1].value.updated)
            }
          } else {
            setUpdated(null)
          }

          // 只有当两个请求都失败时才设置错误状态
          if (results[0].status === 'rejected' && results[1].status === 'rejected') {
            setError(true)
          }
        } catch (err) {
          console.error('[NpmInfo] 获取NPM包信息失败:', err)
          setError(true)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchNpmInfo()
  }, [name, isRefreshing]) // 依赖项包括 name 和 isRefreshing

  // 即使错误也显示一个默认的界面，避免完全不显示
  return (
    <div className='flex items-center gap-2 text-xs text-default-400'>
      <div className='flex items-center gap-1'>
        <IoDownloadOutline className='text-base' />
        {loading
          ? (
            <IoSync className='animate-spin text-base' />
          )
          : (
            <span>{error ? '-' : formatNumber(downloads || 0)}</span>
          )}
      </div>
      <span>·</span>
      <div className='flex items-center gap-1'>
        <IoRefreshOutline className='text-base' />
        {loading
          ? (
            <IoSync className='animate-spin text-base' />
          )
          : (
            <span>{error || !updated ? '未知' : formatTimeAgo(updated)}</span>
          )}
      </div>
    </div>
  )
}

/**
 * 插件卡片组件
 * @param plugin - 插件信息
 * @param isRefreshing - 是否正在刷新
 * @param cardClassName - 可选，外部自定义卡片className
 * @returns 返回插件卡片组件
 */
const PluginCard: FC<{
  plugin: PluginMarketResponse,
  isRefreshing: boolean,
  cardClassName?: string
}> = ({ plugin, isRefreshing, cardClassName }) => {
  return (
    <Card
      className={`group w-full h-[140px] flex flex-col overflow-hidden cursor-pointer relative bg-default-50/10 dark:bg-default-100/0 hover:shadow-sm transition-all duration-300 rounded-xl border border-default-200/60 dark:border-default-100/20 ${cardClassName || ''}`}
      isPressable
      radius='sm'
    >
      {/* 优化边框动画效果 */}
      <CardBody className='p-4 flex flex-col h-full relative'>
        {/* 顶部区域 */}
        <div className='flex items-start justify-between gap-3 mb-2'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1.5'>
              <IsInstallIcon installed={plugin.local.installed} />
              <PluginName plugin={plugin} />
            </div>
            <PluginDescription plugin={plugin} />
          </div>

          {/* 作者头像组 */}
          <div className='flex shrink-0'>
            <CardAvatar plugin={plugin} />
          </div>
        </div>

        {/* 底部区域 */}
        <div className='flex items-center justify-between mt-auto'>
          <div className='flex items-center gap-2'>
            <Chip
              variant='flat'
              size='sm'
              className='h-5 px-2 bg-default-100/80 border-small border-default-200/50'
            >
              {plugin.local.version
                ? (
                  <span className='text-xs font-mono'>
                    {`v${plugin.local.version}`}
                  </span>
                )
                : (
                  <span className='text-xs font-mono'>
                    ⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄
                  </span>
                )}

            </Chip>
            {/* 只有NPM类型的插件才显示下载量和更新时间信息 */}
            {plugin.local.type === 'npm' && <NpmInfo name={plugin.local.name} isRefreshing={isRefreshing} />}
          </div>

          <div className='flex items-center gap-2'>
            {
              plugin.local.installed
                ? <InstalledPluginButton plugin={plugin} />
                : <MarketPluginInstallButton plugin={plugin} />
            }
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default PluginCard
