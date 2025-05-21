import { Fragment } from 'react'
import { Divider as HeroDivider } from '@heroui/divider'
import type { JSX } from 'react'
import type { DividerProps } from 'node-karin'

/**
 * 渲染分割线组件
 * @param props - 分割线属性
 * @returns 渲染后的分割线组件
 */
export const createDivider = (props: DividerProps): JSX.Element => {
  const {
    componentType: _,
    key,
    className: __,
    componentClassName,
    transparent,
    description,
    orientation = 'horizontal',
    descPosition = 50,
    ...options
  } = props

  // 纵向分割线直接返回原始组件
  if (orientation === 'vertical') {
    return (
      <Fragment key={`${key}-Fragment`}>
        <HeroDivider
          key={key}
          className={`${transparent ? 'opacity-0' : ''} ${componentClassName || ''} my-2`}
          orientation='vertical'
          {...options}
        />
      </Fragment>
    )
  }

  // 横向分割线支持描述文本
  if (description) {
    return (
      <Fragment key={`${key}-Fragment`}>
        <div key={key} className={`${transparent ? 'opacity-0' : ''} ${componentClassName || ''} flex items-center py-4`}>
          <div style={{ width: `${descPosition}%` }}>
            <HeroDivider {...options} />
          </div>
          <span className='px-4 text-gray-500 shrink-0'>{description}</span>
          <div style={{ width: `${100 - descPosition}%` }}>
            <HeroDivider {...options} />
          </div>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment key={`${key}-Fragment`}>
      <HeroDivider
        key={key}
        className={`${transparent ? 'opacity-0' : ''} ${componentClassName || ''} my-2`}
        orientation='horizontal'
        {...options}
      />
    </Fragment>
  )
}
