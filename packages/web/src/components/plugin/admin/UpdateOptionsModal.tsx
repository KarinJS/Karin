import { FC, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { TbPackage, TbBrandGit, TbRefreshAlert } from 'react-icons/tb'
import { Divider } from '@heroui/divider'
import UpdateOptionCard from '@/components/card/UpdateOptionCard'
import type { PluginAdminParams } from 'node-karin'

/**
 * 更新选项对话框属性接口
 */
export interface UpdateOptionsModalProps {
  /** 是否显示对话框 */
  isOpen: boolean
  /** 关闭对话框回调 */
  onClose: () => void
  /** 确认更新回调 */
  onConfirm: (params: PluginAdminParams) => void
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
    const params: PluginAdminParams = {
      type: 'update',
      isAll: {
        force: forceUpdateGit,
        git: updateGit,
        npm: updateNpm,
      },
      name: '更新插件',
      target: [],
    }
    onConfirm(params)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop='blur'>
      <ModalContent className='border border-divider/20 shadow-lg'>
        <ModalHeader>
          <h3 className='text-xl font-medium'>选择更新选项</h3>
        </ModalHeader>
        <Divider className='opacity-50' />
        <ModalBody className='py-6'>
          <div className='space-y-5'>
            <UpdateOptionCard
              isSelected={updateNpm}
              onValueChange={setUpdateNpm}
              icon={TbPackage}
              title='更新全部 NPM 插件'
              description='从 npm 获取最新版本的插件包并更新'
              theme='primary'
            />

            <UpdateOptionCard
              isSelected={updateGit}
              onValueChange={setUpdateGit}
              icon={TbBrandGit}
              title='更新全部 GIT 插件'
              description='从 git 仓库拉取最新代码并更新所有插件'
              theme='warning'
            />

            <UpdateOptionCard
              isSelected={forceUpdateGit}
              onValueChange={setForceUpdateGit}
              icon={TbRefreshAlert}
              title={
                <div className='flex items-center gap-2'>
                  <span>强制更新 GIT 插件</span>
                  <div className='inline-flex items-center rounded-sm bg-danger/20 px-1 text-xs text-danger'>
                    谨慎使用
                  </div>
                </div>
              }
              description='强制当前分支重置到最新提交'
              theme='danger'
            />
          </div>
        </ModalBody>
        <Divider className='opacity-50' />
        <ModalFooter className='flex justify-end gap-2'>
          <Button color='default' variant='light' onPress={onClose} className='hover:bg-default-100'>
            取消
          </Button>
          <Button color='primary' variant='flat' onPress={handleConfirm} className='shadow-sm'>
            确认更新
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UpdateOptionsModal
