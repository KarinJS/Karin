/**
 * 组件类型
 * - input: 输入框
 * - switch: 开关
 * - divider: 分隔线
 * - accordion: 手风琴
 * - accordion-item: 手风琴项
 * - accordion-pro: 手风琴Pro
 */
export type ComponentType =
  | 'input'
  | 'switch'
  | 'divider'
  | 'accordion'
  | 'accordion-item'
  | 'accordion-pro'

/** 组件通用属性 */
export interface ComponentProps {
  /** 唯一标识符 */
  key: string
  /** 组件类型 */
  componentType: ComponentType
  /** 描述 */
  description?: string
}
