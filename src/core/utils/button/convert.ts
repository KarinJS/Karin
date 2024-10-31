import type { QQBotButton, QQButtonTextType } from './types'
import type { ButtonElementType, KeyboardElementType } from '@/adapter/segment'

/**
 * 将karin标准格式的按钮转换为QQ官方按钮
 * @param button karin按钮
 * @returns QQ按钮数组
 */
export const karinToQQBot = (button: ButtonElementType | KeyboardElementType): Array<{ buttons: Array<QQBotButton> }> => {
  let id = 0
  const rows: Array<{ buttons: Array<QQBotButton> }> = []
  /** 格式化为多行 */
  const list: KeyboardElementType['rows'] = []

  button.type === 'button' ? list.push(button.data) : list.push(...button.rows)
  for (const row of list) {
    const buttons: Array<QQBotButton> = []
    for (const i of row) {
      const type = i.link ? 0 : (i.callback ? 1 : i.type ?? 2) as 0 | 1 | 2

      const data: QQBotButton = {
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

/**
 * 将QQ官方按钮转换为karin标准格式的按钮
 * @param button QQ按钮 传`content.rows`
 * @returns karin按钮
 */
export const qqbotToKarin = (button: Array<{ buttons: Array<QQBotButton> }>): string => {
  const msg: string[] = []

  const setPermission = (data: QQButtonTextType, value: QQBotButton) => {
    if (value.action.permission.type === 1) {
      data.admin = true
    } else if (value.action.permission.type === 0) {
      data.list = value.action.permission.specify_user_ids || []
    } else if (value.action.permission.type === 3) {
      data.role = value.action.permission.specify_role_ids || []
    }

    const text = Object.entries(data).map(([key, value]) => `${key}:${Array.isArray(value) ? value.toString() : value}`).join(',')
    msg.push(`[button:${text}]`)
  }

  for (const row of button) {
    for (const i of row.buttons) {
      /** 链接跳转按钮 */
      if (i.action.type === 0) {
        const obj: QQButtonTextType = {
          link: i.action.data,
          text: i.render_data.label,
          show: i.render_data.visited_label,
          style: i.render_data.style,
          tips: i.action.unsupport_tips,
        }

        setPermission(obj, i)
        continue
      }

      /** 回调按钮 */
      if (i.action.type === 1) {
        const obj: QQButtonTextType = {
          text: i.render_data.label,
          show: i.render_data.visited_label,
          style: i.render_data.style,
          tips: i.action.unsupport_tips,
          callback: true,
        }

        setPermission(obj, i)
        continue
      }

      /** 正常按钮 */
      const obj: QQButtonTextType = {
        text: i.render_data.label,
        show: i.render_data.visited_label,
        style: i.render_data.style,
        tips: i.action.unsupport_tips,
      }

      if (i.action.enter) obj.enter = true
      if (i.action.reply) obj.reply = true
      setPermission(obj, i)
    }
  }

  return msg.join('')
}
