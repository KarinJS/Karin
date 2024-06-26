/**
 * - OneBot 11 标准事件
 */
export type PostType = 'message' | 'notice' | 'request' | 'meta_event' | 'message_sent'
/**
 * - 消息事件类型
 */
export type MessageType = 'private' | 'group'
/**
 * - 消息子类型
 */
export type MessageSubType = 'friend' | 'group' | 'other' | 'normal' | 'anonymous' | 'notice'
/**
 * - 通知事件类型
 */
export type NoticeType = 'group_upload' | 'group_admin' | 'group_decrease' | 'group_increase' | 'group_ban' | 'friend_add' | 'group_recall' | 'friend_recall' | 'notify' | 'group_msg_emoji_like'
/**
 * - 请求类型
 */
export type RequestType = 'friend' | 'group'

/**
 * - 消息事件映射
 */
export interface MessageToSubType {
  private: 'friend' | 'group' | 'other'
  group: 'normal' | 'anonymous' | 'notice'
}

/**
 * - 消息子类型映射
 */
export type MessageTypeToSubEvent<E extends MessageType> = E extends keyof MessageToSubType ? MessageToSubType[E] : never

/**
 * - 事件基类
 */
export interface OneBot11 {
  /**
   * - 事件发生的时间戳
   */
  time: number
  /**
   * - 事件类型
   */
  post_type: PostType
  /**
   * - 收到事件的机器人 QQ 号
   */
  self_id: string
}

/**
 * - 通知事件基类
 */
export interface OneBot11Notice extends OneBot11 {
  /**
   * - 事件类型
   */
  post_type: 'notice'
  /**
   * - 通知类型
   */
  notice_type: NoticeType
}

/**
 * - 群文件上传事件
 */
export interface OneBot11GroupUpload extends OneBot11Notice {
  /**
   * - 通知类型
   */
  notice_type: 'group_upload'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 发送者 QQ 号
   */
  user_id: string
  /**
   * - 文件信息
   */
  file: {
    /**
     * - 文件 ID
     */
    id: string
    /**
     * - 文件名
     */
    name: string
    /**
     * - 文件大小（字节数）
     */
    size: number
    /**
     * - busid（目前不清楚有什么作用）
     */
    busid: number
  }
}

/**
 * - 群管理员变动事件
 */
export interface OneBot11GroupAdmin extends OneBot11Notice {
  /**
   * - 通知类型
   */
  notice_type: 'group_admin'
  /**
   * - 事件子类型，分别表示设置和取消管理员
   */
  sub_type: 'set' | 'unset'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 管理员 QQ 号
   */
  user_id: string
}

/**
 * - 群减少事件
 */
export interface OneBot11GroupDecrease extends OneBot11Notice {
  /**
   * - 通知类型
   */
  notice_type: 'group_decrease'
  /**
   * - 事件子类型，分别表示主动退群、成员被踢、登录号被踢
   */
  sub_type: 'leave' | 'kick' | 'kick_me'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 操作者 QQ 号（如果是主动退群，则和 user_id 相同）
   */
  operator_id: string
  /**
   * - 离开者 QQ 号
   */
  user_id: string
}

/**
 * - 群增加事件
 */
export interface OneBot11GroupIncrease extends OneBot11Notice {
  /**
   * - 通知类型
   */
  notice_type: 'group_increase'
  /**
   * - 事件子类型，分别表示管理员已同意入群、管理员邀请入群
   */
  sub_type: 'approve' | 'invite'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 操作者 QQ 号
   */
  operator_id: string
  /**
   * - 加入者 QQ 号
   */
  user_id: string
}

/**
 * - 群禁言事件
 */
export interface OneBot11GroupBan extends OneBot11Notice {
  /**
   * - 通知类型
   */
  notice_type: 'group_ban'
  /**
   * - 事件子类型，分别表示禁言、解除禁言
   */
  sub_type: 'ban' | 'lift_ban'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 操作者 QQ 号
   */
  operator_id: string
  /**
   * - 被禁言 QQ 号
   */
  user_id: string
  /**
   * - 禁言时长，单位秒
   */
  duration: number
}

/**
 * - 新添加好友事件
 */
export interface OneBot11FriendAdd extends OneBot11Notice {
  /**
   * - 通知类型
   */
  notice_type: 'friend_add'
  /**
   * - 新添加好友 QQ 号
   */
  user_id: string
}

/**
 * - 群撤回事件
 */
