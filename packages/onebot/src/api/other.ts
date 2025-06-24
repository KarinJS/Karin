export enum OneBotOtherApiAction {
  restartOneBot = 'set_restart',
  cleanCache = 'clean_cache',
  downloadFile = 'download_file',
  nc_downloadFile = 'nc_download_file',
  checkUrlSafely = 'check_url_safely',
  getWordSlices = '.get_word_slices',
  handleQuickOperation = '.handle_quick_operation',
  ocrImage = 'ocr_image',
  dotOcrImage = '.ocr_image',
  nc_ocrImage = 'nc_ocr_image',
  nc_translateEn2zh = 'translate_en2zh',
  nc_clickInlineKeyboardButton = 'click_inline_keyboard_button',
  nc_arkSharePeer = 'ArkSharePeer',
  nc_arkShareGroup = 'ArkShareGroup',
  nc_createCollection = 'create_collection',
  nc_getCollectionList = 'get_collection_list',
  nc_botExit = 'bot_exit',
  nc_sendPacket = 'send_packet',
  nc_getPacketStatus = 'nc_get_packet_status',
  nc_getMiniAppArk = 'get_mini_app_ark',
  nc_getAiRecord = 'get_ai_record',
  nc_sendPoke = 'send_poke',
}

/**
 * 其他 API
 */
export interface OneBotOtherApi {
  /** 重启 OneBot 实现 */
  [OneBotOtherApiAction.restartOneBot]: {
    action: 'set_restart',
    params: {
      delay?: number
    },
    response: null
  }

  /** 清理缓存 */
  [OneBotOtherApiAction.cleanCache]: {
    action: 'clean_cache',
    params: Record<string, never>,
    response: null
  }

  /** 下载文件到缓存目录 */
  [OneBotOtherApiAction.downloadFile]: {
    action: 'download_file',
    params: {
      url: string,
      thread_count?: number,
      headers?: Array<string>
    },
    response: {
      file: string
    }
  }

  /** NapCat扩展: 下载文件到缓存目录 */
  [OneBotOtherApiAction.nc_downloadFile]: {
    action: 'download_file',
    params: {
      url: string,
      base64?: string,
      name?: string,
      headers?: Array<string>
    },
    response: {
      file: string
    }
  }

  /** 检查链接安全性 */
  [OneBotOtherApiAction.checkUrlSafely]: {
    action: 'check_url_safely',
    params: {
      url: string
    },
    response: {
      level: number
    }
  }

  /** 获取中文分词 */
  [OneBotOtherApiAction.getWordSlices]: {
    action: '.get_word_slices',
    params: {
      content: string
    },
    response: {
      slices: Array<string>
    }
  }

  /** 对事件执行快速操作 */
  [OneBotOtherApiAction.handleQuickOperation]: {
    action: '.handle_quick_operation',
    params: {
      context: object,
      operation: object
    },
    response: null
  }

  /** OCR图片 */
  [OneBotOtherApiAction.ocrImage]: {
    action: 'ocr_image',
    params: {
      image: string
    },
    response: {
      texts: Array<{
        text: string,
        confidence: number,
        coordinates: Array<{
          x: number,
          y: number
        }>
      }>,
      language: string
    }
  }

  /** OCR图片 (别名) */
  [OneBotOtherApiAction.dotOcrImage]: {
    action: '.ocr_image',
    params: {
      image: string
    },
    response: {
      texts: Array<{
        text: string,
        confidence: number,
        coordinates: Array<{
          x: number,
          y: number
        }>
      }>,
      language: string
    }
  }

  /** NapCat扩展: OCR图片 */
  [OneBotOtherApiAction.nc_ocrImage]: {
    action: 'ocr_image',
    params: {
      image: string
    },
    response: Array<{
      text: string,
      pt1: {
        x: string,
        y: string
      },
      pt2: {
        x: string,
        y: string
      },
      pt3: {
        x: string,
        y: string
      },
      pt4: {
        x: string,
        y: string
      },
      charBox: Array<{
        charText: string,
        charBox: {
          pt1: {
            x: string,
            y: string
          },
          pt2: {
            x: string,
            y: string
          },
          pt3: {
            x: string,
            y: string
          },
          pt4: {
            x: string,
            y: string
          }
        }
      }>,
      score: string
    }>
  }

