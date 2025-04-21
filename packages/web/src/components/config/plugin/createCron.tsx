import CronInput from '../../cron'
import { Controller } from 'react-hook-form'
import type { FormControl } from './render'

/**
 * Cron表达式编辑器组件属性
 */
interface CronProps {
  /** 组件类型 */
  componentType: 'cron'
  /** 组件唯一标识符 */
  key: string
  /** 组件标签 */
  label?: string
  /** 外层容器类名 */
  className?: string
  /** 组件自身类名 */
  componentClassName?: string
  /** 默认值 */
  defaultValue?: string
}

/**
 * 渲染Cron表达式编辑器组件
 * @param option - Cron编辑器配置
 * @param register - 表单注册器（实际未使用，为了保持API一致性）
 * @param control - 表单控制器
 * @returns Cron编辑器组件
 */
export const createCron = (
  option: CronProps,
  control: FormControl,
  basePath?: string,
) => {
  const {
    componentType: _,
    key,
    className,
    componentClassName,
    label,
    ...options
  } = option

  // const

  return (
    <div className={className || 'flex flex-col gap-4 max-w-[calc(100%-1rem)] mx-2'} key={key}>
      <div className='flex justify-between items-center'>
        <span className='text-default-500 text-md mt-2'>{label || 'Cron表达式'}</span>
      </div>
      <div className={componentClassName || 'w-full'}>
        <Controller
          name={basePath ? `${basePath}.${key}.value` : `${key}.value`}
          control={control}
          defaultValue={option.defaultValue || '* * * * * *'}
          render={({ field: { onChange, value } }) => (
            <CronInput
              {...options}
              key={key}
              value={(value as string) || '* * * * * *'}
              onChange={(newValue) => {
                onChange(newValue)
              }}
            />
          )}
        />
      </div>
    </div>
  )
}

export default createCron
