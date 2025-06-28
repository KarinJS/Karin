import { Sex } from '../event/sender'

export enum OneBotBotApiAction {
  getLoginInfo = 'get_login_info',
  getVersionInfo = 'get_version_info',
  getStatus = 'get_status',
  getCookies = 'get_cookies',
  nc_getCookies = 'nc_get_cookies',
  getCsrfToken = 'get_csrf_token',
  getCredentials = 'get_credentials',
  getRecord = 'get_record',
  nc_getRecord = 'nc_get_record',
  getImage = 'get_image',
  nc_getImage = 'nc_get_image',
  canSendImage = 'can_send_image',
  canSendRecord = 'can_send_record',
  setQqProfile = 'set_qq_profile',
  qidianGetAccountInfo = 'qidian_get_account_info',
  getModelShow = '_get_model_show',
  setModelShow = '_set_model_show',
  getOnlineClients = 'get_online_clients',
  fetchCustomFace = 'fetch_custom_face',
  setQqAvatar = 'set_qq_avatar',
  getRkey = 'get_rkey',
  nc_getRkey = 'nc_get_rkey',
  lgl_getMfaceKey = 'get_mface_key',
  nc_getRkeyServer = 'get_rkey_server',
  nc_setDiyOnlineStatus = 'set_diy_online_status',
  nc_setOnlineStatus = 'set_online_status',
  nc_setInputStatus = 'set_input_status',
  nc_getProfileLike = 'get_profile_like',
  nc_getRobotUinRange = 'get_robot_uin_range',
  nc_setSelfLongnick = 'set_self_longnick',
  nc_getRecentContact = 'get_recent_contact',
  nc_getUserStatus = 'get_user_status',
  nc_getClientkey = 'get_clientkey',
}

/**
 * 机器人相关 API
 */
export interface OneBotBotApi {
  /** 获取登录号信息 */
  [OneBotBotApiAction.getLoginInfo]: {
    action: 'get_login_info',
    params: Record<string, never>,
    response: {
      user_id: number,
      nickname: string
    }
  }

  /** 获取版本信息 */
  [OneBotBotApiAction.getVersionInfo]: {
    action: 'get_version_info',
    params: Record<string, never>,
    response: {
      app_name: string,
      app_version: string,
      protocol_version: string
    }
  }

  /** 获取状态 */
  [OneBotBotApiAction.getStatus]: {
    action: 'get_status',
    params: Record<string, never>,
    response: {
      online: boolean,
      good: boolean,
      stat: Record<string, any>,
      [key: string]: any
    }
  }

  /** 获取Cookies */
  [OneBotBotApiAction.getCookies]: {
    action: 'get_cookies',
    params: {
      domain: string
    },
    response: {
      cookies: string
    }
  }

  /** NapCat扩展: 获取Cookies */
  [OneBotBotApiAction.nc_getCookies]: {
    action: 'get_cookies',
    params: {
      domain: string
    },
    response: {
      cookies: string,
      bkn: string
    }
  }

  /** 获取CSRF Token */
  [OneBotBotApiAction.getCsrfToken]: {
    action: 'get_csrf_token',
    params: Record<string, never>,
    response: {
      token: number
    }
  }

  /** 获取QQ相关接口凭证 */
  [OneBotBotApiAction.getCredentials]: {
    action: 'get_credentials',
    params: {
      domain: string
    },
    response: {
      cookies: string,
      csrf_token: number
    }
  }

  /** 获取语音 */
  [OneBotBotApiAction.getRecord]: {
    action: 'get_record',
    params: {
      file: string,
      out_format: string
    },
    response: {
      file: string
    }
  }

  /** NapCat扩展: 获取语音 */
  [OneBotBotApiAction.nc_getRecord]: {
    action: 'get_record',
    params: {
      file?: string,
      file_id?: string,
      out_format: string
    },
    response: {
      file: string,
      url: string,
      file_size: string,
      file_name: string,
      base64: string
    }
  }

  /** 获取图片 */
  [OneBotBotApiAction.getImage]: {
    action: 'get_image',
    params: {
      file: string
    },
    response: {
      file: string
    }
  }

  /** NapCat扩展: 获取图片 */
  [OneBotBotApiAction.nc_getImage]: {
    action: 'get_image',
    params: {
      file?: string,
      file_id?: string
    },
    response: {
      file: string,
      url: string,
      file_size: string,
      file_name: string,
      base64: string
    }
  }

  /** 检查是否可以发送图片 */
  [OneBotBotApiAction.canSendImage]: {
    action: 'can_send_image',
    params: Record<string, never>,
    response: {
      yes: boolean
    }
  }

  /** 检查是否可以发送语音 */
  [OneBotBotApiAction.canSendRecord]: {
    action: 'can_send_record',
    params: Record<string, never>,
    response: {
      yes: boolean
    }
  }

  /** 设置登录号资料 */
  [OneBotBotApiAction.setQqProfile]: {
    action: 'set_qq_profile',
    params: {
      nickname: string,
      company: string,
      email: string,
      college: string,
      personal_note: string
    },
    response: null
  }

  /** 获取企点账号信息 */
  [OneBotBotApiAction.qidianGetAccountInfo]: {
    action: 'qidian_get_account_info',
    params: Record<string, never>,
    response: {
      master_id: number,
      ext_name: string,
      create_time: number
    }
  }

  /** 获取在线机型 */
  [OneBotBotApiAction.getModelShow]: {
    action: '_get_model_show',
    params: {
      model: string
    },
    response: {
      variants: Array<{
        model_show: string,
        need_pay: boolean
      }>
    }
  }

