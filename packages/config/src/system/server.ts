import fs from 'node:fs'
import path from 'node:path'
import { store } from '@karinjs/store'
import { checkType, getValidPassword, getValidUsername, getFfmpegPath, filterStringArray } from '../utils'

export interface ConfigServerHttp {
  /**
   * 端口
   * @default 7777
   */
  port: number,
  /**
   * 主机地址
   * @default 0.0.0.0
   */
  host: string,
  /**
   * HTTP鉴权秘钥
   * @description 默认随机生成
   * @since 在2.0开始将分离 后端路由API与 WebUI登录 鉴权
   */
  auth_key: string,
  /**
   * 前端登录账户
   * @default admin
   */
  username: string,
  /**
   * 前端登录密码
   * @default admin
   */
  password: string,
}

export interface ConfigServerWs {
  /**
   * 是否启用WebSocket服务
   * @default true
   */
  enable: boolean,
  /**
   * 路由对应的鉴权秘钥
   * @description 键为路由路径，值为秘钥
   * @example
   * ```ts
   * {
   *   '/custom/route1': 'route1_secret_key',
   *   '/custom/route2': 'route2_secret_key',
   *   // 客户端需要在头部或者query中提供相同的Bearer token才能通过鉴权
   *   // 以 /custom/route2 为例子
   *   // ws://127.0.0.1:7777/custom/route2?token=Bearer route2_secret_key
   *   // 或者在连接时添加头部信息
   *   // {
   *   //   'Authorization': 'Bearer route2_secret_key'
   *   // }
   * }
   * ```
   */
  routes: Record<string, string>,
  /**
   * 忽略鉴权的路由列表
   * @description 如果某个路由不需要鉴权，可以将其添加到此列表中
   * @example
   * ```ts
   * [
   *   '/public/route1',
   *   '/public/route2'
   * ]
   * ```
   */
  exclude_routes: string[],
}

export interface ConfigServerFfmpeg {
  /**
   * ffmpeg路径
   * @default ""
   */
  ffmpeg_path: string,
  /**
   * ffprobe路径
   * @default ""
   */
  ffprobe_path: string,
  /**
   * ffplay路径
   * @default ""
   */
  ffplay_path: string,
}

export interface ConfigServer {
  /**
   * HTTP服务配置
   */
  http: ConfigServerHttp,
  /**
   * WebSocket服务配置
   */
  ws_server: ConfigServerWs,
  /**
   * FFmpeg配置
   */
  ffmpeg: ConfigServerFfmpeg,
}

/**
 * 默认服务配置
 */
export const configDefaultServer: ConfigServer = {
  http: {
    port: 7777,
    host: '0.0.0.0',
    auth_key: 'abc123',
    username: 'admin',
    password: 'admin',
  },
  ws_server: {
    enable: true,
    routes: {},
    exclude_routes: [],
  },
  ffmpeg: {
    ffmpeg_path: '',
    ffprobe_path: '',
    ffplay_path: '',
  },
}

/**
 * 兼容性处理
 * @param config 服务配置
 */
export const configServerCompat = (config: Partial<ConfigServer>): ConfigServer => {
  const customRoutes: Record<string, string> = {}
  Object.entries(config.ws_server?.routes || {}).forEach(([key, value]) => {
    const val = checkType('string', value, '')
    if (val.length === 0) return
    customRoutes[key] = val
  })

  /** 校验失败列表 */
  const invalidList: string[] = []
  const authKey = getValidPassword(config.http?.auth_key)
  const username = getValidUsername(config.http?.username)
  const password = getValidPassword(config.http?.password)

  if (username.valid === false) invalidList.push('[webui] 登录账户: server.http.username')
  if (password.valid === false) invalidList.push('[webui] 登录密码: server.http.password')
  if (authKey.valid === false) invalidList.push('[http] 鉴权秘钥: server.http.auth_key')

  const data = {
    http: {
      port: checkType('number', config.http?.port, configDefaultServer.http.port),
      host: checkType('string', config.http?.host, configDefaultServer.http.host),
      auth_key: authKey.value,
      username: username.value,
      password: password.value,
    },
    ws_server: {
      enable: checkType('boolean', config.ws_server?.enable, configDefaultServer.ws_server.enable),
      routes: customRoutes,
      exclude_routes: filterStringArray(config.ws_server?.exclude_routes),
    },
    ffmpeg: {
      ffmpeg_path: getFfmpegPath(config.ffmpeg?.ffmpeg_path, 'ffmpeg'),
      ffprobe_path: getFfmpegPath(config.ffmpeg?.ffprobe_path, 'ffprobe'),
      ffplay_path: getFfmpegPath(config.ffmpeg?.ffplay_path, 'ffplay'),
    },
  }

  if (invalidList.length > 0) {
    const log = globalThis.logger || console
    const abs = path.join(store.core.config, 'system', 'server.json')

    /** 重新保存 */
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, JSON.stringify(data, null, 2))

    const rel = path.relative(process.cwd(), abs)
    logger.error('-'.repeat(50))
    log.error('以下配置项校验未通过，已自动生成新的安全值，请前往配置文件查看：')
    log.error(`文件路径: ${rel}`)
    invalidList.forEach(i => log.error(i))
    logger.error('-'.repeat(50))
  }

  return data
}

/**
 * 服务配置 API
 */
export const server = {
  /**
   * 默认服务配置
   */
  default: configDefaultServer,
  /**
   * 兼容性处理服务配置
   */
  compat: configServerCompat,
  /**
   * 清空缓存（空函数）
   */
  clearCache: () => { },
}
