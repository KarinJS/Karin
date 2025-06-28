import { Sex } from '../event/sender'

export enum OneBotGroupApiAction {
  setGroupKick = 'set_group_kick',
  setGroupBan = 'set_group_ban',
  setGroupAnonymousBan = 'set_group_anonymous_ban',
  setGroupWholeBan = 'set_group_whole_ban',
  setGroupAdmin = 'set_group_admin',
  setGroupAnonymous = 'set_group_anonymous',
  setGroupCard = 'set_group_card',
  setGroupName = 'set_group_name',
  setGroupLeave = 'set_group_leave',
  lgl_setGroupLeave = 'lgl_set_group_leave',
  setGroupSpecialTitle = 'set_group_special_title',
  getGroupInfo = 'get_group_info',
  getGroupList = 'get_group_list',
  getGroupMemberInfo = 'get_group_member_info',
  getGroupMemberList = 'get_group_member_list',
  getGroupHonorInfo = 'get_group_honor_info',
  setGroupAddRequest = 'set_group_add_request',
  setGroupPortrait = 'set_group_portrait',
  setEssenceMsg = 'set_essence_msg',
  deleteEssenceMsg = 'delete_essence_msg',
  getEssenceMsgList = 'get_essence_msg_list',
  sendGroupSign = 'send_group_sign',
  getGroupNotice = '_get_group_notice',
  sendGroupNotice = '_send_group_notice',
  delGroupNotice = '_del_group_notice',
  getGroupSystemMsg = 'get_group_system_msg',
  getGroupAtAllRemain = 'get_group_at_all_remain',
  lgl_setGroupBotStatus = 'set_group_bot_status',
  nc_setGroupKickMembers = 'set_group_kick_members',
  nc_setGroupRobotAddOption = 'set_group_robot_add_option',
  nc_setGroupAddOption = 'set_group_add_option',
  nc_setGroupSearch = 'set_group_search',
  nc_setGroupRemark = 'set_group_remark',
  nc_groupPoke = 'group_poke',
  nc_getGroupInfoEx = 'get_group_info_ex',
  nc_getGroupDetailInfo = 'get_group_detail_info',
  nc_getGroupIgnoreAddRequest = 'get_group_ignore_add_request',
  nc_getGroupShutList = 'get_group_shut_list',
  nc_getGroupIgnoredNotifies = 'get_group_ignored_notifies',
}

/**
 * 群组相关 API
 */
export interface OneBotGroupApi {
  /** 群组踢人 */
  [OneBotGroupApiAction.setGroupKick]: {
    action: 'set_group_kick',
    params: {
      group_id: number,
      user_id: number,
      reject_add_request?: boolean
    },
    response: null
  }

  /** 群组单人禁言 */
  [OneBotGroupApiAction.setGroupBan]: {
    action: 'set_group_ban',
    params: {
      group_id: number,
      user_id: number,
      duration?: number
    },
    response: null
  }

  /** 群组匿名用户禁言 */
  [OneBotGroupApiAction.setGroupAnonymousBan]: {
    action: 'set_group_anonymous_ban',
    params: {
      group_id: number,
      anonymous?: {
        id: number,
        name: string,
        flag: string
      },
      flag?: string,
      duration?: number
    },
    response: null
  }

  /** 群组全员禁言 */
  [OneBotGroupApiAction.setGroupWholeBan]: {
    action: 'set_group_whole_ban',
    params: {
      group_id: number,
      enable?: boolean
    },
    response: null
  }

  /** 群组设置管理员 */
  [OneBotGroupApiAction.setGroupAdmin]: {
    action: 'set_group_admin',
    params: {
      group_id: number,
      user_id: number,
      enable?: boolean
    },
    response: null
  }

  /** 群组匿名 */
  [OneBotGroupApiAction.setGroupAnonymous]: {
    action: 'set_group_anonymous',
    params: {
      group_id: number,
      enable?: boolean
    },
    response: null
  }

