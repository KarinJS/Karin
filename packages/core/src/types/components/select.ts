import { ComponentProps } from './base'

/**
 * 下拉选择框
 */
export interface SelectProps extends ComponentProps {
  componentType: 'select'
  /** 标签 */
  label?: string
  /** 占位符 */
  placeholder?: string
  /** 描述 */
  description?: string
  /** 大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 颜色 */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  /** 变体 */
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  /** 半径 */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  /** 默认值 */
  defaultValue?: string
  /** 值 */
  value?: string
  /** 错误信息 */
  errorMessage?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否必填 */
  isRequired?: boolean
  /** 是否只读 */
  isReadOnly?: boolean
  /** 是否无效 */
  isInvalid?: boolean
  /** 禁用动画 */
  disableAnimation?: boolean
  /** 下拉选项列表 */
  items: SelectItem[]
}

/**
 * 下拉选项
 */
export interface SelectItem extends ComponentProps {
  componentType: 'select-item'
  /** 值 */
  value: string
  /** 标签 */
  label?: string
  /** 描述 */
  description?: string
  /** 是否禁用 */
  isDisabled?: boolean
}
