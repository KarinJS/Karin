import { input } from './input'
import { divider } from './divider'
import { switchComponent } from './switch'

export const components = {
  /** 分隔线 */
  divider,
  /** 输入框 */
  input,
  /** 开关 */
  switch: switchComponent
}

export type ComponentsClass = typeof divider
  | ReturnType<typeof input.create>
  | ReturnType<typeof switchComponent.create>
