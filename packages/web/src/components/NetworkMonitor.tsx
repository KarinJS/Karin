'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { useTheme } from '@/hooks/use-theme'
import { ArrowDownCircle, ArrowUpCircle, Download, Upload } from 'lucide-react'
import type { NetworkStatus } from '@/types/server'

// 限制最大数据点数量
const MAX_DATA_POINTS = 100

interface NetworkMonitorProps {
  networkData: NetworkStatus
  enablePolling: boolean
  onPollingChange: (value: boolean) => void
  showChart: boolean
  onShowChartChange: (value: boolean) => void
}

const NetworkMonitor: React.FC<NetworkMonitorProps> = ({
  networkData: propNetworkData,
  enablePolling,
  showChart,
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const { theme, isDark } = useTheme()
  const [networkData, setNetworkData] = useState<NetworkStatus[]>([])
  const [currentUpload, setCurrentUpload] = useState<number>(0)
  const [currentDownload, setCurrentDownload] = useState<number>(0)
  const [totalSent, setTotalSent] = useState<number>(0)
  const [totalReceived, setTotalReceived] = useState<number>(0)

  // 格式化网络速度
  const formatSpeed = (speed: number): string => {
    if (speed < 1024) {
      return `${speed.toFixed(2)} B/s`
    } else if (speed < 1024 * 1024) {
      return `${(speed / 1024).toFixed(2)} KB/s`
    } else {
      return `${(speed / (1024 * 1024)).toFixed(2)} MB/s`
    }
  }

  // 格式化数据大小
  const formatDataSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes.toFixed(2)} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
    }
  }

  // 格式化时间
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  }

  const lastFetchTime = useRef<number>(0)

  // 获取网络数据 - 修改为使用传入的 networkData
  const fetchNetworkData = useCallback(() => {
    // 如果禁用了轮询，则不处理数据
    if (!enablePolling) return

    try {
      const now = Date.now()
      lastFetchTime.current = now

      // 使用通过props传入的数据
      if (propNetworkData) {
        const { upload, download, totalSent, totalReceived } = propNetworkData

        setCurrentUpload(upload)
        setCurrentDownload(download)
        setTotalSent(totalSent)
        setTotalReceived(totalReceived)

        // 添加数据点
        const timestamp = Date.now()

        setNetworkData((prev) => {
          // 限制数据点数量，保留最新的 MAX_DATA_POINTS 个
          const newData = [
            ...prev,
            {
              timestamp,
              upload,
              download,
              totalSent,
              totalReceived,
            },
          ]

          return newData.slice(-MAX_DATA_POINTS)
        })
      }
    } catch (error) {
      console.error('处理网络数据失败:', error)
    }
  }, [propNetworkData, enablePolling])

  // 清理图表实例的函数
  const disposeChart = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.dispose()
      chartInstance.current = null
    }
  }, [])

  // 初始化和清理图表
  useEffect(() => {
    let observer: ResizeObserver | null = null

    if (chartRef.current && showChart) {
      // 确保先清理之前的实例
      disposeChart()

      // 移除不必要的配置，优化性能
      const initOptions: echarts.EChartsInitOpts = {
        renderer: 'canvas',
        useDirtyRect: false,
        devicePixelRatio: window.devicePixelRatio,
      }
      chartInstance.current = echarts.init(chartRef.current, null, initOptions)

      // 设置响应式
      observer = new ResizeObserver(() => {
        chartInstance.current?.resize()
      })
      observer.observe(chartRef.current)
    } else if (!showChart) {
      // 如果图表不显示，则清理图表实例
      disposeChart()
    }

    // 清理函数
    return () => {
      if (observer) {
        observer.disconnect()
      }
      disposeChart()
    }
  }, [showChart, disposeChart])

  // 监听 propNetworkData 变化并调用 fetchNetworkData
  useEffect(() => {
    if (propNetworkData && enablePolling) {
      fetchNetworkData()
    }
  }, [propNetworkData, fetchNetworkData, enablePolling])

  // 组件卸载时清理数据
  useEffect(() => {
    return () => {
      // 清空数据以防内存泄漏
      setNetworkData([])
    }
  }, [])

  // 更新图表
  useEffect(() => {
    // 如果不显示图表或没有图表实例，则不更新
    if (!showChart || !chartInstance.current || networkData.length === 0) return

    // 保存当前的缩放状态和图例选中状态
    const currentOption = chartInstance.current.getOption()
    const dataZoomStart = (currentOption?.dataZoom as any)?.[0]?.start
    const dataZoomEnd = (currentOption?.dataZoom as any)?.[0]?.end
    const legendSelected = (currentOption?.legend as any)?.[0]?.selected || {}

    // 用于显示的数据 - 限制为最新的20个点，减少内存使用
    const displayData = networkData.slice(-20)

    // 确定Y轴的单位
    const maxValue = Math.max(...displayData.map((item) => Math.max(item.upload, item.download)))
    let yAxisUnit = 'B/s'
    let yAxisDivisor = 1

    if (maxValue >= 1024 * 1024) {
      yAxisUnit = 'MB/s'
      yAxisDivisor = 1024 * 1024
    } else if (maxValue >= 1024) {
      yAxisUnit = 'KB/s'
      yAxisDivisor = 1024
    }

    // 简化图表配置，减少不必要的视觉效果
    const option: echarts.EChartsOption = {
      darkMode: isDark,
      // 减少动画效果
      animation: true,
      animationDuration: 200, // 减少动画时间
      animationEasing: 'linear', // 使用更简单的缓动函数
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const index = params[0].dataIndex
          const data = displayData[index]
          const time = formatTime(data.timestamp)
          let uploadText = ''
          let downloadText = ''

          params.forEach((param: any) => {
            if (param.seriesName === '上传') {
              uploadText = `<div><span class="inline-block w-2 h-2 rounded-full bg-green-500"></span>上传: ${formatSpeed(param.value)}</div>`
            } else if (param.seriesName === '下载') {
              downloadText = `<div><span class="inline-block w-2 h-2 rounded-full bg-blue-500"></span>下载: ${formatSpeed(param.value)}</div>`
            }
          })

          return `
            <div class="p-2">
              <div class="text-sm font-medium mb-1">时间: ${time}</div>
              <div class="space-y-1 text-sm">
                ${uploadText}
                ${downloadText}
              </div>
            </div>
          `
        },
      },
      legend: {
        data: ['上传', '下载'],
        icon: 'rect',
        itemWidth: 12,
        itemHeight: 6,
        itemGap: 20,
        right: '5%',
        top: '2%',
        selected: legendSelected,
      },
      grid: {
        left: '6%',
        right: '6%',
        bottom: '18%',
        top: '18%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: displayData.map((item) => formatTime(item.timestamp)),
        axisLabel: {
          show: true,
          interval: 4,
          fontSize: 11,
        },
      },
      yAxis: {
        type: 'value',
        name: yAxisUnit,
        nameLocation: 'end',
        nameGap: 20,
        axisLabel: {
          formatter: (value: number) => (value / yAxisDivisor).toFixed(1),
          fontSize: 11,
        },
        splitNumber: 4, // 减少分割线数量
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: dataZoomStart !== undefined ? dataZoomStart : 0,
          end: dataZoomEnd !== undefined ? dataZoomEnd : 100,
          height: 30,
          bottom: 8,
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: dataZoomStart !== undefined ? dataZoomStart : 0,
          end: dataZoomEnd !== undefined ? dataZoomEnd : 100,
          zoomOnMouseWheel: false,
        },
      ],
      series: [
        {
          name: '上传',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          // 减少符号大小
          symbolSize: 4,
          // 减少显示的数据点
          showSymbol: false, // 只在悬停时显示
          sampling: 'lttb', // 使用LTTB采样算法减少数据点
          areaStyle: {
            opacity: 0.1, // 降低不透明度
          },
          data: displayData.map((item) => item.upload),
          itemStyle: {
            color: '#34D399',
          },
          lineStyle: {
            width: 2, // 减小线宽
            color: '#34D399',
          },
          // 简化动画
          animationDuration: 300,
        },
        {
          name: '下载',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          showSymbol: false,
          sampling: 'lttb',
          areaStyle: {
            opacity: 0.1,
          },
          data: displayData.map((item) => item.download),
          itemStyle: {
            color: '#3B82F6',
          },
          lineStyle: {
            width: 2,
            color: '#3B82F6',
          },
          animationDuration: 300,
        },
      ],
    }

    // 使用节流更新图表，减少渲染频率
    if (chartInstance.current) {
      chartInstance.current.setOption(option, { notMerge: false })
    }
  }, [networkData, theme, showChart])

  /** 渲染网络状态卡片 */
  const renderNetworkCard = (
    title: string,
    value: number,
    formatFunc: (val: number) => string,
    icon: React.ReactNode
  ) => {
    const formattedText = formatFunc(value)
    const [valueText, unitText] = formattedText.split(' ')

    return (
      <div className='p-2 md:p-3 lg:p-4 rounded-lg bg-default-50 shadow-md hover:shadow-lg transition-all duration-300'>
        <div className='text-xs md:text-base lg:text-xl font-normal text-default-500 mb-2'>{title}</div>
        <div className='flex items-center justify-between'>
          <div>
            <span className='text-sm md:text-base lg:text-2xl font-medium text-default-800'>{valueText}</span>
            <span className='text-xs md:text-base lg:text-xl font-light text-default-400 ml-2'>{unitText}</span>
          </div>
          {icon}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {renderNetworkCard('当前上传', currentUpload, formatSpeed, <ArrowUpCircle className='h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-green-500' />)}
        {renderNetworkCard('当前下载', currentDownload, formatSpeed, <ArrowDownCircle className='h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-blue-500' />)}
        {renderNetworkCard('总发送', totalReceived, formatDataSize, <Upload className='h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-purple-500' />)}
        {renderNetworkCard('总接收', totalSent, formatDataSize, <Download className='h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-amber-500' />)}
      </div>
      {showChart && (
        <div
          ref={chartRef}
          className='mt-4 rounded-xl border border-default-200/30 bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm p-4 w-full max-w-full overflow-hidden'
          style={{ height: '350px' }}
        />
      )}
    </>
  )
}

export default React.memo(NetworkMonitor)
