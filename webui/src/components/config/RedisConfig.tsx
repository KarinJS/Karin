import { useState, useEffect } from 'react'
import { getRedisConfig, updateRedisConfig } from '../../api'
import type { ConfigRedis } from '../../api'
import {
  Input,
  Switch,
  Tooltip,
  Chip
} from "@heroui/react"
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LoadingSpinner, SaveButton } from './common'
import { HelpCircle, Eye, EyeOff, Database, CheckCircle, XCircle } from 'lucide-react'

/**
 * Redis 配置组件
 */
export function RedisConfig () {
  const { t } = useTranslation()
  const [config, setConfig] = useState<ConfigRedis | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await getRedisConfig()
        if (res.ok && res.data) {
          setConfig(res.data)
        }
      } catch (error) {
        console.error(error)
        toast.error(t('redis.loadError', '加载 Redis 配置失败'))
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [t])

  const handleSave = async () => {
    if (!config) return
    setSaving(true)
    try {
      const res = await updateRedisConfig(config)
      if (res.ok) {
        toast.success(t('redis.saveSuccess', 'Redis 配置已保存'))
      } else {
        toast.error(res.message || t('redis.saveError', '保存失败'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('redis.saveError', '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  if (loading || !config) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database size={24} className="text-danger" />
          <div>
            <h3 className="text-lg font-medium">{t('redis.title', 'Redis 配置')}</h3>
            <p className="text-sm text-default-500">
              {t('redis.subtitle', '用于缓存和数据持久化')}
            </p>
          </div>
          <Chip
            size="sm"
            color={config.enable ? 'success' : 'default'}
            variant="flat"
            startContent={config.enable ? <CheckCircle size={14} /> : <XCircle size={14} />}
          >
            {config.enable ? t('redis.enabled', '已启用') : t('redis.disabled', '已禁用')}
          </Chip>
        </div>
        <SaveButton saving={saving} onPress={handleSave} />
      </div>

      {/* 启用开关 */}
      <div className="flex items-center justify-between p-4 border rounded-xl bg-default-50">
        <div className="flex items-center gap-2">
          <span className="font-medium">{t('redis.enable', '启用 Redis')}</span>
          <Tooltip content={t('redis.enableHint', '启用后将使用 Redis 进行数据缓存')}>
            <HelpCircle size={14} className="text-default-400" />
          </Tooltip>
        </div>
        <Switch
          isSelected={config.enable}
          onValueChange={(v) => setConfig({ ...config, enable: v })}
          color="success"
        />
      </div>

      {/* 连接配置 */}
      <div className={`space-y-4 transition-opacity ${!config.enable ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="p-5 rounded-xl bg-default-50 border border-default-200">
          <h4 className="text-base font-medium mb-4">{t('redis.connection', '连接配置')}</h4>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label={t('redis.url', '连接地址')}
              value={config.url}
              onValueChange={(v) => setConfig({ ...config, url: v })}
              description={t('redis.urlDesc', '支持 redis:// 或 rediss:// 协议')}
              placeholder="redis://127.0.0.1:6379"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('redis.username', '用户名')}
                value={config.username}
                onValueChange={(v) => setConfig({ ...config, username: v })}
                description={t('redis.usernameDesc', '留空表示无需认证')}
                placeholder={t('redis.optional', '可选')}
              />
              <Input
                label={t('redis.password', '密码')}
                type={showPassword ? 'text' : 'password'}
                value={config.password}
                onValueChange={(v) => setConfig({ ...config, password: v })}
                description={t('redis.passwordDesc', '留空表示无需密码')}
                placeholder={t('redis.optional', '可选')}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-default-400 hover:text-default-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>

            <Input
              label={t('redis.database', '数据库索引')}
              type="number"
              min={0}
              max={15}
              value={String(config.database)}
              onValueChange={(v) => setConfig({ ...config, database: Number(v) || 0 })}
              description={t('redis.databaseDesc', 'Redis 数据库编号 (0-15)')}
            />
          </div>
        </div>

        {/* 连接信息预览 */}
        <div className="p-4 rounded-xl bg-default-100 border border-default-200">
          <p className="text-sm font-medium mb-2">{t('redis.connectionPreview', '连接字符串预览')}</p>
          <code className="text-xs text-default-600 break-all">
            {config.username || config.password
              ? `redis://${config.username || ''}${config.password ? ':***' : ''}${config.username || config.password ? '@' : ''}${config.url.replace(/^redis(s)?:\/\//, '')}/${config.database}`
              : `${config.url}/${config.database}`
            }
          </code>
        </div>
      </div>
    </div>
  )
}
