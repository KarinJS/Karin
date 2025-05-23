/* eslint-disable @stylistic/indent */
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
import { Moon, Sun, Laptop } from 'lucide-react'
import { RiMenuUnfold2Line } from 'react-icons/ri'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { Fragment, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig, initSiteConfig } from '@/config/site'
import { useLocation, useNavigate } from 'react-router-dom'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'

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
  const [showsingOut, setShowsingOut] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    initSiteConfig().then(() => {
      setPluginsLoading(false)
    })
  }, [])

  useEffect(() => {
    siteConfig.navItems.forEach((item) => {
      if (item.children?.some(child => location.pathname === child.href)) {
        setExpandedMenu(item.href)
      }
    })
  }, [location.pathname])

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
          <div className='flex p-2 pb-0 flex-shrink-0 flex-grow-0 items-center justify-between md:!p-0.5 md:justify-center'>
            <motion.div
              className='flex-1 flex items-center justify-center md:w-auto relative px-3'
              initial={{
                opacity: 1,
                width: 'auto',
                height: 'auto',
              }}
              animate={{
                opacity: 1,
                width: 'auto',
                height: 'auto',
              }}
            >
              <div className={clsx(
                'flex items-center gap-3',
                isCollapsed ? 'justify-center' : '-ml-10'
              )}
              >
                {/* Logo图标 - 收起时显示 */}
                {isCollapsed
                  ? (
                    <motion.div
                      className='w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/10 flex items-center justify-center relative group cursor-pointer'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/')}
                    >
                      <svg
                        viewBox='0 0 24 24'
                        className='w-5 h-5'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <motion.path
                          d='M12 3L20 7V17L12 21L4 17V7L12 3Z'
                          className='stroke-primary'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <motion.path
                          d='M12 3V21'
                          className='stroke-primary/50'
                          strokeWidth='2'
                          strokeLinecap='round'
                        />
                      </svg>
                    </motion.div>
                  )
                  : (
                    <>
                      <motion.div
                        className='w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/10 flex items-center justify-center relative group cursor-pointer'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                      >
                        {/* 外环动画 */}
                        <motion.div
                          className='absolute inset-0 rounded-xl ring-2 ring-primary/10'
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            type: 'tween',
                            ease: [0.00, 0.00, 0.00, 1.00],
                            duration: 0.3,
                          }}
                        />

                        {/* 内环动画 */}
                        <motion.div
                          className='absolute inset-1 rounded-lg ring-1 ring-primary/5'
                          animate={{
                            rotate: -360,
                          }}
                          transition={{
                            type: 'tween',
                            ease: [0.00, 0.00, 0.00, 1.00],
                            duration: 0.3,
                          }}
                        />

                        {/* Logo */}
                        <motion.div
                          className='relative z-10 w-full h-full flex items-center justify-center'
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                          onClick={() => navigate('/')}
                        >
                          <svg
                            viewBox='0 0 24 24'
                            className='w-5 h-5'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <motion.path
                              d='M12 3L20 7V17L12 21L4 17V7L12 3Z'
                              className='stroke-primary'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{
                                type: 'tween',
                                ease: [0.00, 0.00, 0.00, 1.00],
                                duration: 0.3,
                              }}
                            />
                            <motion.path
                              d='M12 3V21'
                              className='stroke-primary/50'
                              strokeWidth='2'
                              strokeLinecap='round'
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{
                                type: 'tween',
                                ease: [0.00, 0.00, 0.00, 1.00],
                                duration: 0.3,
                              }}
                            />
                          </svg>
                        </motion.div>

                        {/* Hover 效果 */}
                        <motion.div
                          className='absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity'
                          initial={false}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>

                      {/* Karin 文字 */}
                      <motion.div
                        className='font-medium text-base relative select-none cursor-pointer'
                        onClick={() => navigate('/')}
                      >
                        <motion.div
                          className='relative flex items-center'
                          animate={{
                            scale: [1, 1.02, 1],
                          }}
                          transition={{
                            type: 'tween',
                            ease: [0.00, 0.00, 0.00, 1.00],
                            duration: 0.3,
                          }}
                        >
                          {/* k */}
                          <motion.span
                            className='bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent inline-block origin-bottom'
                            animate={{
                              opacity: [0, 1, 1, 0],
                              scale: [0, 1, 1, 0],
                              rotateZ: [45, 0, 0, -45],
                            }}
                            transition={{
                              duration: 3,
                              times: [0, 0.1, 0.9, 1],
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                          >
                            k
                          </motion.span>
                          {/* a */}
                          <motion.span
                            className='bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent inline-block'
                            animate={{
                              opacity: [0, 1, 1, 0],
                              y: [20, 0, 0, 20],
                              scale: [0.5, 1, 1, 0.5],
                            }}
                            transition={{
                              duration: 3,
                              times: [0, 0.1, 0.9, 1],
                              repeat: Infinity,
                              repeatDelay: 1,
                              delay: 0.1,
                            }}
                          >
                            a
                          </motion.span>
                          {/* r */}
                          <motion.span
                            className='bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent inline-block origin-top'
                            animate={{
                              opacity: [0, 1, 1, 0],
                              scale: [0.2, 1, 1, 0.2],
                              rotateZ: [-45, 0, 0, 45],
                            }}
                            transition={{
                              duration: 3,
                              times: [0, 0.1, 0.9, 1],
                              repeat: Infinity,
                              repeatDelay: 1,
                              delay: 0.2,
                            }}
                          >
                            r
                          </motion.span>
                          {/* i */}
                          <motion.span
                            className='bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent inline-block'
                            animate={{
                              opacity: [0, 1, 1, 0],
                              y: [-20, 0, 0, -20],
                              scale: [0.5, 1, 1, 0.5],
                              rotateZ: [45, 0, 0, -45],
                            }}
                            transition={{
                              duration: 3,
                              times: [0, 0.1, 0.9, 1],
                              repeat: Infinity,
                              repeatDelay: 1,
                              delay: 0.3,
                            }}
                          >
                            i
                          </motion.span>
                          {/* n */}
                          <motion.span
                            className='bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent inline-block'
                            animate={{
                              opacity: [0, 1, 1, 0],
                              x: [-20, 0, 0, -20],
                              scale: [0.2, 1, 1, 0.2],
                              rotateZ: [-30, 0, 0, 30],
                            }}
                            transition={{
                              duration: 3,
                              times: [0, 0.1, 0.9, 1],
                              repeat: Infinity,
                              repeatDelay: 1,
                              delay: 0.4,
                            }}
                          >
                            n
                          </motion.span>
                        </motion.div>

                        {/* 底部线条 */}
                        <div className='absolute -bottom-1 left-0 right-0 h-[2px]'>
                          {/* 基础线条 */}
                          <motion.div
                            className='absolute inset-0 bg-gradient-to-r from-sky-400/50 via-blue-400/40 to-sky-400/50'
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              type: 'tween',
                              ease: [0.00, 0.00, 0.00, 1.00],
                              duration: 0.3,
                            }}
                          />

                          {/* 流光效果1 */}
                          <motion.div
                            className='absolute inset-0 w-[30%] bg-gradient-to-r from-transparent via-sky-200/80 to-transparent'
                            animate={{
                              x: ['-100%', '400%'],
                            }}
                            transition={{
                              type: 'tween',
                              ease: [0.00, 0.00, 0.00, 1.00],
                              duration: 0.3,
                            }}
                          />

                          {/* 流光效果2 */}
                          <motion.div
                            className='absolute inset-0 w-[20%] bg-gradient-to-r from-transparent via-blue-200/70 to-transparent'
                            animate={{
                              x: ['-100%', '600%'],
                            }}
                            transition={{
                              type: 'tween',
                              ease: [0.00, 0.00, 0.00, 1.00],
                              duration: 0.3,
                            }}
                          />

                          {/* 光斑效果 */}
                          <motion.div
                            className='absolute inset-0 w-2 h-[2px] bg-sky-200/80 blur-[2px]'
                            animate={{
                              x: ['-100%', '500%'],
                              opacity: [0, 0.9, 0],
                            }}
                            transition={{
                              type: 'tween',
                              ease: [0.00, 0.00, 0.00, 1.00],
                              duration: 0.3,
                            }}
                          />
                        </div>

                        {/* 光效动画 */}
                        <motion.div
                          className='absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none'
                          animate={{
                            x: ['-100%', '100%'],
                            opacity: [0, 0.5, 0],
                          }}
                          transition={{
                            duration: 2,
                            times: [0, 1],
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                        />
                      </motion.div>
                    </>
                  )}
              </div>
            </motion.div>
          </div>

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
                        'hover:bg-neutral-200 dark:hover:bg-neutral-700',
                        isCollapsed ? 'mx-auto' : 'mx-1',
                        {
                          '!text-primary bg-primary/10 font-medium ring-1 ring-primary/15':
                            location.pathname === item.href ||
                            (item.children?.some(child => location.pathname === child.href)),
                        }
                      )}
                    >
                      <motion.div
                        className={clsx(
                          'flex items-center overflow-hidden relative',
                          isCollapsed ? 'justify-center py-1.5' : 'gap-6 py-2.5' // 缩小上下间距，但保持不太接近
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
                          if (item.children && !isCollapsed) {
                            setExpandedMenu(expandedMenu === item.href ? null : item.href)
                          } else {
                            navigate(item.href)
                          }
                        }}
                      >
                        <motion.div
                          className='relative z-10'
                          // 添加图标大小动画过渡
                          initial={{
                            fontSize: isCollapsed ? '1.875rem' : '1.625rem',
                            width: isCollapsed ? '2.5rem' : 'auto',
                            height: isCollapsed ? '2.5rem' : 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                          }}
                          animate={{
                            fontSize: isCollapsed ? '1.875rem' : '1.625rem', // 从1.25rem修改为1.625rem
                            width: isCollapsed ? '2.5rem' : 'auto',
                            height: isCollapsed ? '2.5rem' : 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
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
                          <>
                            <motion.div
                              className='whitespace-nowrap overflow-hidden text-base relative z-10 flex-1 flex items-center gap-2'
                              initial={{
                                width: 'auto',
                              }}
                              animate={{
                                width: 'auto',
                              }}
                            >
                              <span className='select-none '>{item.label}</span>
                              {item.href === '/plugins' && (
                                <>
                                  {pluginsLoading
                                    ? (
                                      <Spinner className='w-10 h-4 text-primary' variant='wave' size='md' />
                                    )
                                    : (
                                      <svg className='w-4 h-4 text-green-500' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                        <path d='M5 13L9 17L19 7' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                                      </svg>
                                    )}
                                </>
                              )}
                            </motion.div>

                            {item.children && (
                              <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: expandedMenu === item.href ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <FaChevronRight className='w-3 h-3' />
                              </motion.div>
                            )}
                          </>
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
                              {pluginsLoading && item.href === '/plugins'
                                ? (
                                  <div className='flex items-center justify-center py-4'>
                                    <Spinner className='w-2 h-4 text-primary -ml-7' variant='dots' size='lg' />
                                  </div>
                                )
                                : (item.children
                                  .sort((a, b) => a.id.localeCompare(b.id))
                                  .map((child, index) => (
                                    <Fragment key={child.id}>
                                      <Button
                                        variant='light' fullWidth
                                        className={clsx(
                                          'flex items-start justify-start gap-2 py-2 px-3 mb-2 text-sm text-default-600 hover:text-primary',
                                          'transition-transform hover:-translate-y-[2px]',
                                          {
                                            '!text-primary bg-primary/10': location.pathname === child.href,
                                            'mt-2': index === 0,
                                          }
                                        )}
                                        onPress={() => {
                                          navigate(`/plugins/config?name=${child.id}&type=${child.type || ''}`)
                                        }}
                                      >
                                        {child.icon && <Icon name={child.icon?.name || ''} size={child.icon?.size} color={child.icon?.color} />}
                                        {child.id || child.href.split('/').pop()}
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
            'flex-grow-0 flex-shrink-0 py-2 mb-2 flex flex-col gap-2',
            isCollapsed ? 'px-2 items-center' : 'px-4'
          )}
          >
            {/* PC端折叠按钮 - 添加蓝色主题 */}
            {isNotSmallScreen && (
              <Button
                variant='light'
                color='primary'
                className='mb-2 w-full flex items-center justify-center gap-2'
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
                theme === 'dark'
                  ? <Moon className='w-5 h-5' />
                  : theme === 'light'
                    ? <Sun className='w-5 h-5' />
                    : <Laptop className='w-5 h-5' />
              }
              radius='full'
              variant='light'
              color='primary'
              className='w-full flex items-center justify-center gap-2'
              isIconOnly={isCollapsed}
              onPress={toggleTheme}
            >
              {!isCollapsed && (
                theme === 'dark'
                  ? '深色模式'
                  : theme === 'light'
                    ? '浅色模式'
                    : '跟随系统'
              )}
            </Button>

            {/* 退出登录按钮 */}
            <Button
              startContent={<LuLogIn className='w-5 h-5' />}
              radius='full'
              variant='light'
              color='primary'
              className='w-full flex items-center justify-center gap-2'
              isIconOnly={isCollapsed}
              onPress={() => {
                setShowsingOut(true)
              }}
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

      {/* 退出登录确认弹窗 */}
      <Modal
        isOpen={showsingOut}
        onOpenChange={(isOpen) => {
          setShowsingOut(isOpen)
        }}
        size='lg'
      >
        <ModalContent>
          <ModalHeader>
            <h3 className='text-lg font-semibold'>确认注销登录</h3>
          </ModalHeader>
          <ModalBody>
            <p className='text-sm text-default-600'>
              您确定要注销登录吗？
              <br />
              注销后需重新登录才可进入
            </p>
          </ModalBody>
          <ModalFooter>
            <div className='flex gap-2'>
              <Button
                color='default'
                variant='light'
                onPress={() => setShowsingOut(false)}
              >
                取消
              </Button>
              <Button
                color='danger'
                onPress={() => {
                  localStorage.removeItem('userId')
                  localStorage.removeItem('accessToken')
                  localStorage.removeItem('refreshToken')
                  toast.success('退出登录成功！')
                  navigate('/login')
                  setShowsingOut(false)
                }}
              >
                确认
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
