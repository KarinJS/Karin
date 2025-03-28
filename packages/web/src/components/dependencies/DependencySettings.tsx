import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { Divider } from '@heroui/divider'
import { Dependency, getNpmLink } from '../../pages/dashboard/dependencies.utils'

interface DependencySettingsProps {
  isOpen: boolean
  onClose: () => void
  dependency: Dependency | null
  selectedVersion: string
  setSelectedVersion: (version: string) => void
  onSave: () => void
}

const DependencySettings = ({
  isOpen, onClose, dependency, selectedVersion, setSelectedVersion, onSave,
}: DependencySettingsProps) => {
  if (!dependency) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop='blur'
      radius='lg'
      classNames={{
        base: 'border border-default-100 mx-2',
        header: 'border-b border-default-100 p-4',
        body: 'p-4',
        footer: 'border-t border-default-100 p-4',
        closeButton: 'hover:bg-default-100',
      }}
      size='md'
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1 pb-3 md:pb-6'>
          <div className='flex items-center gap-2'>
            <div
              className='w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0'
              style={{
                backgroundColor: dependency.isKarinPlugin ? '#10b981' : '#9ca3af',
                boxShadow: dependency.isKarinPlugin ? '0 0 6px rgba(16, 185, 129, 0.3)' : 'none',
              }}
            />
            <div className='text-lg md:text-xl font-light tracking-tight'>{dependency.name}</div>
          </div>
          <Link
            href={getNpmLink(dependency.name)}
            isExternal
            showAnchorIcon
            className='text-xs md:text-sm text-default-500 ml-4 md:ml-5 pl-0.5'
          >
            在 npmjs.com 上查看
          </Link>
        </ModalHeader>

        <Divider className='opacity-50' />

        <ModalBody className='py-3 md:py-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
            <div>
              <div className='text-xs md:text-sm text-default-500 mb-2'>当前信息</div>
              <div className='space-y-2 md:space-y-3'>
                <div>
                  <div className='text-xs text-default-400'>当前版本</div>
                  <div className='font-mono text-xs md:text-sm'>{dependency.currentVersion}</div>
                </div>
                <div>
                  <div className='text-xs text-default-400'>package.json 中的值</div>
                  <div className='font-mono text-xs md:text-sm'>{dependency.packageJsonVersion}</div>
                </div>
                <div>
                  <div className='text-xs text-default-400'>类型</div>
                  <div className='text-xs md:text-sm'>{dependency.isKarinPlugin ? 'Karin 插件' : 'npm 包'}</div>
                </div>
              </div>
            </div>

            <div>
              <div className='text-xs md:text-sm text-default-500 mb-2 md:mb-3'>选择要安装的版本</div>
              <div className='grid grid-cols-2 gap-1.5 md:gap-2 max-h-32 md:max-h-40 overflow-y-auto pr-1 md:pr-2'>
                {dependency.availableVersions.map(version => (
                  <Button
                    key={version}
                    variant={selectedVersion === version ? 'solid' : 'flat'}
                    color={selectedVersion === version ? 'primary' : 'default'}
                    className='font-mono text-xs md:text-sm justify-start px-2 md:px-3 h-7 md:h-8 min-h-0'
                    size='sm'
                    radius='lg'
                    onPress={() => setSelectedVersion(version)}
                  >
                    {version}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {selectedVersion !== dependency.currentVersion && (
            <div className='mt-4 md:mt-6 p-2 md:p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-xs md:text-sm'>
              <div className='font-medium'>即将更新版本</div>
              <div className='text-default-600 mt-1 flex items-center gap-2'>
                <code className='font-mono text-xs'>{dependency.currentVersion}</code>
                <span>→</span>
                <code className='font-mono text-xs text-primary'>{selectedVersion}</code>
              </div>
            </div>
          )}
        </ModalBody>

        <Divider className='opacity-50' />

        <ModalFooter>
          <Button
            color='default'
            variant='light'
            onPress={onClose}
            radius='full'
            className='font-normal text-xs md:text-sm'
            size='sm'
          >
            取消
          </Button>
          <Button
            color='primary'
            onPress={onSave}
            isDisabled={selectedVersion === dependency.currentVersion}
            radius='full'
            className='font-normal text-xs md:text-sm'
            size='sm'
          >
            应用更改
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DependencySettings
