import { motion, useDragControls } from 'framer-motion'
import { RocketIcon } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isAtEdge, setIsAtEdge] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragControls = useDragControls()
  const lastAltPressTime = useRef<number | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  // 检测滚动位置并控制按钮可见性
  useEffect(() => {
    const scrollContainer = document.querySelector('main.overflow-y-auto') as HTMLElement
    if (scrollContainer) {
      containerRef.current = scrollContainer

      const handleScroll = () => {
        setIsVisible(scrollContainer.scrollTop > 0)
      }

      // 初始检查
      handleScroll()

      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 检测双击Alt键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        e.preventDefault() // 阻止浏览器默认行为

        const now = Date.now()
        if (lastAltPressTime.current && now - lastAltPressTime.current < 500) {
          // 双击Alt触发滚动
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
      const threshold = 20 // 边缘检测阈值

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
    // 使用setTimeout来延迟重置拖拽状态
    // 这可以防止拖拽结束后立即触发点击事件
    setTimeout(() => {
      setIsDragging(false)
    }, 100)
  }

  return (
    <motion.button
      ref={buttonRef}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.5,
        // 设置右侧距离为0
        display: isVisible ? 'flex' : 'none',
      }}
      whileHover={{
        scale: 1.1,
        // 悬停时如果在边缘，将按钮完全显示出来
        x: isAtEdge ? -20 : 0
      }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
      className='fixed bottom-8 z-[9999] flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary/90'
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
        bottom: window.innerHeight - 80
      }}
      style={{
        borderTopRightRadius: isAtEdge ? '0' : '9999px',
        borderBottomRightRadius: isAtEdge ? '0' : '9999px',
        borderTopLeftRadius: '9999px',
        borderBottomLeftRadius: '9999px',
        right: isAtEdge ? '-20px' : '2rem', // 边缘时，向右偏移一半宽度，制造半圆效果
        cursor: 'grab',
        transition: 'right 0.3s ease'
      }}
    >
      <RocketIcon
        className='h-5 w-5 transform -rotate-45'
        style={{
          marginRight: isAtEdge ? '20px' : '0', // 调整图标位置，确保在半圆内可见
          transition: 'margin-right 0.3s ease'
        }}
      />
    </motion.button>
  )
}

export default ScrollToTop
