/**
 * 组件类型
 * - input: 输入框
 * - switch: 开关
 * - divider: 分隔线
 * - accordion: 手风琴
 * - accordion-item: 手风琴项
 * - accordion-pro: 手风琴Pro
 * - checkbox: 复选框
 * - checkbox-group: 复选框组
 * - radio: 单选框
 * - radio-group: 单选框组
 */
export type ComponentType =
  | 'input'
  | 'switch'
  | 'divider'
  | 'accordion'
  | 'accordion-item'
  | 'accordion-pro'
  | 'checkbox'
  | 'checkbox-group'
  | 'radio'
  | 'radio-group'
  | 'input-group'

/** 组件通用属性 */
export interface ComponentProps {
  /** 唯一标识符 */
  key: string
  /** 组件类型 */
  componentType: ComponentType
  /** 描述 */
  description?: string
  /** 每个渲染的组件都包裹了一个div，这里可以自定义这个div的className */
  className?: string
}
