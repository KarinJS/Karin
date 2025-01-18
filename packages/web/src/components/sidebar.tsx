import { siteConfig } from '@/config/site'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChevronRight } from 'react-icons/fa6'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { useMediaQuery } from 'react-responsive'
import { IoMenu, IoClose } from 'react-icons/io5'
import { title } from '@/components/primitives'
import { Image } from '@heroui/image'

export interface MenuButtonProps {
  isCollapsed: boolean
  children: React.ReactNode
}

function MenuButton({ isCollapsed, children }: MenuButtonProps) {
  return (
    <motion.div
      className={clsx(
        'flex justify-center items-center text-sm h-10 text-danger hover:bg-default-100 transition-colors cursor-default md:cursor-pointer',
      )}
      initial={{
        borderRadius: isCollapsed ? 40 : 0,
      }}
      animate={{
        borderRadius: isCollapsed ? 40 : 0,
      }}
    >
      {children}
    </motion.div>
  )
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [show, setShow] = useState(true)
  const isNotSmallScreen = useMediaQuery({ minWidth: 768 })

  return (
    <motion.div
      className="pr-2 h-full fixed md:relative z-50"
      initial={{
        padding: isNotSmallScreen ? 30 : 10,
      }}
      animate={{
        padding: isNotSmallScreen ? 30 : 10,
      }}
    >
      <motion.div
        className="bg-content1 md:!h-full md:!w-full shadow-foreground-200 shadow-small dark:shadow-foreground-50 overflow-hidden flex flex-col gap-2"
        initial={{
          borderRadius: 28,
          height: show || isNotSmallScreen ? '100%' : 56,
          width: show || isNotSmallScreen ? '100%' : 56,
        }}
        animate={{
          borderRadius: !show || isCollapsed ? 28 : 10,
          height: show || isNotSmallScreen ? '100%' : 56,
          width: show || isNotSmallScreen ? '100%' : 56,
        }}
      >
        <div className="flex p-2 pb-0 flex-shrink-0 flex-grow-0 items-center justify-center md:!p-0.5">
          <div
            className="aspect-square bg-danger text-2xl rounded-full w-10 md:!w-0 md:!h-0 overflow-hidden shadow-md shadow-danger-300 flex justify-center items-center cursor-default md:cursor-pointer text-white flex-grow-0 flex-shrink-0 transition-all"
            onClick={() => setShow(!show)}
          >
            {show ? <IoClose /> : <IoMenu />}
          </div>
          <motion.div
            className={clsx(
              'flex-1 text-center overflow-hidden flex items-center justify-center',
              title({
                color: 'violet',
                size: 'xs',
              }),
            )}
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
            <Image src="/web/karin.png" className="w-10 h-10" />
            <div>KarinJS</div>
          </motion.div>
        </div>
        <div className="flex-1 p-2 pt-0 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
          {siteConfig.navItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'block text-default-700 hover:text-primary rounded-full w-max hover:bg-default-100 transition-colors cursor-default md:cursor-pointer',
                  {
                    '!text-neutral-50 !bg-primary shadow-md shadow-primary-300': isActive,
                  },
                )
              }
            >
              <motion.div
                className="flex items-center gap-2 py-2 overflow-hidden"
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
              >
                <div className="text-xl aspect-square">
                  <item.Icon />
                </div>
                <motion.div
                  className="whitespace-nowrap overflow-hidden"
                  initial={{
                    width: isCollapsed ? 0 : 'auto',
                  }}
                  animate={{
                    width: isCollapsed ? 0 : 'auto',
                  }}
                >
                  {item.label}
                </motion.div>
              </motion.div>
            </NavLink>
          ))}
        </div>
        <motion.div
          className="flex-grow-0 flex-shrink-0 grid-cols-2 grid"
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
              className="w-full h-full max-w-full flex justify-center"
              classNames={{
                wrapper: '!text-danger',
                base: 'w-full h-full',
              }}
            />
          </MenuButton>
          <MenuButton isCollapsed={isCollapsed}>
            <div
              className="flex w-full h-full justify-center items-center"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <motion.div
                className="!rotate-180"
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
