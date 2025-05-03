import { dir } from '@/dir'
import {
  watch,
  logger,
  filesByExt,
  copyConfigSync,
  requireFileSync,
} from 'node-karin'

export interface Config {
  /** 一言API */
  yiyanApi: string
}

/**
 * @description 初始化配置文件
 */
copyConfigSync(dir.defConfigDir, dir.ConfigDir, ['.json'])

/**
 * @description 配置文件
 */
export const config = () => {
  const cfg = requireFileSync(`${dir.ConfigDir}/config.json`)
  const def = requireFileSync(`${dir.defConfigDir}/config.json`)
  return { ...def, ...cfg }
}

/**
 * @description 监听配置文件
 */
setTimeout(() => {
  const list = filesByExt(dir.ConfigDir, '.json', 'abs')
  list.forEach(file => watch(file, (old, now) => {
    logger.info([
      'QAQ: 检测到配置文件更新',
      `这是旧数据: ${old}`,
      `这是新数据: ${now}`,
    ].join('\n'))
  }))
}, 2000)
