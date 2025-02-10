import { input } from './input'
import { divider } from './divider'
import { switchComponent } from './switch'
import { accordion, accordionPro, accordionItem } from './accordion'

export const components = {
  /** 分隔线 */
  divider,
  /** 输入框 */
  input,
  /** 开关 */
  switch: switchComponent,
  /** 手风琴 */
  accordion,
  /** 手风琴Pro */
  accordionPro,
  /** 手风琴项 */
  accordionItem
}

export type ComponentsClass = typeof divider
  | ReturnType<typeof input.create>
  | ReturnType<typeof switchComponent.create>
