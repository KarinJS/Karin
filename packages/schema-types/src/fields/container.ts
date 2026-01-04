/**
 * @fileoverview 容器类字段类型定义
 * @description 包含卡片、弹出框、模态框、抽屉、表格、下拉菜单、面包屑等容器/交互组件
 * @module @karinjs/schema-types/fields/container
 */

import type {
  I18nString,
  IconName,
  ComponentColor,
  ComponentSize,
  RadiusType,
  ModalSize,
  ExtendedSize,
  SelectItem,
  TableColumn,
  UnderlineType,
  ForegroundColor,
} from '../base'
import type { FieldSchemaBase } from './common'

// 前向声明，避免循环依赖

type FieldSchema = any

// ============================================
// 卡片
// ============================================

/**
 * 卡片阴影类型
 */
export type CardShadow = 'none' | 'sm' | 'md' | 'lg'

/**
 * 卡片字段选项
 */
export interface CardFieldOptions {
  /**
   * 卡片标题
   */
  title?: I18nString

  /**
   * 卡片副标题
   */
  subtitle?: I18nString

  /**
   * 头部图标
   */
  headerIcon?: IconName

  /**
   * 卡片阴影
   * @default 'sm'
   */
  shadow?: CardShadow

  /**
   * 卡片圆角
   * @default 'lg'
   */
  radius?: RadiusType

  /**
   * 是否启用背景模糊
   * @default false
   */
  isBlurred?: boolean

  /**
   * 是否启用底部模糊
   * @default false
   */
  isFooterBlurred?: boolean

  /**
   * 是否可点击
   * @default false
   */
  isPressable?: boolean
}

/**
 * 卡片字段 Schema
 * @description 卡片容器组件，用于包装相关内容
 * @example
 * ```ts
 * const field: CardFieldSchema = {
 *   key: 'infoCard',
 *   type: 'card',
 *   options: {
 *     title: '基本信息',
 *     subtitle: '用户基本资料',
 *     headerIcon: 'user',
 *     shadow: 'md'
 *   },
 *   fields: [
 *     { key: 'name', type: 'text', label: '姓名' },
 *     { key: 'email', type: 'text', label: '邮箱' }
 *   ]
 * }
 * ```
 */
export interface CardFieldSchema extends FieldSchemaBase {
  type: 'card'
  options?: CardFieldOptions
  /**
   * 卡片内的字段
   */
  fields?: FieldSchema[]
}

// ============================================
// 弹出框触发器
// ============================================

/**
 * 弹出框位置
 */
export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

/**
 * 触发器变体类型（简化版）
 */
export type TriggerVariant = 'solid' | 'bordered' | 'light' | 'flat'

/**
 * 弹出框触发器字段选项
 */
export interface PopoverTriggerFieldOptions {
  /**
   * 触发按钮文本
   */
  triggerText: I18nString

  /**
   * 触发按钮变体
   * @default 'solid'
   */
  triggerVariant?: TriggerVariant

  /**
   * 触发按钮颜色
   * @default 'default'
   */
  triggerColor?: ComponentColor

  /**
   * 弹出框位置
   * @default 'bottom'
   */
  placement?: PopoverPlacement

  /**
   * 弹出框标题
   */
  title?: I18nString

  /**
   * 是否显示箭头
   * @default true
   */
  showArrow?: boolean
}

/**
 * 弹出框触发器字段 Schema
 * @description 点击触发弹出框的组件
 * @example
 * ```ts
 * const field: PopoverTriggerFieldSchema = {
 *   key: 'helpPopover',
 *   type: 'popover-trigger',
 *   options: {
 *     triggerText: '查看帮助',
 *     placement: 'top',
 *     title: '帮助信息'
 *   },
 *   fields: [
 *     { key: 'help', type: 'alert', options: { content: '这是帮助内容...' } }
 *   ]
 * }
 * ```
 */
export interface PopoverTriggerFieldSchema extends FieldSchemaBase {
  type: 'popover-trigger'
  options: PopoverTriggerFieldOptions
  /**
   * 弹出框内的字段
   */
  fields?: FieldSchema[]
}

// ============================================
// 工具提示
// ============================================

/**
 * 工具提示颜色
 */
export type TooltipColor = 'default' | 'foreground' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'

/**
 * 工具提示字段选项
 */
export interface TooltipFieldOptions {
  /**
   * 提示内容
   */
  content: I18nString

  /**
   * 提示位置
   * @default 'top'
   */
  placement?: PopoverPlacement

  /**
   * 提示颜色
   * @default 'default'
   */
  color?: TooltipColor

  /**
   * 显示延迟 (毫秒)
   * @default 0
   */
  delay?: number

  /**
   * 关闭延迟 (毫秒)
   * @default 0
   */
  closeDelay?: number
}

/**
 * 工具提示包装字段 Schema
 * @description 为内部字段添加悬浮提示
 * @example
 * ```ts
 * const field: TooltipFieldSchema = {
 *   key: 'tooltipWrapper',
 *   type: 'tooltip-wrapper',
 *   options: {
 *     content: '这是一个提示信息',
 *     placement: 'top'
 *   },
 *   fields: [
 *     { key: 'info', type: 'button', options: { text: '悬浮查看提示' } }
 *   ]
 * }
 * ```
 */
