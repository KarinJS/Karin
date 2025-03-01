import Sidebar from '@/components/sidebar.tsx'
import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { IoMenu } from 'react-icons/io5'
import { useMediaQuery } from 'react-responsive'
import { getPageTitle } from '@/lib/utils'
import { RiMenuUnfold2Line } from 'react-icons/ri'

/** 提取路径的主路径部分（一级路由） */
function getMainPath (pathname: string): string {
  const split = pathname.trim().split('/').filter(Boolean)
  if (split.length === 0) return ''

  const mainPath = split[0]
  return mainPath === '' ? '' : '/' + mainPath
}

export default function DashboardLayout () {
  const [isOpen, setIsOpen] = useState(true)
  const isNotSmallScreen = useMediaQuery({ minWidth: 768 })
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  const [currentMainPath, setCurrentMainPath] = useState(getMainPath(location.pathname))

  useEffect(() => {
    setCurrentMainPath(getMainPath(location.pathname))
  }, [location])

  return (
    <div className='relative flex h-screen w-full overflow-hidden'>
      {/* 侧边栏 */}
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* 主内容区域 */}
      <motion.main
        className={clsx(
          'overflow-y-auto flex flex-col',
          isNotSmallScreen ? 'flex-1' : 'w-full'
        )}
        initial={false}
        animate={{
          width: isNotSmallScreen ? (isOpen ? 'calc(100% - 240px)' : '100%') : '100%',
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
            'sticky top-0 z-40 w-full bg-opacity-50 backdrop-blur-md',
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
              className={clsx('p-2 rounded-lg text-xs transition-colors')}
            >
              <div className='flex items-center gap-4'>
                {isOpen
                  ? <RiMenuUnfold2Line className='w-5 h-5' />
                  : <IoMenu className='w-5 h-5' />}
                {/* 标题 */}
                <motion.h1 className='text-lg'>
                  {title}
                </motion.h1>
              </div>

            </motion.button>

          </div>
        </motion.div>

        {/* 内容区域动画 */}
        <motion.div
          className='container mx-auto px-3 py-4 flex-1'
          key={currentMainPath} // 动态 key，只在主路径变化时触发动画
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 10,
            ease: [0.25, 0.1, 0.25, 1], // 调整淡出动画的缓动曲线
          }}
        >
          <AnimatePresence mode='popLayout'>
            <Outlet key={currentMainPath} />
          </AnimatePresence>
        </motion.div>
      </motion.main>
    </div>
  )
}
