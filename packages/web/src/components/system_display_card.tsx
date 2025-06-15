import { Card, CardBody } from '@heroui/card'
import clsx from 'clsx'
import { BiSolidMemoryCard } from 'react-icons/bi'
import { GiCpu } from 'react-icons/gi'
import { HiServer } from 'react-icons/hi'
import { SiNodedotjs } from 'react-icons/si'
import { FiClock, FiUser, FiHardDrive, FiHome, FiChevronDown } from 'react-icons/fi'
import { MdNetworkCheck, MdMemory, MdSpeed, MdArchitecture } from 'react-icons/md'
import { BsWindows, BsApple } from 'react-icons/bs'
import { FaLinux, FaPercentage, FaHashtag } from 'react-icons/fa'
import { TbCpu } from 'react-icons/tb'
import { RiComputerLine } from 'react-icons/ri'
import { useState } from 'react'
import UsagePie from './usage_pie'
import type { SystemStatus } from '@/types/server'

export interface SystemStatusItemProps {
  title: string
  value?: string | number
  size?: 'md' | 'lg'
  unit?: string
  icon?: React.ReactNode
}

const SystemStatusItem: React.FC<SystemStatusItemProps> = ({ title, value = '-', size = 'md', unit, icon }) => {
  return (
    <div
      className={clsx(
        'bg-white/50 dark:bg-gray-800/30 rounded-lg p-3 shadow-sm border border-gray-100/50 dark:border-gray-700/30',
        'hover:shadow-md hover:bg-white/70 dark:hover:bg-gray-800/50 transition-all duration-200',
        size === 'lg' ? 'col-span-full' : 'col-span-1'
      )}
    >
      <div className={clsx('flex items-center', size === 'lg' ? 'justify-between' : 'flex-col gap-1.5')}>
        <div className='flex items-center gap-2 text-xs text-default-600 min-w-0 flex-shrink-0'>
          {icon && <span className='text-primary flex-shrink-0'>{icon}</span>}
          <span className='font-medium whitespace-nowrap'>{title}</span>
        </div>
        <div
          className={clsx(
            'text-sm font-semibold text-foreground min-w-0',
            size === 'lg' ? 'text-right' : 'text-center w-full'
          )}
        >
          <span className='truncate block'>{value}</span>
          {unit && <span className='text-xs text-default-400 ml-1 font-normal'>{unit}</span>}
        </div>
      </div>
    </div>
  )
}

export interface SystemStatusDisplayProps {
  data?: SystemStatus
}

