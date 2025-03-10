'use client'

import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { useTheme } from '@/hooks/use-theme'
import { Card, CardBody, CardHeader } from '@heroui/card'
import type { NetworkStatus } from '@/types/server'
import { LuNetwork } from 'react-icons/lu'
import { ArrowDownCircle, ArrowUpCircle, Download, Upload } from 'lucide-react'

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
    if (chartRef.current) {
      // 添加移动设备适配选项
      const initOptions: echarts.EChartsInitOpts = {
        renderer: 'canvas',
        useDirtyRect: true,
        devicePixelRatio: window.devicePixelRatio,
      }
      chartInstance.current = echarts.init(chartRef.current, null, initOptions)

      // 添加图例切换事件监听
      chartInstance.current.on('legendselectchanged', function (params) {
        // 这里不需要做任何事情，只需确保事件被正确处理
        console.log('Legend select changed:', params)
      })

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

  useEffect(() => {
    if (chartInstance.current) {
      // 保存当前的缩放状态和图例选中状态
      const currentOption = chartInstance.current.getOption()
      const dataZoomStart = (currentOption?.dataZoom as any)?.[0]?.start
      const dataZoomEnd = (currentOption?.dataZoom as any)?.[0]?.end

      // 保存图例选中状态
      const legendSelected = (currentOption?.legend as any)?.[0]?.selected || {}

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
        animation: true,
        animationDuration: 300,
        animationEasing: 'quadraticInOut',
        animationThreshold: 2000,
        progressiveThreshold: 3000,
        progressive: 200,
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
                uploadText = `<div class="flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-green-500"></span>上传: ${formatSpeed(param.value)}</div>`
              } else if (param.seriesName === '下载') {
                downloadText = `<div class="flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-blue-500"></span>下载: ${formatSpeed(param.value)}</div>`
              }
            })

            return `
              <div class="p-2 backdrop-blur-3xl">
                <div class="text-sm font-medium mb-1 text-foreground/90">时间: ${time}</div>
                <div class="space-y-1 text-sm text-default-900">
                  ${uploadText}
                  ${downloadText}
                </div>
              </div>
            `
          },
          backgroundColor: 'transparent',
          borderWidth: 0,
          textStyle: {
            color: theme === 'dark' ? '#fff' : '#333',
          },
          extraCssText: 'backdrop-filter: blur(8px);',
        },
        legend: {
          data: ['上传', '下载'],
          icon: 'roundRect',  // 改为圆角矩形图标
          itemWidth: 16,      // 增加图标宽度
          itemHeight: 8,      // 保持高度适中
          itemGap: 24,
          right: '5%',
          top: '2%',
          selected: legendSelected,
          itemStyle: {
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#555' : '#ddd',
            borderRadius: 2,
            shadowBlur: 2,
            shadowColor: 'rgba(0,0,0,0.1)'
          },
          emphasis: {
            selectorLabel: {
              fontWeight: 'bold',
              color: theme === 'dark' ? '#fff' : '#000'
            }
          },
          formatter: function (name) {
            // 检查图例是否被选中，如果未选中则添加删除线效果
            const isSelected = legendSelected[name] !== false // 默认为true
            if (isSelected) {
              return `{a|${name}}`
            } else {
              return `{b|${name}}`
            }
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 12,
                lineHeight: 20,
                color: theme === 'dark' ? '#ddd' : '#333',
                padding: [0, 0, 0, 5]
              },
              b: {
                fontSize: 12,
                lineHeight: 20,
                color: theme === 'dark' ? '#777' : '#999', // 灰色
                padding: [0, 0, 0, 5],
              }
            }
          },
          tooltip: {
            show: true,
            formatter: function (param) {
              return `隐藏/显示${param.name}数据`
            }
          }
        },
        grid: {
          left: '6%',
          right: '6%',
          bottom: '18%',
          top: '18%',
          containLabel: true
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
            margin: 24,
          },
          axisLine: {
            lineStyle: {
              color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              width: 1,
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          name: yAxisUnit,
          nameLocation: 'end',
          nameGap: 22,
          nameTextStyle: {
            color: theme === 'dark' ? '#ddd' : '#333',
            fontSize: 12,
            padding: [0, 0, 8, 0]
          },
          axisLabel: {
            formatter: (value: number) => (value / yAxisDivisor).toFixed(1),
            color: theme === 'dark' ? '#ddd' : '#333',
            fontSize: 11,
            margin: 14
          },
          splitNumber: 6,
          splitLine: {
            lineStyle: {
              color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              type: [4, 4]
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: dataZoomStart !== undefined ? dataZoomStart : 0,
            end: dataZoomEnd !== undefined ? dataZoomEnd : 100,
            height: 32,
            bottom: 8,
            borderColor: 'transparent',
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            fillerColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            handleStyle: {
              color: theme === 'dark' ? '#666' : '#ddd',
              borderColor: theme === 'dark' ? '#888' : '#ccc',
            },
            moveHandleStyle: {
              color: theme === 'dark' ? '#888' : '#999',
            },
            selectedDataBackground: {
              lineStyle: {
                color: 'transparent',
              },
              areaStyle: {
                color: 'transparent',
              },
            },
            emphasis: {
              handleLabel: {
                show: true,
              },
              handleStyle: {
                borderColor: theme === 'dark' ? '#aaa' : '#999',
              },
            },
            startValue: allData.length > 0 ? formatTime(allData[0].timestamp) : undefined,
            endValue: allData.length > 0 ? formatTime(allData[allData.length - 1].timestamp) : undefined,
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: dataZoomStart !== undefined ? dataZoomStart : 0,
            end: dataZoomEnd !== undefined ? dataZoomEnd : 100,
            zoomOnMouseWheel: false,
            moveOnMouseWheel: false,
            zoomLock: true,
            preventDefaultMouseMove: false,
          },
        ],
        series: [
          {
            name: '上传',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            showSymbol: true,
            areaStyle: {
              opacity: 0.15,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: theme === 'dark' ? 'rgba(52, 211, 153, 0.5)' : 'rgba(52, 211, 153, 0.8)' },
                { offset: 1, color: theme === 'dark' ? 'rgba(52, 211, 153, 0.05)' : 'rgba(52, 211, 153, 0.1)' }
              ])
            },
            emphasis: {
              focus: 'series',
              scale: false,
              itemStyle: {
                color: '#34D399',
                borderWidth: 2,
                shadowColor: 'rgba(52, 211, 153, 0.5)',
                shadowBlur: 15
              }
            },
            data: displayData.map((item) => item.upload),
            itemStyle: {
              color: '#34D399',
              borderWidth: 2,
              shadowColor: 'rgba(52, 211, 153, 0.3)',
              shadowBlur: 10
            },
            lineStyle: {
              width: 3,
              color: '#34D399',
              shadowColor: 'rgba(52, 211, 153, 0.3)',
              shadowBlur: 10
            },
            animationDuration: 1000,
            animationEasing: 'cubicInOut',
            animationDelay: (idx: number) => idx * 50
          },
          {
            name: '下载',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            showSymbol: true, // 修改为true，显示每个数据点的标记
            areaStyle: {
              opacity: 0.15,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: theme === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.8)' },
                { offset: 1, color: theme === 'dark' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)' }
              ])
            },
            emphasis: {
              focus: 'series',
              scale: true,
              itemStyle: {
                color: '#3B82F6',
                borderWidth: 2,
                shadowColor: 'rgba(59, 130, 246, 0.5)',
                shadowBlur: 15
              }
            },
            data: displayData.map((item) => item.download),
            itemStyle: {
              color: '#3B82F6',
              borderWidth: 2,
              shadowColor: 'rgba(59, 130, 246, 0.3)',
              shadowBlur: 10
            },
            lineStyle: {
              width: 3,
              color: '#3B82F6',
              shadowColor: 'rgba(59, 130, 246, 0.3)',
              shadowBlur: 10
            },
            animationDuration: 1000,
            animationEasing: 'cubicInOut',
            animationDelay: (idx: number) => idx * 50
          }
        ]
      }

      // 使用 notMerge: false 来合并配置而不是完全替换
      chartInstance.current.setOption(option, { notMerge: false })

      // 强制重新渲染图表以应用新主题
      chartInstance.current.resize()
    }
  }, [networkData, theme])

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
      <div className='p-4 rounded-lg bg-default-50 shadow-md hover:shadow-lg transition-all duration-300'>
        <div className='text-xs font-normal text-gray-500 dark:text-gray-400 mb-2'>{title}</div>
        <div className='flex items-center justify-between'>
          <div>
            <span className='text-sm lg:text-2xl font-medium text-gray-800 dark:text-gray-200'>{valueText}</span>
            <span className='text-xs lg:text-xl font-light text-gray-500 dark:text-gray-400 ml-2'>{unitText}</span>
          </div>
          {icon}
        </div>
      </div>
    )
  }

  return (
    <Card className='w-full bg-gradient-to-br from-background/40 to-background/10 backdrop-blur-lg border-1 border-default-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden'>
      <CardHeader className='pb-2 border-b border-default-200/30'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold flex items-center gap-2 text-foreground/90'>
            <LuNetwork className='text-xl text-primary' />
            {title}
          </h2>
        </div>
      </CardHeader>
      <CardBody>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4'>
          {renderNetworkCard('当前上传', currentUpload, formatSpeed, <ArrowUpCircle className='h-4 w-4 lg:h-6 lg:w-6 text-green-500' />)}
          {renderNetworkCard('当前下载', currentDownload, formatSpeed, <ArrowDownCircle className='h-4 w-4 lg:h-6 lg:w-6 text-blue-500' />)}
          {renderNetworkCard('总接收', totalSent, formatDataSize, <Upload className='h-4 w-4 lg:h-6 lg:w-6 text-amber-500' />)}
          {renderNetworkCard('总发送', totalReceived, formatDataSize, <Download className='h-4 w-4 lg:h-6 lg:w-6 text-purple-500' />)}
        </div>
        <div
          ref={chartRef}
          className='rounded-xl border border-default-200/30 bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-sm p-4 w-full max-w-full overflow-hidden'
          style={{ height: '350px' }}
        />
      </CardBody>
    </Card>
  )
}

export default NetworkMonitor
