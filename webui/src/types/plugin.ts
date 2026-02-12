export type PluginType = 'npm' | 'custom'

export interface PluginAuthor {
  name: string
  url?: string
  avatar?: string
}

export interface Plugin {
  id: string
  name: string
  description: string
  type: PluginType
  version: string
  authors: PluginAuthor[]
  license?: string
  homepage?: string
  repo?: string
  tags?: string[]
  icon?: string
  updateTime?: string
  installed: boolean
}
