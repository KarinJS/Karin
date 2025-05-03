import { toast } from 'react-hot-toast'
import { Button } from '@heroui/button'
import { Input, Textarea } from '@heroui/input'
import { Divider } from '@heroui/divider'
import { Spinner } from '@heroui/spinner'
import { Tabs, Tab } from '@heroui/tabs'
import { Card, CardBody } from '@heroui/card'
import { Select, SelectItem } from '@heroui/select'
import { useState, useEffect, useCallback, useRef } from 'react'
import { LuSettings2, LuSave, LuRefreshCw, LuCheck } from 'react-icons/lu'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { getNpmBaseConfig, getNpmrcContent, getNpmrcList, saveNpmrc } from '@/request/dependencies'

/**
 * .npmrc文件信息接口
 */
interface NpmrcFile {
  /** 文件路径 */
  path: string
  /** 文件描述 */
  description: string
  /** 文件类型 */
  type: 'global' | 'project' | 'pnpm'
}

/**
 * npm配置模态框属性
 */
interface NpmConfigModalProps {
  /** 模态框是否打开 */
  isOpen: boolean
  /** 关闭模态框的回调 */
  onClose: () => void
}

/**
 * 默认的npm源选项
 */
const NPM_REGISTRY_OPTIONS = [
  { label: '官方源', value: 'https://registry.npmjs.org' },
  { label: '阿里云镜像', value: 'https://registry.npmmirror.com' },
  { label: '腾讯云镜像', value: 'https://mirrors.cloud.tencent.com/npm' },
]

/**
 * npm配置管理模态框组件
 */