export interface OneBot11GroupRecall extends OneBot11Notice {
  /**
   * - 通知类型
   */
  notice_type: 'group_recall'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 消息发送者 QQ 号
   */
  user_id: string
  /**
   * - 操作者 QQ 号
   */
  operator_id: string
  /**
   * - 被撤回的消息 ID
   */
  message_id: string
}

/**
 * - 好友消息撤回事件
 */
export interface OneBot11FriendRecall extends OneBot11Notice {
  /**
   * - 通知类型
   */
  notice_type: 'friend_recall'
  /**
   * - 好友 QQ 号
   */
  user_id: string
  /**
   * - 被撤回的消息 ID
   */
  message_id: string
}

/**
 * - 戳一戳事件
 */
export interface OneBot11Poke extends OneBot11Notice {
  /**
   * - 消息类型
   */
  notice_type: 'notify'
  /**
   * - 提示类型
   */
  sub_type: 'poke'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 发送者 QQ 号
   */
  user_id: string
  /**
   * - 被戳者 QQ 号
   */
  target_id: string
}

/**
 * - 运气王事件
 */
export interface OneBot11LuckyKing extends OneBot11Notice {
  /**
   * - 消息类型
   */
  notice_type: 'notify'
  /**
   * - 提示类型
   */
  sub_type: 'lucky_king'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 红包发送者 QQ 号
   */
  user_id: string
  /**
   * - 运气王 QQ 号
   */
  target_id: string
}

/**
 * - 荣誉变更事件
 */
export interface OneBot11Honor extends OneBot11Notice {
  /**
   * - 消息类型
   */
  notice_type: 'notify'
  /**
   * - 提示类型
   */
  sub_type: 'honor'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 荣誉类型，分别表示龙王、群聊之火、快乐源泉
   */
  honor_type: 'talkative' | 'performer' | 'emotion'
  /**
   * - 成员 QQ 号
   */
  user_id: string
}

/**
 * - 群表情回应事件
 */
export interface OneBot11GroupMessageReaction extends OneBot11Notice {
  /**
   * - 消息类型
   */
  notice_type: 'group_msg_emoji_like'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 发送者 QQ 号
   */
  user_id: string
  /**
   * - 消息 ID
   */
  message_id: string
  /**
   * - 表情信息 此处目前只有llob有
   */
  likes: Array<{
    count: number
    /**
     * - 表情ID参考: https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType
     */
    emoji_id: number
  }>
}

/**
 * - 请求事件基类
 */
export interface OneBot11Request extends OneBot11 {
  /**
   * - 事件发生的时间戳
   */
  time: number
  /**
   * - 事件类型
   */
  post_type: 'request'
  /**
   * - 收到事件的机器人 QQ 号
   */
  self_id: string
  /**
   * - 请求类型
   */
  request_type: 'friend' | 'group'
  /**
   * - 请求 flag，在调用处理请求的 API 时需要传入
   */
  flag: string
  /**
   * - 发送请求的 QQ 号
   */
  user_id: string
  /**
   * - 验证信息
   */
  comment: string
}

/**
 * - 好友请求事件
 */
export interface OneBot11FriendRequest extends OneBot11Request {
  /**
   * - 请求类型
   */
  request_type: 'friend'
}

/**
 * - 群请求事件
 */
export interface OneBot11GroupRequest extends OneBot11Request {
  /**
   * - 请求类型
   */
  request_type: 'group'
  /**
   * - 请求子类型，分别表示加群请求、邀请登录号入群
   */
  sub_type: 'add' | 'invite'
  /**
   * - 群号
   */
  group_id: string
}

/**
 * - 元事件基类
 */
export interface OneBot11MetaEvent extends OneBot11 {
  /**
   * - 事件类型
   */
  post_type: 'meta_event'
  /**
   * - 元事件类型
   */
  meta_event_type: 'lifecycle' | 'heartbeat'
}

/**
 * - 生命周期元事件
 */
export interface OneBot11Lifecycle extends OneBot11MetaEvent {
  /**
   * - 元事件类型
   */
  meta_event_type: 'lifecycle'
  /**
   * - 事件子类型，分别表示 OneBot 启用、停用、WebSocket 连接成功
   */
  sub_type: 'enable' | 'disable' | 'connect'
}

/**
 * - 心跳元事件
 */
export interface OneBot11Heartbeat extends OneBot11MetaEvent {
  /**
   * - 元事件类型
   */
  meta_event_type: 'heartbeat'
  /**
   * - 状态信息
   */
  status: {
    /**
     * - 到下次心跳的间隔，单位毫秒
     */
    interval: number
  }
}

