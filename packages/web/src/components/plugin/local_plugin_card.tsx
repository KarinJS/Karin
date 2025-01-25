import { LocalPluginInfo } from '@/types/plugins/plugin'
import { Card, CardBody } from '@heroui/card'

export interface LocalPluginCardProps {
  plugin: LocalPluginInfo
}

export default function LocalPluginCard ({ plugin }: LocalPluginCardProps) {
  /**
   * 从完整路径中提取文件名
   * @param path - 完整路径
   * @returns 文件名
   */
  const getFileName = (path: string) => {
    // 移除目录部分，只保留文件名
    const fileName = path.split('\\').pop()?.split('/').pop() || ''
    // 移除扩展名
    return fileName
  }

  /**
   * 处理应用列表，转换为文件名数组
   * @param paths - 完整路径数组
   * @returns 文件名数组
   */
  const formatApps = (paths: string[]) => {
    return paths.map(getFileName).filter(Boolean)
  }

  return (
    <Card className="w-[200px] relative" radius="sm" shadow="sm">
      <div className="absolute right-0 top-0 bg-primary-50 text-primary-500 px-2 py-1 rounded-bl-md text-xs shadow-small">
        {plugin?.type?.toUpperCase()}
      </div>
      <CardBody className="space-y-5">
        <div>
          <h3 className="text-lg font-bold">{plugin.name}</h3>
          <div className="flex flex-col gap-2 text-xs mt-2">
            <div className="text-default-500">
              <div className="font-medium mb-1">应用列表：</div>
              <div className="flex flex-wrap gap-1">
                {formatApps(plugin.apps).map((app, index) => (
                  <span
                    key={index}
                    className="bg-default-100 px-2 py-0.5 rounded-full"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-default-500">
              <div className="font-medium mb-1">全局应用：</div>
              <div className="flex flex-wrap gap-1">
                {formatApps(plugin.allApps).map((app, index) => (
                  <span
                    key={index}
                    className="bg-default-100 px-2 py-0.5 rounded-full"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
