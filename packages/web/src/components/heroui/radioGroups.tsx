import { Radio as HeroRadio, RadioGroup as HeroRadioGroup } from '@heroui/radio'
import type { JSX } from 'react'
import type { RadioGroupProps } from 'node-karin'

/**
 * 渲染单选框组件
 * @param props - 输入框属性
 * @returns 渲染后的输入框组件
 */
export const createRadioGroup = (props: RadioGroupProps): JSX.Element => {
  const {
    componentType: _,
    key,
    className,
    radio,
    componentClassName,
    ...options
  } = props

  return (
    <div className={className || 'flex items-center gap-2 p-2'} key={`div-${key}`}>
      <HeroRadioGroup
        key={key}
        orientation='horizontal'
        {...options}
        name={key}
        className={componentClassName}
      >
        {radio.map(({ componentType: _, key, componentClassName, ...item }) => (
          <HeroRadio
            key={key}
            {...item}
            className={componentClassName}
          >
            {item.label}
          </HeroRadio>
        ))}
      </HeroRadioGroup>
    </div>
  )
}
