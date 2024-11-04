import type chokidar from 'chokidar'

/** 配置文件缓存key */
export const enum configKey {
  /** 通用配置 */
  CONFIG = 'change.config',
  /** 服务器配置 */
  SERVER = 'change.server',
}

/** 配置文件枚举 */
export const enum ConfigEnum {
  /** 基本配置 */
  CONFIG = 'config',
  /** 好友、频道私信配置 */
  FRIEND_DIRECT = 'friendDirect',
  /** 群、子频道配置 */
  GROUP_GUILD = 'groupGuild',
  /** pm2配置 */
  PM2 = 'pm2',
  /** redis配置 */
  REDIS = 'redis',
  /** http服务、渲染服务配置 */
  SERVER = 'server',
}

/** 消息配置文件类型 */
export type ConfigFileType = 'groupGuild' | 'friendDirect'
/** 日志等级 */
export type LoggerLevel = 'all' | 'trace' | 'debug' | 'mark' | 'info' | 'warn' | 'error' | 'fatal' | 'off'

/** 群、频道消息配置文件类型 */
export interface GroupGuildFileCfg {
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
}

/** 好友、频道私信消息配置文件类型 */
export interface FriendDirectFileCfg {
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
}

/** redis服务配置 */
export interface RedisType {
  /** 地址 */
  host: string
  /** 端口 */
  port: number
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 数据库 */
  db: number
  /** 集群 */
  cluster: {
    /** 是否启用 */
    enable: boolean
    /** 根节点 */
    rootNodes: string[]
  }
}

/** pm2服务配置 */
export interface PM2Type {
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

/** http服务和渲染器服务 */
export interface ServerType {
  /** 当前文件热更新是否重启http服务 */
  hmrToServer: boolean
  /** http监听地址 */
  host: string
  /** http端口 */
  port: number
  /** ws api请求超时时间 秒 */
  timeout: number
  /** onebot11 正向WebSocket地址 */
  onebot11Socket: string[]
  /** websocket 渲染器地址 ws://127.0.0.1:7005/ws/render */
  renderSocket: string[]
  /** http渲染器地址 */
  renderHttp: string[]
}

/** package.json */
export interface PackageType {
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

/** 适配器、分组等配置 */
export interface AdapterGroupPingType {
  /** input适配器配置 以下所有配置均不支持热更新 */
  inputCfg: {
    /** 是否开启input适配器 */
    enable: boolean
    /** 是否将语音、图片、视频消息转为文件 转为文件后可通过url访问 */
    msgToFile: boolean
    /** 鉴权token 默认karin */
    token: string
    /** 生成url的ip */
    ip: string
    /** 自定义host:port 如果配置此项则ip无效 */
    host: string
    /** 是否允许局域网访问 需要token不为kairn */
    local: boolean
    /** 是否允许外网访问 需要token不为kairn */
    internet: boolean
  }
  // TODO: 暂时未想好如何实现
  // /** 插件分组列表 */
  // grouPingList: Record<string, {
  //   /** 分组模式 0-启用所有 1-启用指定 2-禁用所有 3-禁用指定 */
  //   mode: 0 | 1 | 2 | 3
  //   /** 插件列表 在mode为1或3时生效 */
  //   list: string[]
  // }>
  // /** 分组配置 指定Bot分组 > 适配器分组 */
  // grouPingCfg: Record<string, string>
}

/** 基本配置文件类型 */
export interface ConfigType {
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

  /** ffmpeg配置 */
  ffmpegPath: string
  /** ffprobe配置 */
  ffprobePath: string

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

/** ConfigEnum与返回值映射 用于泛型 */
export interface ConfigMap {
  config: ConfigType
  friendDirect: Record<string, FriendDirectFileCfg>
  groupGuild: Record<string, GroupGuildFileCfg>
  pm2: PM2Type
  redis: RedisType
  server: ServerType
}

/** 配置文件对应缓存 */
export interface FileCache {
  [configKey.CONFIG]: ConfigType
  [configKey.SERVER]: ServerType
}

/** 缓存类型 */
export interface CacheType {
  /** 好友、频道私信消息配置默认值 */
  friendCfgDef: FriendDirectFileCfg
  /** 群、频道消息配置默认值 */
  groupCfgDef: GroupGuildFileCfg
  /** 配置文件对应缓存 */
  file: FileCache
  /** 监听器缓存 */
  watcher: Map<string, chokidar.FSWatcher>
  /** 单独群、频道配置缓存 */
  groupGuild: Record<string, {
    /** 前一分钟调用数量 */
    start: number
    /** 当前调用数量 */
    count: number
    /** 配置 */
    config: GroupGuildFileCfg
  }>
  /** 单独好友、频道私信配置缓存 */
  friendDirect: Record<string, {
    /** 前一分钟调用数量 */
    start: number
    /** 当前调用数量 */
    count: number
    /** 配置 */
    config: FriendDirectFileCfg
  }>
}
