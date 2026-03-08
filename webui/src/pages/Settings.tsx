import { useState, useEffect, useCallback } from 'react'
import { getServerConfig, updateServerConfig, getRedisConfig, updateRedisConfig, getLoggerConfig, updateLoggerConfig } from '../api'
import type { ConfigServer, ConfigRedis, ConfigLogger } from '../api'
import { Tabs, Tab, Input, Switch, Button, Card, CardBody, Divider, Select, SelectItem } from "@heroui/react"
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Save, Sun, Moon, Monitor, Globe, Clock, Server, Database, FileText } from 'lucide-react'

type ThemeMode = 'light' | 'dark' | 'system'

const DEFAULT_TIMEOUT = 10000

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

interface SettingsState {
  server: ConfigServer | null
  redis: ConfigRedis | null
  logger: ConfigLogger | null
}

export function Settings () {
  const { t, i18n } = useTranslation()
  const [config, setConfig] = useState<SettingsState>({
    server: null,
    redis: null,
    logger: null,
  })
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme)
  const [requestTimeout, setRequestTimeout] = useState(() => {
    const stored = localStorage.getItem('request_timeout')
    return stored ? Number(stored) : DEFAULT_TIMEOUT
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

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
      const [serverRes, redisRes, loggerRes] = await Promise.all([
        getServerConfig(),
        getRedisConfig(),
        getLoggerConfig(),
      ])
      setConfig({
        server: serverRes.ok ? serverRes.data : null,
        redis: redisRes.ok ? redisRes.data : null,
        logger: loggerRes.ok ? loggerRes.data : null,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      localStorage.setItem('request_timeout', String(requestTimeout))

      const promises = []
      if (config.server) promises.push(updateServerConfig(config.server))
      if (config.redis) promises.push(updateRedisConfig(config.redis))
      if (config.logger) promises.push(updateLoggerConfig(config.logger))
      await Promise.all(promises)
      toast.success(t('settings.saveSuccess'))
    } catch (error) {
      console.error(error)
      toast.error(t('settings.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const updateServerHttp = useCallback(<K extends keyof ConfigServer['http']> (key: K, value: ConfigServer['http'][K]) => {
    setConfig(prev => {
      if (!prev.server) return prev
      return { ...prev, server: { ...prev.server, http: { ...prev.server.http, [key]: value } } }
    })
  }, [])

  const updateServerWs = useCallback(<K extends keyof ConfigServer['ws_server']> (key: K, value: ConfigServer['ws_server'][K]) => {
    setConfig(prev => {
      if (!prev.server) return prev
      return { ...prev, server: { ...prev.server, ws_server: { ...prev.server.ws_server, [key]: value } } }
    })
  }, [])

  const updateRedisState = useCallback(<K extends keyof ConfigRedis> (key: K, value: ConfigRedis[K]) => {
    setConfig(prev => {
      if (!prev.redis) return prev
      return { ...prev, redis: { ...prev.redis, [key]: value } }
    })
  }, [])

  const updateLoggerState = useCallback(<K extends keyof ConfigLogger> (key: K, value: ConfigLogger[K]) => {
    setConfig(prev => {
      if (!prev.logger) return prev
      return { ...prev, logger: { ...prev.logger, [key]: value } }
    })
  }, [])

  const themeOptions = [
    { key: 'light' as const, label: t('settings.theme.light'), icon: Sun },
    { key: 'dark' as const, label: t('settings.theme.dark'), icon: Moon },
    { key: 'system' as const, label: t('settings.theme.system'), icon: Monitor },
  ]

  const inputClasses = {
    inputWrapper: "bg-white/50 dark:bg-zinc-800/50 border-slate-200/60 dark:border-zinc-700 hover:border-slate-300 focus-within:!border-slate-400",
    label: "text-slate-500 dark:text-zinc-400",
    input: "text-slate-800 dark:text-zinc-100"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 scrollbar-hide">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('settings.title')}</h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-1">{t('settings.subtitle')}</p>
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

        <Tabs aria-label="Settings Options" variant="light" classNames={{
          tabList: "gap-4 w-full relative p-1 bg-slate-100/50 dark:bg-zinc-800/50 rounded-lg border border-white/50 dark:border-zinc-700/50",
          cursor: "w-full bg-white dark:bg-zinc-700 shadow-sm border border-slate-200/50 dark:border-zinc-600/50 rounded-md",
          tab: "max-w-fit px-4 h-9",
          tabContent: "group-data-[selected=true]:text-slate-800 dark:group-data-[selected=true]:text-zinc-100 text-slate-500 dark:text-zinc-400 font-medium"
        }}>
          {/* General / Appearance Tab */}
          <Tab key="general" title={
            <div className="flex items-center gap-1.5">
              <Sun size={15} />
              <span>{t('settings.tabs.general')}</span>
            </div>
          }>
            <Card className="mt-4 glass-card" shadow="none">
              <CardBody className="gap-6 p-6">
                {/* Theme Mode */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-3">
                    {t('settings.themeMode')}
                  </label>
                  <div className="flex gap-3">
                    {themeOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setThemeMode(option.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${themeMode === option.key
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
                      {t('settings.language')}
                    </label>
                  </div>
                  <Select
                    selectedKeys={[i18n.language]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string
                      if (selected) i18n.changeLanguage(selected)
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

                <Divider className="bg-slate-200/60 dark:bg-zinc-700/60" />

                {/* Request Timeout */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} className="text-green-500" />
                    <label className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                      {t('settings.network')}
                    </label>
                  </div>
                  <Input
                    label={t('settings.requestTimeout')}
                    description={t('settings.requestTimeoutDesc')}
                    type="number"
                    variant="bordered"
                    autoComplete="off"
                    className="max-w-xs"
                    value={requestTimeout.toString()}
                    onValueChange={(v) => {
                      const val = parseInt(v) || 0
                      setRequestTimeout(val > 0 ? val : DEFAULT_TIMEOUT)
                    }}
                    classNames={inputClasses}
                    endContent={<span className="text-xs text-slate-400">ms</span>}
                  />
                </div>
              </CardBody>
            </Card>
          </Tab>

          {/* Server Tab */}
          <Tab key="server" title={
            <div className="flex items-center gap-1.5">
              <Server size={15} />
              <span>{t('settings.tabs.server')}</span>
            </div>
          }>
            <Card className="mt-4 glass-card" shadow="none">
              <CardBody className="gap-8 p-6">
                {config.server && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label={t('server.host')} variant="bordered" autoComplete="off" classNames={inputClasses}
                        value={config.server.http.host} onValueChange={(v) => updateServerHttp('host', v)} />
                      <Input label={t('server.port')} type="number" variant="bordered" autoComplete="off" classNames={inputClasses}
                        value={config.server.http.port.toString()} onValueChange={(v) => updateServerHttp('port', parseInt(v) || 0)} />
                      <Input label={t('server.authKey')} type="password" variant="bordered" autoComplete="new-password" classNames={inputClasses}
                        value={config.server.http.auth_key} onValueChange={(v) => updateServerHttp('auth_key', v)} />
                      <Input label={t('server.username')} variant="bordered" autoComplete="off" classNames={inputClasses}
                        value={config.server.http.username} onValueChange={(v) => updateServerHttp('username', v)} />
                    </div>

                    <Divider className="bg-slate-200/60 dark:bg-zinc-700/60" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{t('server.wsServer')}</p>
                        <p className="text-small text-slate-500 dark:text-zinc-400">{t('server.enableWs')}</p>
                      </div>
                      <Switch
                        isSelected={config.server.ws_server.enable}
                        onValueChange={(v) => updateServerWs('enable', v)}
                        classNames={{
                          wrapper: "group-data-[selected=true]:bg-slate-800 dark:group-data-[selected=true]:bg-zinc-100",
                        }}
                      />
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Tab>

          {/* Redis Tab */}
          <Tab key="redis" title={
            <div className="flex items-center gap-1.5">
              <Database size={15} />
              <span>Redis</span>
            </div>
          }>
            <Card className="mt-4 glass-card" shadow="none">
              <CardBody className="gap-8 p-6">
                {config.redis && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{t('redis.enable')}</p>
                        <p className="text-small text-slate-500 dark:text-zinc-400">Use Redis for high-performance caching and session storage</p>
                      </div>
                      <Switch
                        isSelected={config.redis.enable}
                        onValueChange={(v) => updateRedisState('enable', v)}
                        classNames={{
                          wrapper: "group-data-[selected=true]:bg-slate-800 dark:group-data-[selected=true]:bg-zinc-100",
                        }}
                      />
                    </div>

                    <Divider className="bg-slate-200/60 dark:bg-zinc-700/60" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label={t('redis.url')} variant="bordered" autoComplete="off" classNames={inputClasses}
                        value={config.redis.url} onValueChange={(v) => updateRedisState('url', v)}
                        isDisabled={!config.redis.enable} className="md:col-span-2" />
                      <Input label={t('redis.database')} type="number" variant="bordered" autoComplete="off" classNames={inputClasses}
                        value={config.redis.database.toString()} onValueChange={(v) => updateRedisState('database', parseInt(v) || 0)}
                        isDisabled={!config.redis.enable} />
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Tab>

          {/* Logger Tab */}
          <Tab key="logger" title={
            <div className="flex items-center gap-1.5">
              <FileText size={15} />
              <span>{t('settings.tabs.logger')}</span>
            </div>
          }>
            <Card className="mt-4 glass-card" shadow="none">
              <CardBody className="gap-6 p-6">
                {config.logger && (
                  <Input
                    label={t('logger.level')}
                    variant="bordered"
                    autoComplete="off"
                    classNames={inputClasses}
                    value={config.logger.level}
                    onValueChange={(v) => updateLoggerState('level', v)}
                    description="Available levels: info, warn, error, debug"
                  />
                )}
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}
