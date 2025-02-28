import Sidebar from '@/components/sidebar.tsx'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { IoMenu, IoClose } from 'react-icons/io5'
import { useMediaQuery } from 'react-responsive'

export default function DashboardLayout () {
  const [isOpen, setIsOpen] = useState(true)
  const isNotSmallScreen = useMediaQuery({ minWidth: 768 })

  return (
    <div className='relative flex h-screen w-full overflow-hidden'>
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* 统一的开关按钮 */}
      <AnimatePresence>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'fixed top-3 z-50 p-3 rounded-xl bg-primary/20 hover:bg-primary/30',
            'text-xl transition-colors'
          )}
          initial={{
            opacity: 0,
            x: isOpen ? -240 : 0
          }}
          animate={{
            opacity: 1,
            x: isOpen ? 0 : 0,
            left: isOpen ? 'calc(240px - 48px)' : '12px' // 48px 是按钮的大致宽度
          }}
          exit={{ opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        >
          {isOpen
            ? <IoClose className='w-6 h-6' />
            : <IoMenu className='w-6 h-6' />}
        </motion.button>
      </AnimatePresence>

      <motion.main
        className={clsx(
          'overflow-y-auto',
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
        <div className='container mx-auto px-3'>
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}
