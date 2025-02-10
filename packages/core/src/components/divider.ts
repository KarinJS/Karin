import { Component } from './base'
import type { DividerProps } from '@/types/components'

class Divider extends Component<DividerProps> {
  _config: DividerProps

  constructor () {
    super('divider')
    this._config = {
      key: '',
      componentType: 'divider',
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

  /**
   * 转换为 JSON 对象
   * @returns JSON 对象
   */
  toJSON () {
    const data = new Divider()
    const key = Math.random().toString(36).substring(2, 15)
    data._config = { ...this._config, key }
    return data._config
  }
}

/**
 * 获取分隔线组件
 * @returns 分隔线组件
 */
export const divider = new Divider()
