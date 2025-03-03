import { Card } from '@heroui/card'
import { Tabs, Tab } from '@heroui/tabs'
import { Button } from '@heroui/button'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { lazy, useState, useRef, useEffect, Suspense } from 'react'
import {
  Settings,
  Plug,
  Users,
  MessageSquare,
  Palette,
  Server,
  Cpu,
  Eye,
  FoldVertical,
  RotateCw,
  Save,
  Settings2
} from 'lucide-react'

// Tab项配置
const tabItems = [
  { key: 'config', icon: Settings, label: '基本配置' },
  { key: 'adapter', icon: Plug, label: '适配器' },
  { key: 'group', icon: Users, label: '群聊频道' },
  { key: 'private', icon: MessageSquare, label: '好友私信' },
  { key: 'render', icon: Palette, label: '渲染器' },
  { key: 'pm2', icon: Server, label: 'PM2' },
]

export default function TestPage () {
  const [selectedTab, setSelectedTab] = useState('config')
  /** 跟踪滚动容器 用于移动端 */
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  /** 存储滚动位置 用于移动端 */
  const scrollPositionRef = useRef(0)
  /** 表单引用 用于触发适配器组件中的表单提交 */
  const formRef = useRef<HTMLFormElement>(null)

  /**
   * 处理Tab变化
   * @param key 当前选中的Tab
   */
  const handleTabChange = (key: string | number) => {
    // 在改变tab之前保存当前滚动位置
    if (tabsContainerRef.current) {
      scrollPositionRef.current = tabsContainerRef.current.scrollLeft
    }
    setSelectedTab(key as string)
  }

  /**
   * 在tab变化后恢复滚动位置
   */
  useEffect(() => {
    if (tabsContainerRef.current) {
      // 设置回之前保存的位置
      tabsContainerRef.current.scrollLeft = scrollPositionRef.current
    }
  }, [selectedTab])

  /**
   * 处理保存按钮点击事件
   */
  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
  }

  /**
   * 设置按钮下拉菜单内容
   */
  const SettingsDropdownContent = () => (
    <DropdownMenu>
      <DropdownItem key='preview' startContent={<Eye size={18} />}>
        预览配置
      </DropdownItem>
      <DropdownItem key='fold' startContent={<FoldVertical size={18} />}>
        全部折叠
      </DropdownItem>
      <DropdownItem key='refresh' startContent={<RotateCw size={18} />}>
        刷新
      </DropdownItem>
    </DropdownMenu>
  )

  /**
   * 统一的设置按钮
   * @param showText 是否显示文本
   * @returns 设置按钮
   */
  const SettingsButton = ({ showText = true }) => (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant='bordered'
          size='sm'
          startContent={<Settings2 size={18} />}
          className={!showText ? 'min-w-0 p-2' : ''}
        >
          设置
        </Button>
      </DropdownTrigger>
      <SettingsDropdownContent />
    </Dropdown>
  )

  /**
   * 统一的保存按钮
   * @param showText 是否显示文本
   * @returns 保存按钮
   */
  const SaveButton = ({ showText = true }) => (
    <Button
      color='primary'
      size='sm'
      variant='flat'
      startContent={<Save size={18} />}
      className={!showText ? 'min-w-0 p-2' : ''}
      onPress={handleSaveClick}
    >
      保存
    </Button>
  )

  /**
   * 操作按钮组
   * @param showText 是否显示文本
   * @returns 操作按钮组
   */
  const ActionButtons = ({ showText = true }) => (
    <div className='flex items-center gap-2 shrink-0'>
      <SettingsButton showText={showText} />
      <SaveButton showText={showText} />
    </div>
  )

  /**
   * PC端布局
   * @returns PC端布局
   */
  const DesktopLayout = () => (
    <div className='hidden md:flex items-center justify-between gap-4'>
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
        className='w-full'
      >
        {tabItems.map(({ key, icon: Icon, label }) => (
          <Tab
            key={key}
            title={
              <div className='flex items-center gap-2'>
                <Icon size={18} />
                <span>{label}</span>
              </div>
            }
          />
        ))}
      </Tabs>
      <ActionButtons showText />
    </div>
  )

  /**
   * 移动端布局
   * @returns 移动端布局
   */
  const MobileLayout = () => (
    <div className='md:hidden flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Cpu size={24} className='text-primary-500' />
          <h2 className='text-xl font-semibold text-gray-800'>系统配置</h2>
        </div>
        <ActionButtons showText={false} />
      </div>

      <div className='overflow-x-auto w-full' ref={tabsContainerRef}>
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={handleTabChange}
          className='min-w-fit'
        >
          {tabItems.map(({ key, icon: Icon, label }) => (
            <Tab
              key={key}
              title={
                <div className='flex items-center gap-2 whitespace-nowrap'>
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
              }
            />
          ))}
        </Tabs>
      </div>
    </div>
  )

  const adapter = {
    console: {
      isLocal: true,
      token: '',
      host: ''
    },
    onebot: {
      ws_server: {
        enable: true,
        timeout: 120
      },
      ws_client: [
        {
          enable: false,
          url: 'ws://127.0.0.1:7778',
          token: ''
        }
      ],
      http_server: [
        {
          enable: false,
          self_id: 'default',
          url: 'http://127.0.0.1:6099',
          token: ''
        }
      ]
    }
  }

  const render = {
    ws_server: {
      enable: true
    },
    ws_client: [
      {
        enable: false,
        url: 'ws://127.0.0.1:7005/ws',
        token: '123456'
      }
    ],
    http_server: [
      {
        enable: false,
        url: 'http://127.0.0.1:7005',
        token: '123456'
      }
    ]
  }

  const config = {
    master: [
      'console'
    ],
    admin: [],
    user: {
      enable_list: [],
      disable_list: []
    },
    friend: {
      enable: true,
      enable_list: [],
      disable_list: [],
      log_enable_list: [],
      log_disable_list: []
    },
    group: {
      enable: true,
      enable_list: [],
      disable_list: [],
      log_enable_list: [],
      log_disable_list: []
    },
    directs: {
      enable: true,
      enable_list: [],
      disable_list: [],
      log_enable_list: [],
      log_disable_list: []
    },
    guilds: {
      enable: true,
      enable_list: [],
      disable_list: [],
      log_enable_list: [],
      log_disable_list: []
    },
    channels: {
      enable: true,
      enable_list: [],
      disable_list: [],
      log_enable_list: [],
      log_disable_list: []
    }
  }

  /**
   * 渲染内容区域
   * @returns 渲染的组件
   */
  const renderContent = (key: string) => {
    const tips = <div>加载中...</div>
    if (key === 'adapter') {
      const AdapterComponent = lazy(() => import('@/components/config/system/adapter')
        .then(module => ({
          default: () => module.getAdapterComponent(adapter, formRef)
        })))

      return (
        <Suspense fallback={tips}>
          <AdapterComponent />
        </Suspense>
      )
    }

    if (key === 'render') {
      const RenderComponent = lazy(() => import('@/components/config/system/render')
        .then(module => ({
          default: () => module.getRenderComponent(render, formRef)
        })))

      return (
        <Suspense fallback={tips}>
          <RenderComponent />
        </Suspense>
      )
    }

    if (key === 'config') {
      const ConfigComponent = lazy(() => import('@/components/config/system/config')
        .then(module => ({
          default: () => module.getConfigComponent(config, formRef)
        })))

      return (
        <Suspense fallback={tips}>
          <ConfigComponent />
        </Suspense>
      )
    }

    return null
  }

  return (
    <div className='p-4 space-y-4'>
      {/* 头部卡片 */}
      <Card className='p-6'>
        <div className='flex flex-col gap-4'>
          {/* PC端标题 - 仅在PC端显示 */}
          <div className='hidden md:flex items-center gap-2'>
            <Cpu size={24} className='text-primary-500' />
            <h2 className='text-xl font-semibold text-gray-800'>系统配置</h2>
          </div>

          <MobileLayout />
          <DesktopLayout />
        </div>
      </Card>

      {/* 下方内容区域卡片 */}
      <Card className='p-6'>
        {renderContent(selectedTab)}
      </Card>
    </div>
  )
}
