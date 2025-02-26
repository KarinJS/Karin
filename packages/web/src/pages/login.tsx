import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Image } from '@heroui/image'
import { request } from '@/lib/request'
import { useLocalStorageState } from 'ahooks'
import key from '@/consts/key.ts'
import { Controller, useForm } from 'react-hook-form'
import { loginSchema } from '@/schema/user'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Form } from '@/components/form'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import SplashCursor from '@/components/SplashCursor'

export default function LoginPage () {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [_, setToken] = useLocalStorageState<string>(key.token, {
    defaultValue: '',
  })
  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      token: '',
    },
    resolver: zodResolver(loginSchema),
  })
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setToken(data.token)
    try {
      await request.post('/api/v1/login')
      toast.success('登录成功')
      navigate(from, { replace: true })
    } catch (error) {
      const err = error as Error
      toast.error(`登录失败: ${err.message}`)
    }
  }

  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-[#f8f9ff] dark:bg-neutral-950 flex justify-center items-center'>
      {/* 装饰性背景元素 */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-200/30 to-transparent rounded-full blur-3xl dark:from-violet-900/20' />
        <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl dark:from-blue-900/20' />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/web/grid.svg')] opacity-[0.02]" />
      </div>

      {/* 主要内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-[90%] max-w-[400px] relative z-10'
      >
        <div className='relative bg-white/20 dark:bg-neutral-900/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-neutral-800/20'>
          <div className='p-8 flex flex-col items-center'>
            {/* Logo和标题区域 */}
            <div className='flex flex-col items-center space-y-6 mb-12'>
              <motion.div
                initial={{ scale: 0.5, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.7,
                  type: 'spring',
                  stiffness: 200
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
                      ease: 'easeInOut'
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
                      stiffness: 100
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
                      damping: 10
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
                transition={{ duration: 0.5, delay: 0.3 }}
                className='text-center space-y-2'
              >
                <h1 className='text-2xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent'>
                  Karin WebUI
                </h1>
                <p className='text-sm text-neutral-500 dark:text-neutral-400'>
                  欢迎回来，请输入密码继续
                </p>
              </motion.div>
            </div>

            {/* 表单区域 */}
            <Form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full max-w-[280px] flex flex-col items-center'
              errors={form.formState.errors}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className='w-full'
              >
                <Controller
                  render={({ field }) => (
                    <Input
                      type='password'
                      label='密码'
                      className='rounded-xl w-full bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-700/50 focus:border-violet-500 dark:focus:border-violet-500 transition-all duration-200'
                      placeholder='请输入密码'
                      {...field}
                    />
                  )}
                  name='token'
                  control={form.control}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className='w-full mt-8'
              >
                <style>
                  {`
                    @keyframes gradientMove {
                      0% {
                        background-position: 100% 0;
                      }
                      50% {
                        background-position: 0 0;
                      }
                      100% {
                        background-position: -100% 0;
                      }
                    }
                    .gradient-animate {
                      background-size: 200% 100%;
                      animation: gradientMove 5s linear infinite;
                    }
                  `}
                </style>
                <Button
                  type='submit'
                  size='lg'
                  color='primary'
                  variant='shadow'
                  className='w-full relative overflow-hidden bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500 hover:from-violet-600 hover:via-blue-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-500/25 gradient-animate'
                >
                  登录
                </Button>
              </motion.div>
            </Form>
          </div>
        </div>

        {/* 页脚 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className='mt-8 text-center'
        >
          <div className='flex justify-center items-center gap-4 mb-6'>
            <a
              href='https://github.com/KarinJS/Karin'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-violet-500 dark:hover:text-violet-400'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
              </svg>
              GitHub
            </a>
            <span className='text-neutral-300 dark:text-neutral-600'>•</span>
            <a
              href='https://docs.karin.fun'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-violet-500 dark:hover:text-violet-400'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' />
                <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' />
              </svg>
              文档
            </a>
          </div>
          <div className='flex flex-col items-center space-y-2'>
            <div className='text-xs text-neutral-400 dark:text-neutral-500 flex items-center space-x-1.5'>
              <span>Made with</span>
              <svg className='w-3.5 h-3.5 text-red-500 animate-pulse' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
              </svg>
              <span>by KarinJS Team</span>
            </div>
            <p className='text-xs text-neutral-400 dark:text-neutral-500'>
              © {new Date().getFullYear()} KarinJS. All rights reserved.
            </p>
          </div>
        </motion.div>
      </motion.div>
      <SplashCursor />
    </div>
  )
}
