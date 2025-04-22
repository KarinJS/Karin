/* eslint-disable @stylistic/indent */
import { useState, useCallback, ReactElement, useEffect, memo, useRef, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Card } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { Checkbox } from '@heroui/checkbox'
import { TbApps, TbBrandGit, TbCircleCheck, TbCircleDashed, TbArrowUp, TbRefresh, TbTrash, TbArrowsUp } from 'react-icons/tb'
import { IoSettingsOutline } from 'react-icons/io5'
import { MdOutlineExtension } from 'react-icons/md'
import { useVirtualizer } from '@tanstack/react-virtual'
import { fetchPluginList, type PluginItem, type PluginType } from '@/mock/pluginManageData'
import StatCard from '@/components/card/StatCard'

/**
 * 获取更新状态配置
 * @param status - 更新状态
 * @param type - 插件类型
 * @returns 状态配置
 */
const getUpdateStatusConfig = (type: PluginType, version: string, latesHash: string) => {
  if (type === 'app') {
    return {
      text: '-',
      color: 'default' as const,
      icon: <TbCircleDashed className='text-xs mr-1' />,
    }
  }

  if (version === latesHash) {
    return {
      text: '最新',
      color: 'success' as const,
      icon: <TbCircleCheck className='text-xs mr-1' />,
    }
  }

  if (version !== latesHash) {
    return {
      text: '可更新',
      color: 'warning' as const,
      icon: <TbArrowUp className='text-xs mr-1' />,
    }
  }

  return {
    text: '未知',
    color: 'default' as const,
    icon: <TbCircleDashed className='text-xs mr-1' />,
  }
}

/**
 * 获取类型配置
 * @param type - 插件类型
 * @returns 类型配置信息
 */
const getTypeConfig = (type: PluginType) => {
  switch (type) {
    case 'git':
      return {
        color: 'warning',
        text: 'Git插件',
      }
    case 'app':
      return {
        color: 'primary',
        text: 'App插件',
      }
    case 'all':
    default:
      return {
        color: 'default',
        text: '全部',
      }
  }
}

/**
 * 渲染图标的帮助函数
 * @param size - 图标尺寸
 * @param Icon - 图标组件
 * @returns 渲染的图标组件
 */
const renderIcon = (size: number, Icon: React.ComponentType<{ size?: number }>) => {
  return <Icon size={size} />
}

/**
 * 阻止事件冒泡
 * @param e - 事件对象
 */
const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
  e.stopPropagation()
}

/**
 * 插件行组件，使用memo优化渲染
 */
