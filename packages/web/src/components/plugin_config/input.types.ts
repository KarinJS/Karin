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