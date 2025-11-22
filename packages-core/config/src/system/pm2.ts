export interface ConfigPm2App {
  /**
   * 应用名称
   * @default karin
   */
  name: string,
  /**
   * 启动脚本
   * @default index.js
   */
  script: string,
  /**
   * 自动重启
   * @default true
   */
  autorestart: boolean,
  /**
   * 最大重启次数
   * @default 60
   */
  max_restarts: number,
  /**
   * 内存超限重启
   * @default 1G
   */
  max_memory_restart: string,
  /**
   * 重启延迟（毫秒）
   * @default 2000
   */
  restart_delay: number,
  /**
   * 合并日志
   * @default true
   */
  merge_logs: boolean,
  /**
   * 错误日志文件
   * @default ./@karinjs/logs/pm2_error.log
   */
  error_file: string,
  /**
   * 输出日志文件
   * @default ./@karinjs/logs/pm2_out.log
   */
  out_file: string,
}

export interface ConfigPm2 {
  /**
   * 日志行数
   * @default 1000
   */
  lines: number,
  /**
   * 应用配置
   */
  apps: ConfigPm2App[],
}

/**
 * 默认PM2配置
 */
export const configDefaultPm2: ConfigPm2 = {
  lines: 1000,
  apps: [
    {
      name: 'karin',
      script: 'index.js',
      autorestart: true,
      max_restarts: 60,
      max_memory_restart: '1G',
      restart_delay: 2000,
      merge_logs: true,
      error_file: './.karin/logs/pm2_error.log',
      out_file: './.karin/logs/pm2_out.log',
    },
  ],
}

/**
 * 兼容性处理
 * @param config PM2配置
 */
export const configPm2Compat = (config: Partial<ConfigPm2>): ConfigPm2 => {
  return config as ConfigPm2
}

/**
 * PM2配置 API
 */
export const pm2 = {
  /**
   * 默认PM2配置
   */
  default: configDefaultPm2,
  /**
   * 兼容性处理PM2配置
   */
  compat: configPm2Compat,
  /**
   * 清空缓存（空函数）
   */
  clearCache: () => { },
}
