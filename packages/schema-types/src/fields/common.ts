/**
 * @fileoverview 字段通用基础定义
 * @description 所有字段 Schema 的公共基础接口
 * @module @karinjs/schema-types/fields/common
 */

import type {
  I18nString,
  IconName,
  ConditionExpression,
  ValidationRule,
  FieldLayout,
} from '../base'

/**
 * 字段 Schema 基础接口
 * @description 所有字段类型都继承自此接口，包含通用的字段配置
 * @example
 * ```ts
 * // 自定义字段类型需继承此接口
 * interface MyFieldSchema extends FieldSchemaBase {
 *   type: 'my-field'
 *   options?: {
 *     // 自定义选项
 *   }
 * }
 * ```
 */
export interface FieldSchemaBase {
  /**
   * 字段唯一标识
   * @description 用于表单数据绑定和字段引用，在同一表单中必须唯一
   */
  key: string

  /**
   * 字段类型
   * @description 决定渲染的组件类型
   */
  type: string

  /**
   * 字段标签
   * @description 显示在字段旁边或上方的标签文本
   */
  label?: I18nString

  /**
   * 字段描述
   * @description 显示在字段下方的帮助文本，用于解释字段用途
   */
  description?: I18nString

  /**
   * 占位符文本
   * @description 输入类组件在无值时显示的提示文本
   */
  placeholder?: I18nString

  /**
   * 工具提示
   * @description 悬停时显示的详细说明
   */
  tooltip?: I18nString

  /**
   * 默认值
   * @description 字段初始化时的默认值，类型取决于具体字段类型
   */
  defaultValue?: unknown

  /**
   * 禁用状态
   * @description 可以是布尔值或条件表达式
   * - true: 始终禁用
   * - false: 始终启用
   * - ConditionExpression: 根据其他字段值动态决定
   */
  disabled?: boolean | ConditionExpression

  /**
   * 隐藏状态
   * @description 可以是布尔值或条件表达式
   * - true: 始终隐藏
   * - false: 始终显示
   * - ConditionExpression: 根据其他字段值动态决定
   */
  hidden?: boolean | ConditionExpression

  /**
   * 是否必填
   * @description 为 true 时字段不能为空，并显示必填标记
   * @default false
   */
  required?: boolean

  /**
   * 验证规则数组
   * @description 定义字段的验证规则，按顺序执行验证
   */
  rules?: ValidationRule[]

  /**
   * 布局配置
   * @description 控制字段在表单网格中的布局
   */
  layout?: FieldLayout

  /**
   * 前缀图标
   * @description 显示在输入框左侧的图标
   */
  prefixIcon?: IconName

  /**
   * 后缀图标
   * @description 显示在输入框右侧的图标
   */
  suffixIcon?: IconName
}
