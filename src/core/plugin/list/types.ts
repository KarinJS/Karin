/** 插件类型 */
export type AppsType = 'git' | 'npm' | 'app'

/** 插件信息 */
export interface Info {
  /** 插件类型 */
  type: AppsType
  /** 插件名称 */
  name: string
  /** app列表<app绝对路径> */
  apps: string[]
  /** 插件根目录 */
  dir: string
}
