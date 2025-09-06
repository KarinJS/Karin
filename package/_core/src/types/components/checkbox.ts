import { ComponentProps } from './base'

/**
 * 复选框组
 */
export interface CheckboxGroupProps extends ComponentProps {
  componentType: 'checkbox-group'
  /** 方向 垂直或水平 默认水平 */
  orientation?: 'vertical' | 'horizontal'
  /** 颜色 */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  /** 大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 半径 */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  /** 名称 */
  name?: string
  /** 标签 */
  label?: string
  /** 值 */
  value?: string[]
  /** 是否划线 */
  lineThrough?: boolean
  /** 默认值 */
  defaultValue?: string[]
  /** 是否无效 */
  isInvalid?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否必填 */
  isRequired?: boolean
  /** 是否只读 */
  isReadOnly?: boolean
  /** 禁用动画 */
  disableAnimation?: boolean
  /** 选项列表 */
  checkbox: CheckboxProps[]
}

/**
 * 复选框
 */
export interface CheckboxProps extends ComponentProps {
  componentType: 'checkbox'
  /** 值 */
  value?: string
  /** 标签 */
  label?: string
  /** 提交 HTML 表单时使用的 checkbox 元素的名称 */
  name?: string
  /** 复选框的大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 复选框的颜色 */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  /**
   * 复选框的半径
   * - none: 无
   * - sm: 小
   * - md: 中
   * - lg: 大
   * - full: 全
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  /** 是否划线 */
  lineThrough?: boolean
  /** 是否选中 */
  isSelected?: boolean
  /** 默认选中 */
  defaultSelected?: boolean
  /** 是否必填 */
  isRequired?: boolean
  /** 是否只读 */
  isReadOnly?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 不确定性只是呈现性的。无论用户是否进行交互，不确定的视觉呈现都会保持不变 */
  isIndeterminate?: boolean
  /** 是否无效 */
  isInvalid?: boolean
  /** 禁用动画 */
  disableAnimation?: boolean
}
