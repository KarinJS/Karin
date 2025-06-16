import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useRequest } from 'ahooks'
import toast from 'react-hot-toast'
import { getFrontendInstalledPluginListRequest } from '@/request/plugins'
import { Pagination } from '@heroui/pagination'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { Card, CardBody } from '@heroui/card'
import { ScrollShadow } from '@heroui/scroll-shadow'
import PluginCard from './card'
import { IoRefreshOutline } from 'react-icons/io5'
import type { FrontendInstalledPluginListResponse } from 'node-karin'

/**
 * 插件市场页面：顶部大Banner+内容区风格
 * @returns 插件市场主页面组件
 */
const LocalPluginList = () => {
  /** 从URL获取初始页码 */
  const getInitialPage = (): number => {
    const searchParams = new URLSearchParams(location.search)
    const pageParam = searchParams.get('page')
    return pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1
  }

  const [page, setPage] = useState(getInitialPage())
  const [isManualRefresh, setIsManualRefresh] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const refreshStartTimeRef = useRef<number>(0)

  const {
    data: plugins = [],
    error: onlineError,
    loading: onlineLoading,
    refresh: refreshPlugins,
  } = useRequest<FrontendInstalledPluginListResponse[], [boolean]>(
    () => getFrontendInstalledPluginListRequest(isManualRefresh),
    {
      refreshDeps: [isManualRefresh],
      onFinally: () => {
        if (isManualRefresh) {
          const duration = ((Date.now() - refreshStartTimeRef.current) / 1000).toFixed(1)
          if (!onlineError) {
            toast.success(`刷新成功，耗时 ${duration} 秒`, { id: 'refresh-plugins' })
          } else {
            toast.error(`刷新失败: ${onlineError.message}`, { id: 'refresh-plugins' })
          }
        }
        setIsRefreshing(false)
        setIsManualRefresh(false)
      },
    }
  )

  const pageSize = 16

  /** 计算总页数 */
  const totalPages = useMemo(() => Math.ceil(plugins.length / pageSize), [plugins.length, pageSize])

  /** 确保页码不超出范围 */
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages)
    }
  }, [totalPages, page])

  /** 更新URL中的页码参数 */
  useEffect(() => {
    const url = new URL(window.location.href)
    if (page === 1) {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', page.toString())
    }
    window.history.replaceState({}, '', url.toString())
  }, [page])

  /** 当前页插件数据 */
  const currentPagePlugins = useMemo(
    () => {
      const startIndex = (page - 1) * pageSize

      /** 根据 hasConfig 排序后的插件列表 */
      const sortedPlugins = plugins.sort((a, b) => {
        if (a.hasConfig && !b.hasConfig) return -1
        if (!a.hasConfig && b.hasConfig) return 1
        return 0
      })

      return sortedPlugins.slice(startIndex, startIndex + pageSize)
    },
    [plugins, page, pageSize]
  )

  /** 监听外部事件更新列表 */
  useEffect(() => {
    const handlePluginUpdate = () => {
      refreshPlugins()
    }

    window.addEventListener('plugin-list-update', handlePluginUpdate)
    return () => {
      window.removeEventListener('plugin-list-update', handlePluginUpdate)
    }
  }, [refreshPlugins])

  /** 刷新函数 */
  const handleRefresh = useCallback(() => {
    if (onlineLoading || isRefreshing) return

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    toast.loading('正在刷新插件列表...', { id: 'refresh-plugins' })
    setIsRefreshing(true)
    setIsManualRefresh(true)
    refreshStartTimeRef.current = Date.now()

    refreshTimeoutRef.current = setTimeout(() => {
      refreshPlugins()
    }, 100)
  }, [onlineLoading, isRefreshing, refreshPlugins])

  if (onlineError) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Card className='max-w-md mx-auto'>
          <CardBody className='flex flex-col items-center gap-4 py-8'>
            <div className='text-xl font-medium text-danger'>加载失败</div>
            <p className='text-center text-default-600'>{onlineError.message}</p>
            <Button
              color='primary'
              variant='flat'
              onPress={handleRefresh}
              startContent={<IoRefreshOutline />}
              disabled={isRefreshing}
              isLoading={isRefreshing}
            >
              {isRefreshing ? '刷新中...' : '重试'}
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className='flex-1 flex flex-col items-center justify-start w-full relative z-10'>
        <div className='w-full max-w-[1600px] mx-auto flex-1 flex flex-col py-4 px-4'>
          <div className='w-full flex justify-end mb-2'>
            <Button
              isIconOnly
              variant='flat'
              color='primary'
              aria-label='刷新插件列表'
              isLoading={isRefreshing || onlineLoading}
              onPress={handleRefresh}
            >
              <IoRefreshOutline className='text-xl' />
            </Button>
          </div>
          <ScrollShadow className='w-full h-full flex-1' hideScrollBar>
            {onlineLoading && plugins.length === 0 && (
              <div className='h-full flex items-center justify-center'>
                <Spinner size='lg' color='primary' />
              </div>
            )}
            {currentPagePlugins.length > 0
              ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 p-2'>
                  {currentPagePlugins.map(plugin => (
                    <PluginCard
                      key={plugin.id}
                      plugin={plugin}
                      cardClassName='shadow-md border border-default-200 dark:border-default-200 hover:border-primary-400 dark:hover:border-primary-500 transition-colors'
                    />
                  ))}
                </div>
              )
              : !onlineLoading && (
                <div className='h-full flex items-center justify-center'>
                  <div className='text-center'>
                    <p className='text-lg font-medium text-default-900 mb-1'>暂无插件</p>
                    <p className='text-xs text-default-600'>
                      当前没有任何插件
                    </p>
                  </div>
                </div>
              )}
          </ScrollShadow>
        </div>
      </div>

      {
        plugins.length > 0 && (
          <div className='w-full flex justify-center py-6'>
            <Pagination
              showControls
              showShadow
              color='primary'
              size='sm'
              page={page}
              total={totalPages}
              onChange={page => setPage(page)}
            />
          </div>
        )
      }
    </>
  )
}

export default LocalPluginList