  /** NapCat扩展: 英文翻译为中文 */
  [OneBotOtherApiAction.nc_translateEn2zh]: {
    action: 'translate_en2zh',
    params: {
      text: string
    },
    response: {
      result: string
    }
  }

  /** NapCat扩展: 点击按钮 */
  [OneBotOtherApiAction.nc_clickInlineKeyboardButton]: {
    action: 'click_inline_keyboard_button',
    params: {
      message_id: number,
      button_index: number
    },
    response: {
      result: boolean
    }
  }

  /** NapCat扩展: 获取推荐好友/群聊卡片 */
  [OneBotOtherApiAction.nc_arkSharePeer]: {
    action: 'ArkSharePeer',
    params: {
      user_id: number
    },
    response: {
      data: string
    }
  }

  /** NapCat扩展: 获取推荐群聊卡片 */
  [OneBotOtherApiAction.nc_arkShareGroup]: {
    action: 'ArkShareGroup',
    params: {
      group_id: number
    },
    response: {
      data: string
    }
  }

  /** NapCat扩展: 创建收藏 */
  [OneBotOtherApiAction.nc_createCollection]: {
    action: 'create_collection',
    params: {
      message_id: number
    },
    response: {
      result: boolean
    }
  }

  /** NapCat扩展: 获取收藏列表 */
  [OneBotOtherApiAction.nc_getCollectionList]: {
    action: 'get_collection_list',
    params: Record<string, never>,
    response: Array<{
      id: string,
      content: string,
      time: number
    }>
  }

  /** NapCat扩展: 退出机器人 */
  [OneBotOtherApiAction.nc_botExit]: {
    action: 'bot_exit',
    params: Record<string, never>,
    response: null
  }

  /** NapCat扩展: 发送自定义组包 */
  [OneBotOtherApiAction.nc_sendPacket]: {
    action: 'send_packet',
    params: Record<string, any>,
    response: Record<string, any>
  }

  /** NapCat扩展: 获取packet状态 */
  [OneBotOtherApiAction.nc_getPacketStatus]: {
    action: 'nc_get_packet_status',
    params: Record<string, never>,
    response: null
  }

  /** NapCat扩展: 获取小程序卡片 */
  [OneBotOtherApiAction.nc_getMiniAppArk]: {
    action: 'get_mini_app_ark',
    params: {
      type?: string,
      title?: string,
      desc?: string,
      picUrl?: string,
      jumpUrl?: string,
      webUrl?: string,
      iconUrl?: string,
      appId?: string,
      scene?: string,
      templateType?: string,
      businessType?: string,
      verType?: string,
      shareType?: string,
      versionId?: string,
      sdkId?: string,
      withShareTicket?: string,
      rawArkData?: boolean
    },
    response: {
      data: {
        appName?: string,
        appView?: string,
        ver?: string,
        desc?: string,
        prompt?: string,
        metaData?: string,
        config?: string,
        app?: string,
        view?: string,
        meta?: string,
        miniappShareOrigin?: number,
        miniappOpenRefer?: string
      }
    }
  }

  /** NapCat扩展: 获取AI语音 */
  [OneBotOtherApiAction.nc_getAiRecord]: {
    action: 'get_ai_record',
    params: {
      character: string,
      group_id: number,
      text: string
    },
    response: string
  }

  /** NapCat扩展: 发送戳一戳 */
  [OneBotOtherApiAction.nc_sendPoke]: {
    action: 'send_poke',
    params: {
      user_id?: string,
      group_id?: string,
      target_id?: string
    },
    response: null
  }
}
