import { useState, useEffect, useCallback } from 'react'
import { Input, Switch, Card, CardBody, Button, Divider, Select, SelectItem } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Save, Server, Sun, Moon, Monitor, Globe } from 'lucide-react'
import { getServerConfig, updateServerConfig } from '../api'
import type { ConfigServer } from '../api'

type ThemeMode = 'light' | 'dark' | 'system'

function getInitialTheme (): ThemeMode {
  return (localStorage.getItem('theme_mode') as ThemeMode) || 'system'
}

function applyTheme (mode: ThemeMode) {
  const root = document.documentElement
  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  } else {
    root.classList.toggle('dark', mode === 'dark')
  }
  localStorage.setItem('theme_mode', mode)
}

export function SystemSettings () {
  const { t, i18n } = useTranslation()
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme)
  const [serverConfig, setServerConfig] = useState<ConfigServer | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  // Listen for system theme changes when in system mode
  useEffect(() => {
    applyTheme(themeMode)

    if (themeMode !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [themeMode])

  const loadConfig = async () => {
    try {
      const res = await getServerConfig()
      if (res.ok && res.data) {
        setServerConfig(res.data)
      }
    } catch (error) {
      console.error('Failed to load server config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!serverConfig) return
    setSaving(true)
    try {
      const res = await updateServerConfig(serverConfig)
      if (res.ok) {
        toast.success(t('systemSettings.saveSuccess', '系统设置保存成功'))
      } else {
        toast.error(res.message || t('systemSettings.saveError', '保存失败'))
      }
    } catch {
      toast.error(t('systemSettings.saveError', '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  const updateHttp = useCallback(<K extends keyof ConfigServer['http']> (key: K, value: ConfigServer['http'][K]) => {
    setServerConfig(prev => {
      if (!prev) return prev
      return { ...prev, http: { ...prev.http, [key]: value } }
    })
  }, [])

  const updateWs = useCallback(<K extends keyof ConfigServer['ws_server']> (key: K, value: ConfigServer['ws_server'][K]) => {
    setServerConfig(prev => {
      if (!prev) return prev
      return { ...prev, ws_server: { ...prev.ws_server, [key]: value } }
    })
  }, [])

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode)
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  const themeOptions = [
    { key: 'light' as const, label: t('systemSettings.theme.light', '浅色'), icon: Sun },
    { key: 'dark' as const, label: t('systemSettings.theme.dark', '深色'), icon: Moon },
    { key: 'system' as const, label: t('systemSettings.theme.system', '跟随系统'), icon: Monitor },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 scrollbar-hide">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {t('systemSettings.title', '系统设置')}
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-1">
              {t('systemSettings.subtitle', '管理服务器配置与前端显示偏好')}
            </p>
          </div>
          <Button
            isLoading={saving}
            startContent={!saving && <Save size={18} />}
            onPress={handleSave}
            className="bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-lg shadow-slate-800/20"
          >
            {t('common.save')}
          </Button>
        </div>

        {/* Theme Settings */}
        <Card shadow="none" className="glass-card">
          <CardBody className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Sun size={20} className="text-amber-500" />
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {t('systemSettings.appearance', '外观设置')}
              </h2>
            </div>

            {/* Theme Mode */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-3">
                {t('systemSettings.themeMode', '主题模式')}
              </label>
              <div className="flex gap-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleThemeChange(option.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                      themeMode === option.key
                        ? 'bg-slate-800 dark:bg-zinc-100 text-white dark:text-zinc-900 border-slate-800 dark:border-zinc-100 shadow-md'
                        : 'bg-white/50 dark:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <option.icon size={16} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Divider className="bg-slate-200/60 dark:bg-zinc-700/60" />

            {/* Language */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} className="text-slate-500" />
                <label className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                  {t('systemSettings.language', '界面语言')}
                </label>
              </div>
              <Select
                selectedKeys={[i18n.language]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  if (selected) handleLanguageChange(selected)
                }}
                variant="bordered"
                className="max-w-xs"
                classNames={{
                  trigger: "bg-white/50 dark:bg-zinc-800/50 border-slate-200/60 dark:border-zinc-700",
                  value: "text-slate-800 dark:text-zinc-100",
                }}
              >
                <SelectItem key="zh">中文</SelectItem>
                <SelectItem key="en">English</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* HTTP Server Settings */}
        {serverConfig && (
          <Card shadow="none" className="glass-card">
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Server size={20} className="text-blue-500" />
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {t('systemSettings.httpServer', 'HTTP 服务器')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('server.host', '主机地址')}
                  variant="bordered"
                  autoComplete="off"
                  value={serverConfig.http.host}
                  onValueChange={(v) => updateHttp('host', v)}
                  classNames={{
                    inputWrapper: "bg-white/50 dark:bg-zinc-800/50 border-slate-200/60 dark:border-zinc-700 hover:border-slate-300 focus-within:!border-slate-400",
                    label: "text-slate-500 dark:text-zinc-400",
                    input: "text-slate-800 dark:text-zinc-100"
                  }}
                />
                <Input
                  label={t('server.port', '端口')}
                  type="number"
                  variant="bordered"
                  autoComplete="off"
                  value={serverConfig.http.port.toString()}
                  onValueChange={(v) => updateHttp('port', parseInt(v) || 0)}
                  classNames={{
                    inputWrapper: "bg-white/50 dark:bg-zinc-800/50 border-slate-200/60 dark:border-zinc-700 hover:border-slate-300 focus-within:!border-slate-400",
                    label: "text-slate-500 dark:text-zinc-400",
                    input: "text-slate-800 dark:text-zinc-100"
                  }}
                />
                <Input
                  label={t('server.username', '用户名')}
                  variant="bordered"
                  autoComplete="off"
                  value={serverConfig.http.username}
                  onValueChange={(v) => updateHttp('username', v)}
                  classNames={{
                    inputWrapper: "bg-white/50 dark:bg-zinc-800/50 border-slate-200/60 dark:border-zinc-700 hover:border-slate-300 focus-within:!border-slate-400",
                    label: "text-slate-500 dark:text-zinc-400",
                    input: "text-slate-800 dark:text-zinc-100"
                  }}
                />
                <Input
                  label={t('server.authKey', '认证密钥')}
                  type="password"
                  variant="bordered"
                  autoComplete="new-password"
                  value={serverConfig.http.auth_key}
                  onValueChange={(v) => updateHttp('auth_key', v)}
                  classNames={{
                    inputWrapper: "bg-white/50 dark:bg-zinc-800/50 border-slate-200/60 dark:border-zinc-700 hover:border-slate-300 focus-within:!border-slate-400",
                    label: "text-slate-500 dark:text-zinc-400",
                    input: "text-slate-800 dark:text-zinc-100"
                  }}
                />
              </div>

              <Divider className="bg-slate-200/60 dark:bg-zinc-700/60" />

              {/* WebSocket */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {t('server.wsServer', 'WebSocket 服务器')}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    {t('server.enableWs', '启用 WebSocket')}
                  </p>
                </div>
                <Switch
                  isSelected={serverConfig.ws_server.enable}
                  onValueChange={(v) => updateWs('enable', v)}
                  classNames={{
                    wrapper: "group-data-[selected=true]:bg-slate-800 dark:group-data-[selected=true]:bg-zinc-100",
                  }}
                />
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
