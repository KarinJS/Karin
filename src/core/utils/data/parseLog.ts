/**
 * 提取指定版本号的更新日志
 * @param version 版本号
 * @param data `CHANGELOG.md`文件内容
 * @returns 更新日志
 */
export const log = (version: string, data: string): string | null => {
  const regex = new RegExp(`## \\[${version}\\](.|\\n)*?(?=## \\[|$)`, 'g')
  const match = data.match(regex)
  return match ? match[0] : null
}

/**
 * 提取指定范围版本号的更新日志
 * @param version 起始版本号
 * @param data `CHANGELOG.md`文件内容
 * @param length 提取长度
 * @param reverse 是否反向提取 默认为`false`向后提取
 */
export const logs = (version: string, data: string, length = 1, reverse = false): string => {
  if (typeof length !== 'number') {
    throw new TypeError('提取长度必须为数字')
  }

  const list = parseChangelog(data)
  const keys = Object.keys(list)
  const index = keys.indexOf(version)
  const start = reverse ? index - length : index
  const end = reverse ? index : index + length

  const versions = keys.slice(start, end).map((key) => list[key] ? list[key] : '')
  return versions.join('')
}

/**
 * 对更新日志进行解析并形成对象
 * @param data 更新日志内容
 * @returns 以版本号为键的更新日志对象
 */
export const parseChangelog = (data: string) => {
  const regex = /## \[(.*?)\]([\s\S]*?)(?=## \[|$)/g
  const changelog: Record<string, string> = {}

  for (const match of data.matchAll(regex)) {
    const version = match[1]
    const content = match[0]
    changelog[version] = content
  }

  return changelog
}
