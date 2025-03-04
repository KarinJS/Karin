import { Card } from '@heroui/card'
import toast from 'react-hot-toast'
import { request } from '@/lib/request'
import { Tabs, Tab } from '@heroui/tabs'
import { Button } from '@heroui/button'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
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

export type ConfigType = 'config' | 'env' | 'adapter' | 'groups' | 'privates' | 'render' | 'redis' | 'pm2'

// Tab项配置
const tabItems = [
  { key: 'config', icon: Settings, label: '基本配置' },
  { key: 'env', icon: Settings2, label: '环境变量' },
  { key: 'adapter', icon: Plug, label: '适配器' },
  { key: 'groups', icon: Users, label: '群聊频道' },
  { key: 'privates', icon: MessageSquare, label: '好友私信' },
  { key: 'render', icon: Palette, label: '渲染器' },
  { key: 'redis', icon: Database, label: 'Redis' },
  { key: 'pm2', icon: Server, label: 'PM2' },
]

/**
 * 加载状态组件
 */
const LoadingState = () => (
  <div className='flex flex-col items-center justify-center p-8 space-y-4'>
    <div className='relative w-12 h-12'>
      <div className='absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full animate-ping opacity-75' />
      <div className='absolute top-0 left-0 w-full h-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin' />
    </div>
    <p className='text-gray-600 animate-pulse'>正在加载配置...</p>
  </div>
)

export default function TestPage () {
  const { tab } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedTab, setSelectedTab] = useState(tab || 'config')
  const [refreshKey, setRefreshKey] = useState(0)
  /** 跟踪滚动容器 用于移动端 */
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  /** 存储滚动位置 用于移动端 */
  const scrollPositionRef = useRef(0)
  /** 表单引用 用于触发适配器组件中的表单提交 */
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  // 添加错误状态管理
  const [error, setError] = useState<string | null>(null)

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

    // 获取当前路径的基础部分
    const basePath = location.pathname.split('/')[1]
    // 更新 URL,使用动态的基础路径
    navigate(`/${basePath}/${key}`)
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
   * 获取指定类型的配置数据
   * @param type 配置类型
   */
  const fetchConfig = async <T = any> (type: string): Promise<T> => {
    setLoading(true)
    setError(null) // 重置错误状态
    try {
      const response = await request.serverPost<Record<string, any>, { type: string }>(
        '/api/v1/config/new/get',
        { type }
      )
      return response as T
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载配置失败'
      setError(errorMessage)
      toast.error(`配置加载失败: ${errorMessage}`)
      throw err // 继续抛出错误，以便LazyLoad可以捕获
    } finally {
      setLoading(false)
    }
  }

  /**
   * 触发表单提交保存
   */
  const handleSaveClick = async () => {
    formRef.current!.requestSubmit()
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

  /**
   * 懒加载
   * @param tab 当前选中的Tab
   * @returns 懒加载的组件
   */
  const LazyLoad = (tab: string) => {
    // 提前定义组件导入函数，但不立即执行
    const getComponent = (configType: ConfigType) => {
      const componentMap = {
        config: () => import('@/components/config/system/config'),
        env: () => import('@/components/config/system/env'),
        adapter: () => import('@/components/config/system/adapter'),
        render: () => import('@/components/config/system/render'),
        redis: () => import('@/components/config/system/redis'),
        pm2: () => import('@/components/config/system/pm2'),
        groups: () => import('@/components/config/system/group'),
        privates: () => import('@/components/config/system/private')
      }

      return componentMap[configType] || null
    }

    // 使用useEffect来控制数据获取和组件加载
    const [configData, setConfigData] = useState<any>(null)
    const [dataLoaded, setDataLoaded] = useState(false)

    // 确保只在组件挂载时或tab变化时执行一次数据获取
    useEffect(() => {
      // 重置状态
      setDataLoaded(false)
      setConfigData(null)

      // 先获取数据
      fetchConfig(tab)
        .then(data => {
          setConfigData(data)
          setDataLoaded(true)
        })
        .catch(() => {
          // 错误已经在fetchConfig中处理和设置
          setDataLoaded(false)
        })
    }, [tab]) // 当tab变化时重新获取数据

    if (loading) {
      return <LoadingState />
    }

    if (error) {
      return (
        <div className='p-4 text-danger'>
          <h3 className='font-bold'>加载失败</h3>
          <p>{error}</p>
          <Button
            color='primary'
            className='mt-4'
            onPress={() => {
              setError(null)
              setRefreshKey(prev => prev + 1)
            }}
          >
            重试
          </Button>
        </div>
      )
    }

    // 数据加载成功后，再懒加载组件
    if (!dataLoaded) {
      return (
        <div className='flex flex-col items-center justify-center p-8 space-y-4'>
          <div className='relative w-12 h-12'>
            <div className='absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full animate-ping opacity-75' />
            <div className='absolute top-0 left-0 w-full h-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin' />
          </div>
          <p className='text-gray-600 animate-pulse'>正在准备配置数据...</p>
        </div>
      )
    }

    // 确保类型安全的组件加载
    const loadComponentWithData = () => {
      const importFn = getComponent(tab as ConfigType)

      if (!importFn) {
        return Promise.resolve({
          default: () => <div className='p-4'>未知的配置类型</div>
        })
      }

      return importFn().then(module => {
        return {
          default: () => module.default(configData, formRef)
        }
      })
    }

    const DynamicComponent = lazy(loadComponentWithData)

    return <DynamicComponent />
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
        <Suspense fallback={<LoadingState />}>
          <div key={refreshKey}>
            {LazyLoad(selectedTab)}
          </div>
        </Suspense>
      </Card>
    </div>
  )
}
