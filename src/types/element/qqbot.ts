/**
 * 原生Markdown消息结构
 */
export interface RawMarkdownType {
  /** markdown文本 */
  content: string
}

/**
 * 模板Markdown消息结构
 */
export interface TplMarkdownType {
  /**
  * - 模板ID
  */
  custom_template_id: string
  /**
   * - 模板参数
   */
  params: Array<{
    /**
     * - 模板参数键名称
     */
    key: string
    /**
     * - 模板参数值
     */
    values: Array<string>
  }>
}

/**
 * Markdown消息结构
 * @param T 是否为原生结构
 */
export type MarkdownType<T extends boolean> = T extends true ? RawMarkdownType : TplMarkdownType

/**
 * 原生keyboard消息结构
 */
export interface RawKeyboardType {
  content: {
    rows: Array<{ buttons: Array<ButtonType> }>
  }

}

/**
 * 模板keyboard消息结构
 */
export interface TplKeyboardType {
  /** 模板ID */
  id: string
}

/**
 * 按钮消息结构
 */
export interface ButtonType {
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
    type: number,
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

/**
 * Keyboard消息结构
 * @param T 是否为原生结构
 */
export type KeyboardType<T extends boolean> = T extends true ? RawKeyboardType : TplKeyboardType

/**
 * Ark消息结构
 */
export interface ArkType {
  /** 模版 id，管理端可获得或内邀申请获得 */
  template_id: number
  /** {key: xxx, value: xxx}，模版内变量与填充值的kv映射 */
  kv: Array<{
    obj_kv: Array<
      { key: string, value: string }
    >
  }>
}