const NpmConfigModal = ({ isOpen, onClose }: NpmConfigModalProps) => {
  /** 状态集合 */
  const [state, setState] = useState({
    loading: false,
    saving: false,
    loadingNpmrcContent: false,
    selectOpen: false,
  })

  /** 当前选中的标签 */
  const [activeTab, setActiveTab] = useState('basic')

  /** 是否已请求取消 */
  const isCancelRequestedRef = useRef(false)

  /** 基本配置 */
  const [config, setConfig] = useState({
    registry: '',
    httpProxy: '',
    httpsProxy: '',
  })

  /** npmrc相关状态 */
  const [npmrcState, setNpmrcState] = useState({
    files: [] as NpmrcFile[],
    selectedFile: '',
    content: '',
  })

  /**
   * 更新状态的辅助函数
   */
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  /**
   * 更新配置的辅助函数
   */
  const updateConfig = useCallback((updates: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  /**
   * 更新npmrc状态的辅助函数
   */
  const updateNpmrcState = useCallback((updates: Partial<typeof npmrcState>) => {
    setNpmrcState(prev => ({ ...prev, ...updates }))
  }, [])

  /**
   * 获取.npmrc文件列表
   */
  const fetchNpmrcFiles = useCallback(async () => {
    if (isCancelRequestedRef.current) return

    updateState({ loading: true })
    try {
      const result = await getNpmrcList()

      if (isCancelRequestedRef.current) return

      if (!result.success) {
        toast.error(result.message)
        return
      }

      const npmrcFileList = result.data.map(file => ({
        path: file.path,
        description: file.description,
        type: file.type as 'global' | 'project' | 'pnpm',
      }))

      updateNpmrcState({ files: npmrcFileList })

      // 如果有文件，默认选中第一个
      if (npmrcFileList.length > 0) {
        const firstFilePath = npmrcFileList[0].path
        updateNpmrcState({ selectedFile: firstFilePath })
        // 加载选中文件的内容
        await fetchNpmrcContent(firstFilePath)
      }
    } catch (error) {
      console.error('获取.npmrc文件列表失败:', error)
      if (!isCancelRequestedRef.current) {
        toast.error('获取.npmrc文件列表失败')
      }
    } finally {
      updateState({ loading: false })
    }
  }, [updateState, updateNpmrcState])

  /**
   * 获取.npmrc文件内容
   */
  const fetchNpmrcContent = useCallback(async (filePath: string) => {
    if (!filePath || isCancelRequestedRef.current) return

    updateState({ loadingNpmrcContent: true })
    try {
      const result = await getNpmrcContent(filePath)

      if (isCancelRequestedRef.current) return

      if (!result.success) {
        toast.error(result.message)
        return
      }

      updateNpmrcState({ content: result.data })
    } catch (error) {
      console.error('获取.npmrc文件内容失败:', error)
      if (!isCancelRequestedRef.current) {
        toast.error('获取.npmrc文件内容失败')
      }
    } finally {
      updateState({ loadingNpmrcContent: false })
    }
  }, [updateState, updateNpmrcState])

  /**
   * 获取npm配置
   */
  const fetchNpmConfig = useCallback(async () => {
    if (isCancelRequestedRef.current) return

    updateState({ loading: true })
    try {
      const result = await getNpmBaseConfig()

      if (isCancelRequestedRef.current) return

      if (!result.success) {
        toast.error(result.message)
        return
      }

      const { registry, proxy, 'https-proxy': httpsProxy } = result.data
      updateConfig({
        registry: registry === 'null' ? '' : registry,
        httpProxy: proxy === 'null' ? '' : proxy,
        httpsProxy: httpsProxy === 'null' ? '' : httpsProxy,
      })

      // 获取npmrc文件列表
      await fetchNpmrcFiles()
    } catch (error) {
      console.error('获取npm配置失败:', error)
      if (!isCancelRequestedRef.current) {
        toast.error('获取npm配置失败')
      }
    } finally {
      updateState({ loading: false })
    }
  }, [updateState, updateConfig, fetchNpmrcFiles])

  /**
   * 保存npm配置
   */
  const saveNpmConfig = useCallback(async () => {
    if (isCancelRequestedRef.current) return

    updateState({ saving: true })
    try {
      const { registry, httpProxy, httpsProxy } = config
      const baseConfig = {
        registry,
        proxy: httpProxy,
        'https-proxy': httpsProxy,
      }

      // 如果是高级配置，则保存.npmrc文件内容
      const { selectedFile, content } = npmrcState
      const filePath = activeTab === 'advanced' && selectedFile ? selectedFile : ''
      const fileContent = activeTab === 'advanced' && selectedFile ? content : ''

      const result = await saveNpmrc(filePath, fileContent, baseConfig)

      if (isCancelRequestedRef.current) return

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success('npm配置保存成功')
    } catch (error) {
      console.error('保存npm配置失败:', error)
      if (!isCancelRequestedRef.current) {
        toast.error('保存npm配置失败')
      }
    } finally {
      updateState({ saving: false })
    }
  }, [config, npmrcState, activeTab, updateState])

  /**
   * 处理.npmrc文件选择变更
   */
  const handleNpmrcFileChange = useCallback(async (value: string) => {
    updateNpmrcState({ selectedFile: value })
    if (value) {
      await fetchNpmrcContent(value)
    } else {
      updateNpmrcState({ content: '' })
    }
  }, [fetchNpmrcContent, updateNpmrcState])

  /**
   * 处理默认源选择
   */
  const handleRegistrySelect = useCallback((registry: string) => {
    updateConfig({ registry })
  }, [updateConfig])

  /**
   * 处理模态框关闭
   */
  const handleClose = useCallback(() => {
    // 标记取消，终止所有进行中的异步操作
    isCancelRequestedRef.current = true

    // 确保body样式恢复
    document.body.style.overflow = 'auto'

    // 通知父组件
    onClose()
  }, [onClose])

  /** 模态框打开时获取配置 */
  useEffect(() => {
    if (isOpen) {
      // 打开前重置取消标记
      isCancelRequestedRef.current = false
      fetchNpmConfig()
    }

    // 清理函数
    return () => {
      // 组件卸载时，确保清理
      if (isOpen) {
        // 标记当前请求应该被取消
        isCancelRequestedRef.current = true
        // 确保body样式恢复
        document.body.style.overflow = 'auto'
      }
    }
  }, [isOpen, fetchNpmConfig])

  // 如果未打开，不渲染任何内容
  if (!isOpen) return null

  // 解构常用状态
  const { loading, saving, loadingNpmrcContent } = state
  const { registry, httpProxy, httpsProxy } = config
  const { files: npmrcFiles, selectedFile: selectedNpmrcFile, content: npmrcContent } = npmrcState

  /**
   * 渲染基本配置标签页
   */
  const renderBasicTab = () => (
    <div className='space-y-4 p-2'>
      <div>
        <label className='block text-sm text-default-700 mb-1' id='registry-label'>Registry (npm源)</label>
        <div className='flex flex-col gap-2'>
          <Input
            aria-labelledby='registry-label'
            placeholder='例如：https://registry.npmjs.org/'
            value={registry}
            onChange={(e) => updateConfig({ registry: e.target.value })}
            size='sm'
            color='primary'
            className='font-light'
            startContent={
              <div className='text-default-400 text-small'>URL:</div>
            }
          />

          <div>
            <label className='block text-xs text-default-500 mb-1' id='preset-sources-label'>选择预设源:</label>
            <div className='flex flex-wrap gap-2' aria-labelledby='preset-sources-label'>
              {NPM_REGISTRY_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  size='sm'
                  color='primary'
                  variant={registry === option.value ? 'solid' : 'flat'}
                  onPress={() => handleRegistrySelect(option.value)}
                  startContent={registry === option.value ? <LuCheck size={12} /> : null}
                  className='text-xs'
                  aria-label={`选择${option.label}`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className='block text-sm text-default-700 mb-1' id='http-proxy-label'>HTTP代理</label>
        <Input
          aria-labelledby='http-proxy-label'
          placeholder='例如：http://proxy.example.com:8080'
          value={httpProxy}
          onChange={(e) => updateConfig({ httpProxy: e.target.value })}
          size='sm'
          color='primary'
          className='font-light'
        />
      </div>

      <div>
        <label className='block text-sm text-default-700 mb-1' id='https-proxy-label'>HTTPS代理</label>
        <Input
          aria-labelledby='https-proxy-label'
          placeholder='例如：http://proxy.example.com:8080'
          value={httpsProxy}
          onChange={(e) => updateConfig({ httpsProxy: e.target.value })}
          size='sm'
          color='primary'
          className='font-light'
        />
      </div>
    </div>
  )

  /**
   * 渲染高级配置标签页
   */
  const renderAdvancedTab = () => (
    <div className='space-y-4 p-2'>
      <div>
        <label className='block text-sm text-default-700 mb-2' id='npmrc-file-label'>选择.npmrc配置文件</label>
        <Select
          aria-labelledby='npmrc-file-label'
          items={npmrcFiles}
          selectedKeys={[selectedNpmrcFile]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string
            handleNpmrcFileChange(selected)
          }}
          size='sm'
          color='primary'
          className='w-full'
          classNames={{
            trigger: 'h-10',
            value: 'text-small',
          }}
          listboxProps={{
            'aria-label': 'npmrc文件列表',
            itemClasses: {
              base: 'text-sm',
            },
          }}
          popoverProps={{
            shouldBlockScroll: true,
            shouldFlip: true,
          }}
        >
          {(npmrc) => (
            <SelectItem key={npmrc.path} textValue={npmrc.path}>
              <div className='flex flex-col'>
                <span className='text-small'>{npmrc.description}</span>
                <span className='text-tiny text-default-400'>{npmrc.path}</span>
              </div>
            </SelectItem>
          )}
        </Select>
      </div>

      <Card className='shadow-sm'>
        <CardBody>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <h3 className='text-sm font-medium' id='file-content-label'>文件内容</h3>
              {loadingNpmrcContent && <Spinner size='sm' color='primary' aria-label='加载文件内容' />}
            </div>
            <Textarea
              aria-labelledby='file-content-label'
              placeholder={loadingNpmrcContent ? '加载中...' : '选择.npmrc文件查看内容'}
              value={npmrcContent}
              onChange={(e) => updateNpmrcState({ content: e.target.value })}
              minRows={10}
              maxRows={15}
              color='primary'
              variant='bordered'
              className='font-mono text-xs'
              readOnly={loadingNpmrcContent}
            />
            <p className='text-xs text-default-400'>
              修改后点击"保存配置"按钮将更改保存到文件
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      backdrop='blur'
      radius='lg'
      placement='center'
      size='lg'
      aria-labelledby='npm-config-modal-title'
      classNames={{
        base: 'border border-default-100 max-w-2xl mx-auto my-0',
        wrapper: 'items-center justify-center',
        header: 'border-b border-default-100 p-4',
        body: 'p-4',
        footer: 'border-t border-default-100 p-4',
        closeButton: 'hover:bg-default-100',
      }}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1 pb-3'>
          <div className='flex items-center gap-2' id='npm-config-modal-title'>
            <LuSettings2 size={20} className='text-primary-500' />
            <div className='text-lg font-light tracking-tight'>npm配置管理</div>
          </div>
        </ModalHeader>

        <Divider className='opacity-50' />

        <ModalBody>
          {loading
            ? <div className='flex items-center justify-center p-10'><Spinner color='primary' size='lg' aria-label='加载中' /></div>
            : (
              <div className='space-y-4'>
                <Tabs
                  aria-label='npm配置分类'
                  color='primary'
                  variant='underlined'
                  selectedKey={activeTab}
                  onSelectionChange={setActiveTab as any}
                  classNames={{
                    base: 'w-full',
                    tabList: 'gap-6',
                    cursor: 'w-full bg-primary-500',
                    tab: 'max-w-fit px-2 h-10',
                    tabContent: 'group-data-[selected=true]:text-primary-500',
                  }}
                >
                  <Tab key='basic' title='基本配置'>
                    {renderBasicTab()}
                  </Tab>

                  <Tab key='advanced' title='高级配置'>
                    {renderAdvancedTab()}
                  </Tab>
                </Tabs>
              </div>)}
        </ModalBody>

        <Divider className='opacity-50' />

        <ModalFooter>
          <Button
            color='default'
            variant='light'
            radius='full'
            className='font-normal text-xs md:text-sm'
            size='sm'
            startContent={<LuRefreshCw size={16} />}
            isLoading={loading}
            onPress={fetchNpmConfig}
            isDisabled={saving}
            aria-label='刷新配置'
          >
            刷新配置
          </Button>
          <Button
            color='primary'
            onPress={saveNpmConfig}
            radius='full'
            className='font-normal text-xs md:text-sm'
            size='sm'
            startContent={<LuSave size={16} />}
            isLoading={saving}
            isDisabled={loading}
            aria-label='保存配置'
          >
            保存配置
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default NpmConfigModal
