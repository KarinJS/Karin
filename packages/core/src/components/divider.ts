import { Component } from './base'
import { ComponentType } from '@/types/Components'
import type { DividerProps } from '@/types/Components'

class Divider extends Component {
  config: DividerProps

  constructor () {
    super(ComponentType.DIVIDER)
    this.config = {
      transparent: false,
      orientation: 'horizontal'
    }
  }

  /**
   * 设置透明
   * @param transparent 是否透明 默认不透明
   */
  transparent (transparent: boolean) {
    this.config.transparent = transparent
    return this
  }

  /**
   * 设置竖向分隔线
   * @param orientation 是否使用竖向分隔线 默认使用横向
   */
  vertical (orientation: boolean) {
    this.config.orientation = orientation ? 'vertical' : 'horizontal'
    return this
  }
}

export const divider = new Divider()
