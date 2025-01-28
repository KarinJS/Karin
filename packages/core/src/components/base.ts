import { ComponentType } from '@/types/Components'

export class Component {
  config: unknown
  componentType: ComponentType

  constructor (componentType: ComponentType) {
    this.componentType = componentType
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
  toJSON (): Record<string, any> {
    return { componentType: this.componentType, ...(this.config as Record<string, any>) }
  }
}
