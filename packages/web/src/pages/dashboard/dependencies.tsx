import { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { IoRefresh, IoSave } from 'react-icons/io5'
import { LuPackage, LuDownload } from 'react-icons/lu'
import {
  DependencyCard,
  DependencyTable,
  DependencySettings,
  DependencyUsageGuide,
  DependencyFilter,
} from '../../components/dependencies'
import {
  Dependency,
  FilterMode,
  mockDependencies,
  hasUpdate,
} from './dependencies.utils'

export default function DependenciesPage () {
  const [dependencies, setDependencies] = useState<Dependency[]>(mockDependencies)
  const [filteredDependencies, setFilteredDependencies] = useState<Dependency[]>(mockDependencies)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [selectedDependency, setSelectedDependency] = useState<Dependency | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [pendingChanges, setPendingChanges] = useState<{ [key: string]: string }>({})

  // 筛选依赖
  useEffect(() => {
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

    setFilteredDependencies(filtered)
  }, [dependencies, searchTerm, filterMode])

  // 模拟刷新依赖
  const refreshDependencies = () => {
    setLoading(true)
    // 模拟API请求延迟
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  // 打开设置模态框
  const openSettings = (dependency: Dependency) => {
    setSelectedDependency(dependency)
    setSelectedVersion(dependency.currentVersion)
    setIsSettingsOpen(true)
  }

  // 保存依赖版本变更
  const saveDependencyVersion = () => {
    if (selectedDependency) {
      const newPendingChanges = { ...pendingChanges }
      newPendingChanges[selectedDependency.name] = selectedVersion
      setPendingChanges(newPendingChanges)
      setIsSettingsOpen(false)
    }
  }

  // 更新依赖版本
  const updateDependencyVersion = (dependencyName: string, version: string) => {
    const newPendingChanges = { ...pendingChanges }
    newPendingChanges[dependencyName] = version
    setPendingChanges(newPendingChanges)
  }

  // 保存所有更改
  const saveChanges = () => {
    // 更新依赖版本
    const newDependencies = [...dependencies]
    Object.keys(pendingChanges).forEach(name => {
      const index = newDependencies.findIndex(d => d.name === name)
      if (index !== -1) {
        newDependencies[index].currentVersion = pendingChanges[name]
      }
    })

    setDependencies(newDependencies)
    setPendingChanges({})
    // 模拟保存操作
    alert('更改已保存')
  }

  // 获取统计信息
  const getStats = () => {
    const total = dependencies.length
    const plugins = dependencies.filter(d => d.isKarinPlugin).length
    const updatable = dependencies.filter(d => hasUpdate(d)).length
    return { total, plugins, updatable }
  }

  const stats = getStats()

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
              onPress={refreshDependencies}
              size='sm'
              radius='full'
              variant='light'
              className='font-normal'
            >
              刷新
            </Button>

            {Object.keys(pendingChanges).length > 0 && (
              <Button
                color='primary'
                startContent={<IoSave size={14} />}
                onPress={saveChanges}
                size='sm'
                radius='full'
                className='font-normal bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm'
              >
                保存 {Object.keys(pendingChanges).length} 项更改
              </Button>
            )}
          </div>
        </div>

        {/* 信息统计卡片 */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6'>
          {/* 总依赖数卡片 */}
          <DependencyCard
            title='总依赖'
            count={stats.total}
            description='总依赖数'
            icon={<>
              <LuPackage size={16} className='md:hidden' />
              <LuPackage size={20} className='hidden md:block' />
            </>}
            gradient='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
            border='border border-blue-200/50 dark:border-blue-800/30'
            iconBg='bg-blue-100 dark:bg-blue-700/30'
            textColor='text-blue-600 dark:text-blue-400'
            ringColor='ring-blue-400 dark:ring-blue-500'
            isActive={filterMode === 'all'}
            onClick={() => setFilterMode('all')}
          />

          {/* Karin插件卡片 */}
          <DependencyCard
            title='Karin插件'
            count={stats.plugins}
            description='Karin 插件'
            icon={<>
              <LuPackage size={16} className='md:hidden' />
              <LuPackage size={20} className='hidden md:block' />
            </>}
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
          <DependencyCard
            title='可更新'
            count={stats.updatable}
            description='可更新'
            icon={<>
              <LuDownload size={16} className='md:hidden' />
              <LuDownload size={20} className='hidden md:block' />
            </>}
            gradient='bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20'
            border='border border-amber-200/50 dark:border-amber-800/30'
            iconBg='bg-amber-100 dark:bg-amber-700/30'
            textColor='text-amber-600 dark:text-amber-400'
            ringColor='ring-amber-400 dark:ring-amber-500'
            isActive={filterMode === 'updatable'}
            onClick={() => setFilterMode('updatable')}
          />
        </div>

        {/* 提示信息区域 */}
        <DependencyUsageGuide />
      </div>

      {/* 搜索和过滤 */}
      <DependencyFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterMode={filterMode}
        count={filteredDependencies.length}
      />

      {/* 依赖表格 */}
      <DependencyTable
        dependencies={filteredDependencies}
        pendingChanges={pendingChanges}
        updateDependencyVersion={updateDependencyVersion}
        openSettings={openSettings}
      />

      {/* 设置模态框 */}
      <DependencySettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        dependency={selectedDependency}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        onSave={saveDependencyVersion}
      />
    </div>
  )
}
