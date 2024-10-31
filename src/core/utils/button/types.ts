/** 按钮结构 */
export interface KarinButton {
  /** 按钮显示文本 */
  text: string
  /** 按钮类型 不建议使用 此为预留字段 */
  type?: number
  /**
   * - 是否为回调按钮
   * @default false
   */
  callback?: boolean
  /** 跳转按钮 */
  link?: string
  /** 操作相关的数据 */
  data?: string
  /** 按钮点击后显示的文字，不传为text */
  show?: string
  /**
   * 按钮样式
   * - 0-灰色线框
   * - 1-蓝色线框
   * - 2-特殊样式按钮
   * - 3-红色文字
   * - 4-白色填充
   */
  style?: number
  /** 点击按钮后直接自动发送 data */
  enter?: boolean
  /** 指令是否带引用回复本消息 */
  reply?: boolean
  /** 是否仅群管理员可操作 */
  admin?: boolean
  /** 有权限点击的用户UID列表 群聊、私聊 */
  list?: string[]
  /** 有权限点击的用户UID列表 频道 */
  role?: string[]
  /** 客户端不支持本 action 的时候，弹出的 toast 文案 */
  tips?: string
}

/** QQ官方按钮消息结构 */
export interface QQBotButton {
  /** 按钮ID：在一个keyboard消息内设置唯一 */
  id: string,
  /** 按钮上的文字 */
  render_data: {
    /** 按钮上的文字 */
    label: string,
    /** 点击后按钮的上文字 */
    visited_label: string,
    /**
     * 按钮样式
     * - 0-灰色线框
     * - 1-蓝色线框
     * - 2-特殊样式按钮
     * - 3-红色文字
     * - 4-白色填充
     */
    style: number
  },
  /** 操作相关的数据 */
  action: {
    /** 设置 0 跳转按钮：http 或 小程序 客户端识别 scheme，设置 1 回调按钮：回调后台接口, data 传给后台，设置 2 指令按钮：自动在输入框插入 @bot data */
    type: 0 | 1 | 2,
    /** 权限设置 */
    permission: {
      /** 0 指定用户可操作，1 仅管理者可操作，2 所有人可操作，3 指定身份组可操作（仅频道可用） */
      type: number,
      /** 有权限的用户 id 的列表 */
      specify_user_ids?: string[],
      /** 有权限的身份组 id 的列表（仅频道可用） */
      specify_role_ids?: string[]
    },
    /** 操作相关的数据 */
    data: string,
    /** 指令按钮可用，指令是否带引用回复本消息，默认 false */
    reply?: boolean,
    /** 指令按钮可用，点击按钮后直接自动发送 data，默认 false */
    enter?: boolean,
    /** 本字段仅在指令按钮下有效，设置后后会忽略 action.enter 配置。
    设置为 1 时 ，点击按钮自动唤起启手Q选图器，其他值暂无效果。
    （仅支持手机端版本 8983+ 的单聊场景，桌面端不支持） */
    anchor?: number,
    /** 【已弃用】可操作点击的次数，默认不限 */
    click_limit?: number,
    /** 【已弃用】指令按钮可用，弹出子频道选择器，默认 false */
    at_bot_show_channel_list?: boolean,
    /** 客户端不支持本action的时候，弹出的toast文案 */
    unsupport_tips: string
  }
}

export interface QQButtonTextType {
  link?: string
  text: string
  show: string
  style: number
  tips: string
  admin?: boolean
  list?: string[]
  role?: string[]
  enter?: boolean
  reply?: boolean
  callback?: boolean
}
