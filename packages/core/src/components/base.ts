import { ComponentType } from '@/types/components'

export class Component<T extends Record<string, any>> {
  _config: unknown
  _componentType: ComponentType

  constructor (componentType: ComponentType) {
    this._componentType = componentType
  }

  /**
   * 转换为JSON字符串
   */
  toString (): string {
    return JSON.stringify(this.toJSON())
  }

  /**
   * 转换为JSON对象
   */
  toJSON (): T {
    return { componentType: this._componentType, ...(this._config as T) }
  }
}
