import { Card } from '@heroui/card'
import { Tabs, Tab } from '@heroui/tabs'
import { Button } from '@heroui/button'
import { useParams, useNavigate } from 'react-router-dom'
import { lazy, useState, useRef, useEffect, Suspense } from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
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
  Settings2,
  Database
} from 'lucide-react'
import toast from 'react-hot-toast'

// Tab项配置
const tabItems = [
  { key: 'config', icon: Settings, label: '基本配置' },
  { key: 'env', icon: Settings2, label: '环境变量' },
  { key: 'adapter', icon: Plug, label: '适配器' },
  { key: 'group', icon: Users, label: '群聊频道' },
  { key: 'private', icon: MessageSquare, label: '好友私信' },
  { key: 'render', icon: Palette, label: '渲染器' },
  { key: 'redis', icon: Database, label: 'Redis' },
  { key: 'pm2', icon: Server, label: 'PM2' },
]

export default function TestPage () {
  const { tab } = useParams()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(tab || 'config')
  const [refreshKey, setRefreshKey] = useState(0)
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
    // 更新 URL
    navigate(`/test/${key}`)
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
   * 处理刷新按钮点击事件
   */
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    toast.success('刷新成功')
  }

  /**
   * 设置按钮下拉菜单内容
   */
  const SettingsDropdownContent = () => (
    <DropdownMenu>
      <DropdownItem
        key='preview'
        startContent={<Eye size={18} />}
        onPress={() => toast.error('暂不支持预览配置')}
      >
        预览配置
      </DropdownItem>
      <DropdownItem
        key='fold'
        startContent={<FoldVertical size={18} />}
        onPress={() => toast.error('暂不支持全部折叠')}
      >
        全部折叠
      </DropdownItem>
      <DropdownItem
        key='refresh'
        startContent={<RotateCw size={18} />}
        onPress={handleRefresh}
      >
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
    <div className='hidden md:flex items-center gap-4 w-full'>
      {/* 添加一个容器来包裹Tabs，使其可以水平滚动 */}
      <div className='flex-1 overflow-x-auto'>
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
      {/* 按钮组添加shrink-0防止被压缩 */}
      <div className='shrink-0'>
        <ActionButtons showText />
      </div>
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

  const pm2 = {
    lines: 1000,
    apps: [
      {
        name: 'karin',
        script: 'index.js',
        autorestart: true,
        max_restarts: 60,
        max_memory_restart: '1G',
        restart_delay: 2000,
        merge_logs: true,
        error_file: './@karinjs/logs/pm2_error.log',
        out_file: './@karinjs/logs/pm2_out.log'
      }
    ]
  }

  const redis = {
    url: 'redis://127.0.0.1:6379',
    socket: {
      host: '127.0.0.1',
      port: 6379
    },
    username: '',
    password: '',
    database: 0
  }

  const group = [
    {
      key: 'default',
      cd: 0,
      mode: 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      alias: ['karin'],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
      userCD: 0
    },
    {
      key: 'Bot:selfId',
      cd: 0,
      mode: 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
      userCD: 0
    },
    {
      key: 'Bot:selfId:groupId',
      cd: 0,
      mode: 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
      userCD: 0
    },
    {
      key: 'Bot:selfId:guildId',
      cd: 0,
      mode: 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
      userCD: 0
    },
    {
      key: 'Bot:selfId:guildId:channelId',
      cd: 0,
      mode: 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
      userCD: 0
    }
  ]

  const privates = [
    {
      key: 'default',
      cd: 0,
      mode: 0 as 0 | 2 | 3 | 5 | 6,
      alias: [],
      enable: [],
      disable: []
    },
    {
      key: 'Bot:selfId',
      cd: 0,
      mode: 0 as 0 | 2 | 3 | 5 | 6,
      alias: [],
      enable: [],
      disable: []
    },
    {
      key: 'Bot:selfId:userId',
      cd: 0,
      mode: 0 as 0 | 2 | 3 | 5 | 6,
      alias: [],
      enable: [],
      disable: []
    }
  ]

  const env: Record<string, { value: string, comment: string }> = {
    HTTP_ENABLE: { value: 'true', comment: '# 是否启用HTTP' },
    HTTP_PORT: { value: '7777', comment: '# HTTP监听端口' },
    HTTP_HOST: { value: '0.0.0.0', comment: '# HTTP监听地址' },
    HTTP_AUTH_KEY: { value: 'abc123', comment: '# HTTP鉴权秘钥 仅用于karin自身Api' },
    WS_SERVER_AUTH_KEY: { value: '', comment: '# ws_server鉴权秘钥' },
    REDIS_ENABLE: { value: 'true', comment: '# 是否启用Redis 关闭后将使用内部虚拟Redis' },
    PM2_RESTART: { value: 'true', comment: '# 重启是否调用pm2 如果不调用则会直接关机 此配置适合有进程守护的程序' },
    LOG_LEVEL: { value: 'info', comment: '# 日志等级' },
    LOG_DAYS_TO_KEEP: { value: '7', comment: '# 日志保留天数' },
    LOG_MAX_LOG_SIZE: { value: '0', comment: '# 日志文件最大大小 如果此项大于0则启用日志分割' },
    LOG_FNC_COLOR: { value: '', comment: '# E1D919"' },
    LOG_MAX_CONNECTIONS: { value: '5', comment: '# 日志实时Api最多支持同时连接数' },
    FFMPEG_PATH: { value: '', comment: '# ffmpeg' },
    FFPROBE_PATH: { value: '', comment: '# ffprobe' },
    FFPLAY_PATH: { value: '', comment: '# ffplay' },
    RUNTIME: { value: 'tsx', comment: '# 这里请勿修改' },
    NODE_ENV: { value: 'development', comment: '' }
  }

  /**
   * 懒加载
   * @param key 当前选中的Tab
   * @returns 懒加载的组件
   */
  const LazyLoad = (tab: string) => {
    if (tab === 'adapter') {
      const AdapterComponent = lazy(() => import('@/components/config/system/adapter')
        .then(module => ({
          default: () => module.getAdapterComponent(adapter, formRef)
        })))

      return <AdapterComponent />
    }

    if (tab === 'render') {
      const RenderComponent = lazy(() => import('@/components/config/system/render')
        .then(module => ({
          default: () => module.getRenderComponent(render, formRef)
        })))

      return <RenderComponent />
    }

    if (tab === 'config') {
      const ConfigComponent = lazy(() => import('@/components/config/system/config')
        .then(module => ({
          default: () => module.getConfigComponent(config, formRef)
        })))

      return <ConfigComponent />
    }

    if (tab === 'redis') {
      const RedisComponent = lazy(() => import('@/components/config/system/redis')
        .then(module => ({
          default: () => module.getRedisComponent(redis, formRef)
        })))

      return <RedisComponent />
    }

    if (tab === 'pm2') {
      const PM2Component = lazy(() => import('@/components/config/system/pm2')
        .then(module => ({
          default: () => module.getPm2Component(pm2, formRef)
        })))

      return <PM2Component />
    }

    if (tab === 'group') {
      const GroupComponent = lazy(() => import('@/components/config/system/group')
        .then(module => ({
          default: () => module.getGroupComponent(group, formRef)
        })))

      return <GroupComponent />
    }

    if (tab === 'private') {
      const PrivateComponent = lazy(() => import('@/components/config/system/private')
        .then(module => ({
          default: () => module.getPrivateComponent(privates, formRef)
        })))

      return <PrivateComponent />
    }

    if (tab === 'env') {
      const EnvComponent = lazy(() => import('@/components/config/system/env')
        .then(module => ({
          default: () => module.getEnvComponent(env, formRef)
        })))

      return <EnvComponent />
    }
  }

  return (
    <div className='p-4 space-y-4'>
      {/* 头部卡片 */}
      <Card className='p-6'>
        <div className='flex flex-col gap-2'>
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
      <Card className='p-0'>
        <Suspense fallback={<div>加载中...</div>}>
          <div key={refreshKey}>
            {LazyLoad(selectedTab)}
          </div>
        </Suspense>
      </Card>
    </div>
  )
}
