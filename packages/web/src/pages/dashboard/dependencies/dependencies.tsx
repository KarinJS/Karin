import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@heroui/button'
import { IoRefresh } from 'react-icons/io5'
import { LuPackage, LuDownload, LuTrash2 } from 'react-icons/lu'
import {
  DependencyTable,
  DependencySettings,
  DependencyFilter,
  LazyDependencyLoader,
} from '../../../components/dependencies'
import { StatCard } from '../../../components/card'
import {
  FilterMode,
  hasUpdate,
} from './dependencies.utils'
import { getDependencies } from '@/request/dependencies'
import { toast } from 'react-hot-toast'
import { Progress } from '@heroui/progress'

import type { Dependency } from 'node-karin'

/**
 * 增强依赖项接口，包含UI状态
 */
interface EnhancedDependency extends Dependency {
  /** 是否被选中 */
  isSelected: boolean
  /** 用户选择的目标版本（如果有） */
  targetVersion: string | null
}

/**
 * 更新类型定义
 */
type UpdateType = 'all' | 'selected'

/**
 * 更新依赖参数接口
 */
interface UpdateParams {
  /** 更新类型 */
  type: UpdateType
  /** 需要更新的依赖数据 */
  data: Array<{ name: string, version: string }> | null
}

export default function DependenciesPage () {
  const [dependenciesData, setDependenciesData] = useState<EnhancedDependency[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [selectedDependency, setSelectedDependency] = useState<EnhancedDependency | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<string>('')

  /**
   * 获取依赖列表
   * @param isForceRefresh - 是否强制刷新
   */
  const fetchDependencies = useCallback(async (isForceRefresh: boolean) => {
    setLoading(true)
    try {
      const res = await getDependencies(isForceRefresh)
      if (res.success) {
        // 转换为增强依赖对象
        const enhancedDeps = (res.data || []).map(dep => ({
          ...dep,
          isSelected: false,
          targetVersion: null,
        }))
        setDependenciesData(enhancedDeps)
      } else {
        toast.error(res.message || '获取依赖列表失败')
      }
    } catch (error) {
      toast.error('获取依赖列表时发生错误')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 初始加载依赖列表
  useEffect(() => {
    fetchDependencies(false)
  }, [fetchDependencies])

  // 过滤后的依赖列表
  const filteredDependencies = useMemo(() => {
    let filtered = dependenciesData

    if (searchTerm) {
      filtered = filtered.filter(dep =>
        dep.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 根据过滤模式进行筛选
    switch (filterMode) {
      case 'plugins':
        filtered = filtered.filter(dep => dep.isKarinPlugin)
        break
      case 'updatable':
        filtered = filtered.filter(dep => hasUpdate(dep))
        break
      case 'all':
      default:
        // 显示全部依赖，不进行过滤
        break
    }

    return filtered
  }, [dependenciesData, searchTerm, filterMode])

  // 统计信息
  const stats = useMemo(() => {
    const total = dependenciesData.length
    const plugins = dependenciesData.filter(d => d.isKarinPlugin).length
    const updatable = dependenciesData.filter(d => hasUpdate(d)).length
    return { total, plugins, updatable }
  }, [dependenciesData])

  // 选中的依赖列表
  const selectedDependencies = useMemo(() => {
    return filteredDependencies.filter(dep => dep.isSelected)
  }, [filteredDependencies])

  // 打开设置模态框
  const openSettings = useCallback((dependency: Dependency) => {
    // 找到并使用增强版本的依赖对象
    const enhancedDep = dependenciesData.find(dep => dep.name === dependency.name)
    if (enhancedDep) {
      setSelectedDependency(enhancedDep)
      setSelectedVersion(enhancedDep.current)
      setIsSettingsOpen(true)
    }
  }, [dependenciesData])

  /**
   * 格式化别名依赖的版本号
   * @param dependency 依赖对象
   * @param version 版本号
   * @returns 格式化后的版本号
   */
  const formatVersionForAlias = useCallback((dependency: EnhancedDependency, version: string): string => {
    // 如果name和from不一样，表示是别名依赖
    if (dependency.from && dependency.name !== dependency.from) {
      return `npm:${dependency.from}@${version}`
    }
    return version
  }, [])

  // 保存依赖版本变更
  const saveDependencyVersion = useCallback(() => {
    if (selectedDependency) {
      // 如果版本没有变化，直接关闭模态框
      if (selectedVersion === selectedDependency.current) {
        setIsSettingsOpen(false)
        return
      }

      // 处理别名依赖的版本格式
      const formattedVersion = formatVersionForAlias(selectedDependency, selectedVersion)

      // 更新依赖数据
      setDependenciesData(prev => prev.map(dep =>
        dep.name === selectedDependency.name
          ? { ...dep, targetVersion: formattedVersion, isSelected: true }
          : dep
      ))

      setIsSettingsOpen(false)
    }
  }, [selectedDependency, selectedVersion, formatVersionForAlias])

  // 更新依赖版本
  const updateDependencyVersion = useCallback((dependencyName: string, version: string) => {
    // 更新依赖数据中的目标版本
    setDependenciesData(prev => prev.map(dep =>
      dep.name === dependencyName
        ? { ...dep, targetVersion: formatVersionForAlias(dep, version) }
        : dep
    ))
  }, [formatVersionForAlias])

  // 选择单个依赖
  const handleSelectDependency = useCallback((name: string, isSelected: boolean) => {
    setDependenciesData(prev => prev.map(dep =>
      dep.name === name ? { ...dep, isSelected } : dep
    ))
  }, [])

  // 全选/取消全选
  const handleSelectAll = useCallback((isSelected: boolean) => {
    setDependenciesData(prev => prev.map(dep => {
      // 只更新当前过滤视图中的依赖
      const isInFilteredView = filteredDependencies.some(fd => fd.name === dep.name)
      return isInFilteredView ? { ...dep, isSelected } : dep
    }))
  }, [filteredDependencies])

  /**
   * 模拟更新依赖
   * @param params 更新参数
   */
  const updateDependencies = (params: UpdateParams) => {
    console.log('updateDependencies', params)
    setLoading(true)

    // 模拟API调用延迟
    setTimeout(() => {
      // 处理全部更新
      if (params.type === 'all') {
        const newDependencies = [...dependenciesData]
        const updatedPackages: string[] = []

        // 准备所有依赖的最新版本数据
        newDependencies.forEach(dep => {
          // 只有当有最新版本时才更新
          if (dep.latest.length > 0) {
            updatedPackages.push(dep.name)
            const actualLatestVersion = dep.latest[dep.latest.length - 1]
            dep.current = formatVersionForAlias(dep, actualLatestVersion)
            dep.targetVersion = null // 重置目标版本
            dep.isSelected = false   // 重置选中状态
          }
        })

        setDependenciesData(newDependencies)
        alert(`已更新 ${updatedPackages.length} 个依赖到最新版本`)
      } else if (params.type === 'selected' && params.data) {
        const newDependencies = [...dependenciesData]
        let updatedCount = 0

        // 更新指定依赖的版本
        params.data.forEach(item => {
          const depIndex = newDependencies.findIndex(d => d.name === item.name)
          if (depIndex !== -1) {
            updatedCount++
            const dep = newDependencies[depIndex]

            // 如果版本是"latest"或者包含"@latest"，则使用最新实际版本号
            if (item.version === 'latest' || item.version.includes('@latest')) {
              if (dep.latest.length > 0) {
                const actualLatestVersion = dep.latest[dep.latest.length - 1]
                dep.current = formatVersionForAlias(dep, actualLatestVersion)
              }
            } else {
              // 使用指定的版本
              dep.current = item.version
            }

            // 重置状态
            dep.targetVersion = null
            dep.isSelected = false
          }
        })

        setDependenciesData(newDependencies)
        alert(`已更新 ${updatedCount} 个依赖`)
      }

      setLoading(false)
    }, 1000)
  }

  // 处理更新按钮点击
  const handleUpdateClick = () => {
    // 获取选中的依赖
    const selectedDeps = dependenciesData.filter(dep => dep.isSelected)

    // 检查是否处于总依赖模式且选中了所有依赖且没有指定自定义版本
    const isAllMode = filterMode === 'all'
    const isAllSelected = selectedDeps.length === dependenciesData.length
    const hasNoCustomVersions = selectedDeps.every(dep => dep.targetVersion === null)

    // 如果满足全部条件，走更新全部路径
    if (isAllMode && isAllSelected && hasNoCustomVersions) {
      updateDependencies({
        type: 'all',
        data: null,
      })
      return
    }

    // 如果有选中的依赖
    if (selectedDeps.length > 0) {
      // 准备更新数据
      const updateData = selectedDeps.map(dep => {
        // 优先使用用户明确选择的目标版本
        if (dep.targetVersion) {
          return {
            name: dep.name,
            version: dep.targetVersion,
          }
        }

        // 否则使用latest
        return {
          name: dep.name,
          version: dep.from && dep.name !== dep.from
            ? `npm:${dep.from}@latest` // 别名依赖
            : 'latest',                  // 普通依赖
        }
      })

      console.log('更新选中的依赖', updateData, '选中的依赖数量', selectedDeps.length)

      // 调用更新函数
      updateDependencies({
        type: 'selected',
        data: updateData,
      })
    } else {
      // 如果没有选中依赖，则更新全部
      updateDependencies({
        type: 'all',
        data: null,
      })
    }
  }

  /**
   * 模拟卸载依赖
   * @param packageNames 要卸载的依赖名称数组
   */
  const uninstallDependencies = (packageNames: string[]) => {
    if (packageNames.length === 0) return

    setLoading(true)

    // 模拟API调用延迟
    setTimeout(() => {
      // 移除指定的依赖
      const newDependencies = dependenciesData.filter(dep => !packageNames.includes(dep.name))
      setDependenciesData(newDependencies)
      alert(`已卸载 ${packageNames.length} 个依赖`)
      setLoading(false)
    }, 1000)
  }

  // 处理卸载按钮点击
  const handleUninstallClick = () => {
    const selectedNames = dependenciesData
      .filter(dep => dep.isSelected)
      .map(dep => dep.name)

    if (selectedNames.length > 0) {
      uninstallDependencies(selectedNames)
    }
  }

  return (
    <div className='w-full p-4 sm:p-6 md:p-8 bg-background'>
      {/* 页面标题和信息卡片 */}
      <div className='mb-6 md:mb-10'>
        <div className='flex flex-wrap items-start justify-between gap-3 md:gap-6'>
          <div className='flex flex-col'>
            <h1 className='text-2xl md:text-3xl font-light text-foreground/90 tracking-tight'>依赖管理</h1>
            <p className='text-sm md:text-base text-default-500 mt-0.5 md:mt-1'>管理项目依赖包和Karin插件</p>
          </div>

          <div className='flex flex-wrap items-center gap-2 md:gap-3'>
            <Button
              color='default'
              startContent={<IoRefresh size={14} className='text-default-500' />}
              isLoading={loading}
              onPress={() => fetchDependencies(true)}
              size='sm'
              radius='full'
              variant='light'
              className='font-normal'
            >
              刷新
            </Button>

            {/* 显示"更新选中"或"更新全部"按钮 */}
            <Button
              color='success'
              startContent={<LuDownload size={14} />}
              onPress={handleUpdateClick}
              size='sm'
              radius='full'
              variant='flat'
              className='font-normal'
              isLoading={loading}
              isDisabled={filterMode !== 'all' && selectedDependencies.length === 0}
            >
              {selectedDependencies.length > 0 ? '更新选中' : '更新全部'}
            </Button>

            {/* 卸载按钮，只在有选中依赖时可用 */}
            <Button
              color='danger'
              startContent={<LuTrash2 size={14} />}
              onPress={handleUninstallClick}
              size='sm'
              radius='full'
              variant='flat'
              className='font-normal'
              isDisabled={selectedDependencies.length === 0}
              isLoading={loading}
            >
              卸载依赖
            </Button>
          </div>
        </div>

        {/* 信息统计卡片 */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6'>
          {/* 总依赖数卡片 */}
          <StatCard
            title='总依赖'
            count={stats.total}
            description='总依赖数'
            icon={
              <>
                <LuPackage size={16} className='md:hidden' />
                <LuPackage size={20} className='hidden md:block' />
              </>
            }
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
            icon={
              <>
                <LuPackage size={16} className='md:hidden' />
                <LuPackage size={20} className='hidden md:block' />
              </>
            }
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
            icon={
              <>
                <LuDownload size={16} className='md:hidden' />
                <LuDownload size={20} className='hidden md:block' />
              </>
            }
            gradient='bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20'
            border='border border-amber-200/50 dark:border-amber-800/30'
            iconBg='bg-amber-100 dark:bg-amber-700/30'
            textColor='text-amber-600 dark:text-amber-400'
            ringColor='ring-amber-400 dark:ring-amber-500'
            isActive={filterMode === 'updatable'}
            onClick={() => setFilterMode('updatable')}
          />
        </div>
      </div>

      {/* 搜索和过滤 */}
      <DependencyFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterMode={filterMode}
        count={filteredDependencies.length}
      />

      {/* 使用延迟加载组件优化依赖渲染 */}
      <LazyDependencyLoader
        dependencies={filteredDependencies}
        initialBatchSize={30}
        batchSize={20}
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
                  正在加载依赖 ({progress}%)...
                </div>
              </div>
            )}

            {/* 依赖表格 */}
            <DependencyTable
              dependencies={processedDependencies}
              pendingChanges={Object.fromEntries(
                dependenciesData
                  .filter(dep => dep.targetVersion !== null)
                  .map(dep => [dep.name, dep.targetVersion || ''])
              )}
              selectedDependencies={dependenciesData
                .filter(dep => dep.isSelected)
                .map(dep => dep.name)}
              updateDependencyVersion={updateDependencyVersion}
              openSettings={openSettings}
              onSelectDependency={handleSelectDependency}
              onSelectAll={handleSelectAll}
            />
          </>
        )}
      </LazyDependencyLoader>

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
    </div>
  )
}
