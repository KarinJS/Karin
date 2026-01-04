/**
 * @fileoverview 高级输入字段类型定义
 * @description 包含复选框、单选组、滑块、颜色选择器、日期选择器等高级输入组件
 * @module @karinjs/schema-types/fields/input
 */

import type { I18nString, SelectItem, ComponentColor, ComponentSize, ForegroundColor } from '../base'
import type { FieldSchemaBase } from './common'

// ============================================
// 复选框
// ============================================

/**
 * 复选框字段选项
 */
export interface CheckboxFieldOptions {
  /**
   * 复选框颜色
   * @default 'primary'
   */
  color?: ComponentColor

  /**
   * 复选框尺寸
   * @default 'md'
   */
  size?: ComponentSize
}

/**
 * 复选框字段 Schema
 * @description 单个复选框，用于布尔值选择
 * @example
 * ```ts
 * const field: CheckboxFieldSchema = {
 *   key: 'agree',
 *   type: 'checkbox',
 *   label: '我同意用户协议',
 *   options: {
 *     color: 'primary'
 *   }
 * }
 * ```
 */
export interface CheckboxFieldSchema extends FieldSchemaBase {
  type: 'checkbox'
  options?: CheckboxFieldOptions
}

// ============================================
// 复选框组
// ============================================

/**
 * 复选框组字段选项
 */
export interface CheckboxGroupFieldOptions {
  /**
   * 选项列表
   */
  items: SelectItem[]

  /**
   * 排列方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * 复选框颜色
   * @default 'primary'
   */
  color?: ComponentColor
}

/**
 * 复选框组字段 Schema
 * @description 一组复选框，用于多选
 * @example
 * ```ts
 * const field: CheckboxGroupFieldSchema = {
 *   key: 'features',
 *   type: 'checkbox-group',
 *   label: '选择功能',
 *   options: {
 *     items: [
 *       { label: '功能A', value: 'a' },
 *       { label: '功能B', value: 'b' },
 *       { label: '功能C', value: 'c' }
 *     ],
 *     orientation: 'vertical'
 *   }
 * }
 * ```
 */
export interface CheckboxGroupFieldSchema extends FieldSchemaBase {
  type: 'checkbox-group'
  options: CheckboxGroupFieldOptions
}

// ============================================
// 单选组
// ============================================

/**
 * 单选组字段选项
 */
export interface RadioGroupFieldOptions {
  /**
   * 选项列表
   */
  items: SelectItem[]

  /**
   * 排列方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * 单选按钮颜色
   * @default 'primary'
   */
  color?: ComponentColor
}

/**
 * 单选组字段 Schema
 * @description 一组单选按钮，用于单选
 * @example
 * ```ts
 * const field: RadioGroupFieldSchema = {
 *   key: 'gender',
 *   type: 'radio-group',
 *   label: '性别',
 *   options: {
 *     items: [
 *       { label: '男', value: 'male' },
 *       { label: '女', value: 'female' }
 *     ]
 *   }
 * }
 * ```
 */
export interface RadioGroupFieldSchema extends FieldSchemaBase {
  type: 'radio-group'
  options: RadioGroupFieldOptions
}

// ============================================
// 自动补全
// ============================================

/**
 * 自动补全字段选项
 */
export interface AutocompleteFieldOptions {
  /**
   * 选项列表
   */
  items: SelectItem[]

  /**
   * 是否允许输入不在列表中的值
   * @default false
   */
  allowCustomValue?: boolean

  /**
   * 是否支持多选
   * @default false
   */
  multiple?: boolean

  /**
   * 空状态提示文本
   */
  emptyText?: I18nString
}

/**
 * 自动补全字段 Schema
 * @description 带有自动补全功能的输入框
 * @example
 * ```ts
 * const field: AutocompleteFieldSchema = {
 *   key: 'city',
 *   type: 'autocomplete',
 *   label: '城市',
 *   options: {
 *     items: [
 *       { label: '北京', value: 'beijing' },
 *       { label: '上海', value: 'shanghai' }
 *     ],
 *     allowCustomValue: true
 *   }
 * }
 * ```
 */
export interface AutocompleteFieldSchema extends FieldSchemaBase {
  type: 'autocomplete'
  options: AutocompleteFieldOptions
}

// ============================================
// 滑块
// ============================================

/**
 * 滑块刻度标记
 */
export interface SliderMark {
  /**
   * 刻度值
   */
  value: number

  /**
   * 刻度标签
   */
  label: string
}

/**
 * 滑块字段选项
 */
export interface SliderFieldOptions {
  /**
   * 最小值
   * @default 0
   */
  min?: number

  /**
   * 最大值
   * @default 100
   */
  max?: number

  /**
   * 步进值
   * @default 1
   */
  step?: number

  /**
   * 是否显示步进点
   * @default false
   */
  showSteps?: boolean

  /**
   * 是否显示当前值标签
   * @default false
   */
  showValue?: boolean

  /**
   * 刻度标记
   */
  marks?: SliderMark[]

  /**
   * 滑块颜色
   * @default 'primary'
   */
  color?: ForegroundColor
}

