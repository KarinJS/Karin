import { cooldown } from './cd'
import { filter } from './filter'
import { checker } from './checker'
import { eventLogger } from './logger'
import { permission } from './permission'
import { initializer } from './initializer'
import { dispatch } from '@/event/utils/dispatch'

/**
 * 事件工具集合
 */
export const eventUtils = {
  /** 日志工具 */
  logger: eventLogger,
  /** 初始化工具 */
  init: initializer,
  /** 过滤工具 */
  filter,
  /** CD控制工具 */
  cd: cooldown,
  /** 检查工具 */
  checker,
  /** 权限工具 */
  permission,
  /** 事件分发工具 */
  dispatch,
}

export default eventUtils
