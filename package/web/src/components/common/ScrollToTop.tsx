import clsx from 'clsx'
import { motion, useDragControls } from 'framer-motion'
import { ArrowUpToLine } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { Tooltip } from '@heroui/tooltip'

/**
 * 滚动进度指示器
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isAtEdge, setIsAtEdge] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768)
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [, setShowArrow] = useState(false)
  const dragControls = useDragControls()
  const lastAltPressTime = useRef<number | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLElement | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 检测滚动位置并控制按钮可见性和百分比
  useEffect(() => {
    const scrollContainer = document.querySelector('main.overflow-y-auto') as HTMLElement
    if (scrollContainer) {
      containerRef.current = scrollContainer

      const handleScroll = () => {
        const scrollTop = scrollContainer.scrollTop
        const scrollHeight = scrollContainer.scrollHeight
        const clientHeight = scrollContainer.clientHeight
        const maxScroll = scrollHeight - clientHeight

        setIsVisible(scrollTop > 0)

        if (maxScroll > 0) {
          const percentage = Math.round((scrollTop / maxScroll) * 100)
          setScrollPercentage(percentage)
        }

        // 检测是否正在滚动
        setIsScrolling(true)
        setShowArrow(false)

        // 清除之前的定时器
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }

        // 设置新的定时器，1秒后显示箭头
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false)
          setShowArrow(true)
        }, 1000)
      }

      // 初始检查
      handleScroll()

      scrollContainer.addEventListener('scroll', handleScroll)
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
      }
    }
  }, [])

  // 监听自定义的模态框事件
  useEffect(() => {
    const handleModalOpen = () => {
      setIsModalOpen(true)
    }

    const handleModalClose = () => {
      setIsModalOpen(false)
    }

    window.addEventListener('karin:modal-open', handleModalOpen)
    window.addEventListener('karin:modal-close', handleModalClose)

    return () => {
      window.removeEventListener('karin:modal-open', handleModalOpen)
      window.removeEventListener('karin:modal-close', handleModalClose)
    }
  }, [])

  // 监听窗口大小变化以更新isMobile状态
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 检测双击Alt键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        e.preventDefault()

        const now = Date.now()
        if (lastAltPressTime.current && now - lastAltPressTime.current < 500) {
          scrollToTop()
          lastAltPressTime.current = null
        } else {
          lastAltPressTime.current = now
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 检查按钮是否靠近边缘
  useEffect(() => {
    if (!buttonRef.current) return

    const checkEdgePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return

      const viewportWidth = window.innerWidth
      const threshold = 20

      if (rect.right > viewportWidth - threshold) {
        setIsAtEdge(true)
      } else {
        setIsAtEdge(false)
      }
    }

    checkEdgePosition()
    window.addEventListener('resize', checkEdgePosition)
    return () => window.removeEventListener('resize', checkEdgePosition)
  }, [position])

  const scrollToTop = () => {
    if (containerRef.current && !isDragging) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const onDragStart = () => {
    setIsDragging(true)
  }

  const onDragEnd = (_: any, info: any) => {
    setPosition({ x: info.point.x, y: info.point.y })
    setTimeout(() => {
      setIsDragging(false)
    }, 100)
  }

  // 如果模态框打开且在移动端，就隐藏按钮
  const shouldHideButton = isModalOpen && isMobile

  // 计算圆形进度条的路径
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (scrollPercentage / 100) * circumference

  return (
    <Tooltip
      content='返回顶部'
      placement='top'
      color='default'
      className='bg-opacity-50 backdrop-blur-sm'
      size='md'
    >
      <motion.button
        ref={buttonRef}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: isVisible && !shouldHideButton ? 1 : 0,
          scale: isVisible && !shouldHideButton ? 1 : 0.5,
          display: isVisible && !shouldHideButton ? 'flex' : 'none',
        }}
        whileHover={{
          scale: 1.1,
          x: isAtEdge ? -20 : 0,
        }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className='fixed bottom-8 flex h-12 w-12 items-center justify-center bg-primary-500/15 glass-effect shadow-lg hover:shadow-xl transition-shadow duration-300'
        aria-label='返回顶部'
        drag
        dragControls={dragControls}
        dragMomentum={false}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        dragConstraints={{
          left: -window.innerWidth + 80,
          right: window.innerWidth - 80,
          top: -window.innerHeight + 80,
          bottom: window.innerHeight - 80,
        }}
        style={{
          borderTopRightRadius: isAtEdge ? '0' : '9999px',
          borderBottomRightRadius: isAtEdge ? '0' : '9999px',
          borderTopLeftRadius: '9999px',
          borderBottomLeftRadius: '9999px',
          right: isAtEdge ? '-24px' : '2rem',
          cursor: 'grab',
          transition: 'right 0.3s ease',
        }}
      >
        {/* 圆形进度条 */}
        <svg
          className='absolute inset-0 w-full h-full transform -rotate-90'
          viewBox='0 0 40 40'
        >
          {/* 进度圆环 */}
          <circle
            cx='20'
            cy='20'
            r={radius}
            fill='none'
            className='stroke-primary-600/80'
            strokeWidth='4'
            strokeLinecap='round'
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.1s ease',
            }}
          />
        </svg>

        {/* 内容区域 */}
        <div className='relative flex items-center justify-center'>
          {/* 百分比数字 - 滚动时显示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: isScrolling ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className='absolute inset-0 flex items-center justify-center'
          >
            <span className='text-xs text-default-700 font-medium'>
              {scrollPercentage}%
            </span>
          </motion.div>

          {/* 箭头图标 - 停止滚动后显示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: !isScrolling ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpToLine
              className={clsx(
                'h-5 w-5 text-default-600'
              )}
            />
          </motion.div>
        </div>
      </motion.button>
    </Tooltip>
  )
}

export default ScrollToTop
