import { useState, useCallback, ReactElement, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { TbArrowsUp, TbRefresh, TbTrash } from 'react-icons/tb'
import { MdOutlineExtension } from 'react-icons/md'
import { getLocalPluginNameListRequest } from '@/request/plugins'
import { FilterCards, TableContent, UpdateOptionsModal, type PluginType } from '@/components/plugin/admin'
import type { PluginAdminListResponse } from 'node-karin'

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

  /** 更新选项对话框状态 */
  const [updateModalOpen, setUpdateModalOpen] = useState(false)

  /** 存储所有插件数据，用于前端筛选 */
  const [allPlugins, setAllPlugins] = useState<PluginAdminListResponse[]>([])

  /** 本地筛选时的加载状态 */
  const [localFiltering, setLocalFiltering] = useState(false)

  /** 延迟显示空结果的状态，避免与虚拟列表加载过程冲突 */
  const [delayEmptyResult, setDelayEmptyResult] = useState(false)

  /**
   * 获取插件列表的请求 - 只在组件挂载和手动刷新时触发
   */
  const { loading: remoteLoading, run: fetchPlugins } = useRequest(
    async () => {
      const response = await getLocalPluginNameListRequest()
      if (response.success && response.data) {
        setAllPlugins(response.data)
        return response.data
      }
      return []
    },
    {
      loadingDelay: 300, // 增加加载延迟，避免短时间内的闪烁
      onSuccess: () => {
        /** 重置选中的插件 */
        setSelectedKeys(new Set())
      },
    }
  )

  // 综合加载状态，仅在远程加载时显示为true，本地筛选不显示加载状态
  const loading = remoteLoading && !localFiltering

  // 根据选择的筛选器类型在前端筛选插件数据
  const plugins = useMemo(() => {
    return selectedType === 'all'
      ? allPlugins
      : allPlugins.filter(plugin => plugin.type === selectedType)
  }, [allPlugins, selectedType])

  /** 行高定义 */
  const rowHeight = useMemo(() => {
    return window.innerWidth < 768 ? 50 : 60
  }, [])

  /** 容器高度 */
  const containerHeight = useMemo(() => {
    const availableHeight = window.innerHeight * 0.6
    const contentHeight = (plugins?.length || 0) * rowHeight
    return Math.min(Math.max(contentHeight || 300, 300), availableHeight)
  }, [plugins, rowHeight])

  /** 为选中状态创建映射表以加速查找 */
  const selectedMap = useMemo(() => {
    const map = new Map<string, boolean>()
    selectedKeys.forEach(id => map.set(id, true))
    return map
  }, [selectedKeys])

  /** 全选状态 */
  const selectionState = useMemo(() => {
    if (!plugins || plugins.length === 0) return { isSelected: false, isIndeterminate: false }
    const selectedCount = selectedKeys.size

    // 完全选中
    if (selectedCount === plugins.length) {
      return { isSelected: true, isIndeterminate: false }
    }

    // 部分选中
    if (selectedCount > 0 && selectedCount < plugins.length) {
      return { isSelected: false, isIndeterminate: true }
    }

    // 未选中
    return { isSelected: false, isIndeterminate: false }
  }, [plugins, selectedKeys])

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
    // 本地筛选开始
    setLocalFiltering(true)
    // 启用延迟空结果显示
    setDelayEmptyResult(true)
    setSelectedType(type)
    /** 更新 URL 参数 */
    setSearchParams({ type })
    /** 重置选中的插件 */
    setSelectedKeys(new Set())

    // 筛选完成后重置筛选状态
    // 延长时间以确保完全覆盖LazyPluginLoader的分片加载过程
    setTimeout(() => setLocalFiltering(false), 800)

    // 延迟更长时间后才显示"没有找到符合条件的插件"
    setTimeout(() => setDelayEmptyResult(false), 1000)
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
   * 处理全选/取消全选
   */
  const handleSelectAll = useCallback(() => {
    if (plugins && plugins.length > 0) {
      if (selectedKeys.size > 0) {
        /** 如果有选中项，则取消全选 */
        console.log('取消全选，清空所有选中项')
        setSelectedKeys(new Set())
      } else {
        /** 否则全选 */
        console.log('全选，选中所有项')
        const allKeys = new Set(plugins.map(plugin => plugin.id))
        setSelectedKeys(allKeys as Set<string>)
      }
    }
  }, [plugins, selectedKeys])

  /**
   * 处理更新全部按钮点击
   */
  const handleUpdateAll = useCallback(() => {
    // 打开更新选项对话框
    setUpdateModalOpen(true)
  }, [])

  /**
   * 处理更新选项确认
   */
  const handleUpdateOptionsConfirm = useCallback((options: {
    updateNpm: boolean
    updateGit: boolean
    forceUpdateGit: boolean
  }) => {
    console.log('更新选项:', options)
    // TODO: 实现具体的更新逻辑
  }, [])

  /**
   * 计算每种类型的插件数量
   */
  const getPluginCounts = useCallback(() => {
    if (!plugins || plugins.length === 0) return { all: 0, npm: 0, git: 0, app: 0 }

    const counts = { all: plugins.length, npm: 0, git: 0, app: 0 }

    plugins.forEach(plugin => {
      const pluginType = plugin.type as keyof typeof counts
      if (pluginType in counts) {
        counts[pluginType]++
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
  }  /**
   * 渲染表格内容
   */
  const renderTableContent = () => {
    // 如果正在筛选中，显示全局加载状态，彻底覆盖所有内容
    if (localFiltering) {
      return (
        <div className='flex items-center justify-center h-60 bg-default-100/30 dark:bg-default-200/10 backdrop-blur-sm rounded-xl shadow-sm'>
          <div className='flex flex-col items-center gap-3'>
            <Spinner size='lg' color='primary' />
            <span className='text-default-600'>加载中...</span>
          </div>
        </div>
      )
    }

    // 如果是空结果且正在延迟显示，同样显示加载中状态
    if (plugins.length === 0 && delayEmptyResult) {
      return (
        <div className='flex items-center justify-center h-60 bg-default-100/30 dark:bg-default-200/10 backdrop-blur-sm rounded-xl shadow-sm'>
          <div className='flex flex-col items-center gap-3'>
            <Spinner size='lg' color='primary' />
            <span className='text-default-600'>加载中...</span>
          </div>
        </div>
      )
    }

    // 当远程加载时显示加载状态
    if (remoteLoading) {
      return (
        <div className='flex items-center justify-center h-60 bg-default-100/30 dark:bg-default-200/10 backdrop-blur-sm rounded-xl shadow-sm'>
          <div className='flex flex-col items-center gap-3'>
            <Spinner size='lg' color='primary' />
            <span className='text-default-600'>加载中...</span>
          </div>
        </div>
      )
    }

    // 对于小数据量，自动跳过LazyPluginLoader的分批加载
    const skipLazyLoading = plugins.length <= 30

    return (
      <TableContent
        plugins={plugins}
        loading={false} // 完全禁用TableContent内部的加载状态
        selectedMap={selectedMap}
        rowHeight={rowHeight}
        containerHeight={containerHeight}
        isAllSelected={selectionState.isSelected}
        isIndeterminate={selectionState.isIndeterminate}
        handleSelectAll={handleSelectAll}
        handleSelectPlugin={handleSelectPlugin}
        openSettings={openSettings}
        fetchPlugins={fetchPlugins}
        skipLazyLoading={skipLazyLoading} // 小数据量时跳过分批加载
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
          {/* 全选按钮已移除，改由表头复选框处理全选和取消全选功能 */}
          <Button
            color='success'
            size='sm'
            variant='flat'
            className='bg-success-100/60 text-success-700 dark:bg-success-900/30 dark:text-success-400'
            startContent={<TbArrowsUp className='text-lg' />}
            isDisabled={(selectedType !== 'all' && getSelectedCount() === 0) || (!plugins || plugins.length === 0)}
            onPress={selectedType === 'all' && getSelectedCount() === 0 ? handleUpdateAll : undefined}
          >
            {selectedType === 'all' && getSelectedCount() === 0 ? '更新全部' : '更新选中'}
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

      {/* 更新选项对话框 */}
      <UpdateOptionsModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onConfirm={handleUpdateOptionsConfirm}
      />
    </div>
  )
}

export default PluginManagePage
