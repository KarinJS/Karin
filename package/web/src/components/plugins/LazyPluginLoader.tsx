/* eslint-disable @stylistic/indent */
import { PluginAdminListResponse } from 'node-karin'
import { useEffect, useState, useCallback, useRef, memo } from 'react'

interface LazyPluginLoaderProps {
  /**
   * 原始插件数据
   */
  plugins: PluginAdminListResponse[]

  /**
   * 初始批量加载的数量
   */
  initialBatchSize?: number

  /**
   * 后续每批加载的数量
   */
  batchSize?: number

  /**
   * 滚动阈值，当距离底部小于这个值时加载下一批
   */
  threshold?: number

  /**
   * 虚拟列表的显示高度，启用固定高度的虚拟列表功能
   */
  fixedHeight?: number

  /**
   * 单项的估算高度，用于虚拟滚动
   */
  itemHeight?: number

  /**
   * 加载后的数据渲染函数
   */
  children: (data: {
    processedPlugins: PluginAdminListResponse[]
    isLoading: boolean
    progress: number
    visiblePlugins?: PluginAdminListResponse[] // 仅可见的插件项
    containerProps?: React.HTMLAttributes<HTMLDivElement> // 虚拟列表容器属性
  }) => React.ReactNode
}

/**
 * 比较两个插件列表是否有实质性变化（忽略选中状态属性）
 * @param plugins1 - 第一个插件列表
 * @param plugins2 - 第二个插件列表
 * @returns 是否有实质性变化
 */
const hasPluginsChanged = (plugins1: PluginAdminListResponse[], plugins2: PluginAdminListResponse[]): boolean => {
  if (plugins1.length !== plugins2.length) return true

  // 只比较关键属性，忽略UI状态类属性
  for (let i = 0; i < plugins1.length; i++) {
    const plugin1 = plugins1[i]
    const plugin2 = plugins2[i]

    if (plugin1.id !== plugin2.id ||
      plugin1.name !== plugin2.name ||
      plugin1.version !== plugin2.version ||
      plugin1.type !== plugin2.type) {
      return true
    }
  }

  return false
}

/**
 * 延迟加载插件数据组件
 * 该组件实现了插件数据的批量加载，优化大量插件时的初始加载性能
 */
