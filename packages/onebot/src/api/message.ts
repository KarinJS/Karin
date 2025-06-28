import type { SenderPrivate, SenderGroup } from '../event/sender'
import type {
  OneBotMessage,
  NodeMessage,
} from '../message'

export enum OneBotMessageApiAction {
  sendMsg = 'send_msg',
  sendPrivateMsg = 'send_private_msg',
  sendGroupMsg = 'send_group_msg',
  deleteMsg = 'delete_msg',
  getMsg = 'get_msg',
  getForwardMsg = 'get_forward_msg',
  setMessageReaction = 'set_message_reaction',
  nc_fetchEmojiLike = 'fetch_emoji_like',
  lgl_joinGroupEmojiChain = '.join_group_emoji_chain',
  lgl_joinFriendEmojiReaction = '.join_friend_emoji_reaction',
  lgl_sendGroupBotCallback = 'send_group_bot_callback',
  nc_markPrivateMsgAsRead = 'mark_private_msg_as_read',
  nc_markGroupMsgAsRead = 'mark_group_msg_as_read',
  nc_markAllAsRead = '_mark_all_as_read',
  nc_forwardFriendSingleMsg = 'forward_friend_single_msg',
  nc_forwardGroupSingleMsg = 'forward_group_single_msg',
  sendForwardMsg = 'send_forward_msg',
  sendGroupForwardMsg = 'send_group_forward_msg',
  sendPrivateForwardMsg = 'send_private_forward_msg',
  getGroupMsgHistory = 'get_group_msg_history',
  nc_getFriendMsgHistory = 'nc_get_friend_msg_history',
  lgl_getFriendMsgHistory = 'lgl_get_friend_msg_history',
  lgl_getGroupMsgHistory = 'lgl_get_group_msg_history',
  nc_getGroupMsgHistory = 'nc_get_group_msg_history',
  getAiCharacters = 'get_ai_characters',
  sendGroupAiRecord = 'send_group_ai_record',
  lgl_markMsgAsRead = 'mark_msg_as_read',
  lgl_setGroupReaction = 'set_group_reaction',
  nc_setMsgEmojiLike = 'set_msg_emoji_like',
}

/**
 * 消息相关 API
 */
export interface OneBotMessageApi {
  /** 发送消息`(综合接口)` */
  [OneBotMessageApiAction.sendMsg]: {
    action: 'send_msg',
    params: {
      message_type: 'private' | 'group',
      user_id: number,
      message: OneBotMessage[],
      auto_escape?: boolean // 无收集，请自行测试此字段是否有效
    },
    response: {
      message_id: number
    }
  }

  /** 发送私聊消息 */
  [OneBotMessageApiAction.sendPrivateMsg]: {
    action: 'send_private_msg',
    params: {
      user_id: number,
      message: OneBotMessage[],
      auto_escape?: boolean
    },
    response: {
      message_id: number
    }
  }

  /** 发送群消息 */
  [OneBotMessageApiAction.sendGroupMsg]: {
    action: 'send_group_msg',
    params: {
      group_id: number,
      message: OneBotMessage[],
      auto_escape?: boolean
    },
    response: {
      message_id: number
    }
  }

  /** 撤回消息 */
  [OneBotMessageApiAction.deleteMsg]: {
    action: 'delete_msg',
    params: {
      message_id: number
    },
    response: null
  }

  /** 获取消息 */
  [OneBotMessageApiAction.getMsg]: {
    action: 'get_msg',
    params: {
      message_id: number
    },
    response: {
      time: number,
      message_type: 'group',
      message_id: number,
      real_id: number,
      sender: SenderGroup,
      message: OneBotMessage[]
      group_id: number
    } | {
      time: number,
      message_type: 'private',
      message_id: number,
      real_id: number,
      sender: SenderPrivate,
      message: OneBotMessage[]
    }
  }

  /** 获取合并转发消息 */
  [OneBotMessageApiAction.getForwardMsg]: {
    action: 'get_forward_msg',
    params: {
      id: string
    },
    response: {
      message: NodeMessage[]
    }
  }

