import pkg from '../../package.json'
import { PluginConfig } from '@karinjs/config'

/**
 * OneBot Client 配置类型
 */
export interface OneBotClientConfig {
  /** 是否启用 */
  enable: boolean
  /** 连接地址 */
  url: string
  /**
   * 发送请求超时时间（毫秒）
   * @description 默认60 * 1000 毫秒(60秒)
   * @default 60000
   */
  timeout: number
  /**
   * 鉴权头部信息
   * @description 如果服务器端设置了token，此处需要提供相同的Authorization头部信息才能通过鉴权
   * @default ''
   * @example
   * ```json
   * // 服务器端配置
   * Authorization: 'my_secret_key'
   *
   * // 客户端连接时需要提供相同的头部信息
   * {
   *  "url": "ws://127.0.0.1:7777/onebot/ws",
   *  "token": "my_secret_key"
   *   // 同时还支持 "Bearer my_secret_key"
   *   // 适配器会在连接时自动添加 Authorization 头部信息
   * }
   * ```
   */
  token: string
  /**
   * 自定义请求头部信息
   * @description 可用于添加额外的鉴权信息或其他自定义头部，需要注意的是这些头部不会覆盖自动添加的 Authorization 头部
   * @default {}
   * @example
   * ```ts
   * headers: {
   *   'X-Custom-Header': 'custom_value'
   * }
   * ```
   */
  headers: Record<string, string | string[]>
}

/**
 * OneBot HTTP 客户端配置类型
 */
export interface OneBotHttpClientConfig {
  /** 是否启用 */
  enable: boolean
  /** 连接地址 */
  url: string
  /**
   * 发送请求超时时间（毫秒）
   * @description 默认60 * 1000 毫秒(60秒)
   * @default 60000
   */
  timeout: number
  /**
   * 鉴权头部信息
   * @description 如果服务器端设置了token，此处需要提供相同的Authorization头部信息才能通过鉴权
   * @default ''
   */
  token: string
  /**
   * 自定义请求头部信息
   * @description 可用于添加额外的鉴权信息或其他自定义头部，需要注意的是这些头部不会覆盖自动添加的 Authorization 头部
   * @default {}
   * @example
   * ```ts
   * headers: {
   *   'X-Custom-Header': 'custom_value'
   * }
   * ```
   */
  headers: Record<string, string | string[]>
}

/**
 * OneBot 适配器配置
 */
export interface OneBotAdapterConfig {
  /** OneBot WebSocket Server 连接配置 */
  server: {
    /** 全局OneBot服务器是否启用 */
    enable: boolean
    /**
     * 监听路由
     * @default /
     * @example
     * ```ts
     * route: '/onebot/ws'
     * // 最终访问地址示例 ws://127.0.0.1:7777/onebot/ws
     * ```
     */
    route: string
    /**
     * 发送请求超时时间（毫秒）
     * @description 默认60 * 1000 毫秒(60秒)
     * @default 60000
     */
    timeout: number
    /**
     * 鉴权秘钥
     * @description 如果设置此项，客户端连接时需要提供相同的Authorization头部信息才能通过鉴权
     * @default ''
     * @example
     * ```ts
     * // 服务器端配置
     * Authorization: 'my_secret_key'
     *
     * // 客户端连接时需要提供相同的头部信息
     * headers: {
     *   Authorization: 'Bearer my_secret_key'
     * }
     * ```
     */
    token: string
  }
  /** OneBot WebSocket Client 连接配置 */
  client: {
    /** 全局OneBot客户端是否启用 */
    enable: boolean
    /**
     * 全局OneBot客户端超时设置（毫秒）
     * @description 该配置会作为所有OneBot客户端连接的默认超时设置，可以在每个客户端配置中单独设置timeout来覆盖此默认值
     * @default 60 * 1000 毫秒(60秒)
     */
    timeout: number
    /** 客户端连接目标列表 */
    targets: OneBotClientConfig[]
  }
  /** OneBot HTTP 连接配置 */
  http: {
    webhook: {
      /** 是否启用 */
      enable: boolean
      /**
       * 监听路由
       * @default /onebot/webhook
       * @example
       * ```ts
       * route: 'http://127.0.0.1:7777/webhook/onebot'
       * // 最终访问地址示例 http://127.0.0.1:7777/webhook/onebot
       * ```
       */
      route: string
      /**
       * 通用鉴权秘钥
       * @description 如果设置此项，客户端请求时需要提供相同的Authorization头部信息才能通过鉴权
       * @default ''
       * @example
       * ```ts
       * // 服务器端配置
       * Authorization: 'my_secret_key'
       *
       * // 客户端请求时需要提供相同的头部信息
       * headers: {
       *   Authorization: 'Bearer my_secret_key'
       * }
       * ```
       */
      token: string
      /**
       * 单独设置每个QQ号的鉴权秘钥
       * @description 如果设置此项，客户端请求时需要提供对应QQ号的Authorization头部信息才能通过鉴权，优先级高于通用鉴权秘钥
       * @default {}
       * @example
       * ```ts
       * {
       *   '123456789': 'qq1_secret_key',
       *   '987654321': 'qq2_secret_key'
       * }
       *
       * // 当收到以下头部的事件时 将会走对应QQ号的鉴权秘钥进行校验
       * {
       *   "Content-Type": "application/json",
       *   "X-Self-ID": "123456789"
       * }
       * ```
       */
      tokens: Record<string, string>
    }
    /** HTTP 客户端配置 */
    client: {
      /** 是否启用 */
      enable: boolean
      /**
       * 全局发送请求超时时间（毫秒）
       * @description 默认60 * 1000 毫秒(60秒)
       * @default 60000
       */
      timeout: number
      /** 客户端连接目标列表 */
      targets: OneBotHttpClientConfig[]
    }
  }
}

