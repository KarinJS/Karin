import { ComponentProps } from './base'

/**
 * 分隔线
 */
export interface DividerProps extends ComponentProps {
  componentType: 'divider'
  /** 是否透明 */
  transparent?: boolean
  /** 方向 */
  orientation?: 'horizontal' | 'vertical'
  /** 描述文本位置 0-100的数字 */
  descPosition?: number
}
