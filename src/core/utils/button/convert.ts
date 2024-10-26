import type { QQButtonType } from './types'
import type { ButtonElementType, KeyboardElementType } from '@/adapter/segment'

/**
 * 将karin标准格式的按钮转换为QQ官方按钮
 * @param button karin按钮
 */
export const buttonToQQBot = (button: ButtonElementType | KeyboardElementType): Array<{ buttons: Array<QQButtonType> }> => {
  let id = 0
  const rows: Array<{ buttons: Array<QQButtonType> }> = []
  /** 格式化为多行 */
  const list: KeyboardElementType['rows'] = []

  button.type === 'button' ? list.push(button.data) : list.push(...button.rows)
  for (const row of list) {
    const buttons: Array<QQButtonType> = []
    for (const i of row) {
      const type = i.link ? 0 : (i.callback ? 1 : i.type ?? 2)

      const data: QQButtonType = {
        id: String(id),
        render_data: {
          label: i.text || i.link || '',
          style: i.style ?? 0,
          visited_label: i.show || i.text || i.link || '',
        },
        action: {
          type,
          data: i.data || i.link || i.text,
          unsupport_tips: i.tips || '.',
          permission: { type: 2 },
        },
      }

      if (i.enter) data.action.enter = true
      if (i.reply) data.action.reply = true
      if (i.admin) data.action.permission.type = 1
      if (i.list) {
        data.action.permission.type = 0
        data.action.permission.specify_user_ids = i.list
      } else if (i.role) {
        data.action.permission.type = 3
        data.action.permission.specify_role_ids = i.role
      }
      buttons.push(data)
      id++
    }
    rows.push({ buttons })
  }
  return rows
}
