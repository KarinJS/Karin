import { Component } from './base'
import { ComponentType } from '@/types/components'
import type { DividerProps } from '@/types/components'

class Divider extends Component<DividerProps> {
  _config: DividerProps

  constructor () {
    super(ComponentType.DIVIDER)
    this._config = {
      key: Math.random().toString(36).substring(2, 15),
      componentType: ComponentType.DIVIDER,
      transparent: false,
      orientation: 'horizontal'
    }
  }

  /**
   * 设置透明
   * @param transparent 是否透明 默认不透明
   */
  transparent (transparent: boolean) {
    this._config.transparent = transparent
    return this
  }

  /**
   * 设置竖向分隔线
   * @param orientation 是否使用竖向分隔线 默认使用横向
   */
  vertical (orientation: boolean) {
    this._config.orientation = orientation ? 'vertical' : 'horizontal'
    return this
  }
}

export const divider = new Divider()
