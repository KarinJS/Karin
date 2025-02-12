import { useEffect } from 'react'
import DynamicRender from '../heroui/main'
import type { ComponentConfig, Result } from '../heroui/types'

interface DynamicComponentRendererProps {
  configs: ComponentConfig[]
  onChange: (result: Result<'all'>) => void
  values?: Record<string, any>
}

/**
 * 动态组件渲染器
 * @param props - 组件属性
 * @returns 渲染后的组件
 */
export const DynamicComponentRenderer = (
  { configs, onChange, values = {} }: DynamicComponentRendererProps
) => {
  const { list, result } = DynamicRender(configs, values)

  useEffect(() => {
    onChange(result)
  }, [result, onChange])

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 w-full">
        {list.map((item, index) => (
          <div key={`dynamic-component-${index}-${item.key || ''}`} className="w-full">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
