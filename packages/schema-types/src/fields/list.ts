/**
 * @fileoverview 列表类字段类型定义
 * @description 包含简单列表、对象数组、键值对、JSON 编辑器等复杂数据结构组件
 * @module @karinjs/schema-types/fields/list
 */

import type { I18nString, SelectItem, ValidationRule, TableColumn, ModalSize } from '../base'
import type { FieldSchemaBase } from './common'

// 前向声明，避免循环依赖

type FieldSchema = any

// ============================================
// 简单列表
// ============================================

/**
 * 简单列表字段选项
 */
export interface ListFieldOptions {
  /**
   * 列表项类型
   */
  itemType: 'text' | 'number'

  /**
   * 最大项数
   */
  maxItems?: number

  /**
   * 最小项数
   */
  minItems?: number

  /**
   * 添加按钮文本
   * @default '添加'
   */
  addButtonText?: I18nString

  /**
   * 是否支持拖拽排序
   * @default false
   */
  sortable?: boolean

  /**
   * 是否可折叠
   * @default false
   */
  collapsible?: boolean

  /**
   * 列表项占位符
   */
  itemPlaceholder?: I18nString

  /**
   * 列表项验证规则
   */
  itemRules?: ValidationRule[]
}

/**
 * 简单列表字段 Schema
 * @description 简单值列表，如字符串数组或数字数组
 * @example
 * ```ts
 * const field: ListFieldSchema = {
 *   key: 'tags',
 *   type: 'list',
 *   label: '标签列表',
 *   options: {
 *     itemType: 'text',
 *     maxItems: 10,
 *     sortable: true,
 *     itemPlaceholder: '输入标签'
 *   }
 * }
 * ```
 */
export interface ListFieldSchema extends FieldSchemaBase {
  type: 'list'
  options: ListFieldOptions
}

// ============================================
// 对象数组
// ============================================

/**
 * 对象数组编辑模态框配置
 */
export interface ObjectListEditModal {
  /**
   * 模态框标题
   */
  title?: I18nString

  /**
   * 模态框尺寸
   * @default 'md'
   */
  size?: ModalSize

  /**
   * 表单列数
   * @default 1
   */
  columns?: 1 | 2
}

/**
 * 对象数组字段选项
 */
export interface ObjectListFieldOptions {
  /**
   * 列表项的字段 Schema
   * @description 定义每个对象中的字段结构
   */
  itemSchema: FieldSchema[]

  /**
   * 显示模式
   * - card: 卡片模式，每个对象显示为一张卡片
   * - table: 表格模式，所有对象显示在表格中
   * - inline: 内联模式，紧凑显示
   * @default 'card'
   */
  displayMode: 'card' | 'table' | 'inline'

  /**
   * 预览时显示的字段
   * @description 卡片模式下，在收起状态显示的字段列表
   */
  previewFields?: string[]

  /**
   * 标题字段
   * @description 用作卡片标题的字段名
   */
  titleField?: string

  /**
   * 表格列定义
   * @description table 模式下的列配置
   */
  columns?: TableColumn[]

  /**
   * 最大项数
   */
  maxItems?: number

  /**
   * 最小项数
   */
  minItems?: number

  /**
   * 添加按钮文本
   * @default '添加'
   */
  addButtonText?: I18nString

  /**
   * 是否支持拖拽排序
   * @default false
   */
  sortable?: boolean

  /**
   * 编辑模态框配置
   */
  editModal?: ObjectListEditModal

  /**
   * 空列表提示文本
   */
  emptyText?: I18nString

  /**
   * 删除前是否需要确认
   * @default true
   */
  confirmDelete?: boolean
}

/**
 * 对象数组字段 Schema
 * @description 对象数组列表，每个元素都是一个包含多字段的对象
 * @example
 * ```ts
 * const field: ObjectListFieldSchema = {
 *   key: 'users',
 *   type: 'object-list',
 *   label: '用户列表',
 *   options: {
 *     displayMode: 'table',
 *     itemSchema: [
 *       { key: 'name', type: 'text', label: '姓名' },
 *       { key: 'email', type: 'text', label: '邮箱' },
 *       { key: 'role', type: 'select', label: '角色', options: { items: [...] } }
 *     ],
 *     columns: [
 *       { field: 'name', title: '姓名', width: 150 },
 *       { field: 'email', title: '邮箱' },
 *       { field: 'role', title: '角色', format: 'badge' }
 *     ],
 *     maxItems: 20,
 *     confirmDelete: true
 *   }
 * }
 * ```
 */
export interface ObjectListFieldSchema extends FieldSchemaBase {
  type: 'object-list'
  options: ObjectListFieldOptions
}

// ============================================
// 键值对
// ============================================

/**
 * 键值对字段选项
 */
export interface KeyValueFieldOptions {
  /**
   * 键列标签
   * @default '键'
   */
  keyLabel?: I18nString

  /**
   * 值列标签
   * @default '值'
   */
  valueLabel?: I18nString

  /**
   * 键输入框占位符
   */
  keyPlaceholder?: I18nString

  /**
   * 值输入框占位符
   */
  valuePlaceholder?: I18nString

  /**
   * 键是否可编辑
   * @description 设为 false 时，键只能从预定义列表选择
   * @default true
   */
  keyEditable?: boolean

  /**
   * 预定义键列表
   * @description 可选的键名列表，配合 keyEditable: false 使用
   */
  predefinedKeys?: SelectItem[]

  /**
   * 值的类型
   * @default 'text'
   */
  valueType?: 'text' | 'number' | 'boolean' | 'select'

  /**
   * 值选项列表
   * @description 当 valueType 为 'select' 时的选项列表
   */
  valueOptions?: SelectItem[]

  /**
   * 是否支持拖拽排序
   * @default false
   */
  sortable?: boolean
}

/**
 * 键值对字段 Schema
 * @description 键值对列表，用于输入类似环境变量的数据
 * @example
 * ```ts
 * const field: KeyValueFieldSchema = {
 *   key: 'env',
 *   type: 'key-value',
 *   label: '环境变量',
 *   options: {
 *     keyLabel: '变量名',
 *     valueLabel: '变量值',
 *     keyPlaceholder: 'KEY',
 *     valuePlaceholder: 'value',
 *     sortable: true
 *   }
 * }
 * ```
 */
export interface KeyValueFieldSchema extends FieldSchemaBase {
  type: 'key-value'
  options?: KeyValueFieldOptions
}

// ============================================
// JSON 编辑器
// ============================================

/**
 * JSON 编辑器字段选项
 */
export interface JsonEditorFieldOptions {
  /**
   * 编辑器高度
   * @default '200px'
   */
  height?: string | number

  /**
   * 是否显示格式化按钮
   * @default true
   */
  showFormat?: boolean

  /**
   * 是否显示行号
   * @default true
   */
  showLineNumbers?: boolean

  /**
   * 编辑语言
   * @default 'json'
   */
  language?: 'json' | 'yaml'
}

/**
 * JSON 编辑器字段 Schema
 * @description JSON/YAML 代码编辑器
 * @example
 * ```ts
 * const field: JsonEditorFieldSchema = {
 *   key: 'config',
 *   type: 'json-editor',
 *   label: '配置文件',
 *   options: {
 *     height: 300,
 *     language: 'json',
 *     showFormat: true,
 *     showLineNumbers: true
 *   }
 * }
 * ```
 */
export interface JsonEditorFieldSchema extends FieldSchemaBase {
  type: 'json-editor'
  options?: JsonEditorFieldOptions
}
