import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image } from '@heroui/image'

interface LoadingScreenProps {
  onLoadingComplete?: () => void // 加载完成时的回调函数
  minDisplayTime?: number // 最小显示时间（毫秒）
}

// 添加到全局样式
const gridPatternStyle = {
  backgroundSize: '20px 20px',
  backgroundImage: `
    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
  `,
}

// 装饰性浮动元素数据
const floatingElements = [
  { icon: '✨', size: 'text-xl', delay: 0, duration: 8 },
  { icon: '🚀', size: 'text-2xl', delay: 1.5, duration: 7 },
  { icon: '🔮', size: 'text-xl', delay: 3, duration: 9 },
  { icon: '💫', size: 'text-lg', delay: 4.5, duration: 8 },
]

// 一言列表
const hitokotoList = [
  '海内存知己，天涯若比邻',
  '千里之行，始于足下',
  '山不在高，有仙则名',
  '人生得意须尽欢，莫使金樽空对月',
  '天行健，君子以自强不息',
  '上善若水，水善利万物而不争',
  '不积跬步，无以至千里',
  '学而不思则罔，思而不学则殆',
  '人工智能不是人的智能，但可以超越人的智能',
]

export default function LoadingScreen ({ onLoadingComplete, minDisplayTime = 800 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0) // 当前加载进度
  const [phase, setPhase] = useState(0) // 当前加载阶段
  const [isDarkMode, setIsDarkMode] = useState(true) // 是否为深色模式
  const [displayComplete, setDisplayComplete] = useState(false) // 是否完成显示
  const [minTimeElapsed, setMinTimeElapsed] = useState(false) // 是否已达到最小显示时间
  const containerRef = useRef<HTMLDivElement>(null)
  const [tipIndex, setTipIndex] = useState(0)
  const [hitokotoIndex, setHitokotoIndex] = useState(Math.floor(Math.random() * hitokotoList.length))

  // 加载阶段文本
  const phaseTexts = [
    '初始化资源',
    '加载核心模块',
    '准备界面元素',
    '最终处理',
    '完成',
  ]

  // 加载提示 - 更新为更实用的内容
  const loadingTips = [
    '在运行时，控制台输入log <level> 可以临时切换日志等级',
    '如果需要快速重启，在运行时可以在控制台输入 rs ~',
    '控制台支持直接交互哦，使用 group 前缀视为群聊场景！',
    '通过 npx ki 可以快速交互~~~',
    '通过 npm install -g @karinjs/cli 可以省略 npx 哦',
  ]

  // 随机切换提示
  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setTipIndex(prev => (prev + 1) % loadingTips.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [progress, loadingTips.length])

  // 随机切换一言
  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setHitokotoIndex(Math.floor(Math.random() * hitokotoList.length))
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [progress])

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

  // 模拟加载进度动画 - 极速版
  useEffect(() => {
    let currentProgress = 0
    let lastPhaseChange = 0

    // 直接设置初始进度为15%，给用户快速反馈
    setTimeout(() => {
      currentProgress = 15
      setProgress(15)
      setPhase(0)
      lastPhaseChange = 15
    }, 100)

    // 使用RAF而不是setInterval，获得更流畅的动画
    let rafId: number

    const updateProgress = () => {
      if (currentProgress >= 100) {
        setDisplayComplete(true)
        return
      }

      // 极速增量算法
      const remaining = 100 - currentProgress
      // 加大增量系数，最小增量设为3，加快初始阶段速度
      const increment = Math.max(3, remaining * 0.15)
      currentProgress += increment

      // 确保不超过100%
      if (currentProgress > 100) currentProgress = 100

      // 更新阶段 - 加快阶段变化
      if (currentProgress >= lastPhaseChange + 16) {
        setPhase(prev => Math.min(prev + 1, 4))
        lastPhaseChange = currentProgress
      }

      setProgress(currentProgress)

      // 如果未完成，继续下一帧
      if (currentProgress < 100) {
        rafId = requestAnimationFrame(updateProgress)
      }
    }

    // 短暂延迟后开始动画，给其他UI元素时间初始化
    setTimeout(() => {
      rafId = requestAnimationFrame(updateProgress)
    }, 200)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // 在满足条件时立即调用加载完成回调
  useEffect(() => {
    if (displayComplete && minTimeElapsed && onLoadingComplete) {
      // 不再添加额外延迟
      onLoadingComplete()
    }
  }, [displayComplete, minTimeElapsed, onLoadingComplete])

  // 动态主题样式
  const theme = {
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-white/70' : 'text-gray-700',
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800/50' : 'bg-white/70',
    primary: 'text-blue-500',
    accent: 'text-pink-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
  }

  return (
    <div ref={containerRef} className={`${theme.background} min-h-screen w-full flex items-center justify-center overflow-hidden relative`}>
      {/* 动态背景 */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-200/30 to-transparent rounded-full blur-3xl dark:from-violet-900/20' />
        <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl dark:from-blue-900/20' />
        <div className='absolute inset-0 opacity-5' style={gridPatternStyle} />

        {/* 装饰性浮动元素 */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className={`absolute ${element.size} opacity-70 select-none`}
            initial={{
              x: Math.random() * 100 - 50 + '%',
              y: Math.random() * 100 - 50 + '%',
              opacity: 0,
            }}
            animate={{
              x: [
                Math.random() * 100 - 50 + '%',
                Math.random() * 100 - 50 + '%',
                Math.random() * 100 - 50 + '%',
              ],
              y: [
                Math.random() * 100 - 50 + '%',
                Math.random() * 100 - 50 + '%',
                Math.random() * 100 - 50 + '%',
              ],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          >
            {element.icon}
          </motion.div>
        ))}
      </div>

      {/* 主卡片容器 */}
      <motion.div
        className={`${theme.cardBg} backdrop-blur-xl w-11/12 max-w-xl rounded-2xl shadow-2xl border ${theme.border} p-8 md:p-12 z-10`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Logo和标题区域 - 从登录页移植 */}
        <div className='flex flex-col items-center space-y-6 mb-10'>
          <motion.div
            initial={{ scale: 0.5, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5, // 加快动画
              type: 'spring',
              stiffness: 260, // 增加弹性
              damping: 20,    // 减少振荡
            }}
          >
            <div className='relative group cursor-pointer'>
              {/* 光晕动画效果 */}
              <motion.div
                className='absolute inset-0 bg-gradient-to-br from-violet-500/50 to-blue-500/50 rounded-full blur-xl opacity-50'
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* 悬停时的装饰环 */}
              <motion.div
                className='absolute -inset-1 bg-gradient-to-br from-violet-600/0 to-blue-600/0 rounded-full opacity-0 group-hover:opacity-100'
                whileHover={{
                  scale: 1.1,
                  rotate: 180,
                }}
                transition={{
                  duration: 0.8,
                  type: 'spring',
                  stiffness: 100,
                }}
              />

              {/* 头像容器 */}
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotate: 5,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <Image
                  src='/web/karin.png'
                  className='relative w-24 h-24 rounded-full shadow-lg border-4 border-white dark:border-white/50 transition-all duration-300 group-hover:shadow-primary/20'
                  alt='logo'
                />
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }} // 加快动画速度
            className='text-center space-y-2'
          >
            <h1 className='text-2xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent'>
              Karin WebUI
            </h1>

            {/* 随机一言代替原来的副标题 */}
            <AnimatePresence mode='wait'>
              <motion.p
                key={hitokotoIndex}
                className='text-sm text-neutral-500 dark:text-neutral-400 italic'
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }} // 加快动画速度
              >
                『{hitokotoList[hitokotoIndex]}』
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* 加载进度指示器 */}
        <div className='mb-8'>
          {/* 进度条 */}
          <div className='h-1.5 w-full bg-gray-200/30 rounded-full mb-4 overflow-hidden'>
            <motion.div
              className='h-full rounded-full'
              style={{
                background: isDarkMode
                  ? 'linear-gradient(90deg, #8B5CF6 0%, #3B82F6 100%)'
                  : 'linear-gradient(90deg, #8B5CF6 0%, #3B82F6 100%)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }} // 更快的进度条动画
            />
          </div>

          {/* 进度信息 */}
          <div className='flex justify-between items-center'>
            <div className='flex items-center'>
              <motion.div
                className='w-2 h-2 rounded-full bg-violet-500 mr-2'
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 0.8, repeat: Infinity }} // 加快脉动动画
              />
              <AnimatePresence mode='wait'>
                <motion.span
                  key={phase}
                  className={`${theme.textSecondary} text-sm`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }} // 更快的文本切换
                >
                  {phaseTexts[phase]}
                </motion.span>
              </AnimatePresence>
            </div>
            <motion.span
              className={`${theme.text} text-sm font-medium`}
              key={Math.floor(progress)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }} // 更快的数字变化
            >
              {Math.floor(progress)}%
            </motion.span>
          </div>
        </div>

        {/* 随机提示区域 - 更新为更实用的内容 */}
        <div className='mb-8 px-4 py-3 bg-gray-100/30 dark:bg-gray-800/30 rounded-xl'>
          <div className='flex items-start space-x-3'>
            <div className='mt-1 text-violet-500 dark:text-violet-400 text-lg'>💡</div>
            <div className='flex-1'>
              <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Karin Bot 小贴士</div>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={tipIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }} // 加快动画速度
                  className={`text-sm ${theme.text}`}
                >
                  {loadingTips[tipIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 装饰性功能图标 - 新增 */}
        <div className='flex justify-center mb-8'>
          <div className='flex space-x-4'>
            {['⚙️', '📊', '🔍', '📝', '🗂️'].map((icon, index) => (
              <motion.div
                key={index}
                className={`w-8 h-8 flex items-center justify-center rounded-lg ${theme.textSecondary} bg-gray-200/50 dark:bg-gray-700/30`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.3, // 加快动画
                  delay: 0.1 + index * 0.05, // 减少延迟间隔
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                }}
              >
                <span>{icon}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 底部信息 */}
        <div className='text-center'>
          <motion.p
            className={`${theme.textSecondary} text-xs md:text-sm`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              delay: 0.5, // 减少延迟
              duration: 3,
              repeat: Infinity,
            }}
          >
            永远相信美好的事情即将发生
          </motion.p>
        </div>
      </motion.div>

      {/* 版本信息 */}
      <div className='absolute bottom-4 right-4'>
        <motion.span
          className={`${theme.textSecondary} text-xs opacity-50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.7 }} // 减少延迟
        >
          v1.8.10
        </motion.span>
      </div>
    </div>
  )
}
