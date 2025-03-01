import Sidebar from '@/components/sidebar.tsx'
import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { IoMenu, IoClose } from 'react-icons/io5'
import { useMediaQuery } from 'react-responsive'
import { getPageTitle } from '@/lib/utils'
import { MdMenuOpen } from 'react-icons/md'
import { Button } from '@heroui/button'
import { RiMenuUnfold2Line } from 'react-icons/ri'

export default function DashboardLayout () {
  const [isOpen, setIsOpen] = useState(true)
  const isNotSmallScreen = useMediaQuery({ minWidth: 768 })
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <div className='relative flex h-screen w-full overflow-hidden'>
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      <motion.main
        className={clsx(
          'overflow-y-auto flex flex-col',
          isNotSmallScreen ? 'flex-1' : 'w-full'
        )}
        initial={false}
        animate={{
          width: isNotSmallScreen ? isOpen ? 'calc(100% - 240px)' : '100%' : '100%',
          x: isOpen && !isNotSmallScreen ? 240 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30
        }}
      >
        {/* 顶部导航栏 */}
        <motion.div
          className={clsx(
            'sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md',
            'border-b border-divider shadow-sm flex items-center justify-between',
            'px-4 py-2'
          )}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className='flex items-center gap-3'>

            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={clsx(
                'p-2 rounded-lg',
                'text-xs transition-colors'
              )}
            >
              {isOpen
                ? <RiMenuUnfold2Line className='w-5 h-5' />
                : <IoMenu className='w-5 h-5' />}
            </motion.button>

            <motion.h1
              className='text-lg font-medium'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h1>
          </div>
        </motion.div>

        {/* 内容区域 */}
        <div className='container mx-auto px-3 py-4 flex-1'>
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}
