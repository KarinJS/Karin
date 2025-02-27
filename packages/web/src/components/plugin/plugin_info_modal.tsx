/* eslint-disable @stylistic/indent */
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { TbApps } from 'react-icons/tb'
import { FaGear, FaGithub, FaGitter, FaNpm } from 'react-icons/fa6'
import { Link } from '@heroui/link'
import { NavLink } from 'react-router-dom'
import type { pluginLists } from '@/types/plugins'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { InstallLogModal } from '@/components/plugin/install_log_modal'

interface PluginInfoModalProps {
  isOpen: boolean
  onClose: () => void
  plugin: pluginLists
  onUpdate: () => void
  onUninstall: () => void
  onViewApps?: () => void
  onViewConfig: () => void
}

const getRepoIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'github':
      return <FaGithub className='text-lg' />
    case 'gitee':
      return <FaGitter className='text-lg text-red-500' />
    case 'npm':
      return <FaNpm className='text-lg text-[#CB3837]' />
    default:
      return null
  }
}

// 添加默认描述生成函数
const getDefaultDescription = (name: string) => {
  const descriptions = [
    '为您的工作流程带来更多可能性',
    '提升您的开发效率的得力助手',
    '简单易用，功能强大的插件',
    '让开发更轻松，体验更流畅',
    '为您的项目锦上添花'
  ]
  const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return descriptions[seed % descriptions.length]
}

// 添加默认作者信息生成函数
const getDefaultAuthorInfo = (name: string) => {
  return {
    name: name.split('-')[0] || '未知作者',
    email: '-',
    url: '-'
  }
}

