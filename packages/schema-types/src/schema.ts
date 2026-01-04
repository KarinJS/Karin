/**
 * @fileoverview 表单 Schema 定义
 * @description 定义完整的表单结构、选项和提交配置
 * @module @karinjs/schema-types/schema
 */

import type { I18nString } from './base'
import type { FieldSchema } from './fields'

// ============================================
// 表单布局
// ============================================

/**
 * 表单布局类型
 */
export type FormLayout = 'vertical' | 'horizontal' | 'inline'

/**
 * 表单列数
 */
export type FormColumns = 1 | 2 | 3 | 4

/**
 * 提交按钮位置
 */
export type SubmitPosition = 'top' | 'bottom' | 'both'

// ============================================
// 表单选项
// ============================================

/**
 * 提交按钮配置
 */
export interface SubmitButtonConfig {
  /**
   * 按钮文本
   * @default '提交'
   */
  text?: I18nString

  /**
   * 按钮位置
   * @default 'bottom'
   */
  position?: SubmitPosition
}

/**
 * 表单选项配置
 * @description 控制表单的整体布局和行为
 * @example
 * ```ts
 * const options: FormOptions = {
 *   layout: 'vertical',
 *   columns: 2,
 *   labelWidth: '120px',
 *   showRequiredMark: true,
 *   submit: {
 *     text: '保存设置',
 *     position: 'bottom'
 *   }
 * }
 * ```
 */
export interface FormOptions {
  /**
   * 表单布局模式
   * - vertical: 标签在上，输入框在下
   * - horizontal: 标签在左，输入框在右
   * - inline: 标签和输入框在同一行，紧凑排列
   * @default 'vertical'
   */
  layout?: FormLayout

  /**
   * 表单网格列数
   * @description 字段将按照此列数排列
   * @default 1
   */
  columns?: FormColumns

  /**
   * 标签宽度
   * @description 仅在 horizontal 布局下有效
   * @default '80px'
   */
  labelWidth?: string

  /**
   * 是否显示必填标记
   * @default true
   */
  showRequiredMark?: boolean

  /**
   * 提交按钮配置
   */
  submit?: SubmitButtonConfig
}

// ============================================
// 提交配置
// ============================================

/**
 * 提交方法类型
 */
export type SubmitMethod = 'POST' | 'PUT' | 'PATCH'

/**
 * 数据转换方式
 */
export type DataTransform = 'flat' | 'nested'

/**
 * 成功后操作
 */
export type SuccessAction = 'reload' | 'redirect' | 'none'

/**
 * 表单提交配置
 * @description 定义表单数据的提交方式和成功后的行为
 * @example
 * ```ts
 * const submit: SubmitConfig = {
 *   api: '/api/settings',
 *   method: 'PUT',
 *   transform: 'nested',
 *   successMessage: '保存成功',
 *   onSuccess: 'reload'
 * }
 * ```
 */
export interface SubmitConfig {
  /**
   * 提交 API 地址
   */
  api: string

  /**
   * HTTP 请求方法
   * @default 'POST'
   */
  method?: SubmitMethod

  /**
   * 数据转换方式
   * - flat: 扁平化，所有字段在同一层级
   * - nested: 嵌套，保持对象结构
   * @default 'nested'
   */
  transform?: DataTransform

  /**
   * 额外的提交参数
   * @description 会与表单数据合并后一起提交
   */
  extraParams?: Record<string, unknown>

  /**
   * 提交成功提示消息
   */
  successMessage?: I18nString

  /**
   * 成功后的操作
   * - reload: 刷新页面
   * - redirect: 跳转到指定页面
   * - none: 不做任何操作
   * @default 'none'
   */
  onSuccess?: SuccessAction

  /**
   * 跳转目标地址
   * @description 当 onSuccess 为 'redirect' 时有效
   */
  redirectTo?: string
}

// ============================================
// 表单 Schema
// ============================================

/**
 * Schema 版本号
 */
export type SchemaVersion = '1.0'

/**
 * 表单 Schema
 * @description 完整的表单定义，包含元信息、字段列表和配置
 * @example
 * ```ts
 * const schema: FormSchema = {
 *   version: '1.0',
 *   id: 'user-settings',
 *   title: '用户设置',
 *   description: '配置您的个人偏好',
 *   fields: [
 *     { key: 'username', type: 'text', label: '用户名', required: true },
 *     { key: 'email', type: 'text', label: '邮箱' },
 *     { key: 'theme', type: 'select', label: '主题', options: { items: [...] } }
 *   ],
 *   options: {
 *     columns: 2,
 *     layout: 'vertical'
 *   },
 *   submit: {
 *     api: '/api/user/settings',
 *     method: 'PUT',
 *     successMessage: '设置已保存'
 *   }
 * }
 * ```
 */
export interface FormSchema {
  /**
   * Schema 版本号
   * @description 用于兼容性检查
   */
  version: SchemaVersion

  /**
   * 表单唯一标识
   * @description 用于缓存、数据存储等场景的唯一标识
   */
  id: string

  /**
   * 表单标题
   */
  title?: I18nString

  /**
   * 表单描述
   */
  description?: I18nString

  /**
   * 字段列表
   * @description 表单包含的所有字段定义
   */
  fields: FieldSchema[]

  /**
   * 表单选项
   */
  options?: FormOptions

  /**
   * 提交配置
   */
  submit?: SubmitConfig
}
