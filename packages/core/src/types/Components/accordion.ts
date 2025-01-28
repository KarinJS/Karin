import { ComponentProps } from './base'
import type { Component } from '@/components/base'
import type { AccordionItem } from '@/components/accordion'

/**
 * 手风琴(折叠面板) 类型
 */
export interface AccordionProps extends ComponentProps {
  /** 子组件 */
  children?: AccordionItem[]
  /** 标题 */
  title?: string
  /**
   * 样式
   * - light: 浅色
   * - shadow: 阴影
   * - bordered: 边框
   * - splitted: 分割
   */
  variant?: 'light' | 'shadow' | 'bordered' | 'splitted'
  /**
   * 选择模式
   * - none: 无
   * - single: 单选
   * - multiple: 多选
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /**
   * 选择行为
   * - toggle: 切换
   * - replace: 替换
   */
  selectionBehavior?: 'toggle' | 'replace'
  /** 是否所有 Accordion 项目都应缩小 */
  isCompact?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否在每个手风琴项目的底部显示分隔线 */
  showDivider?: boolean
  // /** 分隔线属性 */
  // dividerProps?: DividerProps
  /** 是否隐藏指示器 */
  hideIndicator?: boolean
  /** 是否禁用动画 */
  disableAnimation?: boolean
  /** 是否禁用指示器动画 */
  disableIndicatorAnimation?: boolean
  /** 是否不允许空选择 */
  disallowEmptySelection?: boolean
  /** 是否保持内容挂载 */
  keepContentMounted?: boolean
  /** 是否全宽 */
  fullWidth?: boolean
  // /** 动画属性 */
  // motionProps?: MotionProps
  /** 禁用的键 */
  disabledKeys?: string[]
  // /** 手风琴项类名 */
  // itemClasses?: AccordionItemClassnames
  /** 选中项 */
  selectedKeys?: string[]
  /** 默认选中项 */
  defaultSelectedKeys?: string[]
}

/**
 * 手风琴子组件类型 `也就是每一项手风琴`
 */
export interface AccordionItemProps extends ComponentProps {
  /** 子组件 */
  children?: Component[]
  /** 标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 折叠项展开指示器，通常为箭头图标 */
  indicator?: boolean
  /** 折叠项开始内容，通常是图标或头像 */
  startContent?: Component
  /** 折叠项结束内容，通常是图标或头像 */
  endContent?: Component
  /** 用于修改 framer 运动动画的 props。使用 variants API 创建您自己的动画 */
  // motionProps?:
  /** 是否紧凑模式 */
  isCompact?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 关闭时是否保持挂载 AccordionItem 内容 */
  keepContentMounted?: boolean
  /** 是否隐藏 AccordionItem 指示器 */
  hideIndicator?: boolean
  /** 是否禁用 AccordionItem 动画 */
  disableAnimation?: boolean
  /** 是否禁用 AccordionItem 指示器动画 */
  disableIndicatorAnimation?: boolean
  /** 于 Web 辅助功能的可自定义标题标签。使用标题来描述内容，并在语义上一致地使用它们 */
  HeadingComponent?: Component
}