  /** 设置群名片（群备注） */
  [OneBotGroupApiAction.setGroupCard]: {
    action: 'set_group_card',
    params: {
      group_id: number,
      user_id: number,
      card?: string
    },
    response: null
  }

  /** 设置群名 */
  [OneBotGroupApiAction.setGroupName]: {
    action: 'set_group_name',
    params: {
      group_id: number,
      group_name: string
    },
    response: null
  }

  /** 退出群组 */
  [OneBotGroupApiAction.setGroupLeave]: {
    action: 'set_group_leave',
    params: {
      group_id: number,
      is_dismiss?: boolean
    },
    response: null
  }

  /** Lagrange扩展: 退出群组 */
  [OneBotGroupApiAction.lgl_setGroupLeave]: {
    action: 'set_group_leave',
    params: {
      group_id: number
    },
    response: null
  }

  /** 设置群组专属头衔 */
  [OneBotGroupApiAction.setGroupSpecialTitle]: {
    action: 'set_group_special_title',
    params: {
      group_id: number,
      user_id: number,
      special_title?: string,
      duration?: number
    },
    response: null
  }

  /** 获取群信息 */
  [OneBotGroupApiAction.getGroupInfo]: {
    action: 'get_group_info',
    params: {
      group_id: number,
      no_cache?: boolean
    },
    response: {
      group_id: number,
      group_name: string,
      member_count: number,
      max_member_count: number,
      owner_id: number,
      admin_flag?: boolean,
      admin_list?: Array<{
        user_id: number,
        nickname: string,
        role: string
      }>,
      create_time?: number,
      category?: number,
      group_level?: number,
      group_create_time?: number,
      group_memo?: string
    }
  }

  /** 获取群列表 */
  [OneBotGroupApiAction.getGroupList]: {
    action: 'get_group_list',
    params: {},
    response: Array<{
      group_id: number,
      group_name: string,
      member_count: number,
      max_member_count: number
    }>
  }

  /** 获取群成员信息 */
  [OneBotGroupApiAction.getGroupMemberInfo]: {
    action: 'get_group_member_info',
    params: {
      group_id: number,
      user_id: number,
      no_cache?: boolean
    },
    response: {
      group_id: number,
      user_id: number,
      nickname: string,
      card: string,
      sex: Sex,
      age: number,
      area: string,
      join_time: number,
      last_sent_time: number,
      level: string,
      role: string,
      unfriendly: boolean,
      title: string,
      title_expire_time: number,
      card_changeable: boolean,
      shut_up_timestamp: number
    }
  }

  /** 获取群成员列表 */
  [OneBotGroupApiAction.getGroupMemberList]: {
    action: 'get_group_member_list',
    params: {
      group_id: number,
      no_cache?: boolean
    },
    response: Array<{
      group_id: number,
      user_id: number,
      nickname: string,
      card: string,
      sex: Sex,
      age: number,
      area: string,
      join_time: number,
      last_sent_time: number,
      level: string,
      role: string,
      unfriendly: boolean,
      title: string,
      title_expire_time: number,
      card_changeable: boolean,
      shut_up_timestamp: number
    }>
  }

  /** 获取群荣誉信息 */
  [OneBotGroupApiAction.getGroupHonorInfo]: {
    action: 'get_group_honor_info',
    params: {
      group_id: number,
      type: string
    },
    response: {
      group_id: number,
      current_talkative?: {
        user_id: number,
        nickname: string,
        avatar: string,
        day_count: number
      },
      talkative_list?: Array<{
        user_id: number,
        nickname: string,
        avatar: string,
        description: string
      }>,
      performer_list?: Array<{
        user_id: number,
        nickname: string,
        avatar: string,
        description: string
      }>,
      legend_list?: Array<{
        user_id: number,
        nickname: string,
        avatar: string,
        description: string
      }>,
      strong_newbie_list?: Array<{
        user_id: number,
        nickname: string,
        avatar: string,
        description: string
      }>,
      emotion_list?: Array<{
        user_id: number,
        nickname: string,
        avatar: string,
        description: string
      }>
    }
  }