const config = new PluginConfig<{
  'config.json': OneBotAdapterConfig
}>(pkg.name)

/** 默认配置 */
const defaultConfig: OneBotAdapterConfig = {
  server: {
    enable: true,
    route: '/',
    timeout: 60000,
    token: '',
  },
  client: {
    enable: false,
    timeout: 60000,
    targets: [],
  },
  http: {
    webhook: {
      enable: false,
      route: '/onebot/webhook',
      token: '',
      tokens: {},
    },
    client: {
      enable: false,
      timeout: 60000,
      targets: [],
    },
  },
}

config.createConfig('config.json', defaultConfig)

/**
 * 写入配置
 * @param data 部分配置数据
 */
const writeConfig = (data: Partial<OneBotAdapterConfig>) => {
  config.setConfig('config.json', {
    server: {
      enable: config.types.bool(data.server?.enable, defaultConfig.server.enable),
      route: config.types.string(data.server?.route, defaultConfig.server.route),
      timeout: config.types.number(data.server?.timeout, defaultConfig.server.timeout),
      token: config.types.string(data.server?.token, defaultConfig.server.token),
    },
    client: {
      enable: config.types.bool(data.client?.enable, defaultConfig.client.enable),
      timeout: config.types.number(data.client?.timeout, defaultConfig.client.timeout),
      targets: Array.isArray(data.client?.targets)
        ? data.client!.targets.map(item => ({
          enable: config.types.bool(item.enable, true),
          url: config.types.string(item.url, ''),
          timeout: config.types.number(item.timeout, defaultConfig.client.timeout),
          token: config.types.string(item.token, ''),
          headers: item.headers || {},
        }))
        : [],
    },
    http: {
      webhook: {
        enable: config.types.bool(data.http?.webhook?.enable, defaultConfig.http.webhook.enable),
        route: config.types.string(data.http?.webhook?.route, defaultConfig.http.webhook.route),
        token: config.types.string(data.http?.webhook?.token, defaultConfig.http.webhook.token),
        tokens: data.http?.webhook?.tokens || {},
      },
      client: {
        enable: config.types.bool(data.http?.client?.enable, defaultConfig.http.client.enable),
        timeout: config.types.number(data.http?.client?.timeout, defaultConfig.http.client.timeout),
        targets: Array.isArray(data.http?.client?.targets)
          ? data.http!.client!.targets.map(item => ({
            enable: config.types.bool(item.enable, true),
            url: config.types.string(item.url, ''),
            timeout: config.types.number(item.timeout, defaultConfig.http.client.timeout),
            token: config.types.string(item.token, ''),
            headers: item.headers || {},
          }))
          : [],
      },
    },
  })
}

export { config, writeConfig }
