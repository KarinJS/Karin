import { Divider as HeroDivider } from '@heroui/divider'
import type { JSX } from 'react'
import type { DividerProps } from 'node-karin'

/**
 * 渲染分割线组件
 * @param props - 分割线属性
 * @returns 渲染后的分割线组件
 */
export const Divider = (props: DividerProps): JSX.Element => {
  const {
    componentType: _,
    key,
    className,
    transparent,
    description,
    orientation = 'horizontal',
    descPosition = 50,
    ...options
  } = props

  // 纵向分割线直接返回原始组件
  if (orientation === 'vertical') {
    return (
      <HeroDivider
        key={key}
        className={`${transparent ? 'opacity-0' : ''} ${className || ''}`}
        orientation="vertical"
        {...options}
      />
    )
  }

  // 横向分割线支持描述文本
  if (description) {
    const leftWidth = `w-[${descPosition}%]`
    const rightWidth = `w-[${100 - descPosition}%]`

    return (
      <div key={key} className={`${transparent ? 'opacity-0' : ''} ${className || ''} flex items-center`}>
        <div className={leftWidth}>
          <HeroDivider {...options} />
        </div>
        <span className="px-4 text-gray-500 shrink-0">{description}</span>
        <div className={rightWidth}>
          <HeroDivider {...options} />
        </div>
      </div>
    )
  }

  return (
    <HeroDivider
      key={key}
      className={`${transparent ? 'opacity-0' : ''} ${className || ''}`}
      orientation="horizontal"
      {...options}
    />
  )
}


