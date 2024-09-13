import fs from 'fs'
import { dirName } from 'karin/types'

/**
 * 获取git插件列表
 * @param isPack - 是否屏蔽不带package.json的插件，默认为false
 */
export function getGitPlugins (isPack = false): Array<dirName> {
  const dir = './plugins'
  let list = fs.readdirSync(dir, { withFileTypes: true })
  /** 忽略非文件夹、非 karin-plugin-开头的文件夹 */
  list = list.filter(v => v.isDirectory() && v.name.startsWith('karin-plugin-'))
  if (isPack) list = list.filter(v => fs.existsSync(`${dir}/${v.name}/package.json`))
  const arr: dirName[] = []
  list.map(v => arr.push(v.name as dirName))
  return arr
}
