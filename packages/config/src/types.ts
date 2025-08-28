/**
 * 配置文件联合类型
 */
export type ConfigTypes = ConfigAdapter | ConfigEnv | ConfigGroups | ConfigPM2 | ConfigPrivates | ConfigRedis | ConfigRender | ConfigConfig

/**
 * 文件名称与类型映射
 */
export interface ConfigMap {
  adapter: ConfigAdapter
  groups: ConfigGroups
  pm2: ConfigPM2
  privates: ConfigPrivates
  redis: ConfigRedis
  render: ConfigRender
  config: ConfigConfig
  env: Record<string, { value: string, comment: string }>
}

/**
 * 格式化函数的文件名称与类型映射
 */
export interface ConfigFormatMap {
  adapter: {
    /** 参数 */
    params: ConfigAdapter
    /** 返回值 */
    result: ConfigAdapter
  }
  pm2: {
    /** 参数 */
    params: ConfigPM2
    /** 返回值 */
    result: ConfigPM2
  }
  redis: {
    /** 参数 */
    params: ConfigRedis
    /** 返回值 */
    result: ConfigRedis
  }
  render: {
    /** 参数 */
    params: ConfigRender
    /** 返回值 */
    result: ConfigRender
  }
  config: {
    /** 参数 */
    params: ConfigConfig
    /** 返回值 */
    result: ConfigConfig
  }
  env: {
    /** 参数 */
    params: string
    /** 返回值 */
    result: Record<string, { value: string, comment: string }>
  }
  groups: {
    /** 参数 */
    params: ConfigGroups
    /** 返回值 */
    result: Record<string, ConfigGroupValue>
  }
  privates: {
    /** 参数 */
    params: ConfigPrivates
    /** 返回值 */
    result: Record<string, ConfigPrivateValue>
  }
}

/**
 * adapter.json 类型
 */
export interface ConfigAdapter {
  /** `console`适配器配置 */
  console: {
    /** 是否为只允许本地访问 */
    isLocal: boolean
    /** 如果`isLocal`为`false`，则需要设置`token` */
    token: string
    /** 打印的资源地址 */
    host: string
  },
  /** onebot适配器配置 */
  onebot: {
    /** ws服务器的鉴权令牌 也就是反向ws的token */
    ws_server: {
      /** 是否启用 */
      enable: boolean
      /** onebot发送请求超时时间 */
      timeout: number
    },
    /** 正向ws的配置 */
    ws_client: {
      /** 是否启用 */
      enable: boolean
      /** 正向ws的地址 */
      url: string
      /** 正向ws的鉴权令牌 */
      token: string
    }[]
    /** http服务器的配置 */
    http_server: {
      /** 是否启用 */
      enable: boolean
      /** 正向http的QQ号 */
      self_id: string
      /** http服务的地址 */
      url: string
      /** @deprecated http服务的鉴权令牌  */
      token: string
      /** 用于发送Api请求的鉴权Token 如果协议端没有设置无需填写 */
      api_token: string
      /** 用于验证请求合法的Token 如果协议端没有设置无需填写 */
      post_token: string
    }[]
  }
}

/**
 * .env 类型
 */
export interface ConfigEnv {
  /** 是否启用HTTP */
  HTTP_ENABLE: string
  /** HTTP监听端口 */
  HTTP_PORT: string
  /** HTTP监听地址 */
  HTTP_HOST: string
  /** HTTP鉴权秘钥 仅用于karin自身Api */
  HTTP_AUTH_KEY: string
  /** ws_server鉴权秘钥 */
  WS_SERVER_AUTH_KEY: string
  /** 是否启用Redis 关闭后将使用内部虚拟Redis */
  REDIS_ENABLE: string
  /** 重启是否调用pm2 如果不调用则会直接关机 此配置适合有进程守护的程序 */
  PM2_RESTART: string
  /** 日志等级 */
  LOG_LEVEL: string
  /** 日志保留天数 */
  LOG_DAYS_TO_KEEP: string
  /** 日志文件最大大小 如果此项大于0则启用日志分割 */
  LOG_MAX_LOG_SIZE: string
  /** logger.fnc颜色 */
  LOG_FNC_COLOR: string
  /** 运行器 "node" | "pm2" | "tsx" */
  RUNTIME: 'node' | 'pm2' | 'tsx'
  /** ffmpeg路径 */
  FFMPEG_PATH: string
  /** ffprobe路径 */
  FFPROBE_PATH: string
  /** ffplay路径 */
  FFPLAY_PATH: string
  /** tsx监察者模式 */
  TSX_WATCH: string
}

