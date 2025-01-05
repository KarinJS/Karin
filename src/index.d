declare module 'node-karin' {

  import chalk from 'chalk'
  import { Configuration, Logger as Logger$1 } from 'log4js'
  import { Level } from 'level'
  import { RedisClientOptions, RedisClientType } from 'redis'
  import schedule from 'node-schedule'
  import fs$1 from 'node:fs'
  import { Readable } from 'node:stream'
  import { AxiosRequestConfig, AxiosResponse } from 'axios'
  import YAML from 'yaml'
  import { FSWatcher } from 'chokidar'
  import { Request as Request$2, Express } from 'express'
  import { exec as exec$1, ExecException } from 'child_process'
  import { ExecException as ExecException$1 } from 'node:child_process'
  import { WebSocketServer } from 'ws'
  import * as http from 'http'

  /**
 * 执行 shell 命令返回类型
 */
  interface ExecType {
    status: boolean
    error: ExecException | null
    stderr: string
    stdout: string
  }
  /**
   * 执行 shell 命令返回类型泛型
   */
  type ExecReturn<K extends boolean> = K extends true ? boolean : ExecType
  /**
   * 执行 shell 命令参数
   */
  type ExecOptions<T extends boolean> = Parameters<typeof exec$1>[1] & {
    /** 是否打印日志 默认不打印 */
    log?: boolean
    /** 是否只返回布尔值 表示命令是否成功执行 优先级比抛错误高 */
    booleanResult?: T
  }

  /** `pm2.yaml` 类型 */
  interface PM2 {
    /** 日志最多显示多少行 */
    lines: number
    /** pm2配置 */
    apps: Array<{
      /** 应用名称 */
      name: string
      /** 入口文件 */
      script: string
      /** 自动重启 */
      autorestart: boolean
      /** 重启次数 */
      max_restarts: number
      /** 最大重启次数 */
      max_memory_restart: string
      /** 重启延迟 */
      restart_delay: number
      /** 合并日志 */
      merge_logs: boolean
      /** 错误日志 */
      error_file: string
      /** 输出日志 */
      out_file: string
    }>
  }

  /**
   * `redis.yaml` 类型
   */
  type Redis = RedisClientOptions

  /**
   * `config.yaml` 类型
   */
  interface Config {
    /** log4js 配置 */
    log4jsCfg: {
      /** 日志等级 */
      level: LoggerLevel
      /** 日志保留天数 */
      daysToKeep: number
      /** 整体化: 将日志输出到一个文件(一天为一个文件) 日志较多的情况下不建议与碎片化同时开启 */
      overall: boolean
      /** 碎片化: 将日志分片，达到指定大小后自动切割 日志较多的情况下不建议与整体化同时开启 */
      fragments: boolean
      /** 碎片化每个日志文件最大大小 MB */
      maxLogSize: number
      /** # logger.fnc颜色 不支持热更新 */
      logColor: string
    }
    /** 重启是否调用pm2 如果不调用则会直接关机 此配置适合有进程守护的程序 */
    pm2Restart: boolean
    /** 私聊设置 频道和好友共享此配置 */
    private: {
      /** 是否开启私聊 */
      enable: boolean
      /** 关闭私聊后回复的提示词 为空则不回复 */
      tips: string
      /** 关闭私聊后的用户白名单 */
      disable: string[]
    }
    /** ffmpeg路径 */
    ffmpegPath: string
    /** ffprobe路径 */
    ffprobePath: string
    /** ffplay路径 */
    ffplayPath: string
    /** Bot主人列表 主权限 */
    master: string[]
    /** Bot管理列表 子权限 */
    admin: string[]
    /** 黑名单相关 */
    disable: {
      /** 黑名单用户 */
      users: string[]
      /** 黑名单群聊 */
      groups: string[]
      /** 黑名单频道 */
      guilds: string[]
      /** 黑名单子频道 */
      channels: string[]
      /** 黑名单频道私聊 禁用指定来源频道的私聊 */
      directs: string[]
      /** 消息日志黑名单群聊 设置后不会打印指定群的消息日志 */
      groupLog: string[]
      /** 消息日志黑名单频道 设置后不会打印指定频道的消息日志 */
      guildLog: string[]
      /** 消息日志黑名单子频道 设置后不会打印指定子频道的消息日志 */
      channelLog: string[]
    }
    /** 白名单相关 */
    enable: {
      /** 白名单用户 */
      users: string[]
      /** 白名单群聊 */
      groups: string[]
      /** 白名单频道 */
      guilds: string[]
      /** 白名单子频道 */
      channels: string[]
      /** 白名单频道私聊 仅允许指定来源频道的私聊 */
      directs: string[]
      /** 消息日志白名单群聊 设置后只会打印指定群的消息日志 */
      groupLog: string[]
      /** 消息日志白名单频道 设置后只会打印指定频道的消息日志 */
      guildLog: string[]
      /** 消息日志白名单子频道 设置后只会打印指定子频道的消息日志 */
      channelLog: string[]
    }
  }

  /** `server.yaml`类型 */
  interface Server {
    /** 当前文件热更新是否重启http服务 */
    hmrToServer: boolean
    /** http监听地址 */
    host: string
    /** http端口 */
    port: number
    /** 鉴权秘钥 */
    authKey: string
    /** ws api请求超时时间 秒 */
    timeout: number
    /** 反向ws鉴权秘钥 */
    reverseWsToken: string
    /** onebot11 正向WebSocket地址 */
    forwardWs: Array<string | {
      url: string
      token: string
    }>
    /** websocket 渲染器地址 ws://127.0.0.1:7005/ws/render */
    renderWs: Array<{
      url: string
      token: string
    }>
    /** http渲染器地址 */
    renderHttp: Array<{
      url: string
      token: string
    }>
    /** http根理由随机返回的文案列表 */
    rootMsg: string[]
    /** onebot http配置 */
    onebotHttp: Array<{
      /** 机器人ID */
      selfId: string
      /** api地址 */
      api: string
      /** 鉴权token */
      token: string
    }>
    /** console控制台适配器配置 */
    console: {
      /** 只允许本地访问 */
      isLocal: boolean
      /** 如果 isLocal 为 false 则需要配置 token */
      token: string
      /** 自定义host */
      host: string
    }
  }

  /**
   * `groupGuild.yaml` 类型
   */
  interface GroupGuild {
    /** 群聊、频道中所有消息冷却时间，单位秒，0则无限制 */
    cd: number
    /** 群聊、频道中 每个人的消息冷却时间，单位秒，0则无限制。注意，开启后所有消息都会进CD，无论是否触发插件。 */
    userCD: number
    /** 机器人响应模式，0-所有 1-仅@机器人 2-仅回应管理员 3-仅回应别名 4-别名或@机器人 5-管理员无限制，成员别名或@机器人 6-仅回应主人 */
    mode: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** 机器人别名 设置后别名+指令触发机器人 */
    alias: string[]
    /** 白名单插件、功能，只有在白名单中的插件、功能才会响应 `karin-plugin-test:app.js` `karin-plugin-test:测试转发` */
    enable: string[]
    /** 黑名单插件、功能，黑名单中的插件、功能不会响应 `karin-plugin-test:app.js` `karin-plugin-test:测试转发` */
    disable: string[]
    /** 群、频道成员单独黑名单 */
    memberDisable: string[]
    /** 群、频道成员单独白名单 */
    memberEnable: string[]
    /** 配置键: `Bot:selfId:groupId` */
    get key (): string
  }

  /**
   * `friendDirect.yaml` 类型
   */
  interface FriendDirect {
    /** 好友消息冷却时间，单位秒，0则无限制 */
    cd: number
    /** 机器人响应模式，0-所有 2-仅回应管理员 3-仅回应别名 5-管理员无限制，非管理员别名 6-仅回应主人 */
    mode: 0 | 2 | 3 | 5 | 6
    /** 机器人别名 设置后别名+指令触发机器人 */
    alias: string[]
    /** 白名单插件、功能，只有在白名单中的插件、功能才会响应 `karin-plugin-test:app.js` `karin-plugin-test:测试转发` */
    enable: string[]
    /** 黑名单插件、功能，黑名单中的插件、功能不会响应 `karin-plugin-test:app.js` `karin-plugin-test:测试转发` */
    disable: string[]
    /** 配置键 `Bot:selfId:userId` */
    get key (): string
  }

  /** ConfigEnum与返回值映射 用于泛型 */
  interface ConfigMap {
    /** `config.yaml` */
    config: Config
    /** `friendDirect.yaml` */
    friendDirect: Record<string, FriendDirect>
    /** `groupGuild.yaml` */
    groupGuild: Record<string, GroupGuild>
    /** `pm2.yaml` */
    pm2: PM2
    /** `redis.yaml` */
    redis: Redis
    /** `server.yaml` */
    server: Server
  }

  /**
   * `package.json` 类型
   */
  interface Package {
    /** 包名 */
    name: string
    /** 版本 */
    version: string
    /** 是否私有 */
    private: boolean
    /** 描述 */
    description: string
    /** 主页 */
    homepage: string
    /** bug地址 */
    bugs: {
      /** bug地址 */
      url: string
    }
    /** 仓库 */
    repository: {
      /** 仓库类型 */
      type: string
      /** 仓库地址 */
      url: string
    }
    /** 开源协议 */
    license: string
    /** 作者 */
    author: string
    /** 语法环境 */
    type: 'module'
    /** 导出 */
    exports: Record<string, {
      /** 导入 */
      import: string
      /** require */
      require: string
      /** 类型 */
      types: string
    }>
    /** 入口文件 */
    main: string
    /** 类型文件 */
    types: string
    /** bin */
    bin: Record<string, string>
    /** npm文件 */
    files: string[]
    /** 工作区 */
    workspaces: string[]
    /** 脚本 */
    scripts: Record<string, string>
    /** 依赖 */
    dependencies: Record<string, string>
    /** 开发依赖 */
    devDependencies: Record<string, string>
    /** peer依赖 */
    peerDependencies: Record<string, string>
    /** 引擎 */
    engines: Record<string, string>
    /** 发布配置 */
    publishConfig: {
      /** 访问 */
      access: string
      /** 注册 */
      registry: string
    }
  }

  /**
   * 日志等级
   * - `all`：所有日志
   * - `trace`：追踪
   * - `debug`：调试
   * - `mark`：标记
   * - `info`：信息
   * - `warn`：警告
   * - `error`：错误
   * - `fatal`：致命
   * - `off`：关闭
   */
  type LoggerLevel = 'all' | 'trace' | 'debug' | 'mark' | 'info' | 'warn' | 'error' | 'fatal' | 'off'
  /**
   * 创建日志模块配置
   */
  type LoggerOptions = {
    config?: Configuration
    log4jsCfg?: Config['log4jsCfg']
  }
  /**
   * 拓展日志模块
   */
  interface LoggerExpand {
    /**
     * 颜色模块
     */
    chalk: typeof chalk
    /**
     * 构建红色文本
     * @param text - 文本
     */
    red: (text: string) => string
    /**
     * 构建绿色文本
     * @param text - 文本
     */
    green: (text: string) => string
    /**
     * 构建黄色文本
     * @param text - 文本
     */
    yellow: (text: string) => string
    /**
     * 构建蓝色文本
     * @param text - 文本
     */
    blue: (text: string) => string
    /**
     * 构建品红色文本
     * @param text - 文本
     */
    magenta: (text: string) => string
    /**
     * 构建青色文本
     * @param text - 文本
     */
    cyan: (text: string) => string
    /**
     * 构建白色文本
     * @param text - 文本
     */
    white: (text: string) => string
    /**
     * 构建灰色文本
     * @param text - 文本
     */
    gray: (text: string) => string
    /**
     * 构建紫色文本
     * @param text - 文本
     */
    violet: (text: string) => string
    /**
     * 构建函数文本
     * @param text - 文本
     */
    fnc: (text: string) => string
    /**
     * 专属Bot前缀日志模块
     * @param level 等级
     * @param id 机器人ID
     * @param args 参数
     */
    bot: (level: LoggerLevel, id: string, ...args: any[]) => void
  }
  /**
   * 日志模块
   */
  type Logger = Logger$1 & LoggerExpand

  /**
   * 事件来源
   * - group: 群聊
   * - friend: 好友聊天
   * - guild: 频道
   * - direct: 频道私信
   * - groupTemp: 临时群会话
   */
  type Scene = 'group' | 'friend' | 'guild' | 'direct' | 'groupTemp'
  /**
   * 事件来源类型基类
   */
  interface BaseContact {
    /** 事件来源 */
    scene: Scene
    /** 事件来源id */
    peer: string
    /** 事件来源子id 仅在频道、频道私信和临时会话中存在 */
    subPeer?: string
    /** 来源场景的昵称 */
    name: string
    /** 来源场景的子昵称 */
    subName?: string
  }
  /**
   * 群聊来源信息类型
   */
  interface GroupContact extends BaseContact {
    scene: 'group'
    /** 群ID */
    peer: string
    /** 群名 */
    name: string
  }
  /**
   * 好友来源信息类型
   */
  interface FriendContact extends BaseContact {
    scene: 'friend'
    /** 好友ID */
    peer: string
    /** 好友昵称 */
    name: string
  }
  /**
   * 频道私信来源信息类型
   */
  interface DirectContact extends BaseContact {
    scene: 'direct'
    /** 频道ID 虚拟ID 用于请求Api使用 */
    peer: string
    /** 子频道ID 虚拟ID */
    subPeer: string
    /** 频道名称 */
    name: string
    /** 子频道名称 */
    subName?: string
    /** 来源频道ID */
    srcGuildId: string
  }
  /**
   * 频道来源信息类型
   */
  interface GuildContact extends BaseContact {
    scene: 'guild'
    /** 频道ID */
    peer: string
    /** 频道名称 */
    name: string
    /** 子频道ID */
    subPeer: string
    /** 子频道名称 */
    subName: string
  }
  /**
   * 群临时会话来源信息类型
   */
  interface GroupTempContact extends BaseContact {
    scene: 'groupTemp'
    /** 群ID */
    peer: string
    /** 发起临时会话用户ID */
    subPeer: string
    /** 群名 */
    name: string
  }
  /**
   * 事件来源信息
   * - `group`: 群聊
   * - `friend`: 好友
   * - `guild`: 频道
   * - `direct`: 频道私信
   * - `groupTemp`: 临时群会话
   */
  type Contact<T extends Scene = Scene> = T extends 'group' ? GroupContact : T extends 'friend' ? FriendContact : T extends 'guild' ? GuildContact : T extends 'direct' ? DirectContact : T extends 'groupTemp' ? GroupTempContact : never

  /**
   * 事件发送者性别
   * - `male` 男
   * - `female` 女
   * - `unknown` 未知
   */
  type Sex = 'male' | 'female' | 'unknown'
  /**
   * 事件发送者身份 仅在群聊、频道中存在
   * - `owner` 群主、频道主
   * - `admin` 管理员、超管
   * - `member` 群成员、频道成员
   * - `unknown` 未知身份
   */
  type Role = 'owner' | 'admin' | 'member' | 'unknown'
  /**
   * 事件发送者信息父类
   */
  interface SenderBase {
    /** 发送者ID */
    userId: string
    /** 发送者昵称 与`name`一致 */
    nick: string
    /** 发送者昵称 与`nick`一致 */
    name: string
    /** 发送者性别 */
    sex?: Sex
    /** 发送者年龄 */
    age?: number
    /** 发送者uid QQ场景专属 */
    uid?: string
    /** 发送者uin QQ场景专属 */
    uin?: number
  }
  /**
   * - 好友事件发送者信息
   * - tips: 如果名称不存在则是空字符串
   */
  type FriendSender$1 = SenderBase
  /**
   * - 群聊事件发送者信息
   * - tips: 如果名称不存在则是空字符串
   */
  interface GroupSender$1 extends SenderBase {
    /** 群成员身份 */
    role: Role
    /** 群名片/备注 */
    card?: string
    /** 地区 */
    area?: string
    /** 成员等级 */
    level?: number
    /** 专属头衔 */
    title?: string
  }
  /**
   * - 群聊临时会话事件发送者信息
   * - tips: 如果名称不存在则是空字符串
   */
  type GroupTempSender = SenderBase
  /**
   * - 频道事件发送者信息
   * - tips: 如果名称不存在则是空字符串
   */
  interface GuildSender extends SenderBase {
    /** 频道成员身份 */
    role: Role
  }
  /**
   * - 频道私信事件发送者信息
   * - tips: 如果名称不存在则是空字符串
   */
  type DirectSender = SenderBase
  /**
   * 事件发送者信息
   * - `friend`: 好友
   * - `group`: 群聊
   * - `guild`: 频道
   * - `direct`: 频道私信
   * - `groupTemp`: 临时群会话
   * - `notice`: 通知
   * - `request`: 请求
   */
  type Sender<T extends Scene = Scene> = T extends 'friend' ? FriendSender$1 : T extends 'group' ? GroupSender$1 : T extends 'guild' ? GuildSender : T extends 'direct' ? DirectSender : T extends 'groupTemp' ? GroupTempSender : never

  /**
   * 适配器所属平台
   * - `qq`: QQ
   * - `wechat`: 微信
   * - `telegram`: Telegram
   * - `discord`: Discord
   * - `koko`: 开黑吧
   * - `other`: 其他
   */
  type AdapterPlatform = 'qq' | 'wechat' | 'telegram' | 'discord' | 'koko' | 'other'
  /**
   * 适配器所使用的标准接口协议
   * - `onebot11`: OneBot v11 标准
   * - `onebot12`: OneBot v12 标准
   * - `oicq`: OICQ 标准
   * - `icqq`: OICQ fork 标准
   * - `other`: 其他标准
   */
  type AdapterStandard = 'onebot11' | 'onebot12' | 'oicq' | 'icqq' | 'other'
  /**
   * 适配器协议实现名称
   * - `console`: 控制台
   * - `qqbot`: https://bot.q.qq.com/wiki
   * - `icqq`: https://github.com/icqqjs/icqq
   * - `gocq-http`: https://docs.go-cqhttp.org/
   * - `napcat`: https://napneko.github.io/zh-CN/
   * - `oicq`: https://github.com/takayama-lily/oicq
   * - `llonebot`: https://llonebot.github.io/zh-CN/
   * - `conwechat`: https://justundertaker.github.io/ComWeChatBotClient/
   * - `lagrange`: https://lagrangedev.github.io/Lagrange.Doc/Lagrange.OneBot/
   */
  type AdapterProtocol = 'qqbot' | 'icqq' | 'gocq-http' | 'napcat' | 'oicq' | 'llonebot' | 'conwechat' | 'lagrange' | 'console'
  /**
   * 适配器通信方式
   * - `http`: HTTP 通信
   * - `webSocketServer`: WebSocket 服务端
   * - `webSocketClient`: WebSocket 客户端
   * - `grpc`: gRPC 通信
   * - `other`: 其他通信方式
   */
  type AdapterCommunication = 'http' | 'webSocketServer' | 'webSocketClient' | 'grpc' | 'other'
  /**
   * 适配器基本信息
   */
  interface AdapterInfo {
    /** 适配器索引 默认为-1 在注册适配器时会自动更改为对应的索引 */
    index: number
    /** 适配器名称 如lagrange-onebot */
    name: string
    /** 适配器版本 */
    version: string
    /** 适配器平台 */
    platform: AdapterPlatform
    /** 适配器使用的协议标准 如onebot11 */
    standard: AdapterStandard
    /** 适配器协议实现 如gocq、napcat */
    protocol: AdapterProtocol
    /** 适配器通信方式 */
    communication: AdapterCommunication
    /**
     * 适配器通信地址
     * @example `http://127.0.0.1:7000`
     * @example `ws://127.0.0.1:7000/ws`
     * @example `grpc://127.0.0.1:7001`
     * @example `internal://127.0.0.1`
     */
    address: string
    /** 连接时间 */
    connectTime: number
    /** 鉴权秘钥 */
    secret: string | null
  }

  /**
   * 适配器账号信息
   */
  interface AccountInfo {
    /** Bot的uin */
    uin: string
    /** Bot的uid */
    uid: string
    /** Bot的selfId 一般使用此参数即可 */
    selfId: string
    /** 账号名 不存在则是空字符串 */
    name: string
    /** Bot的头像链接 */
    avatar: string
    /**
     * - Bot的子账号键值对
     * - 结构约定: key=场景 value=id
     * - 此部分由适配器自行实现
     * @example
     * ```json
     * {
     *   "group": "123456",
     *   "guild": "123456",
     *   "friend": "123456",
     *   "direct": "123456"
     * }
     * ```
     */
    subId: Record<string, string>
  }

  /** 按钮结构 */
  interface KarinButton$1 {
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

  /**
   * @description 消息段类型
   * - `text`: 文本
   * - `image`: 图片
   * - `at`: @
   * - `face`: 表情
   * - `reply`: 引用回复
   * - `video`: 视频
   * - `record`: 语音
   * - `music`: 音乐
   * - `json`: JSON
   * - `xml`: XML
   * - `markdown`: Markdown
   * - `markdownTpl`: Markdown模板
   * - `pasmsg`: 被动消息
   * - `keyboard`: 多维按钮
   * - `button`: 单行按钮
   * - `longMsg`: 长消息
   * - `raw`: 原始消息
   * - `basketball`: 篮球
   * - `dice`: 骰子
   * - `rps`: 猜拳
   * - `bubbleFace`: 气泡表情
   * - `weather`: 天气
   * - `location`: 位置
   * - `share`: 分享
   * - `gift`: 礼物
   * - `marketFace`: 商城表情
   * - `contact`: 联系人
   */
  type messageType = 'text' | 'image' | 'at' | 'face' | 'reply' | 'video' | 'record' | 'music' | 'json' | 'xml' | 'markdown' | 'markdownTpl' | 'pasmsg' | 'keyboard' | 'button' | 'longMsg' | 'raw' | 'basketball' | 'dice' | 'rps' | 'bubbleFace' | 'weather' | 'location' | 'share' | 'gift' | 'marketFace' | 'contact' | 'node'
  interface Element$1 {
    /** 消息段类型 */
    type: messageType
  }
  /** 文本元素 */
  interface TextElement extends Element$1 {
    type: 'text'
    /** 文本内容 */
    text: string
  }
  /** At元素 */
  interface AtElement extends Element$1 {
    type: 'at'
    /** 目标id atall=all at在线成员=online */
    targetId: string
    /** At的名称 */
    name?: string
  }
  /** 表情元素 */
  interface FaceElement extends Element$1 {
    type: 'face'
    /** 表情ID */
    id: number
    /** 是否大表情，默认不是 */
    isBig?: boolean
  }
  /** 回复元素 */
  interface ReplyElement extends Element$1 {
    type: 'reply'
    /** 回复的消息ID */
    messageId: string
  }
  /** 图片元素 */
  interface ImageElement extends Element$1 {
    type: 'image'
    /** 图片url、路径或者base64 */
    file: string
    /** fid */
    fid?: string
    /** 图片名称 */
    name?: string
    /** 图片外显名称 */
    summary?: string
    /** 图片MD5 */
    md5?: string
    /** 图片宽度 */
    width?: number
    /** 图片高度 */
    height?: number
    /** 图片子类型 */
    subType?: string
    /**
     * show: 展示图片
     * flash: 闪照
     * original: 原图
     */
    fileType?: 'show' | 'flash' | 'original'
  }
  /** 视频元素 */
  interface VideoElement extends Element$1 {
    type: 'video'
    /** 视频url、路径或者base64 */
    file: string
    /** fid */
    fid?: string
    /** 视频名称 */
    name?: string
    /** 视频MD5 */
    md5?: string
    /** 视频宽度 */
    width?: number
    /** 视频高度 */
    height?: number
  }
  /** 语音元素 */
  interface RecordElement extends Element$1 {
    type: 'record'
    /** 语音文件url、路径或者base64 */
    file: string
    /** fid */
    fid?: string
    /** 是否为魔法语音 */
    magic: boolean
    /** 语音md5 */
    md5?: string
    /** 语音名称 */
    name?: string
  }
  /** 常规音乐 */
  interface ReadyMusicElement extends Element$1 {
    type: 'music'
    /** 音乐平台 */
    platform: 'qq' | '163' | 'migu' | 'kugou' | 'kuwo'
    /** 歌曲ID */
    id: string
  }
  /** 自定义音乐元素 */
  interface CustomMusicElement extends Element$1 {
    type: 'music'
    /** 音乐平台 */
    platform: 'custom'
    /** 跳转链接 */
    url: string
    /** 音乐音频链接 */
    audio: string
    /** 标题 */
    title: string
    /** 歌手 */
    author: string
    /** 封面 */
    pic: string
  }
  /** 音乐元素 */
  type MusicElement = CustomMusicElement | ReadyMusicElement
  /** JSON元素 */
  interface JsonElement extends Element$1 {
    type: 'json'
    /** JSON内容 未反序 */
    data: string
  }
  /** XML元素 */
  interface XmlElement extends Element$1 {
    type: 'xml'
    /** XML内容 未反序 */
    data: string
  }
  /** Markdown元素 */
  interface MarkdownElement extends Element$1 {
    type: 'markdown'
    /** Markdown内容 */
    markdown: string
    config?: {
      /** 未知的参数 */
      unknown?: number
      time: number
      token: string
    }
  }
  /** Markdown模板元素 */
  interface MarkdownTplElement extends Element$1 {
    type: 'markdownTpl'
    /** 模板ID */
    templateId: string
    /** 模板参数 */
    params: Array<{
      /** 模板参数键名称 */
      key: string
      /** 模板参数值 */
      values: Array<string>
    }>
  }
  /** 被动事件元素 */
  interface PasmsgElement extends Element$1 {
    type: 'pasmsg'
    /** 事件id来源 */
    source: 'msg' | 'event'
    /** 被动事件ID */
    id: string
  }
  /** 多行按钮 */
  interface KeyboardElement extends Element$1 {
    type: 'keyboard'
    /** 按钮行数组 */
    rows: KarinButton$1[][]
  }
  /** 单行按钮 */
  interface ButtonElement extends Element$1 {
    type: 'button'
    /** 按钮数组 */
    data: KarinButton$1[]
  }
  /** 长消息元素 */
  interface LongMsgElement extends Element$1 {
    type: 'longMsg'
    /** 消息ID */
    id: string
  }
  /** 原始元素 */
  interface RawElement extends Element$1 {
    type: 'raw'
    /** 原始数据 */
    data: any
  }
  /** 篮球元素 */
  interface BasketballElement extends Element$1 {
    type: 'basketball'
    /** 篮球ID */
    id: number
  }
  /** 骰子元素 */
  interface DiceElement extends Element$1 {
    type: 'dice'
    /** 骰子ID */
    id: number
  }
  /** 猜拳元素 */
  interface RpsElement extends Element$1 {
    type: 'rps'
    /** 猜拳ID */
    id: number
  }
  /** 弹射表情元素 */
  interface BubbleFaceElement extends Element$1 {
    type: 'bubbleFace'
    /** 表情ID */
    id: number
    /** 表情数量 */
    count: number
  }
  /** 天气元素 */
  interface WeatherElement extends Element$1 {
    type: 'weather'
    /** 城市名称 */
    city: string
    /** 城市代码 */
    code: string
  }
  /** 位置元素 */
  interface LocationElement extends Element$1 {
    type: 'location'
    /** 纬度 */
    lat: number
    /** 经度 */
    lon: number
    /** 标题 */
    title: string
    /** 地址 */
    address: string
  }
  /** 分享元素 */
  interface ShareElement extends Element$1 {
    type: 'share'
    /** 分享链接 */
    url: string
    /** 分享标题 */
    title: string
    /** 分享内容 */
    content: string
    /** 分享图片 */
    image: string
  }
  /** 礼物元素 */
  interface GiftElement extends Element$1 {
    type: 'gift'
    /** QQ 号 */
    qq: number
    /** 礼物ID */
    id: number
  }
  /** 商城表情元素 */
  interface MarketFaceElement extends Element$1 {
    type: 'marketFace'
    /** 表情ID */
    id: string
  }
  /** 分享名片元素 */
  interface ContactElement extends Element$1 {
    type: 'contact'
    /** 分享类型 */
    scene: 'group' | 'friend'
    /** 被推荐人的QQ号或者被推荐群的群号 */
    peer: string
  }
  /**
   * 全部消息段元素
   */
  type Elements = TextElement | AtElement | FaceElement | ReplyElement | ImageElement | VideoElement | RecordElement | MusicElement | JsonElement | XmlElement | MarkdownElement | MarkdownTplElement | PasmsgElement | KeyboardElement | ButtonElement | LongMsgElement | RawElement | BasketballElement | DiceElement | RpsElement | BubbleFaceElement | WeatherElement | LocationElement | ShareElement | GiftElement | MarketFaceElement | ContactElement
  /**
   * 发送消息段类型
   */
  type SendMessage = string | Elements | Array<string | Elements>

  interface Element {
    type: 'node'
    /** 节点类型 */
    subType: 'messageID' | 'fake'
  }
  /** 合并转发接口外显参数 */
  interface ForwardOptions {
    /** 小卡片中间的外显 */
    news: Array<{
      text: string
    }>
    /** qwqa说这个叫不懂 消息列表的外显 */
    prompt: string
    /** 小卡片底下文本: 查看1条转发消息 */
    summary: string
    /** 小卡片标题 */
    source: string
  }
  /** 常规合并转发节点 */
  interface DirectNodeElement extends Element {
    subType: 'messageID'
    /** 消息ID */
    messageId: string
    /** @deprecated 即将废弃 请使用 `messageId` */
    message_id: string
  }
  /** 自定义节点 */
  interface CustomNodeElement extends Element {
    subType: 'fake'
    /** 目标ID */
    userId: string
    /** 目标名称 */
    nickname: string
    /** 转发的元素节点 */
    message: Array<SendElement>
    /** 外显设置 */
    options?: ForwardOptions
  }
  /** 合并转发节点消息段 */
  type NodeElement = DirectNodeElement | CustomNodeElement
  /** 合并转发节点消息段 */
  type SendElement = NodeElement | Elements

  /** 发送消息后的通用返回值 */
  interface SendMsgResults {
    /** 消息ID */
    messageId: string
    /** 消息发送时间戳 */
    time: number
    /** 原始结果 一般是Object、Array */
    rawData: any
    /** @deprecated 已废弃 请使用 `messageId` */
    message_id: string
    /** @deprecated 已废弃 请使用 `time` */
    messageTime: number
  }
  /** 基本消息Api返回值结构 */
  interface MessageResponse {
    /** 消息发送时间 */
    time: number
    /** 消息ID */
    messageId: string
    /** 消息序列号 */
    messageSeq: number
    /** 消息来源目标信息 */
    contact: Contact
    /** 消息发送者 */
    sender: GroupSender$1
    /** 消息元素 */
    elements: Array<Elements>
  }
  /** 获取精华消息返回值结构 */
  interface GetGroupHighlightsResponse {
    /** 群ID */
    groupId: string
    /** 消息发送者ID */
    senderId: string
    /** 发送者昵称 */
    senderName: string
    /** 操作者ID */
    operatorId: string
    /** 操作者昵称 */
    operatorName: string
    /** 操作时间 */
    operationTime: number
    /** 消息发送时间 */
    messageTime: number
    /** 消息ID */
    messageId: string
    /** 消息序列号 */
    messageSeq: number
    /** 被设置的精华消息元素文本 */
    jsonElements: string
  }
  /**
   * 用户信息结构
   * @description 此接口仅可保证返回user_id、nick这两个字段
   */
  interface UserInfo$1 {
    /** 用户ID */
    userId: string
    /** 名称 */
    nick: string
    /** 用户UID */
    uid: string
    /** 用户UIN */
    uin: string
    /** qid */
    qid?: string
    /** 备注 */
    remark?: string
    /** 用户等级 */
    level?: number
    /** 生日 */
    birthday?: string
    /** 登录天数 */
    loginDay?: number
    /** 点赞数 */
    likeCount?: number
    /** 学校是否已核实 */
    isSchoolVerified?: boolean
    /** 年龄 */
    age?: number
    /** 性别 */
    sex?: Sex
    /** 好莱坞/腾讯视频会员 */
    hollywoodVip?: boolean
    /** QQ会员 */
    qqVip?: boolean
    /** QQ超级会员 */
    qqSvip?: boolean
    /** 大会员 */
    bigVip?: boolean
    /** 是否已经赞过 */
    isLike?: boolean
    [key: string]: any
  }
  /**
   * 群信息结构
   * @description 此接口仅可保证返回group_id这个字段
   */
  interface GroupInfo {
    /** 群ID */
    groupId: string
    /** 群名称 */
    groupName?: string
    /** 群主ID */
    owner?: string
    /** 群备注 */
    groupRemark?: string
    /** 群管理员ID列表 */
    admins?: Array<string>
    /** 最大成员数 */
    maxMemberCount?: number
    /** 当前成员数 */
    memberCount?: number
    /** 群描述 */
    groupDesc?: string
  }
  /**
   * 群成员信息
   * @description 此接口仅可保证返回user_id这个字段
   */
  interface GroupMemberInfo {
    /** 用户ID */
    userId: string
    /** 用户角色 */
    role: Role
    /** 用户昵称 */
    nick?: string
    /** 年龄 */
    age?: number
    /** 群内头衔 */
    uniqueTitle?: string
    /** 群名片 */
    card?: string
    /** 加群时间 */
    joinTime?: number
    /** 最后活跃时间 */
    lastActiveTime?: number
    /** 用户等级 */
    level?: number
    /** 禁言时间 */
    shutUpTime?: number
    /** 距离 */
    distance?: number
    /** 荣誉列表 */
    honors?: Array<number>
    /** 是否好友 */
    unfriendly?: boolean
    /** 性别 */
    sex?: Sex
    /** 构建成发送者 方便使用 */
    get sender (): GroupSender$1
  }
  /**
   * 群荣誉信息
   * @description 此接口仅可在QQ协议端中使用
   */
  interface QQGroupHonorInfo {
    /** 荣誉成员ID */
    userId: string
    /** 荣誉成员昵称 */
    nick: string
    /** 荣誉名称 */
    honorName: string
    /** 荣誉图标url */
    avatar: string
    /** 荣誉id */
    id: number
    /** 荣誉描述 */
    description: string
  }
  /**
   * 群文件信息
   * @description 此接口仅可在QQ协议端中使用
   */
  interface QQGroupFileInfo {
    /** 文件ID */
    id: string
    /** 文件名 */
    name: string
    /** 文件大小 */
    size: number
    /** 上传时间 */
    uploadTime: number
    /** 过期时间 */
    expireTime: number
    /** 修改时间 */
    modifyTime: number
    /** 下载次数 */
    downloadCount: number
    /** 上传者ID */
    uploadId: string
    /** 上传者昵称 */
    uploadName: string
    /** SHA1 */
    sha1: string
    /** SHA3 */
    sha3: string
    /** MD5 */
    md5: string
  }
  /**
   * 群文件夹信息
   * @description 此接口仅可在QQ协议端中使用
   */
  interface QQGroupFolderInfo {
    /** 文件夹ID */
    id: string
    /** 文件夹名 */
    name: string
    /** 文件数量 */
    fileCount: number
    /** 创建时间 */
    createTime: number
    /** 创建者UID */
    creatorId: string
    /** 创建者昵称 */
    creatorName: string
  }
  /** 获取at全体成员剩余次数返回值结构 */
  interface GetAtAllCountResponse {
    /** 是否允许at全体成员 */
    accessAtAll: boolean
    /** 全群剩余次数 */
    groupRemainCount: number
    /** 个人剩余次数 */
    userRremainCount: number
  }
  /** 获取群被禁言用户列表返回值结构 */
  interface GetGroupMuteListResponse {
    /** 用户ID */
    userId: string
    /** 禁言时间 */
    muteTime: number
  }
  /** 获取群文件夹下文件列表返回值结构 */
  interface GetGroupFileListResponse {
    /** 文件列表 */
    files: QQGroupFileInfo[]
    /** 文件夹列表 */
    folders: QQGroupFolderInfo[]
  }
  /** 获取群文件系统信息返回值结构 */
  interface GetGroupFileSystemInfoResponse {
    /** 文件数量 */
    fileCount: number
    /** 文件夹数量 */
    totalCount: number
    /** 已使用空间 */
    usedSpace: number
    /** 总空间 */
    totalSpace: number
  }
  /** 创建群文件夹返回值结构 */
  interface CreateGroupFolderResponse {
    /** 文件夹ID */
    id: string
    /** 已使用空间 */
    usedSpace: string
  }
  /** 基础选项，不包含 url 和 base64 */
  interface DownloadFileOptionsBase {
    /** 下载文件的根目录，需确保 Kritor 有该目录访问权限，可选 */
    rootPath?: string
    /** 保存的文件名称，默认为文件 MD5，可选 */
    fileName?: string
    /** 下载文件的线程数，默认为 3，可选 */
    threadCnt?: number
    /** 下载文件的请求头，可选 */
    headers?: string
  }
  /** 包含 url 的选项，base64 必须为 never */
  interface DownloadFileOptionsWithUrl extends DownloadFileOptionsBase {
    /** 下载文件的 URL，二选一 */
    url: string
    /** 下载文件的 base64，不允许 */
    base64?: never
  }
  /** 包含 base64 的选项，url 必须为 never */
  interface DownloadFileOptionsWithBase64 extends DownloadFileOptionsBase {
    /** 下载文件的 base64，二选一 */
    base64: string
    /** 下载文件的 URL，不允许 */
    url?: never
  }
  /** 让协议端下载文件到协议端本地请求参数结构 */
  type DownloadFileOptions = DownloadFileOptionsWithUrl | DownloadFileOptionsWithBase64
  /** 让协议端下载文件到协议端本地返回值结构 */
  interface DownloadFileResponse {
    /** 下载后文件的绝对路径 */
    filePath: string
  }

  /** OneBot11消息类型 */
  type OB11SegmentType = 'text' | 'face' | 'image' | 'record' | 'video' | 'at' | 'rps' | 'dice' | 'shake' | 'poke' | 'anonymous' | 'share' | 'contact' | 'location' | 'music' | 'music_custom' | 'reply' | 'forward' | 'node' | 'xml' | 'json' | 'file'
  interface Segment {
    type: OB11SegmentType
  }
  /** 纯文本 */
  interface TextSegment extends Segment {
    type: 'text'
    data: {
      text: string
    }
  }
  /** QQ表情 */
  interface FaceSegment extends Segment {
    type: 'face'
    data: {
      id: string
    }
  }
  /** 图片消息段 */
  interface ImageSegment extends Segment {
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
  /** 语音消息段 */
  interface RecordSegment extends Segment {
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
  /** 短视频消息段 */
  interface VideoSegment extends Segment {
    type: 'video'
    data: {
      file: string
      url?: string
      cache?: 0 | 1
      proxy?: 0 | 1
      timeout?: number
    }
  }
  /** @某人消息段 */
  interface AtSegment extends Segment {
    type: 'at'
    data: {
      qq: string | 'all'
      name?: string
    }
  }
  /** 猜拳魔法表情消息段 */
  interface RpsSegment extends Segment {
    type: 'rps'
    data: {}
  }
  /** 掷骰子魔法表情消息段 */
  interface DiceSegment extends Segment {
    type: 'dice'
    data: {}
  }
  /** 窗口抖动（戳一戳）消息段 */
  interface ShakeSegment extends Segment {
    type: 'shake'
    data: {}
  }
  /** 戳一戳消息段 */
  interface PokeSegment extends Segment {
    type: 'poke'
    data: {
      type: string
      id: string
      name?: string
    }
  }
  /** 匿名发消息消息段 */
  interface AnonymousSegment extends Segment {
    type: 'anonymous'
    data: {
      ignore?: 0 | 1
    }
  }
  /** 链接分享消息段 */
  interface ShareSegment extends Segment {
    type: 'share'
    data: {
      url: string
      title: string
      content?: string
      image?: string
    }
  }
  /** 推荐好友/群消息段 */
  interface ContactSegment extends Segment {
    type: 'contact'
    data: {
      type: 'qq' | 'group'
      id: string
    }
  }
  /** 位置消息段 */
  interface LocationSegment extends Segment {
    type: 'location'
    data: {
      lat: string
      lon: string
      title?: string
      content?: string
    }
  }
  /** 音乐分享消息段 */
  interface MusicSegment extends Segment {
    type: 'music'
    data: {
      type: 'qq' | '163' | 'xm'
      id: string
    }
  }
  /** 音乐自定义分享消息段 */
  interface CustomMusicSegment extends Segment {
    type: 'music_custom'
    data: {
      type: 'custom'
      url: string
      audio: string
      title: string
      content?: string
      image?: string
    }
  }
  /** 回复消息段 */
  interface ReplySegment extends Segment {
    type: 'reply'
    data: {
      id: string
    }
  }
  interface FileSegment extends Segment {
    type: 'file'
    data: {
      file: string
    }
  }
  /** 合并转发消息段 */
  interface ForwardSegment extends Segment {
    type: 'forward'
    data: {
      id: string
    }
  }
  /** XML消息段 */
  interface XmlSegment extends Segment {
    type: 'xml'
    data: {
      data: string
    }
  }
  /** JSON消息段 */
  interface JsonSegment extends Segment {
    type: 'json'
    data: {
      data: string
    }
  }
  /** OneBot11消息段 */
  type OB11SegmentBase = TextSegment | FaceSegment | ImageSegment | RecordSegment | VideoSegment | AtSegment | RpsSegment | DiceSegment | ShakeSegment | PokeSegment | AnonymousSegment | ShareSegment | ContactSegment | LocationSegment | MusicSegment | CustomMusicSegment | ReplySegment | ForwardSegment | XmlSegment | JsonSegment
  /** 合并转发已有消息节点消息段 */
  interface DirectNodeSegment extends Segment {
    type: 'node'
    data: {
      id: string
    }
  }
  /** 合并转发自定义节点消息段 */
  interface CustomNodeSegments extends Segment {
    type: 'node'
    data: {
      user_id: string
      nickname: string
      content: OB11Segment[]
      prompt?: string
      summary?: string
      source?: string
    }
  }
  /** 合并转发消息段 */
  type OB11NodeSegment = DirectNodeSegment | CustomNodeSegments
  /** OneBot11消息段 */
  type OB11Segment = OB11SegmentBase | OB11NodeSegment

  export const enum Action {
    /** 发送私聊消息 */
    sendPrivateMsg = 'send_private_msg',
    /** 发送群消息 */
    sendGroupMsg = 'send_group_msg',
    /** 发送消息 */
    sendMsg = 'send_msg',
    /** 撤回消息 */
    deleteMsg = 'delete_msg',
    /** 获取消息 */
    getMsg = 'get_msg',
    /** 获取转发消息 */
    getForwardMsg = 'get_forward_msg',
    /** 发送好友赞 */
    sendLike = 'send_like',
    /** 群组踢人 */
    setGroupKick = 'set_group_kick',
    /** 群组禁言 */
    setGroupBan = 'set_group_ban',
    /** 群组匿名用户禁言 */
    setGroupAnonymousBan = 'set_group_anonymous_ban',
    /** 群组全员禁言 */
    setGroupWholeBan = 'set_group_whole_ban',
    /** 设置群管理员 */
    setGroupAdmin = 'set_group_admin',
    /** 设置群匿名聊天 */
    setGroupAnonymous = 'set_group_anonymous',
    /** 设置群名片（群备注） */
    setGroupCard = 'set_group_card',
    /** 设置群名 */
    setGroupName = 'set_group_name',
    /** 退出群组 */
    setGroupLeave = 'set_group_leave',
    /** 设置群成员专属头衔 */
    setGroupSpecialTitle = 'set_group_special_title',
    /** 处理好友添加请求 */
    setFriendAddRequest = 'set_friend_add_request',
    /** 处理群添加请求／邀请 */
    setGroupAddRequest = 'set_group_add_request',
    /** 获取登录号信息 */
    getLoginInfo = 'get_login_info',
    /** 获取陌生人信息 */
    getStrangerInfo = 'get_stranger_info',
    /** 获取好友列表 */
    getFriendList = 'get_friend_list',
    /** 获取群信息 */
    getGroupInfo = 'get_group_info',
    /** 获取群列表 */
    getGroupList = 'get_group_list',
    /** 获取群成员信息 */
    getGroupMemberInfo = 'get_group_member_info',
    /** 获取群成员列表 */
    getGroupMemberList = 'get_group_member_list',
    /** 获取群荣誉信息 */
    getGroupHonorInfo = 'get_group_honor_info',
    /** 获取 Cookies */
    getCookies = 'get_cookies',
    /** 获取 CSRF Token */
    getCsrfToken = 'get_csrf_token',
    /** 获取 QQ 相关接口凭证 */
    getCredentials = 'get_credentials',
    /** 获取语音 */
    getRecord = 'get_record',
    /** 获取图片 */
    getImage = 'get_image',
    /** 是否可以发送图片 */
    canSendImage = 'can_send_image',
    /** 是否可以发送语音 */
    canSendRecord = 'can_send_record',
    /** 获取插件运行状态 */
    getStatus = 'get_status',
    /** 获取版本信息 */
    getVersionInfo = 'get_version_info',
    /** 获取版本信息 */
    getVersion = 'get_version',
    /** 重启插件 */
    setRestart = 'set_restart',
    /** 清理数据缓存 */
    cleanCache = 'clean_cache',
    /** 发送合并转发消息 */
    sendForwardMsg = 'send_forward_msg',
    /** 发送群聊合并转发消息 */
    sendGroupForwardMsg = 'send_group_forward_msg',
    /** 发送好友合并转发消息 */
    sendPrivateForwardMsg = 'send_private_forward_msg',
    /** 获取好友历史消息记录 */
    getFriendMsgHistory = 'get_friend_msg_history',
    /** 获取群组历史消息记录 */
    getGroupMsgHistory = 'get_group_msg_history',
    /** 对消息进行表情回应 */
    setMsgEmojiLike = 'set_msg_emoji_like',
    /** 上传群文件 */
    uploadGroupFile = 'upload_group_file',
    /** 上传私聊文件 */
    uploadPrivateFile = 'upload_private_file',
    /** 获取精华消息列表 */
    getEssenceMsgList = 'get_essence_msg_list',
    /** 设置精华消息 */
    setEssenceMsg = 'set_essence_msg',
    /** 删除精华消息 */
    deleteEssenceMsg = 'delete_essence_msg',
  }
  /** Api请求参数 */
  interface Params {
    /** 发送私聊消息 */
    [Action.sendPrivateMsg]: {
      /** 对方 QQ 号 */
      user_id: number
      /** 主动发起临时会话时的来源群号(可选, 机器人本身必须是管理员/群主) */
      group_id?: number
      /** 要发送的内容 */
      message: Array<OB11Segment>
      /** 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效 */
      auto_escape?: boolean
    }
    /** 发送群消息 */
    [Action.sendGroupMsg]: {
      /** 群号 */
      group_id: number
      /** 要发送的内容 */
      message: Array<OB11Segment>
      /** 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效 */
      auto_escape?: boolean
    }
    /** 发送消息 */
    [Action.sendMsg]: {
      /** 消息类型 */
      message_type: 'private' | 'group'
      /** 对方 QQ 号，当消息类型为 "private" 时有效 */
      user_id?: number
      /** 群号，当消息类型为 "group" 时有效 */
      group_id?: number
      /** 要发送的内容 */
      message: Array<OB11Segment>
      /** 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 `message` 字段是字符串时有效 */
      auto_escape?: boolean
    }
    /** 撤回消息 */
    [Action.deleteMsg]: {
      /** 消息 ID */
      message_id: number
    }
    /** 获取消息 */
    [Action.getMsg]: {
      /** 消息 ID */
      message_id: number
    }
    /** 获取转发消息 */
    [Action.getForwardMsg]: {
      /** 转发消息 ID */
      id: string
    }
    /** 发送好友赞 */
    [Action.sendLike]: {
      /** 对方 QQ 号 */
      user_id: number
      /** 赞的次数，每个赞为一个好友赞，每个用户每天最多赞 10 次 */
      times?: number
    }
    /** 群组踢人 */
    [Action.setGroupKick]: {
      /** 群号 */
      group_id: number
      /** 要踢的 QQ 号 */
      user_id: number
      /** 拒绝此人的加群请求 */
      reject_add_request?: boolean
    }
    /** 群组禁言 */
    [Action.setGroupBan]: {
      /** 群号 */
      group_id: number
      /** 要禁言的 QQ 号 */
      user_id: number
      /** 禁言时长，单位秒，0 表示取消禁言 */
      duration?: number
    }
    /** 群组匿名用户禁言 */
    [Action.setGroupAnonymousBan]: {
      /** 群号 */
      group_id: number
      /** 匿名用户对象 */
      anonymous?: object
      /** 匿名用户标识，使用匿名用户对象时此参数无效 */
      anonymous_flag?: string
      /** 禁言时长，单位秒，无法取消匿名用户禁言 */
      duration?: number
    }
    /** 群组全员禁言 */
    [Action.setGroupWholeBan]: {
      /** 群号 */
      group_id: number
      /** 是否禁言，true 为开启，false 为关闭 */
      enable?: boolean
    }
    /** 设置群管理员 */
    [Action.setGroupAdmin]: {
      /** 群号 */
      group_id: number
      /** 要设置管理员的 QQ 号 */
      user_id: number
      /** 是否设置为管理员，true 为设置，false 为取消 */
      enable?: boolean
    }
    /** 设置群匿名聊天 */
    [Action.setGroupAnonymous]: {
      /** 群号 */
      group_id: number
      /** 是否允许匿名聊天，true 为开启，false 为关闭 */
      enable?: boolean
    }
    /** 设置群名片（群备注） */
    [Action.setGroupCard]: {
      /** 群号 */
      group_id: number
      /** 要设置的 QQ 号 */
      user_id: number
      /** 名片内容，不填或空字符串表示删除群名片 */
      card?: string
    }
    /** 设置群名 */
    [Action.setGroupName]: {
      /** 群号 */
      group_id: number
      /** 新群名 */
      group_name: string
    }
    /** 退出群组 */
    [Action.setGroupLeave]: {
      /** 群号 */
      group_id: number
      /** 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散 */
      is_dismiss?: boolean
    }
    /** 设置群成员专属头衔 */
    [Action.setGroupSpecialTitle]: {
      /** 群号 */
      group_id: number
      /** 要设置的 QQ 号 */
      user_id: number
      /** 专属头衔，不填或空字符串表示删除专属头衔 */
      special_title?: string
      /** 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果 */
      duration?: number
    }
    /** 处理好友添加请求 */
    [Action.setFriendAddRequest]: {
      /** 请求 flag，在调用处理请求的事件中返回 */
      flag: string
      /** 是否同意请求 */
      approve?: boolean
      /** 添加后的好友备注 */
      remark?: string
    }
    /** 处理群添加请求／邀请 */
    [Action.setGroupAddRequest]: {
      /** 请求 flag，在调用处理请求的事件中返回 */
      flag: string
      /** 请求子类型，add 或 invite，请求子类型为 invite 时为邀请 */
      sub_type: 'add' | 'invite'
      /** 是否同意请求／邀请 */
      approve?: boolean
      /** 拒绝理由，仅在拒绝时有效 */
      reason?: string
    }
    /** 获取登录号信息 */
    [Action.getLoginInfo]: {}
    /** 获取陌生人信息 */
    [Action.getStrangerInfo]: {
      /** QQ 号 */
      user_id: number
      /** 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存 */
      no_cache?: boolean
    }
    /** 获取好友列表 */
    [Action.getFriendList]: {}
    /** 获取群信息 */
    [Action.getGroupInfo]: {
      /** 群号 */
      group_id: number
      /** 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存 */
      no_cache?: boolean
    }
    /** 获取群列表 */
    [Action.getGroupList]: {}
    /** 获取群成员信息 */
    [Action.getGroupMemberInfo]: {
      /** 群号 */
      group_id: number
      /** QQ 号 */
      user_id: number
      /** 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存 */
      no_cache?: boolean
    }
    /** 获取群成员列表 */
    [Action.getGroupMemberList]: {
      /** 群号 */
      group_id: number
      /** 是否不使用缓存，true 表示不使用缓存，false 或留空表示使用缓存 */
      no_cache?: boolean
    }
    /** 获取群荣誉信息 */
    [Action.getGroupHonorInfo]: {
      /** 群号 */
      group_id: number
      /** 荣誉类型，可选值为 "talkative"（龙王）、"performer"（群聊之火）、"legend"（群聊炽焰）、"strong_newbie"（新人王）、"emotion"（快乐源泉）、"all"（所有类型） */
      type: 'talkative' | 'performer' | 'legend' | 'strong_newbie' | 'emotion' | 'all'
    }
    /** 获取 Cookies */
    [Action.getCookies]: {
      /** 指定域名，不填或空字符串表示获取当前域名下的 Cookies */
      domain?: string
    }
    /** 获取 CSRF Token */
    [Action.getCsrfToken]: {}
    /** 获取 QQ 相关接口凭证 */
    [Action.getCredentials]: {
      /** 指定域名，不填或空字符串表示获取当前域名下的凭证 */
      domain?: string
    }
    /** 获取语音 */
    [Action.getRecord]: {
      /** 文件路径 */
      file: string
      /** 输出格式，可选值为 "amr"、"silk"、"mp3"、"wav"，默认为 "amr" */
      out_format: string
    }
    /** 获取图片 */
    [Action.getImage]: {
      /** 文件路径 */
      file: string
    }
    /** 是否可以发送图片 */
    [Action.canSendImage]: {}
    /** 是否可以发送语音 */
    [Action.canSendRecord]: {}
    /** 获取插件运行状态 */
    [Action.getStatus]: {}
    /** 获取版本信息 */
    [Action.getVersionInfo]: {}
    /** 获取版本信息 */
    [Action.getVersion]: {}
    /** 重启插件 */
    [Action.setRestart]: {
      /** 延迟重启时间，单位毫秒，不填或留空表示立即重启 */
      delay?: number
    }
    /** 清理数据缓存 */
    [Action.cleanCache]: {}
    /** 发送合并转发消息 */
    [Action.sendForwardMsg]: {
      /** 对方 QQ 号，当消息类型为 "private" 时有效 */
      user_id?: number
      /** 群号，当消息类型为 "group" 时有效 */
      group_id?: number
      /** 要发送的内容 */
      messages: Array<OB11NodeSegment>
    }
    /** 发送群聊合并转发消息 */
    [Action.sendGroupForwardMsg]: {
      /** 群号 */
      group_id: number
      /** 要发送的内容 */
      messages: Array<OB11NodeSegment>
    }
    /** 发送好友合并转发消息 */
    [Action.sendPrivateForwardMsg]: {
      /** 对方 QQ 号 */
      user_id: number
      /** 要发送的内容 */
      messages: Array<OB11NodeSegment>
    }
    /** 获取好友历史消息记录 */
    [Action.getFriendMsgHistory]: {
      /** 对方 QQ 号 */
      user_id: number
      /** 起始消息序号 */
      message_seq?: number
      /** 起始消息ID lgl */
      message_id?: number
      /** 消息数量 */
      count: number
    }
    /** 获取群组历史消息记录 */
    [Action.getGroupMsgHistory]: {
      /** 群号 */
      group_id: number
      /** 起始消息序号 */
      message_seq?: number
      /** 起始消息ID lgl */
      message_id?: number
      /** 消息数量 */
      count: number
    }
    /** 对消息进行表情回应 */
    [Action.setMsgEmojiLike]: {
      /** 需要回应的消息 ID */
      message_id: string
      /** 回应的表情 ID */
      emoji_id: number
      /** 设置、取消 */
      is_set: boolean
    }
    /**
     * 上传群文件
     */
    [Action.uploadGroupFile]: {
      /** 群号 */
      group_id: number
      /** 文件路径 需要提供绝对路径 */
      file: string
      /** 文件名称 必须提供 */
      name: string
      /** 父目录ID 不提供则上传到根目录 */
      folder?: string
    }
    /**
     * 上传私聊文件
     */
    [Action.uploadPrivateFile]: {
      /** 对方 QQ 号 */
      user_id: number
      /** 文件路径 需要提供绝对路径 */
      file: string
      /** 文件名称 必须提供 */
      name: string
    }
    /**
     * 获取精华消息列表
     */
    [Action.getEssenceMsgList]: {
      /** 群号 */
      group_id: number
    }
    /**
     * 设置精华消息
     */
    [Action.setEssenceMsg]: {
      /** 消息ID */
      message_id: number
    }
    /**
     * 移除精华消息
     */
    [Action.deleteEssenceMsg]: {
      /** 消息ID */
      message_id: number
    }
  }
  interface GetGroupInfo {
    /** 群号 */
    group_id: number
    /** 群名称 */
    group_name: string
    /** 成员数 */
    member_count: number
    /** 最大成员数（群容量） */
    max_member_count: number
  }
  interface HonorInfoList {
    /** QQ 号 */
    user_id: number
    /** QQ 昵称 */
    nickname: string
    /** 头像url */
    avatar: string
    /** 荣誉描述 */
    description: string
  }
  interface GetGroupMemberInfo {
    /** 群号 */
    group_id: number
    /** QQ 号 */
    user_id: number
    /** 昵称 */
    nickname: string
    /** 群名片／备注 */
    card: string
    /** 性别 */
    sex: 'male' | 'female' | 'unknown'
    /** 年龄 */
    age: number
    /** 地区 */
    area: string
    /** 加群时间戳 */
    join_time: number
    /** 最后发言时间戳 */
    last_sent_time: number
    /** 成员等级 */
    level: string
    /** 角色 */
    role: 'owner' | 'admin' | 'member' | 'unknown'
    /** 是否不良记录成员 */
    unfriendly: boolean
    /** 专属头衔 */
    title: string
    /** 专属头衔过期时间戳 */
    title_expire_time: number
    /** 是否允许修改群名片 */
    card_changeable: boolean
  }
  interface GetMsg {
    /** 发送时间 */
    time: number
    /** 消息类型 */
    message_type: 'private' | 'group'
    message_id: number
    message_seq: number
    real_id: number
    sender: {
      /** 发送者 QQ 号 */
      user_id: number
      /** 昵称 不存在则为空字符串 */
      nickname: string
      /** 性别 */
      sex?: 'male' | 'female' | 'unknown'
      /** 年龄 */
      age?: number
      /** 群名片/备注 */
      card?: string
      /** 地区 */
      area?: string
      /** 成员等级 */
      level?: string
      /** 角色 不存在则为空字符串 */
      role: 'owner' | 'admin' | 'member' | 'unknown'
      /** 专属头衔 */
      title?: string
    }
    message: OB11Segment[]
  }
  interface UserInfo {
    /** QQ 号 */
    uid?: string
    /** QQ 号 */
    user_id: number
    /** QQ 昵称 */
    nick?: string
    /** QQ 昵称 */
    nickname: string
    /** 备注名 */
    remark?: string
    /** 星座 */
    constellation?: number
    /** 生肖 */
    shengXiao?: number
    /** 血型 */
    kBloodType?: number
    /** 家乡地址 */
    homeTown?: string
    /** 交友行业 */
    makeFriendCareer?: number
    /** 职位 */
    pos?: string
    /** 大学 */
    college?: string
    /** 国家 */
    country?: string
    /** 省份 */
    province?: string
    /** 城市 */
    city?: string
    /** 邮政编码 */
    postCode?: string
    /** 详细地址 */
    address?: string
    /** 注册时间戳 */
    regTime?: number
    /** 注册时间戳 */
    reg_time?: number
    /** 兴趣爱好 */
    interest?: string
    /** 标签 */
    labels?: string[]
    /** QQ 等级 */
    qqLevel?: number
    /** qid */
    qid?: string
    /** 个性签名 */
    longNick?: string
    /** 个性签名 */
    long_nick?: string
    /** 生日年份 */
    birthday_year?: number
    /** 生日月份 */
    birthday_month?: number
    /** 生日日期 */
    birthday_day?: number
    /** 年龄 */
    age?: number
    /** 性别 */
    sex?: 'male' | 'female' | 'unknown'
    /** 邮箱地址 */
    eMail?: string
    /** 手机号码 */
    phoneNum?: string
    /** 用户分类 ID */
    categoryId?: number
    /** 财富时间戳 */
    richTime?: number
    /** 财富缓存 */
    richBuffer?: Record<number, number>
    /** 用户状态 */
    status?: number
    /** 扩展状态 */
    extStatus?: number
    /** 电池状态 */
    batteryStatus?: number
    /** 终端类型 */
    termType?: number
    /** 网络类型 */
    netType?: number
    /** 头像类型 */
    iconType?: number
    /** 自定义状态 */
    customStatus?: string | null
    /** 设置时间 */
    setTime?: string
    /** 特殊标记 */
    specialFlag?: number
    /** ABI 标志 */
    abiFlag?: number
    /** 网络类型扩展 */
    eNetworkType?: number
    /** 显示名称 */
    showName?: string
    /** 终端描述 */
    termDesc?: string
    /** 音乐信息 */
    musicInfo?: {
      /** 音乐缓存 */
      buf?: Record<string, unknown>
    }
    /** 扩展在线业务信息 */
    extOnlineBusinessInfo?: {
      /** 缓存 */
      buf?: Record<string, unknown>
      /** 自定义状态 */
      customStatus?: string | null
      /** 视频业务信息 */
      videoBizInfo?: {
        /** 视频 ID */
        cid?: string
        /** 视频 URL */
        tvUrl?: string
        /** 同步类型 */
        synchType?: string
      }
      /** 视频信息 */
      videoInfo?: {
        /** 视频名称 */
        name?: string
      }
    }
    /** 扩展缓冲 */
    extBuffer?: {
      /** 缓存 */
      buf?: Record<string, unknown>
    }
    /** 是否为 VIP 用户 */
    is_vip?: boolean
    /** 是否为年费 VIP */
    is_years_vip?: boolean
    /** VIP 等级 */
    vip_level?: number
    /** 登录天数 */
    login_days?: number
  }
  /** Api返回参数 */
  interface Request$1 {
    /** 发送私聊消息 */
    [Action.sendPrivateMsg]: {
      /** 消息 ID */
      message_id: number
    }
    /** 发送群消息 */
    [Action.sendGroupMsg]: {
      /** 消息 ID */
      message_id: number
    }
    /** 发送消息 */
    [Action.sendMsg]: {
      /** 消息 ID */
      message_id: number
    }
    /** 撤回消息 */
    [Action.deleteMsg]: {
      /** 消息 ID */
      message_id: number
    }
    /** 获取消息 */
    [Action.getMsg]: GetMsg
    /** 获取转发消息 */
    [Action.getForwardMsg]: {
      message: Array<OB11NodeSegment>
    }
    /** 发送好友赞 */
    [Action.sendLike]: {}
    /** 群组踢人 */
    [Action.setGroupKick]: {}
    /** 群组禁言 */
    [Action.setGroupBan]: {}
    /** 群组匿名用户禁言 */
    [Action.setGroupAnonymousBan]: {}
    /** 群组全员禁言 */
    [Action.setGroupWholeBan]: {}
    /** 设置群管理员 */
    [Action.setGroupAdmin]: {}
    /** 设置群匿名聊天 */
    [Action.setGroupAnonymous]: {}
    /** 设置群名片（群备注） */
    [Action.setGroupCard]: {}
    /** 设置群名 */
    [Action.setGroupName]: {}
    /** 退出群组 */
    [Action.setGroupLeave]: {}
    /** 设置群成员专属头衔 */
    [Action.setGroupSpecialTitle]: {}
    /** 处理好友添加请求 */
    [Action.setFriendAddRequest]: {}
    /** 处理群添加请求／邀请 */
    [Action.setGroupAddRequest]: {}
    /** 获取登录号信息 */
    [Action.getLoginInfo]: {
      /** QQ 号 */
      user_id: number
      /** QQ 昵称 */
      nickname: string
    }
    /** 获取陌生人信息 */
    [Action.getStrangerInfo]: UserInfo
    /** 获取好友列表 */
    [Action.getFriendList]: Array<UserInfo>
    /** 获取群信息 */
    [Action.getGroupInfo]: GetGroupInfo
    /** 获取群列表 */
    [Action.getGroupList]: Array<GetGroupInfo>
    /** 获取群成员信息 */
    [Action.getGroupMemberInfo]: GetGroupMemberInfo
    /** 获取群成员列表 */
    [Action.getGroupMemberList]: Array<GetGroupMemberInfo>
    /** 获取群荣誉信息 */
    [Action.getGroupHonorInfo]: {
      /** 群号 */
      group_id: number
      /**
       * 当前龙王
       */
      current_talkative?: {
        /** QQ 号 */
        user_id: number
        /** QQ 昵称 */
        nickname: string
        /** 头像url */
        avatar: string
        /** 持续天数 */
        day_count: number
      }
      /** 历史龙王 */
      talkative_list: Array<HonorInfoList>
      /** 群聊之火 */
      performer_list: Array<HonorInfoList>
      /** 群聊炽焰 */
      legend_list: Array<HonorInfoList>
      /** 冒尖小春笋 */
      strong_newbie_list: Array<HonorInfoList>
      /** 快乐之源 */
      emotion_list: Array<HonorInfoList>
    }
    /** 获取 Cookies */
    [Action.getCookies]: {
      cookies: string
    }
    /** 获取 CSRF Token */
    [Action.getCsrfToken]: {
      token: number
    }
    /** 获取 QQ 相关接口凭证 */
    [Action.getCredentials]: {
      cookies: string
      csrf_token: number
    }
    /** 获取语音 */
    [Action.getRecord]: {
      /** 转换后的语音文件绝对路径 如 /home/somebody/cqhttp/data/record/0B38145AA44505000B38145AA4450500.mp3 */
      file: string
    }
    /** 获取图片 */
    [Action.getImage]: {
      /** 下载后的图片文件路径，如 /home/somebody/cqhttp/data/image/6B4DE3DFD1BD271E3297859D41C530F5.jpg */
      file: string
    }
    /** 是否可以发送图片 */
    [Action.canSendImage]: {
      yes: boolean
    }
    /** 是否可以发送语音 */
    [Action.canSendRecord]: {
      yes: boolean
    }
    /** 获取插件运行状态 */
    [Action.getStatus]: {
      /** 当前 QQ 在线，null 表示无法查询到在线状态 */
      online: boolean
      /** 状态符合预期，意味着各模块正常运行、功能正常，且 QQ 在线 */
      good: boolean;
      [key: string]: any
    }
    /** 获取版本信息 */
    [Action.getVersionInfo]: {
      /** 应用标识，如 mirai-native */
      app_name: string
      /** 应用版本，如 1.2.3 */
      app_version: string
      /** OneBot 标准版本，如 v11 */
      protocol_version: string;
      [key: string]: any
    }
    /** 获取版本信息 */
    [Action.getVersion]: {
      /** 应用标识，如 mirai-native */
      app_name: string
      /** 应用版本，如 1.2.3 */
      app_version: string
      /** OneBot 标准版本，如 v11 */
      protocol_version: string;
      [key: string]: any
    }
    /** 重启插件 */
    [Action.setRestart]: {
      /** 延迟重启时间，单位毫秒，不填或留空表示立即重启 */
      delay?: number
    }
    /** 清理数据缓存 */
    [Action.cleanCache]: {}
    /** 发送合并转发消息 */
    [Action.sendForwardMsg]: {
      /** 消息 ID */
      message_id: number
      /** res_id 可通过长消息接口发送 */
      forward_id: string
    }
    /** 发送群聊合并转发消息 */
    [Action.sendGroupForwardMsg]: {
      /** 消息 ID */
      message_id: number
      /** res_id 可通过长消息接口发送 */
      forward_id: string
    }
    /** 发送好友合并转发消息 */
    [Action.sendPrivateForwardMsg]: {
      /** 消息 ID */
      message_id: number
      /** res_id 可通过长消息接口发送 */
      forward_id: string
    }
    /** 获取好友历史消息记录 */
    [Action.getFriendMsgHistory]: {
      messages: GetMsg[]
    }
    /** 获取群组历史消息记录 */
    [Action.getGroupMsgHistory]: {
      messages: GetMsg[]
    }
    /** 对消息进行表情回应 */
    [Action.setMsgEmojiLike]: {}
    /**
     * 上传群文件
     */
    [Action.uploadGroupFile]: {}
    /**
     * 上传私聊文件
     */
    [Action.uploadPrivateFile]: {}
    /**
     * 获取精华消息列表
     */
    [Action.getEssenceMsgList]: Array<{
      /** 发送者QQ号 */
      sender_id: number
      /** 发送者昵称 */
      sender_nick: string
      /** 消息发送时间 */
      sender_time: number
      /** 操作者QQ号 */
      operator_id: number
      /** 操作者昵称 */
      operator_nick: string
      /** 精华设置时间 */
      operator_time: number
      /** 消息ID */
      message_id: number
    }>
    /**
   * 设置精华消息
   */
    [Action.setEssenceMsg]: {}
    /**
     * 移除精华消息
     */
    [Action.deleteEssenceMsg]: {}
  }

  /** 性别枚举 */
  export const enum OB11Sex {
    Male = 'male',
    Female = 'female',
    Unknown = 'unknown',
  }
  /** OneBot11消息类型枚举 */
  export const enum OB11Event {
    Message = 'message',
    Notice = 'notice',
    Request = 'request',
    MetaEvent = 'meta_event',
    /** go-cqhttp拓展 自身事件上报 */
    MessageSent = 'message_sent',
  }
  /** 消息事件类型 */
  export const enum OB11MessageType {
    Private = 'private',
    Group = 'group',
  }
  /** 消息子类型 */
  export const enum OB11MessageSubType {
    Friend = 'friend',
    Group = 'group',
    Other = 'other',
    Normal = 'normal',
    Anonymous = 'anonymous',
    Notice = 'notice',
  }
  /** 通知事件枚举 */
  export const enum OB11NoticeType {
    /** 群文件上传 */
    GroupUpload = 'group_upload',
    /** 群管理员变动 */
    GroupAdmin = 'group_admin',
    /** 群成员减少 */
    GroupDecrease = 'group_decrease',
    /** 群成员增加 */
    GroupIncrease = 'group_increase',
    /** 群禁言 */
    GroupBan = 'group_ban',
    /** 新增好友 */
    FriendAdd = 'friend_add',
    /** 群消息撤回 */
    GroupRecall = 'group_recall',
    /** 好友消息撤回 */
    FriendRecall = 'friend_recall',
    /** 通知 */
    Notify = 'notify',
    /** 群表情回应 */
    GroupMsgEmojiLike = 'group_msg_emoji_like',
    /** 群表情回应 Lagrange */
    GroupMsgEmojiLikeLagrange = 'reaction',
    /** 精华 */
    GroupEssence = 'essence',
    /** 群成员名片更新 */
    GroupCard = 'group_card',
  }
  /** 请求事件类型 */
  export const enum OB11RequestType {
    Friend = 'friend',
    Group = 'group',
  }
  interface FriendSender {
    /** 发送者 QQ 号 */
    user_id: number
    /** 昵称 不存在则为空字符串 */
    nickname: string
    /** 性别 */
    sex?: `${OB11Sex}`
    /** 年龄 */
    age?: number
    /** 群临时会话会有此字段 */
    group_id?: number
  }
  interface GroupSender {
    /** 发送者 QQ 号 */
    user_id: number
    /** 昵称 不存在则为空字符串 */
    nickname: string
    /** 性别 */
    sex?: `${OB11Sex}`
    /** 年龄 */
    age?: number
    /** 群名片/备注 */
    card?: string
    /** 地区 */
    area?: string
    /** 成员等级 */
    level?: number
    /** 角色 不存在则为空字符串 */
    role: 'owner' | 'admin' | 'member'
    /** 专属头衔 */
    title?: string
  }
  /** 所有事件基类 */
  interface OB11EventBase {
    /** 事件发生的时间戳 */
    time: number
    /** 事件类型 */
    post_type: OB11Event
    /** 收到事件的机器人 QQ 号 */
    self_id: number
  }
  /** 消息事件基类 */
  interface MessageBase$1 extends OB11EventBase {
    /** 事件类型 */
    post_type: OB11Event.Message | OB11Event.MessageSent
    /** 消息类型 */
    message_type: `${OB11MessageType}`
    /** 消息子类型 */
    sub_type: `${OB11MessageSubType}`
    /** 消息 ID */
    message_id: number
    /** 发送者 QQ 号 */
    user_id: number
    /** 消息内容 */
    message: OB11Segment[]
    /** 原始消息内容 */
    raw_message: string
    /** 字体 */
    font: number
  }
  /** 私聊消息事件 */
  interface OB11PrivateMessage extends MessageBase$1 {
    /** 消息类型 */
    message_type: 'private'
    /** 消息子类型 */
    sub_type: 'friend'
    /** 接收者QQ gocq-http拓展 */
    target_id?: number
    /** 临时会话来源 */
    temp_source?: number
    /** 发送人信息 */
    sender: FriendSender
  }
  /** 群临时消息事件 */
  interface OB11GroupTempMessage extends MessageBase$1 {
    /** 消息类型 */
    message_type: 'private'
    /** 消息子类型 */
    sub_type: 'group'
    /** 群号 */
    group_id: number
    /** 发送者 QQ 号 */
    user_id: number
    /** 消息内容 */
    message: OB11Segment[]
    /** 原始消息内容 */
    raw_message: string
    /** 字体 */
    font: number
    /** 临时会话来源 */
    temp_source?: number
    /** 发送人信息 */
    sender: FriendSender
  }
  /** 群消息事件 */
  interface OB11GroupMessage extends MessageBase$1 {
    /** 消息类型 */
    message_type: 'group'
    /** 消息子类型 */
    sub_type: 'normal' | 'anonymous' | 'notice'
    /** 群号 */
    group_id: number
    /** 发送人信息 */
    sender: GroupSender
  }
  /** 消息事件 */
  type OB11Message = OB11PrivateMessage | OB11GroupMessage | OB11GroupTempMessage
  /** 通知事件基类 */
  interface NoticeBase$1 extends OB11EventBase {
    /** 事件类型 */
    post_type: OB11Event.Notice
    /** 通知类型 */
    notice_type: OB11NoticeType
  }
  /** 群文件上传事件 */
  interface OneBot11GroupUpload extends NoticeBase$1 {
    /** 通知类型 */
    notice_type: OB11NoticeType.GroupUpload
    /** 群号 */
    group_id: number
    /** 发送者 QQ 号 */
    user_id: number
    /** 文件信息 */
    file: {
      /** 文件 ID */
      id: string
      /** 文件名 */
      name: string
      /** 文件大小（字节数） */
      size: number
      /** busid（目前不清楚有什么作用） */
      busid: number
    }
  }
  /** 群管理员变动事件 */
  interface OneBot11GroupAdmin extends NoticeBase$1 {
    /** 通知类型 */
    notice_type: OB11NoticeType.GroupAdmin
    /** 事件子类型，分别表示设置和取消管理员 */
    sub_type: 'set' | 'unset'
    /** 群号 */
    group_id: number
    /** 管理员 QQ 号 */
    user_id: number
  }
  /** 群减少事件 */
  interface OneBot11GroupDecrease extends NoticeBase$1 {
    /** 通知类型 */
    notice_type: OB11NoticeType.GroupDecrease
    /** 事件子类型，分别表示主动退群、成员被踢、登录号被踢 */
    sub_type: 'leave' | 'kick' | 'kick_me'
    /** 群号 */
    group_id: number
    /** 操作者 QQ 号（如果是主动退群，则和 user_id 相同） */
    operator_id: number
    /** 离开者 QQ 号 */
    user_id: number
  }
  /** 群增加事件 */
  interface OneBot11GroupIncrease extends NoticeBase$1 {
    /** 通知类型 */
    notice_type: OB11NoticeType.GroupIncrease
    /** 事件子类型，分别表示管理员已同意入群、管理员邀请入群 */
    sub_type: 'approve' | 'invite'
    /** 群号 */
    group_id: number
    /** 操作者 QQ 号 */
    operator_id: number
    /** 加入者 QQ 号 */
    user_id: number
  }
  /** 群禁言事件 */
  interface OneBot11GroupBan extends NoticeBase$1 {
    /** 通知类型 */
    notice_type: OB11NoticeType.GroupBan
    /** 事件子类型，分别表示禁言、解除禁言 */
    sub_type: 'ban' | 'lift_ban'
    /** 群号 */
    group_id: number
    /** 操作者 QQ 号 */
    operator_id: number
    /** 被禁言 QQ 号 */
    user_id: number
    /** 禁言时长，单位秒 */
    duration: number
  }
  /** 新添加好友事件 */
  interface OneBot11FriendAdd extends NoticeBase$1 {
    /** 通知类型 */
    notice_type: OB11NoticeType.FriendAdd
    /** 新添加好友 QQ 号 */
    user_id: number
  }
  /** 群撤回事件 */
  interface OneBot11GroupRecall extends NoticeBase$1 {
    /** 通知类型 */
    notice_type: OB11NoticeType.GroupRecall
    /** 群号 */
    group_id: number
    /** 消息发送者 QQ 号 */
    user_id: number
    /** 操作者 QQ 号 */
    operator_id: number
    /** 被撤回的消息 ID */
    message_id: number
  }
  /** 好友消息撤回事件 */
  interface OneBot11FriendRecall extends NoticeBase$1 {
    /** 通知类型 */
    notice_type: OB11NoticeType.FriendRecall
    /** 好友 QQ 号 */
    user_id: number
    /** 被撤回的消息 ID */
    message_id: number
  }
  /** 戳一戳事件 */
  interface OneBot11Poke extends NoticeBase$1 {
    /** 消息类型 */
    notice_type: OB11NoticeType.Notify
    /** 提示类型 */
    sub_type: 'poke'
    /** 群号 私聊不存在 */
    group_id?: number
    /** 发送者 QQ 号 */
    user_id: number
    /** 被戳者 QQ 号 */
    target_id: number
  }
  /** 运气王事件 */
  interface OneBot11LuckyKing extends NoticeBase$1 {
    /** 消息类型 */
    notice_type: OB11NoticeType.Notify
    /** 提示类型 */
    sub_type: 'lucky_king'
    /** 群号 */
    group_id: number
    /** 红包发送者 QQ 号 */
    user_id: number
    /** 运气王 QQ 号 */
    target_id: number
  }
  /** 荣誉变更事件 */
  interface OneBot11Honor extends NoticeBase$1 {
    /** 消息类型 */
    notice_type: OB11NoticeType.Notify
    /** 提示类型 */
    sub_type: 'honor'
    /** 群号 */
    group_id: number
    /** 荣誉类型，分别表示龙王、群聊之火、快乐源泉 */
    honor_type: 'talkative' | 'performer' | 'emotion'
    /** 成员 QQ 号 */
    user_id: number
  }
  /** 群表情回应事件 napcat、llonebot */
  interface OneBot11GroupMessageReaction extends NoticeBase$1 {
    /** 消息类型 */
    notice_type: OB11NoticeType.GroupMsgEmojiLike
    /** 群号 */
    group_id: number
    /** 发送者 QQ 号 */
    user_id: number
    /** 消息 ID */
    message_id: number
    /** 表情信息 */
    likes: Array<{
      count: number
      /** 表情ID参考: https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType */
      emoji_id: number
    }>
  }
  /** 群表情回应事件 Lagrange */
  interface OneBot11GroupMessageReactionLagrange extends NoticeBase$1 {
    /** 消息类型 */
    notice_type: OB11NoticeType.GroupMsgEmojiLikeLagrange
    /** 提示类型 */
    sub_type: 'remove' | 'add'
    /** 群号 */
    group_id: number
    /** 发送者 QQ 号 */
    operator_id: number
    /** 消息 ID */
    message_id: number
    /** 表情ID */
    code: string
    /** 表情数量 */
    count: number
  }
  /** 群精华 */
  interface OneBot11GroupEssence extends NoticeBase$1 {
    /** 通知类型 */
    notice_type: OB11NoticeType.GroupEssence
    /** 操作类型 */
    sub_type: 'add' | 'delete'
    /** 群号 */
    group_id: number
    /** 精华消息 ID */
    message_id: number
    /** 消息发送者 */
    sender_id: number
    /** 操作者id */
    operator_id: number
  }
  /** 群成员名片更新 */
  interface OneBot11GroupCard extends NoticeBase$1 {
    /** 通知类型 */
    time: number
    /** 事件类型 */
    self_id: number
    /** 事件类型 */
    post_type: OB11Event.Notice
    /** 群号 */
    group_id: number
    /** 用户ID */
    user_id: number
    /** 通知类型 */
    notice_type: OB11NoticeType.GroupCard
    /** 新名片 */
    card_new: string
    /** 旧名片 */
    card_old: string
  }
  /** 通知事件 */
  type OB11Notice = OneBot11GroupUpload | OneBot11GroupAdmin | OneBot11GroupDecrease | OneBot11GroupIncrease | OneBot11GroupBan | OneBot11FriendAdd | OneBot11GroupRecall | OneBot11FriendRecall | OneBot11Poke | OneBot11LuckyKing | OneBot11Honor | OneBot11GroupMessageReaction | OneBot11GroupMessageReactionLagrange | OneBot11GroupEssence | OneBot11GroupCard
  /** 请求事件基类 */
  interface RequestBase$1 extends OB11EventBase {
    /** 事件发生的时间戳 */
    time: number
    /** 事件类型 */
    post_type: OB11Event.Request
    /** 收到事件的机器人 QQ 号 */
    self_id: number
    /** 请求类型 */
    request_type: OB11RequestType.Friend | OB11RequestType.Group
    /** 请求 flag，在调用处理请求的 API 时需要传入 */
    flag: string
    /** 发送请求的 QQ 号 */
    user_id: number
    /** 验证信息 */
    comment: string
  }
  /** 好友请求事件 */
  interface OneBot11FriendRequest extends RequestBase$1 {
    /** 请求类型 */
    request_type: OB11RequestType.Friend
  }
  /** 群请求事件 */
  interface OneBot11GroupRequest extends RequestBase$1 {
    /** 请求类型 */
    request_type: OB11RequestType.Group
    /** 请求子类型，分别表示加群请求、邀请登录号入群 */
    sub_type: 'add' | 'invite'
    /** 群号 */
    group_id: number
  }
  /** 请求事件 */
  type OB11Request = OneBot11FriendRequest | OneBot11GroupRequest
  /** 元事件基类 */
  interface MetaEventBase extends OB11EventBase {
    /** 事件类型 */
    post_type: OB11Event.MetaEvent
    /** 元事件类型 */
    meta_event_type: 'lifecycle' | 'heartbeat'
  }
  /** 生命周期元事件 */
  interface OneBot11Lifecycle extends MetaEventBase {
    /** 元事件类型 */
    meta_event_type: 'lifecycle'
    /** 事件子类型，分别表示 OneBot 启用、停用、WebSocket 连接成功 */
    sub_type: 'enable' | 'disable' | 'connect'
  }
  /** 心跳元事件 */
  interface OneBot11Heartbeat extends MetaEventBase {
    /** 元事件类型 */
    meta_event_type: 'heartbeat'
    /** 状态信息 */
    status: {
      /** 到下次心跳的间隔，单位毫秒 */
      interval: number
    }
  }
  /** 元事件 */
  type OB11Meta = OneBot11Lifecycle | OneBot11Heartbeat
  /** 全部事件 */
  type OB11AllEvent = OB11Message | OB11Notice | OB11Request | OB11Meta

  /**
   * 适配器基类 一个示例
   * @class AdapterBase
   */
  export abstract class AdapterBase implements AdapterType {
    account: AdapterType['account']
    adapter: AdapterType['adapter']
    super: any
    raw: any
    constructor ()
    get selfId (): string
    get selfName (): string
    selfSubId (key: string): string
    /**
     * 打印当前Bot的专属日志
     * @param level 日志等级
     * @param args 日志内容
     */
    logger (level: LoggerLevel, ...args: any[]): void
    /**
     * 发送消息
     * @param contact 目标信息
     * @param elements 消息元素
     * @param retryCount 重试次数 默认为0
     */
    sendMsg (contact: Contact, elements: Array<Elements>, retryCount?: number): Promise<SendMsgResults>
    /**
     * 发送长消息
     * @param contact 目标信息
     * @param resId 资源ID
     */
    sendLongMsg (contact: Contact, resId: string): Promise<SendMsgResults>
    /**
     * 发送合并转发消息
     * @param contact 目标信息
     * @param elements 消息元素
     * @param options 首层小卡片外显参数
     */
    sendForwardMsg (contact: Contact, elements: Array<NodeElement>, options?: ForwardOptions): Promise<{
      messageId: string
      forwardId: string
    }>
    /**
     * 撤回消息
     * @param contact 目标信息
     * @param messageId 消息ID
     * @returns 此接口的返回值不值得信任
     */
    recallMsg (contact: Contact, messageId: string): Promise<boolean>
    /**
     * 获取头像url
     * @param userId 用户ID
     * @param size 头像大小，默认需要为`0`，请开发者注意
     * @returns 头像的url地址
     */
    getAvatarUrl (userId: string, size?: 0 | 40 | 100 | 140): Promise<string>
    /**
     * 获取群头像url
     * @param groupId 群号
     * @param size 头像大小，默认`0`
     * @param history 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
     * @returns 头像的url地址
     */
    getGroupAvatarUrl (groupId: string, size?: 0 | 40 | 100 | 140, history?: number): Promise<string>
    /**
     * 获取消息
     * @param contact 目标信息
     * @param messageId 消息ID
     * @returns MessageResponse对象
     */
    getMsg (contact: Contact, messageId: string): Promise<MessageResponse>
    /**
     * 获取msgId获取历史消息
     * @param contact 目标信息
     * @param startMsgId 起始消息ID
     * @param count 获取消息数量 默认为1
     * @returns 包含历史消息的数组
     */
    getHistoryMsg (contact: Contact, startMsgId: string, count: number): Promise<Array<MessageResponse>>
    /**
     * 获取合并转发消息
     * @param resId 资源ID
     * @returns 包含MessageResponse对象的数组
     */
    getForwardMsg (resId: string): Promise<Array<MessageResponse>>
    /**
     * 获取精华消息
     * @param groupId 群ID
     * @param page 页码
     * @param pageSize 每页数量
     * @returns EssenceMessageBody对象
     */
    getGroupHighlights (groupId: string, page: number, pageSize: number): Promise<Array<GetGroupHighlightsResponse>>
    /**
     * 构造一个资源ID 即上传合并转发消息后不进行发送
     * @param contact 目标信息
     * @param elements 转发消息元素
     * @description 此接口并不是所有协议端都支持的，因此在使用时请注意
     */
    createResId (contact: Contact, elements: Array<NodeElement>): Promise<string>
    /**
     * 设置、取消群精华消息
     * @param groupId 群ID
     * @param messageId 群消息ID
     * @param create true为添加精华消息，false为删除精华消息 默认为true
     */
    setGgroupHighlights (groupId: string, messageId: string, create: boolean): Promise<boolean>
    /**
     * 发送好友赞
     * @param targetId 目标ID
     * @param count 赞的次数
     * @returns 此接口的返回值不值得信任
     */
    sendLike (targetId: string, count: number): Promise<boolean>
    /**
     * 群踢人
     * @param groupId 群ID
     * @param targetId 被踢出目标的ID 任选其一
     * @param rejectAddRequest 是否拒绝再次申请，默认为false
     * @param kickReason 踢出原因，可选
     * @returns 此接口的返回值不值得信任
     */
    groupKickMember (groupId: string, targetId: string, rejectAddRequest?: boolean, kickReason?: string): Promise<boolean>
    /**
     * 禁言群成员
     * @param groupId 群ID
     * @param targetId 被禁言目标的ID 任选其一
     * @param duration 禁言时长 单位:秒
     * @returns 此接口的返回值不值得信任
     */
    setGroupMute (groupId: string, targetId: string, duration: number): Promise<boolean>
    /**
     * 群全员禁言
     * @param groupId 群ID
     * @param isBan 是否开启全员禁言
     * @returns 此接口的返回值不值得信任
     */
    setGroupAllMute (groupId: string, isBan: boolean): Promise<boolean>
    /**
     * 设置群管理员
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param isAdmin 是否设置为管理员
     * @returns 此接口的返回值不值得信任
     */
    setGroupAdmin (groupId: string, targetId: string, isAdmin: boolean): Promise<boolean>
    /**
     * 设置群名片
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param card 新的群名片
     * @returns 此接口的返回值不值得信任
     */
    setGroupMemberCard (groupId: string, targetId: string, card: string): Promise<boolean>
    /**
     * 设置群名
     * @param groupId 群ID
     * @param groupName 新的群名
     * @returns 此接口的返回值不值得信任
     */
    setGroupName (groupId: string, groupName: string): Promise<boolean>
    /**
     * 退出群组
     * @param groupId 群ID
     * @param isDismiss 如果Bot是群主，是否解散群
     * @returns 此接口的返回值不值得信任
     */
    setGroupQuit (groupId: string, isDismiss: boolean): Promise<boolean>
    /**
     * 设置群专属头衔 仅群主可用
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param title 新的专属头衔
     * @returns 此接口的返回值不值得信任
     */
    setGroupMemberTitle (groupId: string, targetId: string, title: string): Promise<boolean>
    /**
     * 获取陌生人信息 此接口数据无法保证完全正确并且无法保证数据的完整性
     * @param targetId 用户ID 任选其一
     * @returns 陌生人信息数组
     */
    getStrangerInfo (targetId: string): Promise<UserInfo$1>
    /**
     * 获取好友列表
     * @param refresh 是否刷新好友列表
     * @returns 好友列表数组
     */
    getFriendList (refresh?: boolean): Promise<Array<UserInfo$1>>
    /**
     * 获取群信息
     * @param groupId 群ID
     * @param noCache 是否刷新缓存
     * @returns 群信息
     */
    getGroupInfo (groupId: string, noCache?: boolean): Promise<GroupInfo>
    /**
     * 获取群列表
     * @param refresh 是否刷新好友列表
     * @returns 群列表数组
     */
    getGroupList (refresh?: boolean): Promise<Array<GroupInfo>>
    /**
     * 获取群成员信息
     * 此接口在非QQ平台上很难获取到标准信息，因此返回的数据可能会有所不同
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param refresh 是否刷新缓存
     * @returns 群成员信息
     */
    getGroupMemberInfo (groupId: string, targetId: string, refresh?: boolean): Promise<GroupMemberInfo>
    /**
     * 获取群成员列表
     * @param groupId 群ID
     * @param refresh 是否刷新缓存
     * @returns 群成员列表数组
     */
    getGroupMemberList (groupId: string, refresh?: boolean): Promise<Array<GroupMemberInfo>>
    /**
     * 获取群荣誉信息
     * @param groupId 群ID
     * @param refresh 是否刷新缓存
     * @returns 群荣誉信息数组
     */
    getGroupHonor (groupId: string): Promise<Array<QQGroupHonorInfo>>
    /**
     * 设置好友请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @param remark 好友备注 同意时有效
     * @returns 设置结果
     */
    setFriendApplyResult (requestId: string, isApprove: boolean, remark?: string): Promise<boolean>
    /**
     * 设置申请加入群请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @param denyReason 拒绝理由 拒绝时有效
     * @returns 此接口的返回值不值得信任
     */
    setGroupApplyResult (requestId: string, isApprove: boolean, denyReason?: string): Promise<boolean>
    /**
     * 设置邀请加入群请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @returns 此接口的返回值不值得信任
     */
    setInvitedJoinGroupResult (requestId: string, isApprove: boolean): Promise<boolean>
    /**
     * 设置消息表情回应
     * @param contact 目标信息
     * @param messageId 消息ID
     * @param faceId 表情ID
     * @returns 此接口的返回值不值得信任
     */
    setMsgReaction (contact: Contact, messageId: string, faceId: number, isSet: boolean): Promise<boolean>
    /**
     * 上传群文件、私聊文件
     * @param contact 目标信息
     * @param file 本地文件绝对路径
     * @param name 文件名称 必须提供
     * @param folder 父目录ID 不提供则上传到根目录 仅在群聊时有效
     * @returns 此接口的返回值不值得信任
     */
    uploadFile (contact: Contact, file: string, name: string, folder?: string): Promise<boolean>
    /**
     * 让协议端下载文件到协议端本地
     * @param options 下载文件的选项
     * @returns 下载文件的绝对路径和文件MD5
     */
    downloadFile (options?: DownloadFileOptions): Promise<DownloadFileResponse>
    /**
     * 创建群文件夹
     * @param groupId 群号
     * @param name 文件夹名
     * @returns 返回文件夹id和已使用空间
     */
    createGroupFolder (groupId: string, name: string): Promise<CreateGroupFolderResponse>
    /**
     * 重命名群文件的文件夹
     * @param groupId 群号
     * @param folderId 文件夹id
     * @param name 文件夹名
     * @returns 无返回值
     */
    renameGroupFolder (groupId: string, folderId: string, name: string): Promise<boolean>
    /**
     * 删除群文件的文件夹
     * @param groupId 群号
     * @param folderId 文件夹id
     * @returns 无返回值
     */
    delGroupFolder (groupId: string, folderId: string): Promise<boolean>
    /**
     * 上传群文件
     * @description 此接口仅可以在Bot和协议端在同一台设备上时使用
     * @param groupId 群号
     * @param file 文件绝对路径
     * @param name 文件名
     * @returns 无返回值
     */
    uploadGroupFile (groupId: string, file: string, name?: string): Promise<boolean>
    /**
     * 删除群文件
     * @param groupId 群号
     * @param fileId 文件id
     * @param busId 文件类型ID
     * @returns 无返回值
     */
    delGroupFile (groupId: string, fileId: string, busId: number): Promise<boolean>
    /**
     * 获取群文件系统信息
     * @param groupId 群号
     * @returns 返回文件数量、文件数量上限、已使用空间和空间上限
     */
    getGroupFileSystemInfo (groupId: string): Promise<GetGroupFileSystemInfoResponse>
    /**
     * 获取群文件夹下文件列表
     * @param groupId 群号
     * @param folderId 文件夹id，空则为根目录
     * @returns 返回文件和文件夹的列表
     */
    getGroupFileList (groupId: string, folderId?: string): Promise<GetGroupFileListResponse>
    /**
     * 设置群备注
     * @param groupId 群号
     * @param remark 新的备注
     * @returns 此接口的返回值不值得信任
     */
    setGroupRemark (groupId: string, remark: string): Promise<boolean>
    /**
     * 获取陌生群信息
     * @param groupId 群号
     */
    getNotJoinedGroupInfo (groupId: string): Promise<GroupInfo>
    /**
     * 获取艾特全体成员剩余次数
     * @param groupId 群号
     * @returns 返回是否允许at全体成员和全群剩余次数、个人剩余次数
     */
    getAtAllCount (groupId: string): Promise<GetAtAllCountResponse>
    /**
     * 获取群被禁言用户列表
     * @param groupId
     * @returns 返回禁言用户列表
     */
    getGroupMuteList (groupId: string): Promise<Array<GetGroupMuteListResponse>>
    /**
     * 戳一戳用户 支持群聊和私聊
     * @param contact 目标信息
     * @param count 戳一戳次数 默认为1
     * @returns 此接口的返回值不值得信任
     */
    pokeUser (contact: Contact, count?: number): Promise<boolean>
    /**
     * 获取 Cookies
     * @param domain The domain to get cookies from
     */
    getCookies (domain: string): Promise<{
      cookie: string
    }>
    /**
     * 获取 QQ 相关接口凭证
     * @param domain The domain to get credentials from
     */
    getCredentials (domain: string): Promise<{
      cookies: string
      csrf_token: number
    }>
    /**
     * 获取 CSRF Token
     * @param domain The domain to get the CSRF token from
     */
    getCSRFToken (domain: string): Promise<{
      token: number
    }>
    /**
     * 获取 HTTP Cookies
     * @param appid The appid
     * @param daid The daid
     * @param jumpUrl The jump url
     */
    getHttpCookies (appid: string, daid: string, jumpUrl: string): Promise<{
      cookie: string
    }>
  }

  export abstract class AdapterOneBot extends AdapterBase {
    protected constructor ()
    /**
     * 事件处理
     * @param data 事件数据对象
     * @param str 事件字符串
     */
    eventHandlers (data: OB11AllEvent, str: string): void
    /**
     * onebot11转karin
     * @return karin格式消息
     */
    AdapterConvertKarin (data: Array<OB11Segment>): Elements[]
    /**
     * karin转onebot11
     * @param data karin格式消息
     */
    KarinConvertAdapter (data: Array<SendElement>): OB11Segment[]
    /**
     * 获取头像url
     * @param userId 头像大小，默认`0`
     * @param size 头像大小，默认`0`
     * @returns 头像的url地址
     */
    getAvatarUrl (userId?: string, size?: number): Promise<string>
    /**
     * 获取群头像
     * @param groupId 群号
     * @param size 头像大小，默认`0`
     * @param history 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
     * @returns 群头像的url地址
     */
    getGroupAvatarUrl (groupId: string, size?: number, history?: number): Promise<string>
    /**
     * 发送消息
     * @param contact
     * @param elements
     * @returns 消息ID
     */
    sendMsg (contact: Contact, elements: Array<SendElement>, retryCount?: number): Promise<SendMsgResults>
    /**
     * 发送消息
     * @deprecated 已废弃，请使用`sendMsg`
     */
    SendMessage (contact: Contact, elements: Array<Elements>, retryCount?: number): Promise<SendMsgResults>
    /**
     * 发送长消息
     * @param contact 目标信息
     * @param resId 资源ID
     */
    sendLongMsg (contact: Contact, resId: string): Promise<{
      messageId: string
      messageTime: number
      rawData: {
        message_id: number
      }
      message_id: string
      message_time: number
      time: number
    }>
    /**
     * @deprecated 已废弃，请使用`sendLongMsg`
     */
    SendMessageByResId (contact: Contact, id: string): Promise<{
      messageId: string
      messageTime: number
      rawData: {
        message_id: number
      }
      message_id: string
      message_time: number
      time: number
    }>
    /**
     * 撤回消息
     * @param contact ob11无需提供contact参数
     * @param messageId 消息ID
     */
    recallMsg (contact: Contact, messageId: string): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`recallMsg`
     */
    RecallMessage (_contact: Contact, messageId: string): Promise<boolean>
    /**
     * 获取消息
     * @param contact 联系人信息
     * @param messageId 消息ID
     */
    getMsg (contact: Contact, messageId: string): Promise<{
      time: number
      messageId: string
      message_id: string
      message_seq: number
      messageSeq: number
      contact: {
        scene: 'group' | 'friend'
        peer: string
        sub_peer: null
        name: string
      }
      sender: {
        userId: string
        uid: string
        uin: number
        nick: string
        role: 'unknown'
        name: string
      }
      elements: Elements[]
    }>
    /**
     * @deprecated 已废弃，请使用`getMsg`
     */
    GetMessage (contact: Contact, messageId: string): Promise<{
      time: number
      messageId: string
      message_id: string
      message_seq: number
      messageSeq: number
      contact: {
        scene: 'group' | 'friend'
        peer: string
        sub_peer: null
        name: string
      }
      sender: {
        userId: string
        uid: string
        uin: number
        nick: string
        role: 'unknown'
        name: string
      }
      elements: Elements[]
    }>
    /**
     * 获取msgId获取历史消息
     * @param contact 目标信息
     * @param startMsgId 起始消息ID
     * @param count 获取消息数量 默认为1
     * @returns 包含历史消息的数组
     */
    getHistoryMsg (contact: Contact, startMsgId: string, count: number): Promise<{
      time: number
      messageId: string
      messageSeq: number
      message_id: string
      message_seq: number
      contact: Contact
      sender: {
        userId: string
        uid: string
        uin: number
        nick: string
        name: string
        role: 'unknown' | 'owner' | 'admin' | 'member'
        card: string
      }
      elements: Elements[]
    }[]>
    /**
     * 获取msg_id获取历史消息
     * @deprecated 已废弃，请使用`getHistoryMsg`
     */
    GetHistoryMessage (contact: Contact, startMessageId: string, count?: number): Promise<{
      time: number
      messageId: string
      messageSeq: number
      message_id: string
      message_seq: number
      contact: Contact
      sender: {
        userId: string
        uid: string
        uin: number
        nick: string
        name: string
        role: 'unknown' | 'owner' | 'admin' | 'member'
        card: string
      }
      elements: Elements[]
    }[]>
    /**
     * 发送好友赞
     * @param targetId 目标ID
     * @param count 赞的次数
     * @returns 此接口的返回值不值得信任
     */
    sendLike (targetId: string, count: number): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`sendLike`
     */
    VoteUser (targetId: string, voteCount?: number): Promise<boolean>
    /**
     * 群踢人
     * @param groupId 群ID
     * @param targetId 被踢出目标的ID 任选其一
     * @param rejectAddRequest 是否拒绝再次申请，默认为false
     * @param kickReason 踢出原因，可选
     * @returns 此接口的返回值不值得信任
     */
    groupKickMember (groupId: string, targetId: string, rejectAddRequest?: boolean, kickReason?: string): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`groupKickMember`
     */
    KickMember (groupId: string, targetId: string, rejectAddRequest?: boolean, kickReason?: string): Promise<boolean>
    /**
     * 禁言群成员
     * @param groupId 群ID
     * @param targetId 被禁言目标的ID 任选其一
     * @param duration 禁言时长 单位:秒
     * @returns 此接口的返回值不值得信任
     */
    setGroupMute (groupId: string, targetId: string, duration: number): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setGroupMute`
     */
    BanMember (groupId: string, targetId: string, duration: number): Promise<boolean>
    /**
     * 群全员禁言
     * @param groupId 群ID
     * @param isBan 是否开启全员禁言
     * @returns 此接口的返回值不值得信任
     */
    setGroupAllMute (groupId: string, isBan: boolean): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setGroupAllMute`
     */
    SetGroupWholeBan (groupId: string, isBan?: boolean): Promise<boolean>
    /**
     * 设置群管理员
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param isAdmin 是否设置为管理员
     * @returns 此接口的返回值不值得信任
     */
    setGroupAdmin (groupId: string, targetId: string, isAdmin: boolean): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setGroupAdmin`
     */
    SetGroupAdmin (groupId: string, targetId: string, isAdmin: boolean): Promise<boolean>
    /**
     * 设置群名片
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param card 新的群名片
     * @returns 此接口的返回值不值得信任
     */
    setGroupMemberCard (groupId: string, targetId: string, card: string): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setGroupMemberCard`
     */
    ModifyMemberCard (groupId: string, targetId: string, card: string): Promise<boolean>
    /**
     * 设置群名
     * @param groupId 群ID
     * @param groupName 新的群名
     * @returns 此接口的返回值不值得信任
     */
    setGroupName (groupId: string, groupName: string): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setGroupName`
     */
    ModifyGroupName (groupId: string, groupName: string): Promise<boolean>
    /**
     * 退出群组
     * @param groupId 群ID
     * @param isDismiss 如果Bot是群主，是否解散群
     * @returns 此接口的返回值不值得信任
     */
    setGroupQuit (groupId: string, isDismiss: boolean): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setGroupQuit`
     */
    LeaveGroup (groupId: string, isDismiss?: boolean): Promise<boolean>
    /**
     * 设置群专属头衔 仅群主可用
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param title 新的专属头衔
     * @returns 此接口的返回值不值得信任
     */
    setGroupMemberTitle (groupId: string, targetId: string, title: string): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setGroupMemberTitle`
     */
    SetGroupUniqueTitle (groupId: string, targetId: string, uniqueTitle: string): Promise<boolean>
    /**
     * 获取登录号信息
     * @deprecated 已废弃，请直接使用`this.account`
     */
    GetCurrentAccount (): Promise<{
      account_uid: string
      account_uin: string
      account_name: string
    }>
    /**
     * 获取陌生人信息
     * @param targetId 用户ID 任选其一
     * @returns 陌生人信息数组
     */
    getStrangerInfo (targetId: string): Promise<{
      userId: string
      user_id: string
      /** 用户UID */
      uid: string
      /** 用户UIN */
      uin: string
      /** qid */
      qid: string
      /** 名称 */
      nick: string
      /** 备注 */
      remark: string
      /** 用户等级 */
      level: number
      /** 生日 */
      birthday: string
      /** 登录天数 */
      login_day: number
      /** 点赞数 */
      vote_cnt: number
      /** 学校是否已核实 */
      is_school_verified: undefined
      /**
     * 年龄
     * 拓展字段
     */
      age: number | undefined
      /**
     * 性别
     * 拓展字段
     */
      sex: 'male' | 'female' | 'unknown'
      /** 大会员 */
      big_vip: undefined
      /** 好莱坞/腾讯视频会员 */
      hollywood_vip: undefined
      /** QQ会员 */
      qq_vip: boolean | undefined
      /** QQ超级会员 */
      super_vip: undefined
      /** 是否已经赞过 */
      voted: undefined
      nickname: string
      constellation?: number
      shengXiao?: number
      kBloodType?: number
      homeTown?: string
      makeFriendCareer?: number
      pos?: string
      college?: string
      country?: string
      province?: string
      city?: string
      postCode?: string
      address?: string
      regTime?: number
      reg_time?: number
      interest?: string
      labels?: string[]
      qqLevel?: number
      longNick?: string
      long_nick?: string
      birthday_year?: number
      birthday_month?: number
      birthday_day?: number
      eMail?: string
      phoneNum?: string
      categoryId?: number
      richTime?: number
      richBuffer?: Record<number, number>
      status?: number
      extStatus?: number
      batteryStatus?: number
      termType?: number
      netType?: number
      iconType?: number
      customStatus?: string | null
      setTime?: string
      specialFlag?: number
      abiFlag?: number
      eNetworkType?: number
      showName?: string
      termDesc?: string
      musicInfo?: {
        buf?: Record<string, unknown>
      }
      extOnlineBusinessInfo?: {
        buf?: Record<string, unknown>
        customStatus?: string | null
        videoBizInfo?: {
          cid?: string
          tvUrl?: string
          synchType?: string
        }
        videoInfo?: {
          name?: string
        }
      }
      extBuffer?: {
        buf?: Record<string, unknown>
      }
      is_vip?: boolean
      is_years_vip?: boolean
      vip_level?: number
      login_days?: number
    }>
    /**
     * 获取好友列表
     * @param refresh 是否刷新好友列表
     * @returns 好友列表数组
     */
    getFriendList (refresh?: boolean): Promise<{
      userId: string
      user_id: string
      /** 用户UID */
      uid: string
      /** 用户UIN */
      uin: string
      /** qid */
      qid: string
      /** 名称 */
      nick: string
      /** 备注 */
      remark: string
      /** 用户等级 */
      level: number
      /** 生日 */
      birthday: string
      /** 登录天数 */
      login_day: number
      /** 点赞数 */
      vote_cnt: number
      /** 学校是否已核实 */
      is_school_verified: undefined
      /**
       * 年龄
       * 拓展字段
       */
      age: number | undefined
      /**
       * 性别
       * 拓展字段
       */
      sex: 'male' | 'female' | 'unknown'
      /** 大会员 */
      big_vip: undefined
      /** 好莱坞/腾讯视频会员 */
      hollywood_vip: undefined
      /** QQ会员 */
      qq_vip: boolean | undefined
      /** QQ超级会员 */
      super_vip: undefined
      /** 是否已经赞过 */
      voted: undefined
      nickname: string
      constellation?: number
      shengXiao?: number
      kBloodType?: number
      homeTown?: string
      makeFriendCareer?: number
      pos?: string
      college?: string
      country?: string
      province?: string
      city?: string
      postCode?: string
      address?: string
      regTime?: number
      reg_time?: number
      interest?: string
      labels?: string[]
      qqLevel?: number
      longNick?: string
      long_nick?: string
      birthday_year?: number
      birthday_month?: number
      birthday_day?: number
      eMail?: string
      phoneNum?: string
      categoryId?: number
      richTime?: number
      richBuffer?: Record<number, number>
      status?: number
      extStatus?: number
      batteryStatus?: number
      termType?: number
      netType?: number
      iconType?: number
      customStatus?: string | null
      setTime?: string
      specialFlag?: number
      abiFlag?: number
      eNetworkType?: number
      showName?: string
      termDesc?: string
      musicInfo?: {
        buf?: Record<string, unknown>
      }
      extOnlineBusinessInfo?: {
        buf?: Record<string, unknown>
        customStatus?: string | null
        videoBizInfo?: {
          cid?: string
          tvUrl?: string
          synchType?: string
        }
        videoInfo?: {
          name?: string
        }
      }
      extBuffer?: {
        buf?: Record<string, unknown>
      }
      is_vip?: boolean
      is_years_vip?: boolean
      vip_level?: number
      login_days?: number
    }[]>
    /**
     * @deprecated 已废弃，请使用`getStrangerInfo`
     */
    GetStrangerProfileCard (targetId: Array<string>): Promise<{
      userId: string
      user_id: string
      /** 用户UID */
      uid: string
      /** 用户UIN */
      uin: string
      /** qid */
      qid: string
      /** 名称 */
      nick: string
      /** 备注 */
      remark: string
      /** 用户等级 */
      level: number
      /** 生日 */
      birthday: string
      /** 登录天数 */
      login_day: number
      /** 点赞数 */
      vote_cnt: number
      /** 学校是否已核实 */
      is_school_verified: undefined
      /**
     * 年龄
     * 拓展字段
     */
      age: number | undefined
      /**
     * 性别
     * 拓展字段
     */
      sex: 'male' | 'female' | 'unknown'
      /** 大会员 */
      big_vip: undefined
      /** 好莱坞/腾讯视频会员 */
      hollywood_vip: undefined
      /** QQ会员 */
      qq_vip: boolean | undefined
      /** QQ超级会员 */
      super_vip: undefined
      /** 是否已经赞过 */
      voted: undefined
      nickname: string
      constellation?: number
      shengXiao?: number
      kBloodType?: number
      homeTown?: string
      makeFriendCareer?: number
      pos?: string
      college?: string
      country?: string
      province?: string
      city?: string
      postCode?: string
      address?: string
      regTime?: number
      reg_time?: number
      interest?: string
      labels?: string[]
      qqLevel?: number
      longNick?: string
      long_nick?: string
      birthday_year?: number
      birthday_month?: number
      birthday_day?: number
      eMail?: string
      phoneNum?: string
      categoryId?: number
      richTime?: number
      richBuffer?: Record<number, number>
      status?: number
      extStatus?: number
      batteryStatus?: number
      termType?: number
      netType?: number
      iconType?: number
      customStatus?: string | null
      setTime?: string
      specialFlag?: number
      abiFlag?: number
      eNetworkType?: number
      showName?: string
      termDesc?: string
      musicInfo?: {
        buf?: Record<string, unknown>
      }
      extOnlineBusinessInfo?: {
        buf?: Record<string, unknown>
        customStatus?: string | null
        videoBizInfo?: {
          cid?: string
          tvUrl?: string
          synchType?: string
        }
        videoInfo?: {
          name?: string
        }
      }
      extBuffer?: {
        buf?: Record<string, unknown>
      }
      is_vip?: boolean
      is_years_vip?: boolean
      vip_level?: number
      login_days?: number
    }>
    /** 获取好友列表 */
    GetFriendList (): Promise<{
      userId: string
      user_id: string
      /** 用户UID */
      uid: string
      /** 用户UIN */
      uin: string
      /** qid */
      qid: string
      /** 名称 */
      nick: string
      /** 备注 */
      remark: string
      /** 用户等级 */
      level: number
      /** 生日 */
      birthday: string
      /** 登录天数 */
      login_day: number
      /** 点赞数 */
      vote_cnt: number
      /** 学校是否已核实 */
      is_school_verified: undefined
      /**
       * 年龄
       * 拓展字段
       */
      age: number | undefined
      /**
       * 性别
       * 拓展字段
       */
      sex: 'male' | 'female' | 'unknown'
      /** 大会员 */
      big_vip: undefined
      /** 好莱坞/腾讯视频会员 */
      hollywood_vip: undefined
      /** QQ会员 */
      qq_vip: boolean | undefined
      /** QQ超级会员 */
      super_vip: undefined
      /** 是否已经赞过 */
      voted: undefined
      nickname: string
      constellation?: number
      shengXiao?: number
      kBloodType?: number
      homeTown?: string
      makeFriendCareer?: number
      pos?: string
      college?: string
      country?: string
      province?: string
      city?: string
      postCode?: string
      address?: string
      regTime?: number
      reg_time?: number
      interest?: string
      labels?: string[]
      qqLevel?: number
      longNick?: string
      long_nick?: string
      birthday_year?: number
      birthday_month?: number
      birthday_day?: number
      eMail?: string
      phoneNum?: string
      categoryId?: number
      richTime?: number
      richBuffer?: Record<number, number>
      status?: number
      extStatus?: number
      batteryStatus?: number
      termType?: number
      netType?: number
      iconType?: number
      customStatus?: string | null
      setTime?: string
      specialFlag?: number
      abiFlag?: number
      eNetworkType?: number
      showName?: string
      termDesc?: string
      musicInfo?: {
        buf?: Record<string, unknown>
      }
      extOnlineBusinessInfo?: {
        buf?: Record<string, unknown>
        customStatus?: string | null
        videoBizInfo?: {
          cid?: string
          tvUrl?: string
          synchType?: string
        }
        videoInfo?: {
          name?: string
        }
      }
      extBuffer?: {
        buf?: Record<string, unknown>
      }
      is_vip?: boolean
      is_years_vip?: boolean
      vip_level?: number
      login_days?: number
    }[]>
    /**
     * 获取群信息
     * @param groupId 群ID
     * @param noCache 是否刷新缓存
     * @returns 群信息
     */
    getGroupInfo (groupId: string, noCache?: boolean): Promise<{
      groupId: string
      groupName: string
      groupRemark: string
      maxMemberCount: number
      memberCount: number
      groupDesc: string
      group_name: string
      group_remark: string
      max_member_count: number
      member_count: number
      group_uin: string
      admins: never[]
      owner: string
    }>
    /**
     * @deprecated 已废弃，请使用`getGroupInfo`
     */
    GetGroupInfo (_groupId: string, noCache?: boolean): Promise<{
      groupId: string
      groupName: string
      groupRemark: string
      maxMemberCount: number
      memberCount: number
      groupDesc: string
      group_name: string
      group_remark: string
      max_member_count: number
      member_count: number
      group_uin: string
      admins: never[]
      owner: string
    }>
    /**
     * 获取群列表
     * @param refresh 是否刷新好友列表
     * @returns 群列表数组
     */
    getGroupList (refresh?: boolean): Promise<{
      groupId: string
      groupName: string
      groupRemark: string
      maxMemberCount: number
      memberCount: number
      groupDesc: string
      group_name: string
      group_remark: string
      max_member_count: number
      member_count: number
      group_uin: string
      admins: never[]
      owner: string
    }[]>
    /**
     * 获取群列表
     * @deprecated 已废弃，请使用`getGroupList`
     */
    GetGroupList (): Promise<{
      groupId: string
      groupName: string
      groupRemark: string
      maxMemberCount: number
      memberCount: number
      groupDesc: string
      group_name: string
      group_remark: string
      max_member_count: number
      member_count: number
      group_uin: string
      admins: never[]
      owner: string
    }[]>
    /**
     * 获取群成员信息
     * 此接口在非QQ平台上很难获取到标准信息，因此返回的数据可能会有所不同
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param refresh 是否刷新缓存
     * @returns 群成员信息
     */
    getGroupMemberInfo (groupId: string, targetId: string, refresh?: boolean): Promise<{
      userId: string
      uid: string
      uin: string
      nick: string
      role: 'unknown' | 'owner' | 'admin' | 'member'
      age: number
      uniqueTitle: string
      card: string
      joinTime: number
      lastActiveTime: number
      level: number
      shutUpTime: number
      distance: undefined
      honors: never[]
      unfriendly: boolean
      sex: 'male' | 'female' | 'unknown'
      sender: GroupSender$1
      group_id: number
      user_id: number
      nickname: string
      area: string
      join_time: number
      last_sent_time: number
      title: string
      title_expire_time: number
      card_changeable: boolean
    }>
    /**
     * @deprecated 已废弃，请使用`getGroupMemberInfo`
     */
    GetGroupMemberInfo (groupId: string, targetId: string, refresh?: boolean): Promise<{
      userId: string
      uid: string
      uin: string
      nick: string
      role: 'unknown' | 'owner' | 'admin' | 'member'
      age: number
      uniqueTitle: string
      card: string
      joinTime: number
      lastActiveTime: number
      level: number
      shutUpTime: number
      distance: undefined
      honors: never[]
      unfriendly: boolean
      sex: 'male' | 'female' | 'unknown'
      sender: GroupSender$1
      group_id: number
      user_id: number
      nickname: string
      area: string
      join_time: number
      last_sent_time: number
      title: string
      title_expire_time: number
      card_changeable: boolean
    }>
    /**
     * 获取群成员列表
     * @param groupId 群ID
     * @param refresh 是否刷新缓存
     * @returns 群成员列表数组
     */
    getGroupMemberList (groupId: string, refresh?: boolean): Promise<{
      userId: string
      uid: string
      uin: string
      nick: string
      role: 'unknown' | 'owner' | 'admin' | 'member'
      age: number
      uniqueTitle: string
      card: string
      joinTime: number
      lastActiveTime: number
      level: number
      shutUpTime: number
      distance: undefined
      honors: never[]
      unfriendly: boolean
      sex: 'male' | 'female' | 'unknown'
      sender: GroupSender$1
      group_id: number
      user_id: number
      nickname: string
      area: string
      join_time: number
      last_sent_time: number
      title: string
      title_expire_time: number
      card_changeable: boolean
    }[]>
    /**
     * @deprecated 已废弃，请使用`getGroupMemberList`
     */
    GetGroupMemberList (groupId: string, refresh?: boolean): Promise<{
      userId: string
      uid: string
      uin: string
      nick: string
      role: 'unknown' | 'owner' | 'admin' | 'member'
      age: number
      uniqueTitle: string
      card: string
      joinTime: number
      lastActiveTime: number
      level: number
      shutUpTime: number
      distance: undefined
      honors: never[]
      unfriendly: boolean
      sex: 'male' | 'female' | 'unknown'
      sender: GroupSender$1
      group_id: number
      user_id: number
      nickname: string
      area: string
      join_time: number
      last_sent_time: number
      title: string
      title_expire_time: number
      card_changeable: boolean
    }[]>
    /**
     * 获取群荣誉信息
     * @param groupId 群ID
     * @param refresh 是否刷新缓存
     * @returns 群荣誉信息数组
     */
    getGroupHonor (groupId: string): Promise<QQGroupHonorInfo[]>
    /**
     * @deprecated 已废弃，请使用`getGroupHonor`
     */
    GetGroupHonor (groupId: string, refresh?: boolean): Promise<QQGroupHonorInfo[]>
    /**
     * 设置消息表情回应
     * @param contact 目标信息
     * @param messageId 消息ID
     * @param faceId 表情ID
     * @returns 此接口的返回值不值得信任
     */
    setMsgReaction (contact: Contact, messageId: string, faceId: number, isSet: boolean): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setMsgReaction`
     */
    ReactMessageWithEmoji (contact: Contact, messageId: string, faceId: number, isSet?: boolean): Promise<boolean>
    /**
     * 获取版本信息
     * @deprecated 已废弃，请使用`setMsgReaction`
     */
    GetVersion (): Promise<{
      name: string
      app_name: string
      version: string
      protocol: string
    }>
    DownloadForwardMessage (resId: string): Promise<any>
    /**
     * 获取精华消息
     * @param groupId 群ID
     * @param page 页码
     * @param pageSize 每页数量
     * @returns EssenceMessageBody对象
     */
    getGroupHighlights (groupId: string, page: number, pageSize: number): Promise<(GetGroupHighlightsResponse & {
      group_id: string
      sender_uid: string
      sender_uin: string
      sender_nick: string
      operator_uid: string
      operator_uin: string
      operator_nick: string
      operation_time: number
      message_time: number
      message_id: string
      message_seq: number
      json_elements: string
    })[]>
    /**
     * 精华消息
     * @deprecated 已废弃，请使用`getGroupHighlights`
     */
    GetEssenceMessageList (groupId: string, page: number, pageSize: number): Promise<(GetGroupHighlightsResponse & {
      group_id: string
      sender_uid: string
      sender_uin: string
      sender_nick: string
      operator_uid: string
      operator_uin: string
      operator_nick: string
      operation_time: number
      message_time: number
      message_id: string
      message_seq: number
      json_elements: string
    })[]>
    /**
     * 上传群文件、私聊文件
     * @param contact 目标信息
     * @param file 本地文件绝对路径
     * @param name 文件名称 必须提供
     * @param folder 父目录ID 不提供则上传到根目录 仅在群聊时有效
     * @returns 此接口的返回值不值得信任
     */
    uploadFile (contact: Contact, file: string, name: string, folder?: string): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`uploadFile`
     */
    UploadGroupFile (groupId: string, file: string, name: string, folder?: string): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`uploadFile`
     */
    UploadPrivateFile (userId: string, file: string, name: string): Promise<boolean>
    /**
     * 设置、取消群精华消息
     * @param groupId 群ID
     * @param messageId 群消息ID
     * @param create true为添加精华消息，false为删除精华消息 默认为true
     */
    setGgroupHighlights (groupId: string, messageId: string, create: boolean): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setGgroupHighlights`
     */
    SetEssenceMessage (_groupId: string, messageId: string): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setGgroupHighlights`
     */
    DeleteEssenceMessage (_groupId: string, messageId: string): Promise<boolean>
    PokeMember (groupId: string, targetId: string): Promise<void>
    /**
     * 设置好友请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @param remark 好友备注 同意时有效
     * @returns 设置结果
     */
    setFriendApplyResult (requestId: string, isApprove: boolean, remark?: string): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setFriendApplyResult`
     */
    SetFriendApplyResult (requestId: string, isApprove: boolean, remark?: string): Promise<boolean>
    /**
     * 设置申请加入群请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @param denyReason 拒绝理由 拒绝时有效
     * @returns 此接口的返回值不值得信任
     */
    setGroupApplyResult (requestId: string, isApprove: boolean, denyReason?: string): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setGroupApplyResult`
     */
    SetGroupApplyResult (requestId: string, isApprove: boolean, denyReason?: string): Promise<boolean>
    /**
     * 设置邀请加入群请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @returns 此接口的返回值不值得信任
     */
    setInvitedJoinGroupResult (requestId: string, isApprove: boolean): Promise<boolean>
    /**
     * @deprecated 已废弃，请使用`setInvitedJoinGroupResult`
     */
    SetInvitedJoinGroupResult (requestId: string, isApprove: boolean, denyReason?: string): Promise<boolean>
    /**
     * 合并转发 karin -> adapter
     * @param elements 消息元素
     * @returns 适配器消息元素
     */
    forwardKarinConvertAdapter (elements: Array<NodeElement>): Array<OB11NodeSegment>
    /**
     * 发送合并转发消息
     * @param contact 目标信息
     * @param elements 消息元素
     * @param options 首层小卡片外显参数
     */
    sendForwardMsg (contact: Contact, elements: NodeElement[], options?: ForwardOptions): Promise<{
      messageId: string
      forwardId: string
      message_id: string
    }>
    /**
     * @deprecated 已废弃，请使用`sendForwardMsg`
     */
    sendForwardMessage (contact: Contact, elements: NodeElement[]): Promise<{
      messageId: string
      forwardId: string
      message_id: string
    }>
    /**
     * 发送API请求
     * @param action API端点
     * @param params API参数
     */
    sendApi<T extends keyof Params> (action: T | `${T}`, params: Params[T], time?: number): Promise<Request$1[T]>
    /**
     * 发送API请求
     * @deprecated 已废弃，请使用`sendApi`
     */
    SendApi<T extends keyof Params> (action: T, params: Params[T], time?: number): Promise<Request$1[T]>
  }

  /** 适配器类型 */
  interface AdapterType {
    /** 原生方法 请自行as为对应的适配器类型 */
    super: any
    /** 原生方法 请自行as为对应的适配器类型 */
    raw: any
    /**
     * onebot专属方法
     * @param action 请求的方法
     * @param params 请求的参数
     * @param time 超时时间 默认为120s
     */
    sendApi?: <T extends keyof Params>(action: `${T}`, params: Params[T], time?: number) => Promise<Request$1[T]>
    /** 适配器信息 */
    adapter: AdapterInfo
    /** 账号信息 */
    account: AccountInfo
    /** 获取Bot的id */
    get selfId (): string
    /** 获取Bot的name */
    get selfName (): string
    /**
     * 获取Bot的subId
     * @param key 子ID的key
     */
    selfSubId (key: string): string
    /**
     * 打印当前Bot的专属日志
     * @param level 日志等级
     * @param args 日志内容
     */
    logger (level: LoggerLevel, ...args: any[]): void
    /**
     * 发送消息
     * @param contact 目标信息
     * @param elements 消息元素
     * @param retryCount 重试次数 默认为0
     */
    sendMsg (contact: Contact, elements: Array<SendElement>, retryCount?: number): Promise<SendMsgResults>
    /**
     * 发送长消息
     * @param contact 目标信息
     * @param resId 资源ID
     */
    sendLongMsg (contact: Contact, resId: string): Promise<SendMsgResults>
    /**
     * 发送合并转发消息
     * @param contact 目标信息
     * @param elements 消息元素
     * @param options 首层小卡片外显参数
     */
    sendForwardMsg (contact: Contact, elements: Array<NodeElement>, options?: ForwardOptions): Promise<{
      messageId: string
    }>
    /**
     * 撤回消息
     * @param contact 目标信息
     * @param messageId 消息ID
     * @returns 此接口的返回值不值得信任
     */
    recallMsg (contact: Contact, messageId: string): Promise<boolean>
    /**
     * 获取头像url
     * @param userId 用户ID
     * @param size 头像大小，默认需要为`0`，请开发者注意
     * @returns 头像的url地址
     */
    getAvatarUrl (userId: string, size?: 0 | 40 | 100 | 140): Promise<string>
    /**
     * 获取群头像url
     * @param groupId 群号
     * @param size 头像大小，默认`0`
     * @param history 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
     * @returns 头像的url地址
     */
    getGroupAvatarUrl (groupId: string, size?: 0 | 40 | 100 | 140, history?: number): Promise<string>
    /**
     * 获取消息
     * @param contact 目标信息
     * @param messageId 消息ID
     * @returns MessageResponse对象
     */
    getMsg (contact: Contact, messageId: string): Promise<MessageResponse>
    /**
     * 获取msgId获取历史消息
     * @param contact 目标信息
     * @param startMsgId 起始消息ID
     * @param count 获取消息数量 默认为1
     * @returns 包含历史消息的数组
     */
    getHistoryMsg (contact: Contact, startMsgId: string, count: number): Promise<Array<MessageResponse>>
    /**
     * 获取合并转发消息
     * @param resId 资源ID
     * @returns 包含MessageResponse对象的数组
     */
    getForwardMsg (resId: string): Promise<Array<MessageResponse>>
    /**
     * 获取精华消息
     * @param groupId 群ID
     * @param page 页码
     * @param pageSize 每页数量
     * @returns EssenceMessageBody对象
     */
    getGroupHighlights (groupId: string, page: number, pageSize: number): Promise<Array<GetGroupHighlightsResponse>>
    /**
     * 构造一个资源ID 即上传合并转发消息后不进行发送
     * @param contact 目标信息
     * @param elements 转发消息元素
     * @description 此接口并不是所有协议端都支持的，因此在使用时请注意
     */
    createResId (contact: Contact, elements: Array<NodeElement>): Promise<string>
    /**
     * 设置、取消群精华消息
     * @param groupId 群ID
     * @param messageId 群消息ID
     * @param create true为添加精华消息，false为删除精华消息 默认为true
     */
    setGgroupHighlights (groupId: string, messageId: string, create: boolean): Promise<boolean>
    /**
     * 发送好友赞
     * @param targetId 目标ID
     * @param count 赞的次数，默认为10
     * @returns 此接口的返回值不值得信任
     */
    sendLike (targetId: string, count: number): Promise<boolean>
    /**
     * 群踢人
     * @param groupId 群ID
     * @param targetId 被踢出目标的ID 任选其一
     * @param rejectAddRequest 是否拒绝再次申请，默认为false
     * @param kickReason 踢出原因，可选
     * @returns 此接口的返回值不值得信任
     */
    groupKickMember (groupId: string, targetId: string, rejectAddRequest?: boolean, kickReason?: string): Promise<boolean>
    /**
     * 禁言群成员
     * @param groupId 群ID
     * @param targetId 被禁言目标的ID 任选其一
     * @param duration 禁言时长 单位:秒
     * @returns 此接口的返回值不值得信任
     */
    setGroupMute (groupId: string, targetId: string, duration: number): Promise<boolean>
    /**
     * 群全员禁言
     * @param groupId 群ID
     * @param isBan 是否开启全员禁言
     * @returns 此接口的返回值不值得信任
     */
    setGroupAllMute (groupId: string, isBan: boolean): Promise<boolean>
    /**
     * 设置群管理员
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param isAdmin 是否设置为管理员
     * @returns 此接口的返回值不值得信任
     */
    setGroupAdmin (groupId: string, targetId: string, isAdmin: boolean): Promise<boolean>
    /**
     * 设置群名片
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param card 新的群名片
     * @returns 此接口的返回值不值得信任
     */
    setGroupMemberCard (groupId: string, targetId: string, card: string): Promise<boolean>
    /**
     * 设置群名
     * @param groupId 群ID
     * @param groupName 新的群名
     * @returns 此接口的返回值不值得信任
     */
    setGroupName (groupId: string, groupName: string): Promise<boolean>
    /**
     * 退出群组
     * @param groupId 群ID
     * @param isDismiss 如果Bot是群主，是否解散群
     * @returns 此接口的返回值不值得信任
     */
    setGroupQuit (groupId: string, isDismiss: boolean): Promise<boolean>
    /**
     * 设置群专属头衔 仅群主可用
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param title 新的专属头衔
     * @returns 此接口的返回值不值得信任
     */
    setGroupMemberTitle (groupId: string, targetId: string, title: string): Promise<boolean>
    /**
     * 获取陌生人信息
     * @param targetId 用户ID 任选其一
     * @returns 陌生人信息数组
     */
    getStrangerInfo (targetId: string): Promise<UserInfo$1>
    /**
     * 获取好友列表
     * @param refresh 是否刷新好友列表
     * @returns 好友列表数组
     */
    getFriendList (refresh?: boolean): Promise<Array<UserInfo$1>>
    /**
     * 获取群信息
     * @param groupId 群ID
     * @param noCache 是否刷新缓存
     * @returns 群信息
     */
    getGroupInfo (groupId: string, noCache?: boolean): Promise<GroupInfo>
    /**
     * 获取群列表
     * @param refresh 是否刷新好友列表
     * @returns 群列表数组
     */
    getGroupList (refresh?: boolean): Promise<Array<GroupInfo>>
    /**
     * 获取群成员信息
     * 此接口在非QQ平台上很难获取到标准信息，因此返回的数据可能会有所不同
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param refresh 是否刷新缓存
     * @returns 群成员信息
     */
    getGroupMemberInfo (groupId: string, targetId: string, refresh?: boolean): Promise<GroupMemberInfo>
    /**
     * 获取群成员列表
     * @param groupId 群ID
     * @param refresh 是否刷新缓存
     * @returns 群成员列表数组
     */
    getGroupMemberList (groupId: string, refresh?: boolean): Promise<Array<GroupMemberInfo>>
    /**
     * 获取群荣誉信息
     * @param groupId 群ID
     * @returns 群荣誉信息数组
     */
    getGroupHonor (groupId: string): Promise<Array<QQGroupHonorInfo>>
    /**
     * 设置好友请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @param remark 好友备注 同意时有效
     * @returns 设置结果
     */
    setFriendApplyResult (requestId: string, isApprove: boolean, remark?: string): Promise<boolean>
    /**
     * 设置申请加入群请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @param denyReason 拒绝理由 拒绝时有效
     * @returns 此接口的返回值不值得信任
     */
    setGroupApplyResult (requestId: string, isApprove: boolean, denyReason?: string): Promise<boolean>
    /**
     * 设置邀请加入群请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @returns 此接口的返回值不值得信任
     */
    setInvitedJoinGroupResult (requestId: string, isApprove: boolean): Promise<boolean>
    /**
     * 设置消息表情回应
     * @param contact 目标信息
     * @param messageId 消息ID
     * @param faceId 表情ID
     * @returns 此接口的返回值不值得信任
     */
    setMsgReaction (contact: Contact, messageId: string, faceId: number, isSet: boolean): Promise<boolean>
    /**
     * 上传群文件、私聊文件
     * @param contact 目标信息
     * @param file 本地文件绝对路径
     * @param name 文件名称 必须提供
     * @param folder 父目录ID 不提供则上传到根目录 仅在群聊时有效
     * @returns 此接口的返回值不值得信任
     */
    uploadFile (contact: Contact, file: string, name: string, folder?: string): Promise<boolean>
    /**
     * 让协议端下载文件到协议端本地
     * @param options 下载文件的选项
     * @returns 下载文件的绝对路径和文件MD5
     */
    downloadFile (options?: DownloadFileOptions): Promise<DownloadFileResponse>
    /**
     * 创建群文件夹
     * @param groupId 群号
     * @param name 文件夹名
     * @returns 返回文件夹id和已使用空间
     */
    createGroupFolder (groupId: string, name: string): Promise<CreateGroupFolderResponse>
    /**
     * 重命名群文件的文件夹
     * @param groupId 群号
     * @param folderId 文件夹id
     * @param name 文件夹名
     * @returns 无返回值
     */
    renameGroupFolder (groupId: string, folderId: string, name: string): Promise<boolean>
    /**
     * 删除群文件的文件夹
     * @param groupId 群号
     * @param folderId 文件夹id
     * @returns 无返回值
     */
    delGroupFolder (groupId: string, folderId: string): Promise<boolean>
    /**
     * 上传群文件
     * @description 此接口仅可以在Bot和协议端在同一台设备上时使用
     * @param groupId 群号
     * @param file 文件绝对路径
     * @param name 文件名
     * @returns 无返回值
     */
    uploadGroupFile (groupId: string, file: string, name?: string): Promise<boolean>
    /**
     * 删除群文件
     * @param groupId 群号
     * @param fileId 文件id
     * @param busId 文件类型ID
     * @returns 无返回值
     */
    delGroupFile (groupId: string, fileId: string, busId: number): Promise<boolean>
    /**
     * 获取群文件系统信息
     * @param groupId 群号
     * @returns 返回文件数量、文件数量上限、已使用空间和空间上限
     */
    getGroupFileSystemInfo (groupId: string): Promise<GetGroupFileSystemInfoResponse>
    /**
     * 获取群文件夹下文件列表
     * @param groupId 群号
     * @param folderId 文件夹id，空则为根目录
     * @returns 返回文件和文件夹的列表
     */
    getGroupFileList (groupId: string, folderId?: string): Promise<GetGroupFileListResponse>
    /**
     * 设置群备注
     * @param groupId 群号
     * @param remark 新的备注
     * @returns 此接口的返回值不值得信任
     */
    setGroupRemark (groupId: string, remark: string): Promise<boolean>
    /**
     * 获取陌生群信息
     * @param groupId 群号
     */
    getNotJoinedGroupInfo?(groupId: string): Promise<GroupInfo>
    /**
     * 获取艾特全体成员剩余次数
     * @param groupId 群号
     * @returns 返回是否允许at全体成员和全群剩余次数、个人剩余次数
     */
    getAtAllCount (groupId: string): Promise<GetAtAllCountResponse>
    /**
     * 获取群被禁言用户列表
     * @param groupId
     * @returns 返回禁言用户列表
     */
    getGroupMuteList (groupId: string): Promise<Array<GetGroupMuteListResponse>>
    /**
     * 戳一戳用户 支持群聊和私聊
     * @param contact 目标信息
     * @param count 戳一戳次数 默认为1
     * @returns 此接口的返回值不值得信任
     */
    pokeUser (contact: Contact, count?: number): Promise<boolean>
    /**
     * 获取 Cookies
     * @param domain The domain to get cookies from
     */
    getCookies (domain: string): Promise<{
      cookie: string
    }>
    /**
     * 获取 QQ 相关接口凭证
     * @param domain The domain to get credentials from
     */
    getCredentials (domain: string): Promise<{
      cookies: string
      csrf_token: number
    }>
    /**
     * 获取 CSRF Token
     * @param domain The domain to get the CSRF token from
     */
    getCSRFToken (domain: string): Promise<{
      token: number
    }>
    /**
     * 获取 HTTP Cookies
     * @param appid The appid
     * @param daid The daid
     * @param jumpUrl The jump url
     */
    getHttpCookies (appid: string, daid: string, jumpUrl: string): Promise<{
      cookie: string
    }>
  }

  /** 快速回复源函数 适配器实现 */
  type SrcReply = (
    /** 发送的消息 */
    elements: Elements[]) => Promise<SendMsgResults> | SendMsgResults
  /** 快速回复函数 */
  type Reply = (
    /** 发送的消息 */
    elements: SendMessage,
    /** 发送消息选项 */
    options?: {
      /** 是否@发送者 */
      at?: boolean
      /** 是否引用回复发送者 */
      reply?: boolean
      /** 撤回消息时间 默认为0不撤回 */
      recallMsg?: number
      /** 重试次数 默认为0 */
      retryCount?: number
    }) => Promise<SendMsgResults> | SendMsgResults

  /** 通知事件: 收到点赞 */
  interface ReceiveLikeType {
    /** 点赞者id */
    operatorId: string
    /** 点赞者数量 */
    count: number
  }
  /** 通知事件: 新增好友 */
  interface FriendIncreaseType {
    /** 新好友id */
    targetId: string
  }
  /** 通知事件: 好友减少 */
  interface FriendDecreaseType {
    /** 减少的好友id */
    targetId: string
  }
  /** 通知事件: 私聊戳一戳 */
  interface PrivatePokeType {
    /** 操作者id */
    operatorId: string
    /** 被戳者id */
    targetId: string
    /** 操作名称，如“戳了戳” */
    action: string
    /** 后缀，未设置则未空字符串 */
    suffix: string
    /** 操作图标url */
    actionImage: string
  }
  /** 通知事件: 私聊撤回消息 */
  interface PrivateRecallType {
    /** 操作者id */
    operatorId: string
    /** 撤回的消息id */
    messageId: string
    /** 操作提示，如“撤回了一条消息”  一般此项为空字符串 */
    tips: string
  }
  /**
   * 通知事件: 私聊文件上传
   * 文件信息最少需要提供一个url
   */
  interface PrivateFileUploadedType {
    /** 操作者id */
    operatorId: string
    /** 文件ID 此项没有则为空字符串 */
    fid: string
    /** 文件子ID 此项没有则为空字符串 */
    subId: number
    /** 文件名 此项没有则为空字符串 */
    name: string
    /** 文件大小 此项没有则为0 */
    size: number
    /** 过期时间 此项没有则为0 */
    expireTime: number
    /** 文件URL */
    url: string
  }
  /** 通知事件: 群聊戳一戳 */
  interface GroupPokeType {
    /** 操作者id */
    operatorId: string
    /** 操作名称，如“戳了戳” */
    action: string
    /** 后缀，未设置则未空字符串 */
    suffix: string
    /** 操作图标url */
    actionImage: string
    /** 被戳目标id */
    targetId: string
  }
  /**
   * 通知事件: 群聊撤回
   * 撤回自己消息时，operator和target为自己
   * 撤回别人消息时，operator为操作者，target为被撤回者
   */
  interface GroupRecallType {
    /** 操作者id */
    operatorId: string
    /** 目标id 撤回自己消息为自己 否则是被撤回者 */
    targetId: string
    /** 撤回的消息id */
    messageId: string
    /** 操作提示，如“撤回了一条消息”  一般此项为空字符串 */
    tip: string
  }
  /**
   * 通知事件: 群文件上传
   * 文件信息最少需要提供一个url
   */
  interface GroupFileUploadedType {
    /** 文件ID */
    fid: string
    /** 文件子ID */
    subId: number
    /** 文件名 */
    name: string
    /** 文件大小 */
    size: number
    /** 过期时间 */
    expireTime?: number
    /** 文件URL */
    url?: string
  }
  /** 通知事件: 群名片变动 */
  interface GroupCardChangedType {
    /** 操作者id */
    operatorId: string
    /** 目标id */
    targetId: string
    /** 新名片 */
    newCard: string
  }
  /** 通知事件: 群成员头衔变动 */
  interface GroupMemberUniqueTitleChangedType {
    /** 目标id */
    targetId: string
    /** 新头衔 */
    title: string
  }
  /** 通知事件: 群精华消息变动 */
  interface GroupHlightsChangedType {
    /** 操作者id */
    operatorId: string
    /** 发送者id */
    senderId: string
    /** 被操作的消息id */
    messageId: string
    /** 设置、取消精华 */
    isSet: boolean
  }
  /** 通知事件: 群成员增加 */
  interface GroupMemberIncreaseType {
    /** 操作者id */
    operatorId: string
    /** 加入者id */
    targetId: string
    /** 加入方式 APPROVE:管理员批准 INVITE:管理员邀请 */
    type: 'invite' | 'approve'
  }
  /** 通知事件: 群成员减少 */
  interface GroupMemberDecreaseType {
    /** 操作者id */
    operatorId: string
    /** 目标id */
    targetId: string
    /** 减少方式 leave:主动退群 kick:成员被踢 kickBot:机器人自身被踢 */
    type: 'leave' | 'kick' | 'kickBot'
  }
  /** 通知事件: 群管理员变动 */
  interface GroupAdminChangedType {
    /** 目标id */
    targetId: string
    /** 设置、取消管理员 */
    isAdmin: boolean
  }
  /** 通知事件: 群打卡 */
  interface GroupSignInType {
    /** 目标id */
    targetId: string
    /** 操作名称，如“打卡了” */
    action: string
    /** 打卡图标url */
    rankImage: string
  }
  /** 通知事件: 群成员被禁言 */
  interface GroupMemberBanType {
    /** 操作者id */
    operatorId: string
    /** 目标id */
    targetId: string
    /** 禁言时长，单位秒 */
    duration: number
    /** 是否为禁言 */
    isBan: boolean
  }
  /** 通知事件: 群全员禁言 */
  interface GroupWholeBanType {
    /** 操作者id */
    operatorId: string
    /** 是否开启全体禁言 */
    isBan: boolean
  }
  /** 通知事件: 群表情动态 */
  interface GroupMessageReactionType {
    /** 消息ID */
    messageId: string
    /** 表情ID 参考: https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html#EmojiType */
    faceId: number
    /** 数量 */
    count: number
    /** 添加、取消回应 */
    isSet: boolean
  }
  /** 通知事件: 群聊运气王 */
  interface GroupLuckKingType {
    /** 红包发送者id */
    userId: string
    /** 运气王id */
    targetId: string
  }
  /** 通知事件: 群聊荣誉变更事件 */
  interface GroupHonorChangedType {
    /** 荣誉类型，分别表示龙王、群聊之火、快乐源泉 */
    honorType: 'talkative' | 'performer' | 'emotion'
  }
  /** 请求事件: 好友申请 */
  interface PrivateApplyType {
    /** 申请者id */
    applierId: string
    /** 验证信息 */
    message: string
    /** 请求 flag，在调用处理请求的 API 时需要传入 */
    flag: string
  }
  /** 请求事件: 新成员申请加入群聊申请 */
  interface GroupApply {
    /** 申请者id */
    applierId: string
    /** 邀请者id */
    inviterId: string
    /** 申请理由 */
    reason: string
    /** 请求 flag，在调用处理请求的 API 时需要传入 */
    flag: string
    /** 群id */
    groupId: string
  }
  /** 请求事件: 邀请Bot加入群聊 */
  interface GroupInvite {
    /** 邀请者id */
    inviterId: string
    /** 请求 flag，在调用处理请求的 API 时需要传入 */
    flag: string
  }

  /**
   * 事件父类型
   * - `message`: 消息事件
   * - `notice`: 通知事件
   * - `request`: 请求事件
   */
  type EventParent = 'message' | 'notice' | 'request'
  /**
   * `消息`事件子类型
   * - `group`: 群消息
   * - `friend`: 好友消息
   * - `guild`: 频道消息
   * - `direct`: 频道私信
   * - `groupTemp`: 群临时会话
   */
  type MessageEventSub = 'group' | 'friend' | 'guild' | 'direct' | 'groupTemp'
  /**
   * `通知`事件子类型
   * - `receiveLike`: 收到点赞
   * - `friendPoke`: 好友戳一戳
   * - `friendRecall`: 好友撤回消息
   * - `friendFileUploaded`: 好友发送文件
   * - `friendIncrease`: 好友增加
   * - `friendDecrease`: 好友减少
   *
   * - `groupPoke`: 群聊戳一戳
   * - `groupCardChanged`: 群聊名片变动
   * - `groupMemberTitleUpdate`: 群聊成员头衔变动
   * - `groupHighlightsChange`: 群聊精华消息变动
   * - `groupRecall`: 群聊撤回消息
   * - `groupMemberAdd`: 群聊成员增加
   * - `groupMemberRemove`: 群聊成员减少
   * - `groupAdminChanged`: 群聊管理员变动
   * - `groupMemberBan`: 群聊成员禁言
   * - `groupSignIn`: 群聊签到
   * - `groupWholeBan`: 群聊全员禁言
   * - `groupFileUploaded`: 群聊发送文件
   * - `groupMessageReaction`: 群聊消息表情动态回应
   * - `groupLuckyKing`: 群聊运气王事件
   * - `groupHonorChange`: 群聊荣誉变更事件
   */
  type NoticeEventSub =
    /** 收到点赞 */
    'receiveLike'
    /** 好友戳一戳 */
    | 'friendPoke'
    /** 好友撤回消息 */
    | 'friendRecall'
    /** 好友发送文件 */
    | 'friendFileUploaded'
    /** 好友增加 */
    | 'friendIncrease'
    /** 好友减少 */
    | 'friendDecrease'
    /** 群聊戳一戳 */
    | 'groupPoke'
    /** 群聊名片变动 */
    | 'groupCardChanged'
    /** 群聊成员头衔变动 */
    | 'groupMemberTitleUpdate'
    /** 群聊精华消息变动 */
    | 'groupHighlightsChange'
    /** 群聊撤回消息 */
    | 'groupRecall'
    /** 群聊成员增加 */
    | 'groupMemberAdd'
    /** 群聊成员减少 */
    | 'groupMemberRemove'
    /** 群聊管理员变动 */
    | 'groupAdminChanged'
    /** 群聊成员禁言 */
    | 'groupMemberBan'
    /** 群聊签到 */
    | 'groupSignIn'
    /** 群聊全员禁言 */
    | 'groupWholeBan'
    /** 群聊发送文件 */
    | 'groupFileUploaded'
    /** 群聊消息表情动态回应 */
    | 'groupMessageReaction'
    /** 群聊运气王事件 */
    | 'groupLuckyKing'
    /** 群聊荣誉变更事件 */
    | 'groupHonorChange'
  /**
   * `请求`事件子类型
   * - `friendApply`: 收到添加Bot为好友请求
   * - `groupApply`: 收到用户申请加入群聊请求
   * - `groupInvite`: 收到邀请Bot加入群聊请求
   */
  type RequestEventSub = 'friendApply' | 'groupApply' | 'groupInvite'
  /**
   * 事件父类型与子类型的映射
   */
  interface EventToSubEvent {
    message: MessageEventSub
    notice: NoticeEventSub
    request: RequestEventSub
  }
  /**
   * 事件基类定义
   * @description 所有的事件都拥有这些基本属性
   */
  interface BaseEventType<T extends EventParent> {
    /** 机器人ID */
    selfId: string
    /** 用户ID */
    userId: string
    /** 事件类型 */
    event: T
    /** 事件子类型 */
    subEvent: EventToSubEvent[T]
    /** 事件ID */
    eventId: string
    /** 原始事件 */
    rawEvent: any
    /** 事件触发时间戳 */
    time: number
    /** 事件联系人信息 */
    contact: Contact
    /** 事件发送者信息 */
    sender: Sender
    /** 快速回复源函数 适配器实现 */
    srcReply: SrcReply
    /** bot自身实例 所有标准Api都通过这里调用 */
    bot: AdapterType
  }
  /** 事件基类参数 */
  type BaseEventOptions<T extends EventParent> = Omit<BaseEventType<T>, 'userId' | 'selfId'>
  /** 创建消息事件类所需参数类型 */
  type MessageOptions = Omit<BaseEventOptions<'message'>, 'event'> & {
    /** 消息ID */
    messageId: string
    /** 消息序列号 */
    messageSeq: number
    /** 消息体元素 */
    elements: Elements[]
  }
  /** 创建好友消息事件所需参数类型 */
  type FriendMessageOptions = Omit<MessageOptions, 'subEvent' | 'contact' | 'sender'> & {
    /** 事件来源好友信息 */
    contact: Contact<'friend'>
    /** 好友发送者信息 */
    sender: Sender<'friend'>
  }
  /** 创建群消息事件所需参数类型 */
  type GroupMessageOptions = Omit<MessageOptions, 'subEvent' | 'contact' | 'sender'> & {
    /** 事件来源群信息 */
    contact: Contact<'group'>
    /** 群发送者信息 */
    sender: Sender<'group'>
  }
  /** 创建频道消息事件所需参数类型 */
  type GuildMessageOptions = Omit<MessageOptions, 'subEvent' | 'contact' | 'sender'> & {
    /** 事件来源频道信息 */
    contact: Contact<'guild'>
    /** 频道发送者信息 */
    sender: Sender<'guild'>
  }
  /** 创建频道私信消息事件所需参数类型 */
  type DirectMessageOptions = Omit<MessageOptions, 'subEvent' | 'contact' | 'sender'> & {
    /** 事件来源频道私信信息 */
    contact: Contact<'direct'>
    /** 频道私信发送者信息 */
    sender: Sender<'direct'>
  }
  /** 创建群临时会话消息事件所需参数类型 */
  type GroupTempMessageOptions = Omit<MessageOptions, 'subEvent' | 'contact' | 'sender'> & {
    /** 事件来源群临时会话信息 */
    contact: Contact<'groupTemp'>
    /** 群临时会话发送者信息 */
    sender: Sender<'groupTemp'>
  }
  /** 通知事件: 创建通知事件类所需参数类型 */
  type NoticeOptions = Omit<BaseEventOptions<'notice'>, 'event' | 'sender'> & {
    sender: Sender
  }
  /** 创建收到点赞通知事件 */
  type ReceiveLikeOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'friend'>
    /** 事件创建者信息 */
    sender: Sender<'friend'>
    /** 请求内容 */
    content: ReceiveLikeType
  }
  /** 创建好友增加通知事件 */
  type FriendIncreaseOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'friend'>
    /** 事件创建者信息 */
    sender: Sender<'friend'>
    /** 请求内容 */
    content: FriendIncreaseType
  }
  /** 创建好友减少通知事件 */
  type FriendDecreaseOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'friend'>
    /** 事件创建者信息 */
    sender: Sender<'friend'>
    /** 请求内容 */
    content: FriendDecreaseType
  }
  /** 创建私聊戳一戳通知事件 */
  type PrivatePokeOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'friend'>
    /** 事件创建者信息 */
    sender: Sender<'friend'>
    /** 请求内容 */
    content: PrivatePokeType
  }
  /** 创建私聊撤回消息通知事件 */
  type PrivateRecallOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'friend'>
    /** 事件创建者信息 */
    sender: Sender<'friend'>
    /** 请求内容 */
    content: PrivateRecallType
  }
  /** 创建私聊文件上传通知事件 */
  type PrivateFileUploadedOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'friend'>
    /** 事件创建者信息 */
    sender: Sender<'friend'>
    /** 请求内容 */
    content: PrivateFileUploadedType
  }
  /** 创建群聊戳一戳通知事件 */
  type GroupPokeOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupPokeType
  }
  /** 创建群聊撤回通知事件 */
  type GroupRecallOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupRecallType
  }
  /** 创建群聊文件上传通知事件 */
  type GroupFileUploadedOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupFileUploadedType
  }
  /** 创建群名片变动通知事件 */
  type GroupCardChangedOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupCardChangedType
  }
  /** 创建群成员头衔变动通知事件 */
  type GroupMemberUniqueTitleChangedOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupMemberUniqueTitleChangedType
  }
  /** 创建群精华消息变动通知事件 */
  type GroupHlightsChangedOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupHlightsChangedType
  }
  /** 创建群成员增加通知事件 */
  type GroupMemberIncreaseOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupMemberIncreaseType
  }
  /** 创建群成员减少通知事件 */
  type GroupMemberDecreaseOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupMemberDecreaseType
  }
  /** 创建群管理员变动通知事件 */
  type GroupAdminChangedOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupAdminChangedType
  }
  /** 创建群打卡通知事件 */
  type GroupSignInOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupSignInType
  }
  /** 创建群成员被禁言通知事件 */
  type GroupMemberBanOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupMemberBanType
  }
  /** 创建群全员禁言通知事件 */
  type GroupWholeBanOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupWholeBanType
  }
  /** 创建群表情动态通知事件 */
  type GroupMessageReactionOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupMessageReactionType
  }
  /** 创建群聊运气王通知事件 */
  type GroupLuckKingOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupLuckKingType
  }
  /** 创建群聊荣誉变更通知事件 */
  type GroupHonorChangedOptions = Omit<NoticeOptions, 'subEvent'> & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupHonorChangedType
  }
  /** 创建请求事件类所需参数类型 */
  type RequestOptions = Omit<BaseEventOptions<'request'>, 'event'> & {
    /** 请求内容 */
    content: any
  }
  /** 创建好友申请请求事件 */
  type PrivateApplyRequestOptions = RequestOptions & {
    /** 事件来源信息 */
    contact: Contact<'friend'>
    /** 事件创建者信息 */
    sender: Sender<'friend'>
    /** 请求内容 */
    content: PrivateApplyType
  }
  /** 创建新成员加入群聊申请请求事件 */
  type GroupApplyRequestOptions = RequestOptions & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupApply
  }
  /** 创建邀请机器人加入群聊请求事件 */
  type GroupInviteRequestOptions = RequestOptions & {
    /** 事件来源信息 */
    contact: Contact<'group'>
    /** 事件创建者信息 */
    sender: Sender<'group'>
    /** 请求内容 */
    content: GroupInvite
  }

  /** 事件实现基类 */
  export abstract class BaseEvent<T extends EventParent> {
    #private
    /** 快速回复 */
    reply: Reply
    /** 存储器 由开发者自行调用 */
    store: Map<any, any>
    /** 日志函数字符串 */
    logFnc: string
    /** 日志用户字符串 */
    logText: string
    /** 是否为主人 */
    isMaster: boolean
    /** 是否为Bot管理员 */
    isAdmin: boolean
    constructor ({ event, subEvent, eventId, rawEvent, time, contact, sender, srcReply, bot }: BaseEventOptions<T>)
    /**
     * @description 机器人ID
     * @deprecated 即将废弃，请使用 `selfId`
     */
    get self_id (): string
    /**
     * @description 用户ID
     * @deprecated 即将废弃，请使用 `userId`
     */
    get user_id (): string
    /** 机器人自身ID */
    get selfId (): string
    /** 用户ID */
    get userId (): string
    /** 事件父类型 */
    get event (): T
    /** 事件子类型 */
    get subEvent (): EventToSubEvent[T]
    /** 事件ID */
    get eventId (): string
    /** 原始事件 */
    get rawEvent (): unknown
    /** 事件触发时间戳 */
    get time (): number
    /** 事件来源信息 */
    get contact (): Contact
    /** 事件发送者信息 */
    get sender (): Sender
    /** 快速回复源函数 */
    get srcReply (): SrcReply
    /** 机器人实例 */
    get bot (): AdapterType
    /**
     * 是否为私聊场景
     * - 在好友场景下为 `true`
     * - 在频道私信场景下为 `true`
     */
    get isPrivate (): boolean
    /** 是否为好友场景 */
    get isFriend (): boolean
    /** 是否为群聊场景 */
    get isGroup (): boolean
    /** 是否为频道场景 */
    get isGuild (): boolean
    /** 是否为群临时会话场景 */
    get isGroupTemp (): boolean
    /** 是否为频道私信场景 */
    get isDirect (): boolean
  }

  /**
   * @description 消息事件基类
   * @class FriendMessage
   */
  export abstract class MessageBase extends BaseEvent<'message'> {
    #private
    /** 消息段 */
    elements: Elements[]
    /** 消息文本 */
    msg: string
    /** 别名 */
    alias: string
    /** 消息日志 */
    rawMessage: string
    constructor ({ subEvent, eventId, rawEvent, time, contact, sender, srcReply, bot, messageId, messageSeq, elements }: MessageOptions)
    /**
     * @deprecated 即将废弃 请使用 `rawMessage`
     */
    get raw_message (): string
    /**
     * @description 消息ID
     * @deprecated 即将废弃 请使用 `messageId`
     */
    get message_id (): string
    /**
     * @description 消息序列号
     * @deprecated 即将废弃 请使用 `messageSeq`
     */
    get message_seq (): number
    get event (): 'message'
    get subEvent (): MessageEventSub
    get messageId (): string
    get messageSeq (): number
    get at (): string[]
    get atBot (): boolean
    get atAll (): boolean
    get image (): string[]
    get record (): string
    get replyId (): string
    /**
     * @description 引用回复的消息id
     * @deprecated 即将废弃 请使用 `replyId`
     */
    get reply_id (): string
  }
  /**
   * @description 好友消息事件类
   * @class FriendMessage
   */
  export class FriendMessage extends MessageBase {
    #private
    constructor (options: FriendMessageOptions)
    get contact (): FriendContact
    get sender (): SenderBase
    get subEvent (): 'friend'
    get isPrivate (): true
    get isFriend (): true
    get isGroup (): false
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群消息事件类
   * @class GroupMessage
   */
  export class GroupMessage extends MessageBase {
    #private
    constructor (options: GroupMessageOptions)
    /**
     * @description 群ID
     * @deprecated 即将废弃 请使用 `groupId`
     */
    get group_id (): string
    /**
     * @description 群ID
     */
    get groupId (): string
    get contact (): GroupContact
    get sender (): GroupSender$1
    get subEvent (): 'group'
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 频道私信消息事件类
   * @class DirectMessage
   */
  export class DirectMessage extends MessageBase {
    #private
    constructor (options: DirectMessageOptions)
    /** 来源频道id */
    get srcGuildId (): string
    get contact (): DirectContact
    get sender (): SenderBase
    get subEvent (): 'direct'
    get isPrivate (): true
    get isFriend (): false
    get isGroup (): false
    get isGuild (): false
    get isDirect (): true
    get isGroupTemp (): false
  }
  /**
   * @description 频道消息事件类
   * @class GuildMessage
   */
  export class GuildMessage extends MessageBase {
    #private
    constructor (options: GuildMessageOptions)
    /**
     * @description 频道ID
     * @deprecated 即将废弃 请使用 `guildId`
     */
    get guild_id (): string
    /**
     * @description 子频道ID
     * @deprecated 即将废弃 请使用 `channelId`
     */
    get channel_id (): string
    /**
     * @description 频道ID
     */
    get guildId (): string
    /**
     * @description 子频道ID
     */
    get channelId (): string
    get contact (): GuildContact
    get sender (): GuildSender
    get subEvent (): 'guild'
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): false
    get isGuild (): true
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群临时会话消息事件类
   * @class GroupTempMessage
   */
  export class GroupTempMessage extends MessageBase {
    #private
    constructor (options: GroupTempMessageOptions)
    /**
     * @description 群ID
     * @deprecated 即将废弃 请使用 `groupId`
     */
    get group_id (): string
    /**
     * @description 群ID
     */
    get groupId (): string
    get contact (): GroupTempContact
    get sender (): SenderBase
    get subEvent (): 'groupTemp'
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): false
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): true
  }

  /**
   * @description 通知事件基类
   * @class NoticeBase
   */
  export abstract class NoticeBase extends BaseEvent<'notice'> {
    #private
    /** 通知内容str */
    tips: string
    /** 事件内容 */
    content: unknown
    constructor ({ subEvent, eventId, rawEvent, time, contact, sender, srcReply, bot }: NoticeOptions)
    get event (): 'notice'
    get subEvent (): NoticeEventSub
  }
  /**
   * @description 收到点赞事件
   * @class ReceiveLikeNotice
   */
  export class ReceiveLikeNotice extends NoticeBase {
    #private
    content: ReceiveLikeOptions['content']
    constructor (options: ReceiveLikeOptions)
    get subEvent (): 'receiveLike'
    get contact (): FriendContact
    get sender (): Sender & SenderBase
    get isPrivate (): true
    get isFriend (): true
    get isGroup (): false
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 好友增加事件
   * @class FriendIncreaseNotice
   */
  export class FriendIncreaseNotice extends NoticeBase {
    #private
    content: FriendIncreaseOptions['content']
    constructor (options: FriendIncreaseOptions)
    get subEvent (): 'friendIncrease'
    get contact (): FriendContact
    get sender (): Sender & SenderBase
    get isPrivate (): true
    get isFriend (): true
    get isGroup (): false
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 好友减少事件
   * @class FriendDecreaseNotice
   */
  export class FriendDecreaseNotice extends NoticeBase {
    #private
    content: FriendDecreaseOptions['content']
    constructor (options: FriendDecreaseOptions)
    get subEvent (): 'friendDecrease'
    get contact (): FriendContact
    get sender (): Sender & SenderBase
    get isPrivate (): true
    get isFriend (): true
    get isGroup (): false
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 收到私聊戳一戳事件
   * @class PrivatePokeNotice
   */
  export class PrivatePokeNotice extends NoticeBase {
    #private
    content: PrivatePokeOptions['content']
    constructor (options: PrivatePokeOptions)
    get subEvent (): 'friendPoke'
    get contact (): FriendContact
    get sender (): Sender & SenderBase
    get isPrivate (): true
    get isFriend (): true
    get isGroup (): false
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 收到私聊撤回事件
   * @class PrivateRecallNotice
   */
  export class PrivateRecallNotice extends NoticeBase {
    #private
    content: PrivateRecallOptions['content']
    constructor (options: PrivateRecallOptions)
    get subEvent (): 'friendRecall'
    get contact (): FriendContact
    get sender (): Sender & SenderBase
    get isPrivate (): true
    get isFriend (): true
    get isGroup (): false
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 收到私聊文件上传事件
   * @class PrivateFileUploadedNotice
   */
  export class PrivateFileUploadedNotice extends NoticeBase {
    #private
    content: PrivateFileUploadedOptions['content']
    constructor (options: PrivateFileUploadedOptions)
    get subEvent (): 'friendFileUploaded'
    get contact (): FriendContact
    get sender (): Sender & SenderBase
    get isPrivate (): true
    get isFriend (): true
    get isGroup (): false
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  export class GroupNotice extends NoticeBase {
    /**
     * @deprecated 已经弃用 请使用`groupId`
     */
    get group_id (): string
    get groupId (): string
  }
  /**
   * @description 收到群聊戳一戳事件
   * @class GroupPokeNotice
   */
  export class GroupPokeNotice extends GroupNotice {
    #private
    content: GroupPokeOptions['content']
    constructor (options: GroupPokeOptions)
    get subEvent (): 'groupPoke'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 收到群聊撤回事件
   * @class GroupRecallNotice
   */
  export class GroupRecallNotice extends GroupNotice {
    #private
    content: GroupRecallOptions['content']
    constructor (options: GroupRecallOptions)
    get subEvent (): 'groupRecall'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 收到群聊文件上传事件
   * @class GroupFileUploadedNotice
   */
  export class GroupFileUploadedNotice extends GroupNotice {
    #private
    content: GroupFileUploadedOptions['content']
    constructor (options: GroupFileUploadedOptions)
    get subEvent (): 'groupFileUploaded'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群名片变动事件
   * @class GroupCardChangedNotice
   */
  export class GroupCardChangedNotice extends GroupNotice {
    #private
    content: GroupCardChangedOptions['content']
    constructor (options: GroupCardChangedOptions)
    get subEvent (): 'groupCardChanged'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群成员头衔变动事件
   * @class GroupMemberTitleUpdatedNotice
   */
  export class GroupMemberTitleUpdatedNotice extends GroupNotice {
    #private
    content: GroupMemberUniqueTitleChangedOptions['content']
    constructor (options: GroupMemberUniqueTitleChangedOptions)
    get subEvent (): 'groupMemberTitleUpdate'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群精华消息变动事件
   * @class GroupHlightsChangedNotice
   */
  export class GroupHlightsChangedNotice extends GroupNotice {
    #private
    content: GroupHlightsChangedOptions['content']
    constructor (options: GroupHlightsChangedOptions)
    get subEvent (): 'groupHighlightsChange'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群成员增加事件
   * @class GroupMemberIncreaseNotice
   */
  export class GroupMemberIncreaseNotice extends GroupNotice {
    #private
    content: GroupMemberIncreaseOptions['content']
    constructor (options: GroupMemberIncreaseOptions)
    get subEvent (): 'groupMemberAdd'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群成员减少事件
   * @class GroupMemberDecreaseNotice
   */
  export class GroupMemberDecreaseNotice extends GroupNotice {
    #private
    content: GroupMemberDecreaseOptions['content']
    constructor (options: GroupMemberDecreaseOptions)
    get subEvent (): 'groupMemberRemove'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群管理员变动事件
   * @class GroupAdminChangedNotice
   */
  export class GroupAdminChangedNotice extends GroupNotice {
    #private
    content: GroupAdminChangedOptions['content']
    constructor (options: GroupAdminChangedOptions)
    get subEvent (): 'groupAdminChanged'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群打卡事件
   * @class GroupSignInNotice
   */
  export class GroupSignInNotice extends GroupNotice {
    #private
    content: GroupSignInOptions['content']
    constructor (options: GroupSignInOptions)
    get subEvent (): 'groupSignIn'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群成员被禁言事件
   * @class GroupMemberBanNotice
   */
  export class GroupMemberBanNotice extends GroupNotice {
    #private
    content: GroupMemberBanOptions['content']
    constructor (options: GroupMemberBanOptions)
    get subEvent (): 'groupMemberBan'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群全员禁言事件
   * @class GroupWholeBanNotice
   */
  export class GroupWholeBanNotice extends GroupNotice {
    #private
    content: GroupWholeBanOptions['content']
    constructor (options: GroupWholeBanOptions)
    get subEvent (): 'groupWholeBan'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群表情动态事件
   * @class GroupMessageReactionNotice
   */
  export class GroupMessageReactionNotice extends GroupNotice {
    #private
    content: GroupMessageReactionOptions['content']
    constructor (options: GroupMessageReactionOptions)
    get subEvent (): 'groupMessageReaction'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群聊运气王事件
   * @class GroupLuckKingNotice
   */
  export class GroupLuckKingNotice extends GroupNotice {
    #private
    content: GroupLuckKingOptions['content']
    constructor (options: GroupLuckKingOptions)
    get subEvent (): 'groupLuckyKing'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 群聊荣誉变更事件
   * @class GroupHonorChangedNotice
   */
  export class GroupHonorChangedNotice extends GroupNotice {
    #private
    content: GroupHonorChangedOptions['content']
    constructor (options: GroupHonorChangedOptions)
    get subEvent (): 'groupHonorChange'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }

  /**
   * @description 请求事件基类
   * @class RequestBase
   */
  export abstract class RequestBase extends BaseEvent<'request'> {
    #private
    /** 通知内容str */
    tips: string
    /** 事件内容 */
    content: unknown
    constructor ({ subEvent, eventId, rawEvent, time, contact, sender, srcReply, bot }: RequestOptions)
    get event (): 'request'
    get subEvent (): RequestEventSub
  }
  /**
   * @description 创建好友申请请求事件
   * @class ReceiveLikeNotice
   */
  export class PrivateApplyRequest extends RequestBase {
    #private
    content: PrivateApplyRequestOptions['content']
    constructor (options: PrivateApplyRequestOptions)
    get subEvent (): 'friendApply'
    get contact (): FriendContact
    get sender (): Sender & SenderBase
    get isPrivate (): true
    get isFriend (): true
    get isGroup (): false
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 创建入群请求事件
   * @class ReceiveLikeNotice
   */
  export class GroupApplyRequest extends RequestBase {
    #private
    content: GroupApplyRequestOptions['content']
    constructor (options: GroupApplyRequestOptions)
    /**
     * @deprecated 已经弃用 请使用`groupId`
     */
    get group_id (): string
    get groupId (): string
    get subEvent (): 'groupApply'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }
  /**
   * @description 创建邀请Bot入群请求事件
   * @class GroupInviteRequest
   */
  export class GroupInviteRequest extends RequestBase {
    #private
    content: GroupInviteRequestOptions['content']
    constructor (options: GroupInviteRequestOptions)
    /**
     * @deprecated 已经弃用 请使用`groupId`
     */
    get group_id (): string
    get groupId (): string
    get subEvent (): 'groupInvite'
    get contact (): GroupContact
    get sender (): Sender & GroupSender$1
    get isPrivate (): false
    get isFriend (): false
    get isGroup (): true
    get isGuild (): false
    get isDirect (): false
    get isGroupTemp (): false
  }

  /** 消息事件对应的对象类型 */
  interface MessageEventMap {
    message: Message$2
    'message.group': GroupMessage
    'message.friend': FriendMessage
    'message.guild': GuildMessage
    'message.direct': DirectMessage
    'message.groupTemp': GroupTempMessage
  }
  /** 私聊通知事件对应的对象类型 */
  interface FriendNoticeEventMap {
    'notice.receiveLike': ReceiveLikeNotice
    'notice.friendDecrease': FriendDecreaseNotice
    'notice.friendIncrease': FriendIncreaseNotice
    'notice.privatePoke': PrivatePokeNotice
    'notice.privateRecall': PrivateRecallNotice
    'notice.privateFileUploaded': PrivateFileUploadedNotice
  }
  /** 群聊通知事件对应的对象类型 */
  interface GroupNoticeEventMap {
    'notice.groupPoke': GroupPokeNotice
    'notice.groupRecall': GroupRecallNotice
    'notice.groupFileUploaded': GroupFileUploadedNotice
    'notice.groupCardChanged': GroupCardChangedNotice
    'notice.groupMemberTitleUpdate': GroupMemberTitleUpdatedNotice
    'notice.groupHighlightsChange': GroupHlightsChangedNotice
    'notice.groupMemberAdd': GroupMemberIncreaseNotice
    'notice.groupMemberRemove': GroupMemberDecreaseNotice
    'notice.groupAdminChanged': GroupAdminChangedNotice
    'notice.groupSignIn': GroupSignInNotice
    'notice.groupMemberBan': GroupMemberBanNotice
    'notice.groupWholeBan': GroupWholeBanNotice
    'notice.groupMessageReaction': GroupMessageReactionNotice
    'notice.groupLuckyKing': GroupLuckKingNotice
    'notice.groupHonorChange': GroupHonorChangedNotice
  }
  /** 通知事件对应的对象类型 */
  interface NoticeEventMap extends FriendNoticeEventMap, GroupNoticeEventMap {
    notice: Notice
  }
  /** 好友请求事件对应的对象类型 */
  interface FriendRequestEventMap {
    'request.friendApply': PrivateApplyRequest
  }
  /** 群聊请求事件对应的对象类型 */
  interface GroupRequestEventMap {
    'request.groupApply': GroupApplyRequest
    'request.groupInvite': GroupInviteRequest
  }
  /** 请求事件对应的对象类型 */
  interface RequestEventMap extends FriendRequestEventMap, GroupRequestEventMap {
    request: Request
  }
  /**
   * @description 通知事件类型
   */
  type Notice = ReceiveLikeNotice | FriendDecreaseNotice | FriendIncreaseNotice | PrivatePokeNotice | PrivateRecallNotice | PrivateFileUploadedNotice | GroupPokeNotice | GroupRecallNotice | GroupFileUploadedNotice | GroupCardChangedNotice | GroupMemberTitleUpdatedNotice | GroupHlightsChangedNotice | GroupMemberIncreaseNotice | GroupMemberDecreaseNotice | GroupAdminChangedNotice | GroupSignInNotice | GroupMemberBanNotice | GroupWholeBanNotice | GroupMessageReactionNotice | GroupLuckKingNotice | GroupHonorChangedNotice
  /**
   * @description 消息事件类型
   */
  type Message$2 = FriendMessage | GroupMessage | DirectMessage | GuildMessage | GroupTempMessage
  /**
   * @description 请求事件类型
   */
  type Request = PrivateApplyRequest | GroupApplyRequest | GroupInviteRequest
  /**
   * @description 所有事件类型
   */
  type Event = Message$2 | Notice | Request

  /**
   * 权限类型
   * - `all`: 所有人
   * - `master`: 所有者
   * - `admin`: 管理员
   * - `group.owner`: 群主
   * - `group.admin`: 群管理
   * - `guild.owner`: 频道主
   * - `guild.admin`: 频道管理
   */
  type Permission = 'all' | 'master' | 'admin' | 'group.owner' | 'group.admin' | 'guild.owner' | 'guild.admin'

  type Args = {
    e?: Event
  } & Record<string, any>
  type FileToUrlResult<T> = T extends 'image' ? {
    url: string
    width: number
    height: number
  } : {
    url: string
  }
  /**
   * 文件转换为url类型
   */
  type FileToUrlHandler = {
    <T extends 'image' | 'video' | 'record' | 'file'> (
      /** 文件类型 */
      type: T,
      /** 文件数据 */
      file: string | Buffer | Uint8Array,
      /** 文件名名称: `image.jpg` */
      filename: string,
      /** 自定义参数 如果传e记得符合规范 */
      args?: Args): Promise<FileToUrlResult<T>>
  }

  /**
   * @public
   * @description 日志管理器
   */
  export const logger: Logger

  export class LevelDB extends Level {
    id: string
    get: ((key: string) => Promise<any>) & typeof Level.prototype.get
    constructor (path: string)
    /**
     * 和get方法一样
     * @param key 键
     * @param value 值
     */
    set (key: string, value: string | object): Promise<void>
    /**
     * 和get方法一样 但是不抛出错误
     * @param key 键
     */
    has (key: string): Promise<any | null>
  }

  /** Redis 客户端类型 */
  type Client = RedisClientType & {
    id: 'redis' | 'mock'
  }

  /**
   * @public
   * @description level 数据库
   */
  export const level: LevelDB
  /**
   * @public
   * @description redis 数据库
   */
  export const redis$1: Client

  type GetBot = {
    /**
     * 获取指定Bot类
     * @param index 适配器索引
     */
    (index: number): AdapterType | null;
    /**
     * 获取指定Bot类
     * @param protocol 适配器协议实现
     * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
     */
    (protocol: AdapterProtocol, isProtocol: boolean): AdapterType | null;
    /**
     * 获取指定Bot类
     * @param botID 机器人ID
     */
    (botID: string): AdapterType | null
  }
  type UnregisterBot = {
    /**
     * @description 通过索引ID卸载Bot
     * @param index 适配器索引
     */
    (type: 'index', index: number): boolean;
    /**
     * @description 通过BotID卸载Bot
     * @param selfId 机器人ID
     */
    (type: 'selfId', selfId: string): boolean;
    /**
     * @description 通过BotID和地址卸载Bot
     * @param type 卸载类型
     * @param selfId 机器人ID
     * @param address 机器人地址
     */
    (type: 'address', selfId: string, address: string): boolean
  }
  /**
   * 获取Bot
   * @param id 适配器索引 | 适配器协议实现 | 机器人ID
   * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
   * @returns 适配器
   */
  export const getBot: GetBot
  /**
   * 获取所有Bot类 不包含索引
   * @returns Bot类列表
   */
  export const getAllBot: () => AdapterType[]
  /**
   * 获取所有Bot类 包含索引
   * @returns 注册的Bot列表
   */
  export const getAllBotList: () => {
    index: number
    bot: AdapterType
  }[]
  /**
   * 获取所有BotID
   * @returns BotID列表
   */
  export const getAllBotID: () => string[]
  /**
   * 获取注册的Bot数量
   * @returns Bot数量
   */
  export const getBotCount: () => number
  /**
   * 卸载Bot
   * @param type 卸载方式
   * @param idOrIndex 适配器索引 | 机器人ID
   * @param address 机器人地址
   */
  export const unregisterBot: UnregisterBot
  /**
   * 注册Bot
   * @param bot 适配器实例
   * @returns 适配器索引
   */
  export const registerBot: (type: AdapterCommunication, bot: AdapterBase) => number
  type Message$1 = string | Elements | Array<Elements>
  interface SendMsgOptions$1 {
    /** 发送成功后撤回消息时间 */
    recallMsg?: number
    /** @deprecated 已废弃 请使用 `retryCount` */
    retry_count?: number
    /** 重试次数 */
    retryCount?: number
  }
  /**
   * 发送主动消息
   * @param uid Bot的uid
   * @param contact 目标信息
   * @param elements 消息内容
   * @param options 消息选项
   */
  export const sendMsg: (selfId: string, contact: Contact, elements: Message$1, options?: SendMsgOptions$1) => Promise<SendMsgResults>

  interface HandlerType<T = any> {
    /**
     * 调用事件处理器
     * @param key - 事件键
     * @param args 自定义参数 如果传递e需要传递标准事件对象
     */
    (key: string, args: {
      [key: string]: any
      e?: Event
    }): Promise<T>
    /**
     * 调用事件处理器
     * @param key - 事件键
     * @param args 自定义参数 如果传递e需要传递标准事件对象
     */
    call<K = any> (key: string, args: {
      [key: string]: any
      e?: Event
    }): Promise<K>
    /**
     * 检查是否存在指定键的事件处理器
     * @param key 事件键
     */
    has (key: string): boolean
  }
  /**
   * 事件处理器
   */
  export const handler$1: HandlerType

  /** package.json类型 */
  interface PkgData {
    /** 插件名称 */
    name: string
    /** 插件版本 */
    version: string
    /** 插件入口 */
    main: string
    karin?: {
      /** ts入口 */
      main?: string
      /** 插件app列表 */
      apps?: string | string[];
      /** ts插件app列表 ts专属 仅在ts开发模式下生效 */
      ['ts-apps']?: string | string[]
      /** 静态资源目录 */
      static?: string | string[]
      /** 基本文件夹结构 */
      files?: string[]
    }
    [key: string]: any
  }
  /**
   * 输入包名 返回包根目录的绝对路径 仅简单查找
   * @param name - 包名
   * @param rootPath - 导入包的路径 此项适用于在插件中读取插件的依赖包
   * @returns - 包根目录的绝对路径
   * @example
   * pkgRoot('axios')
   * pkgRoot('axios', __filename)
   * pkgRoot('axios', import.meta.url)
   */
  export const pkgRoot: (name: string, rootPath?: string) => string
  /**
   * 传入插件名称 返回插件根目录、路径、package.json等信息
   * @param name - 插件名称
   */
  export const getPluginInfo: (name: string) => (PkgInfo & {
    readonly pkg: PkgData | null
  }) | null
  /**
   * 传入一个名称 判断是否为插件
   * @param name - 插件名称
   */
  export const isPlugin: (name: string) => boolean

  /** 插件类型 */
  type Apps = 'app' | 'git' | 'npm'
  /**
   * 插件方法类型
   * - `command` 命令
   * - `accept` 接受通知请求
   * - `task` 定时任务
   * - `button` 按钮
   * - `handler` 处理器
   * - `use` 中间件
   */
  type PluginFncTypes = 'command' | 'accept' | 'task' | 'button' | 'handler' | 'use'
  /** 插件包基本属性 */
  interface PkgInfo {
    /**
     * 插件包唯一标识
     */
    id: number
    /**
     * 插件包类型
     * - `app`: 单app
     * - `git`: git仓库
     * - `npm`: npm包
     */
    type: Apps
    /**
     * 插件包名称
     * - `app`: `karin-plugin-example`
     * - `git`: `karin-plugin-memes`
     * - `npm`: `@karinjs/adapter-qqbot`
     */
    name: string
    /**
     * 插件根目录
     * - `app`: `/root/karin/plugins/karin-plugin-example`
     * - `git`: `/root/karin/plugins/karin-plugin-memes`
     * - `npm`: `/root/karin/node_modules/@karinjs/adapter-qqbot`
     */
    dir: string
    /**
     * apps绝对路径列表
    */
    apps: string[]
    /**
    * 获取`package.json`绝对路径
    */
    get pkgPath (): string
    /**
     * 读取`package.json`文件
     */
    get pkgData (): PkgData
  }
  /** 单个方法基本属性 */
  interface PluginFile<T extends PluginFncTypes> {
    /** app绝对路径 */
    absPath: string
    /** app目录：`/root/karin/plugins/karin-plugin-example` */
    get dirname (): string
    /** app文件名：`index.ts` `index.js` */
    get basename (): string
    /**
     * 插件方法类型
     * - `accept`
     * - `command`
     * - `task`
     * - `button`
     * - `handler`
     * - `middleware` */
    type: T
    /**
     * 插件方法名称
     * @example
     * ```ts
     * import karin from 'node-karin'
     *
     * export const fnc = karin.command('你好', 'hello', { name: 'demo插件' })
     * // 此时`method`为`fnc` 也就是导出的方法名称
     * ```
     */
    method: string
    /**
     * app名称
     * @example
     * ```ts
     * import karin from 'node-karin'
     *
     * export const fnc = karin.command('你好', 'hello', { name: 'demo插件' })
     * // 此时`name`为`demo插件` 如果没有，则是`this.type`
     * ```
     */
    name: string
  }
  /** 适配器参数 */
  interface AdapterOptions {
    /** 适配器 */
    adapter: AdapterProtocol[]
    /** 禁用的适配器 */
    dsbAdapter: AdapterProtocol[]
  }
  /**
   * 日志方法
   * @param T 是否为bot专属日志方法
   */
  type Log<T extends boolean> = T extends true ? (id: string, log: string) => void : (log: string) => void

  /** 定时任务方法 */
  interface Task {
    /** 插件包基本属性 */
    pkg: PkgInfo
    /** 插件方法基本属性 */
    file: PluginFile<'task'>
    /** 任务名称 */
    name: string
    /** cron表达式 */
    cron: string
    /** 执行方法 */
    fnc: Function
    /** 打印触发插件日志方法 */
    log: Log<false>
    /** schedule */
    schedule?: schedule.Job
  }

  type ButtonType = ButtonElement | KeyboardElement | Array<ButtonElement | KeyboardElement>
  /** 按钮插件类型 */
  interface Button {
    /** 插件包基本属性 */
    pkg: PkgInfo
    /** 插件方法基本属性 */
    file: PluginFile<'button'>
    /** 优先级 */
    priority: number
    /** 插件正则 */
    reg: RegExp
    /** 优先级 */
    rank: number
    /** 执行方法 */
    fnc: (
      /** 是否继续匹配下一个按钮 默认否 调用后则继续 */
      next: () => void,
      /** 自定义参数 如果传e需要符合标准 */
      args?: {
        e?: Event;
        [key: string]: any
      }) => Promise<ButtonType> | ButtonType
  }

  /** 通知、请求事件联合类型 */
  type NoticeAndRequest = NoticeEventMap & RequestEventMap
  /** 通知、请求事件接收方法 */
  interface Accept<T extends keyof NoticeAndRequest = keyof NoticeAndRequest> extends AdapterOptions {
    /** 插件包基本属性 */
    pkg: PkgInfo
    /** 插件方法基本属性 */
    file: PluginFile<'accept'>
    /** 监听事件 */
    event: T
    /** 优先级 */
    priority: number
    /** 打印触发插件日志方法 */
    log: Log<true>
    /** 插件方法 */
    fnc: (
      /** 事件 */
      e: NoticeAndRequest[T],
      /** 调用后将继续匹配下一个插件 */
      next: () => unknown) => Promise<unknown> | unknown
  }

  /** handler类型 */
  interface Handler {
    /** 插件包基本属性 */
    pkg: PkgInfo
    /** 插件方法基本属性 */
    file: PluginFile<'handler'>
    /** 优先级 */
    priority: number
    /** 入口key */
    key: string
    /** handler的处理方法 */
    fnc: (
      /** 自定义参数 由调用方传递 */
      args: {
        [key: string]: any
      },
      /** 调用后将继续执行下一个handler */
      next: (msg?: string) => void) => unknown
  }

  /** 函数命令插件方法 */
  type CmdFnc<T extends keyof MessageEventMap> = (
    /** 消息事件 */
    e: MessageEventMap[T],
    /** 调用后将继续匹配下一个插件 */
    next: () => unknown) => unknown
  /** 函数方法命令插件 */
  interface Command<T extends keyof MessageEventMap = keyof MessageEventMap> extends AdapterOptions {
    /** 插件包基本属性 */
    pkg: PkgInfo
    /** 插件方法基本属性 */
    file: PluginFile<'command'>
    /** 插件子类型 */
    type: 'fnc'
    /** 插件正则 */
    reg: RegExp
    /** 监听事件 */
    event: T
    /** 优先级 */
    priority: number
    /** 插件触发权限 */
    permission: Permission
    /**
     * 如果无权触发插件 是否打印日志
     * - `true`: `暂无权限，只有主人才能操作`
     * - `false`: ``
     * - `string`: `自定义提示`
     */
    authFailMsg: boolean | string
    /** 打印触发插件日志方法 */
    log: Log<true>
    /** 插件方法 */
    fnc: CmdFnc<T>
  }

  /**
   * 命令选项
   */
  interface Options$1 {
    /** 插件名称 */
    name?: string
    /** 是否启用日志 */
    log?: boolean
    /** 权限 默认`all` */
    perm?: Command['permission']
    /** 优先级 默认`10000` */
    rank?: Command['priority']
    /** 生效的适配器 */
    adapter?: Command['adapter']
    /** 禁用的适配器 */
    dsbAdapter?: Command['dsbAdapter']
    /**
     * 权限
     * @default 'all'
     */
    permission?: Command['permission']
    /**
     * 插件优先级 数字越小优先级越高
     * @default 10000
     */
    priority?: Command['priority']
    /**
     * 禁用的适配器
     * @deprecated 已废弃 请使用`dsbAdapter`
     */
    notAdapter?: Command['dsbAdapter']
  }

  interface TaskOptions {
    /** 插件名称 */
    name?: string
    /** 是否启用日志 */
    log?: boolean
  }
  /**
   * 构建定时任务
   * @param name 任务名称
   * @param cron cron表达式
   * @param fnc 执行函数
   * @param options 选项
   */
  export const task: (name: string, cron: string, fnc: Function, options?: TaskOptions) => Task

  interface AcceptOptions extends Options$1 {
  }
  /**
   * accept
   * @param event 监听事件
   * @param fnc 实现函数
   */
  export const accept: <T extends keyof NoticeAndRequest>(event: T, fnc: (e: NoticeAndRequest[T], next: () => unknown) => Promise<unknown> | unknown, options?: AcceptOptions) => Accept<T>

  interface ButtonOptions {
    /** 插件名称 */
    name?: string
    /** 是否启用日志 */
    log?: boolean
    /**
     * 插件优先级 数字越小优先级越高
     * @default 10000
     */
    priority?: Button['priority']
    /** 优先级 默认`10000` */
    rank?: Button['priority']
  }
  /**
   * 按钮
   * @param reg - 正则表达式
   * @param fnc - 函数
   */
  export const button$1: (reg: RegExp | string, fnc: Button['fnc'], options?: ButtonOptions) => Button

  /**
   * @public
   */
  export interface Point {
    x: number
    y: number
  }
  /**
   * @public
   */
  export interface BoundingBox extends Point {
    /** 元素的宽度（以像素为单位） */
    width: number
    /** 元素的高度（以像素为单位） */
    height: number
  }
  /**
   * @public
   */
  export interface ScreenshotClip extends BoundingBox {
    /**
     * @defaultValue `1`
     */
    scale?: number
  }
  /**
   * @public
   */
  export interface ScreenshotOptions {
    /**
     * @defaultValue `false`
     */
    optimizeForSpeed?: boolean
    /**
     * @defaultValue `'png'`
     */
    type?: 'png' | 'jpeg' | 'webp'
    /**
     * 图像的质量，范围为 0-100。不适用于 `png` 图像。
     */
    quality?: number
    /**
     * 从表面捕获屏幕截图，而不是从视图捕获。
     *
     * @defaultValue `true`
     */
    fromSurface?: boolean
    /**
     * 当设置为 `true` 时，将捕获整个页面的屏幕截图。
     *
     * @defaultValue `false`
     */
    fullPage?: boolean
    /**
     * 隐藏默认的白色背景，允许捕获具有透明背景的屏幕截图。
     *
     * @defaultValue `false`
     */
    omitBackground?: boolean
    /**
     * 保存图像的文件路径。屏幕截图的类型将从文件扩展名推断得出。
     * 如果路径是相对路径，则会相对于当前工作目录解析。
     * 如果未提供路径，则图像不会保存到磁盘。
     */
    path?: string
    /**
     * 指定页面/元素需要裁剪的区域。
     */
    clip?: ScreenshotClip
    /**
     * 图像的编码方式。
     *
     * @deprecated 这是无效选项，强制性返回string<base64>
     */
    encoding?: 'base64' | 'binary'
    /**
     * 捕获视口之外的屏幕截图。
     *
     * @defaultValue `false` 如果没有 `clip` 的情况下为 `false`。否则为 `true`。
     */
    captureBeyondViewport?: boolean
  }
  /**
   * @public
   */
  export type PuppeteerLifeCycleEvent =
    /**
    * 等待`load`事件。
    */
    'load'
    /**
    * 等待`DOMContentLoaded`事件。
    */
    | 'domcontentloaded'
    /**
    * 等待至少 `500` 毫秒，直至网络连接不超过 0 个
    */
    | 'networkidle0'
    /**
    * 等待至少 `500` 毫秒，直至网络连接不超过 2 个
    */
    | 'networkidle2'
  /**
   * @public
   */
  export interface WaitForOptions {
    /**
     * 最大等待时间（以毫秒为单位）。传递 0 可禁用超时
     *
     * The default value can be changed by using the
     * {@link Page.setDefaultTimeout} or {@link Page.setDefaultNavigationTimeout}
     * methods.
     *
     * @defaultValue `30000`
     */
    timeout?: number
    /**
     * 何时认为等待成功。给定一个事件字符串数组，当所有事件都触发后，等待才被视为成功
     *
     * @defaultValue `'load'`
     */
    waitUntil?: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[]
    /** 允许您取消呼叫的信号对象 */
    signal?: AbortSignal
  }
  /**
   * @public
   */
  export interface GoToOptions extends WaitForOptions {
    /**
     * 如果提供，它将优先于由以下项设置的 referer 标头值：
     * {@link Page.setExtraHTTPHeaders | page.setExtraHTTPHeaders()}.
     */
    referer?: string
    /**
     * 如果提供，它将优先于 referer-policy 标头值
     * set by {@link Page.setExtraHTTPHeaders | page.setExtraHTTPHeaders()}.
     */
    referrerPolicy?: string
  }
  interface screenshot extends ScreenshotOptions {
    /** http地址或本地文件路径 */
    file: string
    /**
   * 选择的元素截图
   * fullPage为false时生效
   * 如果未找到指定元素则使用body
   * @default 'body'
   */
    selector?: string
    /**
     * 截图类型
     * @default 'jpeg'
    */
    type?: 'png' | 'jpeg' | 'webp'
    /**
     * 截图质量 默认90
     * @default 90
     */
    quality?: number
    /**
     * - 额外的 HTTP 头信息将随页面发起的每个请求一起发送
     * - 标头值必须是字符串
     * - 所有 HTTP 标头名称均小写。(HTTP 标头不区分大小写，因此这不会影响服务器代码）。
     */
    headers?: Record<string, string>
    /**
     * 截图整个页面
     * @default false
     */
    fullPage?: boolean
    /**
     * 控制截图的优化速度
     * @default false
     */
    optimizeForSpeed?: boolean
    /**
     * 捕获视口之外的屏幕截图
     * @default false
     */
    captureBeyondViewport?: boolean
    /** 设置视窗大小和设备像素比 */
    setViewport?: {
      /** 视窗宽度 */
      width?: number
      /** 视窗高度 */
      height?: number
      /**
       * 设备像素比
       * @default 1
       */
      deviceScaleFactor?: number
    }
    /** 分页截图 传递数字则视为视窗高度 返回数组 */
    multiPage?: number | boolean
    /** 页面goto时的参数 */
    pageGotoParams?: GoToOptions
    /** 等待指定元素加载完成 */
    waitForSelector?: string | string[]
    /** 等待特定函数完成 */
    waitForFunction?: string | string[]
    /** 等待特定请求完成 */
    waitForRequest?: string | string[]
    /** 等待特定响应完成 */
    waitForResponse?: string | string[]
  }
  /** 截图参数 */
  interface Options extends screenshot {
    /** 保存文件目录 推荐使用插件名称 */
    name: string
    /** 传递给 art-template 的参数 */
    data?: Record<string, any>
  }
  /** 单页或多页截图返回 */
  type RenderResult<T extends screenshot> = T['multiPage'] extends true | number ? string[] : string

  interface Renders {
    /**
     * 快速渲染
     * @param file - 文件路径、http地址
     */
    render (file: string): Promise<string>
    /**
     * 分片渲染
     * @param options - 渲染参数
     */
    render (file: string, multiPage: number | boolean): Promise<Array<string>>
    /**
     * 自定义渲染
     * @param options - 渲染参数
     */
    render<T extends Options> (options: T, id?: string): Promise<RenderResult<T>>
    /**
     * 如果第三个重载没有类型 请使用这个重载
     * @param options - 渲染参数
     */
    render<T extends Options> (type: 'opt', options: T, id?: string): Promise<RenderResult<T>>
  }
  /**
   * 渲染
   * @param options - 渲染参数
   * @param multiPageOrId - 多页截图参数
   * @param id - 页面id
   */
  export const render: <T extends Options>(options: string | T, multiPageOrId?: string | number | boolean | T, id?: string) => Promise<RenderResult<T>>

  /**
   * 命令选项
   */
  interface CommandOptions<T extends keyof MessageEventMap> extends Options$1 {
    /** 监听事件 */
    event?: T
    notAdapter?: Command['dsbAdapter']
    /** 是否加上at 仅在群聊中有效 */
    at?: boolean
    /** 是否加上引用回复 */
    reply?: boolean
    /** 发送是否撤回消息 单位秒 */
    recallMsg?: number
    /**
     * 如果无权触发插件 是否打印日志
     * - `true`: `暂无权限，只有主人才能操作`
     * - `false`: ``
     * - `string`: `自定义提示`
     */
    authFailMsg?: boolean | string
  }
  /**
   * 字符串命令选项
   */
  interface StrCommandOptions<T extends keyof MessageEventMap> extends CommandOptions<T> {
    /** 延迟回复 单位毫秒 */
    delay?: number
    /** 是否停止执行后续插件 */
    stop?: boolean
  }
  /**
   * 命令类型
   */
  interface CommandType {
    /**
    * @param reg 正则表达式
    * @param fnc 函数
    * @param options 选项
    */
    <T extends keyof MessageEventMap = keyof MessageEventMap> (reg: string | RegExp, fnc: (e: MessageEventMap[T]) => Promise<boolean> | boolean, options?: CommandOptions<T>): Command<T>
    /**
     * @param reg 正则表达式
     * @param element 字符串或者KarinElement、KarinElement数组
     * @param options 选项
     */
    <T extends keyof MessageEventMap = keyof MessageEventMap> (reg: string | RegExp, element: string | Elements | Elements[], options?: StrCommandOptions<T>): Command<T>
  }
  /**
   * 快速构建命令
   * @param reg 正则表达式
   * @param second 函数或者字符串或者KarinElement、KarinElement数组
   * @param options 选项
   * @returns 返回插件对象
   */
  export const command: CommandType

  /**
   * 上下文
   * @param e - 消息事件
   * @param options - 上下文选项
   * @returns 返回下文消息事件 如果超时则返回null
   */
  export const ctx: <T = Message$2>(e: Event, options?: {
    /** 指定用户id触发下文 不指定则使用默认e.user_id */
    userId?: string
    /** 超时时间 默认120秒 */
    time?: number
    /** 超时后是否回复 */
    reply?: boolean
    /** 超时回复文本 默认为'操作超时已取消' */
    replyMsg?: string
  }) => Promise<unknown>

  interface HandlerOptions {
    /** 插件名称 */
    name?: string
    /** 是否启用日志 */
    log?: boolean
    /** 优先级 默认`10000` */
    rank?: Handler['priority']
    /** 优先级 默认`10000` */
    priority?: Handler['priority']
  }
  /**
   * - 构建handler
   * @param key - 事件key
   * @param fnc - 函数实现
   * @param options - 选项
   */
  export const handler: (key: string, fnc: Handler['fnc'], options?: HandlerOptions) => Handler

  type Message = string | Elements | Array<Elements>
  interface SendMsgOptions {
    /** 发送成功后撤回消息时间 */
    recallMsg?: number
    /** @deprecated 已废弃 请使用 `retryCount` */
    retry_count?: number
    /** 重试次数 */
    retryCount?: number
  }
  interface SendMasterOptions extends SendMsgOptions {
    /** 是否必须为Bot对应的主人/管理员 默认false */
    mustMaster?: boolean
  }
  interface SendAdminOptions extends SendMsgOptions {
    /** 是否必须为Bot对应的主人/管理员 默认false */
    mustAdmin?: boolean
  }
  /**
   * 给主人发消息
   * @param selfId Bot的ID
   * @param targetId 主人ID
   * @param elements 消息内容
   * @param options 消息选项
   */
  export const sendMaster: (selfId: string, targetId: string, elements: Message, options?: SendMasterOptions) => Promise<SendMsgResults>
  /**
   * 给管理员发消息
   * @param selfId Bot的ID
   * @param targetId 管理员ID
   * @param elements 消息内容
   * @param options 消息选项
   */
  export const sendAdmin: (selfId: string, targetId: string, elements: Message, options?: SendAdminOptions) => Promise<SendMsgResults>

  type fnc_AcceptOptions = AcceptOptions
  type fnc_ButtonOptions = ButtonOptions
  type fnc_CommandOptions<T extends keyof MessageEventMap> = CommandOptions<T>
  type fnc_CommandType = CommandType
  type fnc_HandlerOptions = HandlerOptions
  type fnc_Renders = Renders
  type fnc_StrCommandOptions<T extends keyof MessageEventMap> = StrCommandOptions<T>
  type fnc_TaskOptions = TaskOptions
  export const fnc_accept: typeof accept
  export const fnc_command: typeof command
  export const fnc_ctx: typeof ctx
  export const fnc_handler: typeof handler
  export const fnc_render: typeof render
  export const fnc_sendAdmin: typeof sendAdmin
  export const fnc_sendMaster: typeof sendMaster
  export const fnc_task: typeof task
  export namespace fnc {
    export { type fnc_AcceptOptions as AcceptOptions, type fnc_ButtonOptions as ButtonOptions, type fnc_CommandOptions as CommandOptions, type fnc_CommandType as CommandType, type fnc_HandlerOptions as HandlerOptions, type Options$1 as Options, type fnc_Renders as Renders, type fnc_StrCommandOptions as StrCommandOptions, type fnc_TaskOptions as TaskOptions, fnc_accept as accept, button$1 as button, fnc_command as command, fnc_ctx as ctx, fnc_handler as handler, fnc_render as render, fnc_sendAdmin as sendAdmin, fnc_sendMaster as sendMaster, fnc_task as task }
  }

  export const karin: {
    name: 'karin'
    contact (scene: 'friend', peer: string, name?: string): Contact<'friend'>
    contact (scene: 'group', peer: string, name?: string): Contact<'group'>
    contact (scene: 'guild', peer: string, subPeer: string, name?: string): Contact<'guild'>
    contact (scene: 'direct', peer: string, subPeer: string, name?: string): Contact<'direct'>
    contact (scene: 'groupTemp', peer: string, subPeer: string, name?: string): Contact<'groupTemp'>
    contactGroup (peer: Contact['peer'], name?: string): Contact<'group'>
    contactFriend (peer: Contact['peer'], name?: string): Contact<'friend'>
    contactGuild (peer: string, subPeer: string, name?: string, subName?: string): Contact<'guild'>
    contactGroupTemp (peer: string, subPeer: string, name?: string): Contact<'groupTemp'>
    friendSender (userId: number | string, nick: string, sex?: FriendSender$1['sex'], age?: number, uid?: string, uin?: number): FriendSender$1
    groupSender (userId: number | string, role: GroupSender$1['role'], nick?: string, sex?: GroupSender$1['sex'], age?: number, card?: string, area?: string, level?: number, title?: string, uid?: string, uin?: number): GroupSender$1
    getBotByIndex (index: number): AdapterType | null
    getBotCount (): number
    getBotAll<T extends boolean = false> (isIndex?: T): T extends true ? ReturnType<typeof getAllBotList> : ReturnType<typeof getAllBot>;
    [EventEmitter.captureRejectionSymbol]?<K> (error: Error, event: string | symbol, ...args: any[]): void
    addListener<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    on<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    once<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    removeListener<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    off<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    removeAllListeners (eventName?: string | symbol | undefined): /* elided */ any
    setMaxListeners (n: number): /* elided */ any
    getMaxListeners (): number
    listeners<K> (eventName: string | symbol): Function[]
    rawListeners<K> (eventName: string | symbol): Function[]
    emit<K> (eventName: string | symbol, ...args: any[]): boolean
    listenerCount<K> (eventName: string | symbol, listener?: Function | undefined): number
    prependListener<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    prependOnceListener<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    eventNames (): (string | symbol)[]
  } & typeof fnc
  /**
   * @deprecated 已废弃，请使用`karin`
   */
  export const Bot: {
    name: 'karin'
    contact (scene: 'friend', peer: string, name?: string): Contact<'friend'>
    contact (scene: 'group', peer: string, name?: string): Contact<'group'>
    contact (scene: 'guild', peer: string, subPeer: string, name?: string): Contact<'guild'>
    contact (scene: 'direct', peer: string, subPeer: string, name?: string): Contact<'direct'>
    contact (scene: 'groupTemp', peer: string, subPeer: string, name?: string): Contact<'groupTemp'>
    contactGroup (peer: Contact['peer'], name?: string): Contact<'group'>
    contactFriend (peer: Contact['peer'], name?: string): Contact<'friend'>
    contactGuild (peer: string, subPeer: string, name?: string, subName?: string): Contact<'guild'>
    contactGroupTemp (peer: string, subPeer: string, name?: string): Contact<'groupTemp'>
    friendSender (userId: number | string, nick: string, sex?: FriendSender$1['sex'], age?: number, uid?: string, uin?: number): FriendSender$1
    groupSender (userId: number | string, role: GroupSender$1['role'], nick?: string, sex?: GroupSender$1['sex'], age?: number, card?: string, area?: string, level?: number, title?: string, uid?: string, uin?: number): GroupSender$1
    getBotByIndex (index: number): AdapterType | null
    getBotCount (): number
    getBotAll<T extends boolean = false> (isIndex?: T): T extends true ? ReturnType<typeof getAllBotList> : ReturnType<typeof getAllBot>;
    [EventEmitter.captureRejectionSymbol]?<K> (error: Error, event: string | symbol, ...args: any[]): void
    addListener<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    on<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    once<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    removeListener<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    off<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    removeAllListeners (eventName?: string | symbol | undefined): /* elided */ any
    setMaxListeners (n: number): /* elided */ any
    getMaxListeners (): number
    listeners<K> (eventName: string | symbol): Function[]
    rawListeners<K> (eventName: string | symbol): Function[]
    emit<K> (eventName: string | symbol, ...args: any[]): boolean
    listenerCount<K> (eventName: string | symbol, listener?: Function | undefined): number
    prependListener<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    prependOnceListener<K> (eventName: string | symbol, listener: (...args: any[]) => void): /* elided */ any
    eventNames (): (string | symbol)[]
  } & typeof fnc

  /**
   * 构建文本元素
   * @param text 文本内容
   */
  export const text: (text: string) => TextElement
  /**
   * 构建At元素
   * @param targetId 目标id atall=all at在线成员=online
   * @param name At的名称
   */
  export const at: (targetId: string, name?: string) => AtElement
  /**
   * 构建表情元素
   * @param id 表情ID
   * @param isBig 是否大表情，默认不是
   */
  export const face: (id: number, isBig?: boolean) => FaceElement
  /**
   * 构建回复元素
   * @param messageId 回复的消息ID
   */
  export const reply: (messageId: string) => ReplyElement
  /**
   * 构建图片元素
   * @param file 图片url、路径或者base64
   * @param fileType 图片类型
   * @param options 其他可选参数
   */
  export const image: (file: string, options?: Partial<ImageElement>) => ImageElement
  /**
   * 构建视频元素
   * @param file 视频url、路径或者base64
   * @param options 其他可选参数
   */
  export const video: (file: string, options?: Partial<Omit<VideoElement, 'type' | 'file'>>) => VideoElement
  /**
   * 构建语音元素
   * @param file 语音文件url、路径或者base64
   * @param magic 是否为魔法语音 默认不是
   * @param options 其他可选参数
   */
  export const record: (file: string, magic?: boolean, options?: Partial<Omit<RecordElement, 'type' | 'file' | 'magic'>>) => RecordElement
  /**
   * 构建JSON元素
   * @param data JSON内容
   */
  export const json$1: (data: string) => JsonElement
  /**
   * 构建XML元素
   * @param data XML内容
   */
  export const xml: (data: string) => XmlElement
  /**
   * 构建Markdown元素
   * @param markdown Markdown内容
   * @param config 配置参数
   */
  export const markdown: (markdown: string, config?: MarkdownElement['config']) => MarkdownElement
  /**
   * 构建Markdown模板元素
   * @param templateId 模板ID
   * @param params 模板参数
   */
  export const markdownTpl: (templateId: string, params: MarkdownTplElement['params']) => MarkdownTplElement
  /**
   * 构建被动事件元素
   * @param id 被动事件ID
   * @param source 事件id来源 默认为msg
   */
  export const pasmsg: (id: string, source?: PasmsgElement['source']) => PasmsgElement
  /**
   * 构建多行按钮元素
   * @param data 按钮行数组
   */
  export const keyboard: (data: Array<Array<KarinButton$1>>) => KeyboardElement
  /**
   * 构建单行按钮元素
   * @param data 按钮数组
   */
  export const button: (data: KarinButton$1 | Array<KarinButton$1>) => ButtonElement
  /**
   * 构建长消息元素
   * @param id 消息ID
   */
  export const longMsg: (id: string) => LongMsgElement
  /**
   * 构建原始元素
   * @param data 原始数据
   */
  export const raw: (data: any) => RawElement
  /**
   * 构建篮球元素
   * @param id 篮球ID
   */
  export const basketball: (id: number) => BasketballElement
  /**
   * 构建骰子元素
   * @param id 骰子ID
   */
  export const dice: (id: number) => DiceElement
  /**
   * 构建猜拳元素
   * @param id 猜拳ID
   */
  export const rps: (id: number) => RpsElement
  /**
   * 构建弹射表情元素
   * @param id 表情ID
   * @param count 表情数量
   */
  export const bubbleFace: (id: number, count: number) => BubbleFaceElement
  /**
   * 构建天气元素
   * @param city 城市名称
   * @param code 城市代码
   */
  export const weather: (city: string, code: string) => WeatherElement
  /**
   * 构建位置元素
   * @param lat 纬度
   * @param lon 经度
   * @param title 标题
   * @param address 地址
   */
  export const location: (lat: number, lon: number, title: string, address: string) => LocationElement
  /**
   * 构建分享元素
   * @param url 分享链接
   * @param title 分享标题
   * @param content 分享内容
   * @param image 分享图片
   */
  export const share: (url: string, title: string, content: string, image: string) => ShareElement
  /**
   * 构建礼物元素
   * @param qq QQ号
   * @param id 礼物ID
   */
  export const gift: (qq: number, id: number) => GiftElement
  /**
   * 构建商城表情元素
   * @param id 表情ID
   */
  export const marketFace: (id: string) => MarketFaceElement
  /**
   * 构建分享名片元素
   * @param scene 分享类型
   * @param peer 被推荐人的QQ号或者被推荐群的群号
   */
  export const contact: (scene: 'group' | 'friend', peer: string) => ContactElement
  /**
   * 构建常规音乐元素
   * @param id 歌曲ID或自定义音乐选项
   * @param platform 音乐平台
   */
  export const music: (platform: ReadyMusicElement['platform'], id: string) => ReadyMusicElement
  /**
   * 构建自定义音乐元素
   * @param url 跳转链接
   * @param audio 音乐音频链接
   * @param title 标题
   * @param author 歌手
   * @param pic 封面
   */
  export const customMusic: (url: string, audio: string, title: string, author: string, pic: string) => CustomMusicElement
  /**
   * 构建自定义转发节点元素
   * @param userId 目标ID
   * @param nickname 目标名称
   * @param message 转发的消息元素结构
   * @param options 外显设置 暂未实现
   */
  export const node: (userId: CustomNodeElement['userId'], nickname: CustomNodeElement['nickname'], message: CustomNodeElement['message'], options?: CustomNodeElement['options']) => CustomNodeElement
  /**
   * 构建直接转发节点元素
   * @param id 消息ID
   */
  export const nodeDirect: (id: string) => DirectNodeElement

  export const segment_at: typeof at
  export const segment_basketball: typeof basketball
  export const segment_bubbleFace: typeof bubbleFace
  export const segment_button: typeof button
  export const segment_contact: typeof contact
  export const segment_customMusic: typeof customMusic
  export const segment_dice: typeof dice
  export const segment_face: typeof face
  export const segment_gift: typeof gift
  export const segment_image: typeof image
  export const segment_keyboard: typeof keyboard
  export const segment_location: typeof location
  export const segment_longMsg: typeof longMsg
  export const segment_markdown: typeof markdown
  export const segment_markdownTpl: typeof markdownTpl
  export const segment_marketFace: typeof marketFace
  export const segment_music: typeof music
  export const segment_node: typeof node
  export const segment_nodeDirect: typeof nodeDirect
  export const segment_pasmsg: typeof pasmsg
  export const segment_raw: typeof raw
  export const segment_record: typeof record
  export const segment_reply: typeof reply
  export const segment_rps: typeof rps
  export const segment_share: typeof share
  export const segment_text: typeof text
  export const segment_video: typeof video
  export const segment_weather: typeof weather
  export const segment_xml: typeof xml
  export namespace segment {
    export { segment_at as at, segment_basketball as basketball, segment_bubbleFace as bubbleFace, segment_button as button, segment_contact as contact, segment_customMusic as customMusic, segment_dice as dice, segment_face as face, segment_gift as gift, segment_image as image, json$1 as json, segment_keyboard as keyboard, segment_location as location, segment_longMsg as longMsg, segment_markdown as markdown, segment_markdownTpl as markdownTpl, segment_marketFace as marketFace, segment_music as music, segment_node as node, segment_nodeDirect as nodeDirect, segment_pasmsg as pasmsg, segment_raw as raw, segment_record as record, segment_reply as reply, segment_rps as rps, segment_share as share, segment_text as text, segment_video as video, segment_weather as weather, segment_xml as xml }
  }

  /**
   * 将消息元素转换为字符串
   * @param data 消息元素
   * @returns 消息字符串和原始字符串
   */
  export const createRawMessage: (data: Elements[]) => {
    /** 原始消息字符串: `[at:10001]这是一条测试的文本消息` */
    raw: string
    /**
     * - 经过处理的纯文本
     * - 可用于正则匹配
     * - tips: 此时还没有处理bot前缀
     */
    msg: string
  }
  /**
   * 消息元素归一化 主要处理字符串文本
   * @param elements 消息
   */
  export const makeMessage: (elements: SendMessage) => Array<Elements>
  /**
   * 制作简单转发，返回segment.node[]。仅简单包装node，也可以自己组装
   * @param elements
   * @param fakeId 转发用户的QQ号 必填
   * @param fakeName 转发用户显示的昵称 必填
   */
  export const makeForward: (elements: SendMessage | Array<Elements[]>, fakeId?: string, fakeName?: string) => Array<CustomNodeElement>

  /** 按钮结构 */
  interface KarinButton {
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
  interface QQBotButton {
    /** 按钮ID：在一个keyboard消息内设置唯一 */
    id: string
    /** 按钮上的文字 */
    render_data: {
      /** 按钮上的文字 */
      label: string
      /** 点击后按钮的上文字 */
      visited_label: string
      /**
       * 按钮样式
       * - 0-灰色线框
       * - 1-蓝色线框
       * - 2-特殊样式按钮
       * - 3-红色文字
       * - 4-白色填充
       */
      style: number
    }
    /** 操作相关的数据 */
    action: {
      /** 设置 0 跳转按钮：http 或 小程序 客户端识别 scheme，设置 1 回调按钮：回调后台接口, data 传给后台，设置 2 指令按钮：自动在输入框插入 @bot data */
      type: 0 | 1 | 2
      /** 权限设置 */
      permission: {
        /** 0 指定用户可操作，1 仅管理者可操作，2 所有人可操作，3 指定身份组可操作（仅频道可用） */
        type: number
        /** 有权限的用户 id 的列表 */
        specify_user_ids?: string[]
        /** 有权限的身份组 id 的列表（仅频道可用） */
        specify_role_ids?: string[]
      }
      /** 操作相关的数据 */
      data: string
      /** 指令按钮可用，指令是否带引用回复本消息，默认 false */
      reply?: boolean
      /** 指令按钮可用，点击按钮后直接自动发送 data，默认 false */
      enter?: boolean
      /** 本字段仅在指令按钮下有效，设置后后会忽略 action.enter 配置。
      设置为 1 时 ，点击按钮自动唤起启手Q选图器，其他值暂无效果。
      （仅支持手机端版本 8983+ 的单聊场景，桌面端不支持） */
      anchor?: number
      /** 【已弃用】可操作点击的次数，默认不限 */
      click_limit?: number
      /** 【已弃用】指令按钮可用，弹出子频道选择器，默认 false */
      at_bot_show_channel_list?: boolean
      /** 客户端不支持本action的时候，弹出的toast文案 */
      unsupport_tips: string
    }
  }
  /** QQ按钮消息结构 */
  interface QQButtonTextType {
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

  /**
   * 调用按钮处理器
   * @param msg 传e.msg就行
   * @param e 消息事件 可不传
   * @param arg 自定义参数 可不传
   * @returns 返回按钮元素
   */
  export const buttonHandle: (reg: string, args?: {
    e?: Event;
    [key: string]: any
  }) => Promise<(KeyboardElement | ButtonElement)[]>

  /**
   * 将karin标准格式的按钮转换为QQ官方按钮
   * @param button karin按钮
   * @returns QQ按钮数组
   */
  export const karinToQQBot: (button: ButtonElement | KeyboardElement) => Array<{
    buttons: Array<QQBotButton>
  }>
  /**
   * 将QQ官方按钮转换为karin标准格式的按钮
   * @param button QQ按钮 传`content.rows`
   * @returns karin按钮
   */
  export const qqbotToKarin: (button: Array<{
    buttons: Array<QQBotButton>
  }>) => string

  /**
   * 异步检查路径文件是否存在
   * @param file 文件路径
   * @returns 返回布尔值
   */
  export const exists: (file: string) => Promise<boolean>
  /**
   * 异步检查是否为目录
   * @param file 文件路径
   * @returns 返回布尔值
   */
  export const isDir: (file: string) => Promise<boolean>
  /**
   * 异步检查是否为文件
   * @param file 文件路径
   * @returns 返回布尔值
   */
  export const isFile: (file: string) => Promise<boolean>
  /**
   * 递归创建文件夹
   * @param dirname 文件夹路径
   * @returns 返回布尔值 是否创建成功
   */
  export const mkdir: (dirname: string) => Promise<boolean>
  /**
   * 检查目录是否存在 不存在则创建
   * @param file 文件路径
   * @returns 返回布尔值
   */
  export const existToMkdir: (file: string) => Promise<boolean>

  /**
   * 检查目录是否存在
   * @param file 文件路径
   * @returns 返回布尔值
   */
  export const existsSync: (file: string) => boolean
  /**
   * 检查是否为目录
   * @param file 文件路径
   * @returns 返回布尔值
   */
  export const isDirSync: (file: string) => boolean
  /**
   * 检查是否为文件
   * @param file 文件路径
   * @returns 返回布尔值
   */
  export const isFileSync: (file: string) => boolean
  /**
   * 递归创建文件夹
   * @param dirname 文件夹路径
   * @returns 返回布尔值 是否创建成功
   */
  export const mkdirSync: (dirname: string) => boolean
  /**
   * 检查目录是否存在 不存在则创建
   * @param file 文件路径
   * @returns 返回布尔值
   */
  export const existToMkdirSync: (file: string) => boolean
  export const rmSync: typeof fs$1.rmSync

  /**
   * 将数据转换为不带前缀的base64字符串
   * @param data - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
   * @param options - 选项 http为true时返回http地址
   * @returns 返回base64字符串
   * @example
   * ```ts
   * await base64('https://example.com/image.png')
   * await base64('C:/Users/admin/1.txt')
   * await base64('base64://aGVsbG8=')
   * await base64(fs.createReadStream('C:/Users/admin/1.txt'))
   * // -> 'aGVsbG8='
   * ```
   */
  export const base64: (data: unknown, options?: {
    http: boolean
  }) => Promise<string>
  /**
   * 将数据转换为Buffer对象
   * @param data - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
   * @param options - 选项 http为true时返回http地址
   * @returns 返回Buffer对象
   * @example
   * ```ts
   * await buffer('https://example.com/image.png')
   * await buffer('C:/Users/admin/1.txt')
   * await buffer('base64://aGVsbG8=')
   * await buffer(fs.createReadStream('C:/Users/admin/1.txt'))
   * // -> <Buffer ...>
   * ```
   */
  export const buffer: <T extends {
    http: boolean
  }>(data: unknown, options?: T) => Promise<T extends {
    http: true
  } ? string : Buffer>
  /**
   * 将数据流对象转换为Buffer对象
   * @param stream - 要转换的数据流对象
   * @returns 返回Buffer对象
   * @example
   * ```ts
   * await stream(fs.createReadStream('C:/Users/admin/1.txt'))
   * // -> <Buffer ...>
   */
  export const stream: (stream: Readable) => Promise<Buffer<ArrayBufferLike>>
  /**
   * 传入文件路径 转为buffer
   * @param path - 文件路径
   * @returns 返回Buffer对象 如果发生错误则返回null
   */
  export const readFile: (path: string) => Promise<Buffer | null>

  /** 当前运行环境的路径标准协议前缀 */
  export const sep: RegExp
  /**
   * 下载保存文件
   * @param  fileUrl 下载地址
   * @param  savePath 保存路径
   * @param param axios参数
   */
  export const downFile: (fileUrl: string, savePath: string, param?: AxiosRequestConfig) => Promise<boolean>
  /**
   * 标准化文件路径 统一使用/分隔符
   * @param file - 路径
   * @param absPath - 返回绝对路径 默认为true
   * @param prefix - 添加file://前缀 默认为false
   * @returns 标准化后的路径
   */
  export const absPath: (file: string, absPath?: boolean, prefix?: boolean) => string
  /**
   * 为每个插件创建基本文件夹结构
   * @param name 插件名称
   * @param files 需要创建的文件夹列表
   */
  export const createPluginDir: (name: string, files?: string[]) => Promise<void>
  /**
   * 获取符合后缀的文件列表(仅包含文件名称)
   * @param filePath 文件路径
   * @param suffixs 需要复制的文件后缀 可带点
   * @returns 符合条件的文件列表
   */
  export const getFiles: (filePath: string, suffixs?: string[]) => string[]
  /**
   * 复制文件 同步
   * @param files 需要复制的文件列表
   * @param defaulPath 模板配置文件路径
   * @param userPath 用户配置文件路径
   */
  export const copyFilesSync: (files: string[], defaulPath: string, userPath: string) => void
  /**
   * 复制文件 异步
   * @param files 需要复制的文件列表
   * @param defaulPath 模板配置文件路径
   * @param userPath 用户配置文件路径
   */
  export const copyFiles: (files: string[], defaulPath: string, userPath: string) => Promise<void>
  /**
   * 创建配置文件 同步
   * @description 从模板配置文件复制到用户配置文件
   * @param defaulPath 模板配置文件路径
   * @param userPath 用户配置文件路径
   * @param suffixs 需要复制的文件后缀 可带点
   * @param isThrow 是否抛出异常 默认不抛出
   * @returns 是否复制成功
   * @example
   * ```ts
   * copyConfigSync('defaultPath', 'userPath')
   * copyConfigSync('defaultPath', 'userPath', ['yaml'])
   * copyConfigSync('defaultPath', 'userPath', ['.yaml', 'json'])
   * copyConfigSync('defaultPath', 'userPath', [], true)
   * ```
   */
  export const copyConfigSync: (defaulPath: string, userPath: string, suffixs?: string[], isThrow?: boolean) => boolean
  /**
   * 创建配置文件 异步
   * @description 从模板配置文件复制到用户配置文件
   * @param defaulPath 模板配置文件路径
   * @param userPath 用户配置文件路径
   * @param suffixs 需要复制的文件后缀 可带点
   * @param isThrow 是否抛出异常 默认不抛出
   * @returns 是否复制成功
   * @example
   * ```ts
   * await copyConfig('defaultPath', 'userPath')
   * await copyConfig('defaultPath', 'userPath', ['yaml'])
   * await copyConfig('defaultPath', 'userPath', ['.yaml', 'json'])
   * await copyConfig('defaultPath', 'userPath', [], true)
   * ```
   */
  export const copyConfig: (defaulPath: string, userPath: string, suffixs?: string[], isThrow?: boolean) => Promise<boolean>

  /**
   * 读取 JSON 文件
   * @param path 文件路径
   * @param isThrow 是否抛出异常 默认为`false`
   */
  export const readJsonSync: (path: string, isThrow?: boolean) => any
  /**
   * 写入 JSON 文件
   * @param path 文件路径
   * @param data 数据
   * @param isThrow 是否抛出异常 默认为`false`
   */
  export const writeJsonSync: (path: string, data: any, isThrow?: boolean) => boolean
  /**
   * 异步读取 JSON 文件
   * @param path 文件路径
   *  @param isThrow 是否抛出异常 默认为`false`
   */
  export const readJson: (path: string, isThrow?: boolean) => Promise<any>
  /**
   * 异步写入 JSON 文件
   * @param path 文件路径
   * @param data 数据
   * @param isThrow 是否抛出异常 默认为`false`
   */
  export const writeJson: (path: string, data: any, isThrow?: boolean) => Promise<boolean>
  /** JSON 文件操作 */
  export const json: {
    /** 同步读取 */
    readSync: (path: string, isThrow?: boolean) => any
    /** 同步写入 */
    writeSync: (path: string, data: any, isThrow?: boolean) => boolean
    /** 异步读取 */
    read: (path: string, isThrow?: boolean) => Promise<any>
    /** 异步写入 */
    write: (path: string, data: any, isThrow?: boolean) => Promise<boolean>
  }

  /**
   * @description 根据文件后缀名从指定路径下读取符合要求的文件
   * @param path - 路径
   * @param ext - 后缀名、或后缀名列表
   * @param returnType - 返回类型 `name:文件名` `rel:相对路径` `abs:绝对路径`
   * @example
   * ```ts
   * filesByExt('./plugins/karin-plugin-test', '.js')
   * // -> ['1.js', '2.js']
   * filesByExt('./plugins', ['.js', '.ts'], 'name')
   * // -> ['1.js', '2.js', '3.ts']
   * filesByExt('./plugins', '.js', 'rel')
   * // -> ['plugins/1.js', 'plugins/2.js']
   * filesByExt('./plugins', '.js', 'abs')
   * // -> ['C:/Users/karin/plugins/1.js', 'C:/Users/karin/plugins/2.js']
   * ```
   */
  export const filesByExt: (filePath: string, ext: string | string[], returnType?: 'name' | 'rel' | 'abs') => string[]
  /**
   * @description 分割路径为文件夹路径和文件名
   * @param filePath - 路径
   * @returns - 文件夹路径和文件名
   * @example
   * ```ts
   * splitPath('C:/Users/admin/1.txt')
   * // -> { dirname: 'C:/Users/admin', basename: '1.txt' }
   * ```
   */
  export const splitPath: (filePath: string) => {
    dirname: string
    basename: string
  }
  /**
   * @description 去掉相对路径的前缀和后缀
   * @param filePath - 相对路径路径
   * @example
   * ```ts
   * getRelPath('./plugins/karin-plugin-example/index.ts')
   * // -> 'plugins/karin-plugin-example/index.ts'
   * ```
   */
  export const getRelPath: (filePath: string) => string
  /**
   * 根据传入的 import.meta.url 计算相对于项目根目录的路径，返回需要的 '../' 层级。
   * @param url - import.meta.url
   * @returns 相对路径的层级数量，用 '../' 表示
   * @example
   * ```ts
   * // 在 plugins/karin-plugin-example/index.ts 中使用
   * urlToPath(import.meta.url)
   * // -> '../../'
   * ```
   */
  export const urlToPath: (url: string) => string
  /**
   * @description 检查目标路径是否处于根路径下
   * @param root 根路径
   * @param target 目标路径
   * @param isAbs 是否将传入的路径转为绝对路径
   * @returns 返回布尔值
   */
  export const isSubPath: (root: string, target: string, isAbs?: boolean) => boolean | ''

  interface CacheEntry<T = any> {
    /** 缓存数据 */
    data: T
    /** 过期时间的时间戳（毫秒） */
    expiry: number | 0
  }
  type Parser = (content: string) => any
  type RequireOptions = {
    /** 文件编码，默认utf-8 */
    encoding?: BufferEncoding
    /** 是否强制读取，不使用缓存 */
    force?: boolean
    /** 过期时间，单位秒，默认300秒，0则永不过期 */
    ex?: number
    /** 文件大小限制，单位字节，默认0无限制 */
    size?: number
    /** 自定义解析器 */
    parser?: Parser
  }
  type RequireFunction = <T = any>(filePath: string, options?: RequireOptions) => Promise<T>
  type RequireFunctionSync = <T = any>(filePath: string, options?: RequireOptions) => T
  /**
   * @description 清除指定缓存
   * @param filePath 文件路径
   * @returns 是否清除成功
   */
  export const clearRequireFile: (filePath: string) => boolean
  /**
   * @description 清除所有缓存
   */
  export const clearRequire: () => void
  /**
   * 异步导入文件
   * @description 缓存导入的文件 默认缓存300秒
   * @param filePath 文件路径
   * @param options 选项
   * @returns 返回文件的内容
   */
  export const requireFile: RequireFunction
  /**
   * 同步导入文件
   * @description 缓存导入的文件 默认缓存300秒
   * @param filePath 文件路径
   * @param options 选项
   * @returns 返回文件的内容
   */
  export const requireFileSync: RequireFunctionSync

  /**
   * @description 传入一个文件路径，检查是否是静态资源中的文件
   * @param filePath 文件路径
   * @returns 是否是静态资源中的文件
   */
  export const isStatic: (filePath: string) => boolean

  type YamlValue = string | boolean | number | object | any[]
  type YamlComment = Record<string, string> | Record<string, {
    comment: string
    type: 'top' | 'end'
  }>
  type Save = {
    /**
     * 保存数据并写入注释 (json文件路径)
     * @param path 保存路径
     * @param value 保存的数据
     * @param commentPath 注释配置文件路径(json文件路径)
     */
    (path: string, value: any, commentPath?: string): void;
    /**
     * 保存数据并写入注释 (键值对)
     * @param path 保存路径
     * @param value 保存的数据
     * @param commentKV 键值对注释配置
     */
    (path: string, value: any, commentKV?: Record<string, string>): void;
    /**
     * 保存数据并写入注释 (javascript对象)
     * @param path 保存路径
     * @param value 保存的数据
     * @param commentJavascript javascript对象注释配置
     */
    (path: string, value: any, commentJavascript?: Record<string, {
      /** 注释类型 */
      type: 'top' | 'end'
      /** 注释内容 */
      comment: string
    }>): void
  }
  /** YAML 编辑器 */
  export class YamlEditor {
    filePath: string
    doc: YAML.Document
    document: YAML.Document
    constructor (file: string)
    /**
     * 获取指定路径的值
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     */
    get (path: string): any
    /**
     * 设置指定路径的值
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param value - 要设置的值 允许的类型：`string`, `boolean`, `number`, `object`, `array`
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    set (path: string, value: YamlValue, isSplit?: boolean): boolean
    /**
     * 向指定路径添加新值
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param value - 要添加的值
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    add (path: string, value: YamlValue, isSplit?: boolean): boolean
    /**
     * 删除指定路径
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     * @returns 是否删除成功
     */
    del (path: string, isSplit?: boolean): boolean
    /**
     * 向指定路径的数组添加新值，可以选择添加到数组的开始或结束
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param value - 要添加的值
     * @param prepend - 如果为 true，则添加到数组的开头，否则添加到末尾
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    append (path: string, value: string, prepend?: boolean, isSplit?: boolean): boolean
    /**
     * 向指定路径的数组删除值
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param value - 要删除的值
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    remove (path: string, value: YamlValue, isSplit?: boolean): boolean
    /**
     * 检查指定路径的键是否存在
     * @param path - 路径，用点号分隔
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    has (path: string, isSplit?: boolean): boolean
    /**
     * 查询指定路径中是否包含指定的值
     * @param path - 路径，用点号分隔
     * @param value - 要查询的值
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    hasval (path: string, value: YamlValue, isSplit?: boolean): boolean
    /**
     * 查询指定路径中是否包含指定的值
     * @param path - 路径，用点号分隔
     * @param value - 要查询的值
     * @deprecated 请使用 `hasval` 代替
     */
    hasVal (path: string, value: YamlValue): boolean
    /**
     * 向根节点新增元素，如果根节点不是数组，则将其转换为数组再新增元素
     * @param value - 要新增的元素
     */
    pusharr (value: YamlValue): boolean
    /**
     * 根据索引从根节点数组删除元素
     * @param index - 要删除元素的索引
     */
    delarr (index: number): boolean
    /**
     * 获取指定路径的pair对象
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    getpair (path: string, isSplit?: boolean): any
    /**
     * 设置指定键的注释
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param comment - 要设置的注释
     * @param prepend - 如果为 true，则添加注释到开头，否则添加到同一行的末尾
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    comment (path: string, comment: string, prepend?: boolean, isSplit?: boolean): void
    /**
     * 删除指定键的注释
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param type - 要删除的注释类型，`before` 为注释前，`after` 为注释后，`all` 为全部
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    uncomment (path: string, type?: 'before' | 'after' | 'all', isSplit?: boolean): void
    /**
     * 检查注释是否存在
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param type - 要检查的注释类型，`before` 为注释前，`after` 为注释后
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    hascomment (path: string, type: 'before' | 'after', isSplit?: boolean): boolean
    /**
     * 获取指定键的注释
     * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
     * @param isSplit - 是否使用分割路径路径，默认为 `true`
     */
    getcomment (path: string, isSplit?: boolean): any
    /**
     * 保存文件
     * 保存失败会抛出异常
     */
    save (): void
  }
  interface ReadFunction {
    (path: string): any
    /**
     * 保存数据并写入注释
     * @param options utf-8编码的字符串或注释配置对象
     */
    save?: (options?: string | YamlComment) => boolean
  }
  /**
   * 读取并解析 yaml 文件
   * @param path yaml 文件路径
   * @returns 解析后的数据
   */
  export const read: ReadFunction
  /**
   * 写入 YAML 文件
   * @param path 文件路径
   * @param value 数据
   */
  export const write: (path: string, value: any) => boolean
  /**
   * 保存数据并写入注释
   * @param path 文件路径
   * @param value 数据 仅支持 JavaScript 对象
   * @param options 注释配置
   */
  export const save: Save
  /**
   * 为指定文件写入注释
   * @param filePath 文件路径
   * @param commentConfig 注释配置文件路径或 JSON 对象
   */
  export const comment: (filePath: string, commentConfig: string | YamlComment) => void
  /**
   * 批量添加注释
   * @param editor YamlEditor 实例
   * @param comments 注释配置对象
   */
  export const applyComments: (editor: YamlEditor, comments: YamlComment) => void
  /** YAML 工具 */
  export const yaml: typeof YAML & {
    /** 读取并解析 YAML 文件 */
    read: ReadFunction
    /** 保存数据并写入注释 */
    save: Save
    /** 为指定文件写入注释 */
    comment: (filePath: string, commentConfig: string | YamlComment) => void
    /** 批量添加注释 */
    applyComments: (editor: YamlEditor, comments: YamlComment) => void
  }

  /**
   * 监听文件变动
   * @param file 文件路径
   * @param fnc 文件变动后调用的函数
   */
  export const watch: <T>(file: string, fnc: (
    /** 旧数据 */
    oldData: T,
    /** 新数据 */
    newData: T) => void) => Watch<T>
  /**
   * 传入两个配置文件路径，监听第一个的变动并返回合并后的配置
   * @param dynamicFile 动态配置文件路径
   * @param defaultCFile 默认配置文件路径
   */
  export const watchAndMerge: <T>(dynamicFile: string, defaultCFile: string, fnc: (oldData: T, newData: T) => T) => Watcher<T>
  /**
   * 监听管理器
   * @param file 文件路径
   * @param fnc 文件变动后调用的函数
   */
  export class Watch<T> {
    watcher: FSWatcher
    file: string
    constructor (file: string, watcher: FSWatcher)
    /**
     * @description 获取配置数据
     */
    get value (): T
    /**
     * @description 关闭监听器并清理全部缓存
     */
    close (): Promise<void>
  }
  export class Watcher<T> {
    watcher: FSWatcher
    dynamicFile: string
    defaultCFile: string
    constructor (dynamicFile: string, defaultCfgFile: string, watcher: FSWatcher)
    /**
     * @description 获取配置数据
     */
    get value (): T | (T & any[])[number][]
    /**
     * @description 关闭监听器并清理全部缓存
     */
    close (): Promise<void>
  }

  /**
   * @description 锁定对象的方法，使其不可被调用
   * @param obj 对象
   * @param key 方法名
   * @param msg 锁定时抛出的错误信息
   * @returns 唯一标识符 用于解锁
   */
  export const lockMethod: <T extends object, K extends keyof T>(obj: T, key: K, msg?: string) => () => {
    status: boolean
    msg: string
  }
  /**
   * @description 锁定对象的属性，使其不可被修改
   * @param obj 对象
   * @param key 属性
   */
  export const lockProp: <T extends object, K extends keyof T>(obj: T, key: K) => void
  /**
   * @description `锁定属性` `锁定方法` `解锁方法`
   */
  export const lock: {
    /** 锁定属性 */
    prop: <T extends object, K extends keyof T>(obj: T, key: K) => void
    /** 锁定方法 */
    method: <T extends object, K extends keyof T>(obj: T, key: K, msg?: string) => () => {
      status: boolean
      msg: string
    }
  }

  /**
   * 提取指定版本号的更新日志
   * @param version 版本号
   * @param data `CHANGELOG.md`文件内容
   * @returns 更新日志
   */
  export const log: (version: string, data: string) => string | null
  /**
   * 提取指定范围版本号的更新日志
   * @param version 起始版本号
   * @param data `CHANGELOG.md`文件内容
   * @param length 提取长度
   * @param reverse 是否反向提取 默认为`false`向后提取
   */
  export const logs: (version: string, data: string, length?: number, reverse?: boolean) => string
  /**
   * 提取指定版本号之间的更新日志
   * @param data `CHANGELOG.md`文件内容
   * @param startVersion 起始版本号
   * @param endVersion 结束版本号
   * @description
   * - `CHANGELOG.md`的版本号排序约定为从新到旧
   * - 也就是说 结束版本号应该比起始版本号新
   * - 举例: `range(data, '1.0.0', '2.0.0')` 提取`1.0.0`到`2.0.0`之间的更新日志
   */
  export const range: (data: string, startVersion: string, endVersion: string) => string
  /**
   * 对更新日志进行解析并形成对象
   * @param data 更新日志内容
   * @returns 以版本号为键的更新日志对象
   */
  export const parseChangelog: (data: string) => Record<string, string>

  export const changelog_log: typeof log
  export const changelog_logs: typeof logs
  export const changelog_parseChangelog: typeof parseChangelog
  export const changelog_range: typeof range
  export namespace changelog {
    export { changelog_log as log, changelog_logs as logs, changelog_parseChangelog as parseChangelog, changelog_range as range }
  }

  /** 收到消息 */
  export const RECV_MSG = 'karin:count:recv'
  /** 发送消息 */
  export const SEND_MSG = 'karin:count:send'
  /** 事件调用 */
  export const EVENT_COUNT = 'karin:count:fnc'

  export const key_EVENT_COUNT: typeof EVENT_COUNT
  export const key_RECV_MSG: typeof RECV_MSG
  export const key_SEND_MSG: typeof SEND_MSG
  export namespace key {
    export { key_EVENT_COUNT as EVENT_COUNT, key_RECV_MSG as RECV_MSG, key_SEND_MSG as SEND_MSG }
  }

  type fs_CacheEntry<T = any> = CacheEntry<T>
  type fs_Parser = Parser
  type fs_PkgData = PkgData
  type fs_RequireFunction = RequireFunction
  type fs_RequireFunctionSync = RequireFunctionSync
  type fs_RequireOptions = RequireOptions
  type fs_Watch<T> = Watch<T>
  export const fs_Watch: typeof Watch
  type fs_Watcher<T> = Watcher<T>
  export const fs_Watcher: typeof Watcher
  type fs_YamlComment = YamlComment
  type fs_YamlEditor = YamlEditor
  export const fs_YamlEditor: typeof YamlEditor
  type fs_YamlValue = YamlValue
  export const fs_absPath: typeof absPath
  export const fs_applyComments: typeof applyComments
  export const fs_base64: typeof base64
  export const fs_buffer: typeof buffer
  export const fs_clearRequire: typeof clearRequire
  export const fs_clearRequireFile: typeof clearRequireFile
  export const fs_comment: typeof comment
  export const fs_copyConfig: typeof copyConfig
  export const fs_copyConfigSync: typeof copyConfigSync
  export const fs_copyFiles: typeof copyFiles
  export const fs_copyFilesSync: typeof copyFilesSync
  export const fs_createPluginDir: typeof createPluginDir
  export const fs_downFile: typeof downFile
  export const fs_existToMkdir: typeof existToMkdir
  export const fs_existToMkdirSync: typeof existToMkdirSync
  export const fs_exists: typeof exists
  export const fs_existsSync: typeof existsSync
  export const fs_filesByExt: typeof filesByExt
  export const fs_getFiles: typeof getFiles
  export const fs_getPluginInfo: typeof getPluginInfo
  export const fs_getRelPath: typeof getRelPath
  export const fs_isDir: typeof isDir
  export const fs_isDirSync: typeof isDirSync
  export const fs_isFile: typeof isFile
  export const fs_isFileSync: typeof isFileSync
  export const fs_isPlugin: typeof isPlugin
  export const fs_isStatic: typeof isStatic
  export const fs_isSubPath: typeof isSubPath
  export const fs_json: typeof json
  export const fs_key: typeof key
  export const fs_lock: typeof lock
  export const fs_lockMethod: typeof lockMethod
  export const fs_lockProp: typeof lockProp
  export const fs_log: typeof log
  export const fs_logs: typeof logs
  export const fs_mkdir: typeof mkdir
  export const fs_mkdirSync: typeof mkdirSync
  export const fs_parseChangelog: typeof parseChangelog
  export const fs_pkgRoot: typeof pkgRoot
  export const fs_range: typeof range
  export const fs_read: typeof read
  export const fs_readFile: typeof readFile
  export const fs_readJson: typeof readJson
  export const fs_readJsonSync: typeof readJsonSync
  export const fs_requireFile: typeof requireFile
  export const fs_requireFileSync: typeof requireFileSync
  export const fs_rmSync: typeof rmSync
  export const fs_save: typeof save
  export const fs_sep: typeof sep
  export const fs_splitPath: typeof splitPath
  export const fs_stream: typeof stream
  export const fs_urlToPath: typeof urlToPath
  export const fs_watch: typeof watch
  export const fs_watchAndMerge: typeof watchAndMerge
  export const fs_write: typeof write
  export const fs_writeJson: typeof writeJson
  export const fs_writeJsonSync: typeof writeJsonSync
  export const fs_yaml: typeof yaml
  export namespace fs {
    export { type fs_CacheEntry as CacheEntry, type fs_Parser as Parser, type fs_PkgData as PkgData, type fs_RequireFunction as RequireFunction, type fs_RequireFunctionSync as RequireFunctionSync, type fs_RequireOptions as RequireOptions, fs_Watch as Watch, fs_Watcher as Watcher, type fs_YamlComment as YamlComment, fs_YamlEditor as YamlEditor, type fs_YamlValue as YamlValue, fs_absPath as absPath, fs_applyComments as applyComments, fs_base64 as base64, fs_buffer as buffer, fs_clearRequire as clearRequire, fs_clearRequireFile as clearRequireFile, fs_comment as comment, fs_copyConfig as copyConfig, fs_copyConfigSync as copyConfigSync, fs_copyFiles as copyFiles, fs_copyFilesSync as copyFilesSync, fs_createPluginDir as createPluginDir, fs_downFile as downFile, fs_existToMkdir as existToMkdir, fs_existToMkdirSync as existToMkdirSync, fs_exists as exists, fs_existsSync as existsSync, fs_filesByExt as filesByExt, fs_getFiles as getFiles, fs_getPluginInfo as getPluginInfo, fs_getRelPath as getRelPath, fs_isDir as isDir, fs_isDirSync as isDirSync, fs_isFile as isFile, fs_isFileSync as isFileSync, fs_isPlugin as isPlugin, fs_isStatic as isStatic, fs_isSubPath as isSubPath, fs_json as json, fs_key as key, fs_lock as lock, fs_lockMethod as lockMethod, fs_lockProp as lockProp, fs_log as log, fs_logs as logs, fs_mkdir as mkdir, fs_mkdirSync as mkdirSync, fs_parseChangelog as parseChangelog, fs_pkgRoot as pkgRoot, fs_range as range, fs_read as read, fs_readFile as readFile, fs_readJson as readJson, fs_readJsonSync as readJsonSync, fs_requireFile as requireFile, fs_requireFileSync as requireFileSync, fs_rmSync as rmSync, fs_save as save, fs_sep as sep, fs_splitPath as splitPath, fs_stream as stream, fs_urlToPath as urlToPath, fs_watch as watch, fs_watchAndMerge as watchAndMerge, fs_write as write, fs_writeJson as writeJson, fs_writeJsonSync as writeJsonSync, fs_yaml as yaml }
  }

  type index$3_CacheEntry<T = any> = CacheEntry<T>
  type index$3_Parser = Parser
  type index$3_PkgData = PkgData
  type index$3_RequireFunction = RequireFunction
  type index$3_RequireFunctionSync = RequireFunctionSync
  type index$3_RequireOptions = RequireOptions
  type index$3_Watch<T> = Watch<T>
  export const index$3_Watch: typeof Watch
  type index$3_Watcher<T> = Watcher<T>
  export const index$3_Watcher: typeof Watcher
  type index$3_YamlComment = YamlComment
  type index$3_YamlEditor = YamlEditor
  export const index$3_YamlEditor: typeof YamlEditor
  type index$3_YamlValue = YamlValue
  export const index$3_absPath: typeof absPath
  export const index$3_applyComments: typeof applyComments
  export const index$3_base64: typeof base64
  export const index$3_buffer: typeof buffer
  export const index$3_clearRequire: typeof clearRequire
  export const index$3_clearRequireFile: typeof clearRequireFile
  export const index$3_comment: typeof comment
  export const index$3_copyConfig: typeof copyConfig
  export const index$3_copyConfigSync: typeof copyConfigSync
  export const index$3_copyFiles: typeof copyFiles
  export const index$3_copyFilesSync: typeof copyFilesSync
  export const index$3_createPluginDir: typeof createPluginDir
  export const index$3_downFile: typeof downFile
  export const index$3_existToMkdir: typeof existToMkdir
  export const index$3_existToMkdirSync: typeof existToMkdirSync
  export const index$3_exists: typeof exists
  export const index$3_existsSync: typeof existsSync
  export const index$3_filesByExt: typeof filesByExt
  export const index$3_getFiles: typeof getFiles
  export const index$3_getPluginInfo: typeof getPluginInfo
  export const index$3_getRelPath: typeof getRelPath
  export const index$3_isDir: typeof isDir
  export const index$3_isDirSync: typeof isDirSync
  export const index$3_isFile: typeof isFile
  export const index$3_isFileSync: typeof isFileSync
  export const index$3_isPlugin: typeof isPlugin
  export const index$3_isStatic: typeof isStatic
  export const index$3_isSubPath: typeof isSubPath
  export const index$3_json: typeof json
  export const index$3_key: typeof key
  export const index$3_lock: typeof lock
  export const index$3_lockMethod: typeof lockMethod
  export const index$3_lockProp: typeof lockProp
  export const index$3_log: typeof log
  export const index$3_logs: typeof logs
  export const index$3_mkdir: typeof mkdir
  export const index$3_mkdirSync: typeof mkdirSync
  export const index$3_parseChangelog: typeof parseChangelog
  export const index$3_pkgRoot: typeof pkgRoot
  export const index$3_range: typeof range
  export const index$3_read: typeof read
  export const index$3_readFile: typeof readFile
  export const index$3_readJson: typeof readJson
  export const index$3_readJsonSync: typeof readJsonSync
  export const index$3_requireFile: typeof requireFile
  export const index$3_requireFileSync: typeof requireFileSync
  export const index$3_rmSync: typeof rmSync
  export const index$3_save: typeof save
  export const index$3_sep: typeof sep
  export const index$3_splitPath: typeof splitPath
  export const index$3_stream: typeof stream
  export const index$3_urlToPath: typeof urlToPath
  export const index$3_watch: typeof watch
  export const index$3_watchAndMerge: typeof watchAndMerge
  export const index$3_write: typeof write
  export const index$3_writeJson: typeof writeJson
  export const index$3_writeJsonSync: typeof writeJsonSync
  export const index$3_yaml: typeof yaml
  export namespace index$3 {
    export { type index$3_CacheEntry as CacheEntry, type index$3_Parser as Parser, type index$3_PkgData as PkgData, type index$3_RequireFunction as RequireFunction, type index$3_RequireFunctionSync as RequireFunctionSync, type index$3_RequireOptions as RequireOptions, index$3_Watch as Watch, index$3_Watcher as Watcher, type index$3_YamlComment as YamlComment, index$3_YamlEditor as YamlEditor, type index$3_YamlValue as YamlValue, index$3_absPath as absPath, index$3_applyComments as applyComments, index$3_base64 as base64, index$3_buffer as buffer, index$3_clearRequire as clearRequire, index$3_clearRequireFile as clearRequireFile, index$3_comment as comment, index$3_copyConfig as copyConfig, index$3_copyConfigSync as copyConfigSync, index$3_copyFiles as copyFiles, index$3_copyFilesSync as copyFilesSync, index$3_createPluginDir as createPluginDir, index$3_downFile as downFile, index$3_existToMkdir as existToMkdir, index$3_existToMkdirSync as existToMkdirSync, index$3_exists as exists, index$3_existsSync as existsSync, fs as file, index$3_filesByExt as filesByExt, index$3_getFiles as getFiles, index$3_getPluginInfo as getPluginInfo, index$3_getRelPath as getRelPath, index$3_isDir as isDir, index$3_isDirSync as isDirSync, index$3_isFile as isFile, index$3_isFileSync as isFileSync, index$3_isPlugin as isPlugin, index$3_isStatic as isStatic, index$3_isSubPath as isSubPath, index$3_json as json, index$3_key as key, index$3_lock as lock, index$3_lockMethod as lockMethod, index$3_lockProp as lockProp, index$3_log as log, index$3_logs as logs, index$3_mkdir as mkdir, index$3_mkdirSync as mkdirSync, index$3_parseChangelog as parseChangelog, index$3_pkgRoot as pkgRoot, index$3_range as range, index$3_read as read, index$3_readFile as readFile, index$3_readJson as readJson, index$3_readJsonSync as readJsonSync, index$3_requireFile as requireFile, index$3_requireFileSync as requireFileSync, index$3_rmSync as rmSync, index$3_save as save, index$3_sep as sep, index$3_splitPath as splitPath, index$3_stream as stream, index$3_urlToPath as urlToPath, index$3_watch as watch, index$3_watchAndMerge as watchAndMerge, index$3_write as write, index$3_writeJson as writeJson, index$3_writeJsonSync as writeJsonSync, index$3_yaml as yaml }
  }

  /**
   * 创建日志记录器
   * @param options - 配置项
   * @returns 日志记录器
   */
  export const createLogger: (options?: LoggerOptions) => Logger

  /**
   * 判断给定的 hostname 或 IP 是否为本机的回环地址 支持v6(可能不全)
   * @param hostnameOrIp - 要检查的 hostname 或 IP 地址
   */
  export const isLoopback: (hostnameOrIp: string) => Promise<boolean>
  /**
   * 判断一个 v4 地址是否在回环范围内
   * @param ip - IPv4 地址字符串
   */
  export const isIPv4Loop: (ip: string) => boolean
  /**
   * 判断一个 IPv6 地址是否是回环地址 (::1 或 ::ffff:127.x.x.x)
   * @param ip - IPv6 地址字符串
   */
  export const isIPv6Loop: (ip: string) => boolean
  /**
   * 获取请求的 IP 地址
   * 优先级: x-forwarded-for > remoteAddress > ip > hostname
   * @param req - 请求对象
   */
  export const getRequestIp: (req: Request$2) => string[]
  /**
   * 传入一个请求对象 判断是否为本机请求
   * @param req - 请求对象
   */
  export const isLocalRequest: (req: Request$2) => Promise<boolean>

  /**
   * 传入端口号，返回对应的pid
   * @param port - 端口号
   */
  export const getPid: (port: number) => Promise<number>

  /**
   * 执行 shell 命令
   * @param cmd 命令
   * @param options 选项
   * @param options.log 是否打印日志 默认不打印
   * @param options.booleanResult 是否只返回布尔值 表示命令是否成功执行 默认返回完整的结果
   * @example
   * ```ts
   * const { status, error, stdout, stderr } = await exec('ls -al')
   * // -> { status: true, error: null, stdout: '...', stderr: '...' }
   *
   * const status = await exec('ls -al', { booleanResult: true })
   * // -> true
   *
   * const { status, error, stdout, stderr } = await exec('ls -al', { log: true })
   * // -> 打印执行命令和结果
   * ```
   */
  export const exec: <T extends boolean = false>(cmd: string, options?: ExecOptions<T>) => Promise<ExecReturn<T>>

  /**
   * 获取kairn运行时间
   * @example
   * ```ts
   * uptime()
   * ```
   */
  export const uptime$1: () => string
  /**
   * @description 传入一个或两个时间戳
   * @description 传入一个返回当前时间 - 时间1
   * @description 传入两个返回时间2 - 时间1
   * @param time - 时间戳
   * @example
   * common.formatTime(1620000000)
   * // -> '18天'
   * common.formatTime(1620000000, 1620000000)
   * // -> '18天'
   */
  export const formatTime$1: (time: number, time2?: number) => string

  /**
   * 传入一个函数 判断是否是类
   * @param fnc 函数
   */
  export const isClass: (fnc: Function) => boolean

  /**
   * @description 拆解错误对象 用于`JSON`序列化
   * @param error 错误对象
   * @returns 拆解后的错误对象
   */
  export const stringifyError: (error?: Error | null) => {
    name: string | undefined
    message: string | undefined
    stack: string | undefined
  }
  /**
   * 将错误对象转为字符串
   * @param error 错误对象
   * @returns 错误字符串
   */
  export const errorToString: (error?: Error | null) => string

  /**
   * @description ffmpeg命令
   * @param cmd 命令
   * @param options 参数
   */
  export const ffmpeg: <T extends boolean = false>(cmd: string, options?: ExecOptions<T>) => Promise<ExecReturn<T>>
  /**
   * @description ffprobe命令
   * @param cmd 命令
   * @param options 参数
   */
  export const ffprobe: <T extends boolean = false>(cmd: string, options?: ExecOptions<T>) => Promise<ExecReturn<T>>
  /**
   * @description ffplay命令
   * @param cmd 命令
   * @param options 参数
   */
  export const ffplay: <T extends boolean = false>(cmd: string, options?: ExecOptions<T>) => Promise<ExecReturn<T>>

  /**
   * 动态导入模块
   * @param url 模块地址 仅支持绝对路径
   * @param isRefresh 是否重新加载 不使用缓存
   */
  export const importModule: (url: string, isRefresh?: boolean) => Promise<{
    status: true
    data: any
  } | {
    status: false
    data: unknown
  }>

  /** 是否为windows */
  export const isWin: boolean
  /** 是否为linux */
  export const isLinux: boolean
  /** 是否为mac */
  export const isMac: boolean
  /** 是否为docker */
  export const isDocker: boolean
  /** 是否为root用户 仅linux */
  export const isRoot: boolean

  /**
   * @description 传入npm包名 检查是否存在更新
   * @param name 包名
   * @returns 是否存在更新 true: 存在更新 false: 无更新
   */
  export const checkPkgUpdate: (name: string) => Promise<{
    /** 存在更新 */
    status: 'yes'
    /** 本地版本号 */
    local: string
    /** 远程版本号 */
    remote: string
  } | {
    /** 无更新 */
    status: 'no'
    /** 本地版本号 */
    local: string
  } | {
    /** 检查发生错误 */
    status: 'error'
    /** 错误信息 */
    error: Error
  }>
  /**
   * @description 获取指定包的本地版本号 如果获取失败则会获取package.json中的版本号
   * @param name 包名
   */
  export const getPkgVersion: (name: string) => Promise<string>
  /**
   * @description 获取指定包的远程版本号
   * @param name 包名
   * @param tag 标签，默认为 `latest`
   */
  export const getRemotePkgVersion: (name: string, tag?: string) => Promise<string>
  /**
   * @description 更新指定的npm插件
   * @param name 包名
   * @param tag 标签 默认 `latest`
   */
  export const updatePkg: (name: string, tag?: string) => Promise<{
    /** 更新失败 */
    status: 'failed'
    /** 更新失败信息 */
    data: string | ExecException$1
  } | {
    /** 更新成功 */
    status: 'ok'
    /** 更新成功信息 */
    data: string
    /** 本地版本号 */
    local: string
    /** 远程版本号 */
    remote: string
  }>
  /**
   * @description 更新全部npm插件
   */
  export const updateAllPkg: () => Promise<string>
  /**
   * @description 检查git插件是否有更新
   * @param filePath 插件路径
   * @param time 任务执行超时时间 默认120s
   */
  export const checkGitPluginUpdate: (filePath: string, time?: number) => Promise<{
    /** 存在更新 */
    status: 'yes'
    /** 更新内容 */
    data: string
    /** 落后次数 */
    count: number
  } | {
    /** 无更新 */
    status: 'no'
    /** 最后更新时间描述 */
    data: string
  } | {
    /** 检查发生错误 */
    status: 'error'
    data: Error
  }>
  /**
   * @description 获取指定仓库的提交记录
   * @param options 参数
   * @returns 提交记录
   */
  export const getCommit: (options: {
    /** 指令命令路径 */
    path: string
    /** 获取几次提交 默认1次 */
    count?: number
    /** 指定哈希 */
    hash?: string
    /** 指定分支 */
    branch?: string
  }) => Promise<string>
  /**
   * @description 获取指定仓库最后一次提交哈希值
   * @param filePath - 插件相对路径
   * @param short - 是否获取短哈希 默认true
   */
  export const getHash: (filePath: string, short?: boolean) => Promise<string>
  /**
   * 获取指定仓库最后一次提交时间日期
   * @param filePath - 插件相对路径
   * @returns 最后一次提交时间
   * @example
   * ```ts
   * console.log(await getTime('./plugins/karin-plugin-example'))
   * // -> '2021-09-01 12:00:00'
   * ```
   */
  export const getTime: (filePath: string) => Promise<string>
  /**
   * @description 更新指定git插件
   * @param filePath 插件路径
   * @param cmd 执行命令 默认`git pull`
   * @param time 任务执行超时时间 默认120s
   */
  export const updateGitPlugin: (filePath: string, cmd?: string, time?: number) => Promise<{
    /** 更新失败 */
    status: 'failed'
    /** 更新失败信息 */
    data: string | ExecException$1
  } | {
    /** 更新成功 */
    status: 'ok'
    /** 更新成功信息 */
    data: string
    /** 更新详情 */
    commit: string
  } | {
    /** 检查发生错误 */
    status: 'error'
    data: Error
  }>
  /**
   * @description 更新所有git插件
   * @param time 任务执行超时时间 默认120s
   */
  export const updateAllGitPlugin: (cmd?: string, time?: number) => Promise<string>

  /**
   * 重启Bot
   * @param selfId - 机器人的id 传e.self_id
   * @param contact - 事件联系人信息 也就是从哪来的这条消息 传e.contact即可
   * @param messageId - 消息id 传e.message_id
   * @param isFront - 是否为前台重启 默认是 不支持的环境会强制为pm2重启
   */
  export const restart: (selfId: string, contact: Contact, messageId: string, isFront?: boolean) => Promise<{
    status: 'success' | 'failed'
    data: string | Error
  }>
  /**
   * 直接重启
   */
  export const restartDirect: () => Promise<void>

  /** fileToUrl Handler键 */
  export const fileToUrlHandlerKey = 'fileToUrl'
  /**
   * 文件转换为url
   */
  export const fileToUrl: FileToUrlHandler

  export const index$2_checkGitPluginUpdate: typeof checkGitPluginUpdate
  export const index$2_checkPkgUpdate: typeof checkPkgUpdate
  export const index$2_errorToString: typeof errorToString
  export const index$2_exec: typeof exec
  export const index$2_ffmpeg: typeof ffmpeg
  export const index$2_ffplay: typeof ffplay
  export const index$2_ffprobe: typeof ffprobe
  export const index$2_fileToUrl: typeof fileToUrl
  export const index$2_fileToUrlHandlerKey: typeof fileToUrlHandlerKey
  export const index$2_getCommit: typeof getCommit
  export const index$2_getHash: typeof getHash
  export const index$2_getPid: typeof getPid
  export const index$2_getPkgVersion: typeof getPkgVersion
  export const index$2_getRemotePkgVersion: typeof getRemotePkgVersion
  export const index$2_getRequestIp: typeof getRequestIp
  export const index$2_getTime: typeof getTime
  export const index$2_importModule: typeof importModule
  export const index$2_isClass: typeof isClass
  export const index$2_isDocker: typeof isDocker
  export const index$2_isIPv4Loop: typeof isIPv4Loop
  export const index$2_isIPv6Loop: typeof isIPv6Loop
  export const index$2_isLinux: typeof isLinux
  export const index$2_isLocalRequest: typeof isLocalRequest
  export const index$2_isLoopback: typeof isLoopback
  export const index$2_isMac: typeof isMac
  export const index$2_isRoot: typeof isRoot
  export const index$2_isWin: typeof isWin
  export const index$2_restart: typeof restart
  export const index$2_restartDirect: typeof restartDirect
  export const index$2_stringifyError: typeof stringifyError
  export const index$2_updateAllGitPlugin: typeof updateAllGitPlugin
  export const index$2_updateAllPkg: typeof updateAllPkg
  export const index$2_updateGitPlugin: typeof updateGitPlugin
  export const index$2_updatePkg: typeof updatePkg
  export namespace index$2 {
    export { index$2_checkGitPluginUpdate as checkGitPluginUpdate, index$2_checkPkgUpdate as checkPkgUpdate, index$2_errorToString as errorToString, index$2_exec as exec, index$2_ffmpeg as ffmpeg, index$2_ffplay as ffplay, index$2_ffprobe as ffprobe, index$2_fileToUrl as fileToUrl, index$2_fileToUrlHandlerKey as fileToUrlHandlerKey, formatTime$1 as formatTime, index$2_getCommit as getCommit, index$2_getHash as getHash, index$2_getPid as getPid, index$2_getPkgVersion as getPkgVersion, index$2_getRemotePkgVersion as getRemotePkgVersion, index$2_getRequestIp as getRequestIp, index$2_getTime as getTime, index$2_importModule as importModule, index$2_isClass as isClass, index$2_isDocker as isDocker, index$2_isIPv4Loop as isIPv4Loop, index$2_isIPv6Loop as isIPv6Loop, index$2_isLinux as isLinux, index$2_isLocalRequest as isLocalRequest, index$2_isLoopback as isLoopback, index$2_isMac as isMac, index$2_isRoot as isRoot, index$2_isWin as isWin, index$2_restart as restart, index$2_restartDirect as restartDirect, index$2_stringifyError as stringifyError, index$2_updateAllGitPlugin as updateAllGitPlugin, index$2_updateAllPkg as updateAllPkg, index$2_updateGitPlugin as updateGitPlugin, index$2_updatePkg as updatePkg, uptime$1 as uptime }
  }

  type AxiosFn = {
    /**
     * 对axios进行简单封装，超时、错误后返回null，不会抛出异常
     * @param param axios参数
     */
    (param: AxiosRequestConfig): Promise<AxiosResponse<any> | null>;
    /**
     * 对axios进行简单封装，超时、错误后返回null，不会抛出异常
     * @param url 请求地址
     * @param type 请求类型
     * @param param axios参数
     */
    (url: string, type: 'get' | 'post', param?: AxiosRequestConfig): Promise<AxiosResponse<any> | null>
  }
  interface NpmInfo {
    plugin: string
    path: string
    file: string
    isMain: boolean
  }
  /**
   * 休眠函数
   * @param ms 毫秒
   * @example
   * ```ts
   * await sleep(1000)
   * ```
   */
  export const sleep: (ms: number) => Promise<unknown>
  /**
   * axios请求
   * @param paramOrUrl axios参数或url
   * @param type 请求类型 只有在传入url时有效
   * @param param axios参数 只有在传入url时有效
   * @example
   * ```ts
   * await axios({ url: 'https://example.com', method: 'get' })
   * await axios({ url: 'https://example.com', method: 'post', data: { key: 'value' } })
   * await axios('https://example.com', 'post', { data: { key: 'value' } })
   * await axios('https://example.com', 'get')
   * // -> null 或 axios返回值
   * ```
   */
  export const axios: AxiosFn
  /**
   * 获取运行时间
   * @example
   * ```ts
   * uptime()
   * // -> '1天2小时3分钟4秒'
   * // -> '2小时3分钟4秒'
   * // -> '3分钟4秒'
   * // -> '4秒'
   * ```
   */
  export const uptime: () => string
  /**
   * @description 传入一个或两个时间戳
   * @description 传入一个返回当前时间 - 时间1
   * @description 传入两个返回时间2 - 时间1
   * @param time - 时间戳
   * @example
   * common.formatTime(1620000000)
   * // -> '18天'
   * common.formatTime(1620000000, 1620000000)
   * // -> '18天'
   */
  export const formatTime: (time: number, time2?: number) => string
  /**
   * @deprecated 已废弃 建议使用`yaml`模块
   * 更新yaml文件
   * @param filePath - 文件路径
   * @param settings - 设置项
   */
  export const updateYaml: (filePath: string, settings: Array<{
    /** 键路径 */
    key: string
    /** 要写入的内容 */
    val: any
    /** 需要写入的注释 */
    comment: string
    /** 注释在开头还是结尾 */
    type?: 'top' | 'end'
  }>) => void
  /**
   * @deprecated 已废弃 请使用`getNpmPlugins`、`getNpmPluginsInfo`
   * 获取npm插件列表
   * @param showDetails - 是否返回详细信息
   * 默认只返回插件npm包名，为true时返回详细的{dir, name}[]
   */
  export const getNpmPlugins: (showDetails?: boolean) => Promise<string[] | PkgInfo[]>
  /**
   * @deprecated 已废弃
   * 获取git插件列表
   * @param isPack - 是否屏蔽不带package.json的插件，默认为false
   */
  export const getPlugins: (isPack?: boolean) => Promise<string[]>
  /**
   * @deprecated 已废弃
   * 获取git插件列表
   * @param isPack - 是否屏蔽不带package.json的插件，默认为false
   */
  export const getGitPlugins: (isPack?: boolean) => Promise<string[] | PkgInfo[]>
  /**
   * 传入图片数组，拼接成一个图片
   * @param images - 图片数组 支持路径和带前缀base64字符串`(base64://...)`
   * @param perRow - 每行图片数量 默认3
   * @returns 返回base64 不含`data:image/png;base64` `base64://`等前缀
   */
  export const mergeImage: (images: string[], perRow?: number) => Promise<{
    base64: string
    height: number
    width: number
  }>
  /**
   * 将全部图片转为绝对路径
   * @param images - 图片数组
   * @param root - 根目录
   * @returns 返回绝对路径数组
   */
  export const getAbsPath: (images: string[], root: string) => string[]

  type index$1_AxiosFn = AxiosFn
  type index$1_NpmInfo = NpmInfo
  export const index$1_absPath: typeof absPath
  export const index$1_axios: typeof axios
  export const index$1_base64: typeof base64
  export const index$1_buffer: typeof buffer
  export const index$1_createRawMessage: typeof createRawMessage
  export const index$1_downFile: typeof downFile
  export const index$1_formatTime: typeof formatTime
  export const index$1_getAbsPath: typeof getAbsPath
  export const index$1_getGitPlugins: typeof getGitPlugins
  export const index$1_getNpmPlugins: typeof getNpmPlugins
  export const index$1_getPlugins: typeof getPlugins
  export const index$1_getRelPath: typeof getRelPath
  export const index$1_isDir: typeof isDir
  export const index$1_isPlugin: typeof isPlugin
  export const index$1_karinToQQBot: typeof karinToQQBot
  export const index$1_makeForward: typeof makeForward
  export const index$1_makeMessage: typeof makeMessage
  export const index$1_mergeImage: typeof mergeImage
  export const index$1_qqbotToKarin: typeof qqbotToKarin
  export const index$1_sleep: typeof sleep
  export const index$1_splitPath: typeof splitPath
  export const index$1_stream: typeof stream
  export const index$1_updateYaml: typeof updateYaml
  export const index$1_uptime: typeof uptime
  export const index$1_urlToPath: typeof urlToPath
  // export namespace index$1 {
  //   export { type index$1_AxiosFn as AxiosFn, type index$1_NpmInfo as NpmInfo, index$1_absPath as absPath, index$1_axios as axios, index$1_base64 as base64, index$1_buffer as buffer, karinToQQBot as buttonToQQBot, index$1_createRawMessage as createRawMessage, index$1_downFile as downFile, existToMkdir as exists, index$1_formatTime as formatTime, index$1_getAbsPath as getAbsPath, index$1_getGitPlugins as getGitPlugins, index$1_getNpmPlugins as getNpmPlugins, index$1_getPlugins as getPlugins, index$1_getRelPath as getRelPath, index$1_isDir as isDir, index$1_isPlugin as isPlugin, index$1_karinToQQBot as karinToQQBot, index$1_makeForward as makeForward, index$1_makeMessage as makeMessage, createRawMessage as makeMessageLog, index$1_mergeImage as mergeImage, mkdirSync as mkdir, getPluginInfo as pkgJson, pkgRoot as pkgroot, index$1_qqbotToKarin as qqbotToKarin, readJsonSync as readJson, read as readYaml, index$1_sleep as sleep, index$1_splitPath as splitPath, index$1_stream as stream, index$1_updateYaml as updateYaml, index$1_uptime as uptime, index$1_urlToPath as urlToPath, writeJsonSync as writeJson, write as writeYaml }
  // }

  /** node-karin的package */
  export const pkg: () => Package
  /** http端口 */
  export const port: () => number
  /** host */
  export const host: () => string
  /** 根路由文案 */
  export const rootMsg: () => string[]
  /** 主人列表 */
  export const master: () => string[]
  /** 管理员列表 */
  export const admin: () => string[]
  /** 超时时间 */
  export const timeout: () => number
  /** Redis 配置 */
  export const redis: () => Redis
  /** Pm2配置 */
  export const pm2: () => PM2
  /** 鉴权秘钥 */
  export const authKey: () => string
  /**
   * 获取好友配置
   * @param userId 用户ID
   * @param selfId 机器人ID
   */
  export const getFriendCfg: (userId: string, selfId?: string) => FriendDirect
  /**
   * 获取频道私信配置
   * @param userId 用户ID
   * @param selfId 机器人ID
   */
  export const getDirectCfg: (userId: string, selfId?: string) => FriendDirect
  /**
   * 获取指定群配置
   * @param groupId 群号
   * @param selfId 机器人ID
   */
  export const getGroupCfg: (groupId: string, selfId?: string) => GroupGuild
  /**
   * 获取指定频道配置
   * @param guildId 频道ID
   * @param channelId 子频道ID
   * @param selfId 机器人ID
   */
  export const getGuildCfg: (guildId: string, channelId?: string, selfId?: string) => GroupGuild
  /**
   * 获取配置 包含默认配置和用户配置
   * @param name 文件名称
   * @param isRefresh 是否刷新缓存
   */
  export const getMergeYaml: <T extends keyof ConfigMap>(name: T, isRefresh?: boolean) => ConfigMap[T]
  type GetYaml<T extends keyof ConfigMap, K> = K extends true ? ConfigMap[T] : Watch<ConfigMap[T]>
  /**
   * 获取配置yaml
   * @param name 文件名称
   * @param type 文件类型 用户配置/默认配置
   * @param isRefresh 是否刷新缓存
   */
  export const getYaml: <T extends keyof ConfigMap, K extends boolean = false>(name: T, type: 'user' | 'default', isRefresh?: K) => GetYaml<T, K>
  /**
   * Config 配置
   * @param isRefresh 是否刷新缓存
   */
  export const config: (isRefresh?: boolean) => Config
  /**
   * Server 配置
   * @param isRefresh 是否刷新缓存
   */
  export const server$1: (isRefresh?: boolean) => Server
  /**
   * 更新日志等级
   * @param level 日志等级
   */
  export const updateLevel: (level?: string) => void
  /**
   * @description 修改框架配置
   * @param name 文件名称
   * @param data 配置数据
   */
  export const setYaml: <T extends keyof ConfigMap>(name: T, data: Record<string, any>) => boolean
  /**
   * @description 创建基本配置
   */
  /** 初始化 */
  export const init: () => void

  export const index_admin: typeof admin
  export const index_authKey: typeof authKey
  export const index_config: typeof config
  export const index_getDirectCfg: typeof getDirectCfg
  export const index_getFriendCfg: typeof getFriendCfg
  export const index_getGroupCfg: typeof getGroupCfg
  export const index_getGuildCfg: typeof getGuildCfg
  export const index_getMergeYaml: typeof getMergeYaml
  export const index_getYaml: typeof getYaml
  export const index_host: typeof host
  export const index_init: typeof init
  export const index_master: typeof master
  export const index_pkg: typeof pkg
  export const index_pm2: typeof pm2
  export const index_port: typeof port
  export const index_redis: typeof redis
  export const index_rootMsg: typeof rootMsg
  export const index_setYaml: typeof setYaml
  export const index_timeout: typeof timeout
  export const index_updateLevel: typeof updateLevel
  export namespace index {
    export { index_admin as admin, index_authKey as authKey, index_config as config, index_getDirectCfg as getDirectCfg, index_getFriendCfg as getFriendCfg, index_getGroupCfg as getGroupCfg, index_getGuildCfg as getGuildCfg, index_getMergeYaml as getMergeYaml, index_getYaml as getYaml, index_host as host, index_init as init, index_master as master, index_pkg as pkg, index_pm2 as pm2, index_port as port, index_redis as redis, index_rootMsg as rootMsg, server$1 as server, index_setYaml as setYaml, index_timeout as timeout, index_updateLevel as updateLevel }
  }

  /** ws 服务 */
  export const wss: WebSocketServer

  /** express 服务 */
  export const app: Express
  /** http 服务 */
  export const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  /**
   * 监听端口
   * @param port 监听端口
   * @param host 监听地址
   */
  export const listen: (port: number, host: string) => void
  // export { Action, AdapterOneBot, type AnonymousSegment, type AtSegment, Bot, type CacheEntry, type ContactSegment, type CustomMusicSegment, type CustomNodeSegments, type DiceSegment, type DirectNodeSegment, type FaceSegment, type FileSegment, type ForwardSegment, type FriendSender, type GetBot, type GetGroupInfo, type GetGroupMemberInfo, type GetMsg, type GroupSender, type HandlerType, type HonorInfoList, type ImageSegment, type JsonSegment, type KarinButton, type LocationSegment, type MetaEventBase, type MusicSegment, type NoticeBase$1 as NoticeBase, type OB11AllEvent, OB11Event, type OB11EventBase, type OB11GroupMessage, type OB11GroupTempMessage, type OB11Message, OB11MessageSubType, OB11MessageType, type OB11Meta, type OB11NodeSegment, type OB11Notice, OB11NoticeType, type OB11PrivateMessage, type OB11Request, OB11RequestType, type OB11Segment, type OB11SegmentBase, type OB11SegmentType, OB11Sex, type OneBot11FriendAdd, type OneBot11FriendRecall, type OneBot11FriendRequest, type OneBot11GroupAdmin, type OneBot11GroupBan, type OneBot11GroupCard, type OneBot11GroupDecrease, type OneBot11GroupEssence, type OneBot11GroupIncrease, type OneBot11GroupMessageReaction, type OneBot11GroupMessageReactionLagrange, type OneBot11GroupRecall, type OneBot11GroupRequest, type OneBot11GroupUpload, type OneBot11Heartbeat, type OneBot11Honor, type OneBot11Lifecycle, type OneBot11LuckyKing, type OneBot11Poke, type Params, type Parser, type PkgData, type PokeSegment, type QQBotButton, type QQButtonTextType, type RecordSegment, type ReplySegment, type Request$1 as Request, type RequestBase$1 as RequestBase, type RequireFunction, type RequireFunctionSync, type RequireOptions, type RpsSegment, type Segment, type ShakeSegment, type ShareSegment, type TextSegment, type UnregisterBot, type UserInfo, type VideoSegment, Watch, Watcher, type XmlSegment, type YamlComment, YamlEditor, type YamlValue, absPath, app, applyComments, base64, buffer, buttonHandle, changelog, checkGitPluginUpdate, checkPkgUpdate, clearRequire, clearRequireFile, comment, index$1 as common, index as config, copyConfig, copyConfigSync, copyFiles, copyFilesSync, createLogger, createPluginDir, createRawMessage, karin as default, downFile, errorToString, exec, existToMkdir, existToMkdirSync, exists, existsSync, ffmpeg, ffplay, ffprobe, fs as file, fileToUrl, fileToUrlHandlerKey, filesByExt, formatTime$1 as formatTime, index$3 as fs, getAllBot, getAllBotID, getAllBotList, getBot, getBotCount, getCommit, getFiles, getHash, getPid, getPkgVersion, getPluginInfo, getRelPath, getRemotePkgVersion, getRequestIp, getTime, handler$1 as handler, importModule, isClass, isDir, isDirSync, isDocker, isFile, isFileSync, isIPv4Loop, isIPv6Loop, isLinux, isLocalRequest, isLoopback, isMac, isPlugin, isRoot, isStatic, isSubPath, isWin, json, karin, karinToQQBot, key, level, listen, lock, lockMethod, lockProp, log, logger, logs, makeForward, makeMessage, mkdir, mkdirSync, parseChangelog, pkgRoot, qqbotToKarin, range, read, readFile, readJson, readJsonSync, redis$1 as redis, registerBot, requireFile, requireFileSync, restart, restartDirect, rmSync, save, segment, sendMsg, sep, server, splitPath, stream, stringifyError, index$2 as system, unregisterBot, updateAllGitPlugin, updateAllPkg, updateGitPlugin, updatePkg, uptime$1 as uptime, urlToPath, watch, watchAndMerge, write, writeJson, writeJsonSync, wss, yaml }

  export { karin as default }
}
