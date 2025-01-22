import { LocalPluginInfo } from '@/types/plugin'
import { Card, CardBody } from '@heroui/card'

export interface LocalPluginCardProps {
  plugin: LocalPluginInfo
}

export default function LocalPluginCard({ plugin }: LocalPluginCardProps) {
  return (
    <Card className="w-[200px] relative" radius="sm" shadow="sm">
      <div className="absolute right-0 top-0 bg-primary-50 text-primary-500 px-2 py-1 rounded-bl-md text-xs shadow-small">
        {plugin.type.toUpperCase()}
      </div>
      <CardBody className="space-y-5">
        <div>
          <h3 className="text-lg font-bold">{plugin.name}</h3>
          <h4 className="text-xs text-default-400">{plugin.dir}</h4>
          <div className="flex items-center justify-between text-xs">
            <span className="text-default-500 flex items-center space-x-1">
              <span>{plugin.apps.join(', ')}</span>
            </span>
            <span className="text-default-500 flex items-center space-x-1">
              <span>{plugin.allApps.join(', ')}</span>
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
