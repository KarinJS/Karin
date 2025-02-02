import { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { toast } from 'react-hot-toast'
import { Spinner } from '@heroui/spinner'
import { FaGear } from 'react-icons/fa6'
import { TbPlugConnected } from 'react-icons/tb'
import { request } from '@/lib/request'
import { DynamicComponentRenderer } from './dynamicComponents'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal'

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
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FaGear className="text-xl text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  插件配置
                  <span className="text-default-400">|</span>
                  <span className="text-primary font-normal">{name}</span>
                </h3>
                <p className="text-sm text-default-500">管理插件的配置项</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                color="primary"
                onPress={handleSave}
                isDisabled={configs.length === 0}
              >
                保存配置
              </Button>
              <Button
                variant="light"
                onPress={onClose}
              >
                取消
              </Button>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="min-h-[400px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Spinner size="lg" color="primary" />
                  <p className="text-default-500">正在加载配置...</p>
                </div>
              </div>
            ) : configs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-default-400">
                <TbPlugConnected className="text-5xl mb-4" />
                <p className="text-lg">暂无配置项</p>
                <p className="text-sm mt-2">该插件当前没有可配置的选项</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-default-50 rounded-xl border">
                  <DynamicComponentRenderer
                    configs={configs}
                    onChange={handleConfigChange}
                  />
                </div>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