/**
 * 滑块字段 Schema
 * @description 滑块选择器，用于在范围内选择数值
 * @example
 * ```ts
 * const field: SliderFieldSchema = {
 *   key: 'volume',
 *   type: 'slider',
 *   label: '音量',
 *   defaultValue: 50,
 *   options: {
 *     min: 0,
 *     max: 100,
 *     showValue: true,
 *     marks: [
 *       { value: 0, label: '静音' },
 *       { value: 50, label: '中等' },
 *       { value: 100, label: '最大' }
 *     ]
 *   }
 * }
 * ```
 */
export interface SliderFieldSchema extends FieldSchemaBase {
  type: 'slider'
  options?: SliderFieldOptions
}

// ============================================
// 日期选择器
// ============================================

/**
 * 日期选择器字段选项
 */
export interface DatePickerFieldOptions {
  /**
   * 最小可选日期
   * @description ISO 8601 格式，如 '2024-01-01'
   */
  minDate?: string

  /**
   * 最大可选日期
   * @description ISO 8601 格式，如 '2024-12-31'
   */
  maxDate?: string

  /**
   * 是否同时选择时间
   * @default false
   */
  showTime?: boolean

  /**
   * 日期显示格式
   * @default 'YYYY-MM-DD'
   */
  format?: string
}

/**
 * 日期选择器字段 Schema
 * @description 日期选择器，用于选择单个日期
 * @example
 * ```ts
 * const field: DatePickerFieldSchema = {
 *   key: 'birthday',
 *   type: 'date-picker',
 *   label: '生日',
 *   options: {
 *     maxDate: '2024-12-31',
 *     format: 'YYYY年MM月DD日'
 *   }
 * }
 * ```
 */
export interface DatePickerFieldSchema extends FieldSchemaBase {
  type: 'date-picker'
  options?: DatePickerFieldOptions
}

// ============================================
// 日期范围选择器
// ============================================

/**
 * 日期范围选择器字段选项
 */
export interface DateRangePickerFieldOptions {
  /**
   * 最小可选日期
   */
  minDate?: string

  /**
   * 最大可选日期
   */
  maxDate?: string

  /**
   * 日期显示格式
   * @default 'YYYY-MM-DD'
   */
  format?: string
}

/**
 * 日期范围选择器字段 Schema
 * @description 日期范围选择器，用于选择起止日期
 * @example
 * ```ts
 * const field: DateRangePickerFieldSchema = {
 *   key: 'dateRange',
 *   type: 'date-range-picker',
 *   label: '日期范围',
 *   options: {
 *     format: 'YYYY-MM-DD'
 *   }
 * }
 * ```
 */
export interface DateRangePickerFieldSchema extends FieldSchemaBase {
  type: 'date-range-picker'
  options?: DateRangePickerFieldOptions
}

// ============================================
// 时间输入
// ============================================

/**
 * 时间输入字段选项
 */
export interface TimeInputFieldOptions {
  /**
   * 时制
   * @default 24
   */
  hourCycle?: 12 | 24

  /**
   * 时间精度
   * @default 'minute'
   */
  granularity?: 'hour' | 'minute' | 'second'
}

/**
 * 时间输入字段 Schema
 * @description 时间输入框，用于输入时间
 * @example
 * ```ts
 * const field: TimeInputFieldSchema = {
 *   key: 'startTime',
 *   type: 'time-input',
 *   label: '开始时间',
 *   options: {
 *     hourCycle: 24,
 *     granularity: 'minute'
 *   }
 * }
 * ```
 */
export interface TimeInputFieldSchema extends FieldSchemaBase {
  type: 'time-input'
  options?: TimeInputFieldOptions
}

// ============================================
// 颜色选择器
// ============================================

/**
 * 颜色选择器字段选项
 */
export interface ColorPickerFieldOptions {
  /**
   * 是否显示透明度选择
   * @default false
   */
  showAlpha?: boolean

  /**
   * 预设颜色列表
   */
  presetColors?: string[]

  /**
   * 颜色值格式
   * @default 'hex'
   */
  format?: 'hex' | 'rgb' | 'hsl'
}

/**
 * 颜色选择器字段 Schema
 * @description 颜色选择器，用于选择颜色值
 * @example
 * ```ts
 * const field: ColorPickerFieldSchema = {
 *   key: 'themeColor',
 *   type: 'color-picker',
 *   label: '主题色',
 *   defaultValue: '#1890ff',
 *   options: {
 *     presetColors: ['#1890ff', '#52c41a', '#faad14', '#f5222d'],
 *     showAlpha: true
 *   }
 * }
 * ```
 */
export interface ColorPickerFieldSchema extends FieldSchemaBase {
  type: 'color-picker'
  options?: ColorPickerFieldOptions
}

// ============================================
// 图片上传
// ============================================

/**
 * 图片上传字段选项
 */
export interface ImageUploadFieldOptions {
  /**
   * 接受的文件类型
   * @default 'image/*'
   */
  accept?: string

  /**
   * 最大文件大小 (KB)
   */
  maxSize?: number

  /**
   * 是否支持多文件上传
   * @default false
   */
  multiple?: boolean

