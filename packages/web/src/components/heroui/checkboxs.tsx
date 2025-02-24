import {
  Checkbox as HeroCheckbox,
  CheckboxGroup as HeroCheckboxGroup
} from '@heroui/checkbox'
import type { JSX } from 'react'
import type { CheckboxGroupProps } from 'node-karin'

/**
 * 渲染复选框组件
 * @param props - 输入框属性
 * @returns 渲染后的输入框组件
 */
export const createCheckboxGroup = (props: CheckboxGroupProps): JSX.Element => {
  const {
    componentType: _,
    key,
    className,
    componentClassName,
    checkbox,
    ...options
  } = props
  return (
    <div className={componentClassName || 'flex items-center gap-2 p-2'} key={`div-${key}`}>
      <HeroCheckboxGroup
        key={key}
        orientation='horizontal'
        {...options}
        className={className}
      >
        {checkbox.map(({
          componentType: _,
          key: CheckboxKey,
          componentClassName: __,
          ...item
        }) => {
          return (
            <HeroCheckbox
              {...item}
              name={CheckboxKey}
              key={CheckboxKey}
              className={__}
            >
              {item.label}
            </HeroCheckbox>
          )
        })}
      </HeroCheckboxGroup>
    </div>
  )
}
