import fs from 'node:fs'

/**
 * - 解析json文件
 * @param file - 文件路径
 */
export function readJson (file: string): any {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}
