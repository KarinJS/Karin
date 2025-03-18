import * as echarts from 'echarts'
import React, { useEffect, useRef } from 'react'

import { useTheme } from '@/hooks/use-theme'

interface UsagePieProps {
  systemUsage: number
  processUsage: number
  title?: string
}

const defaultOption: echarts.EChartsOption = {
  tooltip: {
    trigger: 'item',
    formatter: '<center>{b}<br/><b>{d}%</b></center>',
    borderRadius: 10,
    extraCssText: 'backdrop-filter: blur(10px);',
  },
  series: [
    {
      name: '系统占用',
      type: 'pie',
      radius: ['70%', '90%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: '系统占用',
        fontSize: 14,
      },
      itemStyle: {
        borderWidth: 1,
        borderRadius: 10,
      },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: 100,
          name: '系统总量',
        },
      ],
    },
  ],
}

const UsagePie: React.FC<UsagePieProps> = ({
  systemUsage,
  processUsage,
  title,
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const { theme, isDark } = useTheme()

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current)
      const option = defaultOption
      chartInstance.current.setOption(option)
      const observer = new ResizeObserver(() => {
        chartInstance.current?.resize()
      })
      observer.observe(chartRef.current)
      return () => {
        chartInstance.current?.dispose()
        observer.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption({
        series: [
          {
            label: {
              formatter: title,
            },
          },
        ],
      })
    }
  }, [title])

  useEffect(() => {
    console.log(isDark)
    if (chartInstance.current) {
      const currentIsDark = isDark

      chartInstance.current.setOption({
        darkMode: currentIsDark,
        tooltip: {
          backgroundColor:
            currentIsDark
              ? 'rgba(0, 0, 0, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
          textStyle: {
            color: currentIsDark ? '#fff' : '#333',
          },
        },
        color:
          currentIsDark
            ? ['#3f42f0', '#64c5ef', '#516ee2']
            : ['#3f42f0', '#7d93ea', '#07bdff'],
        series: [
          {
            itemStyle: {
              borderColor: currentIsDark ? '#333' : '#a7adf0',
            },
          },
        ],
      })
    }
  }, [theme, isDark])

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption({
        series: [
          {
            data: [
              {
                value: processUsage,
                name: 'QQ占用',
              },
              {
                value: systemUsage - processUsage,
                name: '其他进程占用',
              },
              {
                value: 100 - systemUsage,
                name: '剩余系统总量',
              },
            ],
          },
        ],
      })
    }
  }, [systemUsage, processUsage])

  return <div ref={chartRef} className='w-36 h-36 flex-shrink-0' />
}

export default UsagePie
