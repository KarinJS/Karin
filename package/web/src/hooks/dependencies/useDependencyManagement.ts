import { useState, useEffect, useMemo, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { getDependencies } from '@/request/dependencies'
import { hasUpdate } from '@/pages/dashboard/dependencies/dependencies.utils'
import type { Dependency } from 'node-karin'
import type { FilterMode } from '@/pages/dashboard/dependencies/dependencies.utils'

/**
 * 增强依赖项接口，包含UI状态
 */
export interface EnhancedDependency extends Dependency {
  /** 是否被选中 */
  isSelected: boolean
  /** 用户选择的目标版本（如果有） */
  targetVersion: string | null
}

/**
 * 依赖管理Hook，处理依赖数据、过滤、选择等操作
 * @returns 依赖管理相关状态和方法
 */
export const useDependencyManagement = () => {
  /** 依赖数据列表 */
  const [dependenciesData, setDependenciesData] = useState<EnhancedDependency[]>([])
  /** 搜索关键词 */
  const [searchTerm, setSearchTerm] = useState<string>('')
  /** 加载状态 */
  const [loading, setLoading] = useState<boolean>(true)
  /** 过滤模式 */
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  /** 是否为实时数据 */
  const [isRealTimeData, setIsRealTimeData] = useState<boolean>(false)

  /**
   * 获取依赖列表
   * @param isForceRefresh - 是否强制刷新
   */
  const fetchDependencies = useCallback(async (isForceRefresh: boolean) => {
    setLoading(true)
    try {
      const res = await getDependencies(isForceRefresh)
      if (!res.success) {
        toast.error(res.message || '获取依赖列表失败')
        return
      }

      // 转换为增强依赖对象
      const enhancedDeps = (res.data || []).map(dep => ({
        ...dep,
        isSelected: false,
        targetVersion: null,
      }))
      setDependenciesData(enhancedDeps)

      // 更新数据状态，如果强制刷新则为实时数据
      setIsRealTimeData(isForceRefresh)
    } catch (error) {
      toast.error('获取依赖列表时发生错误')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 初始加载依赖列表和从URL读取初始过滤模式
   */
  useEffect(() => {
    // 从URL获取filter参数
    const searchParams = new URLSearchParams(location.search)
    const filterParam = searchParams.get('filter') as FilterMode | null

    // 如果URL中有有效的filter参数，则使用它
    if (filterParam && ['all', 'plugins', 'updatable'].includes(filterParam)) {
      setFilterMode(filterParam)
    }

    fetchDependencies(false)
  }, [fetchDependencies, location.search])

  /**
   * 过滤依赖列表
   * @param items - 依赖项列表
   * @param term - 搜索词
   * @returns 过滤后的列表
   */
  const filterBySearchTerm = useCallback((items: EnhancedDependency[], term: string) => {
    if (!term) return items
    return items.filter(dep => dep.name.toLowerCase().includes(term.toLowerCase()))
  }, [])

  /**
   * 根据模式过滤依赖
   * @param items - 依赖项列表
   * @param mode - 过滤模式
   * @returns 过滤后的列表
   */
  const filterByMode = useCallback((items: EnhancedDependency[], mode: FilterMode) => {
    switch (mode) {
      case 'plugins':
        return items.filter(dep => dep.isKarinPlugin)
      case 'updatable':
        return items.filter(dep => hasUpdate(dep))
      case 'all':
      default:
        return items
    }
  }, [])

  /**
   * 过滤后的依赖列表
   */
  const filteredDependencies = useMemo(() => {
    const searchFiltered = filterBySearchTerm(dependenciesData, searchTerm)
    return filterByMode(searchFiltered, filterMode)
  }, [dependenciesData, searchTerm, filterMode, filterBySearchTerm, filterByMode])

  /**
   * 检查依赖是否为本地依赖（带有link:或file:前缀）
   * @param dependency - 依赖对象
   * @returns 是否为本地依赖
   */
  const isLocalDependency = useCallback((dependency: EnhancedDependency): boolean => {
    const currentVersion = dependency.current || ''
    return currentVersion.startsWith('link:') || currentVersion.startsWith('file:')
  }, [])

  /**
   * 选中的依赖列表
   */
  const selectedDependencies = useMemo(() => {
    return dependenciesData.filter(dep => dep.isSelected).map(dep => dep.name)
  }, [dependenciesData])

  /**
   * 版本变更映射 - 从依赖数据中提取
   */
  const pendingVersionChanges = useMemo(() => {
    return Object.fromEntries(
      dependenciesData
        .filter(dep => dep.targetVersion !== null)
        .map(dep => [dep.name, dep.targetVersion || ''])
    )
  }, [dependenciesData])

  /**
   * 格式化别名依赖的版本号
   * @param dependency - 依赖对象
   * @param version - 版本号
   * @returns 格式化后的版本号
   */
  const formatVersionForAlias = useCallback((dependency: EnhancedDependency, version: string): string => {
    // 如果name和from不一样，表示是别名依赖
    if (dependency.from && dependency.name !== dependency.from) {
      return `npm:${dependency.from}@${version}`
    }
    return version
  }, [])

  /**
   * 选择单个依赖
   * @param name - 依赖名称
   * @param isSelected - 是否选中
   */
  const handleSelectDependency = useCallback((name: string, isSelected: boolean) => {
    setDependenciesData(prev => {
      const index = prev.findIndex(dep => dep.name === name)
      if (index === -1) return prev

      // 如果状态没有变化，直接返回原数组避免不必要的渲染
      if (prev[index].isSelected === isSelected) return prev

      const newArray = [...prev]
      newArray[index] = { ...newArray[index], isSelected }
      return newArray
    })
  }, [])

  /**
   * 全选/取消全选
   * @param isSelected - 是否选中
   */
  const handleSelectAll = useCallback((isSelected: boolean) => {
    setDependenciesData(prev => {
      // 创建一个Set来加速查找
      const filteredSet = new Set(filteredDependencies.map(dep => dep.name))

      // 创建一个本地依赖集合，加速判断
      const localDependencySet = new Set(
        filteredDependencies
          .filter(dep => isLocalDependency(dep))
          .map(dep => dep.name)
      )

      // 检查是否有需要变更的项
      let hasChanges = false
      for (const dep of prev) {
        // 仅考虑当前过滤视图中的非本地依赖
        if (filteredSet.has(dep.name) && !localDependencySet.has(dep.name) && dep.isSelected !== isSelected) {
          hasChanges = true
          break
        }
      }

      // 如果没有变化，直接返回原数据避免不必要的渲染
      if (!hasChanges) return prev

      // 只更新过滤视图中的依赖，排除本地依赖（link:或file:前缀）
      return prev.map(dep => {
        // 如果不在过滤视图中，保持不变
        if (!filteredSet.has(dep.name)) return dep

        // 如果是本地依赖，保持不变（始终不选中）
        if (localDependencySet.has(dep.name)) return dep

        return { ...dep, isSelected }
      })
    })
  }, [filteredDependencies, isLocalDependency])

  /**
   * 获取可更新的依赖（排除本地依赖）
   */
  const getUpdatableDependencies = useCallback(() => {
    return dependenciesData.filter(dep => {
      // 排除本地依赖（link:或file:前缀）
      if (isLocalDependency(dep)) return false
      return hasUpdate(dep)
    })
  }, [dependenciesData, isLocalDependency])

  /**
   * 更新依赖版本
   * @param dependencyName - 依赖名称
   * @param version - 需要更新的版本
   */
  const updateDependencyVersion = useCallback((dependencyName: string, version: string) => {
    // 更新依赖数据中的目标版本 - 使用函数式更新并只修改必要的部分
    setDependenciesData(prev => {
      const index = prev.findIndex(dep => dep.name === dependencyName)
      if (index === -1) return prev

      const newArray = [...prev]
      newArray[index] = {
        ...newArray[index],
        targetVersion: formatVersionForAlias(newArray[index], version),
      }
      return newArray
    })
  }, [formatVersionForAlias])

  /**
   * 设置过滤模式并更新 URL
   * @param mode - 过滤模式
   */
  const setFilterModeWithURL = useCallback((mode: FilterMode) => {
    setFilterMode(mode)

    // 更新 URL 参数
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('filter', mode)
    const newURL = `${location.pathname}?${searchParams.toString()}`
    window.history.replaceState(null, '', newURL)
  }, [location.pathname, location.search])

  /**
   * 统计信息
   */
  const stats = useMemo(() => {
    const total = dependenciesData.length
    const plugins = dependenciesData.filter(d => d.isKarinPlugin).length
    const updatable = getUpdatableDependencies().length
    return { total, plugins, updatable }
  }, [dependenciesData, getUpdatableDependencies])

  return {
    dependenciesData,
    setDependenciesData,
    searchTerm,
    setSearchTerm,
    loading,
    filterMode,
    setFilterMode: setFilterModeWithURL, // 使用带URL更新的版本替换
    filteredDependencies,
    stats,
    selectedDependencies,
    pendingVersionChanges,
    fetchDependencies,
    handleSelectDependency,
    handleSelectAll,
    updateDependencyVersion,
    formatVersionForAlias,
    isRealTimeData,
    isLocalDependency,
    getUpdatableDependencies,
  }
}
