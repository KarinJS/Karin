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

// 更新类型定义
type UpdateType = 'all' | 'selected'

// 更新依赖参数接口
interface UpdateParams {
  type: UpdateType
  data: Array<{ name: string, version: string }> | null
}

export default function DependenciesPage () {
  const [dependencies, setDependencies] = useState<Dependency[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [selectedDependency, setSelectedDependency] = useState<Dependency | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({})
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>([])

  /**
   * 获取依赖列表
   * @param isForceRefresh - 是否强制刷新
   */
  const fetchDependencies = useCallback(async (isForceRefresh: boolean) => {
    setLoading(true)
    try {
      const res = await getDependencies(isForceRefresh)
      if (res.success) {
        setDependencies(res.data || [])
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

  // 使用useMemo优化依赖筛选，避免不必要的重新计算
  const filteredDependencies = useMemo(() => {
    let filtered = dependencies

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
  }, [dependencies, searchTerm, filterMode])

  // 统计信息使用useMemo缓存计算结果
  const stats = useMemo(() => {
    const total = dependencies.length
    const plugins = dependencies.filter(d => d.isKarinPlugin).length
    const updatable = dependencies.filter(d => hasUpdate(d)).length
    return { total, plugins, updatable }
  }, [dependencies])

  // 打开设置模态框
  const openSettings = useCallback((dependency: Dependency) => {
    setSelectedDependency(dependency)
    setSelectedVersion(dependency.current)
    setIsSettingsOpen(true)
  }, [])

  /**
   * 格式化别名依赖的版本号
   * @param dependency 依赖对象
   * @param version 版本号
   * @returns 格式化后的版本号
   */
  const formatVersionForAlias = useCallback((dependency: Dependency, version: string): string => {
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

      // 准备更新数据
      const updateData = [{
        name: selectedDependency.name,
        version: formattedVersion,
      }]

      // 调用更新函数
      updateDependencies({
        type: 'selected',
        data: updateData,
      })

      setIsSettingsOpen(false)
    }
  }, [selectedDependency, selectedVersion, formatVersionForAlias])

  // 更新依赖版本
  const updateDependencyVersion = useCallback((dependencyName: string, version: string) => {
    // 查找依赖对象
    const dependency = dependencies.find(d => d.name === dependencyName)
    if (!dependency) return

    // 处理别名依赖的版本格式
    const formattedVersion = formatVersionForAlias(dependency, version)

    setPendingChanges(prev => ({
      ...prev,
      [dependencyName]: formattedVersion,
    }))
  }, [dependencies, formatVersionForAlias])

  // 选择单个依赖
  const handleSelectDependency = useCallback((name: string, isSelected: boolean) => {
    setSelectedDependencies(prev =>
      isSelected
        ? [...prev, name]
        : prev.filter(dep => dep !== name)
    )
  }, [])

  // 全选/取消全选
  const handleSelectAll = useCallback((isSelected: boolean) => {
    setSelectedDependencies(
      isSelected
        ? filteredDependencies.map(dep => dep.name)
        : []
    )
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
        const newDependencies = [...dependencies]
        const updatedPackages: string[] = []

        // 更新所有可更新的依赖到最新版本
        newDependencies.forEach(dep => {
          if (hasUpdate(dep)) {
            const latestVersion = dep.latest[dep.latest.length - 1]
            // 处理别名依赖的版本格式
            const formattedVersion = formatVersionForAlias(dep, latestVersion)
            dep.current = formattedVersion
            updatedPackages.push(dep.name)
          }
        })

        setDependencies(newDependencies)
        setSelectedDependencies([])
        setPendingChanges({})

        alert(`已更新 ${updatedPackages.length} 个依赖到最新版本`)
      } else if (params.type === 'selected' && params.data) {
        const newDependencies = [...dependencies]

        params.data.forEach(item => {
          const index = newDependencies.findIndex(d => d.name === item.name)
          if (index !== -1) {
            newDependencies[index].current = item.version
          }
        })

        setDependencies(newDependencies)
        setSelectedDependencies([])
        setPendingChanges({})

        alert(`已更新 ${params.data.length} 个依赖`)
      }

      setLoading(false)
    }, 1000)
  }

  // 处理更新按钮点击
  const handleUpdateClick = () => {
    // 如果有选中的依赖
    if (selectedDependencies.length > 0) {
      // 准备更新数据
      const updateData = selectedDependencies.map(name => {
        // 查找依赖对象
        const dep = dependencies.find(d => d.name === name)

        if (!dep) return { name, version: '' }

        // 如果有待更改版本，使用待更改版本，否则使用最新版本
        const version = pendingChanges[name] ||
          (dep ? formatVersionForAlias(dep, dep.latest[dep.latest.length - 1]) : '')

        return { name, version }
      })

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
      const newDependencies = dependencies.filter(dep => !packageNames.includes(dep.name))
      setDependencies(newDependencies)
      setSelectedDependencies([])
      setPendingChanges({})

      alert(`已卸载 ${packageNames.length} 个依赖`)
      setLoading(false)
    }, 1000)
  }

  // 处理卸载按钮点击
  const handleUninstallClick = () => {
    if (selectedDependencies.length > 0) {
      uninstallDependencies(selectedDependencies)
    }
  }

  // 检查是否所有依赖都被选中
  const isAllSelected = useMemo(
    () => filteredDependencies.length > 0 && filteredDependencies.every(d => selectedDependencies.includes(d.name)),
    [filteredDependencies, selectedDependencies]
  )

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
            >
              {selectedDependencies.length > 0 && !isAllSelected ? '更新选中' : '更新全部'}
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
        {({ processedDependencies, isLoading, progress }) => (
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
              pendingChanges={pendingChanges}
              selectedDependencies={selectedDependencies}
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
