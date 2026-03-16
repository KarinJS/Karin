import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Button, Card, CardBody } from '@heroui/react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Logo } from '../components/Logo'
import { motion } from 'framer-motion'

export function Login () {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      toast.error(t('login.emptyFields', '请填写用户名和密码'))
      return
    }

    setLoading(true)
    try {
      // TODO: 后续对接实际登录 API
      await new Promise(resolve => setTimeout(resolve, 300))
      localStorage.setItem('auth_token', 'temp_token')
      toast.success(t('login.success', '登录成功'))
      navigate('/', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] dark:bg-[#09090b] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-125 h-125 bg-rose-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <Card shadow="none" className="glass-panel">
          <CardBody className="p-8 sm:p-10">
            {/* Logo & Title */}
            <div className="flex flex-col items-center mb-8">
              <Logo className="w-12 h-12 mb-4" />
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {t('login.title', 'Karin')}
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                {t('login.subtitle', '登录以管理您的机器人实例')}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label={t('login.username', '用户名')}
                placeholder={t('login.usernamePlaceholder', '请输入用户名')}
                value={username}
                onValueChange={setUsername}
                variant="bordered"
                autoComplete="username"
                classNames={{
                  inputWrapper: "bg-white/50 dark:bg-zinc-900/50 border-slate-200/60 dark:border-zinc-700 hover:border-slate-300 focus-within:!border-slate-400",
                  label: "text-slate-500 dark:text-zinc-400",
                  input: "text-slate-800 dark:text-zinc-100"
                }}
              />
              <Input
                label={t('login.password', '密码')}
                placeholder={t('login.passwordPlaceholder', '请输入密码')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                autoComplete="current-password"
                classNames={{
                  inputWrapper: "bg-white/50 dark:bg-zinc-900/50 border-slate-200/60 dark:border-zinc-700 hover:border-slate-300 focus-within:!border-slate-400",
                  label: "text-slate-500 dark:text-zinc-400",
                  input: "text-slate-800 dark:text-zinc-100"
                }}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <Button
                type="submit"
                isLoading={loading}
                startContent={!loading && <LogIn size={18} />}
                className="w-full bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-lg shadow-slate-800/20 dark:shadow-zinc-100/10"
              >
                {t('login.submit', '登录')}
              </Button>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}
