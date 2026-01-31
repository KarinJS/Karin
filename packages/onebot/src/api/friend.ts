import { Sex } from '../event/sender'

export enum OneBotFriendApiAction {
  sendLike = 'send_like',
  setFriendAddRequest = 'set_friend_add_request',
  lgl_setFriendAddRequest = 'lgl_set_friend_add_request',
  getStrangerInfo = 'get_stranger_info',
  nc_getStrangerInfo = 'nc_get_stranger_info',
  getFriendList = 'get_friend_list',
  nc_getFriendList = 'nc_get_friend_list',
  lgl_getFriendList = 'lgl_get_friend_list',
  getUnidirectionalFriendList = 'get_unidirectional_friend_list',
  nc_getUnidirectionalFriendList = 'nc_get_unidirectional_friend_list',
  deleteFriend = 'delete_friend',
  nc_deleteFriend = 'nc_delete_friend',
  lgl_deleteFriend = 'lgl_delete_friend',
  deleteUnidirectionalFriend = 'delete_unidirectional_friend',
  nc_setFriendRemark = 'nc_set_friend_remark',
  nc_getFriendsWithCategory = 'nc_get_friends_with_category',
  nc_getDoubtFriendsAddRequest = 'nc_get_doubt_friends_add_request',
  nc_setDoubtFriendsAddRequest = 'nc_set_doubt_friends_add_request',
  nc_friendPoke = 'nc_friend_poke',
  lgl_friendPoke = 'lgl_friend_poke',
}

/**
 * 好友相关 API
 */
export interface OneBotFriendApi {
  /** 发送好友赞 */
  [OneBotFriendApiAction.sendLike]: {
    action: 'send_like',
    params: {
      user_id: number,
      times?: number
    },
    response: null
  }

  /** 处理加好友请求 */
  [OneBotFriendApiAction.setFriendAddRequest]: {
    action: 'set_friend_add_request',
    params: {
      flag: string,
      approve: boolean,
      remark?: string
    },
    response: null
  }

  /** Lagrange扩展: 处理加好友请求 */
  [OneBotFriendApiAction.lgl_setFriendAddRequest]: {
    action: 'set_friend_add_request',
    params: {
      flag: string,
      approve: boolean,
      reason?: string
    },
    response: null
  }

  /** 获取陌生人信息 */
  [OneBotFriendApiAction.getStrangerInfo]: {
    action: 'get_stranger_info',
    params: {
      user_id: number,
      no_cache?: boolean
    },
    response: {
      user_id: number,
      nickname: string,
      sex: Sex,
      age: number,
      [key: string]: any // 特别声明一下 这个结果返回的参数非常多 请以实际为准
    }
  }

  /** NapCat扩展: 获取陌生人信息 */
  [OneBotFriendApiAction.nc_getStrangerInfo]: {
    action: 'get_stranger_info',
    params: {
      user_id: number
    },
    response: {
      user_id: number,
      nickname: string,
      sex: Sex,
      age: number,
      [key: string]: any // 特别声明一下 这个结果返回的参数非常多 请以实际为准
    }
  }

  /** 获取好友列表 */
  [OneBotFriendApiAction.getFriendList]: {
    action: 'get_friend_list',
    params: Record<string, never>,
    response: Array<{
      user_id: number,
      nickname: string,
      remark: string,
      [key: string]: any // 特别声明一下 这个结果返回的参数非常多 请以实际为准
    }>
  }

  /** NapCat扩展: 获取好友列表 */
  [OneBotFriendApiAction.nc_getFriendList]: {
    action: 'get_friend_list',
    params: {
      no_cache?: boolean
    },
    response: Array<{
      user_id: number,
      nickname: string,
      remark: string,
      birthday_year: number,
      birthday_month: number,
      birthday_day: number,
      age: number,
      phone_num: string,
      email: string,
      category_id: number,
      sex: Sex,
      level: number
    }>
  }

