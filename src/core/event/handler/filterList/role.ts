import { config as cfg } from '@/utils/config'
import type {
  GroupEvent,
  FriendEvent,
  GuildEvent,
  DirectEvent,
} from '@/event/handler/filterList/types'

/**
 * 初始化事件的角色身份
 * @param event 事件对象
 */
export const setEventRole = (event: GroupEvent | FriendEvent | GuildEvent | DirectEvent) => {
  const config = cfg()
  /** 主人 */
  if (config.master.includes(`${event.selfId}@${event.userId}`) || config.master.includes(event.userId)) {
    event.isMaster = true
    event.isAdmin = true
  } else if (config.admin.includes(`${event.selfId}@${event.userId}`) || config.admin.includes(event.userId)) {
    /** 管理员 */
    event.isAdmin = true
  }
}
