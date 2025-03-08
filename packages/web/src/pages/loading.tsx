'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  onLoadingComplete?: () => void
  minDisplayTime?: number
}

export default function LoadingScreen ({ onLoadingComplete, minDisplayTime = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [displayComplete, setDisplayComplete] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)

  // Check for system color scheme preference
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    darkModeQuery.addEventListener('change', handleChange)
    return () => darkModeQuery.removeEventListener('change', handleChange)
  }, [])

  // Ensure minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true)
    }, minDisplayTime)

    return () => clearTimeout(timer)
  }, [minDisplayTime])

  // Simulate loading progress
  useEffect(() => {
    const loadingTexts = ['初始化中...', '加载资源中...', '资源加载完成...', '最终处理中...', '即将完成...']
    // Listen for resource loading events
    const updateProgressFromResources = () => {
      // Calculate loaded resources percentage
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const totalResources = resources.length

      if (totalResources === 0) return

      const loadedResources = resources.filter(
        (r) => r.initiatorType !== 'fetch' && r.initiatorType !== 'xmlhttprequest'
      ).length

      const resourceProgress = Math.min(95, Math.floor((loadedResources / totalResources) * 100))

      // Ensure progress only increases, never decreases
      setProgress((prev) => Math.max(prev, resourceProgress))
    }

    // Initial update
    updateProgressFromResources()

    // Set up observers for resource loading
    const observer = new PerformanceObserver(() => {
      updateProgressFromResources()
    })

    observer.observe({ entryTypes: ['resource'] })

    // Fallback timer for progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        // If we're at 100%, clear the interval
        if (prev >= 100) {
          clearInterval(interval)
          setDisplayComplete(true)
          return 100
        }

        // Accelerate progress as we get closer to 100%
        const remaining = 100 - prev
        const increment = Math.max(0.1, remaining * 0.03)

        return Math.min(100, prev + increment)
      })

      // Change loading text based on progress
      if (progress < 20) setLoadingText(loadingTexts[0])
      else if (progress < 40) setLoadingText(loadingTexts[1])
      else if (progress < 60) setLoadingText(loadingTexts[2])
      else if (progress < 80) setLoadingText(loadingTexts[3])
      else setLoadingText(loadingTexts[4])
    }, 50)

    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [progress])

  // Call onLoadingComplete when both conditions are met
  useEffect(() => {
    if (displayComplete && minTimeElapsed && onLoadingComplete) {
      onLoadingComplete()
    }
  }, [displayComplete, minTimeElapsed, onLoadingComplete])

  const textColor = isDarkMode ? 'text-white' : 'text-gray-800'
  const textColorMuted = isDarkMode ? 'text-white/80' : 'text-gray-600'

  return (
    <div className='relative h-screen w-screen overflow-hidden'>
      {/* Background color blocks - circular with animation */}
      <motion.div
        className='absolute w-[400px] h-[400px] rounded-full bg-pink-400 opacity-70'
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -20, 30, 10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
        style={{ top: '25%', left: '25%' }}
      />

      <motion.div
        className='absolute w-[500px] h-[500px] rounded-full bg-blue-400 opacity-70'
        animate={{
          x: [0, -40, 20, -10, 0],
          y: [0, 30, -20, -10, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
        style={{ bottom: '25%', right: '25%' }}
      />

      <motion.div
        className='absolute w-[300px] h-[300px] rounded-full bg-purple-400 opacity-50'
        animate={{
          x: [0, 20, -30, 10, 0],
          y: [0, -30, -10, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
        style={{ top: '75%', left: '50%' }}
      />

      {/* Frosted glass layer */}
      <div className='absolute inset-0 backdrop-blur-3xl bg-white/10' />

      {/* Content layer */}
      <div className='absolute inset-0 flex flex-col items-center justify-center px-4'>
        {/* Title with light effect */}
        <motion.h1
          className={`text-5xl sm:text-6xl md:text-8xl font-bold ${textColor} mb-12 tracking-wider`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Karin WebUI
        </motion.h1>

        {/* Simplified Loading progress bar */}
        <div className='w-64 md:w-96 h-2 bg-gray-300/30 rounded-full mb-4 overflow-hidden'>
          <motion.div
            className='h-full bg-current rounded-full'
            style={{ backgroundColor: isDarkMode ? 'white' : '#4B5563' }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Loading percentage */}
        <div className={`${textColor} text-xl mb-2`}>{Math.floor(progress)}%</div>

        {/* Loading text */}
        <motion.div
          className={`${textColorMuted} text-lg`}
          key={loadingText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {loadingText}
        </motion.div>

        {/* Inspirational message */}
        <div className={`absolute bottom-8 ${textColor} text-sm sm:text-base animate-pulse`}>
          永远相信美好的事情即将发生
        </div>
      </div>
    </div>
  )
}
