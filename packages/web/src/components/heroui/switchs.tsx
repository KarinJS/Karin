import { Switch as HeroSwitch } from '@heroui/switch'
import { cn } from '@/lib/utils'
import type { JSX } from 'react'
import type { SwitchProps } from 'node-karin'
import type { FormRegister } from '../config/plugin/render'
import { useState } from 'react'

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

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const handleContainerClick = (e: React.MouseEvent) => {
    // 如果点击的是描述区域，不触发开关切换
    if ((e.target as HTMLElement).closest('.description-area')) return
    const switchElement = document.querySelector(`[data-switch-key="${key}"]`) as HTMLElement
    switchElement?.click()
  }

  const handleDescriptionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  return (
    <div className={className || 'inline-flex p-1 w-full sm:w-auto'}>
      <div
        className='w-full sm:w-[320px] min-h-[100px] relative border border-default-200 rounded-lg hover:bg-default-100 p-0 cursor-pointer'
        onClick={handleContainerClick}
      >
        {/* 标题和描述区域 */}
        <div className='w-full h-full flex flex-col justify-center p-3 sm:p-4 pr-14 sm:pr-16'>
          {props.label && (
            <p className='mb-1 text-default-600 text-sm sm:text-base'>{props.label}</p>
          )}
          {props.description && (
            <div
              className='description-area'
              onClick={handleDescriptionClick}
            >
              <p
                className={cn(
                  'text-xs text-default-500 w-full cursor-pointer',
                  isDescriptionExpanded ? '' : 'truncate',
                  'transition-all duration-200 ease-in-out'
                )}
              >
                {props.description}
              </p>
              <div className='text-xs text-primary-500 mt-0.5'>
                {isDescriptionExpanded ? '点击收起' : '点击展开'}
              </div>
            </div>
          )}
        </div>

        {/* 开关控件位于右侧中间 */}
        <div className='absolute right-3 sm:right-4 top-1/2 -translate-y-1/2'>
          <HeroSwitch
            key={key}
            {...options}
            data-switch-key={key}
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
