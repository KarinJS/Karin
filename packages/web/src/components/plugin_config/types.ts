/**
 * 输入类型枚举
 */
export enum InputDataType {
  /** 字符串 */
  STRING = 'string',
  /** 数字 */
  NUMBER = 'number',
  /** 布尔值 */
  BOOLEAN = 'boolean',
  /** 日期 */
  DATE = 'date',
  /** 时间 */
  TIME = 'time',
  /** 日期时间 */
  DATETIME = 'datetime',
  /** 邮箱 */
  EMAIL = 'email',
  /** URL */
  URL = 'url',
  /** 电话 */
  TEL = 'tel',
  /** 密码 */
  PASSWORD = 'password',
  /** 颜色 */
  COLOR = 'color',
  /** JSON */
  JSON = 'json'
}

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
 * 类型
 */
export interface InputProps {
  /** 唯一标识 */
  key: string
  /** 类名 */
  className?: string
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
  /** 默认值 */
  defaultValue?: string
  /** 提示信息 */
  placeholder?: string
  /** 描述 */
  description?: string
  /** 错误信息 */
  errorMessage?: string
  /** 验证 */
  // validate: (text: string) => boolean
  /** 验证行为 */
  validationBehavior?: 'native' | 'aria'
  /** 最小长度 */
  minLength?: number
  /** 最大长度 */
  maxLength?: number
  /** 模式 */
  pattern?: string
  /** 类型 */
  type?: 'text' | 'email' | 'url' | 'password' | 'tel' | 'search' | 'file'
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
  // /** 基础引用 */
  // baseRef: RefObject<HTMLDivElement>
  /** 禁用动画 */
  disableAnimation?: boolean
  /** 类名 */
  classNames?: Partial<Record<'base' | 'label' | 'inputWrapper' | 'innerWrapper' | 'mainWrapper' | 'input' | 'clearButton' | 'helperWrapper' | 'description' | 'errorMessage', string>>
  /** 验证规则 */
  validationRules?: ValidationRule[]
}