const LazyPluginLoader = memo(({
  plugins,
  initialBatchSize = 50,
  batchSize = 30,
  threshold = 300,
  fixedHeight,
  itemHeight = 60,
  children,
}: LazyPluginLoaderProps) => {
  /** 已处理的插件 */
  const [processedCount, setProcessedCount] = useState(0)
  /** 是否正在加载 */
  const [isLoading, setIsLoading] = useState(false)
  /** 保存已处理的插件 */
  const [processedPlugins, setProcessedPlugins] = useState<PluginAdminListResponse[]>([])
  /** 可见范围的起始索引 */
  const [startIndex, setStartIndex] = useState(0)
  /** 可见范围的结束索引 */
  const [endIndex, setEndIndex] = useState(0)
  /** 滚动容器的引用 */
  const containerRef = useRef<HTMLDivElement>(null)
  /** 用于追踪滚动监听器是否已添加 */
  const scrollListenerAdded = useRef(false)
  /** 缓存插件数组的引用，避免无谓的重新处理 */
  const pluginsRef = useRef<PluginAdminListResponse[]>(plugins)
  /** 标记是否已执行初始加载 */
  const initialLoadDone = useRef(false)
  /** 是否处于插件选中状态变更中 */
  const isSelectingRef = useRef(false)
  /** 是否需要重新开始加载 */
  const needReloadRef = useRef(false)

  /** 当插件数组引用变化且内容确实不同时更新引用 */
  useEffect(() => {
    if (plugins !== pluginsRef.current) {
      /** 检查数组内容是否真的变化（忽略UI状态变化），避免不必要的重置 */
      const hasSubstantialChanges = hasPluginsChanged(plugins, pluginsRef.current)

      /** 如果只是选中状态变化，避免触发重载 */
      if (!hasSubstantialChanges) {
        /** 记录当前是选中状态变更 */
        isSelectingRef.current = true

        /** 如果插件已经加载完成，更新处理后的插件但保持加载进度 */
        if (processedCount > 0) {
          /** 更新所有已经加载的插件 */
          setProcessedPlugins(prev => {
            const result = [...prev]
            /** 使用映射更新 */
            const idMap = new Map(plugins.map(p => [p.id, p]))

            for (let i = 0; i < result.length; i++) {
              const updated = idMap.get(result[i].id)
              if (updated) {
                result[i] = updated
              }
            }

            return result
          })
        }

        /** 更新引用但不重置加载进度 */
        pluginsRef.current = plugins
      } else {
        /** 有实质性变化，需要重置 */
        needReloadRef.current = true
        pluginsRef.current = plugins
        setProcessedCount(0)
        setProcessedPlugins([])
        initialLoadDone.current = false
      }
    }
  }, [plugins, processedCount])

  /**
   * 加载下一批数据
   */
  const loadNextBatch = useCallback(() => {
    const pluginList = pluginsRef.current
    if (processedCount >= pluginList.length) return

    setIsLoading(true)

    /** 使用setTimeout代替requestIdleCallback，确保在所有环境下都能正常执行 */
    setTimeout(() => {
      const nextBatchSize = processedCount === 0 ? initialBatchSize : batchSize
      const endIndex = Math.min(processedCount + nextBatchSize, pluginList.length)
      const nextBatch = pluginList.slice(0, endIndex)

      /** 确保即使数组为空也会设置，防止UI卡在加载状态 */
      setProcessedPlugins(nextBatch)
      setProcessedCount(endIndex)
      setIsLoading(false)

      /** 重置选中状态标记 */
      isSelectingRef.current = false
      needReloadRef.current = false

      // 更新可见范围
      updateVisibleRange()
    }, 0)
  }, [processedCount, initialBatchSize, batchSize])

  /**
   * 监听滚动事件，在接近底部时加载更多数据
   */
  const handleScroll = useCallback(() => {
    const pluginList = pluginsRef.current
    if (isLoading || processedCount >= pluginList.length) return

    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    /** 当滚动到接近底部时加载下一批 */
    if (documentHeight - scrollY - windowHeight < threshold) {
      loadNextBatch()
    }

    // 更新可见范围
    updateVisibleRange()
  }, [isLoading, processedCount, threshold, loadNextBatch])

  /**
   * 更新可见的插件范围
   */
  const updateVisibleRange = useCallback(() => {
    if (!fixedHeight || !containerRef.current) return

    const scrollTop = containerRef.current.scrollTop
    const containerHeight = containerRef.current.clientHeight

    // 计算可见范围
    const visibleStart = Math.floor(scrollTop / itemHeight)
    const visibleEnd = Math.min(
      processedPlugins.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight)
    )

    // 增加上下缓冲区，提前加载一些项目，使滚动更流畅
    const bufferSize = 5
    const rangeStart = Math.max(0, visibleStart - bufferSize)
    const rangeEnd = Math.min(processedPlugins.length - 1, visibleEnd + bufferSize)

    setStartIndex(rangeStart)
    setEndIndex(rangeEnd)
  }, [fixedHeight, itemHeight, processedPlugins.length])

  /** 初始加载 */
  useEffect(() => {
    const pluginList = pluginsRef.current

    /** 如果当前正在选中状态变更中，不执行初始加载 */
    if (isSelectingRef.current && !needReloadRef.current) return

    /** 如果数组为空，直接设置空数组，避免卡在加载状态 */
    if (pluginList.length === 0) {
      setProcessedPlugins([])
      setProcessedCount(0)
      initialLoadDone.current = true
      return
    }

    /** 防止重复加载 */
    if (initialLoadDone.current && !needReloadRef.current) return

    /** 如果插件列表很小（小于initialBatchSize），直接加载所有数据 */
    if (pluginList.length <= initialBatchSize) {
      setProcessedPlugins([...pluginList])
      setProcessedCount(pluginList.length)
      initialLoadDone.current = true

      // 更新可见范围
      updateVisibleRange()
    } else if (processedCount === 0) {
      /** 只有在需要重新开始加载时才调用loadNextBatch */
      loadNextBatch()
      initialLoadDone.current = true
    }
  }, [initialBatchSize, loadNextBatch, processedCount, plugins.length, updateVisibleRange])

  /** 当第一批加载完成后，检查是否需要继续加载更多数据 */
  useEffect(() => {
    /** 如果正在选中状态变更中，不继续加载 */
    if (isSelectingRef.current) return

    const pluginList = pluginsRef.current
    /** 如果已加载的插件数量小于总数且不是正在加载中，继续加载 */
    if (processedCount > 0 && processedCount < pluginList.length && !isLoading) {
      /** 使用短延迟，确保UI有时间更新 */
      const timer = setTimeout(loadNextBatch, 100)
      return () => clearTimeout(timer)
    }
  }, [processedCount, isLoading, loadNextBatch])

  /** 添加滚动监听 */
  useEffect(() => {
    /** 全局滚动监听，用于批量加载功能 */
    if (!scrollListenerAdded.current) {
      window.addEventListener('scroll', handleScroll)
      scrollListenerAdded.current = true

      return () => {
        window.removeEventListener('scroll', handleScroll)
        scrollListenerAdded.current = false
      }
    }
  }, [handleScroll])

  /** 添加对容器滚动的监听，用于虚拟列表功能 */
  useEffect(() => {
    if (fixedHeight && containerRef.current) {
      const container = containerRef.current

      // 初始化可见范围
      updateVisibleRange()

      // 监听容器内滚动
      container.addEventListener('scroll', updateVisibleRange)

      return () => {
        container.removeEventListener('scroll', updateVisibleRange)
      }
    }
  }, [fixedHeight, updateVisibleRange, processedPlugins])

  /** 计算加载进度 */
  const progress = pluginsRef.current.length > 0
    ? Math.floor((processedCount / pluginsRef.current.length) * 100)
    : 100

  /** 准备虚拟列表所需的容器属性 */
  const containerProps = fixedHeight
    ? {
      ref: containerRef,
      style: {
        height: `${fixedHeight}px`,
        overflowY: 'auto' as const,
        position: 'relative' as const,
      },
      onScroll: updateVisibleRange,
    }
    : undefined

  /** 获取可见的插件列表 */
  const visiblePlugins = fixedHeight
    ? processedPlugins.slice(startIndex, endIndex + 1)
    : undefined

  /** 使用children渲染结果 */
  return (
    <>
      {children({
        processedPlugins,
        isLoading,
        progress,
        visiblePlugins,
        containerProps,
      })}
    </>
  )
})

LazyPluginLoader.displayName = 'LazyPluginLoader'

export default LazyPluginLoader
