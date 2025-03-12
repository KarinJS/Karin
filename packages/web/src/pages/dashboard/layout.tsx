import Sidebar from '@/components/sidebar.tsx'
import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
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
  // const [touchStartX, setTouchStartX] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const isNotSmallScreen = useMediaQuery({ minWidth: 768 })
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  const [currentMainPath, setCurrentMainPath] = useState(getMainPath(location.pathname))

  // const [touchStartY, setTouchStartY] = useState(0)
  // const [touchStartTime, setTouchStartTime] = useState(0)

  // const handleTouchStart = useCallback((e: React.TouchEvent) => {
  //   if (isNotSmallScreen) return
  //   const touch = e.touches[0]
  //   setTouchStartX(touch.clientX)
  //   setTouchStartY(touch.clientY)
  //   setTouchStartTime(Date.now())
  // }, [isNotSmallScreen])

  // const handleTouchMove = useCallback((e: React.TouchEvent) => {
  //   if (isNotSmallScreen || isOpen) return

  //   const touch = e.touches[0]
  //   if (!touch) return

  //   // 计算滑动速度和方向
  //   const deltaX = touch.clientX - touchStartX
  //   const deltaY = Math.abs(touch.clientY - touchStartY)
  //   const velocityX = Math.abs(deltaX) / (Date.now() - touchStartTime)

  //   // console.log('滑动参数:', {
  //   //   deltaX,
  //   //   deltaY,
  //   //   velocity: velocityX.toFixed(2),
  //   //   direction: deltaX > 0 ? 'right' : 'left'
  //   // })

  //   // 触发条件
  //   if (
  //     deltaX > 35 && // 滑动距离
  //     deltaY < 50 && // 垂直容差
  //     velocityX > 0.9 && // 滑动速度
  //     deltaX > Math.abs(deltaY) * 1.5 // 横向主导
  //   ) {
  //     // console.log('✅ 全屏滑动触发')
  //     setIsOpen(true)
  //   }
  // }, [isNotSmallScreen, isOpen, touchStartX, touchStartY, touchStartTime])

  useEffect(() => {
    // 大屏幕默认展开侧边栏
    if (isNotSmallScreen) {
      setIsOpen(true)
    }
  }, [isNotSmallScreen])

  useEffect(() => {
    setCurrentMainPath(getMainPath(location.pathname))
  }, [location])

  return (
    <div
      className='relative flex h-screen w-full overflow-hidden'
      style={{
        height: '100dvh'
      }}
    >
      {/* 侧边栏 */}
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {/* 主内容区域 */}
      <motion.main
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={() => setTouchStartX(0)}
        style={{
          touchAction: 'manipulation',
          WebkitOverflowScrolling: 'touch'
        }}
        className={clsx(
          'overflow-y-auto flex flex-col  touch-auto',
          isNotSmallScreen ? 'flex-1' : 'w-full'
        )}
        initial={false}
        animate={{
          width: isNotSmallScreen ? (isOpen ? 'calc(100% - 240px)' : '100%') : '100%',
          x: isOpen && !isNotSmallScreen ? 240 : 0
        }}
        transition={{
          type: 'tween',
          ease: [0.00, 0.00, 0.00, 1.00],
          duration: 0.3
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
          transition={{
            type: 'tween',
            ease: [0.00, 0.00, 0.00, 1.00],
            duration: 0.3
          }}
        >
          <div className='flex items-center gap-3'>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={clsx('p-2 rounded-lg text-xs')}
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
            type: 'tween',
            ease: [0.00, 0.00, 0.00, 1.00],
            duration: 0.3
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
