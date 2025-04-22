import { FC, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { Checkbox } from '@heroui/checkbox'
import { TbArrowUp, TbArrowsUp } from 'react-icons/tb'

/**
 * 更新选项对话框属性接口
 */
export interface UpdateOptionsModalProps {
  /** 是否显示对话框 */
  isOpen: boolean
  /** 关闭对话框回调 */
  onClose: () => void
  /** 确认更新回调 */
  onConfirm: (options: {
    updateNpm: boolean
    updateGit: boolean
    forceUpdateGit: boolean
  }) => void
}

/**
 * 更新选项对话框组件
 */
const UpdateOptionsModal: FC<UpdateOptionsModalProps> = ({ isOpen, onClose, onConfirm }) => {
  // 更新选项状态
  const [updateNpm, setUpdateNpm] = useState(true)
  const [updateGit, setUpdateGit] = useState(true)
  const [forceUpdateGit, setForceUpdateGit] = useState(false)

  // 处理确认按钮点击
  const handleConfirm = () => {
    onConfirm({
      updateNpm,
      updateGit,
      forceUpdateGit,
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          <h3 className='text-lg font-medium'>选择更新选项</h3>
        </ModalHeader>
        <ModalBody>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Checkbox
                isSelected={updateNpm}
                onValueChange={setUpdateNpm}
                size='md'
                classNames={{
                  wrapper: 'rounded-md',
                }}
              />
              <div className='flex items-center gap-2'>
                <TbArrowUp className='text-blue-500' />
                <span>更新全部NPM插件</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Checkbox
                isSelected={updateGit}
                onValueChange={setUpdateGit}
                size='md'
                classNames={{
                  wrapper: 'rounded-md',
                }}
              />
              <div className='flex items-center gap-2'>
                <TbArrowUp className='text-amber-500' />
                <span>更新全部GIT插件</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Checkbox
                isSelected={forceUpdateGit}
                onValueChange={setForceUpdateGit}
                size='md'
                classNames={{
                  wrapper: 'rounded-md',
                }}
              />
              <div className='flex items-center gap-2'>
                <TbArrowsUp className='text-orange-500' />
                <span>强制更新全部GIT插件</span>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='danger' variant='light' onPress={onClose}>
            取消
          </Button>
          <Button color='primary' onPress={handleConfirm}>
            确认
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UpdateOptionsModal
