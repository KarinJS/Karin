/**
 * @fileoverview 布局类字段类型定义
 * @description 包含分组、折叠面板、标签页、分隔线、提示框等布局组件
 * @module @karinjs/schema-types/fields/layout
 */

import type { I18nString, IconName, AccordionVariant, TabsVariant } from '../base'
import type { FieldSchemaBase } from './common'

// 前向声明，避免循环依赖

type FieldSchema = any

// ============================================
// 分组容器
// ============================================

/**
 * 分组容器字段选项
 */
export interface GroupFieldOptions {
  /**
   * 内部网格列数
   * @default 1
   */
  columns?: 1 | 2 | 3 | 4
}

/**
 * 分组容器字段 Schema
 * @description 将多个字段组合在一起，可设置内部布局
 * @example
 * ```ts
 * const field: GroupFieldSchema = {
 *   key: 'serverSettings',
 *   type: 'group',
 *   label: '服务器设置',
 *   options: {
 *     columns: 2
 *   },
 *   fields: [
 *     { key: 'host', type: 'text', label: '主机' },
 *     { key: 'port', type: 'number', label: '端口' }
 *   ]
 * }
 * ```
 */
export interface GroupFieldSchema extends FieldSchemaBase {
  type: 'group'
  options?: GroupFieldOptions
  /**
   * 子字段列表
   */
  fields?: FieldSchema[]
}

// ============================================
// 折叠面板
// ============================================

/**
 * 折叠面板项
 */
export interface AccordionItem {
  /**
   * 面板唯一标识
   */
  key: string

  /**
   * 面板标题
   */
  title: I18nString

  /**
   * 面板副标题
   */
  subtitle?: I18nString

  /**
   * 面板图标
   */
  icon?: IconName

  /**
   * 图标颜色
   */
  iconColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'

  /**
   * 面板内的字段
   */
  fields: FieldSchema[]
}

/**
 * 折叠面板字段选项
 */
export interface AccordionFieldOptions {
  /**
   * 面板项列表
   */
  items: AccordionItem[]

  /**
   * 默认展开的面板
   * @description 面板 key 数组
   */
  defaultExpanded?: string[]

  /**
   * 选择模式
   * - single: 只能展开一个面板
   * - multiple: 可以同时展开多个面板
   * @default 'single'
   */
  selectionMode?: 'single' | 'multiple'

  /**
   * 视觉变体
   * @default 'light'
   */
  variant?: AccordionVariant
}

/**
 * 折叠面板字段 Schema
 * @description 可折叠的多面板容器，适合组织大量设置项
 * @example
 * ```ts
 * const field: AccordionFieldSchema = {
 *   key: 'settings',
 *   type: 'accordion',
 *   options: {
 *     variant: 'splitted',
 *     selectionMode: 'multiple',
 *     defaultExpanded: ['basic'],
 *     items: [
 *       {
 *         key: 'basic',
 *         title: '基础设置',
 *         icon: 'settings',
 *         fields: [...]
 *       },
 *       {
 *         key: 'advanced',
 *         title: '高级设置',
 *         icon: 'cpu',
 *         fields: [...]
 *       }
 *     ]
 *   }
 * }
 * ```
 */
export interface AccordionFieldSchema extends FieldSchemaBase {
  type: 'accordion'
  options: AccordionFieldOptions
}

// ============================================
// 标签页
// ============================================

/**
 * 标签页项
 */
export interface TabItem {
  /**
   * 标签唯一标识
   */
  key: string

  /**
   * 标签标题
   */
  title: I18nString

  /**
   * 标签图标
   */
  icon?: IconName

  /**
   * 标签内的字段
   */
  fields: FieldSchema[]
}

/**
 * 标签页字段选项
 */
export interface TabsFieldOptions {
  /**
   * 标签项列表
   */
  items: TabItem[]

  /**
   * 视觉变体
   * @default 'solid'
   */
  variant?: TabsVariant
}