/**
 * - OneBot11消息类型
 */
export type OneBot11SegmentType = 'text' | 'face' | 'image' | 'record' | 'video' | 'at' | 'rps' | 'dice' | 'shake' | 'poke' | 'anonymous' | 'share' | 'contact' | 'location' | 'music' | 'music_custom' | 'reply' | 'forward' | 'node' | 'node_custom' | 'xml' | 'json'

export interface Segment {
  type: OneBot11SegmentType
}

/**
 * - 纯文本
 */
export interface TextSegment extends Segment {
  type: 'text'
  data: {
    text: string
  }
}

/**
 * - QQ表情
 */
export interface FaceSegment extends Segment {
  type: 'face'
  data: {
    id: string
  }
}

/*
/**
 * - 图片消息段
 */
export interface ImageSegment extends Segment {
  type: 'image'
  data: {
    file: string
    type?: 'flash'
    url?: string
    cache?: 0 | 1
    proxy?: 0 | 1
    timeout?: number
  }
}

/**
 * - 语音消息段
 */
export interface RecordSegment extends Segment {
  type: 'record'
  data: {
    file: string
    magic?: 0 | 1
    url?: string
    cache?: 0 | 1
    proxy?: 0 | 1
    timeout?: number
  }
}

/**
 * - 短视频消息段
 */
export interface VideoSegment extends Segment {
  type: 'video'
  data: {
    file: string
    url?: string
    cache?: 0 | 1
    proxy?: 0 | 1
    timeout?: number
  }
}

/**
 * - @某人消息段
 */
export interface AtSegment extends Segment {
  type: 'at'
  data: {
    qq: string | 'all'
  }
}

/**
 * - 猜拳魔法表情消息段
 */
export interface RpsSegment extends Segment {
  type: 'rps'
  data: {}
}

/**
 * - 掷骰子魔法表情消息段
 */
export interface DiceSegment extends Segment {
  type: 'dice'
  data: {}
}

/**
 * - 窗口抖动（戳一戳）消息段
 */
export interface ShakeSegment extends Segment {
  type: 'shake'
  data: {}
}

/**
 * - 戳一戳消息段
 */
export interface PokeSegment extends Segment {
  type: 'poke'
  data: {
    type: string
    id: string
    name?: string
  }
}

/**
 * - 匿名发消息消息段
 */
export interface AnonymousSegment extends Segment {
  type: 'anonymous'
  data: {
    ignore?: 0 | 1
  }
}

/**
 * - 链接分享消息段
 */
export interface ShareSegment extends Segment {
  type: 'share'
  data: {
    url: string
    title: string
    content?: string
    image?: string
  }
}

/**
 * - 推荐好友/群消息段
 */
export interface ContactSegment extends Segment {
  type: 'contact'
  data: {
    type: 'qq' | 'group'
    id: string
  }
}

/**
 * - 位置消息段
 */
export interface LocationSegment extends Segment {
  type: 'location'
  data: {
    lat: string
    lon: string
    title?: string
    content?: string
  }
}

/**
 * - 音乐分享消息段
 */
export interface MusicSegment extends Segment {
  type: 'music'
  data: {
    type: 'qq' | '163' | 'xm'
    id: string
  }
}

/**
 * - 音乐自定义分享消息段
 */
export interface CustomMusicSegment extends Segment {
  type: 'music'
  data: {
    type: 'custom'
    url: string
    audio: string
    title: string
    content?: string
    image?: string
  }
}

/**
 * - 回复消息段
 */
export interface ReplySegment extends Segment {
  type: 'reply'
  data: {
    id: string
  }
}

/**
 * - 合并转发消息段
 */
export interface ForwardSegment extends Segment {
  type: 'forward'
  data: {
    id: string
  }
}

/**
 * - 合并转发节点消息段
 */
export interface NodeSegment extends Segment {
  type: 'node'
  data: {
    id: string
  }
}

/**
 * - 合并转发自定义节点消息段
 */
export interface CustomNodeSegment extends Segment {
  type: 'node'
  data: {
    user_id: string
    nickname: string
    content: string | Segment[]
  }
}

/**
 * - XML消息段
 */
export interface XmlSegment extends Segment {
  type: 'xml'
  data: {
    data: string
  }
}

/**
 * - JSON消息段
 */
export interface JsonSegment extends Segment {
  type: 'json'
  data: {
    data: string
  }
}

/**
 * - OneBot11消息段
 */
