import clsx from 'clsx'
import { Icon } from './ui/icon'
import toast from 'react-hot-toast'
import { Button } from '@heroui/button'
import { IoMenu } from 'react-icons/io5'
import { LuLogIn } from 'react-icons/lu'
import { Spinner } from '@heroui/spinner'
import { useTheme } from '@/hooks/use-theme'
import { FaChevronRight } from 'react-icons/fa6'
import { useMediaQuery } from 'react-responsive'
import { Moon, Sun } from 'lucide-react'
import { RiMenuUnfold2Line, RiRefreshLine } from 'react-icons/ri'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { Fragment, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig, initSiteConfig } from '@/config/site'
import { useLocation, useNavigate } from 'react-router-dom'
import TextPressure from './TextPressure'
import useDialog from '@/hooks/use-dialog'

const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
    },
  },
}

const subMenuVariants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      type: 'tween',
      ease: [0.00, 0.00, 0.00, 1.00],
      duration: 0.3,
    },
  },
}

export interface MenuButtonProps {
  isCollapsed: boolean
  children: React.ReactNode
}
interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar ({ isOpen, onToggle }: SidebarProps) {
  const isNotSmallScreen = useMediaQuery({ minWidth: 768 })
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [pluginsLoading, setPluginsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { toggleTheme, isDark } = useTheme()
  const dialog = useDialog()

  useEffect(() => {
    loadPlugins()
  }, [])

  /** 加载插件列表 */
  const loadPlugins = async (isRefresh = false) => {
    setPluginsLoading(true)
    try {
      await initSiteConfig(isRefresh)
      if (isRefresh) {
        toast.success('插件列表刷新成功')
      }
    } catch (error) {
      toast.error('加载插件列表失败')
      console.error(error)
    } finally {
      setPluginsLoading(false)
    }
  }

  useEffect(() => {
    siteConfig.navItems.forEach((item) => {
      // 检查一级菜单
      if (location.pathname === item.href) {
        setExpandedMenu(item.href)
        return
      }

      // 检查二级菜单
      if (item.children?.some(child => location.pathname === child.href || location.pathname.includes(child.id))) {
        setExpandedMenu(item.href)
      }
    })
  }, [location.pathname])

  /** 退出登录 */
  const signOut = async () => {
    dialog.confirm({
      title: '注销',
      content: '确认注销此次登录吗？注销后需要重新登录',
      onConfirm: async () => {
        try {
          localStorage.removeItem('userId')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          toast.success('退出登录成功！')
          navigate('/login')
        } catch (e) {
          toast.error('退出登录失败！')
        }
      },
    })
  }

  return (
    <>
      <motion.div
        className={clsx(
          'overflow-hidden fixed top-0 left-0 h-full z-50',
          'md:static',
          'bg-neutral-200 dark:bg-neutral-800',
          'rounded-r-md md:rounded-none'
        )}
        initial={{ width: 0 }}
        animate={{ width: isOpen ? (isNotSmallScreen && isCollapsed ? 72 : 240) : 0 }}
        transition={{
          type: 'tween',
          duration: 0.3,
          ease: [0.00, 0.00, 0.00, 1.00],
        }}
        style={{ overflow: 'hidden' }}
      >
        <motion.div
          className={clsx(
            'h-full bg-neutral-100 dark:bg-neutral-800',
            'flex flex-col gap-6 overflow-hidden pt-4 touch-none'
          )}
          onTouchStart={(e) => e.stopPropagation()} // 阻止事件冒泡
        >
          {/* Logo 相关代码 */}
          {!isCollapsed && (
            <div style={{ position: 'relative' }}>
              <TextPressure
                text='Karin!'
                alpha={false}
                stroke={false}
                weight
                italic
                strokeColor='#ff0000'
              />
            </div>
          )}

          {/* 导航菜单 */}
          <div
            className={clsx(
              'flex-1 p-2 pt-[1px] flex flex-col gap-2 overflow-y-auto hide-scrollbar',
              isCollapsed ? 'px-1' : 'px-4'
            )}
          >
            <ScrollShadow hideScrollBar>
              <AnimatePresence>
                {siteConfig.navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={menuItemVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={clsx(
                        'mb-2 my-1 block text-default-600 hover:text-primary rounded-xl transition-all cursor-default md:cursor-pointer group',
                        isCollapsed ? 'mx-auto' : 'mx-1',
                        {
                          '!text-primary font-medium': (() => {
                            // 检查一级菜单直接匹配
                            if (location.pathname === item.href) return true
                            if (item.children?.some(child => location.pathname === child.href || location.pathname.includes(child.id))) return true
                            return false
                          })(),
                        }
                      )}
                    >
                      <motion.div
                        className={clsx(
                          'flex items-center overflow-hidden relative',
                          isCollapsed ? 'justify-center py-1.5' : 'justify-between py-2.5' // 改为justify-between
                        )}
                        initial={{
                          paddingLeft: isCollapsed ? 0 : 16,
                          paddingRight: isCollapsed ? 0 : 16,
                        }}
                        animate={{
                          paddingLeft: isCollapsed ? 0 : 16,
                          paddingRight: isCollapsed ? 0 : 16,
                        }}
                        whileHover={{ x: isCollapsed ? 0 : 4 }}
                        onClick={() => {
                          navigate(item.href)
                        }}
                      >
                        {/* 左侧图标和标题区域 */}
                        <div className='flex items-center gap-4'>
                          <motion.div
                            className='relative z-10'
                            initial={{
                              fontSize: isCollapsed ? '1.875rem' : '1.625rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            animate={{
                              fontSize: isCollapsed ? '1.875rem' : '1.625rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 300,
                              damping: 25,
                              duration: 0.3,
                            }}
                            whileHover={{ scale: 1.1 }}
                          >
                            <item.Icon />
                          </motion.div>

                          {!isCollapsed && (
                            <motion.div
                              className='whitespace-nowrap overflow-hidden text-base relative z-10 flex items-center gap-2'
                            >
                              <span className='select-none '>{item.label}</span>
                              {item.href === '/plugins-dashboard' && pluginsLoading && (
                                <Spinner className='w-10 h-4 text-primary' variant='wave' size='md' />
                              )}
                            </motion.div>
                          )}
                        </div>

                        {/* 右侧箭头区域 */}
                        {!isCollapsed && item.href === '/plugins-dashboard' && item.children && (
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: expandedMenu === item.href ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => {
                              e.stopPropagation() // 阻止冒泡，避免触发父元素的点击
                              setExpandedMenu(expandedMenu === item.href ? null : item.href)
                            }}
                            className='cursor-pointer p-1'
                          >
                            <FaChevronRight className='w-2.5 h-2.5' />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* 子菜单 - 只在展开时显示 */}
                      {item.children && !isCollapsed && (
                        <AnimatePresence>
                          {expandedMenu === item.href && (
                            <motion.div
                              variants={subMenuVariants}
                              initial='hidden'
                              animate='visible'
                              exit='hidden'
                              className='overflow-hidden mx-2'
                            >
                              {/* 刷新按钮 - 仅在插件管理中显示 */}
                              {item.href === '/plugins-dashboard' && (
                                <Button
                                  variant='light'
                                  size='sm'
                                  fullWidth
                                  className='flex items-center justify-start gap-3 py-2 px-3 mb-2 text-sm text-default-600 hover:text-primary transition-transform hover:-translate-y-[2px]'
                                  isDisabled={pluginsLoading}
                                  onPress={() => loadPlugins(true)}
                                >
                                  <div className='flex items-center gap-3'>
                                    <RiRefreshLine
                                      className={clsx('w-4 h-4 flex-shrink-0',
                                        pluginsLoading ? 'animate-spin text-primary' : ''
                                      )}
                                    />
                                    <span>刷新插件列表</span>
                                  </div>
                                </Button>
                              )}

                              {pluginsLoading && item.href === '/plugins-dashboard'
                                ? (
                                  <div className='flex items-center justify-center py-4'>
                                    <Spinner className='w-2 h-4 text-primary' variant='dots' size='lg' />
                                  </div>
                                )
                                : (
                                  item.children
                                    .sort((a, b) => (a.label || a.id).localeCompare(b.label || b.id))
                                    .map((child) => (
                                      <Fragment key={child.id}>
                                        <Button
                                          variant='light'
                                          fullWidth
                                          className={clsx(
                                            'flex items-center justify-start gap-3 py-2 px-3 mb-2 text-sm text-default-600 hover:text-primary',
                                            'transition-transform hover:-translate-y-[2px]',
                                            {
                                              '!text-primary glass-effect': location.pathname === child.href || location.pathname.includes(child.id),
                                            }
                                          )}
                                          onPress={() => {
                                            if (child.hasConfig) {
                                              /** 增加小延迟提供更好的视觉反馈 */
                                              setTimeout(() => {
                                                navigate(`/plugins/config?name=${child.id}`)
                                              }, 150)
                                            } else {
                                              toast.error(`插件 "${child.label || child.id}" 暂未提供可配置选项`)
                                            }
                                          }}
                                        >
                                          <div className='flex items-center gap-3'>
                                            {child.icon && <Icon name={child.icon.name || ''} size={child.icon.size || 20} color={child.icon.color || 'currentColor'} className='flex-shrink-0' />}
                                            <span>{child.label || child.id}</span>
                                          </div>
                                        </Button>
                                      </Fragment>
                                    ))
                                )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollShadow>
          </div>

          {/* 底部按钮 */}
          <div className={clsx(
            'flex-grow-0 flex-shrink-0 py-2 mb-2 flex flex-col gap-4',
            isCollapsed ? 'px-2 items-center' : 'px-4'
          )}
          >
            {/* PC端折叠按钮 - 添加蓝色主题 */}
            {isNotSmallScreen && (
              <Button
                variant='light'
                color='primary'
                radius='full'
                className='w-full flex items-center justify-center gap-2 glass-effect'
                isIconOnly={isCollapsed}
                onPress={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed
                  ? <RiMenuUnfold2Line className='w-5 h-5' />
                  : (
                    <>
                      <IoMenu className='w-5 h-5' />
                      <span>收起侧边栏</span>
                    </>
                  )}
              </Button>
            )}

            {/* 主题切换按钮 - 使用自定义Button实现 */}
            <Button
              startContent={
                !isDark
                  ? <Moon className='w-5 h-5' />
                  : <Sun className='w-5 h-5' />
              }
              radius='full'
              variant='light'
              color='primary'
              className='w-full flex items-center justify-center gap-2 glass-effect'
              isIconOnly={isCollapsed}
              onPress={toggleTheme}
            >
              {!isCollapsed && (
                !isDark
                  ? '深色模式'
                  : '浅色模式'
              )}
            </Button>

            {/* 退出登录按钮 */}
            <Button
              startContent={<LuLogIn className='w-5 h-5' />}
              radius='full'
              variant='light'
              color='primary'
              className='w-full flex items-center justify-center gap-2 glass-effect'
              isIconOnly={isCollapsed}
              onPress={signOut}
            >
              {!isCollapsed && '退出登录'}
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* 移动端遮罩层 */}
      {!isNotSmallScreen && isOpen && (
        <motion.div
          className='z-[49] fixed inset-0 touch-none'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onToggle}
        />
      )}
    </>
  )
}
