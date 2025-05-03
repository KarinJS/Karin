import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import toast from 'react-hot-toast'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { request } from '@/lib/request'
import { useEffect, useState } from 'react'
import { IoAdd, IoClose } from 'react-icons/io5'
import { TabList, TabPanel, Tabs } from '@/components/tabs'
import { CHECK_PLUGIN_ROUTER, GET_SYSTEM_STATUS_ROUTER } from '@/lib/router'
import terminalManager from '@/controllers/terminal_manager'
import { SortableTab } from '@/components/tabs/sortable_tab.tsx'
import { TerminalInstance } from '@/components/terminal/terminal-instance'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal'
import { useNavigate } from 'react-router-dom'

import type { CreatePty } from 'node-karin'

interface TerminalTab {
  id: string
  title: string
}

export default function TerminalPage () {
  const navigate = useNavigate()
  /** 后端是否安装了虚拟终端插件 */
  const [isPtyInstalled, setIsPtyInstalled] = useState(false)
  /** 是否正在检查插件 */
  const [isCheckingPlugin, setIsCheckingPlugin] = useState(true)
  /** 终端列表 */
  const [tabs, setTabs] = useState<TerminalTab[]>([])
  /** 选中的终端 */
  const [selectedTab, setSelectedTab] = useState<string>('')
  /** 后端是否为windows系统 */
  const [isWindows, setIsWindows] = useState<boolean | null>(null)
  /** 是否打开创建终端模态框 */
  const [isShellModalOpen, setIsShellModalOpen] = useState(false)
  /** 新终端名称 */
  const [newTerminalName, setNewTerminalName] = useState('')
  /** 选中的shell */
  const [selectedShell, setSelectedShell] = useState<CreatePty['shell']>('bash')

  // 新增断开连接的终端状态
  const [disconnectedTerminals, setDisconnectedTerminals] = useState<Record<string, boolean>>({})

  useEffect(() => {
    /** 检查是否安装了虚拟终端插件 */
    setIsCheckingPlugin(true)
    request.serverPost<{ installed: boolean }, { name: string }>(CHECK_PLUGIN_ROUTER, { name: '@karinjs/node-pty' })
      .then((res) => {
        setIsPtyInstalled(res.installed)
        setIsCheckingPlugin(false)
      })
      .catch(() => {
        setIsCheckingPlugin(false)
      })
  }, [])

  useEffect(() => {
    /** 获取已存在的终端列表 */
    terminalManager.getTerminalList().then((terminals) => {
      if (terminals.length === 0) return

      const newTabs = terminals.map((terminal) => ({
        id: terminal.id,
        title: terminal.name,
      }))

      setTabs(newTabs)
      setSelectedTab(newTabs[0].id)
    })

    // 注册全局连接状态回调
    const unregister = terminalManager.registerGlobalStatusCallback((id, status) => {
      if (status === 'disconnected' || status === 'error') {
        setDisconnectedTerminals(prev => ({ ...prev, [id]: true }))
      } else if (status === 'connected') {
        setDisconnectedTerminals(prev => {
          const newState = { ...prev }
          delete newState[id]
          return newState
        })
      }
    })

    return () => {
      unregister()
    }
  }, [])

  useEffect(() => {
    /** 获取系统平台 */
    request.serverGet<{ platform: string }>(GET_SYSTEM_STATUS_ROUTER).then((res) => {
      setIsWindows(res.platform === 'win32')
    })
  }, [])

  /**
   * 创建终端
   * @param shell 终端类型
   * @param name 终端名称
   */
  const createTerminalWithShell = async (shell: CreatePty['shell'], name: string) => {
    try {
      const { id } = await terminalManager.createTerminal(80, 24, shell, name)
      const newTab = {
        id,
        title: name || id,
      }

      setTabs((prev) => [...prev, newTab])
      setSelectedTab(id)
    } catch (error) {
      console.error('Failed to create terminal:', error)
      toast.error('创建终端失败')
    }
  }

  /**
   * 创建新终端
   */
  const createNewTerminal = async () => {
    // 设置默认shell
    if (isWindows) {
      setSelectedShell('cmd.exe')
      // 设置默认名称 - 基于终端类型
      setNewTerminalName(`CMD ${tabs.length + 1}`)
    } else {
      setSelectedShell('bash')
      // 设置默认名称 - 基于终端类型
      setNewTerminalName(`Bash ${tabs.length + 1}`)
    }
    // 打开模态框
    setIsShellModalOpen(true)
  }

  /**
   * 当shell类型改变时更新默认名称
   */
  const updateTerminalNameBasedOnShell = (shell: CreatePty['shell']) => {
    setSelectedShell(shell)

    // 根据选择的shell类型更新名称
    if (shell === 'cmd.exe') {
      setNewTerminalName(`CMD ${tabs.length + 1}`)
    } else if (shell === 'powershell.exe') {
      setNewTerminalName(`PowerShell ${tabs.length + 1}`)
    }
  }

  /**
   * 确认创建终端
   */
  const confirmCreateTerminal = async () => {
    const shell = isWindows ? selectedShell : 'bash'
    await createTerminalWithShell(shell, newTerminalName)
    setIsShellModalOpen(false)
  }

  /**
   * 关闭终端
   * @param id 终端ID
   */
  const closeTerminal = async (id: string) => {
    try {
      await terminalManager.closeTerminal(id)
      terminalManager.removeTerminal(id)

      // 清理断开连接状态
      setDisconnectedTerminals(prev => {
        const newState = { ...prev }
        delete newState[id]
        return newState
      })

      if (selectedTab === id) {
        const previousIndex = tabs.findIndex((tab) => tab.id === id) - 1
        if (previousIndex >= 0) {
          setSelectedTab(tabs[previousIndex].id)
        } else if (tabs.length > 1) {
          setSelectedTab(tabs[0]?.id || '')
        } else {
          setSelectedTab('')
        }
      }

      setTabs((prev) => prev.filter((tab) => tab.id !== id))
    } catch (error) {
      toast.error('关闭终端失败')
    }
  }

  /**
   * 拖拽结束
   * @param event 拖拽事件
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  /**
   * 传感器
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // 如果正在检查插件状态，显示加载中
  if (isCheckingPlugin) {
    return (
      <div className='flex flex-col items-center justify-center h-[calc(100vh-6rem)]'>
        <div className='text-lg'>正在检查终端插件...</div>
      </div>
    )
  }

  // 如果插件未安装，显示安装提示
  if (!isPtyInstalled) {
    return (
      <div className='flex flex-col items-center justify-center h-[calc(100vh-6rem)] gap-4'>
        <div className='text-xl font-medium'>终端功能不可用</div>
        <div className='text-gray-500'>需要安装 @karinjs/node-pty 插件</div>
        <Button
          color='primary'
          onPress={() => {
            navigate('/plugins/webui')
          }}
        >
          前往插件页面安装
        </Button>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-2 p-0.5 h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)]'>
      <Modal isOpen={isShellModalOpen} onClose={() => setIsShellModalOpen(false)}>
        <ModalContent>
          <ModalHeader>新建终端</ModalHeader>
          <ModalBody className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>终端名称</label>
              <Input
                value={newTerminalName}
                isRequired
                onChange={(e) => setNewTerminalName(e.target.value)}
                placeholder='请输入终端名称'
                className='w-full'
              />
            </div>

            {isWindows && (
              <div>
                <label className='block text-sm font-medium mb-1'>终端类型</label>
                <div className='flex gap-2'>
                  <Button
                    color={selectedShell === 'cmd.exe' ? 'primary' : 'default'}
                    variant={selectedShell === 'cmd.exe' ? 'solid' : 'bordered'}
                    onPress={() => updateTerminalNameBasedOnShell('cmd.exe')}
                    className='flex-1'
                  >
                    CMD
                  </Button>
                  <Button
                    color={selectedShell === 'powershell.exe' ? 'primary' : 'default'}
                    variant={selectedShell === 'powershell.exe' ? 'solid' : 'bordered'}
                    onPress={() => updateTerminalNameBasedOnShell('powershell.exe')}
                    className='flex-1'
                  >
                    PowerShell
                  </Button>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className='flex justify-center gap-4'>
            <Button
              color='default'
              onPress={() => setIsShellModalOpen(false)}
            >
              取消
            </Button>
            <Button
              color='primary'
              onPress={confirmCreateTerminal}
            >
              确认
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Tabs
          activeKey={selectedTab}
          onChange={setSelectedTab}
          className='h-full overflow-hidden'
        >
          <div className='flex items-center gap-2 flex-shrink-0 flex-grow-0 overflow-x-auto'>
            <TabList className='flex-1 !overflow-x-auto w-full hide-scrollbar'>
              <SortableContext
                items={tabs}
                strategy={horizontalListSortingStrategy}
              >
                {tabs.map((tab) => (
                  <SortableTab
                    key={tab.id}
                    id={tab.id}
                    value={tab.id}
                    isSelected={selectedTab === tab.id}
                    className='flex gap-2 items-center flex-shrink-0'
                  >
                    {tab.title}
                    {/* 连接状态指示器 */}
                    {disconnectedTerminals[tab.id]
                      ? (<span className='w-2 h-2 rounded-full bg-red-500' title='连接已断开' />)
                      : (<span className='w-2 h-2 rounded-full bg-green-500' title='连接正常' />)}
                    <Button
                      isIconOnly
                      radius='full'
                      variant='flat'
                      size='sm'
                      className='min-w-0 w-4 h-4 flex-shrink-0'
                      onPress={() => closeTerminal(tab.id)}
                      color={selectedTab === tab.id ? 'primary' : 'default'}
                    >
                      <IoClose />
                    </Button>
                  </SortableTab>
                ))}
              </SortableContext>
            </TabList>
            <Button
              isIconOnly
              color='primary'
              size='sm'
              variant='flat'
              onPress={createNewTerminal}
              startContent={<IoAdd />}
              className='text-xl flex-shrink-0'
            />
          </div>
          <div className='flex-grow overflow-hidden'>
            {tabs.length === 0 && (
              <div className='flex flex-col gap-2 items-center justify-center h-full text-gray-500 py-5'>
                <IoAdd className='text-4xl' />
                <div className='text-sm'>点击右上角按钮创建终端</div>
              </div>
            )}
            {tabs.map((tab) => (
              <TabPanel key={tab.id} value={tab.id} className='h-full'>
                <TerminalInstance id={tab.id} />
              </TabPanel>
            ))}
          </div>
        </Tabs>
      </DndContext>
    </div>
  )
}