export type OneBot11Segment = TextSegment | FaceSegment | ImageSegment | RecordSegment | VideoSegment | AtSegment | RpsSegment | DiceSegment | ShakeSegment | PokeSegment | AnonymousSegment | ShareSegment | ContactSegment | LocationSegment | MusicSegment | CustomMusicSegment | ReplySegment | ForwardSegment | NodeSegment | CustomNodeSegment | XmlSegment | JsonSegment

/**
 * - 消息事件基类
 */
export interface OneBot11Message extends OneBot11 {
  /**
   * - 事件类型
   */
  post_type: 'message' | 'message_sent'
  /**
   * - 消息类型
   */
  message_type: MessageType
  /**
   * - 消息子类型
   */
  sub_type: MessageTypeToSubEvent<MessageType>
  /**
   * - 消息 ID
   */
  message_id: string
  /**
   * - 发送者 QQ 号
   */
  user_id: string
  /**
   * - 消息内容
   */
  message: OneBot11Segment[]
  /**
   * - 原始消息内容
   */
  raw_message: string
  /**
   * - 字体
   */
  font: number
  /**
   * - 发送人信息
   */
  sender: {
    /**
     * - 发送者 QQ 号
     */
    user_id: string
    /**
     * - 昵称 不存在则为空字符串
     */
    nickname: string
    /**
     * - 性别
     */
    sex?: 'male' | 'female' | 'unknown'
    /**
     * - 年龄
     */
    age?: number
  }
}

/**
 * - 私聊消息事件
 */
export interface OneBot11PrivateMessage extends OneBot11Message {
  /**
   * - 消息类型
   */
  message_type: 'private'
  /**
   * - 消息子类型
   */
  sub_type: 'friend'
}

/**
 * - 群消息事件
 */
export interface OneBot11GroupMessage extends OneBot11Message {
  /**
   * - 消息类型
   */
  message_type: 'group'
  /**
   * - 消息子类型
   */
  sub_type: 'normal' | 'anonymous' | 'notice'
  /**
   * - 群号
   */
  group_id: string
  /**
   * - 匿名信息
   */
  anonymous?: {
    /**
     * - 匿名用户 ID
     */
    id: string
    /**
     * - 匿名用户名称
     */
    name: string
    /**
     * - 匿名用户 flag，在调用禁言 API 时需要传入
     */
    flag: string
  }
  sender: {
    /**
     * - 发送者 QQ 号
     */
    user_id: string
    /**
     * - 昵称 不存在则为空字符串
     */
    nickname: string
    /**
     * - 性别
     */
    sex?: 'male' | 'female' | 'unknown'
    /**
     * - 年龄
     */
    age?: number
    /**
     * - 群名片/备注
     */
    card?: string
    /**
     * - 地区
     */
    area?: string
    /**
     * - 成员等级
     */
    level?: string
    /**
     * - 角色 不存在则为空字符串
     */
    role: 'owner' | 'admin' | 'member' | ''
    /**
     * - 专属头衔
     */
    title?: string
  }
}

/**
 * 所有事件
 */
export type OneBot11Event = OneBot11GroupMessage | OneBot11PrivateMessage | OneBot11GroupUpload | OneBot11GroupAdmin | OneBot11GroupDecrease | OneBot11GroupIncrease | OneBot11GroupBan | OneBot11FriendAdd | OneBot11GroupRecall | OneBot11FriendRecall | OneBot11Poke | OneBot11LuckyKing | OneBot11Honor | OneBot11FriendRequest | OneBot11GroupRequest | OneBot11Lifecycle | OneBot11Heartbeat | OneBot11GroupMessageReaction
/**
 * - 传入 post_type 返回对应的事件类型
 */
export type ByPostType<T extends PostType> = Extract<OneBot11Event, { post_type: T }>

/**
 * - OneBot11公开Api
 */
export type OneBot11Api = 'send_private_msg' | 'send_group_msg' | 'send_msg' | 'delete_msg' | 'get_msg' | 'get_forward_msg' | 'send_like' | 'set_group_kick' | 'set_group_ban' | 'set_group_anonymous_ban' | 'set_group_whole_ban' | 'set_group_admin' | 'set_group_anonymous' | 'set_group_card' | 'set_group_name' | 'set_group_leave' | 'set_group_special_title' | 'set_friend_add_request' | 'set_group_add_request' | 'get_login_info' | 'get_stranger_info' | 'get_friend_list' | 'get_group_info' | 'get_group_list' | 'get_group_member_info' | 'get_group_member_list' | 'get_group_honor_info' | 'get_cookies' | 'get_csrf_token' | 'get_credentials' | 'get_record' | 'get_image' | 'can_send_image' | 'can_send_record' | 'get_status' | 'get_version_info' | 'set_restart' | 'clean_cache' | 'get_version' | 'send_forward_msg' | 'get_friend_msg_history' | 'get_group_msg_history'

