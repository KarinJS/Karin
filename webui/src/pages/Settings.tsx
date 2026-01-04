import { useState, useEffect } from 'react'
import { getServerConfig, updateServerConfig, getRedisConfig, updateRedisConfig, getLoggerConfig, updateLoggerConfig } from '../api'
import type { ConfigServer, ConfigRedis, ConfigLogger } from '../api'
import { Tabs, Tab, Input, Switch, Button, Card, CardBody, Divider } from "@heroui/react"
import { useTranslation } from 'react-i18next'
import { Save } from 'lucide-react'

interface SettingsState {
  server: ConfigServer | null
  redis: ConfigRedis | null
  logger: ConfigLogger | null
}

export function Settings () {
  const { t } = useTranslation()
  const [config, setConfig] = useState<SettingsState>({
    server: null,
    redis: null,
    logger: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

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
      const promises = []
      if (config.server) promises.push(updateServerConfig(config.server))
      if (config.redis) promises.push(updateRedisConfig(config.redis))
      if (config.logger) promises.push(updateLoggerConfig(config.logger))
      await Promise.all(promises)
      // Show success toast
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const updateServerHttp = <K extends keyof ConfigServer['http']> (key: K, value: ConfigServer['http'][K]) => {
    if (!config.server) return
    setConfig({
      ...config,
      server: {
        ...config.server,
        http: { ...config.server.http, [key]: value }
      }
    })
  }

  const updateServerWs = <K extends keyof ConfigServer['ws_server']> (key: K, value: ConfigServer['ws_server'][K]) => {
    if (!config.server) return
    setConfig({
      ...config,
      server: {
        ...config.server,
        ws_server: { ...config.server.ws_server, [key]: value }
      }
    })
  }

  const updateRedisState = <K extends keyof ConfigRedis> (key: K, value: ConfigRedis[K]) => {
    if (!config.redis) return
    setConfig({
      ...config,
      redis: { ...config.redis, [key]: value }
    })
  }

  const updateLoggerState = <K extends keyof ConfigLogger> (key: K, value: ConfigLogger[K]) => {
    if (!config.logger) return
    setConfig({
      ...config,
      logger: { ...config.logger, [key]: value }
    })
  }

  if (loading || !config.server || !config.redis || !config.logger) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t('settings.title')}</h1>
            <p className="text-slate-500 mt-1">{t('settings.subtitle')}</p>
          </div>
          <Button
            isLoading={saving}
            startContent={!saving && <Save size={18} />}
            onPress={handleSave}
            className="bg-slate-800 text-white font-semibold shadow-lg shadow-slate-800/20"
          >
            {t('common.save')}
          </Button>
        </div>

        <Tabs aria-label="Settings Options" variant="light" classNames={{
          tabList: "gap-4 w-full relative p-1 bg-slate-100/50 rounded-lg border border-white/50",
          cursor: "w-full bg-white shadow-sm border border-slate-200/50 rounded-md",
          tab: "max-w-fit px-4 h-9",
          tabContent: "group-data-[selected=true]:text-slate-800 text-slate-500 font-medium"
        }}>
          <Tab key="server" title="Server">
            <Card className="mt-4 glass-card" shadow="none">
              <CardBody className="gap-8 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="HTTP Port"
                    type="number"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-white/50 border-slate-200/60 hover:border-slate-300 focus-within:!border-slate-400",
                      label: "text-slate-500",
                      input: "text-slate-800"
                    }}
                    value={config.server.http.port.toString()}
                    onValueChange={(v) => updateServerHttp('port', parseInt(v) || 0)}
                  />
                  <Input
                    label="Host"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-white/50 border-slate-200/60 hover:border-slate-300 focus-within:!border-slate-400",
                      label: "text-slate-500",
                      input: "text-slate-800"
                    }}
                    value={config.server.http.host}
                    onValueChange={(v) => updateServerHttp('host', v)}
                  />
                  <Input
                    label="Auth Key"
                    type="password"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-white/50 border-slate-200/60 hover:border-slate-300 focus-within:!border-slate-400",
                      label: "text-slate-500",
                      input: "text-slate-800"
                    }}
                    value={config.server.http.auth_key}
                    onValueChange={(v) => updateServerHttp('auth_key', v)}
                  />
                  <Input
                    label="Username"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-white/50 border-slate-200/60 hover:border-slate-300 focus-within:!border-slate-400",
                      label: "text-slate-500",
                      input: "text-slate-800"
                    }}
                    value={config.server.http.username}
                    onValueChange={(v) => updateServerHttp('username', v)}
                  />
                </div>

                <Divider className="bg-slate-200/60" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">WebSocket Server</p>
                    <p className="text-small text-slate-500">Enable WebSocket support for real-time communication</p>
                  </div>
                  <Switch
                    isSelected={config.server.ws_server.enable}
                    onValueChange={(v) => updateServerWs('enable', v)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-slate-800",
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="redis" title="Redis">
            <Card className="mt-4 glass-card" shadow="none">
              <CardBody className="gap-8 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Enable Redis</p>
                    <p className="text-small text-slate-500">Use Redis for high-performance caching and session storage</p>
                  </div>
                  <Switch
                    isSelected={config.redis.enable}
                    onValueChange={(v) => updateRedisState('enable', v)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-slate-800",
                    }}
                  />
                </div>

                <Divider className="bg-slate-200/60" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Redis URL"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-white/50 border-slate-200/60 hover:border-slate-300 focus-within:!border-slate-400",
                      label: "text-slate-500",
                      input: "text-slate-800"
                    }}
                    value={config.redis.url}
                    onValueChange={(v) => updateRedisState('url', v)}
                    isDisabled={!config.redis.enable}
                    className="md:col-span-2"
                  />

                  <Input
                    label="Database Index"
                    type="number"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-white/50 border-slate-200/60 hover:border-slate-300 focus-within:!border-slate-400",
                      label: "text-slate-500",
                      input: "text-slate-800"
                    }}
                    value={config.redis.database.toString()}
                    onValueChange={(v) => updateRedisState('database', parseInt(v) || 0)}
                    isDisabled={!config.redis.enable}
                  />
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="logger" title="Logger">
            <Card className="mt-4 glass-card" shadow="none">
              <CardBody className="gap-6 p-6">
                <Input
                  label="Log Level"
                  variant="bordered"
                  classNames={{
                    inputWrapper: "bg-white/50 border-slate-200/60 hover:border-slate-300 focus-within:!border-slate-400",
                    label: "text-slate-500",
                    input: "text-slate-800"
                  }}
                  value={config.logger.level}
                  onValueChange={(v) => updateLoggerState('level', v)}
                  description="Available levels: info, warn, error, debug"
                />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}