  /** 处理加群请求/邀请 */
  [OneBotGroupApiAction.setGroupAddRequest]: {
    action: 'set_group_add_request',
    params: {
      flag: string,
      sub_type: 'add' | 'invite',
      approve: boolean,
      reason?: string
    },
    response: null
  }

  /** GOCQ拓展: 设置群头像 */
  [OneBotGroupApiAction.setGroupPortrait]: {
    action: 'set_group_portrait',
    params: {
      group_id: number,
      file: string,
      cache?: number
    },
    response: null
  }

  /** GOCQ拓展: 设置精华消息 */
  [OneBotGroupApiAction.setEssenceMsg]: {
    action: 'set_essence_msg',
    params: {
      message_id: number
    },
    response: null
  }

  /** GOCQ拓展: 移出精华消息 */
  [OneBotGroupApiAction.deleteEssenceMsg]: {
    action: 'delete_essence_msg',
    params: {
      message_id: number
    },
    response: null
  }

  /** GOCQ拓展: 获取精华消息列表 */
  [OneBotGroupApiAction.getEssenceMsgList]: {
    action: 'get_essence_msg_list',
    params: {
      group_id: number
    },
    response: Array<{
      sender_id: number,
      sender_nick: string,
      sender_time: number,
      operator_id: number,
      operator_nick: string,
      operator_time: number,
      message_id: number,
      content: string
    }>
  }

  /** GOCQ拓展: 群打卡 */
  [OneBotGroupApiAction.sendGroupSign]: {
    action: 'send_group_sign',
    params: {
      group_id: number
    },
    response: null
  }

  /** GOCQ拓展: 获取群公告 */
  [OneBotGroupApiAction.getGroupNotice]: {
    action: '_get_group_notice',
    params: {
      group_id: number
    },
    response: Array<{
      sender_id: number,
      publish_time: number,
      message: {
        text: string,
        images: Array<{
          height: string,
          width: string,
          id: string
        }>
      }
    }>
  }

  /** GOCQ拓展: 发送群公告 */
  [OneBotGroupApiAction.sendGroupNotice]: {
    action: '_send_group_notice',
    params: {
      group_id: number,
      content: string,
      image?: string
    },
    response: null
  }

  /** GOCQ拓展: 删除群公告 */
  [OneBotGroupApiAction.delGroupNotice]: {
    action: '_del_group_notice',
    params: {
      group_id: number,
      notice_id: string
    },
    response: null
  }

  /** GOCQ拓展: 获取群系统消息 */
  [OneBotGroupApiAction.getGroupSystemMsg]: {
    action: 'get_group_system_msg',
    params: {},
    response: {
      invited_requests: Array<{
        request_id: number,
        invitor_uin: number,
        invitor_nick: string,
        group_id: number,
        group_name: string,
        checked: boolean,
        actor: number
      }>,
      join_requests: Array<{
        request_id: number,
        requester_uin: number,
        requester_nick: string,
        message: string,
        group_id: number,
        group_name: string,
        checked: boolean,
        actor: number
      }>
    }
  }

  /** GOCQ拓展: 获取群@全体成员剩余次数 */
  [OneBotGroupApiAction.getGroupAtAllRemain]: {
    action: 'get_group_at_all_remain',
    params: {
      group_id: number
    },
    response: {
      can_at_all: boolean,
      remain_at_all_count_for_group: number,
      remain_at_all_count_for_uin: number
    }
  }

  /** Lagrange拓展: 设置群Bot发言状态 */
  [OneBotGroupApiAction.lgl_setGroupBotStatus]: {
    action: 'set_group_bot_status',
    params: {
      group_id: number,
      status: 'normal' | 'readonly'
    },
    response: null
  }

  /** NapCat拓展: 群组踢多人 */
  [OneBotGroupApiAction.nc_setGroupKickMembers]: {
    action: 'set_group_kick_members',
    params: {
      group_id: number,
      user_ids: Array<number>,
      reject_add_request?: boolean
    },
    response: null
  }