/**
 * - OneBot11公开Api参数 params
 */
export type OneBot11ApiParams = {
  /**
   * - 发送私聊消息
   */
  send_private_msg: {
    /**
     * - 对方 QQ 号
     */
    user_id: number
    /**
     * - 要发送的内容
     */
    message: string
    /**
     * - 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效
     */
    auto_escape?: boolean
  }
  /**
   * - 发送群消息
   */
  send_group_msg: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要发送的内容
     */
    message: string
    /**
     * - 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效
     */
    auto_escape?: boolean
  }
  /**
   * - 发送消息
   */
  send_msg: {
    /**
     * - 消息类型，可选值为 "private" 或 "group"
     */
    message_type?: 'private' | 'group'
    /**
     * - 对方 QQ 号，当消息类型为 "private" 时有效
     */
    user_id?: number
    /**
     * - 群号，当消息类型为 "group" 时有效
     */
    group_id?: number
    /**
     * - 要发送的内容
     */
    message: string
    /**
     * - 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效
     */
    auto_escape?: boolean
  }
  /**
   * - 撤回消息
   */
  delete_msg: {
    /**
     * - 消息 ID
     */
    message_id: number
  }
  /**
   * - 获取消息
   */
  get_msg: {
    /**
     * - 消息 ID
     */
    message_id: number
  }
  /**
   * - 获取转发消息
   */
  get_forward_msg: {
    /**
     * - 转发消息 ID
     */
    id: string
  }
  /**
   * - 发送好友赞
   */
  send_like: {
    /**
     * - 对方 QQ 号
     */
    user_id: number
    /**
     * - 赞的次数，每个赞为一个好友赞，每个用户每天最多赞 10 次
     */
    times?: number
  }
  /**
   * - 群组踢人
   */
  set_group_kick: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要踢的 QQ 号
     */
    user_id: number
    /**
     * - 拒绝此人的加群请求
     */
    reject_add_request?: boolean
  }
  /**
   * - 群组禁言
   */
  set_group_ban: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要禁言的 QQ 号
     */
    user_id: number
    /**
     * - 禁言时长，单位秒，0 表示取消禁言
     */
    duration?: number
  }
  /**
   * - 群组匿名用户禁言
   */
  set_group_anonymous_ban: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 匿名用户对象
     */
    anonymous?: object
    /**
     * - 匿名用户标识，使用匿名用户对象时此参数无效
     */
    anonymous_flag?: string
    /**
     * - 禁言时长，单位秒，无法取消匿名用户禁言
     */
    duration?: number
  }
  /**
   * - 群组全员禁言
   */
  set_group_whole_ban: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 是否禁言，true 为开启，false 为关闭
     */
    enable?: boolean
  }
  /**
   * - 设置群管理员
   */
  set_group_admin: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要设置管理员的 QQ 号
     */
    user_id: number
    /**
     * - 是否设置为管理员，true 为设置，false 为取消
     */
    enable?: boolean
  }
  /**
   * - 设置群匿名聊天
   */
  set_group_anonymous: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 是否允许匿名聊天，true 为开启，false 为关闭
     */
    enable?: boolean
  }
  /**
   * - 设置群名片（群备注）
   */
  set_group_card: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要设置的 QQ 号
     */
    user_id: number
    /**
     * - 名片内容，不填或空字符串表示删除群名片
     */
    card?: string
  }
  /**
   * - 设置群名
   */
  set_group_name: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 新群名
     */
    group_name: string
  }
  /**
   * - 退出群组
   */
  set_group_leave: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
     */
    is_dismiss?: boolean
  }
  /**
   * - 设置群成员专属头衔
   */
  set_group_special_title: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 要设置的 QQ 号
     */
    user_id: number
    /**
     * - 专属头衔，不填或空字符串表示删除专属头衔
     */
    special_title?: string
    /**
     * - 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果
     */
    duration?: number
  }
  /**
   * - 处理好友添加请求
   */
  set_friend_add_request: {
    /**
     * - 请求 flag，在调用处理请求的事件中返回
     */
    flag: string
    /**
     * - 是否同意请求
     */
    approve?: boolean
    /**
     * - 添加后的好友备注
     */
    remark?: string
  }
  /**
   * - 处理群添加请求／邀请
   */
  set_group_add_request: {
    /**
     * - 请求 flag，在调用处理请求的事件中返回
     */
    flag: string
    /**
     * - 请求子类型，add 或 invite，请求子类型为 invite 时为邀请
     */
    sub_type?: 'add' | 'invite'
    /**
     * - 是否同意请求／邀请
     */
    approve?: boolean
    /**
     * - 拒绝理由，仅在拒绝时有效
     */
    reason?: string
  }
  /**
   * - 获取登录号信息
   */
  get_login_info: {}
  /**
   * - 获取陌生人信息
   */
  get_stranger_info: {
    /**
     * - QQ 号
     */
    user_id: number
    /**
     * - 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存
     */
    no_cache?: boolean
  }
  /**
   * - 获取好友列表
   */
  get_friend_list: {}
  /**
   * - 获取群信息
   */
  get_group_info: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存
     */
    no_cache?: boolean
  }
  /**
   * - 获取群列表
   */
  get_group_list: {}
  /**
   * - 获取群成员信息
   */
  get_group_member_info: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - QQ 号
     */
    user_id: number
    /**
     * - 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存
     */
    no_cache?: boolean
  }
  /**
   * - 获取群成员列表
   */
  get_group_member_list: {
    /**
     * - 群号
     */
    group_id: number
  }
  /**
   * - 获取群荣誉信息
   */
  get_group_honor_info: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 荣誉类型，可选值为 "talkative"（龙王）、"performer"（群聊之火）、"legend"（群聊炽焰）、"strong_newbie"（新人王）、"emotion"（快乐源泉）、"all"（所有类型）
     */
    type: 'talkative' | 'performer' | 'legend' | 'strong_newbie' | 'emotion' | 'all'
  }
  /**
   * - 获取 Cookies
   */
  get_cookies: {
    /**
     * - 指定域名，不填或空字符串表示获取当前域名下的 Cookies
     */
    domain?: string
  }
  /**
   * - 获取 CSRF Token
   */
  get_csrf_token: {}
  /**
   * - 获取 QQ 相关接口凭证
   */
  get_credentials: {
    /**
     * - 指定域名，不填或空字符串表示获取当前域名下的凭证
     */
    domain?: string
  }
  /**
   * - 获取语音
   */
  get_record: {
    /**
     * - 文件路径
     */
    file: string
    /**
     * - 输出格式，可选值为 "amr"、"silk"、"mp3"、"wav"，默认为 "amr"
     */
    out_format: string
  }
  /**
   * - 获取图片
   */
  get_image: {
    /**
     * - 文件路径
     */
    file: string
  }
  /**
   * - 是否可以发送图片
   */
  can_send_image: {}
  /**
   * - 是否可以发送语音
   */
  can_send_record: {}
  /**
   * - 获取插件运行状态
   */
  get_status: {}
  /**
   * - 获取插件版本信息
   */
  get_version_info: {}
  /**
   * - 获取插件版本信息
   */
  get_version: {}
  /**
   * - 重启插件
   */
  set_restart: {
    /**
     * - 延迟重启时间，单位毫秒，不填或留空表示立即重启
     */
    delay?: number
  }
  /**
   * - 清理数据缓存
   */
  clean_cache: {}

  /**
   * - 发送合并转发消息
   */
  send_forward_msg: {
    /**
     * - 对方 QQ 号，当消息类型为 "private" 时有效
     */
    user_id?: number
    /**
     * - 群号，当消息类型为 "group" 时有效
     */
    group_id?: number
    /**
     * - 要发送的内容
     */
    messages: Array<{
      /**
       * - 消息段
       */
      message: OneBot11Segment[]
    }>
  }

  /**
   * - 获取好友历史消息记录
   */
  get_friend_msg_history: {
    /**
     * - 对方 QQ 号
     */
    user_id: number
    /**
     * - 起始消息序号
     */
    message_seq: number
    /**
     * - 消息数量
     */
    message_count: number
  }

  /**
   * - 获取群组历史消息记录
   */
  get_group_msg_history: {
    /**
     * - 群号
     */
    group_id: number
    /**
     * - 起始消息序号
     */
    message_seq: number
    /**
     * - 消息数量
     */
    message_count: number
  }
}

/**
 * - OneBot11公开Api与参数映射
 */
export type OneBot11ApiParamsType = {
  [K in OneBot11Api]: OneBot11ApiParams[K]
}
