import { toast } from 'react-hot-toast'
import { Progress } from '@heroui/progress'
import { useState, useCallback, memo, useMemo } from 'react'
import { LuPackage, LuDownload } from 'react-icons/lu'
import {
  DependencyTable,
  DependencySettings,
  DependencyFilter,
  LazyDependencyLoader,
  InstallDependencyModal,
} from '../../../components/dependencies'
import { StatCard } from '../../../components/card'
import TaskLogModal from '../../../components/dependencies/TaskLogModal'
import DependencyActionButtons from '../../../components/dependencies/DependencyActionButtons'

import {
  useDependencyManagement,
  useDependencyOperations,
  EnhancedDependency,
} from '@/hooks/dependencies'

import type { Dependency } from 'node-karin'

/**
 * 使用memo优化DependencyFilter组件
 */
const MemoizedDependencyFilter = memo(DependencyFilter)

/**
 * 使用memo优化DependencyTable组件
 */
const MemoizedDependencyTable = memo(DependencyTable)

/**
 * 使用memo优化LazyDependencyLoader组件
 */
const MemoizedLazyDependencyLoader = memo(LazyDependencyLoader)

/**
 * 依赖管理页面组件
 */
export default function DependenciesPage () {
  /** 设置模态框状态 */
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  /** 选中的依赖 */
  const [selectedDependency, setSelectedDependency] = useState<EnhancedDependency | null>(null)
  /** 选中的版本 */
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  /** 安装模态框状态 */
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false)

  // 使用依赖管理Hook
  const {
    dependenciesData,
    setDependenciesData,
    searchTerm,
    setSearchTerm,
    loading,
    filterMode,
    setFilterMode,
    filteredDependencies,
    stats,
    selectedDependencies,
    pendingVersionChanges,
    fetchDependencies,
    handleSelectDependency,
    handleSelectAll,
    updateDependencyVersion,
    formatVersionForAlias,
  } = useDependencyManagement()

  // 使用依赖操作Hook
  const {
    isOperating,
    isLogModalOpen,
    taskId,
    taskName,
    initialLogs,
    updateDependencies,
    uninstallDependencies,
    handleLogModalClose,
  } = useDependencyOperations(
    () => fetchDependencies(true)
  )

  /**
   * 打开设置模态框
   * @param dependency - 需要设置的依赖对象
   */
  const openSettings = useCallback((dependency: Dependency) => {
    // 找到并使用增强版本的依赖对象
    const enhancedDep = dependenciesData.find(dep => dep.name === dependency.name)
    if (!enhancedDep) return

    setSelectedDependency(enhancedDep)
    setSelectedVersion(enhancedDep.current)
    setIsSettingsOpen(true)
  }, [dependenciesData])

  /**
   * 保存依赖版本变更
   */
  const saveDependencyVersion = useCallback(() => {
    if (!selectedDependency) return

    /** 如果版本没有变化，直接关闭模态框 */
    if (selectedVersion === selectedDependency.current) {
      setIsSettingsOpen(false)
      return
    }

    /** 处理别名依赖的版本格式 */
    const formattedVersion = formatVersionForAlias(selectedDependency, selectedVersion)

    /** 更新依赖数据 - 使用函数式更新来确保状态更新准确 */
    setDependenciesData(prev => {
      const index = prev.findIndex(dep => dep.name === selectedDependency.name)
      if (index === -1) return prev

      const newArray = [...prev]
      newArray[index] = {
        ...newArray[index],
        targetVersion: formattedVersion,
        isSelected: true, // 自动选中该依赖
      }
      return newArray
    })

    setIsSettingsOpen(false)
  }, [selectedDependency, selectedVersion, formatVersionForAlias, setDependenciesData])

  /**
   * 创建依赖更新数据
   * @param dep - 依赖对象
   * @returns 格式化的更新数据
   */
  const createUpdateData = useCallback((dep: EnhancedDependency) => {
    // 优先使用用户明确选择的目标版本
    if (dep.targetVersion) {
      return {
        name: dep.name,
        version: dep.targetVersion,
      }
    }

    // 检查是否为别名依赖
    const isAlias = dep.from && dep.name !== dep.from

    // 否则使用latest
    return {
      name: dep.name,
      version: isAlias ? `npm:${dep.from}@latest` : 'latest',
    }
  }, [])

  /**
   * 处理更新按钮点击
   */
  const handleUpdateClick = useCallback(() => {
    // 获取选中的依赖
    const selectedDeps = dependenciesData.filter(dep => dep.isSelected)

    // 检查是否处于总依赖模式且选中了所有依赖且没有指定自定义版本
    const isAllMode = filterMode === 'all'
    const isAllSelected = selectedDeps.length === dependenciesData.length
    const hasNoCustomVersions = selectedDeps.every(dep => dep.targetVersion === null)

    // 如果满足全部条件或没有选中依赖，走更新全部路径
    if ((isAllMode && isAllSelected && hasNoCustomVersions) || selectedDeps.length === 0) {
      updateDependencies(true)
      return
    }

    // 准备更新数据
    const updateData = selectedDeps.map(createUpdateData)

    // 调用更新函数
    updateDependencies(false, updateData)
  }, [dependenciesData, filterMode, updateDependencies, createUpdateData])

  /**
   * 处理卸载按钮点击
   */
  const handleUninstallClick = useCallback(() => {
    const selectedNames = dependenciesData
      .filter(dep => dep.isSelected)
      .map(dep => dep.name)

    if (selectedNames.length === 0) {
      toast.error('请先选择要卸载的依赖')
      return
    }

    uninstallDependencies(selectedNames)
  }, [dependenciesData, uninstallDependencies])

  /**
   * 渲染图标
   * @param size - 移动端尺寸
   * @param largeSize - 桌面端尺寸
   * @param icon - 图标组件
   * @returns JSX元素
   */
  const renderIcon = useCallback((size: number, largeSize: number, Icon: typeof LuPackage) => (
    <>
      <Icon size={size} className='md:hidden' />
      <Icon size={largeSize} className='hidden md:block' />
    </>
  ), [])

  /**
   * 渲染统计卡片
   */
  const renderStatsCards = useMemo(() => (
    <>
      {/* 总依赖数卡片 */}
      <StatCard
        title='总依赖'
        count={stats.total}
        description='总依赖数'
        icon={renderIcon(16, 20, LuPackage)}
        gradient='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
        border='border border-blue-200/50 dark:border-blue-800/30'
        iconBg='bg-blue-100 dark:bg-blue-700/30'
        textColor='text-blue-600 dark:text-blue-400'
        ringColor='ring-blue-400 dark:ring-blue-500'
        isActive={filterMode === 'all'}
        onClick={() => setFilterMode('all')}
      />

      {/* Karin插件卡片 */}
      <StatCard
        title='Karin插件'
        count={stats.plugins}
        description='Karin 插件'
        icon={renderIcon(16, 20, LuPackage)}
        iconDot={<div className='absolute -top-1 -right-1 w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-green-500' />}
        gradient='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
        border='border border-green-200/50 dark:border-green-800/30'
        iconBg='bg-green-100 dark:bg-green-700/30'
        textColor='text-green-600 dark:text-green-400'
        ringColor='ring-green-400 dark:ring-green-500'
        isActive={filterMode === 'plugins'}
        onClick={() => setFilterMode('plugins')}
      />

      {/* 可更新卡片 */}
      <StatCard
        title='可更新'
        count={stats.updatable}
        description='可更新'
        icon={renderIcon(16, 20, LuDownload)}
        gradient='bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20'
        border='border border-amber-200/50 dark:border-amber-800/30'
        iconBg='bg-amber-100 dark:bg-amber-700/30'
        textColor='text-amber-600 dark:text-amber-400'
        ringColor='ring-amber-400 dark:ring-amber-500'
        isActive={filterMode === 'updatable'}
        onClick={() => setFilterMode('updatable')}
      />
    </>
  ), [stats, filterMode, setFilterMode, renderIcon])

  return (
    <div className='w-full p-4 sm:p-6 md:p-8 bg-background'>
      {/* 页面标题和信息卡片 */}
      <div className='mb-6 md:mb-10'>
        <div className='flex flex-wrap items-start justify-between gap-3 md:gap-6'>
          <div className='flex flex-col'>
            <h1 className='text-2xl md:text-3xl font-light text-foreground/90 tracking-tight flex items-center gap-2'>
              <LuPackage size={24} className='text-primary-500' />
              依赖管理
            </h1>
            <p className='text-sm md:text-base text-default-500 mt-0.5 md:mt-1'>
              (∩^o^)⊃━☆ 小包包们的幸福家园～让我们一起管理包包和Karin插件吧！(●'◡'●)
            </p>
          </div>

          {/* 使用抽象出的操作按钮组件 */}
          <DependencyActionButtons
            isLoading={loading}
            isOperating={isOperating}
            filterMode={filterMode}
            selectedCount={selectedDependencies.length}
            onRefresh={() => fetchDependencies(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onUpdate={handleUpdateClick}
            onUninstall={handleUninstallClick}
          />
        </div>

        {/* 信息统计卡片 */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6'>
          {renderStatsCards}
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className='space-y-4'>
        <MemoizedDependencyFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterMode={filterMode}
          count={filteredDependencies.length}
        />

        {/* 使用延迟加载组件优化依赖渲染 */}
        <MemoizedLazyDependencyLoader
          dependencies={filteredDependencies}
          initialBatchSize={2}
          batchSize={2}
        >
          {({ processedDependencies, progress }) => (
            <>
              {/* 显示加载进度 */}
              {progress < 100 && (
                <div className='mb-4'>
                  <Progress
                    value={progress}
                    color='primary'
                    size='sm'
                    radius='sm'
                    classNames={{
                      base: 'max-w-md',
                      track: 'drop-shadow-sm border border-default-100/50',
                      indicator: 'bg-gradient-to-r from-primary-500 to-primary-400',
                    }}
                    aria-label='加载依赖进度'
                  />
                  <div className='text-xs text-default-500 mt-1'>
                    正在加载依赖 ({progress}%)... 总计:{filteredDependencies.length}个依赖
                  </div>
                </div>
              )}

              {/* 依赖表格 */}
              <MemoizedDependencyTable
                dependencies={processedDependencies}
                pendingChanges={pendingVersionChanges}
                selectedDependencies={selectedDependencies}
                updateDependencyVersion={updateDependencyVersion}
                openSettings={openSettings}
                onSelectDependency={handleSelectDependency}
                onSelectAll={handleSelectAll}
              />
            </>
          )}
        </MemoizedLazyDependencyLoader>
      </div>

      {/* 设置模态框 */}
      <DependencySettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        dependency={selectedDependency}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        onSave={saveDependencyVersion}
        onSelectDependency={handleSelectDependency}
      />

      {/* 安装依赖模态框 */}
      <InstallDependencyModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onSuccess={() => {
          fetchDependencies(true)
        }}
      />

      {/* 任务日志模态框 */}
      <TaskLogModal
        isOpen={isLogModalOpen}
        onClose={handleLogModalClose}
        taskId={taskId}
        taskName={taskName}
        initialLogs={initialLogs}
      />
    </div>
  )
}
