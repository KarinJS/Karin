import { useRequest } from 'ahooks'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { useNavigate } from 'react-router-dom'
import { TbArrowsUp, TbRefresh, TbTrash } from 'react-icons/tb'
import TaskLogModal from '@/components/dependencies/TaskLogModal'
import { getLocalPluginNameListRequest } from '@/request/plugins'
import { createUpdatePlugins } from '@/utils/updatePlugins.utils'
import { useState, useCallback, ReactElement, useMemo, useRef } from 'react'
import { TableContent, UpdateOptionsModal } from '@/components/plugin/admin'

import type { PluginAdminListResponse, PluginAdminParams } from 'node-karin'

/**
 * 本地插件列表组件
 * @returns 返回插件列表虚拟滚动组件
 */
export const LocalPlugin = (): ReactElement => {
  /** 标记是否为首次加载 */
  const isFirstLoad = useRef(true)

  /** 选中的插件ID列表（使用Set保证唯一性和便于操作） */
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>())

  /** 更新选项对话框状态 */
  const [updateModalOpen, setUpdateModalOpen] = useState(false)

  /** 任务日志模态框是否打开 */
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)

  /** 任务ID */
  const [taskId, setTaskId] = useState<string>('')

  /** 任务初始日志 */
  const [taskLogs, setTaskLogs] = useState<string[]>([])

  /** 任务名称 */
  const [taskName, setTaskName] = useState<string>('更新全部插件')

  /** 存储所有插件数据 */
  const [allPlugins, setAllPlugins] = useState<PluginAdminListResponse[]>([])

  /** 本地筛选时的加载状态 */
  const [localFiltering] = useState(false)

  /** 延迟显示空结果的状态，避免与虚拟列表加载过程冲突 */
  const [delayEmptyResult] = useState(false)

  const navigate = useNavigate()

  /**
   * 获取插件列表的请求 - 只在组件挂载和手动刷新时触发
   */
  const { loading: remoteLoading, run: fetchPlugins } = useRequest(
    async () => {
      try {
        // 如果是首次加载，传false；如果是手动刷新，传true
        const isRefresh = !isFirstLoad.current
        const pluginsResponse = await getLocalPluginNameListRequest(isRefresh)

        // 更新首次加载标记
        if (isFirstLoad.current) {
          isFirstLoad.current = false
        }

        setAllPlugins(pluginsResponse)
        return pluginsResponse
      } catch (error) {
        console.error('获取插件列表失败:', error)
        return []
      }
    },
    {
      loadingDelay: 300,
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
    const contentHeight = (allPlugins.length || 0) * rowHeight
    return Math.min(Math.max(contentHeight || 300, 300), availableHeight)
  }, [allPlugins, rowHeight])

  /** 为选中状态创建映射表以加速查找 */
  const selectedMap = useMemo(() => {
    const map = new Map<string, boolean>()
    selectedKeys.forEach(id => map.set(id, true))
    return map
  }, [selectedKeys])

  /** 全选状态 */
  const selectionState = useMemo(() => {
    if (!allPlugins || allPlugins.length === 0) return { isSelected: false, isIndeterminate: false }
    const selectedCount = selectedKeys.size

    // 完全选中
    if (selectedCount === allPlugins.length) {
      return { isSelected: true, isIndeterminate: false }
    }

    // 部分选中
    if (selectedCount > 0 && selectedCount < allPlugins.length) {
      return { isSelected: false, isIndeterminate: true }
    }

    // 未选中
    return { isSelected: false, isIndeterminate: false }
  }, [allPlugins, selectedKeys])

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
    // 查找该插件
    const plugin = allPlugins.find(p => p.name === pluginId)
    if (!plugin) return

    setTimeout(() => {
      if (plugin.type === 'npm') {
        navigate(`/dependencies?search=${pluginId}`)
      } else {
        navigate(`/plugins/config?name=${pluginId}`)
      }
    }, 200)
  }, [allPlugins])

  /**
   * 处理全选/取消全选
   */
  const handleSelectAll = useCallback(() => {
    if (allPlugins && allPlugins.length > 0) {
      if (selectedKeys.size > 0) {
        /** 如果有选中项，则取消全选 */
        console.log('取消全选，清空所有选中项')
        setSelectedKeys(new Set())
      } else {
        /** 否则全选 */
        console.log('全选，选中所有项')
        const allKeys = new Set(allPlugins.map(plugin => plugin.name))
        setSelectedKeys(allKeys as Set<string>)
      }
    }
  }, [allPlugins, selectedKeys])

  /**
   * 通用的插件管理操作处理函数
   * @param params 插件管理参数
   * @param onComplete 操作完成后的回调函数
   */
  const handlePluginOperation = useCallback((params: PluginAdminParams, onComplete?: () => void) => {
    /** 状态更新函数 */
    const stateUpdater = {
      setIsLogModalOpen,
      setTaskId,
      setTaskLogs,
      setTaskName,
    }

    /** 调用创建任务函数 */
    createUpdatePlugins(
      params,
      stateUpdater,
      undefined,
      onComplete
    )
  }, [])

  /**
   * 获取当前选中的插件数量
   */
  const getSelectedCount = useCallback(() => {
    return selectedKeys.size
  }, [selectedKeys])

  /**
   * 处理更新全部按钮点击
   */
  const handleUpdateAll = useCallback(() => {
    setUpdateModalOpen(true)
  }, [])

  /**
   * 处理更新选中插件按钮点击
   */
  const handleUpdateSelected = useCallback(() => {
    if (selectedKeys.size === 0) return

    // 查找选中的插件详情
    const selectedPlugins = allPlugins.filter(plugin => selectedKeys.has(plugin.name))

    // 准备更新参数
    const params: PluginAdminParams = {
      type: 'update',
      name: '更新选中插件',
      target: selectedPlugins.map(plugin => ({
        type: plugin.type,
        name: plugin.name,
        force: false,
        version: 'latest',
      })),
    }

    // 使用通用处理函数
    handlePluginOperation(params)
  }, [allPlugins, selectedKeys, handlePluginOperation])

  /**
   * 处理卸载选中插件按钮点击
   */
  const handleUninstallSelected = useCallback(() => {
    if (selectedKeys.size === 0) return

    // 查找选中的插件详情
    const selectedPlugins = allPlugins.filter(plugin => selectedKeys.has(plugin.name))

    // 准备卸载参数
    const params: PluginAdminParams = {
      type: 'uninstall',
      name: '卸载选中插件',
      target: selectedPlugins.map(plugin => ({
        type: plugin.type as 'npm' | 'git' | 'app',
        name: plugin.name,
      })),
    }

    // 使用通用处理函数
    handlePluginOperation(params)
  }, [allPlugins, selectedKeys, handlePluginOperation])

  /**
   * 处理单个插件更新
   * @param plugin 要更新的插件
   */
  const handleUpdateSinglePlugin = useCallback((plugin: PluginAdminListResponse) => {
    // 准备更新参数
    const params: PluginAdminParams = {
      type: 'update',
      name: `更新插件 ${plugin.name}`,
      target: [{
        type: plugin.type,
        name: plugin.name,
        force: false,
        version: 'latest',
      }],
    }

    // 使用通用处理函数
    handlePluginOperation(params)
  }, [handlePluginOperation])

  /**
   * 处理单个插件强制更新
   * @param plugin 要强制更新的插件
   */
  const handleForceUpdateSinglePlugin = useCallback((plugin: PluginAdminListResponse) => {
    // 强制更新仅对git类型插件有效
    if (plugin.type !== 'git') return

    // 准备强制更新参数
    const params: PluginAdminParams = {
      type: 'update',
      name: `强制更新插件 ${plugin.name}`,
      target: [{
        type: 'git',
        name: plugin.name,
        force: true,
        version: 'latest',
      }],
    }

    // 使用通用处理函数
    handlePluginOperation(params)
  }, [handlePluginOperation])

  /**
   * 处理单个插件卸载
   * @param plugin 要卸载的插件
   */
  const handleUninstallSinglePlugin = useCallback((plugin: PluginAdminListResponse) => {
    // 准备卸载参数
    const params: PluginAdminParams = {
      type: 'uninstall',
      name: `卸载插件 ${plugin.name}`,
      target: [{
        type: plugin.type as 'npm' | 'git' | 'app',
        name: plugin.name,
      }],
    }

    // 使用通用处理函数
    handlePluginOperation(params)
  }, [handlePluginOperation])

  /**
   * 处理更新选项确认
   * @param params 插件管理参数
   */
  const handleUpdateOptionsConfirm = useCallback((params: PluginAdminParams) => {
    // 使用通用处理函数，并传递关闭模态框的回调
    handlePluginOperation(params, () => setUpdateModalOpen(false))
  }, [handlePluginOperation, setUpdateModalOpen])

  /**
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
    if (allPlugins.length === 0 && delayEmptyResult) {
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
    const skipLazyLoading = allPlugins.length <= 30

    return (
      <TableContent
        plugins={allPlugins}
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
        onUpdatePlugin={handleUpdateSinglePlugin}
        onForceUpdatePlugin={handleForceUpdateSinglePlugin}
        onUninstallPlugin={handleUninstallSinglePlugin}
      />
    )
  }

  return (
    <div>
      <div className='flex gap-3 justify-end mb-4'>
        <Button
          color='success'
          size='sm'
          variant='flat'
          className='glass-effect'
          radius='full'
          startContent={<TbArrowsUp className='text-lg' />}
          isDisabled={getSelectedCount() === 0 || (!allPlugins || allPlugins.length === 0)}
          onPress={getSelectedCount() === 0 ? handleUpdateAll : handleUpdateSelected}
        >
          {getSelectedCount() === 0 ? '更新全部' : '更新选中'}
        </Button>
        <Button
          color='danger'
          size='sm'
          variant='flat'
          className='glass-effect'
          radius='full'
          startContent={<TbTrash className='text-lg' />}
          isDisabled={getSelectedCount() === 0}
          onPress={handleUninstallSelected}
        >
          卸载选中
        </Button>
        <Button
          color='primary'
          size='sm'
          variant='flat'
          className='glass-effect'
          radius='full'
          startContent={<TbRefresh className='text-lg' />}
          isLoading={remoteLoading}
          onPress={fetchPlugins}
        >
          刷新
        </Button>
      </div>

      {renderTableContent()}

      {/* 更新选项对话框 */}
      <UpdateOptionsModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onConfirm={handleUpdateOptionsConfirm}
      />

      {/* 任务日志模态框 */}
      <TaskLogModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false)
          setTaskId('')
          setTaskLogs([])
          fetchPlugins() // 刷新插件列表
        }}
        taskId={taskId}
        taskName={taskName}
        initialLogs={taskLogs}
      />
    </div>
  )
}

export default LocalPlugin
