'use client'

import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { useTheme } from '@/hooks/use-theme'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import type { NetworkStatus } from '@/types/server'
import { LuNetwork } from 'react-icons/lu'

interface NetworkMonitorProps {
  title?: string
  networkData: NetworkStatus
}

const NetworkMonitor: React.FC<NetworkMonitorProps> = ({ title = '网络监控', networkData: propNetworkData }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const { theme } = useTheme()
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
          // 保留所有历史数据
          return [
            ...prev,
            {
              timestamp,
              upload,
              download,
              totalSent,
              totalReceived,
            },
          ]
        })
      }
    } catch (error) {
      console.error('处理网络数据失败:', error)
    }
  }, [propNetworkData]) // 添加 propNetworkData 作为依赖

  useEffect(() => {
    // 初始化图表
    if (chartRef.current) {
      // 添加移动设备适配选项
      const initOptions: echarts.EChartsInitOpts = {
        renderer: 'canvas',
        useDirtyRect: true,
        devicePixelRatio: window.devicePixelRatio,
      }
      chartInstance.current = echarts.init(chartRef.current, null, initOptions)

      // 设置响应式
      const observer = new ResizeObserver(() => {
        chartInstance.current?.resize()
      })
      observer.observe(chartRef.current)

      // 清理函数
      return () => {
        chartInstance.current?.dispose()
        observer.disconnect()
      }
    }
  }, [])

  // 添加这个 useEffect 来监听 propNetworkData 变化并调用 fetchNetworkData
  useEffect(() => {
    if (propNetworkData) {
      fetchNetworkData()
    }
  }, [propNetworkData, fetchNetworkData])

  // 更新图表数据
  useEffect(() => {
    if (chartInstance.current) {
      // 保存当前的缩放状态
      const currentOption = chartInstance.current.getOption()
      const dataZoomStart = (currentOption?.dataZoom as any)?.[0]?.start
      const dataZoomEnd = (currentOption?.dataZoom as any)?.[0]?.end

      // 所有数据用于时间选择器
      const allData = networkData

      // 只取最新的20个数据点用于主图表显示
      const displayData = networkData.length > 20 ? networkData.slice(networkData.length - 20) : networkData

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

      const option: echarts.EChartsOption = {
        darkMode: theme === 'dark',
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const index = params[0].dataIndex
            // 使用 displayData 而不是 filteredData
            const data = displayData[index]
            const time = formatTime(data.timestamp)
            const upload = params[0].value
            const download = params[1].value
            return `
              <div>
                <div>时间: ${time}</div>
                <div>上传: ${formatSpeed(upload)}</div>
                <div>下载: ${formatSpeed(download)}</div>
              </div>
            `
          },
          backgroundColor: theme === 'dark' ? 'rgba(50, 50, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          borderColor: theme === 'dark' ? '#555' : '#ddd',
          textStyle: {
            color: theme === 'dark' ? '#fff' : '#333',
          },
        },
        legend: {
          data: ['上传', '下载'],
          textStyle: {
            color: theme === 'dark' ? '#ddd' : '#333',
          },
          icon: 'roundRect',
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 20,
          right: '5%',
          top: '2%',
        },
        grid: {
          left: '4%',
          right: '5%',
          bottom: '18%',
          top: '18%',    // 从15%增加到18%，为标题和单位提供更多空间
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: displayData.map((item) => formatTime(item.timestamp)),
          axisLabel: {
            show: true,
            interval: 4,
            color: theme === 'dark' ? '#ddd' : '#333',
            fontSize: 11,
            margin: 24,     // 刻度标签距离x轴的距离
          },
          axisLine: {
            lineStyle: {
              color: theme === 'dark' ? '#555' : '#ddd',
            },
          },
        },
        yAxis: {
          type: 'value',
          name: yAxisUnit,
          nameLocation: 'end',
          nameGap: 22,      // 从15增加到22，增加单位与轴的距离
          nameTextStyle: {
            color: theme === 'dark' ? '#ddd' : '#333',
            fontSize: 12,
            padding: [0, 0, 8, 0],  // 底部padding从5增加到8
          },
          axisLabel: {
            formatter: (value: number) => {
              return (value / yAxisDivisor).toFixed(1)
            },
            color: theme === 'dark' ? '#ddd' : '#333',
            fontSize: 11,
            margin: 14,     // 从10增加到14，增加标签与轴的距离
          },
          splitLine: {
            lineStyle: {
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              type: 'dashed',
            },
          },
          minInterval: maxValue / 5, // Ensures at least 5 intervals on the y-axis
        },
        // 添加数据缩放组件，始终启用
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            // 如果有保存的缩放状态，则使用它，否则使用默认值
            start: dataZoomStart !== undefined ? dataZoomStart : 0,
            end: dataZoomEnd !== undefined ? dataZoomEnd : 100,
            height: 35, // 增加高度到35
            bottom: 5, // 底部间距
            borderColor: theme === 'dark' ? '#555' : '#ddd',
            textStyle: {
              color: theme === 'dark' ? '#ddd' : '#333',
            },
            handleStyle: {
              color: theme === 'dark' ? '#aaa' : '#666',
              borderColor: theme === 'dark' ? '#aaa' : '#666',
            },
            fillerColor: theme === 'dark' ? 'rgba(120, 120, 120, 0.2)' : 'rgba(200, 200, 200, 0.2)',
            // 设置时间选择器的数据范围为所有数据
            startValue: allData.length > 0 ? formatTime(allData[0].timestamp) : undefined,
            endValue: allData.length > 0 ? formatTime(allData[allData.length - 1].timestamp) : undefined,
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: dataZoomStart !== undefined ? dataZoomStart : 0,
            end: dataZoomEnd !== undefined ? dataZoomEnd : 100,
          },
        ],
        series: [
          {
            name: '上传',
            type: 'line',
            stack: '总量',
            smooth: 0.5, // 增加平滑度，取值范围0-1
            smoothMonotone: 'x', // 保持x方向的单调性
            areaStyle: {
              opacity: 0.3,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: theme === 'dark' ? 'rgba(76, 175, 80, 0.6)' : 'rgba(76, 175, 80, 0.6)' },
                { offset: 1, color: theme === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.1)' },
              ]),
            },
            emphasis: {
              focus: 'series',
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(76, 175, 80, 0.5)',
              },
            },
            data: displayData.map((item) => item.upload),
            itemStyle: {
              color: '#4caf50',
              borderWidth: 2,
            },
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(76, 175, 80, 0.3)',
              shadowBlur: 10,
            },
            symbolSize: 6,
          },
          {
            name: '下载',
            type: 'line',
            stack: '总量',
            smooth: 0.5, // 增加平滑度，取值范围0-1
            smoothMonotone: 'x', // 保持x方向的单调性
            areaStyle: {
              opacity: 0.3,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: theme === 'dark' ? 'rgba(33, 150, 243, 0.6)' : 'rgba(33, 150, 243, 0.6)' },
                { offset: 1, color: theme === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.1)' },
              ]),
            },
            emphasis: {
              focus: 'series',
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(33, 150, 243, 0.5)',
              },
            },
            data: displayData.map((item) => item.download),
            itemStyle: {
              color: '#2196f3',
              borderWidth: 2,
            },
            lineStyle: {
              width: 3,
              shadowColor: 'rgba(33, 150, 243, 0.3)',
              shadowBlur: 10,
            },
            symbolSize: 6,
          },
        ],
      }

      // 使用 setOption 的第二个参数，设置为 true 以完全覆盖之前的配置
      chartInstance.current.setOption(option, true)

      // 强制重新渲染图表以应用新主题
      chartInstance.current.resize()
    }
  }, [networkData, theme])

  return (
    <Card className='w-full shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden'>
      <CardHeader className='pb-2 border-b'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold flex items-center gap-1 text-primary-400'>
            <LuNetwork className='text-xl' />
            {title}
          </h2>
        </div>
      </CardHeader>
      <CardBody>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 mb-4'>
          <div className='flex flex-col items-center justify-center p-2 bg-primary/5 rounded-lg shadow-sm border border-primary/10 transition-all duration-300 hover:shadow hover:bg-primary/10'>
            <div className='text-xs font-medium text-primary mb-1'>当前上传</div>
            <Chip
              variant='bordered'
              size='sm'
              className='bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200 border-green-300 dark:border-green-700 font-medium'
            >
              {formatSpeed(currentUpload)}
            </Chip>
          </div>
          <div className='flex flex-col items-center justify-center p-2 bg-primary/5 rounded-lg shadow-sm border border-primary/10 transition-all duration-300 hover:shadow hover:bg-primary/10'>
            <div className='text-xs font-medium text-primary mb-1'>当前下载</div>
            <Chip
              variant='bordered'
              size='sm'
              className='bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-300 dark:border-blue-700 font-medium'
            >
              {formatSpeed(currentDownload)}
            </Chip>
          </div>
          <div className='flex flex-col items-center justify-center p-2 bg-primary/5 rounded-lg shadow-sm border border-primary/10 transition-all duration-300 hover:shadow hover:bg-primary/10'>
            <div className='text-xs font-medium text-primary mb-1'>总上传</div>
            <Chip
              variant='bordered'
              size='sm'
              className='bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-medium'
            >
              {formatDataSize(totalSent)}
            </Chip>
          </div>
          <div className='flex flex-col items-center justify-center p-2 bg-primary/5 rounded-lg shadow-sm border border-primary/10 transition-all duration-300 hover:shadow hover:bg-primary/10'>
            <div className='text-xs font-medium text-primary mb-1'>总下载</div>
            <Chip
              variant='bordered'
              size='sm'
              className='bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border-purple-300 dark:border-purple-700 font-medium'
            >
              {formatDataSize(totalReceived)}
            </Chip>
          </div>
        </div>
        <div
          ref={chartRef}
          className='rounded-lg border border-primary/10 p-2 w-full max-w-full overflow-hidden'
          style={{ height: '350px' }}
        />
      </CardBody>
    </Card>
  )
}

export default NetworkMonitor