  /** 设置在线机型 */
  [OneBotBotApiAction.setModelShow]: {
    action: '_set_model_show',
    params: {
      model: string,
      model_show: string
    },
    response: null
  }

  /** 获取当前账号在线客户端列表 */
  [OneBotBotApiAction.getOnlineClients]: {
    action: 'get_online_clients',
    params: {
      no_cache?: boolean
    },
    response: {
      clients: Array<{
        app_id: number,
        device_name: string,
        device_kind: string
      }>
    }
  }

  /** 社区扩展: 获取已收藏的QQ表情列表 */
  [OneBotBotApiAction.fetchCustomFace]: {
    action: 'fetch_custom_face',
    params: Record<string, never>,
    response: {
      faces: Array<{
        id: string,
        url: string
      }>
    }
  }

  /** 社区扩展: 设置QQ头像 */
  [OneBotBotApiAction.setQqAvatar]: {
    action: 'set_qq_avatar',
    params: {
      file: string
    },
    response: void
  }

  /** 社区扩展: 获取rkey */
  [OneBotBotApiAction.getRkey]: {
    action: 'get_rkey',
    params: Record<string, never>,
    response: {
      rkeys: Array<{
        type: 'private' | 'group',
        rkey: string,
        created_at: number,
        ttl: number
      }>
    }
  }

  /** NapCat扩展: 获取NC版rkey */
  [OneBotBotApiAction.nc_getRkey]: {
    action: 'nc_get_rkey',
    params: Record<string, never>,
    response: {
      rkey: string,
      ttl: number,
      time: number,
      type: number
    }
  }

  /** Lagrange扩展: 获取mface key */
  [OneBotBotApiAction.lgl_getMfaceKey]: {
    action: 'get_mface_key',
    params: Record<string, never>,
    response: {
      key: string
    }
  }

  /** NapCat扩展: 获取rkey服务器 */
  [OneBotBotApiAction.nc_getRkeyServer]: {
    action: 'get_rkey_server',
    params: Record<string, never>,
    response: {
      server: string
    }
  }

  /** NapCat扩展: 设置自定义在线状态 */
  [OneBotBotApiAction.nc_setDiyOnlineStatus]: {
    action: 'set_diy_online_status',
    params: {
      face: number,
      text: string
    },
    response: {
      result: number,
      message: string
    }
  }

  /** NapCat扩展: 设置在线状态 */
  [OneBotBotApiAction.nc_setOnlineStatus]: {
    action: 'set_online_status',
    params: {
      status: number
    },
    response: {
      result: number,
      message: string
    }
  }

  /** NapCat扩展: 设置输入状态 */
  [OneBotBotApiAction.nc_setInputStatus]: {
    action: 'set_input_status',
    params: {
      user_id: number,
      typing: boolean
    },
    response: {
      result: number,
      message: string
    }
  }

  /** NapCat扩展: 获取个人资料点赞 */
  [OneBotBotApiAction.nc_getProfileLike]: {
    action: 'get_profile_like',
    params: {
      user_id: number
    },
    response: {
      likeCount: number,
      voteInfo: {
        userInfos: Array<{
          age: number,
          bAvailableCnt: number,
          bTodayVotedCnt: number,
          count: number,
          customId: number,
          gender: number,
          giftCount: number,
          isFriend: boolean,
          isSvip: boolean,
          isvip: boolean,
          lastCharged: number,
          latestTime: number,
          nick: string,
          src: number,
          uid: string,
          uin: number
        }>,
        total_count: number,
        new_count: number,
        new_nearby_count: number,
        last_visit_time: number
      }
    }
  }

  /** NapCat扩展: 获取官方机器人账号范围 */
  [OneBotBotApiAction.nc_getRobotUinRange]: {
    action: 'get_robot_uin_range',
    params: Record<string, never>,
    response: Array<{
      minUin: string,
      maxUin: string
    }>
  }

  /** NapCat扩展: 设置自己的个性签名 */
  [OneBotBotApiAction.nc_setSelfLongnick]: {
    action: 'set_self_longnick',
    params: {
      longNick: string
    },
    response: {
      result: number,
      errMsg: string
    }
  }

  /** NapCat扩展: 获取最近联系人 */
  [OneBotBotApiAction.nc_getRecentContact]: {
    action: 'get_recent_contact',
    params: {
      count?: number
    },
    response: Array<{
      peerUin: number,
      remark: string,
      msgTime: number,
      chatType: number,
      msgId: number,
      sendNickName: string,
      sendMemberName: string,
      peerName: string,
      lastestMsg?: {
        self_id: number,
        user_id: number,
        time: number,
        real_seq: string,
        message_type: string,
        sender: {
          user_id: number,
          nickname: string,
          sex: Sex,
          age: number,
          card: string,
          role: string
        },
        raw_message: string,
        font: number,
        sub_type: string,
        message: Array<{
          type: string,
          data: {
            text: string
          }
        }>,
        message_format: string,
        post_type: string,
        group_id: number
      }
    }>
  }

  /** NapCat扩展: 获取用户状态 */
  [OneBotBotApiAction.nc_getUserStatus]: {
    action: 'get_user_status',
    params: {
      user_id: number
    },
    response: {
      status: number,
      ext_status: number
    }
  }

  /** NapCat扩展: 获取clientkey */
  [OneBotBotApiAction.nc_getClientkey]: {
    action: 'get_clientkey',
    params: Record<string, never>,
    response: {
      clientkey: string
    }
  }
}