export interface TooltipFieldSchema extends FieldSchemaBase {
  type: 'tooltip-wrapper'
  options: TooltipFieldOptions
  /**
   * 被包装的字段
   */
  fields?: FieldSchema[]
}

// ============================================
// 抽屉触发器
// ============================================

/**
 * 抽屉位置
 */
export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

/**
 * 抽屉触发器字段选项
 */
export interface DrawerTriggerFieldOptions {
  /**
   * 触发按钮文本
   */
  triggerText: I18nString

  /**
   * 触发按钮变体
   * @default 'solid'
   */
  triggerVariant?: TriggerVariant

  /**
   * 触发按钮颜色
   * @default 'default'
   */
  triggerColor?: ComponentColor

  /**
   * 抽屉标题
   */
  title?: I18nString

  /**
   * 抽屉位置
   * @default 'right'
   */
  placement?: DrawerPlacement

  /**
   * 抽屉尺寸
   * @default 'md'
   */
  size?: ExtendedSize
}

/**
 * 抽屉触发器字段 Schema
 * @description 点击触发侧边抽屉的组件
 * @example
 * ```ts
 * const field: DrawerTriggerFieldSchema = {
 *   key: 'settingsDrawer',
 *   type: 'drawer-trigger',
 *   options: {
 *     triggerText: '打开设置',
 *     title: '高级设置',
 *     placement: 'right',
 *     size: 'md'
 *   },
 *   fields: [...]
 * }
 * ```
 */
export interface DrawerTriggerFieldSchema extends FieldSchemaBase {
  type: 'drawer-trigger'
  options: DrawerTriggerFieldOptions
  /**
   * 抽屉内的字段
   */
  fields?: FieldSchema[]
}

// ============================================
// 模态框触发器
// ============================================

/**
 * 模态框滚动行为
 */
export type ModalScrollBehavior = 'inside' | 'outside'

/**
 * 模态框触发器字段选项
 */
export interface ModalTriggerFieldOptions {
  /**
   * 触发按钮文本
   */
  triggerText: I18nString

  /**
   * 触发按钮变体
   * @default 'solid'
   */
  triggerVariant?: TriggerVariant

  /**
   * 触发按钮颜色
   * @default 'default'
   */
  triggerColor?: ComponentColor

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
   * 滚动行为
   * - inside: 内容区域滚动
   * - outside: 整个模态框滚动
   * @default 'inside'
   */
  scrollBehavior?: ModalScrollBehavior

  /**
   * 是否隐藏关闭按钮
   * @default false
   */
  hideCloseButton?: boolean

  /**
   * 是否可以点击遮罩关闭
   * @default true
   */
  isDismissable?: boolean
}

/**
 * 模态框触发器字段 Schema
 * @description 点击触发模态框的组件
 * @example
 * ```ts
 * const field: ModalTriggerFieldSchema = {
 *   key: 'editModal',
 *   type: 'modal-trigger',
 *   options: {
 *     triggerText: '编辑',
 *     title: '编辑信息',
 *     size: 'lg',
 *     isDismissable: true
 *   },
 *   fields: [...]
 * }
 * ```
 */
export interface ModalTriggerFieldSchema extends FieldSchemaBase {
  type: 'modal-trigger'
  options: ModalTriggerFieldOptions
  /**
   * 模态框内的字段
   */
  fields?: FieldSchema[]
}

// ============================================
// 表格
// ============================================

/**
 * 表格选择模式
 */
export type TableSelectionMode = 'none' | 'single' | 'multiple'

/**
 * 表格字段选项
 */
export interface TableFieldOptions {
  /**
   * 表格列定义
   */
  columns: TableColumn[]

  /**
   * 数据源字段名
   * @description 指向包含表格数据的字段路径
   */
  dataKey: string

  /**
   * 行选择模式
   * @default 'none'
   */
  selectionMode?: TableSelectionMode

  /**
   * 是否显示斑马纹
   * @default false
   */
  isStriped?: boolean

  /**
   * 是否紧凑模式
   * @default false
   */
  isCompact?: boolean

  /**
   * 是否显示分页
   * @default true
   */
  showPagination?: boolean

  /**
   * 每页条目数
   * @default 10
   */
  pageSize?: number

  /**
   * 空数据提示
   */
  emptyContent?: I18nString
}

/**
 * 表格字段 Schema
 * @description 数据表格展示组件
 * @example
 * ```ts
 * const field: TableFieldSchema = {
 *   key: 'userTable',
 *   type: 'table',
 *   options: {
 *     columns: [
 *       { field: 'name', title: '姓名', width: 150 },
 *       { field: 'email', title: '邮箱' },
 *       { field: 'status', title: '状态', format: 'badge' }
 *     ],
 *     dataKey: 'users',
 *     isStriped: true,
 *     showPagination: true,
 *     pageSize: 20
 *   }
 * }
 * ```
 */
export interface TableFieldSchema extends FieldSchemaBase {
  type: 'table'
  options: TableFieldOptions
}