  /** 设置消息表情回应 */
  [OneBotMessageApiAction.setMessageReaction]: {
    action: 'set_message_reaction',
    params: {
      message_id: number,
      emoji_id: string,
      set: boolean
    },
    response: {
      result: number,
      errMsg: string
    }
  }

  /** NapCat扩展: 获取消息的表情已回应列表 */
  [OneBotMessageApiAction.nc_fetchEmojiLike]: {
    action: 'fetch_emoji_like',
    params: {
      message_id: number,
      user_id: number,
      emojiType: number,
      count?: number
    },
    response: {
      result: number,
      errMsg: string,
      emojiLikesList: Array<{
        tinyId: string,
        nickName: string,
        headUrl: string
      }>,
      cookie: string,
      isLastPage: boolean,
      isFirstPage: boolean
    }
  }

  /** Lagrange扩展: 加入群聊表情接龙 */
  [OneBotMessageApiAction.lgl_joinGroupEmojiChain]: {
    action: '.join_group_emoji_chain',
    params: {
      group_id: number,
      message_id: number,
      emoji_id: number
    },
    response: null
  }

  /** Lagrange扩展: 加入好友表情接龙 */
  [OneBotMessageApiAction.lgl_joinFriendEmojiReaction]: {
    action: '.join_friend_emoji_reaction',
    params: {
      user_id: number,
      message_id: number,
      emoji_id: number
    },
    response: null
  }

  /** Lagrange扩展: 调用群机器人回调 */
  [OneBotMessageApiAction.lgl_sendGroupBotCallback]: {
    action: 'send_group_bot_callback',
    params: {
      group_id: number,
      bot_id: number,
      data_1: string,
      data_2: string
    },
    response: number // 返回机器人Uin
  }

  /** NapCat扩展: 标记私聊消息为已读 */
  [OneBotMessageApiAction.nc_markPrivateMsgAsRead]: {
    action: 'mark_private_msg_as_read',
    params: {
      user_id?: number,
      message_id?: number
    },
    response: null
  }

  /** NapCat扩展: 标记群消息为已读 */
  [OneBotMessageApiAction.nc_markGroupMsgAsRead]: {
    action: 'mark_group_msg_as_read',
    params: {
      group_id?: number,
      message_id?: number
    },
    response: null
  }

  /** NapCat扩展: 标记所有消息为已读 */
  [OneBotMessageApiAction.nc_markAllAsRead]: {
    action: '_mark_all_as_read',
    params: Record<string, never>,
    response: null
  }

  /** NapCat扩展: 转发好友单条消息 */
  [OneBotMessageApiAction.nc_forwardFriendSingleMsg]: {
    action: 'forward_friend_single_msg',
    params: {
      user_id: number,
      message_id: number
    },
    response: null
  }

  /** NapCat扩展: 转发群单条消息 */
  [OneBotMessageApiAction.nc_forwardGroupSingleMsg]: {
    action: 'forward_group_single_msg',
    params: {
      group_id: number,
      message_id: number
    },
    response: null
  }

  /** GoCQ扩展: 发送合并转发消息 */
  [OneBotMessageApiAction.sendForwardMsg]: {
    action: 'send_forward_msg',
    params: {
      messages: NodeMessage[]
    },
    response: {
      message_id: string
      forward_id: string
      /** napcat是res_id */
      res_id?: string
    }
  }

  /** GoCQ扩展: 发送合并转发(群聊) */
  [OneBotMessageApiAction.sendGroupForwardMsg]: {
    action: 'send_group_forward_msg',
    params: {
      group_id: number,
      messages: NodeMessage[]
    },
    response: {
      message_id: string
      forward_id: string
      /** napcat是res_id */
      res_id?: string
    }
  }

  /** GoCQ扩展: 发送合并转发(好友) */
  [OneBotMessageApiAction.sendPrivateForwardMsg]: {
    action: 'send_private_forward_msg',
    params: {
      user_id: number,
      messages: NodeMessage[]
    },
    response: {
      message_id: string
      forward_id: string
      /** napcat是res_id */
      res_id?: string
    }
  }