/**
 * `groups.json`中的单个值类型
 */
export interface ConfigGroupValue {
  /** 配置键: `Bot:selfId:groupId` */
  key: string
  /** 是否继承全局配置 默认`true` */
  inherit: boolean
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
  member_enable: string[]
  /** 群、频道成员单独白名单 */
  member_disable: string[]
}

/**
 * `groups.json` 文件类型
 */
export type ConfigGroups = ConfigGroupValue[]

/**
 * `pm2.json` 类型
 */
export interface ConfigPM2 {
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
    /** 最大重启次数 */
    max_restarts: number
    /** 最大内存重启 */
    max_memory_restart: string
    /** 重启延迟 */
    restart_delay: number
    /** 合并日志 */
    merge_logs: boolean
    /** 错误日志路径 */
    error_file: string
    /** 输出日志路径 */
    out_file: string
  }>
}

/**
 * `privates.json`文件中数组元素的类型
 */
export interface ConfigPrivateValue {
  /** 配置键 `Bot:selfId:userId` */
  key: string
  /** 是否继承全局配置 默认`true` */
  inherit: boolean
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

/**
 * `privates.json` 类型
 */
export type ConfigPrivates = ConfigPrivateValue[]

/**
 * `redis.json` 类型
 */
export type ConfigRedis = Record<string, any>

/**
 * render.json 类型
 */
export interface ConfigRender {
  /** ws服务器配置`反向ws` */
  ws_server: {
    /** 是否启用 */
    enable: boolean
  },
  /** ws客户端配置`正向ws` */
  ws_client: {
    /** 是否启用 */
    enable: boolean
    /** 地址 */
    url: string
    /** 令牌 */
    token: string
    /** 是否为snapka */
    isSnapka: boolean
    /** 重连时间 单位毫秒 默认5000 */
    reconnectTime?: number
    /** 心跳时间 单位毫秒 默认30000 */
    heartbeatTime?: number
  }[],
  /** http服务器配置`反向http` */
  http_server: {
    /** 是否启用 */
    enable: boolean
    /** 地址 */
    url: string
    /** 令牌 */
    token: string
    /** 是否为snapka */
    isSnapka: boolean
  }[]
}

/**
 * `config.json` 类型
 */
export interface ConfigConfig {
  /** 主人列表 */
  master: string[]
  /** 管理员列表 */
  admin: string[]
  /** 用户管理 */
  user: {
    /** 用户白名单 */
    enable_list: string[]
    /** 用户黑名单 */
    disable_list: string[]
  }
  /** 好友管理 */
  friend: {
    /** 是否启用好友消息事件 */
    enable: boolean
    /** 好友白名单 */
    enable_list: string[]
    /** 好友黑名单 */
    disable_list: string[]
    /** 好友日志白名单 */
    log_enable_list: string[]
    /** 好友日志黑名单 */
    log_disable_list: string[]
  }
  /** 群管理 */
  group: {
    /** 是否启用群消息事件 */
    enable: boolean
    /** 群白名单 */
    enable_list: string[]
    /** 群黑名单 */
    disable_list: string[]
    /** 群日志白名单 */
    log_enable_list: string[]
    /** 群日志黑名单 */
    log_disable_list: string[]
  }
  /** 频道私信管理 */
  directs: {
    /** 是否启用私信消息事件 */
    enable: boolean
    /** 私信白名单 */
    enable_list: string[]
    /** 私信黑名单 */
    disable_list: string[]
    /** 私信日志白名单 */
    log_enable_list: string[]
    /** 私信日志黑名单 */
    log_disable_list: string[]
  }
  /** 频道管理 */
  guilds: {
    /** 是否启用频道消息事件 */
    enable: boolean
    /** 频道白名单 */
    enable_list: string[]
    /** 频道黑名单 */
    disable_list: string[]
    /** 频道日志白名单 */
    log_enable_list: string[]
    /** 频道日志黑名单 */
    log_disable_list: string[]
  }
  /** 子频道消息管理 */
  channels: {
    /** 是否启用子频道消息事件 */
    enable: boolean
    /** 子频道白名单 */
    enable_list: string[]
    /** 子频道黑名单 */
    disable_list: string[]
    /** 子频道日志白名单 */
    log_enable_list: string[]
    /** 子频道日志黑名单 */
    log_disable_list: string[]
  }
}
