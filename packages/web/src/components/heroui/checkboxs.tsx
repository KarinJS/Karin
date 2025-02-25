import {
  Checkbox as HeroCheckbox,
  CheckboxGroup as HeroCheckboxGroup
} from '@heroui/checkbox'
import type { JSX } from 'react'
import type { CheckboxGroupProps } from 'node-karin'
import type { FormControl, FormRegister } from '../config/render'
import { useFieldArray } from 'react-hook-form'

/**
 * 渲染复选框组件
 * @param props - 输入框属性
 * @param register - 表单注册器
 * @param control - 表单控制器
 * @returns 渲染后的输入框组件
 */
export const createCheckboxGroup = (
  props: CheckboxGroupProps,
  register: FormRegister,
  control: FormControl
): JSX.Element => {
  const {
    componentType: _,
    key,
    className,
    componentClassName,
    checkbox,
    ...options
  } = props

  const { fields } = useFieldArray<any>({
    control,
    name: key,
  })

  return (
    <div className={componentClassName || 'flex items-center gap-2 p-2'} key={`div-${key}`}>
      <HeroCheckboxGroup
        key={key}
        orientation='horizontal'
        {...options}
        className={className}
      >
        {fields.map((field, index) => {
          const { key: CheckboxKey, componentClassName: __, ...item } = checkbox[index]
          return (
            <HeroCheckbox
              {...item}
              key={field.id}
              className={__}
              {...register(`${key}.${index}.value`)}
            >
              {item.label}
            </HeroCheckbox>
          )
        })}
      </HeroCheckboxGroup>
    </div>
  )
}