// ============================================
// 列表框
// ============================================

/**
 * 列表框选择模式
 */
export type ListboxSelectionMode = 'none' | 'single' | 'multiple'

/**
 * 列表框变体
 */
export type ListboxVariant = 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow'

/**
 * 列表框字段选项
 */
export interface ListboxFieldOptions {
  /**
   * 列表项
   */
  items: SelectItem[]

  /**
   * 选择模式
   * @default 'single'
   */
  selectionMode?: ListboxSelectionMode

  /**
   * 列表框变体
   * @default 'flat'
   */
  variant?: ListboxVariant

  /**
   * 列表框颜色
   * @default 'default'
   */
  color?: ComponentColor

  /**
   * 是否显示分隔线
   * @default false
   */
  showDivider?: boolean

  /**
   * 空列表提示
   */
  emptyContent?: I18nString
}

/**
 * 列表框字段 Schema
 * @description 列表选择组件
 * @example
 * ```ts
 * const field: ListboxFieldSchema = {
 *   key: 'countries',
 *   type: 'listbox',
 *   label: '选择国家',
 *   options: {
 *     items: [
 *       { label: '中国', value: 'cn', icon: 'globe' },
 *       { label: '美国', value: 'us', icon: 'globe' }
 *     ],
 *     selectionMode: 'single',
 *     variant: 'bordered'
 *   }
 * }
 * ```
 */
export interface ListboxFieldSchema extends FieldSchemaBase {
  type: 'listbox'
  options: ListboxFieldOptions
}

// ============================================
// 下拉菜单
// ============================================

/**
 * 下拉菜单项
 */
export interface DropdownItem {
  /**
   * 菜单项唯一标识
   */
  key: string

  /**
   * 菜单项标签
   */
  label: I18nString

  /**
   * 菜单项描述
   */
  description?: I18nString

  /**
   * 菜单项图标
   */
  icon?: IconName

  /**
   * 菜单项颜色
   */
  color?: ComponentColor

  /**
   * 是否为分隔线
   * @default false
   */
  isDivider?: boolean

  /**
   * 是否禁用
   * @default false
   */
  isDisabled?: boolean
}

/**
 * 下拉菜单选择模式
 */
export type DropdownSelectionMode = 'none' | 'single' | 'multiple'

/**
 * 下拉菜单字段选项
 */
export interface DropdownFieldOptions {
  /**
   * 触发按钮文本
   */
  triggerText: I18nString

  /**
   * 触发按钮变体
   * @default 'solid'
   */
  triggerVariant?: TriggerVariant

  /**
   * 触发按钮颜色
   * @default 'default'
   */
  triggerColor?: ComponentColor

  /**
   * 菜单项列表
   */
  items: DropdownItem[]

  /**
   * 选择模式
   * @default 'none'
   */
  selectionMode?: DropdownSelectionMode
}

/**
 * 下拉菜单字段 Schema
 * @description 下拉菜单组件
 * @example
 * ```ts
 * const field: DropdownFieldSchema = {
 *   key: 'actions',
 *   type: 'dropdown',
 *   options: {
 *     triggerText: '操作',
 *     triggerColor: 'primary',
 *     items: [
 *       { key: 'edit', label: '编辑', icon: 'edit' },
 *       { key: 'divider1', label: '', isDivider: true },
 *       { key: 'delete', label: '删除', icon: 'trash', color: 'danger' }
 *     ]
 *   }
 * }
 * ```
 */
export interface DropdownFieldSchema extends FieldSchemaBase {
  type: 'dropdown'
  options: DropdownFieldOptions
}

// ============================================
// 面包屑
// ============================================

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  /**
   * 面包屑标签
   */
  label: I18nString

  /**
   * 链接地址
   */
  href?: string

  /**
   * 面包屑图标
   */
  icon?: IconName

  /**
   * 是否为当前页
   * @default false
   */
  isCurrent?: boolean
}

/**
 * 面包屑字段选项
 */
export interface BreadcrumbsFieldOptions {
  /**
   * 面包屑项列表
   */
  items: BreadcrumbItem[]

  /**
   * 分隔符
   * @default '/'
   */
  separator?: string

  /**
   * 面包屑尺寸
   * @default 'md'
   */
  size?: ComponentSize

  /**
   * 下划线类型
   * @default 'hover'
   */
  underline?: UnderlineType

  /**
   * 面包屑颜色
   * @default 'foreground'
   */
  color?: ForegroundColor
}

/**
 * 面包屑字段 Schema
 * @description 面包屑导航组件
 * @example
 * ```ts
 * const field: BreadcrumbsFieldSchema = {
 *   key: 'nav',
 *   type: 'breadcrumbs',
 *   options: {
 *     items: [
 *       { label: '首页', href: '/', icon: 'home' },
 *       { label: '设置', href: '/settings' },
 *       { label: '用户', isCurrent: true }
 *     ],
 *     separator: '>'
 *   }
 * }
 * ```
 */
export interface BreadcrumbsFieldSchema extends FieldSchemaBase {
  type: 'breadcrumbs'
  options: BreadcrumbsFieldOptions
}