  /** Lagrange扩展: 获取好友列表 */
  [OneBotFriendApiAction.lgl_getFriendList]: {
    action: 'get_friend_list',
    params: Record<string, never>,
    response: Array<{
      user_id: number,
      nickname: string,
      remark: string,
      q_id: string,
      group: {
        group_id: number,
        group_name: string
      }
    }>
  }

  /** GoCQ扩展: 获取单向好友列表 */
  [OneBotFriendApiAction.getUnidirectionalFriendList]: {
    action: 'get_unidirectional_friend_list',
    params: Record<string, never>,
    response: Array<{
      user_id: number,
      nickname: string
    }>
  }

  /** NapCat扩展: 获取单向好友列表 */
  [OneBotFriendApiAction.nc_getUnidirectionalFriendList]: {
    action: 'get_unidirectional_friend_list',
    params: Record<string, never>,
    response: Array<{
      uin: number,
      uid: string,
      nick_name: string,
      age: number,
      source: string
    }>
  }

  /** GoCQ扩展: 删除好友 */
  [OneBotFriendApiAction.deleteFriend]: {
    action: 'delete_friend',
    params: {
      user_id: number
    },
    response: null
  }

  /** NapCat扩展: 删除好友 */
  [OneBotFriendApiAction.nc_deleteFriend]: {
    action: 'delete_friend',
    params: {
      user_id: number,
      friend_id?: number,
      temp_block?: boolean,
      temp_both_del?: boolean
    },
    response: {
      result: number,
      errMsg: string
    }
  }

  /** Lagrange扩展: 删除好友 */
  [OneBotFriendApiAction.lgl_deleteFriend]: {
    action: 'delete_friend',
    params: {
      user_id: number,
      block: boolean
    },
    response: null
  }

  /** GoCQ扩展: 删除单向好友 */
  [OneBotFriendApiAction.deleteUnidirectionalFriend]: {
    action: 'delete_unidirectional_friend',
    params: {
      user_id: number
    },
    response: null
  }

  /** NapCat扩展: 设置好友备注 */
  [OneBotFriendApiAction.nc_setFriendRemark]: {
    action: 'set_friend_remark',
    params: {
      user_id: number,
      remark: string
    },
    response: null
  }

  /** NapCat扩展: 获取分类的好友列表 */
  [OneBotFriendApiAction.nc_getFriendsWithCategory]: {
    action: 'get_friends_with_category',
    params: Record<string, never>,
    response: Array<{
      categoryId: number,
      categorySortId: number,
      categoryName: string,
      categoryMbCount: number,
      onlineCount: number,
      buddyList: Array<{
        birthday_year: number,
        birthday_month: number,
        birthday_day: number,
        user_id: number,
        age: number,
        phone_num: string,
        email: string,
        category_id: number,
        nickname: string,
        remark: string,
        sex: Sex,
        level: number
      }>
    }>
  }

  /** NapCat扩展: 获取可疑好友请求 */
  [OneBotFriendApiAction.nc_getDoubtFriendsAddRequest]: {
    action: 'get_doubt_friends_add_request',
    params: Record<string, never>,
    response: Array<{
      flag: string,
      uin: string,
      nick: string,
      source: string,
      reason: string,
      msg: string,
      group_code: string,
      time: string,
      type: string
    }>
  }

  /** NapCat扩展: 处理可疑好友请求 */
  [OneBotFriendApiAction.nc_setDoubtFriendsAddRequest]: {
    action: 'set_doubt_friends_add_request',
    params: {
      request_id: string,
      approve: boolean
    },
    response: null
  }

  /** NapCat扩展: 好友戳一戳 */
  [OneBotFriendApiAction.nc_friendPoke]: {
    action: 'friend_poke',
    params: {
      user_id?: number,
      target_id?: number
    },
    response: null
  }

  /** Lagrange扩展: 好友戳一戳 */
  [OneBotFriendApiAction.lgl_friendPoke]: {
    action: 'friend_poke',
    params: {
      user_id?: number,
      target_id?: number
    },
    response: null
  }
}
