import { useEffect, useState, useCallback, useRef, memo } from 'react'
import type { Dependency } from 'node-karin'

interface LazyDependencyLoaderProps {
  /**
   * 原始依赖数据
   */
  dependencies: Dependency[]

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
   * 加载后的数据渲染函数
   */
  children: (data: {
    processedDependencies: Dependency[]
    isLoading: boolean
    progress: number
  }) => React.ReactNode
}

/**
 * 比较两个依赖列表是否有实质性变化（忽略isSelected属性）
 * @param deps1 - 第一个依赖列表
 * @param deps2 - 第二个依赖列表
 * @returns 是否有实质性变化
 */
const hasDependenciesChanged = (deps1: Dependency[], deps2: Dependency[]): boolean => {
  if (deps1.length !== deps2.length) return true

  // 只比较关键属性，忽略UI状态类属性
  for (let i = 0; i < deps1.length; i++) {
    const dep1 = deps1[i]
    const dep2 = deps2[i]

    if (dep1.name !== dep2.name ||
      dep1.current !== dep2.current ||
      dep1.type !== dep2.type) {
      return true
    }
  }

  return false
}

/**
 * 延迟加载依赖数据组件
 * 该组件实现了依赖数据的批量加载，优化大量依赖时的初始加载性能
 */
const LazyDependencyLoader = memo(({
  dependencies,
  initialBatchSize = 50,
  batchSize = 30,
  threshold = 300,
  children,
}: LazyDependencyLoaderProps) => {
  /** 已处理的依赖 */
  const [processedCount, setProcessedCount] = useState(0)
  /** 是否正在加载 */
  const [isLoading, setIsLoading] = useState(false)
  /** 保存已处理的依赖 */
  const [processedDependencies, setProcessedDependencies] = useState<Dependency[]>([])
  /** 用于追踪滚动监听器是否已添加 */
  const scrollListenerAdded = useRef(false)
  /** 缓存依赖数组的引用，避免无谓的重新处理 */
  const dependenciesRef = useRef<Dependency[]>(dependencies)
  /** 标记是否已执行初始加载 */
  const initialLoadDone = useRef(false)
  /** 是否处于依赖选中状态变更中 */
  const isSelectingRef = useRef(false)
  /** 是否需要重新开始加载 */
  const needReloadRef = useRef(false)

  /** 当依赖数组引用变化且内容确实不同时更新引用 */
  useEffect(() => {
    if (dependencies !== dependenciesRef.current) {
      /** 检查数组内容是否真的变化（忽略UI状态变化），避免不必要的重置 */
      const hasSubstantialChanges = hasDependenciesChanged(dependencies, dependenciesRef.current)

      /** 如果只是选中状态变化，避免触发重载 */
      if (!hasSubstantialChanges) {
        /** 记录当前是选中状态变更 */
        isSelectingRef.current = true

        /** 如果依赖已经加载完成，更新处理后的依赖但保持加载进度 */
        if (processedCount > 0) {
          /** 更新所有已经加载的依赖 */
          setProcessedDependencies(prev => {
            const result = [...prev]
            /** 使用映射更新 */
            const nameMap = new Map(dependencies.map(d => [d.name, d]))

            for (let i = 0; i < result.length; i++) {
              const updated = nameMap.get(result[i].name)
              if (updated) {
                result[i] = updated
              }
            }

            return result
          })
        }

        /** 更新引用但不重置加载进度 */
        dependenciesRef.current = dependencies
      } else {
        /** 有实质性变化，需要重置 */
        needReloadRef.current = true
        dependenciesRef.current = dependencies
        setProcessedCount(0)
        setProcessedDependencies([])
        initialLoadDone.current = false
      }
    }
  }, [dependencies, processedCount])

  /**
   * 加载下一批数据
   */
  const loadNextBatch = useCallback(() => {
    const deps = dependenciesRef.current
    if (processedCount >= deps.length) return

    setIsLoading(true)

    /** 使用setTimeout代替requestIdleCallback，确保在所有环境下都能正常执行 */
    setTimeout(() => {
      const nextBatchSize = processedCount === 0 ? initialBatchSize : batchSize
      const endIndex = Math.min(processedCount + nextBatchSize, deps.length)
      const nextBatch = deps.slice(0, endIndex)

      /** 确保即使数组为空也会设置，防止UI卡在加载状态 */
      setProcessedDependencies(nextBatch)
      setProcessedCount(endIndex)
      setIsLoading(false)

      /** 重置选中状态标记 */
      isSelectingRef.current = false
      needReloadRef.current = false
    }, 0)
  }, [processedCount, initialBatchSize, batchSize])

  /**
   * 监听滚动事件，在接近底部时加载更多数据
   */
  const handleScroll = useCallback(() => {
    const deps = dependenciesRef.current
    if (isLoading || processedCount >= deps.length) return

    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    /** 当滚动到接近底部时加载下一批 */
    if (documentHeight - scrollY - windowHeight < threshold) {
      loadNextBatch()
    }
  }, [isLoading, processedCount, threshold, loadNextBatch])

  /** 初始加载 */
  useEffect(() => {
    const deps = dependenciesRef.current

    /** 如果当前正在选中状态变更中，不执行初始加载 */
    if (isSelectingRef.current && !needReloadRef.current) return

    /** 如果数组为空，直接设置空数组，避免卡在加载状态 */
    if (deps.length === 0) {
      setProcessedDependencies([])
      setProcessedCount(0)
      initialLoadDone.current = true
      return
    }

    /** 防止重复加载 */
    if (initialLoadDone.current && !needReloadRef.current) return

    /** 如果依赖列表很小（小于initialBatchSize），直接加载所有数据 */
    if (deps.length <= initialBatchSize) {
      setProcessedDependencies([...deps])
      setProcessedCount(deps.length)
      initialLoadDone.current = true
    } else if (processedCount === 0) {
      /** 只有在需要重新开始加载时才调用loadNextBatch */
      loadNextBatch()
      initialLoadDone.current = true
    }
  }, [initialBatchSize, loadNextBatch, processedCount, dependencies.length])

  /** 当第一批加载完成后，检查是否需要继续加载更多数据 */
  useEffect(() => {
    /** 如果正在选中状态变更中，不继续加载 */
    if (isSelectingRef.current) return

    const deps = dependenciesRef.current
    /** 如果已加载的依赖数量小于总数且不是正在加载中，继续加载 */
    if (processedCount > 0 && processedCount < deps.length && !isLoading) {
      /** 使用短延迟，确保UI有时间更新 */
      const timer = setTimeout(loadNextBatch, 100)
      return () => clearTimeout(timer)
    }
  }, [processedCount, isLoading, loadNextBatch])

  /** 添加滚动监听 */
  useEffect(() => {
    /** 确保滚动监听器只添加一次 */
    if (!scrollListenerAdded.current) {
      window.addEventListener('scroll', handleScroll)
      scrollListenerAdded.current = true

      return () => {
        window.removeEventListener('scroll', handleScroll)
        scrollListenerAdded.current = false
      }
    }
  }, [handleScroll])

  /** 计算加载进度 */
  const progress = dependenciesRef.current.length > 0
    ? Math.floor((processedCount / dependenciesRef.current.length) * 100)
    : 100

  /** 使用children渲染结果 */
  return (
    <>
      {children({
        processedDependencies,
        isLoading,
        progress,
      })}
    </>
  )
})

LazyDependencyLoader.displayName = 'LazyDependencyLoader'

export default LazyDependencyLoader
