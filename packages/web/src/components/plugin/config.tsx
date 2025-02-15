import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { Button } from '@heroui/button'
import { toast } from 'react-hot-toast'
import { Spinner } from '@heroui/spinner'
import { IoSettingsOutline } from 'react-icons/io5'
import { RiPlugLine } from 'react-icons/ri'
import { VscJson } from 'react-icons/vsc'
import { request } from '@/lib/request'
import { DynamicRender } from '../heroui/main'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'

import type { ComponentConfig } from '../heroui/types'

// 请求参数
interface SaveConfigRequest {
  name: string
  type: 'git' | 'npm' | 'app'
  config: Record<string, any>
}

// 响应参数
interface SaveConfigResponse {
  success: boolean
  message: string
}

// 插件配置组件的 props
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

// 使用 memo 包装配置组件
export const PluginConfig = memo(({
  open,
  name,
  type,
  onClose,
}: PluginConfigProps) => {
  const [loading, setLoading] = useState(false)
  const [configs, setConfigs] = useState<ComponentConfig[]>([])
  const [configValues, setConfigValues] = useState<Record<string, any>>({})
  const [currentValues, setCurrentValues] = useState<Record<string, any>>({})

  // 添加 mounted ref 来防止组件卸载后的状态更新
  const mountedRef = useRef(false)

  // 缓存组件的初始状态
  const initialStateRef = useRef({
    name,
    type,
    configValues: {} as Record<string, any>
  })

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // 优化 handleGetConfig，添加状态重置
  const handleGetConfig = useCallback(async () => {
    if (!open) return // 如果模态框关闭，不执行请求

    try {
      setLoading(true)
      const result = await request.serverPost<ComponentConfig[], { name: string, type: 'git' | 'npm' | 'app' }>('/api/v1/plugin/config/get', {
        name,
        type
      })
      if (!mountedRef.current) return

      if (!result) {
        toast.error('获取配置失败')
        onClose()
        return
      }
      setConfigs(result)
      // 重置配置值状态
      setConfigValues(initialStateRef.current.configValues)
      setCurrentValues(initialStateRef.current.configValues)
    } catch (error) {
      if (!mountedRef.current) return
      toast.error((error as Error).message)
      onClose()
    } finally {
      if (!mountedRef.current) return
      setLoading(false)
    }
  }, [name, type, onClose, open])

  // 只在模态框打开时获取配置
  useEffect(() => {
    if (open) {
      handleGetConfig()
    } else {
      // 模态框关闭时重置状态
      setConfigs([])
      setConfigValues(initialStateRef.current.configValues)
      setCurrentValues(initialStateRef.current.configValues)
      setLoading(false)
    }
  }, [open, handleGetConfig])

  // 优化配置值变更处理 - 直接传递 result，不做任何处理
  const handleConfigChange = useCallback((result: Record<string, any>) => {
    if (!mountedRef.current || !open) return
    // 直接设置 result，不做任何转换
    setCurrentValues(result)
  }, [open])

  // 优化配置值的更新逻辑
  useEffect(() => {
    if (!open) return // 如果模态框关闭，不更新状态
    if (JSON.stringify(currentValues) !== JSON.stringify(configValues)) {
      setConfigValues(currentValues)
    }
  }, [currentValues, configValues, open])

  // 优化保存处理
  const handleSave = useCallback(async () => {
    if (!open) return

    try {
      const response = await request.serverPost<SaveConfigResponse, SaveConfigRequest>(
        '/api/v1/plugin/config/save',
        {
          name,
          type,
          config: currentValues
        }
      )

      if (!mountedRef.current) return

      if (!response.success) {
        toast.error(response.message || '保存失败')
        return
      }

      toast.success(response.message || '保存成功')
    } catch (error) {
      if (!mountedRef.current) return
      toast.error((error as Error).message)
    }
  }, [name, type, currentValues, open])

  // 使用 useMemo 优化渲染内容
  const renderContent = useMemo(() => {
    if (!open) return null // 如果模态框关闭，不渲染内容

    if (loading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="md" color="primary" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">正在加载配置...</p>
          </div>
        </div>
      )
    }

    if (configs.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
            <RiPlugLine className="text-2xl text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mt-4 text-gray-900 dark:text-gray-100 font-medium">暂无配置项</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">该插件当前没有需要配置的选项</p>
        </div>
      )
    }

    return (
      <div className="h-full space-y-4 overflow-y-auto custom-scrollbar">
        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
          <DynamicRender
            configs={configs}
            onChange={handleConfigChange}
            values={configValues}
          />
        </div>
      </div>
    )
  }, [loading, configs, handleConfigChange, open, configValues])

  // 如果模态框关闭，不渲染任何内容
  if (!open) return null

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
            {renderContent}
          </div>
        </ModalBody>
        <ModalFooter className="shrink-0 py-3">
          <div className="flex justify-end gap-2">
            <Button
              color="default"
              variant="bordered"
              size="md"
              onPress={() => console.log('当前配置值:', currentValues)}
              className="px-5 h-10 min-w-[88px] font-medium border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              startContent={<VscJson className="text-lg" />}
            >
              打印配置
            </Button>
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
}, (prevProps, nextProps) => {
  // 自定义比较函数，只在必要时重新渲染
  return (
    prevProps.open === nextProps.open &&
    prevProps.name === nextProps.name &&
    prevProps.type === nextProps.type
  )
})
