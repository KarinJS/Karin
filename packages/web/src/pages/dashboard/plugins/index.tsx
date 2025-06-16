import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useRequest } from 'ahooks'
import toast from 'react-hot-toast'
import { getPluginMarketListRequest } from '@/request/plugins'
import { Pagination } from '@heroui/pagination'
import { Button } from '@heroui/button'
import { FaNpm } from 'react-icons/fa6'
import { FaTh, FaCheckCircle } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import { TbApps } from 'react-icons/tb'
import { Spinner } from '@heroui/spinner'
import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { ScrollShadow } from '@heroui/scroll-shadow'
import {
  IoRefreshOutline,
  IoSearchOutline,
  IoAppsOutline,
  IoChevronDownOutline,
  IoSyncOutline,
} from 'react-icons/io5'
import type { PluginMarketResponse } from 'node-karin'
import PluginCard from '@/components/plugin/market/card'

/**
 * 获取插件类型对应的图标和样式
 * @param type 插件类型
 * @returns 图标、提示、颜色
 */
const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'npm':
      return {
        icon: <FaNpm className='text-2xl text-[#CB3837]' />,
        tooltip: 'NPM 插件',
        color: 'bg-red-50/50',
      }
    case 'git':
      return {
        icon: <IoSyncOutline className='text-2xl text-[#6e5494]' />,
        tooltip: 'Git 插件',
        color: 'bg-purple-50/50',
      }
    case 'app':
      return {
        icon: <TbApps className='text-2xl text-primary-500' />,
        tooltip: '应用插件',
        color: 'bg-primary-50/50',
      }
    default:
      return {
        icon: <IoAppsOutline className='text-2xl text-default-500' />,
        tooltip: '未知类型',
        color: 'bg-default-50/50',
      }
  }
}

/**
 * 插件市场页面：顶部大Banner+内容区风格
 * @returns 插件市场主页面组件
 */
const MarketPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 从URL获取初始页码
  const getInitialPage = (): number => {
    const searchParams = new URLSearchParams(location.search)
    const pageParam = searchParams.get('page')
    return pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1
  }

  const [page, setPage] = useState(getInitialPage())
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const refreshStartTimeRef = useRef<number>(0)

  // 更新URL中的页码
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)

    if (page !== 1) {
      searchParams.set('page', page.toString())
    } else {
      searchParams.delete('page')
    }

    const newSearch = searchParams.toString()
    const newPath = location.pathname + (newSearch ? `?${newSearch}` : '')

    if (location.search !== (newSearch ? `?${newSearch}` : '')) {
      navigate(newPath, { replace: true })
    }
  }, [page, location.pathname, location.search, navigate])

  const {
    data: plugins = [],
    error: onlineError,
    loading: onlineLoading,
    refresh: refreshPlugins,
  } = useRequest<PluginMarketResponse[], [boolean]>(
    () => getPluginMarketListRequest(isRefreshing),
    {
      refreshDeps: [isRefreshing],
      onFinally: () => setIsRefreshing(false),
    }
  )

  const pageSize = 16

  // 筛选和搜索逻辑
  const filteredPlugins = useMemo(() => {
    let filtered = [...plugins]

    // 类型筛选
    if (filterType === 'installed') {
      filtered = filtered.filter(plugin => plugin.local.installed)
    } else if (filterType !== 'all') {
      filtered = filtered.filter(plugin => {
        if (plugin.type === 'market') {
          return plugin.market.type.toLowerCase() === filterType.toLowerCase()
        }
        return plugin.local.type.toLowerCase() === filterType.toLowerCase()
      })
    }

    // 搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(plugin => {
        const name = plugin.type === 'market' ? plugin.market.name : plugin.local.name
        const description = plugin.type === 'market' ? plugin.market.description : plugin.local.description || ''
        const type = plugin.type === 'market' ? plugin.market.type : plugin.local.type

        return (
          name.toLowerCase().includes(query) ||
          (description && description !== '-' && description.toLowerCase().includes(query)) ||
          plugin.author.name.toLowerCase().includes(query) ||
          (type && type.toLowerCase().includes(query))
        )
      })
    }

    return filtered
  }, [plugins, filterType, searchQuery])

  // 计算总页数
  const totalPages = useMemo(() => Math.ceil(filteredPlugins.length / pageSize), [filteredPlugins.length, pageSize])

  // 重置页码当筛选条件改变时
  useEffect(() => {
    setPage(1)
  }, [filterType, searchQuery])

  // 确保页码不超出范围
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages)
    }
  }, [totalPages, page])

  // 当前页插件数据
  const currentPagePlugins = useMemo(
    () => {
      const startIndex = (page - 1) * pageSize
      return filteredPlugins.slice(startIndex, startIndex + pageSize)
    },
    [filteredPlugins, page, pageSize]
  )

  // 监听外部事件更新列表
  useEffect(() => {
    const handlePluginUpdate = () => {
      refreshPlugins()
    }

    window.addEventListener('plugin-list-update', handlePluginUpdate)
    return () => {
      window.removeEventListener('plugin-list-update', handlePluginUpdate)
    }
  }, [refreshPlugins])

  // 刷新函数
  const handleRefresh = useCallback(() => {
    if (onlineLoading || isRefreshing) return

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    toast.loading('正在刷新插件列表...', { id: 'refresh-plugins' })
    setIsRefreshing(true)
    refreshStartTimeRef.current = Date.now()

    refreshTimeoutRef.current = setTimeout(() => {
      refreshPlugins()
    }, 100)
  }, [onlineLoading, isRefreshing, refreshPlugins])

  // 处理刷新完成后的操作
  useEffect(() => {
    if (isRefreshing) {
      // 如果已经刷新完成（非加载状态），显示提示
      if (!onlineLoading) {
        const duration = ((Date.now() - refreshStartTimeRef.current) / 1000).toFixed(1)

        if (onlineError) {
          toast.error(`刷新失败: ${onlineError.message}`, { id: 'refresh-plugins' })
        } else {
          toast.success(`刷新成功，耗时 ${duration} 秒`, { id: 'refresh-plugins' })
        }
        setIsRefreshing(false)
      }
    }
  }, [onlineLoading, isRefreshing, onlineError])

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
    <div className='h-full w-full flex flex-col overflow-hidden relative'>
      {/* 顶部大Banner卡片（无底色，仅细腻阴影和内容） */}
      <div className='w-full flex justify-center pt-10 pb-4 px-4'>
        <div className='w-full max-w-[1600px] rounded-3xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden bg-transparent border border-default-200 dark:border-default-200'>
          <div className='absolute right-8 top-8 opacity-10 text-[120px] pointer-events-none select-none hidden md:block'>
            <TbApps className='text-primary-400 dark:text-primary-700' />
          </div>
          <div className='flex flex-col items-start gap-2 z-10 flex-1'>
            <div className='flex items-center gap-4 mb-1'>
              <TbApps className='text-5xl text-primary-500 drop-shadow-lg' />
              <span className='text-3xl font-extrabold text-default-900 dark:text-white tracking-tight'>插件市场</span>
            </div>
            <div className='text-base text-default-600 dark:text-default-300 font-medium mb-2'>
              探索插件宇宙，发现属于你的开发超能力！
            </div>
          </div>
          <div className='flex flex-col md:flex-row items-center gap-3 z-10'>
            <Input
              classNames={{
                base: 'max-w-[220px]',
                input: 'text-sm text-default-900 dark:text-default-100 placeholder:text-default-400 dark:placeholder:text-default-500',
                inputWrapper: 'h-9 bg-transparent border border-default-200 dark:border-default-200 focus-within:border-primary-500 dark:focus-within:border-primary-400',
              }}
              placeholder='搜索插件...'
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<IoSearchOutline className='text-default-400 text-lg' />}
              size='md'
              isClearable
              onClear={() => setSearchQuery('')}
            />
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant='flat'
                  size='md'
                  className='h-9 px-3 min-w-[120px] bg-transparent border border-default-200 dark:border-default-200 text-default-700 dark:text-default-200 font-semibold rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-colors'
                  startContent={
                    <div className='w-6 h-6 flex items-center justify-center'>
                      {filterType === 'all' && <FaTh className='text-lg text-default-500' />}
                      {filterType === 'installed' && <FaCheckCircle className='text-lg text-success-500' />}
                      {filterType !== 'all' && filterType !== 'installed' && getTypeIcon(filterType).icon}
                    </div>
                  }
                  endContent={<IoChevronDownOutline className='text-lg text-default-400' />}
                >
                  {filterType === 'all' ? '全部类型' : filterType === 'installed' ? '已安装' : getTypeIcon(filterType).tooltip}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='插件类型筛选'
                selectedKeys={[filterType]}
                selectionMode='single'
                onSelectionChange={(keys) => setFilterType(Array.from(keys)[0] as string)}
              >
                <DropdownItem key='all' startContent={<FaTh className='text-lg text-default-500' />}>全部类型</DropdownItem>
                <DropdownItem key='installed' startContent={<FaCheckCircle className='text-lg text-success-500' />}>已安装</DropdownItem>
                <DropdownItem key='npm' startContent={<FaNpm className='text-xl text-[#CB3837]' />}>NPM 插件</DropdownItem>
                <DropdownItem key='git' startContent={<IoSyncOutline className='text-xl text-[#6e5494]' />}>Git 插件</DropdownItem>
                <DropdownItem key='app' startContent={<TbApps className='text-xl text-primary-500' />}>应用插件</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              color='primary'
              variant='flat'
              size='md'
              onPress={handleRefresh}
              className='h-9 px-4 min-w-[90px] font-bold rounded-xl shadow-none text-primary-700 dark:text-primary-300 text-base flex items-center gap-2 hover:bg-primary-100/70 dark:hover:bg-primary-900/40 hover:text-primary-900 dark:hover:text-primary-100 transition-all'
              disabled={isRefreshing}
              startContent={
                isRefreshing
                  ? <IoSyncOutline className='animate-spin text-xl' />
                  : <IoRefreshOutline className='text-xl' />
              }
            >
              {isRefreshing ? '刷新中...' : '刷新'}
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区：插件列表 */}
      <div className='flex-1 flex flex-col items-center justify-start w-full relative z-10'>
        <div className='w-full max-w-[1600px] mx-auto flex-1 flex flex-col py-4 px-4'>
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
                      key={plugin.type === 'market' ? plugin.market.name + plugin.market.time : plugin.local.name}
                      plugin={plugin}
                      isRefreshing={isRefreshing}
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
                      {filterType === 'all' && !searchQuery ? '当前没有任何插件' : '没有找到符合条件的插件'}
                    </p>
                  </div>
                </div>
              )}
          </ScrollShadow>
        </div>
      </div>

      {/* 分页器（无底色） */}
      {filteredPlugins.length > 0 && (
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
      )}
    </div>
  )
}

export default MarketPage
