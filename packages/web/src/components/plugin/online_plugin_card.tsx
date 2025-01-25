import { Link } from '@heroui/link'
import { FaUser } from 'react-icons/fa6'
import { TbLicense, TbDownload } from 'react-icons/tb'
import { FaGithub, FaGitter, FaNpm } from 'react-icons/fa6'
import { Button } from '@heroui/button'
import { Tooltip } from '@heroui/tooltip'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal'
import type { OnlinePluginInfo } from '@/types/plugins'

export const PluginListItem = (plugin: OnlinePluginInfo<'all'>[number]) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const getRepoIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'github':
        return <FaGithub className="text-lg" />
      case 'gitee':
        return <FaGitter className="text-lg text-red-500" />
      case 'npm':
        return <FaNpm className="text-lg text-[#CB3837]" />
      default:
        return null
    }
  }

  const handleInstall = () => {
    // TODO: 处理安装逻辑
    onClose()
  }

  return (
    <>
      <tr className="hover:bg-default-50">
        {/* 名称 */}
        <td className="py-2.5 px-4">
          <div className="text-xs text-default-500 font-mono bg-default-100 px-2 py-1 rounded w-fit">
            {plugin.name}
          </div>
        </td>

        {/* 类型 */}
        <td className="py-2.5 px-4">
          <div className="flex justify-center">
            <span className="px-2 py-0.5 text-xs bg-primary-50 text-primary-500 rounded-full">
              {plugin.type.toUpperCase()}
            </span>
          </div>
        </td>

        {/* 作者 */}
        <td className="py-2.5 px-4">
          <div className="flex items-center gap-1.5">
            <FaUser className="text-default-400 shrink-0 text-sm" />
            <span className="text-sm truncate">
              {plugin.author.map((item, index) => (
                <span key={item.home}>
                  <Link href={item.home} isExternal className="hover:text-primary">
                    {item.name}
                  </Link>
                  {index < plugin.author.length - 1 && ' & '}
                </span>
              ))}
            </span>
          </div>
        </td>

        {/* 描述 */}
        <td className="py-2.5 px-4">
          <p className="text-sm text-default-600 line-clamp-1">
            {plugin.description}
          </p>
        </td>

        {/* 仓库源 */}
        <td className="py-2.5 px-4">
          <div className="flex items-center justify-center gap-2">
            {plugin.repo.map(repo => (
              <Tooltip key={repo.url} content={repo.type}>
                <Link href={repo.url} isExternal className="hover:opacity-70">
                  {getRepoIcon(repo.type)}
                </Link>
              </Tooltip>
            ))}
          </div>
        </td>

        {/* 许可证 */}
        <td className="py-2.5 px-4">
          <div className="flex items-center justify-center gap-1 text-sm text-default-500">
            <TbLicense className="text-default-400" />
            <span>{plugin.license.name}</span>
          </div>
        </td>

        {/* 版本 */}
        <td className="py-2.5 px-4">
          <div className="flex items-center justify-center gap-1 text-sm text-default-500">
            <span>{plugin.version || '-'}</span>
          </div>
        </td>

        {/* 安装按钮 */}
        <td className="py-2.5 px-4">
          <div className="flex justify-center">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={onOpen}
            >
              <TbDownload className="text-lg" />
            </Button>
          </div>
        </td>
      </tr>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg">安装插件</h3>
            <p className="text-sm text-default-500 font-normal">
              确认安装 {plugin.name} 插件吗？
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-sm text-default-600 shrink-0">插件描述：</span>
                <p className="text-sm text-default-500">{plugin.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-default-600">版本号：</span>
                <span className="text-sm text-default-500">{plugin.version}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-default-600">许可证：</span>
                <span className="text-sm text-default-500">{plugin.license.name}</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              取消
            </Button>
            <Button color="primary" onPress={handleInstall}>
              确认安装
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
