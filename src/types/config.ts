export interface Redis {
  /**
   * 地址
   */
  host: string
  /**
   * 端口
   */
  port: number
  /**
   * 用户名
   */
  username: string
  /**
   * 密码
   */
  password: string
  /**
   * 数据库
   */
  db: number
}

export interface App {
  /**
   * 黑名单管理
   */
  BlackList: {
    /**
     * 黑名单用户
     */
    users: boolean
    /**
     * 黑名单群聊
     */
    groups: boolean
    /**
     * 消息日志黑名单群聊 设置后不会打印该群的消息日志
     */
    GroupMsgLog: boolean
  }
  /**
   * 白名单相关
   */
  WhiteList: {
    /**
     * 白名单用户
     */
    users: boolean
    /**
     * 白名单群聊
     */
    groups: boolean
    /**
     * 消息日志白名单群聊 设置后只会打印该群的消息日志
     */
    GroupMsgLog: boolean
  }
  /**
   * 群聊
   */
  GroupConfig: {
    /**
     * 群聊中所有消息冷却时间
     */
    GroupCD: boolean
    /**
     * 群聊中 每个人的消息冷却时间
     */
    GroupUserCD: boolean
    /**
     * 机器人响应模式
     */
    mode: boolean
    /**
     * 机器人前缀 设置后前缀+指令触发机器人
     */
    alias: boolean
    /**
     * 白名单插件、功能，只有在白名单中的插件、功能才会响应
     */
    enable: boolean
    /**
     * 黑名单插件、功能，黑名单中的插件、功能不会响应
     */
    disable: boolean
  }
}

export interface Config {
  /**
   * 日志等级
   */
  log_level: string
  /**
   * 日志保留天数
   */
  log_days_Keep: number
  /**
   * 控制台触发插件日志颜色
   */
  log_color: string
  /**
   * ffmpeg配置
   */
  ffmpeg_path: string
  ffprobe_path: string
  /**
   * 主人列表
   */
  master: string[]
  /**
   * 管理员列表
   */
  admin: string[]
  /**
   * 黑名单相关
   */
  BlackList: {
    /**
     * 黑名单用户
     */
    users: string[]
    /**
     * 黑名单群聊
     */
    groups: string[]
    /**
     * 消息日志黑名单群聊 设置后不会打印该群的消息日志
     */
    GroupMsgLog: string[]
  }
  /**
   * 白名单相关
   */
  WhiteList: {
    /**
     * 白名单用户
     */
    users: string[]
    /**
     * 白名单群聊
     */
    groups: string[]
    /**
     * 消息日志白名单群聊 设置后只会打印该群的消息日志
     */
    GroupMsgLog: string[]
  }
}

export interface Server {
  /**
   * 当前文件热更新是否重启http、grpc服务
   */
  HotUpdate: boolean
  /**
   * http 服务器配置
   */
  http: {
    /**
     * 监听地址
     */
    host: string
    /**
     * 监听端口
     */
    port: number
  }
  /**
   * grpc 服务器配置
   */
  grpc: {
    /**
     * 监听地址
     */
    host: string
    /**
     * 监听端口
     */
    timeout: number
  }
  /**
   * websocket 服务器配置
   */
  websocket: {
    /**
     * API请求超时时间 单位秒
     */
    timeout: number
    /**
     * websocket 渲染器地址 比如：ws://127.0.0.1:7005/ws/render
     */
    render: string[]
    /**
     * onebot11 正向WebSocket地址
     */
    OneBot11Host: string[]
    /**
     * onebot12 正向WebSocket地址
     */
    OneBot12Host: string[]
  }
  /**
   * HTTP渲染器配置
   */
  HttpRender: {
    /**
     * 是否开启http渲染
     */
    enable: boolean
    /**
     * karin端Api地址 公网 > 局域网 > 127
     */
    host: string
    /**
     * karin-puppeteer渲染器Api post接口请求地址
     */
    post: string
    /**
     * karin-puppeteer渲染器 post请求token
     */
    token: string
    /**
     * 请求的非html或非有效路径的返回内容 可以填http地址 例如：https://example.com
     */
    not_found: string
    /**
     * Wormhole代理地址 无公网环境的情况下使用
     */
    WormholeClient: string
  }
}

export interface Package {
  name: string
  version: string
  private: boolean
  author: string
  type: string
  imports: {
    [key: string]: string
  }
  main: string
  workspaces: string[]
  scripts: {
    [key: string]: string
  }
  dependencies: {
    [key: string]: string
  }
  devDependencies: {
    [key: string]: string
  }
  engines: {
    [key: string]: string
  }
}

export interface GroupCfg {
  /**
   * 群聊中所有消息冷却时间
   * @default 0
   */
  GroupCD: number
  /**
   * 群聊中 每个人的消息冷却时间
   * @default 0
   */
  GroupUserCD: number
  /**
   * 机器人响应模式
   * @default 0
   * @param {0} 0-所有
   * @param {1} 1-仅@机器人
   * @param {2} 2-仅回应主人
   * @param {3} 3-仅回应前缀
   * @param {4} 4-前缀或@机器人
   * @param {5} 5-主人无前缀，群员前缀或@机器人
   */
  mode: 0 | 1 | 2 | 3 | 4 | 5
  /**
   * 机器人前缀 设置后前缀+指令触发机器人
   */
  alias: string
  /**
   * 白名单插件、功能，只有在白名单中的插件、功能才会响应
   */
  enable: string[]
  /**
   * 黑名单插件、功能，黑名单中的插件、功能不会响应
   */
  disable: string[]
}
