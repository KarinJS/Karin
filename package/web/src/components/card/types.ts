import { ReactNode } from 'react'

/**
 * 基础卡片属性接口
 */
export interface BaseCardProps {
  /** 图标 */
  icon: ReactNode
  /** 图标右上角小点 */
  iconDot?: ReactNode
  /** 卡片描述文本 */
  description: string
  /** 背景渐变样式 */
  gradient: string
  /** 边框样式 */
  border: string
  /** 图标背景样式 */
  iconBg: string
  /** 文字颜色样式 */
  textColor: string
  /** 选中时的环形颜色 */
  ringColor: string
  /** 是否处于激活状态 */
  isActive: boolean
  /** 点击事件处理函数 */
  onClick: () => void
  /** 悬浮提示内容，如果提供则显示tooltip */
  tooltip?: string
}
