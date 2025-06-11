import { toast } from 'react-hot-toast'
import { Button } from '@heroui/button'
import { VscJson, VscCopy, VscOutput, VscSymbolString } from 'react-icons/vsc'
import { AiOutlineClose } from 'react-icons/ai'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import type { FC } from 'react'

/**
 * 按钮通用样式
 */
export const BUTTON_COMMON_STYLES = 'px-5 h-10 min-w-[88px] '

/**
 * 打印配置缓存
 */
let print: Record<string, any> | null = null

interface ConfigDetailModalProps {
  showJsonModal: boolean
  setShowJsonModal: (show: boolean) => void
  handleFormResult: () => Record<string, any> | null
  className?: string
}

/**
 * 打印配置详情组件
 */
export const ConfigDetailModal: FC<ConfigDetailModalProps> = ({
  showJsonModal,
  setShowJsonModal,
  handleFormResult,
  className,
}) => {
  const handleCopyConfig = () => {
    const config = JSON.stringify(print, null, 2)
    navigator.clipboard.writeText(config)
    toast.success('配置已复制到剪贴板')
  }

  const handleSomeEvent = () => {
    print = handleFormResult()
    if (print) {
      setShowJsonModal(true)
    }
  }

  return (
    <>
      <Button
        color='default'
        variant='flat'
        size='md'
        onPress={() => {
          const form = document.getElementById('dashboard-form')
          if (form instanceof HTMLFormElement) {
            if (form.checkValidity()) {
              handleSomeEvent()
            } else {
              form.reportValidity() // 显示验证信息
            }
          } else {
            console.error('表单元素不存在')
          }
        }}
        className={`${BUTTON_COMMON_STYLES} ${className || ''}`}
        startContent={<VscJson className='text-lg' />}
      >
        配置详情
      </Button>

      <Modal
        isOpen={showJsonModal}
        onOpenChange={() => setShowJsonModal(false)}
        size='2xl'
        scrollBehavior='inside'
        hideCloseButton={false}
        isDismissable
        isKeyboardDismissDisabled={false}
        portalContainer={document.body}
      >
        <ModalContent className='sm:max-w-2xl max-w-full sm:mx-6 mx-0 sm:my-6 my-0 sm:rounded-lg rounded-t-lg rounded-b-none sm:h-auto h-full max-h-full'>
          <ModalHeader className='shrink-0'>
            <div className='flex items-center py-1 px-1'>
              <div className='flex items-center gap-2.5'>
                <div className='w-7 h-7 flex items-center justify-center rounded-lg bg-primary-100/50 transition-colors'>
                  <VscJson className='text-base text-primary' />
                </div>
                <div>
                  <h2 className='text-[15px]  text-default-900 leading-[18px]'>
                    配置详情
                  </h2>
                  <p className='text-xs font-light text-default-500 dark:text-default-400 mt-0.5 leading-[14px]'>
                    当前配置信息
                  </p>
                </div>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className='flex-1 overflow-auto'>
            <pre className='bg-default-100 p-4 rounded-lg overflow-auto text-sm font-mono'>
              {JSON.stringify(print, null, 2)}
            </pre>
          </ModalBody>
          <ModalFooter className='shrink-0'>
            {/* 桌面端布局 */}
            <div className='hidden sm:flex justify-end gap-2 w-full'>
              <Button
                color='primary'
                variant='flat'
                size='md'
                radius='lg'
                onPress={() => {
                  console.log('配置详情:', print)
                  toast.success('打印成功 请查看控制台')
                }}
                className={`${BUTTON_COMMON_STYLES} glass-effect`}
                startContent={<VscOutput className='text-lg' />}
              >
                正常打印
              </Button>
              <Button
                color='primary'
                variant='flat'
                size='md'
                radius='lg'
                onPress={() => {
                  console.log('配置详情:', JSON.stringify(print, null, 2))
                  toast.success('打印成功 请查看控制台')
                }}
                className={`${BUTTON_COMMON_STYLES} glass-effect`}
                startContent={<VscSymbolString className='text-lg' />}
              >
                纯文本打印
              </Button>
              <Button
                color='primary'
                variant='flat'
                size='md'
                radius='lg'
                onPress={handleCopyConfig}
                className={`${BUTTON_COMMON_STYLES} glass-effect`}
                startContent={<VscCopy className='text-lg' />}
              >
                复制
              </Button>
              <Button
                color='danger'
                variant='flat'
                size='md'
                radius='lg'
                onPress={() => setShowJsonModal(false)}
                className={`${BUTTON_COMMON_STYLES} glass-effect`}
                startContent={<AiOutlineClose className='text-base' />}
              >
                关闭
              </Button>
            </div>

            {/* 移动端布局 */}
            <div className='flex sm:hidden flex-col gap-2 w-full'>
              {/* 第一行：主要操作按钮 */}
              <div className='flex gap-2'>
                <Button
                  color='primary'
                  variant='flat'
                  size='sm'
                  radius='lg'
                  onPress={handleCopyConfig}
                  className='flex-1 h-9 text-sm glass-effect'
                  startContent={<VscCopy className='text-base' />}
                >
                  复制
                </Button>
                <Button
                  color='primary'
                  variant='flat'
                  size='sm'
                  radius='lg'
                  onPress={() => {
                    console.log('配置详情:', JSON.stringify(print, null, 2))
                    toast.success('打印成功 请查看控制台')
                  }}
                  className='flex-1 h-9 glass-effect'
                  startContent={<VscSymbolString className='text-base' />}
                >
                  纯文本打印
                </Button>
              </div>

              {/* 第二行：打印操作按钮 */}
              <div className='flex gap-2'>
                <Button
                  color='primary'
                  variant='flat'
                  size='sm'
                  radius='lg'
                  onPress={() => {
                    console.log('配置详情:', print)
                    toast.success('打印成功 请查看控制台')
                  }}
                  className='flex-1 h-9 glass-effect'
                  startContent={<VscOutput className='text-base' />}
                >
                  正常打印
                </Button>
                <Button
                  color='danger'
                  variant='flat'
                  radius='lg'
                  size='sm'
                  onPress={() => setShowJsonModal(false)}
                  className='flex-1 h-9 text-sm glass-effect'
                  startContent={<AiOutlineClose className='text-base' />}
                >
                  关闭
                </Button>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
