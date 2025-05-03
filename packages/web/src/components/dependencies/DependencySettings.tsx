import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { Divider } from '@heroui/divider'
import { Input } from '@heroui/input'
import { Spinner } from '@heroui/spinner'
import { Tooltip } from '@heroui/tooltip'
import { getNpmLink } from '../../pages/dashboard/dependencies/dependencies.utils'
import { memo, useState, useCallback, useEffect } from 'react'
import { LuSearch, LuMaximize2, LuPackage, LuPlug } from 'react-icons/lu'
import { raceRequest } from '@/request/base'
import { toast } from 'react-hot-toast'
import type { Dependency } from 'node-karin'
import { hideRocket, showRocket } from '../common/ScrollToTop.utils'

/**
 * 比较两个版本号
 * @param v1 版本号1
 * @param v2 版本号2
 * @returns 如果v1 > v2，返回1；如果v1 < v2，返回-1；如果v1 === v2，返回0
 */
function compareVersions (v1: string, v2: string): number {
  const v1Parts = v1.split('.').map(Number)
  const v2Parts = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0
    const v2Part = v2Parts[i] || 0

    if (v1Part > v2Part) return 1
    if (v1Part < v2Part) return -1
  }

  return 0
}

interface DependencySettingsProps {
  isOpen: boolean
  onClose: () => void
  dependency: Dependency | null
  selectedVersion: string
  setSelectedVersion: (version: string) => void
  onSave: () => void
  onSelectDependency?: (name: string, isSelected: boolean) => void
}

/**
 * 阻止事件冒泡
 * @param e 事件对象
 */
const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
  e.stopPropagation()
}

/**
 * 传入一个npm包名，返回所有版本
 * @param packageName 包名
 * @returns 按发布时间排序的所有版本
 */
const getNpmVersions = async (packageName: string): Promise<string[]> => {
  const response = await raceRequest<Record<string, any>>([
    `https://registry.npmmirror.com/${packageName}`,
    `https://registry.npmjs.com/${packageName}`,
    `https://mirrors.cloud.tencent.com/npm/${packageName}`,
  ], {
    method: 'GET',
    timeout: 5000,
  })

  if (response?.status !== 200) return []

  /** Object.keys会乱序 */
  if (response.data.time) {
    return Object.keys(response.data.time)
      .filter(key => key !== 'created' && key !== 'modified' && response.data.versions[key])
      .sort((a, b) => {
        return new Date(response.data.time[b]).getTime() - new Date(response.data.time[a]).getTime()
      })
  }

  return Object.keys(response.data.versions)
}

/**
 * 依赖设置模态框组件
 */
