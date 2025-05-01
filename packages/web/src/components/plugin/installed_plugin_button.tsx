import { useState } from 'react'
import { Button } from '@heroui/button'
import { IoSettingsOutline } from 'react-icons/io5'
import { PluginInfoModal } from './plugin_info_modal'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { PluginAppsModal } from './plugin_apps_modal'
import { PluginConfig } from './config'

import type { PluginMarketResponse } from 'node-karin'

export function InstalledPluginButton ({ plugin }: { plugin: PluginMarketResponse }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAppsOpen, setIsAppsOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const { runAsync: handleUpdate } = useRequest(
    () => request.serverPost('/api/v1/plugin/update', { name: plugin.local.name }),
    { manual: true }
  )

  const { runAsync: handleUninstall } = useRequest(
    () => request.serverPost('/api/v1/plugin/uninstall', { name: plugin.local.name }),
    { manual: true }
  )

  return (
    <>
      <Button
        isIconOnly
        variant='light'
        color='primary'
        size='sm'
        onPress={() => setIsOpen(true)}
      >
        <IoSettingsOutline className='text-lg' />
      </Button>

      <PluginInfoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        plugin={plugin.local}
        onUpdate={async () => {
          await handleUpdate()
          setIsOpen(false)
        }}
        onUninstall={async () => {
          await handleUninstall()
          setIsOpen(false)
        }}
        onViewApps={plugin.type.toLowerCase() === 'app'
          ? () => {
            setIsAppsOpen(true)
          }
          : undefined}
        onViewConfig={() => setIsConfigOpen(true)}
      />

      <PluginAppsModal
        isOpen={isAppsOpen}
        onClose={() => setIsAppsOpen(false)}
        pluginName={plugin.local.name}
      />

      <PluginConfig
        open={isConfigOpen}
        name={plugin.local.name}
        type={plugin.local.type}
        onClose={() => setIsConfigOpen(false)}
        onViewConfig={() => setIsConfigOpen(true)}
      />
    </>
  )
}
