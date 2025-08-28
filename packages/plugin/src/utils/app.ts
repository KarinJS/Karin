/**
 * 插件元数据
 */
export interface PluginMetadata {
  /** 插件名称 */
  name: string
  /** 插件版本 */
  version: string
  /** 插件作者 */
  author: string
  /** 插件仓库 */
  repository: string
  /** 插件描述 */
  description: string
  /** 插件许可证 */
  license: string
  /** 插件原始链接 */
  raw: string
}

const METADATA_REGEX = /\/\*!([\s\S]*?)\*\//
const FIELD_REGEX = /@([a-zA-Z]+)\s+(.+)/g

/**
 * 解析插件元数据
 * @param content 插件文件内容
 * @returns 插件元数据
 * @returns 如果解析失败，返回 null
 * @example
 * ```ts
 * const content = fs.readFileSync('./ver.js', 'utf-8')
 * const meta = parsePluginMetadata(content)
 * console.log(meta)
 * // 输出:
 * // {
 * //   name: 'karin-plugin-my',
 * //   version: '0.0.1',
 * //   author: 'shijin',
 * //   repository: 'https://github.com/karinjs/my-plugin',
 * //   description: 'A sample plugin',
 * //   license: 'MIT',
 * //   raw: '...'
 * // }
 * ```
 */
export const parsePluginMetadata = (content: string): PluginMetadata | null => {
  const match = METADATA_REGEX.exec(content)
  if (!match) return null

  const block = match[1]
  const fields = Array.from(block.matchAll(FIELD_REGEX))

  const metadata = Object.fromEntries(
    fields
      .map(([, key, value]) => [key, value.trim()])
      .filter(([key]) =>
        ['name', 'version', 'author', 'repository', 'description', 'license', 'raw'].includes(key)
      )
  ) as Partial<PluginMetadata>

  if (Object.keys(metadata).length < 7) return null
  return metadata as PluginMetadata
}
