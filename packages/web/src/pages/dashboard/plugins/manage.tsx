/* eslint-disable @stylistic/indent */
import { useState, useCallback, ReactElement, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button } from '@heroui/button'
import { TbCircleCheck, TbCircleDashed, TbArrowsUp, TbRefresh, TbTrash } from 'react-icons/tb'
import { MdOutlineExtension } from 'react-icons/md'
import { fetchPluginList } from '@/mock/pluginManageData'
import { FilterCards, TableContent, type PluginType } from '@/components/plugin/admin'

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

  /** 容器高度 */
  const containerHeight = useMemo(() => {
    const availableHeight = window.innerHeight * 0.6
    const contentHeight = plugins.length * rowHeight
    return Math.min(Math.max(contentHeight || 300, 300), availableHeight)
  }, [plugins.length, rowHeight])

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
      <FilterCards
        counts={counts}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
      />
    )
  }

  /**
   * 渲染表格内容
   */
  const renderTableContent = () => {
    return (
      <TableContent
        plugins={plugins}
        loading={loading}
        selectedMap={selectedMap}
        rowHeight={rowHeight}
        containerHeight={containerHeight}
        isAllSelected={isAllSelected()}
        handleSelectAll={handleSelectAll}
        handleSelectPlugin={handleSelectPlugin}
        openSettings={openSettings}
        fetchPlugins={fetchPlugins}
      />
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
