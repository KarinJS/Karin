import { FC } from 'react'
import { Card } from '@heroui/card'
import { Checkbox } from '@heroui/checkbox'
import { IconType } from 'react-icons'

export interface UpdateOptionCardProps {
  /** 是否选中 */
  isSelected: boolean
  /** 值改变回调 */
  onValueChange: (value: boolean) => void
  /** 图标 */
  icon?: IconType
  /** 标题内容，可以是文本或自定义组件 */
  title: React.ReactNode
  /** 描述文本 */
  description?: React.ReactNode
  /** 主题色 */
  theme: 'primary' | 'warning' | 'danger'
  /** 左侧图标容器类名 */
  iconClassName?: string
  /** 标题容器类名 */
  titleClassName?: string
  /** 描述容器类名 */
  descriptionClassName?: string
  /** 是否显示复选框 */
  showCheckbox?: boolean
  /** 是否可点击 */
  isPressable?: boolean
  /** 自定义类名 */
  className?: string
}

const themeStyles = {
  primary: {
    gradient: 'from-blue-50/60 to-blue-100/60 hover:from-blue-50/70 hover:to-blue-100/70',
    border: 'border-blue-200/60',
    wrapper: 'bg-blue-100/70 group-hover:bg-blue-100/90',
    icon: 'text-primary',
    title: 'text-blue-700',
  },
  warning: {
    gradient: 'from-amber-50/60 to-amber-100/60 hover:from-amber-50/70 hover:to-amber-100/70',
    border: 'border-amber-200/60',
    wrapper: 'bg-amber-100/70 group-hover:bg-amber-100/90',
    icon: 'text-amber-600',
    title: 'text-amber-700',
  },
  danger: {
    gradient: 'from-rose-50/60 to-rose-100/60 hover:from-rose-50/70 hover:to-rose-100/70',
    border: 'border-rose-200/60',
    wrapper: 'bg-rose-100/70 group-hover:bg-rose-100/90',
    icon: 'text-rose-600',
    title: 'text-rose-700',
  },
}

const UpdateOptionCard: FC<UpdateOptionCardProps> = ({
  isSelected,
  onValueChange,
  icon: Icon,
  title,
  description,
  theme,
  iconClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  showCheckbox = true,
  isPressable = true,
  className = '',
}) => {
  const style = themeStyles[theme]

  return (
    <Card
      isPressable={isPressable}
      onPress={isPressable ? () => onValueChange(!isSelected) : undefined}
      className={`bg-gradient-to-r ${style.gradient} border ${style.border} shadow-sm group p-4 w-full ${className}`}
    >
      <div className='flex items-center gap-3'>
        {showCheckbox && (
          <Checkbox
            isSelected={isSelected}
            onValueChange={onValueChange}
            radius='full'
            size='lg'
            color={theme}
            classNames={{
              wrapper: 'rounded-full p-0',
            }}
          />
        )}
        <div className='flex-1 min-w-0 flex flex-col items-start'>
          {/* 标题行：图标 + 文字 */}
          <div className='flex items-center gap-2'>
            {Icon && (
              <Icon className={`${style.icon} size-5 ${iconClassName}`} />
            )}
            <div className={`font-medium ${style.title} ${titleClassName}`}>
              {title}
            </div>
          </div>
          {/* 描述行：和标题行公用左边界 */}
          {description && (
            <div className={`text-sm text-foreground-500 mt-1 ${descriptionClassName}`}>
              {description}
            </div>
          )}
        </div>
      </div>

    </Card>
  )
}

export default UpdateOptionCard
