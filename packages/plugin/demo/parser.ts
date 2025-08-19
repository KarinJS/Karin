// Example usage
import fs from 'node:fs'

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

export function parsePluginMetadata (content: string): PluginMetadata | null {
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
const content = fs.readFileSync('./ver.js', 'utf-8')
const meta = parsePluginMetadata(content)
console.log(meta)
