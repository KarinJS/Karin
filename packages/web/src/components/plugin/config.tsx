import { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { toast } from 'react-hot-toast'
import { Spinner } from '@heroui/spinner'
import { IoSettingsOutline } from 'react-icons/io5'
import { RiPlugLine } from 'react-icons/ri'
import { request } from '@/lib/request'
import { DynamicComponentRenderer } from './dynamicComponents'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'

import type { ComponentConfig } from './dynamicComponents'

interface PluginConfigProps {
  /** 是否显示 */
  open: boolean
  /** 插件名称 */
  name: string
  /** 插件类型 */
  type: 'git' | 'npm' | 'app'
  /** 关闭回调 */
  onClose: () => void
  /** 查看配置回调 */
  onViewConfig: () => void
}

export const PluginConfig = ({
  open,
  name,
  type,
  onClose,
  onViewConfig
}: PluginConfigProps) => {
  const [loading, setLoading] = useState(false)
  const [configs, setConfigs] = useState<ComponentConfig[]>([])
  const [configValues, setConfigValues] = useState<Record<string, any>>({})
  const [currentValues, setCurrentValues] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      handleGetConfig()
    }
  }, [open, name, type])

  // 使用useEffect处理配置值的变更
  useEffect(() => {
    setConfigValues(currentValues)
  }, [currentValues])

  /** 获取配置 */
  const handleGetConfig = async () => {
    try {
      setLoading(true)
      const result = await request.serverPost<ComponentConfig[], { name: string, type: 'git' | 'npm' | 'app' }>('/api/v1/plugin/config/get', {
        name,
        type
      })
      if (!result) {
        toast.error('获取配置失败')
        onClose()
        return
      }
      setConfigs(result)
    } catch (error) {
      toast.error((error as Error).message)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  /** 保存配置 */
  const handleSave = () => {
    request.serverPost<void, { name: string, type: 'git' | 'npm' | 'app', config: Record<string, any> }>('/api/v1/plugin/config/save', {
      name,
      type,
      config: configValues
    }).then(() => {
      toast.success('保存成功')
    }).catch((error) => {
      toast.error((error as Error).message)
    })
  }

  /** 配置值变更 */
  const handleConfigChange = (values: Record<string, any>) => {
    setCurrentValues(values)
  }

  return (
    <Modal
      isOpen={open}
      onOpenChange={onClose}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-100 dark:border-gray-800",
        footer: "border-t border-gray-100 dark:border-gray-800"
      }}
    >
      <ModalContent className="max-h-[85vh]">
        <ModalHeader className="shrink-0">
          <div className="flex items-center py-1 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50/80 dark:bg-blue-900/20 transition-colors">
                <IoSettingsOutline className="text-base text-blue-600/90 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-[15px] font-medium text-gray-900 dark:text-gray-100 leading-[18px]">
                  {name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-[14px]">
                  插件配置与管理
                </p>
              </div>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="flex-1 overflow-auto">
          <div className="h-[480px] py-5">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Spinner size="md" color="primary" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">正在加载配置...</p>
                </div>
              </div>
            ) : configs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                  <RiPlugLine className="text-2xl text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="mt-4 text-gray-900 dark:text-gray-100 font-medium">暂无配置项</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">该插件当前没有需要配置的选项</p>
              </div>
            ) : (
              <div className="h-full space-y-4 overflow-y-auto custom-scrollbar">
                <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
                  <DynamicComponentRenderer
                    configs={configs}
                    onChange={handleConfigChange}
                  />
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="shrink-0 py-3">
          <div className="flex justify-end gap-2">
            <Button
              color="default"
              variant="bordered"
              size="md"
              onPress={onClose}
              className="px-5 h-10 min-w-[88px] font-medium border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              取消
            </Button>
            <Button
              color="primary"
              variant="flat"
              size="md"
              onPress={handleSave}
              isDisabled={configs.length === 0}
              className="px-5 h-10 min-w-[88px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400"
            >
              保存
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
