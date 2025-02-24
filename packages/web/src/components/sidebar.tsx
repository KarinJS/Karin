/* eslint-disable @stylistic/indent */
import { siteConfig, initSiteConfig } from '@/config/site'
import clsx from 'clsx'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Fragment, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronRight } from 'react-icons/fa6'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { useMediaQuery } from 'react-responsive'
import { IoMenu, IoClose } from 'react-icons/io5'
import { useLocalStorageState } from 'ahooks'
import key from '@/consts/key'
import { Icon } from './ui/icon'
import { Spinner } from '@heroui/spinner'

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
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
    }
  }
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
      duration: 0.3,
      ease: 'easeInOut',
    }
  }
}

export interface MenuButtonProps {
  isCollapsed: boolean
  children: React.ReactNode
}

function MenuButton ({ isCollapsed, children }: MenuButtonProps) {
  return (
    <motion.div
      className={clsx(
        'flex justify-center items-center text-sm h-10 text-default-600 hover:text-primary transition-colors cursor-default md:cursor-pointer',
        !isCollapsed && 'md:h-12'
      )}
      initial={{ borderRadius: isCollapsed ? 40 : 0 }}
      animate={{ borderRadius: isCollapsed ? 40 : 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}

export default function Sidebar () {
  const [isCollapsed = false, setIsCollapsed] = useLocalStorageState<boolean>(
    key.sideBarCollapsed,
    {
      defaultValue: false,
    }
  )
  const [show, setShow] = useState(true)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [pluginsLoading, setPluginsLoading] = useState(true)
  const isNotSmallScreen = useMediaQuery({ minWidth: 768 })
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    initSiteConfig().then(() => {
      setPluginsLoading(false)
    })
  }, [])

  return (
    <motion.div className='h-full fixed md:relative z-50'>
      <motion.div
        className={clsx(
          'bg-background/80 backdrop-blur-md md:!h-full md:!w-full border-r border-divider overflow-hidden flex flex-col gap-4 md:gap-2',
          !isCollapsed && 'md:pt-4'
        )}
        initial={{
          borderRadius: !show ? 28 : 0,
          height: show || isNotSmallScreen ? '100%' : 56,
          width: show || isNotSmallScreen ? '100%' : 56,
        }}
        animate={{
          borderRadius: !show ? 28 : 0,
          height: show || isNotSmallScreen ? '100%' : 56,
          width: show || isNotSmallScreen ? '100%' : 56,
        }}
      >
        <div className='flex p-2 pb-0 flex-shrink-0 flex-grow-0 items-center justify-between md:!p-0.5 md:justify-center'>
          <motion.div
            className='aspect-square bg-primary/5 text-primary text-xl rounded-full w-10 md:!w-0 md:!h-0 overflow-hidden flex justify-center items-center cursor-default md:cursor-pointer flex-grow-0 flex-shrink-0 transition-all hover:bg-primary/10'
            onClick={() => setShow(!show)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence>
              <motion.div
                key={show ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {show ? <IoClose /> : <IoMenu />}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            className='flex-1 flex items-center justify-center md:w-auto relative px-3'
            initial={{
              opacity: (!show && !isNotSmallScreen) || isCollapsed ? 0 : 1,
              width: (!show && !isNotSmallScreen) || isCollapsed ? 0 : 'auto',
              height: (!show && !isNotSmallScreen) || isCollapsed ? 0 : 'auto',
            }}
            animate={{
              opacity: (!show && !isNotSmallScreen) || isCollapsed ? 0 : 1,
              width: (!show && !isNotSmallScreen) || isCollapsed ? 0 : 'auto',
              height: (!show && !isNotSmallScreen) || isCollapsed ? 0 : 'auto',
            }}
          >
            <div className='flex items-center gap-3 -ml-10'>
              <motion.div
                className='w-9 h-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative group cursor-default md:cursor-pointer'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* 外环动画 */}
                <motion.div
                  className='absolute inset-0 rounded-xl ring-2 ring-primary/10'
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />

                {/* 内环动画 */}
                <motion.div
                  className='absolute inset-1 rounded-lg ring-1 ring-primary/5'
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />

                {/* Logo */}
                <motion.div
                  className='relative z-10 w-full h-full flex items-center justify-center'
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
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
                        duration: 2,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatType: 'reverse'
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
                        duration: 1.5,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: 0.5
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
                className='font-medium text-base relative'
              >
                <motion.div
                  className='relative flex items-center'
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
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
                      repeatDelay: 1
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
                      delay: 0.1
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
                      delay: 0.2
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
                      delay: 0.3
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
                      delay: 0.4
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
                      duration: 0.8,
                      ease: 'easeOut'
                    }}
                  />

                  {/* 流光效果1 */}
                  <motion.div
                    className='absolute inset-0 w-[30%] bg-gradient-to-r from-transparent via-sky-200/80 to-transparent'
                    animate={{
                      x: ['-100%', '400%'],
                    }}
                    transition={{
                      duration: 2,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                  />

                  {/* 流光效果2 */}
                  <motion.div
                    className='absolute inset-0 w-[20%] bg-gradient-to-r from-transparent via-blue-200/70 to-transparent'
                    animate={{
                      x: ['-100%', '600%'],
                    }}
                    transition={{
                      duration: 2.5,
                      ease: 'linear',
                      repeat: Infinity,
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
                      duration: 2,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatDelay: 0.5
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
                    repeatDelay: 2
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div
          className={clsx(
            'flex-1 p-2 px-2 pt-0 flex flex-col gap-2 overflow-y-auto hide-scrollbar',
            !isCollapsed && 'px-4'
          )}
        >
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
                    'block text-default-600 hover:text-primary rounded-xl w-max hover:bg-default-100/50 transition-all cursor-default md:cursor-pointer group',
                    {
                      '!text-primary bg-primary/5 font-medium ring-1 ring-primary/10':
                        location.pathname === item.href ||
                        (item.children?.some(child => location.pathname === child.href)),
                    }
                  )}
                >
                  <motion.div
                    className='flex items-center gap-3 py-2.5 overflow-hidden relative'
                    initial={{
                      width: isCollapsed ? 40 : 200,
                      paddingLeft: isCollapsed ? 10 : 16,
                      paddingRight: isCollapsed ? 10 : 16,
                    }}
                    animate={{
                      width: isCollapsed ? 40 : 200,
                      paddingLeft: isCollapsed ? 10 : 16,
                      paddingRight: isCollapsed ? 10 : 16,
                    }}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      if (item.children) {
                        setExpandedMenu(expandedMenu === item.href ? null : item.href)
                      } else {
                        navigate(item.href)
                      }
                    }}
                  >
                    <motion.div
                      className='text-xl relative z-10'
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <item.Icon />
                    </motion.div>
                    <motion.div
                      className='whitespace-nowrap overflow-hidden text-sm relative z-10 flex-1 flex items-center gap-2'
                      initial={{
                        width: isCollapsed ? 0 : 'auto',
                      }}
                      animate={{
                        width: isCollapsed ? 0 : 'auto',
                      }}
                    >
                      {item.label}
                      {item.href === '/plugins' && (
                        <>
                          {pluginsLoading
                            ? (
                              <Spinner className='w-10 h-4 text-primary' variant='wave' size='md' />
                            )
                            : (
                              <span className='text-success text-base'>✓</span>
                            )}
                        </>
                      )}
                    </motion.div>
                    {item.children && !isCollapsed && (
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: expandedMenu === item.href ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaChevronRight className='w-3 h-3' />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* 子菜单 */}
                  {item.children && !isCollapsed && (
                    <AnimatePresence>
                      {expandedMenu === item.href && (
                        <motion.div
                          variants={subMenuVariants}
                          initial='hidden'
                          animate='visible'
                          exit='hidden'
                          className='overflow-hidden ml-4'
                        >
                          {pluginsLoading && item.href === '/plugins'
                            ? (
                              <div className='flex items-center justify-center py-4'>
                                <Spinner className='w-2 h-4 text-primary -ml-7' variant='dots' size='lg' />
                              </div>
                            )
                            : (item.children.map((child) => (
                              <Fragment key={child.href}>
                                <NavLink
                                  to={{
                                    pathname: child.href,
                                    search: `?type=${child.type || ''}`
                                  }}
                                  className={({ isActive }) =>
                                    clsx(
                                      'flex items-center gap-2 py-2 px-3 text-sm text-default-600 hover:text-primary rounded-lg transition-colors',
                                      {
                                        '!text-primary bg-primary/5': isActive,
                                      }
                                    )}
                                >
                                  {child.icon && <Icon name={child.icon?.name || ''} size={child.icon?.size} color={child.icon?.color} />}
                                  {child.id || child.href.split('/').pop()}
                                </NavLink>
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
        </div>
        <motion.div
          className='flex-grow-0 flex-shrink-0 grid-cols-2 grid'
          initial={{
            margin: isCollapsed ? 8 : 0,
            gridTemplateColumns: isCollapsed ? '1fr' : '1fr 1fr',
          }}
          animate={{
            margin: isCollapsed ? 8 : 0,
            gridTemplateColumns: isCollapsed ? '1fr' : '1fr 1fr',
          }}
        >
          <MenuButton isCollapsed={isCollapsed}>
            <ThemeSwitch
              className='w-full h-full max-w-full flex justify-center'
              classNames={{
                wrapper: '!text-default-600',
                base: 'w-full h-full',
              }}
            />
          </MenuButton>
          <MenuButton isCollapsed={isCollapsed}>
            <div
              className='flex w-full h-full justify-center items-center text-sm'
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <motion.div
                className='!rotate-180'
                initial={{
                  marginRight: isCollapsed ? 0 : -8,
                }}
                animate={{
                  marginRight: isCollapsed ? 0 : -8,
                }}
              >
                <FaChevronRight />
              </motion.div>
              <motion.div
                initial={{
                  rotate: isCollapsed ? 0 : 180,
                }}
                animate={{
                  rotate: isCollapsed ? 0 : 180,
                }}
              >
                <FaChevronRight />
              </motion.div>
            </div>
          </MenuButton>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
