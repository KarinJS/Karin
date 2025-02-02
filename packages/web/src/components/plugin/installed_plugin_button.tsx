import { useState } from 'react'
import { Button } from "@heroui/button"
import { FaExclamationCircle } from "react-icons/fa"
import { PluginInfoModal } from './plugin_info_modal'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import type { KarinBase } from '@/types/plugins'
import { PluginAppsModal } from './plugin_apps_modal'
import { PluginConfig } from './config'

interface InstalledPluginButtonProps {
  plugin: KarinBase<'all'>[number]
}

export function InstalledPluginButton ({ plugin }: InstalledPluginButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAppsOpen, setIsAppsOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const { runAsync: handleUpdate } = useRequest(
    () => request.serverPost('/api/v1/plugin/update', { name: plugin.name }),
    { manual: true }
  )

  const { runAsync: handleUninstall } = useRequest(
    () => request.serverPost('/api/v1/plugin/uninstall', { name: plugin.name }),
    { manual: true }
  )

  return (
    <>
      <Button
        isIconOnly
        variant="light"
        color="warning"
        size="sm"
        onPress={() => setIsOpen(true)}
      >
        <FaExclamationCircle className="text-lg" />
      </Button>

      <PluginInfoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        plugin={plugin}
        onUpdate={async () => {
          await handleUpdate()
          setIsOpen(false)
        }}
        onUninstall={async () => {
          await handleUninstall()
          setIsOpen(false)
        }}
        onViewApps={plugin.type.toLowerCase() === 'app' ? () => {
          setIsAppsOpen(true)
        } : undefined}
        onViewConfig={() => setIsConfigOpen(true)}
      />

      <PluginAppsModal
        isOpen={isAppsOpen}
        onClose={() => setIsAppsOpen(false)}
        pluginName={plugin.name}
      />

      <PluginConfig
        open={isConfigOpen}
        name={plugin.name}
        type={plugin.type}
        onClose={() => setIsConfigOpen(false)}
        onViewConfig={() => setIsConfigOpen(true)}
      />
    </>
  )
}