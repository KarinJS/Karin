export declare namespace EventType {
  interface Message {
    /** 机器人id */
    self_id: string;
    /** 用户id */
    user_id: string;
    /** 群id */
    group_id?: string;
    /** 事件类型 */
    event: 'message';
    /** 消息时间戳 */
    time: number;
    /** 消息id */
    message_id: string;
    /** 消息序列号 */
    message_seq: string;
    /** 适合人类阅读的消息体 */
    raw_message: string;
    /** 联系人信息 */
    contact: {
      /** 场景 */
      scene: 'group' | 'friend' | 'guild' | 'nearby' | 'stranger' | 'stranger_from_group';
      /** 群聊/私聊/频道号 */
      peer: string;
      /** 群临时会话/子频道号 */
      sub_peer?: string;
    };
    /** 发送者信息 */
    sender: {
      /** 发送者uid */
      uid: string;
      /** 发送者uin */
      uin: string;
      /** 发送者昵称 */
      nick?: string;
    };
    /** 消息体元素 */
    elements: Element[];
    /** 框架处理后的文本 */
    msg: string;
    /** 游戏类型 */
    game: string;
    /** 图片数组 */
    img: string[];
    /** at */
    at: string;
    /** atBot */
    atBot: boolean;
    /** atAll */
    atAll: boolean;
    /** 文件元素 */
    file: object;
    /** 引用消息id */
    reply_id: string;
    /** 是否为主人 */
    isMaster: boolean;
    /** 是否为私聊 */
    isPrivate: boolean;
    /** 是否为群聊 */
    isGroup: boolean;
    /** 是否为频道 */
    isGuild: boolean;
    /** 是否为群临时会话 */
    isGroupTemp: boolean;
    /** 日志函数字符串 */
    logFnc: string;
    /** 日志用户字符串 */
    logText: string;
    /**
     * @param {string|Element} msg - 发送的消息
     * @param {object} data - 回复数据
     * @param {boolean} data.at - 是否at用户
     * @param {boolean} data.reply - 是否引用回复
     * @param {number} data.recallMsg - 群聊是否撤回消息，0-120秒，0不撤回
     * @param {boolean} data.button - 是否使用按钮
     */
    reply: (msg: string | Element, data: ReplyData = {}) => { message_id?: string };
    /** 打印带bot前缀info等级日志 */
    log: (...args: string) => void;
    /**
     * 获取头像url
     * @param size 头像大小，默认`0`
     * @param uid 用户id，默认为发送者uid
     * @returns 头像的url地址
     */
    getAvatar: (uid: string, size?: number) => string;
    /**
     * 获取群头像
     * @param group_id 群号
     * @param size 头像大小，默认`0`
     * @returns 群头像的url地址
     */
    getGroupAvatar: (group_id: string, size?: number) => string;
  }

  interface KarinNotice {
    /** 机器人id */
    self_id: string;
    /** 用户id */
    user_id: string;
    /** 群id */
    group_id?: string;
    /** 事件类型 */
    event: 'notice';
    /** 子事件类型 */
    type: 'group_recall',
    /** 消息时间戳 */
    time: number;
    /** 消息id */
    message_id: string;
    /** 消息序列号 */
    message_seq: string;
    /** 适合人类阅读的消息体 */
    raw_message: string;
    /** 联系人信息 */
    contact: {
      /** 场景 */
      scene: 'group' | 'friend';
      /** 群聊/私聊id */
      peer: string;
      /** 群临时会话/子频道号 */
      sub_peer?: string;
    };
    /** 发送者信息 */
    sender: {
      /** 操作者uid */
      operator_uid?: string;
      /** 操作者uin */
      operator_uin?: string;
      /** 目标uid */
      target_uid?: string;
      /** 目标uin */
      target_uin?: string;
    };
    /** 对应事件的结构体 */
    content: {

    };
    /** 日志函数字符串 */
    logFnc: string;
    /** 日志用户字符串 */
    logText: string;
    /**
     * @param {string|Element} msg - 发送的消息
     * @param {object} data - 回复数据
     * @param {boolean} data.at - 是否at用户
     * @param {boolean} data.reply - 是否引用回复
     * @param {number} data.recallMsg - 群聊是否撤回消息，0-120秒，0不撤回
     * @param {boolean} data.button - 是否使用按钮
     */
    reply: (msg: string | Element, data: ReplyData = {}) => { message_id?: string };
  }

  interface ReplyData {
    /** 是否at用户 */
    at?: boolean;
    /** 是否引用回复 */
    reply?: boolean;
    /** 群聊是否撤回消息，0-120秒，0不撤回 */
    recallMsg?: number;
    /** 是否使用按钮 */
    button?: boolean;
  }

  /** 消息体元素 */
  type Element =
    | TextElement
    | AtElement
    | FaceElement
    | ReplyElement
    | ForwardElement
    | ImageElement
    | FileElement
    | VideoElement
    | AudioElement
    | ShareElement;

  /** 文本消息元素 */
  interface TextElement {
    type: 'text';
    text: string;
  }

  /** @消息元素 */
  interface AtElement {
    type: 'at';
    uid: string;
    uin: number;
  }

  /** 表情消息元素 */
  interface FaceElement {
    type: 'face';
    id: number;
  }

  /** 回复消息元素 */
  interface ReplyElement {
    type: 'reply';
    message_id: string;
  }

  /** 转发消息元素 */
  interface ForwardElement {
    type: 'forward';
    res_id: string;
  }

  /** 图片消息元素 */
  interface ImageElement {
    type: 'image';
    file: string;
  }

  /** 文件消息元素 */
  interface FileElement {
    type: 'file';
    file: string;
  }

  /** 视频消息元素 */
  interface VideoElement {
    type: 'video';
    file: string;
  }

  /** 音频消息元素 */
  interface AudioElement {
    type: 'audio';
    file: string;
  }

  /** 分享消息元素 */
  interface ShareElement {
    type: 'share';
    file: string;
  }
}