  /** NapCat拓展: 设置机器人进群选项 */
  [OneBotGroupApiAction.nc_setGroupRobotAddOption]: {
    action: 'set_group_robot_add_option',
    params: {
      group_id: number,
      option: 'ignore' | 'discuss' | 'agree' | 'reject'
    },
    response: null
  }

  /** NapCat拓展: 设置群添加选项 */
  [OneBotGroupApiAction.nc_setGroupAddOption]: {
    action: 'set_group_add_option',
    params: {
      group_id: number,
      option: 'ignore' | 'discuss' | 'agree' | 'reject'
    },
    response: null
  }

  /** NapCat拓展: 设置群搜索 */
  [OneBotGroupApiAction.nc_setGroupSearch]: {
    action: 'set_group_search',
    params: {
      group_id: number,
      enable: boolean
    },
    response: null
  }

  /** NapCat拓展: 设置群备注 */
  [OneBotGroupApiAction.nc_setGroupRemark]: {
    action: 'set_group_remark',
    params: {
      group_id: number,
      remark: string
    },
    response: null
  }

  /** NapCat拓展: 群内戳一戳 */
  [OneBotGroupApiAction.nc_groupPoke]: {
    action: 'group_poke',
    params: {
      group_id: number,
      user_id: number
    },
    response: null
  }

  /** NapCat拓展: 获取群信息扩展 */
  [OneBotGroupApiAction.nc_getGroupInfoEx]: {
    action: 'get_group_info_ex',
    params: {
      group_id: number
    },
    response: {
      group_id: number,
      group_name: string,
      member_count: number,
      max_member_count: number,
      owner_id: number,
      admin_flag: boolean,
      last_join_time: number,
      group_flag: number,
      group_flag_ext: number,
      group_create_time: number,
      group_level: number,
      group_face: number,
      group_default_page: number,
      group_info_seq: number,
      group_roaming_time: number,
      group_option: Array<{
        option: number,
        value: number
      }>,
      group_admin_option: Array<{
        option: number,
        value: number
      }>
    }
  }

  /** NapCat拓展: 获取群详细信息 */
  [OneBotGroupApiAction.nc_getGroupDetailInfo]: {
    action: 'get_group_detail_info',
    params: {
      group_id: number
    },
    response: {
      group_id: number,
      group_name: string,
      create_time: number,
      member_count: number,
      max_member_count: number,
      member_admin_count: number,
      introduce: string,
      grade: number,
      active_member_count: number,
      certification_type: number,
      certification_text: string,
      group_flag: number,
      type_flag: number
    }
  }

  /** NapCat拓展: 获取群忽略添加请求 */
  [OneBotGroupApiAction.nc_getGroupIgnoreAddRequest]: {
    action: 'get_group_ignore_add_request',
    params: {
      group_id: number
    },
    response: Array<{
      request_id: number,
      message: string,
      group_id: number,
      group_name: string,
      checked: boolean,
      actor: number,
      requester_uin: number,
      requester_nick: string
    }>
  }

  /** NapCat拓展: 获取群禁言列表 */
  [OneBotGroupApiAction.nc_getGroupShutList]: {
    action: 'get_group_shut_list',
    params: {
      group_id: number
    },
    response: Array<{
      uin: number,
      user_id: number,
      nick: string,
      shut_up_timestamp: number
    }>
  }

  /** NapCat扩展: 获取群过滤系统消息 */
  [OneBotGroupApiAction.nc_getGroupIgnoredNotifies]: {
    action: 'get_group_ignored_notifies',
    params: {
      group_id: number
    },
    response: {
      InvitedRequest: Array<{
        request_id: number,
        invitor_uin: number,
        invitor_nick: string,
        group_id: number,
        message: string,
        group_name: string,
        checked: boolean,
        actor: number,
        requester_nick: string
      }>,
      join_requests: Array<{
        request_id: number,
        requester_nick: string,
        message: string,
        group_id: number,
        group_name: string,
        checked: boolean,
        actor: number,
        invitor_uin: number,
        invitor_nick: string
      }>
    }
  }
}