export function PluginInfoModal ({
  isOpen,
  onClose,
  plugin,
  onUpdate,
  onUninstall,
  onViewApps,
}: PluginInfoModalProps) {
  const showViewApps = plugin.type.toLowerCase() === 'app' && onViewApps
  const [taskId, setTaskId] = useState<string>('')
  const [isUninstalling, setIsUninstalling] = useState(false)
  const [showUninstallConfirm, setShowUninstallConfirm] = useState(false)

  const { loading: uninstallLoading, run: handleUninstall } = useRequest<{ taskId: string }, any>(
    async () => {
      if (plugin.type.toLowerCase() === 'app') {
        throw new Error('不支持卸载 App 类型的插件')
      }
      const { taskId } = await request.serverPost<{ taskId: string }, { name: string; type: string }>('/api/v1/plugin/uninstall', {
        name: plugin.name,
        type: plugin.type
      })
      setTaskId(taskId)
      setIsUninstalling(true)
      return { taskId }
    },
    {
      manual: true,
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  return (
    <>
      <Modal
        isOpen={isOpen && !isUninstalling}
        onOpenChange={onClose}
        title='插件配置'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            <h3 className='text-lg font-semibold'>{plugin.name}</h3>
            <p className='text-sm text-default-600'>
              {plugin.description === '-' ? getDefaultDescription(plugin.name) : plugin.description}
            </p>
          </ModalHeader>
          <ModalBody>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-default-600'>当前版本</span>
                <Chip size='sm' variant='flat' color='primary'>
                  {plugin.version === '-' ? '0.0.1' : plugin.version}
                </Chip>
              </div>
              {plugin.latestVersion && plugin.latestVersion !== plugin.version && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-default-600'>最新版本</span>
                  <Chip size='sm' variant='flat' color='success'>
                    {plugin.latestVersion}
                  </Chip>
                </div>
              )}
              <div className='flex items-center justify-between'>
                <span className='text-sm text-default-600'>作者</span>
                <div className='flex items-center gap-2'>
                  {plugin.author && plugin.author.length > 0
                    ? (
                      plugin.author.map((author, index) => (
                        author.home && author.home !== '-'
                          ? (
                            <Link
                              key={author.name + index}
                              href={author.home}
                              isExternal
                              className='text-xs text-primary-500 hover:text-primary-600'
                            >
                              {author.name}
                            </Link>
                          )
                          : (
                            <span key={author.name + index} className='text-xs text-default-600'>
                              {author.name}
                            </span>
                          )
                      ))
                    )
                    : (
                      <span className='text-xs text-default-400'>
                        {getDefaultAuthorInfo(plugin.name).name}
                      </span>
                    )}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-default-600'>仓库源</span>
                <div className='flex items-center gap-2'>
                  {Array.isArray(plugin.repo) && plugin.repo.length > 0
                    ? (
                      plugin.repo.map((repo, index) => (
                        <Link
                          key={repo.url + index}
                          className='text-default-600 hover:text-default-900 transition-colors inline-flex'
                          href={repo.url}
                          isExternal
                        >
                          {getRepoIcon(repo.type)}
                        </Link>
                      ))
                    )
                    : (
                      <span className='text-sm text-default-400'>暂无仓库信息</span>
                    )}
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-default-600'>开源许可</span>
                {plugin.license.url
                  ? (
                    <Link
                      className='text-xs text-primary-500 hover:text-primary-600 inline-flex items-center'
                      href={plugin.license.url}
                      isExternal
                      showAnchorIcon
                    >
                      {plugin.license.name}
                    </Link>
                  )
                  : (
                    <span className='text-sm text-default-400'>
                      {plugin.license.name || 'MIT'}
                    </span>
                  )}
              </div>
              {plugin.home && plugin.home !== '-' && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-default-600'>插件主页</span>
                  <Link
                    className='text-xs text-primary-500 hover:text-primary-600 inline-flex items-center'
                    href={plugin.home}
                    isExternal
                    showAnchorIcon
                  >
                    访问主页
                  </Link>
                </div>
              )}
              <div className='flex items-center justify-between'>
                <span className='text-sm text-default-600'>插件类型</span>
                <Chip
                  size='sm'
                  variant='flat'
                  color={plugin.type.toLowerCase() === 'app' ? 'secondary' : 'default'}
                >
                  {plugin.type.toLowerCase() === '-' ? 'NPM' : plugin.type.toUpperCase()}
                </Chip>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-default-600'>安装时间</span>
                <span className='text-sm text-default-400'>
                  {new Date(plugin.time).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className='flex gap-2'>
              <Button
                color='primary'
                variant='light'
                onPress={onUpdate}
                isDisabled={!plugin.latestVersion || plugin.latestVersion === plugin.version}
              >
                更新
              </Button>
              <Button
                color='danger'
                variant='light'
                onPress={() => setShowUninstallConfirm(true)}
                isDisabled={plugin.type.toLowerCase() === 'app'}
              >
                卸载
              </Button>
              {showViewApps && (
                <Button
                  color='secondary'
                  variant='light'
                  onPress={onViewApps}
                  startContent={<TbApps />}
                >
                  查看应用
                </Button>
              )}
              {plugin.type.toLowerCase() !== 'app' && (
                <NavLink
                  to={`../plugins/${plugin.name}?type=${plugin.type.toLowerCase()}`}
                  className='inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-lg bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                >
                  <FaGear />
                  配置
                </NavLink>
              )}
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={showUninstallConfirm}
        onOpenChange={() => setShowUninstallConfirm(false)}
        size='sm'
      >
        <ModalContent>
          <ModalHeader>
            <h3 className='text-lg font-semibold'>确认卸载</h3>
          </ModalHeader>
          <ModalBody>
            <p className='text-sm text-default-600'>
              您确定要卸载插件 "{plugin.name}" 吗？
              <br />
              此操作不可逆，请谨慎操作。
            </p>
          </ModalBody>
          <ModalFooter>
            <div className='flex gap-2'>
              <Button
                color='default'
                variant='light'
                onPress={() => setShowUninstallConfirm(false)}
              >
                取消
              </Button>
              <Button
                color='danger'
                onPress={() => {
                  setShowUninstallConfirm(false)
                  handleUninstall()
                }}
                isLoading={uninstallLoading}
              >
                确认卸载
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <InstallLogModal
        isOpen={isUninstalling}
        onClose={() => {
          setIsUninstalling(false)
          onUninstall()
        }}
        taskId={taskId}
        plugin={plugin}
        task={{
          id: taskId,
          name: plugin.name,
          type: 'uninstall',
          status: 'running',
          minimized: false,
          logs: []
        }}
      />
    </>
  )
}
