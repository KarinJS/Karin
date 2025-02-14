import { input } from './input'
import { radio } from './radioGroup'
import { divider } from './divider'
import { checkbox } from './checkbox'
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
  accordionItem,
  /** 单选框 */
  radio,
  /** 多选框 */
  checkbox,
}

export type ComponentsClass = typeof divider
  | ReturnType<typeof input.create>
  | ReturnType<typeof switchComponent.create>
