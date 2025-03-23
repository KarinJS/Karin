import { Switch as HeroSwitch } from '@heroui/switch'
import { cn } from '@/lib/utils'
import type { JSX } from 'react'
import type { SwitchProps } from 'node-karin'
import type { FormRegister } from '../config/plugin/render'

/**
 * 渲染开关组件
 * @param props - 输入框属性
 * @param register - 表单注册器
 * @returns 渲染后的输入框组件
 */
export const createSwitch = (
  props: SwitchProps,
  register: FormRegister
): JSX.Element => {
  const {
    componentType: _,
    key,
    className,
    componentClassName,
    defaultSelected,
    ...options
  } = props

  return (
    <div className={className || 'inline-flex p-1'}>
      <div className='w-[320px] h-[100px] relative border border-default-200 rounded-lg hover:bg-default-100 p-0'>
        {/* 标题和描述区域 */}
        <div className='w-full p-4 pr-16'>
          {props.label && (
            <p className='text-base mb-2'>{props.label}</p>
          )}
          {props.description && (
            <p
              className='text-xs text-gray-500 truncate w-full'
              title={props.description}
            >
              {props.description}
            </p>
          )}
        </div>

        {/* 开关控件位于右侧中间 */}
        <div className='absolute right-4 top-1/2 -translate-y-1/2'>
          <HeroSwitch
            key={key}
            {...options}
            className={cn(
              'cursor-pointer',
              `data-[selected=true]:border-${options.color || 'primary'}`,
              componentClassName
            )}
            defaultSelected={defaultSelected ?? false}
            {...register(`${key}.value`)}
          />
        </div>
      </div>
    </div>
  )
}