const DependencySettings = memo(({
  isOpen, onClose, dependency, selectedVersion, setSelectedVersion, onSave, onSelectDependency,
}: DependencySettingsProps) => {
  if (!dependency) return null

  /** 输入的自定义版本 */
  const [customVersion, setCustomVersion] = useState('')
  /** 可用版本列表 */
  const [versions, setVersions] = useState<string[]>([])
  /** 查询loading状态 */
  const [isLoading, setIsLoading] = useState(false)
  /** 是否已查询过 */
  const [hasSearched, setHasSearched] = useState(false)
  /** 是否显示全屏模态框 - PC端默认全屏 */
  const [isMaximized, setIsMaximized] = useState(window && window.innerWidth > 768)
  /** 是否选择了新版本 */
  const versionChanged = selectedVersion !== dependency.current

  /** 小火箭隐藏显示控制 */
  useEffect(() => {
    isOpen ? hideRocket() : showRocket()
  }, [isOpen])

  // 依赖切换时重置实时数据
  useEffect(() => {
    // 每当依赖对象变化时，重置查询状态
    setVersions([])
    setHasSearched(false)
    setCustomVersion('')
  }, [dependency?.name]) // 只监听依赖名称的变化

  /**
   * 处理版本选择
   * @param version 选择的版本
   */
  const handleVersionSelect = (version: string) => {
    // 如果已经选择的版本与点击的版本相同，则取消选择
    if (selectedVersion === version) {
      setSelectedVersion(dependency.current) // 重置为当前版本
      setCustomVersion('')

      // 如果提供了选择依赖的函数，则取消选中
      if (onSelectDependency) {
        onSelectDependency(dependency.name, false)
      }
    } else {
      setSelectedVersion(version)
      setCustomVersion(version)

      // 如果提供了选择依赖的函数，且选择的版本不是当前版本，则自动选中该依赖
      if (onSelectDependency && version !== dependency.current) {
        onSelectDependency(dependency.name, true)
      }
    }
  }

  /**
   * 处理自定义版本改变
   */
  const handleCustomVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomVersion(value)

    // 如果输入的值不为空，则自动设置为当前选择的版本
    if (value.trim()) {
      setSelectedVersion(value.trim())

      // 自动选中当前依赖
      if (onSelectDependency && value.trim() !== dependency.current) {
        onSelectDependency(dependency.name, true)
      }
    }
  }

  /**
   * 处理版本查询
   */
  const handleSearch = useCallback(async () => {
    if (!dependency) return

    setIsLoading(true)
    try {
      const list = await getNpmVersions(dependency.name)
      setVersions(list)
      setHasSearched(true)
    } catch (error) {
      toast.error('查询版本失败')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [dependency])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop='blur'
      radius='lg'
      classNames={{
        base: `border border-default-100 mx-auto max-h-[70vh] md:max-h-none w-[95%] ${isMaximized ? 'md:w-[90%] xl:w-[85%]' : 'md:w-auto'}`,
        header: 'border-b border-default-100 p-4',
        body: 'p-4 overflow-y-auto',
        footer: 'border-t border-default-100 p-4 sticky bottom-0 bg-background',
        closeButton: 'hover:bg-default-100',
      }}
      size={isMaximized ? '5xl' : 'md'}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1 pb-3 md:pb-4'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between w-full'>
            <div className='flex items-center gap-2'>
              {dependency.isKarinPlugin
                ? (
                  <div className='bg-emerald-100 dark:bg-emerald-800/30 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-md flex-shrink-0 border border-emerald-200 dark:border-emerald-700/50'>
                    <LuPlug size={20} className='drop-shadow-sm' />
                  </div>)
                : (
                  <div className='bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-1.5 rounded-md flex-shrink-0 border border-blue-200 dark:border-blue-800/50'>
                    <LuPackage size={20} className='drop-shadow-sm' />
                  </div>)}
              <div className='text-lg md:text-xl font-light tracking-tight'>{dependency.name}</div>
            </div>
            <div className='flex items-center gap-3 mt-3 md:mt-0'>
              {/* 各种外部链接图标，包含全屏按钮 */}
              <Tooltip content='在 npmjs.com 上查看' placement='top'>
                <Link
                  href={getNpmLink(dependency.name)}
                  isExternal
                  showAnchorIcon={false}
                  className='text-default-500 hover:text-red-500 flex items-center'
                  onClick={stopPropagation}
                >
                  {/* npm 官方红色图标 */}
                  <svg width='18' height='18' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid'>
                    <path d='M0 256V0h256v256z' fill='#C12127' />
                    <path d='M48 48h160v160h-32V80h-48v128H48z' fill='#FFF' />
                  </svg>
                </Link>
              </Tooltip>

              <Tooltip content='在 npmmirror.com 上查看' placement='top'>
                <Link
                  href={`https://npmmirror.com/package/${dependency.name}`}
                  isExternal
                  showAnchorIcon={false}
                  className='text-default-500 hover:text-blue-500 flex items-center'
                  onClick={stopPropagation}
                >
                  {/* npmmirror 图标 */}
                  <img
                    src='https://npmmirror.com/cnpm.png'
                    alt='npmmirror'
                    className='w-5 h-5'
                  />
                </Link>
              </Tooltip>

              <Tooltip content='查看包大小 (pkg-size.dev)' placement='top'>
                <Link
                  href={`https://pkg-size.dev/${dependency.name}`}
                  isExternal
                  showAnchorIcon={false}
                  className='text-default-500 hover:text-primary flex items-center'
                  onClick={stopPropagation}
                >
                  <img
                    src='https://pkg-size.dev/favicon.svg'
                    alt='pkg-size'
                    className='w-5 h-5'
                  />
                </Link>
              </Tooltip>

              <Tooltip content='查看依赖图 (node-modules.dev)' placement='top'>
                <Link
                  href={`https://node-modules.dev/${dependency.name}`}
                  isExternal
                  showAnchorIcon={false}
                  className='text-default-500 hover:text-primary flex items-center'
                  onClick={stopPropagation}
                >
                  <img
                    src='https://node-modules.dev/favicon.svg'
                    alt='node-modules'
                    className='w-5 h-5'
                  />
                </Link>
              </Tooltip>

              <Tooltip content={isMaximized ? '退出全屏' : '全屏显示'} placement='top'>
                <Button
                  isIconOnly
                  size='sm'
                  variant='light'
                  onPress={() => {
                    console.log('全屏状态切换:', !isMaximized)
                    setIsMaximized(!isMaximized)
                  }}
                  className='text-default-500 hover:text-primary min-w-0 w-8 h-8 mr-8'
                >
                  {isMaximized
                    ? (
                      <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M8 3v4a1 1 0 0 1-1 1H3' />
                        <path d='M21 8h-4a1 1 0 0 1-1-1V3' />
                        <path d='M3 16h4a1 1 0 0 1 1 1v4' />
                        <path d='M16 21v-4a1 1 0 0 1 1-1h4' />
                      </svg>)
                    : (<LuMaximize2 size={18} />)}
                </Button>
              </Tooltip>
            </div>
          </div>
        </ModalHeader>

        <Divider className='opacity-50' />

        <ModalBody className='py-3 md:py-4 space-y-4 md:space-y-5'>
          {/* 第一部分：当前信息 - 简化为键值对形式 */}
          <div className='bg-default-50 p-3 md:p-4 rounded-lg border border-default-200/60 dark:border-default-700/50'>
            <div className='text-xs md:text-sm text-default-600 font-medium mb-3'>当前信息</div>
            <div className='space-y-2'>
              <div className='flex'>
                <span className='text-default-500 text-xs w-24'>当前版本:</span>
                <span className='font-mono text-xs'>{dependency.current}</span>
              </div>
              <div className='flex'>
                <span className='text-default-500 text-xs w-24'>最新版本:</span>
                <span className='font-mono text-xs'>
                  {dependency.latest && dependency.latest.length > 0 ? dependency.latest[dependency.latest.length - 1] : '未知'}
                </span>
              </div>
              <div className='flex'>
                <span className='text-default-500 text-xs w-24'>package.json:</span>
                <span className={`font-mono text-xs ${dependency.packageValue ? '' : 'text-default-400 italic'}`}>
                  {dependency.packageValue || '未定义'}
                </span>
              </div>
              <div className='flex'>
                <span className='text-default-500 text-xs w-24'>依赖类型:</span>
                <span className='text-xs'>{dependency.type || '未知'}</span>
              </div>
              <div className='flex'>
                <span className='text-default-500 text-xs w-24'>包类型:</span>
                <span className={`text-xs ${dependency.isKarinPlugin
                  ? 'text-success-600 dark:text-success-400'
                  : ''
                  }`}
                >
                  {dependency.isKarinPlugin ? 'Karin 插件' : 'npm 包'}
                </span>
              </div>
              <div className='flex'>
                <span className='text-default-500 text-xs w-24'>更新状态:</span>
                <span className='text-xs'>
                  {dependency.latest && dependency.latest.length > 0 &&
                    compareVersions(dependency.current, dependency.latest[dependency.latest.length - 1]) < 0
                    ? <span className='text-warning-600'>可更新</span>
                    : dependency.latest && dependency.latest.length > 0 &&
                      compareVersions(dependency.current, dependency.latest[dependency.latest.length - 1]) > 0
                      ? <span className='text-blue-600'>高于最新版</span>
                      : <span className='text-success-600'>最新</span>}
                </span>
              </div>
            </div>
          </div>

          {/* 第二部分：自定义版本输入和版本查询 */}
          <div className='bg-default-50 p-3 md:p-4 rounded-lg border border-default-200/60 dark:border-default-700/50'>
            <div className='text-xs md:text-sm text-default-600 font-medium mb-3'>自定义版本</div>
            <div className='flex gap-2'>
              <Input
                placeholder='输入版本号，例如：1.0.0'
                value={customVersion}
                onChange={handleCustomVersionChange}
                size='sm'
                color='primary'
                className='font-light font-mono flex-1'
              />
              <Button
                color='primary'
                size='sm'
                radius='md'
                isLoading={isLoading}
                startContent={!isLoading && <LuSearch size={16} />}
                onPress={handleSearch}
              >
                查询版本
              </Button>
            </div>
          </div>

          {/* 第三部分：版本选择列表 */}
          <div className='bg-default-50 p-3 md:p-4 rounded-lg border border-default-200/60 dark:border-default-700/50'>
            <div className='flex items-center justify-between mb-3'>
              <div className='text-xs md:text-sm text-default-600 font-medium'>
                可用版本列表
                <span className='ml-1 text-xs'>
                  ({
                    hasSearched
                      ? <span className='text-blue-500 dark:text-blue-400 font-medium'>当前为实时数据</span>
                      : <span className='text-amber-500 dark:text-amber-400 font-medium'>当前为缓存版本</span>
                  })
                </span>
              </div>
              {(hasSearched || dependency.latest.length > 0) && (
                <div className='text-xs text-default-400'>
                  共 {hasSearched ? versions.length : dependency.latest.length} 个版本
                </div>
              )}
            </div>

            {isLoading
              ? (
                <div className='flex items-center justify-center p-6 bg-white/50 dark:bg-black/10 rounded-md border border-default-200/50 dark:border-default-700/40'>
                  <Spinner size='sm' color='primary' />
                  <span className='ml-2 text-sm text-default-500'>正在加载版本信息...</span>
                </div>)
              : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 md:gap-2 max-h-48 overflow-y-auto p-3 bg-white/50 dark:bg-black/10 rounded-md border border-default-200/50 dark:border-default-700/40'>
                  {(hasSearched ? versions : [...dependency.latest].reverse()).map((version) => (
                    <Button
                      key={version}
                      variant={selectedVersion === version ? 'solid' : 'flat'}
                      color={selectedVersion === version ? 'primary' : 'default'}
                      className='font-mono text-xs md:text-sm justify-start px-2 md:px-3 h-7 md:h-8 min-h-0'
                      size='sm'
                      radius='md'
                      onPress={() => handleVersionSelect(version)}
                    >
                      {version}
                    </Button>
                  ))}
                </div>)}
          </div>
        </ModalBody>

        <Divider className='opacity-50' />

        <ModalFooter className='flex justify-between items-center'>
          {versionChanged && (
            <div className='flex items-center gap-2 text-xs'>
              <code className='font-mono text-xs bg-primary-50/80 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400/90 px-1.5 py-0.5 rounded'>{dependency.current}</code>
              <span className='text-primary-400'>→</span>
              <code className='font-mono text-xs bg-primary-50/80 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400/90 px-1.5 py-0.5 rounded'>{selectedVersion}</code>
            </div>
          )}
          <div className='flex ml-auto gap-2'>
            <Button
              color='default'
              variant='light'
              onPress={onClose}
              radius='full'
              className='font-normal text-xs md:text-sm'
              size='sm'
            >
              取消
            </Button>
            <Button
              color='primary'
              onPress={onSave}
              isDisabled={selectedVersion === dependency.current}
              radius='full'
              className='font-normal text-xs md:text-sm'
              size='sm'
            >
              应用更改
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
})

DependencySettings.displayName = 'DependencySettings'

export default DependencySettings
