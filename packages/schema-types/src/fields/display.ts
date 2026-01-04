/**
 * @fileoverview 展示类字段类型定义
 * @description 包含进度条、头像、徽章、标签、链接、图片、按钮、骨架屏等展示组件
 * @module @karinjs/schema-types/fields/display
 */

import type {
  I18nString,
  IconName,
  ComponentColor,
  ComponentSize,
  ForegroundColor,
  RadiusType,
  ChipVariant,
  ComponentVariant,
  UnderlineType,
} from '../base'
import type { FieldSchemaBase } from './common'

// ============================================
// 进度条
// ============================================

/**
 * 进度条格式化选项
 */
export interface ProgressFormatOptions {
  /**
   * 格式化样式
   * @default 'percent'
   */
  style?: 'percent' | 'decimal'
}

/**
 * 进度条字段选项
 */
export interface ProgressFieldOptions {
  /**
   * 进度条颜色
   * @default 'primary'
   */
  color?: ComponentColor

  /**
   * 进度条尺寸
   * @default 'md'
   */
  size?: ComponentSize

  /**
   * 是否显示数值标签
   * @default true
   */
  showValueLabel?: boolean

  /**
   * 数值格式化选项
   */
  formatOptions?: ProgressFormatOptions
}

/**
 * 进度条字段 Schema
 * @description 进度条展示组件，用于显示进度或百分比
 * @example
 * ```ts
 * const field: ProgressFieldSchema = {
 *   key: 'uploadProgress',
 *   type: 'progress',
 *   label: '上传进度',
 *   defaultValue: 75,
 *   options: {
 *     color: 'success',
 *     showValueLabel: true
 *   }
 * }
 * ```
 */
export interface ProgressFieldSchema extends FieldSchemaBase {
  type: 'progress'
  options?: ProgressFieldOptions
}

// ============================================
// 头像
// ============================================

/**
 * 头像字段选项
 */
export interface AvatarFieldOptions {
  /**
   * 头像尺寸
   * @default 'md'
   */
  size?: ComponentSize

  /**
   * 头像圆角
   * @default 'full'
   */
  radius?: RadiusType

  /**
   * 是否显示默认头像
   * @default true
   */
  showFallback?: boolean

  /**
   * 是否显示边框
   * @default false
   */
  isBordered?: boolean

  /**
   * 边框颜色
   * @default 'default'
   */
  color?: ComponentColor
}

/**
 * 头像字段 Schema
 * @description 头像展示组件
 * @example
 * ```ts
 * const field: AvatarFieldSchema = {
 *   key: 'userAvatar',
 *   type: 'avatar',
 *   defaultValue: 'https://example.com/avatar.jpg',
 *   options: {
 *     size: 'lg',
 *     isBordered: true,
 *     color: 'primary'
 *   }
 * }
 * ```
 */
export interface AvatarFieldSchema extends FieldSchemaBase {
  type: 'avatar'
  options?: AvatarFieldOptions
}

// ============================================
// 徽章
// ============================================

/**
 * 徽章位置类型
 */
export type BadgePlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

/**
 * 徽章变体类型
 */
export type BadgeVariant = 'solid' | 'flat' | 'faded' | 'shadow'

/**
 * 徽章字段选项
 */
export interface BadgeFieldOptions {
  /**
   * 徽章内容
   */
  content: I18nString

  /**
   * 徽章颜色
   * @default 'primary'
   */
  color?: ComponentColor

  /**
   * 徽章尺寸
   * @default 'md'
   */
  size?: ComponentSize

  /**
   * 徽章变体
   * @default 'solid'
   */
  variant?: BadgeVariant

  /**
   * 徽章位置
   * @default 'top-right'
   */
  placement?: BadgePlacement
}

/**
 * 徽章字段 Schema
 * @description 徽章展示组件，常用于显示数量或状态
 * @example
 * ```ts
 * const field: BadgeFieldSchema = {
 *   key: 'notification',
 *   type: 'badge',
 *   options: {
 *     content: '99+',
 *     color: 'danger',
 *     placement: 'top-right'
 *   }
 * }
 * ```
 */
export interface BadgeFieldSchema extends FieldSchemaBase {
  type: 'badge'
  options?: BadgeFieldOptions
}

// ============================================
// 标签/Chip
// ============================================

/**
 * 标签字段选项
 */
export interface ChipFieldOptions {
  /**
   * 标签颜色
   * @default 'default'
   */
  color?: ComponentColor

  /**
   * 标签尺寸
   * @default 'md'
   */
  size?: ComponentSize

  /**
   * 标签变体
   * @default 'solid'
   */
  variant?: ChipVariant

  /**
   * 标签圆角
   * @default 'full'
   */
  radius?: RadiusType
}