  /** GoCQ扩展: 获取群消息历史记录 */
  [OneBotMessageApiAction.getGroupMsgHistory]: {
    action: 'get_group_msg_history',
    params: {
      group_id: number,
      message_seq: number,
      /** 扩展 */
      count?: number
    },
    response: {
      messages: Array<{
        message_id: number,
        real_id: number,
        sender: SenderGroup,
        time: number,
        message: OneBotMessage[],
        raw_message: string
      }>
    }
  }

  /** NapCat扩展: 获取群消息历史记录 */
  [OneBotMessageApiAction.nc_getGroupMsgHistory]: {
    action: 'nc_get_group_msg_history',
    params: {
      group_id: number,
      message_seq: number,
      count?: number,
      /** 是否倒序 可选 默认false */
      reverse?: boolean
    },
    response: {
      messages: Array<{
        message_id: number,
        real_id: number,
        sender: SenderGroup,
        time: number,
        message: OneBotMessage[],
        raw_message: string
      }>
    }
  }

  /** Lagrange扩展: 获取群消息历史记录 */
  [OneBotMessageApiAction.lgl_getGroupMsgHistory]: {
    action: 'get_group_msg_history',
    params: {
      group_id: number,
      message_id: number,
      count?: number
    },
    response: {
      messages: Array<{
        message_id: number,
        real_id: number,
        sender: SenderGroup,
        time: number,
        message: OneBotMessage[],
        raw_message: string
      }>
    }
  }

  /** NapCat扩展: 获取好友消息历史记录 */
  [OneBotMessageApiAction.nc_getFriendMsgHistory]: {
    action: 'nc_get_friend_msg_history',
    params: {
      user_id: number,
      message_seq: number,
      count?: number,
      /** 是否倒序 可选 默认false */
      reverse?: boolean
    },
    response: {
      messages: Array<{
        message_id: number,
        real_id: number,
        sender: SenderPrivate,
        time: number,
        message: OneBotMessage[],
        raw_message: string
      }>
    }
  }

  /** Lagrange扩展: 获取好友消息历史记录 */
  [OneBotMessageApiAction.lgl_getFriendMsgHistory]: {
    action: 'get_friend_msg_history',
    params: {
      user_id: number,
      message_id: number,
      count?: number
    },
    response: {
      messages: Array<{
        message_id: number,
        real_id: number,
        sender: SenderPrivate,
        time: number,
        message: OneBotMessage[],
        raw_message: string
      }>
    }
  }

  /** 社区扩展: 获取 Ai 声色列表 */
  [OneBotMessageApiAction.getAiCharacters]: {
    action: 'get_ai_characters',
    params: Record<string, never>,
    response: Array<{
      character_id: string,
      character_name: string,
      preview_url: string
    }>
  }

  /** 社区扩展: 发送群 Ai 语音 */
  [OneBotMessageApiAction.sendGroupAiRecord]: {
    action: 'send_group_ai_record',
    params: {
      group_id: number,
      text: string,
      character_id: string
    },
    response: {
      message_id: number
    }
  }

  /** Lagrange扩展: 标记消息为已读 */
  [OneBotMessageApiAction.lgl_markMsgAsRead]: {
    action: 'mark_msg_as_read',
    params: {
      message_id: number
    },
    response: null
  }

  /** Lagrange扩展: 给消息添加表情回应 */
  [OneBotMessageApiAction.lgl_setGroupReaction]: {
    action: 'set_group_reaction',
    params: {
      group_id: number,
      message_id: number,
      emoji_id: string,
      set: boolean
    },
    response: null
  }

  /** NapCat扩展: 给消息添加表情回应 */
  [OneBotMessageApiAction.nc_setMsgEmojiLike]: {
    action: 'set_msg_emoji_like',
    params: {
      message_id: number,
      emoji_id: string,
      set: boolean
    },
    response: {
      result: number,
      errMsg: string
    }
  }
}
