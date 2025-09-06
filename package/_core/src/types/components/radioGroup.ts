import { ComponentProps } from './base'

/**
 * 单选框组
 */
export interface RadioGroupProps extends ComponentProps {
  componentType: 'radio-group'
  /** 标签 */
  label?: string
  /** 复选框的大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 复选框的颜色 */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  /** 方向 */
  orientation?: 'horizontal' | 'vertical'
  /** 提交 HTML 表单时使用的 checkbox 元素的名称 */
  name?: string
  /** 值 */
  value?: string
  /** 默认值 */
  defaultValue?: string
  /** 错误信息 */
  errorMessage?: string
  // /** 验证 */
  // validate?: (value: string) => boolean
  // /** 验证行为 */
  // validationBehavior?: 'silent' | 'live'
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
  /** 单选框列表 */
  radio: Radio[]
}

/**
 * 单选框
 */
export interface Radio extends ComponentProps {
  componentType: 'radio'
  /** 值 */
  value: string
  /** 标签 */
  label?: string
  /** 大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 颜色 */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  /** 描述 */
  description?: string
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
}
