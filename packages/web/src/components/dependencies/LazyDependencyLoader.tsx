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
  // 已处理的依赖数量
  const [processedCount, setProcessedCount] = useState(0)
  // 是否正在加载
  const [isLoading, setIsLoading] = useState(false)
  // 保存已处理的依赖
  const [processedDependencies, setProcessedDependencies] = useState<Dependency[]>([])
  // 用于追踪滚动监听器是否已添加
  const scrollListenerAdded = useRef(false)
  // 缓存依赖数组的引用，避免无谓的重新处理
  const dependenciesRef = useRef<Dependency[]>(dependencies)

  // 当依赖数组引用变化且内容确实不同时更新引用
  useEffect(() => {
    if (dependencies !== dependenciesRef.current) {
      // 检查数组内容是否真的变化，避免不必要的重置
      const isDifferent = dependencies.length !== dependenciesRef.current.length ||
        dependencies.some((dep, idx) =>
          dep !== dependenciesRef.current[idx])

      if (isDifferent) {
        dependenciesRef.current = dependencies
        // 重置处理状态
        setProcessedCount(0)
        setProcessedDependencies([])
      }
    }
  }, [dependencies])

  /**
   * 加载下一批数据
   */
  const loadNextBatch = useCallback(() => {
    const deps = dependenciesRef.current
    if (processedCount >= deps.length) return

    setIsLoading(true)

    // 使用requestIdleCallback在浏览器空闲时执行，不阻塞主线程
    // 如果不支持，则使用setTimeout作为回退
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1))

    idleCallback(() => {
      const nextBatchSize = processedCount === 0 ? initialBatchSize : batchSize
      const endIndex = Math.min(processedCount + nextBatchSize, deps.length)
      const nextBatch = deps.slice(0, endIndex)

      setProcessedDependencies(nextBatch)
      setProcessedCount(endIndex)
      setIsLoading(false)
    })
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

    // 当滚动到接近底部时加载下一批
    if (documentHeight - scrollY - windowHeight < threshold) {
      loadNextBatch()
    }
  }, [isLoading, processedCount, threshold, loadNextBatch])

  // 初始加载
  useEffect(() => {
    const deps = dependenciesRef.current

    // 如果依赖列表很小（小于initialBatchSize），直接加载所有数据
    if (deps.length <= initialBatchSize) {
      setProcessedDependencies([...deps])
      setProcessedCount(deps.length)
    } else if (processedCount === 0) {
      // 只有在需要重新开始加载时才调用loadNextBatch
      loadNextBatch()
    }
  }, [initialBatchSize, loadNextBatch, processedCount])

  // 当第一批加载完成后，检查是否需要继续加载更多数据
  useEffect(() => {
    const deps = dependenciesRef.current
    // 如果已加载的依赖数量小于总数且不是正在加载中，继续加载
    if (processedCount > 0 && processedCount < deps.length && !isLoading) {
      // 使用短延迟，确保UI有时间更新
      const timer = setTimeout(loadNextBatch, 100)
      return () => clearTimeout(timer)
    }
  }, [processedCount, isLoading, loadNextBatch])

  // 添加滚动监听
  useEffect(() => {
    // 确保滚动监听器只添加一次
    if (!scrollListenerAdded.current) {
      window.addEventListener('scroll', handleScroll)
      scrollListenerAdded.current = true

      return () => {
        window.removeEventListener('scroll', handleScroll)
        scrollListenerAdded.current = false
      }
    }
  }, [handleScroll])

  // 计算加载进度
  const progress = dependenciesRef.current.length > 0
    ? Math.floor((processedCount / dependenciesRef.current.length) * 100)
    : 100

  // 使用useMemo包装children渲染结果，避免不必要的重新计算
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