  /**
   * 最大文件数量
   * @description 仅在 multiple 为 true 时有效
   */
  maxFiles?: number

  /**
   * 图片宽高比
   * @description 用于裁剪，如 16/9
   */
  aspectRatio?: number

  /**
   * 是否显示预览
   * @default true
   */
  showPreview?: boolean
}

/**
 * 图片上传字段 Schema
 * @description 图片上传组件，支持预览和裁剪
 * @example
 * ```ts
 * const field: ImageUploadFieldSchema = {
 *   key: 'avatar',
 *   type: 'image-upload',
 *   label: '头像',
 *   options: {
 *     maxSize: 2048,
 *     aspectRatio: 1,
 *     showPreview: true
 *   }
 * }
 * ```
 */
export interface ImageUploadFieldSchema extends FieldSchemaBase {
  type: 'image-upload'
  options?: ImageUploadFieldOptions
}

// ============================================
// 文件上传
// ============================================

/**
 * 文件上传字段选项
 */
export interface FileUploadFieldOptions {
  /**
   * 接受的文件类型
   * @description MIME 类型或扩展名，如 '.pdf,.doc' 或 'application/pdf'
   */
  accept?: string

  /**
   * 最大文件大小 (KB)
   */
  maxSize?: number

  /**
   * 是否支持多文件上传
   * @default false
   */
  multiple?: boolean

  /**
   * 最大文件数量
   * @description 仅在 multiple 为 true 时有效
   */
  maxFiles?: number
}

/**
 * 文件上传字段 Schema
 * @description 通用文件上传组件
 * @example
 * ```ts
 * const field: FileUploadFieldSchema = {
 *   key: 'attachments',
 *   type: 'file-upload',
 *   label: '附件',
 *   options: {
 *     accept: '.pdf,.docx,.xlsx',
 *     maxSize: 10240,
 *     multiple: true,
 *     maxFiles: 5
 *   }
 * }
 * ```
 */
export interface FileUploadFieldSchema extends FieldSchemaBase {
  type: 'file-upload'
  options?: FileUploadFieldOptions
}

// ============================================
// 标签输入
// ============================================

/**
 * 标签输入字段选项
 */
export interface TagsInputFieldOptions {
  /**
   * 最大标签数量
   */
  maxTags?: number

  /**
   * 是否允许重复标签
   * @default false
   */
  allowDuplicates?: boolean

  /**
   * 标签颜色
   * @default 'primary'
   */
  color?: ComponentColor

  /**
   * 标签尺寸
   * @default 'md'
   */
  size?: ComponentSize

  /**
   * 输入框占位符
   */
  placeholder?: I18nString
}

/**
 * 标签输入字段 Schema
 * @description 标签输入组件，用于输入多个标签
 * @example
 * ```ts
 * const field: TagsInputFieldSchema = {
 *   key: 'tags',
 *   type: 'tags-input',
 *   label: '标签',
 *   options: {
 *     maxTags: 10,
 *     placeholder: '输入标签后按回车',
 *     color: 'primary'
 *   }
 * }
 * ```
 */
export interface TagsInputFieldSchema extends FieldSchemaBase {
  type: 'tags-input'
  options?: TagsInputFieldOptions
}

// ============================================
// OTP 输入
// ============================================

/**
 * OTP 输入字段选项
 */
export interface OtpInputFieldOptions {
  /**
   * 验证码长度
   * @default 6
   */
  length?: number

  /**
   * 输入类型
   * @default 'number'
   */
  type?: 'text' | 'number'

  /**
   * 输入框尺寸
   * @default 'md'
   */
  size?: ComponentSize
}

/**
 * OTP 输入字段 Schema
 * @description 一次性验证码输入组件
 * @example
 * ```ts
 * const field: OtpInputFieldSchema = {
 *   key: 'verifyCode',
 *   type: 'otp-input',
 *   label: '验证码',
 *   options: {
 *     length: 6,
 *     type: 'number'
 *   }
 * }
 * ```
 */
export interface OtpInputFieldSchema extends FieldSchemaBase {
  type: 'otp-input'
  options?: OtpInputFieldOptions
}

// ============================================
// 评分
// ============================================

/**
 * 评分字段选项
 */
export interface RatingFieldOptions {
  /**
   * 最大评分值
   * @default 5
   */
  max?: number

  /**
   * 评分尺寸
   * @default 'md'
   */
  size?: ComponentSize

  /**
   * 评分颜色
   * @default 'warning'
   */
  color?: ComponentColor

  /**
   * 是否允许半星
   * @default false
   */
  allowHalf?: boolean

  /**
   * 是否只读
   * @default false
   */
  readonly?: boolean
}

/**
 * 评分字段 Schema
 * @description 星级评分组件
 * @example
 * ```ts
 * const field: RatingFieldSchema = {
 *   key: 'rating',
 *   type: 'rating',
 *   label: '评分',
 *   defaultValue: 3,
 *   options: {
 *     max: 5,
 *     allowHalf: true,
 *     color: 'warning'
 *   }
 * }
 * ```
 */
export interface RatingFieldSchema extends FieldSchemaBase {
  type: 'rating'
  options?: RatingFieldOptions
}
