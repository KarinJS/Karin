export const enum ComponentType {
  /** 输入框 */
  INPUT = 'input',
  /** 开关 */
  SWITCH = 'switch',
  /** 分隔线 */
  DIVIDER = 'divider',
  /** 手风琴 */
  ACCORDION = 'accordion',
  /** 手风琴项 */
  ACCORDION_ITEM = 'accordion-item'
}

/** 组件通用属性 */
export interface ComponentProps {
  /** 唯一标识符 */
  key: string
  /** 描述 */
  description?: string
}
