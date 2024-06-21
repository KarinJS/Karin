import chalk from 'chalk'

declare module 'log4js' {
  interface Logger {
    /**
     * 颜色模块
     */
    chalk: typeof chalk
    /**
     * 构建红色文本
     */
    red: (text: string) => string
    /**
     * 构建绿色文本
     */
    green: (text: string) => string
    /**
     * 构建黄色文本
     */
    yellow: (text: string) => string
    /**
     * 构建蓝色文本
     */
    blue: (text: string) => string
    /**
     * 构建品红色文本
     */
    magenta: (text: string) => string
    /**
     * 构建青色文本
     */
    cyan: (text: string) => string
    /**
     * 构建白色文本
     */
    white: (text: string) => string
    /**
     * 构建灰色文本
     */
    gray: (text: string) => string
    /**
     * 构建紫色文本
     */
    violet: (text: string) => string
    /**
     * 构建函数文本
     */
    fnc: (text: string) => string
    /**
     * 日志模块
     * @param level 等级
     * @param id 机器人ID
     * @param args 参数
     */
    bot: (level: 'trace' | 'debug' | 'mark' | 'info' | 'mark' | 'warn' | 'error' | 'fatal', id: string, ...args: string[]) => void
  }
}