const PluginRow = memo(({
  plugin,
  isSelected,
  onSelect,
  openSettings,
}: {
  plugin: PluginItem
  isSelected: boolean
  onSelect: (id: string, isSelected: boolean) => void
  openSettings: (pluginId: string) => void
}) => {
  /** 插件更新状态 */
  const statusConfig = getUpdateStatusConfig(plugin.type, plugin.version, plugin.latestHash)
  /** 插件类型配置 */
  const typeConfig = getTypeConfig(plugin.type)

  /** 处理选择状态变更 */
  const handleSelectionChange = useCallback(() => {
    onSelect(plugin.id, !isSelected)
  }, [plugin.id, isSelected, onSelect])

  /** 处理设置按钮点击 */
  const handleOpenSettings = useCallback(() => {
    openSettings(plugin.id)
  }, [plugin.id, openSettings])

  return (
    <div className='grid grid-cols-12 w-full border-b border-default-100/40 hover:bg-default-50/70 transition-colors' onClick={() => onSelect(plugin.id, !isSelected)}>
      {/* 选择框 */}
      <div className='py-3 md:py-4 px-2 md:px-4 text-sm flex items-center justify-center col-span-1' onClick={stopPropagation}>
        <div className='flex items-center justify-center w-full'>
          <Checkbox
            isSelected={isSelected}
            onValueChange={handleSelectionChange}
            size='sm'
            aria-label={`选择 ${plugin.name}`}
            classNames={{
              base: 'w-4 h-4',
              wrapper: 'rounded-full w-4 h-4 border-1 border-default-300 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-500 data-[hover=true]:border-blue-400 data-[hover=true]:bg-blue-400/20 transition-all',
              icon: 'text-white text-[10px]',
            }}
          />
        </div>
      </div>

      {/* 插件名称 */}
      <div className='py-3 md:py-4 px-2 md:px-4 text-sm col-span-4 sm:col-span-4 flex items-center'>
        <div className='flex items-center w-full'>
          <div className='flex-shrink-0'>
            <div
              className='w-2 md:w-2.5 h-2 md:h-2.5 rounded-full mr-1.5 md:mr-2.5 flex-shrink-0 translate-y-[0.5px] sm:translate-y-0'
              style={{
                backgroundColor: plugin.type === 'app' ? '#10b981' : '#f59e0b',
                boxShadow: plugin.type === 'app' ? '0 0 6px rgba(16, 185, 129, 0.3)' : '0 0 6px rgba(245, 158, 11, 0.3)',
              }}
            />
          </div>
          <div className='font-medium text-default-700 dark:text-default-300 w-full break-words whitespace-normal'>
            {plugin.name}
          </div>
        </div>
      </div>

      {/* 当前版本 */}
      <div className='hidden sm:block py-3 md:py-4 px-1 sm:px-2 md:px-4 text-sm col-span-3 sm:col-span-2 text-center'>
        {plugin.type === 'app'
          ? (
            <span className='text-xs text-default-500'>-</span>
          )
          : (
            <Chip size='sm' variant='flat' color='primary' className='bg-primary-100/50'>
              {plugin.version}
            </Chip>
          )}
      </div>

      {/* 最新版本 */}
      <div className='hidden sm:block py-3 md:py-4 px-1 sm:px-2 md:px-4 text-sm col-span-3 sm:col-span-2 text-center'>
        {plugin.type === 'app'
          ? (
            <span className='text-xs text-default-500'>-</span>
          )
          : (
            plugin.latestHash !== plugin.version
              ? (
                <Chip size='sm' variant='flat' color='warning' className='bg-warning-100/50'>
                  {plugin.latestHash}
                </Chip>
              )
              : (
                <Chip size='sm' variant='flat' color='success' className='bg-success-100/50'>
                  {plugin.version}
                </Chip>
              )
          )}
      </div>

      {/* 插件类型 */}
      <div className='hidden sm:block py-3 md:py-4 px-2 md:px-4 text-sm text-center col-span-1'>
        <div
          className='w-20 mx-auto h-6 flex items-center justify-center rounded-full border text-xs'
          style={{
            backgroundColor: typeConfig.color === 'primary'
              ? 'rgba(59, 130, 246, 0.1)'
              : typeConfig.color === 'danger'
                ? 'rgba(239, 68, 68, 0.1)'
                : typeConfig.color === 'warning'
                  ? 'rgba(234, 179, 8, 0.1)'
                  : 'rgba(161, 161, 170, 0.1)',
            color: typeConfig.color === 'primary'
              ? 'rgb(37, 99, 235)'
              : typeConfig.color === 'danger'
                ? 'rgb(220, 38, 38)'
                : typeConfig.color === 'warning'
                  ? 'rgb(202, 138, 4)'
                  : 'rgb(113, 113, 122)',
            borderColor: typeConfig.color === 'primary'
              ? 'rgba(59, 130, 246, 0.2)'
              : typeConfig.color === 'danger'
                ? 'rgba(239, 68, 68, 0.2)'
                : typeConfig.color === 'warning'
                  ? 'rgba(234, 179, 8, 0.2)'
                  : 'rgba(161, 161, 170, 0.2)',
          }}
        >
          {typeConfig.text}
        </div>
      </div>

      {/* 状态 */}
      <div className='py-3 md:py-4 px-2 md:px-4 text-sm text-center col-span-3 sm:col-span-1'>
        <div className='flex justify-center items-center'>
          {plugin.type === 'app'
            ? (
              <div
                className='inline-flex items-center justify-center w-20 h-6 text-xs rounded-md border'
                style={{
                  backgroundColor: 'rgba(107, 114, 128, 0.08)', /** 灰色背景 */
                  color: 'rgb(75, 85, 99)', /** 灰色文字 */
                  borderColor: 'rgba(107, 114, 128, 0.2)', /** 灰色边框 */
                }}
              >
                <TbCircleDashed className='text-xs mr-1' />
              </div>
            )
            : (
              <div
                className='inline-flex items-center justify-center w-20 h-6 text-xs rounded-md border'
                style={{
                  backgroundColor: statusConfig.color === 'success'
                    ? 'rgba(34, 197, 94, 0.08)'
                    : statusConfig.color === 'warning'
                      ? 'rgba(234, 179, 8, 0.08)'
                      : 'rgba(161, 161, 170, 0.08)',
                  color: statusConfig.color === 'success'
                    ? 'rgb(22, 163, 74)'
                    : statusConfig.color === 'warning'
                      ? 'rgb(202, 138, 4)'
                      : 'rgb(113, 113, 122)',
                  borderColor: statusConfig.color === 'success'
                    ? 'rgba(34, 197, 94, 0.2)'
                    : statusConfig.color === 'warning'
                      ? 'rgba(234, 179, 8, 0.2)'
                      : 'rgba(161, 161, 170, 0.2)',
                }}
              >
                {statusConfig.icon}
                <span className='font-normal'>{statusConfig.text}</span>
              </div>
            )}
        </div>
      </div>

      {/* 操作 */}
      <div className='py-3 md:py-4 px-0 sm:px-2 md:px-4 text-sm text-center col-span-3 sm:col-span-1' onClick={stopPropagation}>
        <div className='flex justify-center'>
          <Button
            isIconOnly
            size='sm'
            variant='light'
            color='primary'
            onPress={handleOpenSettings}
            className='opacity-70 hover:opacity-100 transition-opacity'
          >
            <IoSettingsOutline className='text-lg' />
          </Button>
        </div>
      </div>
    </div>
  )
})

