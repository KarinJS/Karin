import { useState } from 'react'
import { PluginConfig } from './config'
import type { KarinBase } from '@/types/plugins'

interface PluginCardProps {
  plugin: KarinBase<'all'>[number]
}

export const PluginCard = ({ plugin }: PluginCardProps) => {
  const [configOpen, setConfigOpen] = useState(false)

  return (
    <div>
      {/* ... 其他代码 ... */}
      <button
        onClick={() => setConfigOpen(true)}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        配置
      </button>

      <PluginConfig
        open={configOpen}
        name={plugin.name}
        type={plugin.type}
        onClose={() => setConfigOpen(false)}
        onViewConfig={() => setConfigOpen(true)}
      />
    </div>
  )
} 