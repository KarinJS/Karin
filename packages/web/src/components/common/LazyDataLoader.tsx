import { useEffect, useState, useCallback, useRef, memo } from 'react'

interface LazyDataLoaderProps<T> {
  /**
   * 原始数据数组
   */
  data: T[]

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
   * 判断两组数据是否有实质性变化的函数
   * 如果不提供，默认比较数组长度
   */
  hasDataChanged?: (data1: T[], data2: T[]) => boolean

  /**
   * 加载后的数据渲染函数
   */
  children: (data: {
    processedData: T[]
    isLoading: boolean
    progress: number
  }) => React.ReactNode
}

/**
 * 延迟加载数据组件
 * 该组件实现了数据的批量加载，优化大量数据时的初始加载性能
 */
const LazyDataLoader = memo(<T extends any>({ 
  data,
  initialBatchSize = 50,
  batchSize = 30,
  threshold = 300,
  hasDataChanged,
  children,
}: LazyDataLoaderProps<T>) => {
  // 已处理的数据数量
  const [processedCount, setProcessedCount] = useState(0)
  // 是否正在加载
  const [isLoading, setIsLoading] = useState(false)
  // 保存已处理的数据
  const [processedData, setProcessedData] = useState<T[]>([])
  // 用于追踪滚动监听器是否已添加
  const scrollListenerAdded = useRef(false)
  // 缓存数据数组的引用，避免无谓的重新处理
  const dataRef = useRef<T[]>(data)
  // 标记是否已执行初始加载
  const initialLoadDone = useRef(false)
  // 是否需要重新开始加载
  const needReloadRef = useRef(false)

  // 默认的数据变化检测函数 - 简单比较数组长度
  const defaultHasDataChanged = (data1: T[], data2: T[]): boolean => {
    return data1.length !== data2.length
  }

  // 当数据数组引用变化且内容确实不同时更新引用
  useEffect(() => {
    if (data !== dataRef.current) {
      // 检查数组内容是否真的变化，避免不必要的重置
      const checkDataChanged = hasDataChanged || defaultHasDataChanged
      const hasSubstantialChanges = checkDataChanged(data, dataRef.current)

      if (hasSubstantialChanges) {
        // 有实质性变化，需要重置
        needReloadRef.current = true
        dataRef.current = data
        setProcessedCount(0)
        setProcessedData([])
        initialLoadDone.current = false
      } else {
        // 无实质性变化，仅更新引用
        dataRef.current = data
      }
    }
  }, [data, hasDataChanged])

  /**
   * 加载下一批数据
   */
  const loadNextBatch = useCallback(() => {
    const currentData = dataRef.current
    if (processedCount >= currentData.length) return

    setIsLoading(true)

    // 使用setTimeout代替requestIdleCallback，确保在所有环境下都能正常执行
    setTimeout(() => {
      const nextBatchSize = processedCount === 0 ? initialBatchSize : batchSize
      const endIndex = Math.min(processedCount + nextBatchSize, currentData.length)
      const nextBatch = currentData.slice(0, endIndex)

      // 确保即使数组为空也会设置，防止UI卡在加载状态
      setProcessedData(nextBatch)
      setProcessedCount(endIndex)
      setIsLoading(false)
      needReloadRef.current = false
    }, 0)
  }, [processedCount, initialBatchSize, batchSize])

  /**
   * 监听滚动事件，在接近底部时加载更多数据
   */
  const handleScroll = useCallback(() => {
    const currentData = dataRef.current
    if (isLoading || processedCount >= currentData.length) return

    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // 当滚动到接近底部时加载下一批
    if (documentHeight - scrollY - windowHeight < threshold) {
      loadNextBatch()
    }
  }, [isLoading, processedCount, threshold, loadNextBatch])

  // 添加和移除滚动监听器
  useEffect(() => {
    // 如果需要加载更多数据且还未添加滚动监听器
    if (!scrollListenerAdded.current && processedCount < dataRef.current.length) {
      window.addEventListener('scroll', handleScroll)
      scrollListenerAdded.current = true
      return () => {
        window.removeEventListener('scroll', handleScroll)
        scrollListenerAdded.current = false
      }
    } else if (processedCount >= dataRef.current.length && scrollListenerAdded.current) {
      // 如果所有数据都已加载且存在滚动监听器，则移除
      window.removeEventListener('scroll', handleScroll)
      scrollListenerAdded.current = false
    }
  }, [processedCount, handleScroll])

  // 初始加载
  useEffect(() => {
    const currentData = dataRef.current

    // 如果数组为空，直接设置空数组，避免卡在加载状态
    if (currentData.length === 0) {
      setProcessedData([])
      setProcessedCount(0)
      initialLoadDone.current = true
      return
    }

    // 防止重复加载
    if (initialLoadDone.current && !needReloadRef.current) return

    // 如果数据列表很小（小于initialBatchSize），直接加载所有数据
    if (currentData.length <= initialBatchSize) {
      setProcessedData([...currentData])
      setProcessedCount(currentData.length)
      initialLoadDone.current = true
    } else if (processedCount === 0 || needReloadRef.current) {
      // 只有在需要重新开始加载时才调用loadNextBatch
      loadNextBatch()
      initialLoadDone.current = true
    }
  }, [initialBatchSize, loadNextBatch, processedCount, data.length])

  // 计算进度百分比
  const progress = dataRef.current.length > 0
    ? Math.round((processedCount / dataRef.current.length) * 100)
    : 100

  // 调用子渲染函数并传入处理后的数据和加载状态
  return children({
    processedData,
    isLoading,
    progress,
  })
})

LazyDataLoader.displayName = 'LazyDataLoader'

export default LazyDataLoader
