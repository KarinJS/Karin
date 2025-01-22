import type { OnlinePluginInfo } from '@/types/plugin'
import { Card, CardBody } from '@heroui/card'
import { Link } from '@heroui/link'
import { FaUser } from 'react-icons/fa6'
import { TbLicense } from 'react-icons/tb'

export interface PluginCardProps {
  plugin: OnlinePluginInfo
}

export default function PluginCard({ plugin }: PluginCardProps) {
  return (
    <Card className="w-[200px] relative" radius="sm" shadow="sm">
      <div className="absolute right-0 top-0 bg-primary-50 text-primary-500 px-2 py-1 rounded-bl-md text-xs shadow-small">
        {plugin.type.toUpperCase()}
      </div>
      <CardBody className="space-y-5">
        <div>
          <h3 className="text-lg font-bold">{plugin.name}</h3>
          <h4 className="text-xs text-default-400">{plugin.package_name}</h4>
          <p className="text-default-500 text-sm my-2">{plugin.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-default-500 flex items-center space-x-1">
              <FaUser />
              {plugin.author.map(item => (
                <Link key={item.email} href={item.home} isExternal className="text-xs">
                  {item.name}
                </Link>
              ))}
            </span>
            <span className="text-default-500 flex items-center space-x-1">
              <TbLicense className="text-medium" />
              <span>{plugin.license}</span>
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
