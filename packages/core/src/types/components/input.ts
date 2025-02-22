import { ComponentProps } from './base'

/**
 * 验证规则接口
 */
export interface ValidationRule {
  /** 正则表达式 */
  regex?: string | RegExp
  /** 最小长度 */
  minLength?: number
  /** 最大长度 */
  maxLength?: number
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 自定义错误消息 */
  error?: string
}

/**
 * 输入框类型
 */
export interface InputProps extends ComponentProps {
  componentType: 'input'
  /**
   * 输入框的样式
   * - flat: 扁平化
   * - bordered: 带边框
   * - underlined: 带下划线
   * - faded: 渐入
   */
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded'
  /**
   * 颜色
   * - default: 默认
   * - primary: 主色
   * - secondary: 次色
   * - success: 成功
   * - warning: 警告
   * - danger: 危险
   */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  /**
   * 大小
   * - sm: 小
   * - md: 中
   * - lg: 大
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 圆角
   * - none: 无
   * - sm: 小
   * - md: 中
   * - lg: 大
   * - full: 全
   */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  /** 标签 */
  label?: string
  /** 值 */
  value?: string
  /** 默认值 */
  defaultValue?: string
  /** 提示信息 */
  placeholder?: string
  /** 错误信息 */
  errorMessage?: string
  /** 验证行为 */
  validationBehavior?: 'native' | 'aria'
  /** 最小长度 */
  minLength?: number
  /** 最大长度 */
  maxLength?: number
  /** 模式 */
  pattern?: string
  /** 类型 */
  type?: 'text' | 'email' | 'url' | 'password' | 'tel' | 'search' | 'file' | 'number'
  /** 开始内容 */
  startContent?: string
  /** 结束内容 */
  endContent?: string
  /** 标签位置 */
  labelPlacement?: 'inside' | 'outside' | 'outside-left'
  /** 是否全宽 */
  fullWidth?: boolean
  /** 是否可清除 */
  isClearable?: boolean
  /** 是否必填 */
  isRequired?: boolean
  /** 是否只读 */
  isReadOnly?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否无效 */
  isInvalid?: boolean
  /** 禁用动画 */
  disableAnimation?: boolean
  /** 自定义字段 验证规则 */
  rules?: ValidationRule[]
  /** 自定义字段 输入框宽度 */
  width?: string
  /** 自定义字段 输入框高度 */
  height?: string
  /** 自动补全 */
  autoComplete?: string
}

/**
 * 输入框组类型
 */
export interface InputGroupProps extends ComponentProps {
  componentType: 'input-group'
  /** 标签 */
  label?: string
  /** 输入框模板 */
  template: InputProps
  /** 数据 */
  data: string[]
  /** 输入框一行最多显示多少个 默认3个 */
  itemsPerRow?: number
  /** 输入框最大显示多少行 超出后滚动 默认3行 */
  maxRows?: number
  /** 输入框最大输入框数量 默认100 0不限制 */
  maxInputs?: number
  /** 删除输入框提示 默认: 删除成功 */
  deleteSuccessTips?: string
}
