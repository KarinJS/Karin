import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react'
import { Button } from '@heroui/button'
import { toast } from 'react-hot-toast'
import { Spinner } from '@heroui/spinner'
import { IoSettingsOutline } from 'react-icons/io5'
import { RiPlugLine } from 'react-icons/ri'
import { VscJson, VscCopy } from 'react-icons/vsc'
import { request } from '@/lib/request'
import { DynamicRender } from '../heroui/main'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { useForm, FormProvider } from 'react-hook-form'
import type { ComponentConfig } from '../heroui/types'

interface GetConfigRequest {
  name: string
  type: 'git' | 'npm' | 'app'
}

interface SaveConfigRequest { name: string; type: 'git' | 'npm' | 'app'; config: Record<string, any> }
interface SaveConfigResponse { success: boolean; message: string }
interface PluginConfigProps {
  open: boolean
  name: string
  type: 'git' | 'npm' | 'app'
  onClose: () => void
  onViewConfig?: () => void
}

// 提取常量
const MODAL_CLASS_NAMES = {
  base: "bg-white dark:bg-gray-900",
  header: "border-b border-gray-100 dark:border-gray-800",
  footer: "border-t border-gray-100 dark:border-gray-800"
}

const BUTTON_COMMON_STYLES = 'px-5 h-10 min-w-[88px] font-medium'

// 抽离子组件
const LoadingState = () => (
  <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="md" color="primary" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">正在加载配置...</p>
    </div>
  </div>
)

const EmptyState = () => (
  <div className="h-full flex flex-col items-center justify-center">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
      <RiPlugLine className="text-2xl text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="mt-4 text-gray-900 dark:text-gray-100 font-medium">暂无配置项</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">该插件当前没有需要配置的选项</p>
  </div>
)

export const PluginConfig = memo(({ open, name, type, onClose }: PluginConfigProps) => {
  const [loading, setLoading] = useState(false)
  const [configs, setConfigs] = useState<ComponentConfig[]>([])
  const [showJsonModal, setShowJsonModal] = useState(false)
  const configDataRef = useRef<Record<string, any>>({})
  const abortControllerRef = useRef<AbortController | null>(null)

  const methods = useForm({ mode: 'onChange' })
  const { handleSubmit, reset, getValues } = methods

  const handleGetConfig = useCallback(async () => {
    if (!open) return

    try {
      setLoading(true)
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      const result = await request.serverPost<ComponentConfig[], GetConfigRequest>(
        '/api/v1/plugin/config/get',
        { name, type },
        { signal: abortControllerRef.current.signal }
      )

      setConfigs(result || [])
      if (result?.length) reset(result.reduce((acc, cur) => ({ ...acc, [cur.componentType]: cur }), {}))
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast.error((error as Error).message)
        onClose()
      }
    } finally {
      setLoading(false)
    }
  }, [name, type, open, onClose, reset])

  useEffect(() => {
    if (open) {
      handleGetConfig()
    } else {
      setConfigs([])
      abortControllerRef.current?.abort()
    }
  }, [open, handleGetConfig])

  const handleConfigChange = useCallback((result: Record<string, any>) => {
    configDataRef.current = result
  }, [])

  const onSubmit = useCallback(async () => {
    try {
      const response = await request.serverPost<SaveConfigResponse, SaveConfigRequest>(
        '/api/v1/plugin/config/save',
        { name, type, config: configDataRef.current }
      )

      response.success
        ? toast.success(response.message || '保存成功')
        : toast.error(response.message || '保存失败')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [name, type])

  const handleCopyConfig = useCallback(() => {
    const config = JSON.stringify(configDataRef.current, null, 2)
    navigator.clipboard.writeText(config)
    toast.success('配置已复制到剪贴板')
  }, [])

  const renderContent = useMemo(() => {
    if (!open) return null
    if (loading) return <LoadingState />
    if (!configs.length) return <EmptyState />

    return (
      <div className="h-full space-y-4 overflow-y-auto custom-scrollbar">
        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
          <FormProvider {...methods}>
            <form id="plugin-config-form" onSubmit={handleSubmit(onSubmit)}>
              <DynamicRender configs={configs} onChange={handleConfigChange} />
            </form>
          </FormProvider>
        </div>
      </div>
    )
  }, [open, loading, configs, methods, handleSubmit, onSubmit, handleConfigChange])

  if (!open) return null

  return (
    <>
      <Modal
        isOpen={open}
        onOpenChange={onClose}
        size="4xl"
        scrollBehavior="inside"
        classNames={MODAL_CLASS_NAMES}
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
            <div className="h-[480px] py-5">{renderContent}</div>
          </ModalBody>
          <ModalFooter className="shrink-0 py-3">
            <div className="flex justify-end gap-2">
              <Button
                color="default"
                variant="bordered"
                size="md"
                onPress={() => setShowJsonModal(true)}
                className={`${BUTTON_COMMON_STYLES} border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800`}
                startContent={<VscJson className="text-lg" />}
              >
                打印配置
              </Button>
              <Button
                color="default"
                variant="bordered"
                size="md"
                onPress={onClose}
                className={`${BUTTON_COMMON_STYLES} border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800`}
              >
                取消
              </Button>
              <Button
                type="submit"
                form="plugin-config-form"
                color="primary"
                variant="flat"
                size="md"
                isDisabled={!configs.length}
                className={`${BUTTON_COMMON_STYLES} bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400`}
              >
                保存
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={showJsonModal}
        onOpenChange={() => setShowJsonModal(false)}
        size="2xl"
        scrollBehavior="inside"
        classNames={MODAL_CLASS_NAMES}
      >
        <ModalContent>
          <ModalHeader className="shrink-0">
            <div className="flex items-center py-1 px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50/80 dark:bg-blue-900/20 transition-colors">
                  <VscJson className="text-base text-blue-600/90 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-[15px] font-medium text-gray-900 dark:text-gray-100 leading-[18px]">
                    配置详情
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-[14px]">
                    当前插件的配置信息
                  </p>
                </div>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm font-mono">
              {JSON.stringify(configDataRef.current, null, 2)}
            </pre>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end gap-2">
              <Button
                color="default"
                variant="bordered"
                size="md"
                onPress={handleCopyConfig}
                className={`${BUTTON_COMMON_STYLES} border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800`}
                startContent={<VscCopy className="text-lg" />}
              >
                复制
              </Button>
              <Button
                color="primary"
                variant="flat"
                size="md"
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
}, (prev, next) => prev.open === next.open && prev.name === next.name && prev.type === next.type)