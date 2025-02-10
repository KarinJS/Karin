import { ComponentProps } from './base'

/**
 * 开关类型
 */
export interface SwitchProps extends ComponentProps {
  componentType: 'switch'
  /** 开始文本 */
  startText?: string
  /** 结束文本 */
  endText?: string
  /** 大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 颜色 */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  /** 开关图标 */
  thumbIcon?: string
  /** 切换开始时显示的图标 */
  startContent?: string
  /** 切换结束时显示的图标 */
  endContent?: string
  /** 输入是否可以被用户选择但不能被更改 */
  isSelected?: boolean
  /** 默认选中 */
  defaultSelected?: boolean
  /** 是否只读 */
  isReadOnly?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否禁用动画 */
  disableAnimation?: boolean
}
