import type {
  FriendMessage,
  GroupMessage,
  GuildMessage,
  DirectMessage,
  GroupTempMessage
} from '@/event'
import type { Message } from '@/types/event/event'

export type UnionMessage = Message | FriendMessage | GroupMessage | GuildMessage | DirectMessage | GroupTempMessage

/** 调用后继续执行下一个钩子 如果没钩子则继续正常流程 */
export type HookNext = () => void

/** 钩子配置项 */
export interface HookOptions {
  /** 优先级，数字越小优先级越高 */
  priority?: number
}

/** 钩子回调函数 */
export type HookCallback<T extends UnionMessage> = (event: T, next: HookNext) => void | Promise<void>

/** 钩子项 */
export interface HookItem<T extends UnionMessage> {
  /** 钩子ID */
  id: number
  /** 钩子优先级 */
  priority: number
  /** 钩子回调函数 */
  callback: HookCallback<T>
}

/** 缓存 */
export type HookCache = {
  message: HookItem<Message>[]
  friend: HookItem<FriendMessage>[]
  group: HookItem<GroupMessage>[]
  guild: HookItem<GuildMessage>[]
  direct: HookItem<DirectMessage>[]
  groupTemp: HookItem<GroupTempMessage>[]
}