/**
 * 标签字段 Schema
 * @description 标签/Chip 展示组件
 * @example
 * ```ts
 * const field: ChipFieldSchema = {
 *   key: 'status',
 *   type: 'chip',
 *   defaultValue: '已完成',
 *   options: {
 *     color: 'success',
 *     variant: 'flat'
 *   }
 * }
 * ```
 */
export interface ChipFieldSchema extends FieldSchemaBase {
  type: 'chip'
  options?: ChipFieldOptions
}

// ============================================
// 代码片段
// ============================================

/**
 * 代码片段字段选项
 */
export interface SnippetFieldOptions {
  /**
   * 前缀符号
   * @default '$'
   */
  symbol?: string

  /**
   * 代码片段颜色
   * @default 'default'
   */
  color?: ComponentColor

  /**
   * 代码片段尺寸
   * @default 'md'
   */
  size?: ComponentSize

  /**
   * 是否隐藏复制按钮
   * @default false
   */
  hideCopyButton?: boolean

  /**
   * 是否隐藏前缀符号
   * @default false
   */
  hideSymbol?: boolean
}

/**
 * 代码片段字段 Schema
 * @description 代码片段展示组件，带复制功能
 * @example
 * ```ts
 * const field: SnippetFieldSchema = {
 *   key: 'command',
 *   type: 'snippet',
 *   defaultValue: 'npm install @karinjs/core',
 *   options: {
 *     symbol: '$',
 *     color: 'secondary'
 *   }
 * }
 * ```
 */
export interface SnippetFieldSchema extends FieldSchemaBase {
  type: 'snippet'
  options?: SnippetFieldOptions
}

// ============================================
// 链接
// ============================================

/**
 * 链接字段选项
 */
export interface LinkFieldOptions {
  /**
   * 链接地址
   */
  href: string

  /**
   * 链接文本
   */
  text: I18nString

  /**
   * 是否为外部链接
   * @description 为 true 时在新标签页打开
   * @default false
   */
  isExternal?: boolean

  /**
   * 是否显示外链图标
   * @default true (当 isExternal 为 true 时)
   */
  showAnchorIcon?: boolean

  /**
   * 链接颜色
   * @default 'primary'
   */
  color?: ForegroundColor

  /**
   * 下划线类型
   * @default 'none'
   */
  underline?: UnderlineType
}

/**
 * 链接字段 Schema
 * @description 链接展示组件
 * @example
 * ```ts
 * const field: LinkFieldSchema = {
 *   key: 'docs',
 *   type: 'link',
 *   options: {
 *     href: 'https://karinjs.dev',
 *     text: '查看文档',
 *     isExternal: true,
 *     color: 'primary',
 *     underline: 'hover'
 *   }
 * }
 * ```
 */
export interface LinkFieldSchema extends FieldSchemaBase {
  type: 'link'
  options: LinkFieldOptions
}

// ============================================
// 用户卡片
// ============================================

/**
 * 用户卡片字段选项
 */
export interface UserCardFieldOptions {
  /**
   * 用户名字段名
   * @description 对应数据中的字段名
   */
  nameField: string

  /**
   * 描述字段名
   * @description 对应数据中的字段名
   */
  descriptionField?: string

  /**
   * 头像字段名
   * @description 对应数据中的字段名
   */
  avatarField?: string
}

/**
 * 用户卡片字段 Schema
 * @description 用户信息卡片展示组件
 * @example
 * ```ts
 * const field: UserCardFieldSchema = {
 *   key: 'author',
 *   type: 'user-card',
 *   defaultValue: {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     avatar: 'https://example.com/avatar.jpg'
 *   },
 *   options: {
 *     nameField: 'name',
 *     descriptionField: 'email',
 *     avatarField: 'avatar'
 *   }
 * }
 * ```
 */
export interface UserCardFieldSchema extends FieldSchemaBase {
  type: 'user-card'
  options?: UserCardFieldOptions
}

// ============================================
// 图片展示
// ============================================

/**
 * 图片字段选项
 */
export interface ImageFieldOptions {
  /**
   * 图片地址
   */
  src: string

  /**
   * 替代文本
   */
  alt?: I18nString

  /**
   * 图片宽度
   */
  width?: number | string

  /**
   * 图片高度
   */
  height?: number | string

  /**
   * 图片圆角
   * @default 'md'
   */
  radius?: RadiusType

  /**
   * 是否显示模糊背景
   * @default false
   */
  isBlurred?: boolean

  /**
   * 是否启用悬停放大效果
   * @default false
   */
  isZoomed?: boolean

  /**
   * 加载失败时的备用图片
   */
  fallbackSrc?: string
}

