import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  onLoadingComplete?: () => void // 加载完成时的回调函数
  minDisplayTime?: number // 最小显示时间（毫秒）
}

export default function LoadingScreen ({ onLoadingComplete, minDisplayTime = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0) // 当前加载进度
  const [loadingText, setLoadingText] = useState('') // 当前加载提示文本
  const [isDarkMode, setIsDarkMode] = useState(true) // 是否为深色模式
  const [displayComplete, setDisplayComplete] = useState(false) // 是否完成显示
  const [minTimeElapsed, setMinTimeElapsed] = useState(false) // 是否已达到最小显示时间

  // 检查系统颜色方案偏好
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    darkModeQuery.addEventListener('change', handleChange)
    return () => darkModeQuery.removeEventListener('change', handleChange)
  }, [])

  // 确保最小显示时间
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true)
    }, minDisplayTime)

    return () => clearTimeout(timer)
  }, [minDisplayTime])

  // 模拟加载进度动画
  useEffect(() => {
    const loadingTexts = ['初始化中...', '加载资源中...', '资源加载完成...', '最终处理中...', '即将完成...']

    let currentProgress = 0
    const interval = setInterval(() => {
      setProgress(() => {
        // 计算下一个进度值
        if (currentProgress >= 100) {
          clearInterval(interval)
          setDisplayComplete(true)
          return 100
        }

        // 增量逻辑：初始加速，接近100%时减速
        const remaining = 100 - currentProgress
        const increment = Math.max(0.5, remaining * 0.03) // 调整速度
        currentProgress = Math.min(100, currentProgress + increment)

        // 根据进度更新加载提示文本
        if (currentProgress < 20) setLoadingText(loadingTexts[0])
        else if (currentProgress < 40) setLoadingText(loadingTexts[1])
        else if (currentProgress < 60) setLoadingText(loadingTexts[2])
        else if (currentProgress < 80) setLoadingText(loadingTexts[3])
        else setLoadingText(loadingTexts[4])

        return currentProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // 在满足条件时调用加载完成回调
  useEffect(() => {
    if (displayComplete && minTimeElapsed && onLoadingComplete) {
      // 添加一个小延迟以确保平滑过渡
      const finalDelay = setTimeout(() => {
        onLoadingComplete()
      }, 300) // 根据需要调整延迟时间

      return () => clearTimeout(finalDelay)
    }
  }, [displayComplete, minTimeElapsed, onLoadingComplete])

  const textColor = isDarkMode ? 'text-white' : 'text-gray-800' // 文本颜色（深色模式/浅色模式）
  const textColorMuted = isDarkMode ? 'text-white/80' : 'text-gray-600' // 次要文本颜色

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      {/* 背景颜色块 */}
      <motion.div
        className='absolute w-[600px] h-[600px] rounded-full bg-pink-400 opacity-70'
        initial={{ x: -600, y: -600 }}
        animate={{ x: 0, y: 0 }}
        transition={{
          duration: 3,
          ease: [0.0, 0.0, 0.0, 1.0], // cubic-bezier(0.00, 0.00, 0.00, 1.00)
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'mirror',
        }}
        style={{ top: '40%', left: '40%' }}
      />

      <motion.div
        className='absolute w-[700px] h-[700px] rounded-full bg-blue-400 opacity-70'
        initial={{ x: 600, y: 600 }}
        animate={{ x: 0, y: 0 }}
        transition={{
          duration: 3,
          ease: [0.0, 0.0, 0.0, 1.0], // cubic-bezier(0.00, 0.00, 0.00, 1.00)
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'mirror',
        }}
        style={{ bottom: '40%', right: '40%' }}
      />

      {/* 毛玻璃效果层 */}
      <div className='absolute inset-0 backdrop-blur-[192px]' />

      {/* 内容层 */}
      <div className='absolute inset-0 flex flex-col items-center justify-center px-4'>
        {/* 标题 - 光效 */}
        <motion.h1
          className={`text-5xl sm:text-6xl md:text-8xl font-bold ${textColor} mb-12 tracking-wider`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Karin WebUI
        </motion.h1>

        {/* 加载进度条 */}
        <div className='w-64 md:w-96 h-4 bg-gray-300/30 rounded-full mb-4 overflow-hidden'>
          <motion.div
            className='h-full bg-current rounded-full'
            style={{ backgroundColor: isDarkMode ? 'white' : '#4B5563' }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* 加载百分比 */}
        <div className={`${textColor} text-xl mb-2`}>{Math.floor(progress)}%</div>

        {/* 加载提示文本 */}
        <motion.div
          className={`${textColorMuted} text-lg`}
          key={loadingText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {loadingText}
        </motion.div>

        <div className={`absolute bottom-8 ${textColor} text-sm sm:text-base animate-pulse`}>
          永远相信美好的事情即将发生
        </div>
      </div>
    </div>
  )
}