PluginRow.displayName = 'PluginRow'

/**
 * 插件管理页面组件
 * @returns 返回插件管理页面
 */
export const PluginManagePage = (): ReactElement => {
  /** 使用 URL 搜索参数管理筛选状态 */
  const [searchParams, setSearchParams] = useSearchParams()

  /** 选中的插件类型 - 从 URL 参数中获取，默认为 'all' */
  const [selectedType, setSelectedType] = useState<PluginType>(
    (searchParams.get('type') as PluginType) || 'all'
  )

  /** 选中的插件ID列表（使用Set保证唯一性和便于操作） */
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>())

  /** 表格容器引用 */
  const tableContainerRef = useRef<HTMLDivElement>(null)

  /**
   * 获取插件列表的请求
   */
  const { data: plugins = [], loading, run: fetchPlugins } = useRequest(
    () => fetchPluginList(selectedType),
    {
      refreshDeps: [selectedType],
      onSuccess: () => {
        /** 重置选中的插件 */
        setSelectedKeys(new Set())
      },
    }
  )

  /** 行高定义 */
  const rowHeight = useMemo(() => {
    return window.innerWidth < 768 ? 50 : 60
  }, [])

  /** 虚拟列表 */
  const rowVirtualizer = useVirtualizer({
    count: plugins.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: useCallback(() => rowHeight, [rowHeight]),
    overscan: 5,
    getItemKey: useCallback((index: number) => plugins[index]?.id || index, [plugins]),
  })

  /** 容器高度 */
  const containerHeight = useMemo(() => {
    const availableHeight = window.innerHeight * 0.6
    const contentHeight = plugins.length * rowHeight
    return Math.min(Math.max(contentHeight || 300, 300), availableHeight)
  }, [plugins.length, rowHeight])

  /** 虚拟项 */
  const virtualItems = rowVirtualizer.getVirtualItems()

  /** 为选中状态创建映射表以加速查找 */
  const selectedMap = useMemo(() => {
    const map = new Map<string, boolean>()
    selectedKeys.forEach(id => map.set(id, true))
    return map
  }, [selectedKeys])

  /** 当 URL 参数变化时更新选中类型 */
  useEffect(() => {
    const typeParam = searchParams.get('type') as PluginType
    if (typeParam && typeParam !== selectedType) {
      setSelectedType(typeParam)
    }
  }, [searchParams, selectedType])

  /**
   * 处理类型变更
   * @param type - 新的筛选类型
   */
  const handleTypeChange = useCallback((type: PluginType) => {
    setSelectedType(type)
    /** 更新 URL 参数 */
    setSearchParams({ type })
    /** 重置选中的插件 */
    setSelectedKeys(new Set())
  }, [setSearchParams])

  /**
   * 处理选择插件
   * @param id - 插件ID
   * @param isSelected - 是否选中
   */
  const handleSelectPlugin = useCallback((id: string, isSelected: boolean) => {
    setSelectedKeys(prev => {
      const newSet = new Set(prev)
      if (isSelected) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }, [])

  /**
   * 打开插件设置
   * @param pluginId - 插件ID
   */
  const openSettings = useCallback((pluginId: string) => {
    // 在这里添加打开设置的逻辑
    console.log('打开插件设置:', pluginId)
    // 可以实现导航到设置页面或者打开设置模态框的逻辑
  }, [])

  /**
   * 获取当前选中的插件数量
   */
  const getSelectedCount = useCallback(() => {
    return selectedKeys.size
  }, [selectedKeys])

  /**
   * 判断是否全选状态
   */
  const isAllSelected = useCallback(() => {
    if (!plugins || plugins.length === 0) return false
    return selectedKeys.size === plugins.length
  }, [plugins, selectedKeys])

  /**
   * 处理全选/取消全选
   */
  const handleSelectAll = useCallback(() => {
    if (isAllSelected()) {
      /** 如果已经全选，则取消全选 */
      setSelectedKeys(new Set())
    } else if (plugins) {
      /** 否则全选 */
      const allKeys = new Set(plugins.map(plugin => plugin.id))
      setSelectedKeys(allKeys)
    }
  }, [isAllSelected, plugins])

  /**
   * 计算每种类型的插件数量
   */
  const getPluginCounts = useCallback(() => {
    if (!plugins || plugins.length === 0) return { all: 0, npm: 0, git: 0, app: 0 }

    const counts = { all: plugins.length, npm: 0, git: 0, app: 0 }

    plugins.forEach(plugin => {
      if (plugin.type in counts) {
        counts[plugin.type as keyof typeof counts]++
      }
    })

    return counts
  }, [plugins])

  /**
   * 渲染筛选卡片
   */
  const renderFilterCards = () => {
    const counts = getPluginCounts()

    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <StatCard
          title='全部'
          count={counts.all}
          description='全部插件'
          icon={renderIcon(24, IoSettingsOutline)}
          gradient='bg-gradient-to-br from-indigo-400/10 to-indigo-500/20 dark:from-indigo-600/10 dark:to-indigo-700/20'
          border='border border-indigo-200/30 dark:border-indigo-800/20'
          iconBg='bg-indigo-400/20 dark:bg-indigo-700/30'
          textColor='text-indigo-700 dark:text-indigo-300'
          ringColor='ring-indigo-400 dark:ring-indigo-500'
          isActive={selectedType === 'all'}
          onClick={() => handleTypeChange('all')}
        />

        <StatCard
          title='Git插件'
          count={counts.git}
          description='Git  插件'
          icon={renderIcon(24, TbBrandGit)}
          gradient='bg-gradient-to-br from-amber-400/10 to-amber-500/20 dark:from-amber-600/10 dark:to-amber-700/20'
          border='border border-amber-200/30 dark:border-amber-800/20'
          iconBg='bg-amber-400/20 dark:bg-amber-700/30'
          textColor='text-amber-700 dark:text-amber-300'
          ringColor='ring-amber-400 dark:ring-amber-500'
          isActive={selectedType === 'git'}
          onClick={() => handleTypeChange('git')}
        />

        <StatCard
          title='App插件'
          count={counts.app}
          description='App插件'
          icon={renderIcon(24, TbApps)}
          gradient='bg-gradient-to-br from-teal-400/10 to-teal-500/20 dark:from-teal-600/10 dark:to-teal-700/20'
          border='border border-teal-200/30 dark:border-teal-800/20'
          iconBg='bg-teal-400/20 dark:bg-teal-700/30'
          textColor='text-teal-700 dark:text-teal-300'
          ringColor='ring-teal-400 dark:ring-teal-500'
          isActive={selectedType === 'app'}
          onClick={() => handleTypeChange('app')}
        />
      </div>
    )
  }

  /**
   * 渲染表格内容
   */
  const renderTableContent = () => {
    if (loading) {
      return (
        <div className='flex items-center justify-center h-60 bg-default-100/30 dark:bg-default-200/10 backdrop-blur-sm rounded-xl shadow-sm'>
          <Spinner size='lg' color='primary' />
        </div>
      )
    }

    if (!plugins || plugins.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center h-60 bg-default-100/30 dark:bg-default-200/10 backdrop-blur-sm rounded-xl shadow-sm'>
          <p className='text-default-500 mb-4'>没有找到符合条件的插件</p>
          <Button
            color='primary'
            variant='flat'
            size='sm'
            startContent={<TbRefresh />}
            onPress={fetchPlugins}
          >
            刷新列表
          </Button>
        </div>
      )
    }

    return (
      <Card className='overflow-hidden shadow-sm border-none bg-default-50/70 dark:bg-default-100/10 backdrop-blur-sm'>
        <div className='min-w-full flex flex-col'>
          {/* 表头 */}
          <div className='bg-default-50/50 sticky top-0 z-10 w-full'>
            <div className='grid grid-cols-12 w-full border-b border-default-100/70 -ml-[3px]'>
              {/* 选择框列 */}
              <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 flex items-center justify-center col-span-1'>
                <Checkbox
                  isSelected={isAllSelected()}
                  onValueChange={handleSelectAll}
                  size='sm'
                  aria-label='全选'
                  classNames={{
                    base: 'w-4 h-4',
                    wrapper: 'rounded-full w-4 h-4 border-1 border-default-300 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-500 data-[indeterminate=true]:bg-blue-500 data-[indeterminate=true]:border-blue-500 data-[hover=true]:border-blue-400 data-[hover=true]:bg-blue-400/20 transition-all',
                    icon: 'text-white text-[10px]',
                  }}
                />
              </div>

              {/* 插件名称列 */}
              <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 col-span-4 sm:col-span-4'>
                插件名称
              </div>

              {/* 当前版本列 */}
              <div className='hidden sm:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-1 sm:px-2 md:px-4 text-center col-span-3 sm:col-span-2'>
                当前版本
              </div>

              {/* 最新版本列 */}
              <div className='hidden sm:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-1 sm:px-2 md:px-4 text-center col-span-3 sm:col-span-2'>
                最新版本
              </div>

              {/* 插件类型列 */}
              <div className='hidden sm:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 text-center col-span-1'>
                插件类型
              </div>

              {/* 状态列 */}
              <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 text-center col-span-3 sm:col-span-1'>
                状态
              </div>

              {/* 操作列 */}
              <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-0 sm:px-2 md:px-4 text-center col-span-3 sm:col-span-1'>
                操作
              </div>
            </div>
          </div>

          {/* 虚拟滚动容器 */}
          <div
            ref={tableContainerRef}
            className='overflow-auto'
            style={{ height: `${containerHeight}px` }}
          >
            {/* 内容容器 */}
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {/* 虚拟滚动列表项 */}
              {virtualItems.map(virtualRow => {
                const plugin = plugins[virtualRow.index]
                if (!plugin) return null

                const isSelected = selectedMap.has(plugin.id)

                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${rowHeight}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <PluginRow
                      plugin={plugin}
                      isSelected={isSelected}
                      onSelect={handleSelectPlugin}
                      openSettings={openSettings}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className='w-full p-5'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8'>
        <div className='flex items-center gap-2 mb-4 sm:mb-0'>
          <MdOutlineExtension className='text-2xl text-default-600' />
          <h1 className='text-2xl font-semibold text-default-700'>插件管理</h1>
        </div>
        <div className='flex gap-3 justify-center w-full sm:w-auto sm:self-auto'>
          <Button
            color='primary'
            size='sm'
            variant='flat'
            className='bg-primary-100/60 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
            startContent={isAllSelected() ? <TbCircleCheck className='text-lg' /> : <TbCircleDashed className='text-lg' />}
            onPress={handleSelectAll}
            isDisabled={!plugins || plugins.length === 0}
          >
            {isAllSelected() ? '取消全选' : '全选'}
          </Button>
          <Button
            color='success'
            size='sm'
            variant='flat'
            className='bg-success-100/60 text-success-700 dark:bg-success-900/30 dark:text-success-400'
            startContent={<TbArrowsUp className='text-lg' />}
            isDisabled={getSelectedCount() === 0}
          >
            更新选中
          </Button>
          <Button
            color='danger'
            size='sm'
            variant='flat'
            className='bg-danger-100/60 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
            startContent={<TbTrash className='text-lg' />}
            isDisabled={getSelectedCount() === 0}
          >
            卸载选中
          </Button>
          <Button
            color='primary'
            size='sm'
            variant='flat'
            className='bg-primary-100/60 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
            startContent={<TbRefresh className='text-lg' />}
            isLoading={loading}
            onPress={fetchPlugins}
          >
            刷新
          </Button>
        </div>
      </div>

      {renderFilterCards()}

      {renderTableContent()}
    </div>
  )
}

export default PluginManagePage