/**
 * 图片字段 Schema
 * @description 图片展示组件
 * @example
 * ```ts
 * const field: ImageFieldSchema = {
 *   key: 'preview',
 *   type: 'image',
 *   options: {
 *     src: 'https://example.com/image.jpg',
 *     alt: '预览图',
 *     width: 300,
 *     radius: 'lg',
 *     isZoomed: true
 *   }
 * }
 * ```
 */
export interface ImageFieldSchema extends FieldSchemaBase {
  type: 'image'
  options?: ImageFieldOptions
}

// ============================================
// 按钮
// ============================================

/**
 * 按钮动作类型
 */
export type ButtonActionType = 'submit' | 'reset' | 'link' | 'custom'

/**
 * 按钮动作配置
 */
export interface ButtonAction {
  /**
   * 动作类型
   * - submit: 提交表单
   * - reset: 重置表单
   * - link: 跳转链接
   * - custom: 自定义动作
   */
  type: ButtonActionType

  /**
   * 链接地址
   * @description 当 type 为 'link' 时有效
   */
  href?: string

  /**
   * 自定义动作标识
   * @description 当 type 为 'custom' 时有效，用于触发自定义事件
   */
  customAction?: string
}

/**
 * 按钮字段选项
 */
export interface ButtonFieldOptions {
  /**
   * 按钮文本
   */
  text: I18nString

  /**
   * 按钮颜色
   * @default 'primary'
   */
  color?: ComponentColor

  /**
   * 按钮变体
   * @default 'solid'
   */
  variant?: ComponentVariant

  /**
   * 按钮尺寸
   * @default 'md'
   */
  size?: ComponentSize

  /**
   * 按钮图标
   */
  icon?: IconName

  /**
   * 图标位置
   * @default 'start'
   */
  iconPosition?: 'start' | 'end'

  /**
   * 按钮动作
   */
  action?: ButtonAction

  /**
   * 是否显示加载状态
   * @default false
   */
  isLoading?: boolean

  /**
   * 是否占满容器宽度
   * @default false
   */
  fullWidth?: boolean
}

/**
 * 按钮字段 Schema
 * @description 按钮组件，可触发各种动作
 * @example
 * ```ts
 * const field: ButtonFieldSchema = {
 *   key: 'submit',
 *   type: 'button',
 *   options: {
 *     text: '提交',
 *     color: 'primary',
 *     icon: 'check',
 *     action: { type: 'submit' }
 *   }
 * }
 * ```
 */
export interface ButtonFieldSchema extends FieldSchemaBase {
  type: 'button'
  options: ButtonFieldOptions
}

// ============================================
// 骨架屏
// ============================================

/**
 * 骨架屏变体类型
 */
export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded'

/**
 * 骨架屏字段选项
 */
export interface SkeletonFieldOptions {
  /**
   * 骨架屏形状变体
   * @default 'rounded'
   */
  variant?: SkeletonVariant

  /**
   * 宽度
   */
  width?: number | string

  /**
   * 高度
   */
  height?: number | string

  /**
   * 文本行数
   * @description 当 variant 为 'text' 时有效
   * @default 1
   */
  lines?: number
}

/**
 * 骨架屏字段 Schema
 * @description 加载占位骨架屏组件
 * @example
 * ```ts
 * const field: SkeletonFieldSchema = {
 *   key: 'loading',
 *   type: 'skeleton',
 *   options: {
 *     variant: 'text',
 *     lines: 3,
 *     width: '100%'
 *   }
 * }
 * ```
 */
export interface SkeletonFieldSchema extends FieldSchemaBase {
  type: 'skeleton'
  options?: SkeletonFieldOptions
}

// ============================================
// 分页
// ============================================

/**
 * 分页变体类型
 */
export type PaginationVariant = 'flat' | 'bordered' | 'light' | 'faded'

/**
 * 分页字段选项
 */
export interface PaginationFieldOptions {
  /**
   * 总条目数
   */
  total: number

  /**
   * 每页条目数
   * @default 10
   */
  pageSize?: number

  /**
   * 是否显示控制按钮（首页/末页）
   * @default false
   */
  showControls?: boolean

  /**
   * 分页颜色
   * @default 'primary'
   */
  color?: ComponentColor

  /**
   * 分页变体
   * @default 'flat'
   */
  variant?: PaginationVariant

  /**
   * 分页尺寸
   * @default 'md'
   */
  size?: ComponentSize
}

/**
 * 分页字段 Schema
 * @description 分页控件组件
 * @example
 * ```ts
 * const field: PaginationFieldSchema = {
 *   key: 'pagination',
 *   type: 'pagination',
 *   defaultValue: 1,
 *   options: {
 *     total: 100,
 *     pageSize: 10,
 *     showControls: true,
 *     color: 'primary'
 *   }
 * }
 * ```
 */
export interface PaginationFieldSchema extends FieldSchemaBase {
  type: 'pagination'
  options?: PaginationFieldOptions
}
