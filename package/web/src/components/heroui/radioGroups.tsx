import { Radio as HeroRadio, RadioGroup as HeroRadioGroup } from '@heroui/radio'
import { Controller } from 'react-hook-form'
import type { JSX } from 'react'
import type { RadioGroupProps } from 'node-karin'
import type { FormControl } from '../config/plugin/render'

/**
 * 渲染单选框组件
 * @param props - 输入框属性
 * @param control - 表单控制器
 * @param basePath - 基础路径
 * @returns 渲染后的输入框组件
 */
export const createRadioGroup = (
  props: RadioGroupProps,
  control: FormControl,
  basePath?: string
): JSX.Element => {
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
      <Controller
        name={basePath ? `${basePath}.${key}.value` : `${key}.value`}
        control={control}
        defaultValue={options.defaultValue || ''}
        render={({ field: { value, onChange } }) => (
          <HeroRadioGroup
            key={key}
            orientation='horizontal'
            {...options}
            value={value as string}
            onValueChange={onChange}
            className={componentClassName}
          >
            {radio.map(({ componentType: _, key: radioKey, componentClassName, value, ...item }, index) => (
              <HeroRadio
                key={`radio-${radioKey}-${index}`}
                {...item}
                value={value}
                className={componentClassName}
              >
                {item.label}
              </HeroRadio>
            ))}
          </HeroRadioGroup>
        )}
      />
    </div>
  )
}
