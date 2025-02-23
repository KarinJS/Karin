import { toast } from 'react-hot-toast'
import { Button } from '@heroui/button'
import { VscJson, VscCopy, VscOutput, VscSymbolString } from 'react-icons/vsc'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import type { FC } from 'react'

/**
 * 按钮通用样式
 */
export const BUTTON_COMMON_STYLES = 'px-5 h-10 min-w-[88px] font-medium'

/**
 * 打印配置缓存
 */
let print: Record<string, any> | null = null

interface ConfigDetailModalProps {
  showJsonModal: boolean
  setShowJsonModal: (show: boolean) => void
  handleFormResult: (formValues: Record<string, FormDataEntryValue>) => Record<string, any> | null
}

/**
 * 打印配置详情组件
 */
export const ConfigDetailModal: FC<ConfigDetailModalProps> = ({
  showJsonModal,
  setShowJsonModal,
  handleFormResult
}) => {
  const handleCopyConfig = () => {
    const config = JSON.stringify(print, null, 2)
    navigator.clipboard.writeText(config)
    toast.success('配置已复制到剪贴板')
  }

  const handleSomeEvent = () => {
    setShowJsonModal(true)
  }

  return (
    <>
      <Button
        color='default'
        variant='bordered'
        size='md'
        onPress={() => {
          const form = document.getElementById('dashboard-form')
          if (form instanceof HTMLFormElement) {
            if (form.checkValidity()) {
              handleSomeEvent()
            }
          } else {
            console.error('表单元素不存在')
          }
        }}
        className={`${BUTTON_COMMON_STYLES} border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800`}
        startContent={<VscJson className='text-lg' />}
      >
        配置详情
      </Button>

      <Modal
        isOpen={showJsonModal}
        onOpenChange={() => setShowJsonModal(false)}
        size='2xl'
        scrollBehavior='inside'
        classNames={{
          base: 'bg-white dark:bg-gray-900',
          header: 'border-b border-gray-100 dark:border-gray-800',
          footer: 'border-t border-gray-100 dark:border-gray-800'
        }}
      >
        <ModalContent>
          <ModalHeader className='shrink-0'>
            <div className='flex items-center py-1 px-1'>
              <div className='flex items-center gap-2.5'>
                <div className='w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50/80 dark:bg-blue-900/20 transition-colors'>
                  <VscJson className='text-base text-blue-600/90 dark:text-blue-400' />
                </div>
                <div>
                  <h2 className='text-[15px] font-medium text-gray-900 dark:text-gray-100 leading-[18px]'>
                    配置详情
                  </h2>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-[14px]'>
                    当前配置信息
                  </p>
                </div>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <pre className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm font-mono'>
              {(() => {
                const formElement = document.getElementById('dashboard-form')
                if (formElement instanceof HTMLFormElement) {
                  const formData = new FormData(formElement)
                  const formEntries = Object.fromEntries(formData)
                  print = handleFormResult(formEntries)
                  return JSON.stringify(print, null, 2)
                }
                return JSON.stringify(print, null, 2)
              })()}
            </pre>
          </ModalBody>
          <ModalFooter>
            <div className='flex justify-end gap-2'>
              <Button
                color='default'
                variant='bordered'
                size='md'
                onPress={() => {
                  console.log('配置详情:', print)
                  toast.success('打印成功 请查看控制台')
                }}
                className={`${BUTTON_COMMON_STYLES} border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800`}
                startContent={<VscOutput className='text-lg' />}
              >
                正常打印
              </Button>
              <Button
                color='default'
                variant='bordered'
                size='md'
                onPress={() => {
                  console.log('配置详情:', JSON.stringify(print, null, 2))
                  toast.success('打印成功 请查看控制台')
                }}
                className={`${BUTTON_COMMON_STYLES} border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800`}
                startContent={<VscSymbolString className='text-lg' />}
              >
                纯文本打印
              </Button>
              <Button
                color='default'
                variant='bordered'
                size='md'
                onPress={handleCopyConfig}
                className={`${BUTTON_COMMON_STYLES} border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800`}
                startContent={<VscCopy className='text-lg' />}
              >
                复制
              </Button>
              <Button
                color='primary'
                variant='flat'
                size='md'
                onPress={() => setShowJsonModal(false)}
                className={`${BUTTON_COMMON_STYLES} bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400`}
              >
                关闭
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
