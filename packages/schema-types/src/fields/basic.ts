/**
 * @fileoverview 基础输入字段类型定义
 * @description 包含文本、密码、数字、多行文本、开关、下拉选择等基础输入组件
 * @module @karinjs/schema-types/fields/basic
 */

import type { I18nString, SelectItem, ComponentColor } from '../base'
import type { FieldSchemaBase } from './common'

// ============================================
// 文本输入
// ============================================

/**
 * 文本输入字段选项
 */
export interface TextFieldOptions {
  /**
   * 最大输入长度
   */
  maxLength?: number

  /**
   * 最小输入长度
   */
  minLength?: number

  /**
   * 输入验证正则表达式
   * @description 只允许输入匹配该正则的字符
   */
  pattern?: string

  /**
   * 是否显示清除按钮
   * @default false
   */
  clearable?: boolean
}

/**
 * 文本输入字段 Schema
 * @description 单行文本输入框，用于输入短文本
 * @example
 * ```ts
 * const field: TextFieldSchema = {
 *   key: 'username',
 *   type: 'text',
 *   label: '用户名',
 *   placeholder: '请输入用户名',
 *   options: {
 *     maxLength: 50,
 *     clearable: true
 *   }
 * }
 * ```
 */
export interface TextFieldSchema extends FieldSchemaBase {
  type: 'text'
  options?: TextFieldOptions
}

// ============================================
// 密码输入
// ============================================

/**
 * 密码输入字段选项
 */
export interface PasswordFieldOptions {
  /**
   * 是否显示密码可见切换按钮
   * @default true
   */
  showToggle?: boolean

  /**
   * 最大输入长度
   */
  maxLength?: number
}

/**
 * 密码输入字段 Schema
 * @description 密码输入框，默认隐藏输入内容
 * @example
 * ```ts
 * const field: PasswordFieldSchema = {
 *   key: 'password',
 *   type: 'password',
 *   label: '密码',
 *   options: {
 *     showToggle: true
 *   }
 * }
 * ```
 */
export interface PasswordFieldSchema extends FieldSchemaBase {
  type: 'password'
  options?: PasswordFieldOptions
}

// ============================================
// 数字输入
// ============================================

/**
 * 数字输入字段选项
 */
export interface NumberFieldOptions {
  /**
   * 最小值
   */
  min?: number

  /**
   * 最大值
   */
  max?: number

  /**
   * 步进值
   * @description 每次增减的数值
   * @default 1
   */
  step?: number

  /**
   * 小数精度
   * @description 保留的小数位数
   */
  precision?: number
}

/**
 * 数字输入字段 Schema
 * @description 数字输入框，支持步进增减
 * @example
 * ```ts
 * const field: NumberFieldSchema = {
 *   key: 'port',
 *   type: 'number',
 *   label: '端口号',
 *   options: {
 *     min: 1,
 *     max: 65535,
 *     step: 1
 *   }
 * }
 * ```
 */
export interface NumberFieldSchema extends FieldSchemaBase {
  type: 'number'
  options?: NumberFieldOptions
}

// ============================================
// 多行文本
// ============================================

/**
 * 多行文本字段选项
 */
export interface TextareaFieldOptions {
  /**
   * 默认行数
   * @default 3
   */
  rows?: number

  /**
   * 最大输入长度
   */
  maxLength?: number

  /**
   * 是否自动调整高度
   * @default false
   */
  autoResize?: boolean
}

/**
 * 多行文本字段 Schema
 * @description 多行文本输入框，用于输入较长文本
 * @example
 * ```ts
 * const field: TextareaFieldSchema = {
 *   key: 'description',
 *   type: 'textarea',
 *   label: '描述',
 *   options: {
 *     rows: 5,
 *     maxLength: 1000,
 *     autoResize: true
 *   }
 * }
 * ```
 */
export interface TextareaFieldSchema extends FieldSchemaBase {
  type: 'textarea'
  options?: TextareaFieldOptions
}

// ============================================
// 开关
// ============================================

/**
 * 开关字段选项
 */
export interface SwitchFieldOptions {
  /**
   * 开关颜色
   * @default 'primary'
   */
  color?: ComponentColor
}

/**
 * 开关字段 Schema
 * @description 布尔值切换开关
 * @example
 * ```ts
 * const field: SwitchFieldSchema = {
 *   key: 'enabled',
 *   type: 'switch',
 *   label: '启用功能',
 *   defaultValue: true,
 *   options: {
 *     color: 'success'
 *   }
 * }
 * ```
 */
export interface SwitchFieldSchema extends FieldSchemaBase {
  type: 'switch'
  options?: SwitchFieldOptions
}

// ============================================
// 下拉选择
// ============================================

/**
 * 下拉选择字段选项
 */
export interface SelectFieldOptions {
  /**
   * 选项列表
   */
  items: SelectItem[]

  /**
   * 是否支持多选
   * @default false
   */
  multiple?: boolean

  /**
   * 是否支持搜索过滤
   * @default false
   */
  searchable?: boolean

  /**
   * 是否允许输入自定义值
   * @description 允许用户输入不在选项列表中的值
   * @default false
   */
  allowCustom?: boolean

  /**
   * 空状态提示文本
   */
  emptyText?: I18nString
}

/**
 * 下拉选择字段 Schema
 * @description 下拉选择框，支持单选和多选
 * @example
 * ```ts
 * const field: SelectFieldSchema = {
 *   key: 'protocol',
 *   type: 'select',
 *   label: '协议',
 *   options: {
 *     items: [
 *       { label: 'HTTP', value: 'http' },
 *       { label: 'HTTPS', value: 'https' }
 *     ],
 *     searchable: true
 *   }
 * }
 * ```
 */
export interface SelectFieldSchema extends FieldSchemaBase {
  type: 'select'
  options: SelectFieldOptions
}