/**
 * 标签页字段 Schema
 * @description 标签页容器，用于分类展示不同内容
 * @example
 * ```ts
 * const field: TabsFieldSchema = {
 *   key: 'configTabs',
 *   type: 'tabs',
 *   options: {
 *     variant: 'underlined',
 *     items: [
 *       {
 *         key: 'general',
 *         title: '通用',
 *         icon: 'settings',
 *         fields: [...]
 *       },
 *       {
 *         key: 'network',
 *         title: '网络',
 *         icon: 'wifi',
 *         fields: [...]
 *       }
 *     ]
 *   }
 * }
 * ```
 */
export interface TabsFieldSchema extends FieldSchemaBase {
  type: 'tabs'
  options: TabsFieldOptions
}

// ============================================
// 分隔线
// ============================================

/**
 * 分隔线字段选项
 */
export interface DividerFieldOptions {
  /**
   * 分隔线方向
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * 分隔线字段 Schema
 * @description 视觉分隔线，用于分隔不同区域
 * @example
 * ```ts
 * const field: DividerFieldSchema = {
 *   key: 'divider1',
 *   type: 'divider',
 *   label: '更多选项',
 *   options: {
 *     orientation: 'horizontal'
 *   }
 * }
 * ```
 */
export interface DividerFieldSchema extends FieldSchemaBase {
  type: 'divider'
  options?: DividerFieldOptions
}

// ============================================
// 提示框
// ============================================

/**
 * 提示框变体类型
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

/**
 * 提示框字段选项
 */
export interface AlertFieldOptions {
  /**
   * 提示框标题
   */
  title?: I18nString

  /**
   * 提示框内容
   */
  content: I18nString

  /**
   * 提示框类型
   * @default 'info'
   */
  variant?: AlertVariant
}

/**
 * 提示框字段 Schema
 * @description 提示信息框，用于显示重要提示或警告
 * @example
 * ```ts
 * const field: AlertFieldSchema = {
 *   key: 'warning',
 *   type: 'alert',
 *   options: {
 *     title: '注意',
 *     content: '修改此配置需要重启服务才能生效',
 *     variant: 'warning'
 *   }
 * }
 * ```
 */
export interface AlertFieldSchema extends FieldSchemaBase {
  type: 'alert'
  options: AlertFieldOptions
}

// ============================================
// 间距
// ============================================

/**
 * 间距字段选项
 */
export interface SpacerFieldOptions {
  /**
   * 水平间距 (像素)
   */
  x?: number

  /**
   * 垂直间距 (像素)
   */
  y?: number
}

/**
 * 间距字段 Schema
 * @description 空白间距组件，用于调整布局间隔
 * @example
 * ```ts
 * const field: SpacerFieldSchema = {
 *   key: 'spacer1',
 *   type: 'spacer',
 *   options: {
 *     y: 24
 *   }
 * }
 * ```
 */
export interface SpacerFieldSchema extends FieldSchemaBase {
  type: 'spacer'
  options?: SpacerFieldOptions
}

// ============================================
// 滚动区域
// ============================================

/**
 * 滚动区域字段选项
 */
export interface ScrollAreaFieldOptions {
  /**
   * 最大高度
   * @description 超过此高度时显示滚动条
   */
  maxHeight?: number | string

  /**
   * 是否隐藏滚动条
   * @default false
   */
  hideScrollBar?: boolean

  /**
   * 滚动方向
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * 滚动条偏移量
   */
  offset?: number

  /**
   * 滚动条尺寸
   * @default 'sm'
   */
  size?: 'sm' | 'md'

  /**
   * 滚动条可见性
   * @default 'auto'
   */
  visibility?: 'auto' | 'always' | 'hover'
}

/**
 * 滚动区域字段 Schema
 * @description 可滚动的内容区域
 * @example
 * ```ts
 * const field: ScrollAreaFieldSchema = {
 *   key: 'scrollContent',
 *   type: 'scroll-area',
 *   options: {
 *     maxHeight: 400,
 *     visibility: 'hover'
 *   },
 *   fields: [...]
 * }
 * ```
 */
export interface ScrollAreaFieldSchema extends FieldSchemaBase {
  type: 'scroll-area'
  options?: ScrollAreaFieldOptions
  /**
   * 滚动区域内的字段
   */
  fields?: FieldSchema[]
}
