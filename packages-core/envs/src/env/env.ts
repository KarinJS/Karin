/**
 * 核心环境变量类型定义
 */
export interface CoreEnv {
  /**
   * 当前运行环境
   * - development 开发环境
   * - production 生产环境
   * - test 测试环境
   */
  NODE_ENV: 'development' | 'production' | 'test'
  /** 是否启用调试模式 */
  DEBUG?: string
  /** node-karin版本 */
  VERSION: string
  /** node-karin版本 */
  KARIN_VERSION: string

  /**
   * HTTP监听端口
   * @default 7777
   */
  HTTP_PORT: string
  /**
   * HTTP监听地址
   * @default 0.0.0.0
   */
  HTTP_HOST: string
  /**
   * HTTP鉴权秘钥
   * @description 默认随机生成
   * @since 在2.0开始将分离 后端路由API与 WebUI登录 鉴权
   */
  HTTP_AUTH_KEY: string
  /**
   * HTTP WebUI登录账户
   * @description 仅用于WebUI登录
   */
  HTTP_WEBUI_USER: string
  /**
   * HTTP WebUI登录秘钥
   * @description 前端登录秘钥有2种配置方式:
   * - 明文字符串: 直接设置环境变量 HTTP_WEBUI_KEY
   * - 哈希: 通过sha256计算: `${password}.karin` -> sha256 -> hex -> urlsafeBase64 最终结果
   */
  HTTP_WEBUI_KEY: string
  /**
   * 运行时环境
   * - node: 使用 Node.js 运行
   * - bun: 通过 Bun 运行
   * - pm2: 通过 PM2 运行
   * - tsx: 使用 TSX 运行
   */
  RUNTIME: 'node' | 'pm2' | 'tsx' | 'bun'
}

/**
 * ffmpeg环境变量类型定义
 */
export interface FfmpegEnv {
  /** ffmpeg路径 */
  FFMPEG_PATH: string
  /** ffprobe路径 */
  FFPROBE_PATH: string
  /** ffplay路径 */
  FFPLAY_PATH: string
}

/**
 * 数据目录环境变量类型定义
 */
export interface DataEnv {
  /**
   * 所有数据文件的基础目录
   * @default @karinjs
   * @since 2.0 变更为.karin
   * @description 支持使用绝对路径或相对于用户主目录的路径
   * @example
   * ```ini
   * # 使用绝对路径
   * BASE_DIR=/var/lib/karin
   *
   * # 使用相对路径（相对于用户主目录）
   * BASE_DIR=.karin_data
   * ```
   */
  BASE_DIR?: string
  /**
   * 临时文件目录名称
   * @default temp
   * @since 2.0
   * @description 仅支持文件夹名称 会被解析到 BASE_DIR 下
   */
  TEMP_DIR_NAME?: string
}

declare global {
  type EventEmitter = import('events').EventEmitter

  namespace NodeJS {
    interface ProcessEnv extends CoreEnv, DataEnv, FfmpegEnv { }

    interface ProcessVersions {
      /** karin版本 */
      karin: string
      /** bun版本 */
      bun?: string
    }
  }
}

export { }