const SystemStatusDisplay: React.FC<SystemStatusDisplayProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const memoryUsage = {
    system: 0,
    karin: 0,
  }
  if (data) {
    const system = Number(data.memory.total) || 1
    const systemUsage = Number(data.memory.usage.system)
    const karinUsage = Number(data.memory.usage.karin)
    memoryUsage.system = (systemUsage / system) * 100
    memoryUsage.karin = (karinUsage / system) * 100
  }

  /** 格式化运行时间 */
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}天 ${hours}小时 ${minutes}分钟`
  }

  /** 获取操作系统图标 */
  const getOSIcon = (platform?: string) => {
    switch (platform?.toLowerCase()) {
      case 'win32':
        return <BsWindows className='w-4 h-4' />
      case 'darwin':
        return <BsApple className='w-4 h-4' />
      case 'linux':
        return <FaLinux className='w-4 h-4' />
      default:
        return <RiComputerLine className='w-4 h-4' />
    }
  }

  return (
    <Card className='col-span-1 lg:col-span-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50'>
      <CardBody className='p-4 sm:p-6'>
        {/* 顶部标题区域 - 使用主题色 */}
        <div className='mb-6'>
          <h1 className='text-xl sm:text-2xl font-bold text-primary mb-2'>系统状态监控</h1>
          <p className='text-sm text-default-500'>实时系统资源使用情况</p>
        </div>

        {/* 图表区域 - 保持不变 */}
        <div className='mb-6'>
          <div className='flex flex-row gap-4 sm:gap-6 justify-center items-center min-h-[120px] sm:min-h-[140px]'>
            {/* CPU 图表 */}
            <div className='flex flex-col items-center flex-1 max-w-[120px] sm:max-w-[140px]'>
              <div className='w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32'>
                <UsagePie
                  systemUsage={Number(data?.cpu.usage.system) || 0}
                  processUsage={Number(data?.cpu.usage.karin) || 0}
                  title='CPU'
                />
              </div>
            </div>

            {/* 内存图表 */}
            <div className='flex flex-col items-center flex-1 max-w-[120px] sm:max-w-[140px]'>
              <div className='w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32'>
                <UsagePie systemUsage={memoryUsage.system} processUsage={memoryUsage.karin} title='内存' />
              </div>
            </div>
          </div>
        </div>

        {/* 信息网格 - 优化小屏幕布局 */}
        <div className='space-y-6'>
          {/* 核心系统信息 - 小屏幕优先显示 */}
          <section>
            <h2 className='text-lg font-bold flex items-center gap-2 text-primary mb-4'>
              <HiServer className='text-lg' />
              <span>系统信息</span>
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <SystemStatusItem
                title='主机名'
                value={data?.system?.hostname}
                icon={<HiServer className='w-4 h-4' />}
                size='lg'
              />
              <SystemStatusItem
                title='操作系统'
                value={data?.system?.osName}
                icon={getOSIcon(data?.system?.platform)}
              />
              <SystemStatusItem
                title='架构'
                value={data?.system?.arch}
                icon={<MdArchitecture className='w-4 h-4' />}
              />
              <SystemStatusItem
                title='运行时间'
                value={data?.system?.uptime ? formatUptime(data.system.uptime) : '-'}
                icon={<FiClock className='w-4 h-4' />}
              />
            </div>
          </section>

          {/* CPU 和内存信息 - 合并显示 */}
          <section>
            <h2 className='text-lg font-bold flex items-center gap-2 text-primary mb-4'>
              <GiCpu className='text-lg' />
              <span>硬件资源</span>
            </h2>

            {/* CPU 基本信息 */}
            <div className='mb-4'>
              <h3 className='text-sm font-semibold text-default-700 mb-3'>处理器</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                <SystemStatusItem
                  title='型号'
                  value={data?.cpu.model}
                  icon={<GiCpu className='w-4 h-4' />}
                  size='lg'
                />
                <SystemStatusItem
                  title='内核数'
                  value={data?.cpu.core}
                  icon={<TbCpu className='w-4 h-4' />}
                />
                <SystemStatusItem
                  title='主频'
                  value={data?.cpu.speed}
                  unit='GHz'
                  icon={<MdSpeed className='w-4 h-4' />}
                />
                <SystemStatusItem
                  title='系统占用'
                  value={data?.cpu.usage.system}
                  unit='%'
                  icon={<FaPercentage className='w-4 h-4' />}
                />
              </div>
            </div>

            {/* 内存基本信息 */}
            <div>
              <h3 className='text-sm font-semibold text-default-700 mb-3'>内存</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                <SystemStatusItem
                  title='总容量'
                  value={data?.memory.total}
                  unit='MB'
                  icon={<BiSolidMemoryCard className='w-4 h-4' />}
                />
                <SystemStatusItem
                  title='系统使用'
                  value={data?.memory.usage.system}
                  unit='MB'
                  icon={<MdMemory className='w-4 h-4' />}
                />
                <SystemStatusItem
                  title='Karin使用'
                  value={data?.memory.usage.karin}
                  unit='MB'
                  icon={<MdMemory className='w-4 h-4' />}
                />
                <SystemStatusItem
                  title='使用率'
                  value={Math.round(memoryUsage.system + memoryUsage.karin)}
                  unit='%'
                  icon={<FaPercentage className='w-4 h-4' />}
                />
              </div>
            </div>
          </section>

          {/* Node.js 进程信息 - 简化显示 */}
          <section>
            <h2 className='text-lg font-bold flex items-center gap-2 text-primary mb-4'>
              <SiNodedotjs className='text-lg' />
              <span>进程信息</span>
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
              <SystemStatusItem
                title='Node.js版本'
                value={data?.process?.nodeVersion}
                icon={<SiNodedotjs className='w-4 h-4' />}
              />
              <SystemStatusItem
                title='进程ID'
                value={data?.process?.pid}
                icon={<FaHashtag className='w-4 h-4' />}
              />
              <SystemStatusItem
                title='运行时间'
                value={data?.process?.uptime ? formatUptime(data.process.uptime) : '-'}
                icon={<FiClock className='w-4 h-4' />}
              />
              <SystemStatusItem
                title='用户'
                value={data?.process?.user?.username}
                icon={<FiUser className='w-4 h-4' />}
              />
            </div>
          </section>

          {/* 详细信息 - 简洁的展开按钮 */}
          <div className='border-t border-divider pt-4'>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-600 transition-colors duration-200'
            >
              <FiChevronDown
                className={clsx(
                  'w-4 h-4 transition-transform duration-300 ease-in-out',
                  isExpanded ? 'rotate-180' : 'rotate-0'
                )}
              />
              <span>{isExpanded ? '收起详细信息' : '显示详细信息'}</span>
            </button>

            <div
              className={clsx(
                'overflow-hidden transition-all duration-500 ease-in-out',
                isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
              )}
            >
              <div className='space-y-6'>
                {/* 详细内存信息 */}
                <div className='transform transition-all duration-300 ease-in-out' style={{ transitionDelay: isExpanded ? '100ms' : '0ms' }}>
                  <h3 className='text-sm font-semibold text-default-700 mb-3 flex items-center gap-2'>
                    <BiSolidMemoryCard className='w-4 h-4 text-primary' />
                    内存详情
                  </h3>
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                    <SystemStatusItem
                      title='RSS'
                      value={data?.memory.details?.rss}
                      unit='MB'
                      icon={<MdMemory className='w-4 h-4' />}
                    />
                    <SystemStatusItem
                      title='堆总量'
                      value={data?.memory.details?.heapTotal}
                      unit='MB'
                      icon={<MdMemory className='w-4 h-4' />}
                    />
                    <SystemStatusItem
                      title='堆使用'
                      value={data?.memory.details?.heapUsed}
                      unit='MB'
                      icon={<MdMemory className='w-4 h-4' />}
                    />
                    <SystemStatusItem
                      title='外部内存'
                      value={data?.memory.details?.external}
                      unit='MB'
                      icon={<MdMemory className='w-4 h-4' />}
                    />
                  </div>
                </div>

                {/* 系统路径信息 */}
                <div className='transform transition-all duration-300 ease-in-out' style={{ transitionDelay: isExpanded ? '200ms' : '0ms' }}>
                  <h3 className='text-sm font-semibold text-default-700 mb-3 flex items-center gap-2'>
                    <FiHardDrive className='w-4 h-4 text-primary' />
                    系统路径
                  </h3>
                  <div className='grid grid-cols-1 gap-3'>
                    <SystemStatusItem
                      title='临时目录'
                      value={data?.system?.tmpdir}
                      icon={<FiHardDrive className='w-4 h-4' />}
                      size='lg'
                    />
                    <SystemStatusItem
                      title='用户主目录'
                      value={data?.system?.homedir}
                      icon={<FiHome className='w-4 h-4' />}
                      size='lg'
                    />
                  </div>
                </div>

                {/* 网络信息 */}
                {data?.network?.interfaces && Object.keys(data.network.interfaces).length > 0 && (
                  <div className='transform transition-all duration-300 ease-in-out' style={{ transitionDelay: isExpanded ? '300ms' : '0ms' }}>
                    <h3 className='text-sm font-semibold text-default-700 mb-3 flex items-center gap-2'>
                      <MdNetworkCheck className='w-4 h-4 text-primary' />
                      网络接口
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                      {Object.entries(data.network.interfaces).slice(0, 2).map(([name, interfaces]) => (
                        <SystemStatusItem
                          key={name}
                          title={name}
                          value={Array.isArray(interfaces) && interfaces.length > 0
                            ? interfaces.find(iface => iface.family === 'IPv4')?.address || '无IPv4地址'
                            : '无地址'}
                          icon={<MdNetworkCheck className='w-4 h-4' />}
                          size='lg'
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default SystemStatusDisplay
