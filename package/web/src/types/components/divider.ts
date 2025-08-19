import { ComponentProps, ComponentType } from './base'

/**
 * 分隔线
 */
export interface DividerProps extends ComponentProps {
  componentType: ComponentType.DIVIDER
  /** 是否透明 */
  transparent?: boolean
  /** 方向 */
  orientation?: 'horizontal' | 'vertical'
}
