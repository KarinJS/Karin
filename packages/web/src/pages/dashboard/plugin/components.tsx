import { useRequest } from 'ahooks'
import { useSearchParams } from 'react-router-dom'
import { getPluginCustomComponentsRequest } from '@/request/plugins'
import { useState, useEffect } from 'react'
import { Spinner } from '@heroui/spinner'

// /web/plugins/components?name=@karinjs/plugin-demo

declare global {
  interface Window {
    KarinPlugin?: any
  }
}

const PluginComponentsPage = () => {
  /** 获取name */
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name')
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  if (!name) {
    return <div>请传入插件名称</div>
  }

  /** 找后端要组件路径 */
  const { data, error, loading } = useRequest(() => getPluginCustomComponentsRequest(name))

  useEffect(() => {
    if (data) {
      console.log('data:', data)

      // 创建script标签动态加载UMD模块
      const script = document.createElement('script')
      script.src = data
      script.async = true
      script.onload = () => {
        // UMD模块加载后会在window上挂载KarinPlugin对象
        console.log('插件加载完成，全局对象:', window.KarinPlugin)

        if (window.KarinPlugin) {
          // 检查不同的可能的导出方式
          let PluginComponent = null

          if (typeof window.KarinPlugin === 'function') {
            // 直接导出为函数组件
            PluginComponent = window.KarinPlugin
          } else if (window.KarinPlugin.default) {
            // 作为default导出
            PluginComponent = window.KarinPlugin.default
          } else if (window.KarinPlugin.DemoComponent) {
            // 具名导出
            PluginComponent = window.KarinPlugin.DemoComponent
          } else {
            // 检查是否为CommonJS模块
            const moduleExports = window.KarinPlugin
            if (moduleExports.__esModule) {
              PluginComponent = moduleExports.default
            }
          }

          if (PluginComponent) {
            setComponent(() => PluginComponent)
          } else {
            console.error('插件格式不正确，无法找到组件:', window.KarinPlugin)
            setLoadError('插件加载成功但未找到组件导出，请检查插件格式')
          }
        } else {
          setLoadError('插件加载成功但未找到全局对象')
        }
      }
      script.onerror = (err) => {
        console.error('加载插件脚本失败:', err)
        setLoadError('加载插件脚本失败')
      }

      document.body.appendChild(script)

      // 清理函数
      return () => {
        document.body.removeChild(script)
        // 清除全局变量
        delete window.KarinPlugin
      }
    }
  }, [data])

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Spinner size='lg' color='primary' />
      </div>
    )
  }

  if (error || !data) {
    return <div className='p-4 text-danger'>加载失败: {error?.message}</div>
  }

  if (loadError) {
    return <div className='p-4 text-danger'>{loadError}</div>
  }

  return (
    <div className='p-4'>
      {Component
        ? (
          <Component />
        )
        : (
          <div className='flex flex-col items-center justify-center p-8 gap-2'>
            <Spinner size='lg' color='primary' />
            <p className='text-default-600'>正在加载插件组件...</p>
          </div>
        )}
    </div>
  )
}

export default PluginComponentsPage
