import { useState, useEffect } from 'react'
import { getLoggerConfig, updateLoggerConfig } from '../../api'
import type { ConfigLogger } from '../../api'
import {
  Input,
  Select,
  SelectItem,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@heroui/react"
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LoadingSpinner, SaveButton } from './common'
import { HelpCircle, Palette } from 'lucide-react'

// 预设颜色列表
const presetColors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#6366F1', // indigo
]

/**
 * 日志配置组件
 */
export function LoggerConfig () {
  const { t } = useTranslation()
  const [config, setConfig] = useState<ConfigLogger | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await getLoggerConfig()
        if (res.ok && res.data) {
          setConfig(res.data)
        }
      } catch (error) {
        console.error(error)
        toast.error(t('logger.loadError', '加载日志配置失败'))
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
      const res = await updateLoggerConfig(config)
      if (res.ok) {
        toast.success(t('logger.saveSuccess', '日志配置已保存'))
      } else {
        toast.error(res.message || t('logger.saveError', '保存失败'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('logger.saveError', '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  if (loading || !config) return <LoadingSpinner />

  const logLevels = [
    { key: 'debug', label: 'Debug', color: 'text-default-500' },
    { key: 'info', label: 'Info', color: 'text-primary' },
    { key: 'warn', label: 'Warn', color: 'text-warning' },
    { key: 'error', label: 'Error', color: 'text-danger' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <SaveButton saving={saving} onPress={handleSave} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label={t('logger.level', '日志级别')}
          selectedKeys={[config.level]}
          onChange={(e) => setConfig({
            ...config,
            level: e.target.value as ConfigLogger['level']
          })}
          description={t('logger.levelDesc', '只输出此级别及以上的日志')}
          classNames={{
            value: logLevels.find(l => l.key === config.level)?.color
          }}
        >
          {logLevels.map((level) => (
            <SelectItem key={level.key} className={level.color}>
              {level.label}
            </SelectItem>
          ))}
        </Select>

        <Input
          label={t('logger.daysToKeep', '日志保留天数')}
          type="number"
          min={1}
          max={365}
          value={String(config.days_to_keep)}
          onValueChange={(v) => setConfig({
            ...config,
            days_to_keep: Number(v) || 7
          })}
          description={t('logger.daysToKeepDesc', '超过此天数的日志将被自动删除')}
        />

        <Input
          label={t('logger.maxLogSize', '单文件最大大小')}
          type="number"
          min={1}
          value={String(config.max_log_size)}
          onValueChange={(v) => setConfig({
            ...config,
            max_log_size: Number(v) || 10485760
          })}
          description={t('logger.maxLogSizeDesc', '单位：字节，默认 10MB')}
          endContent={
            <div className="text-default-400 text-sm">
              {(config.max_log_size / 1024 / 1024).toFixed(1)} MB
            </div>
          }
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">{t('logger.functionColor', '函数名颜色')}</label>
            <Tooltip content={t('logger.functionColorHint', '日志中函数名的显示颜色')}>
              <HelpCircle size={14} className="text-default-400" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-3">
            <Input
              value={config.fnc_color}
              onValueChange={(v) => setConfig({ ...config, fnc_color: v })}
              placeholder="#3B82F6"
              startContent={
                <div
                  className="w-5 h-5 rounded-md border border-default-300"
                  style={{ backgroundColor: config.fnc_color }}
                />
              }
              className="flex-1"
            />
            <Popover placement="bottom">
              <PopoverTrigger>
                <button className="p-2 rounded-lg bg-default-100 hover:bg-default-200 transition-colors">
                  <Palette size={20} className="text-default-600" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-3">
                  <p className="text-sm font-medium mb-2">{t('logger.presetColors', '预设颜色')}</p>
                  <div className="grid grid-cols-5 gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-primary transition-colors"
                        style={{ backgroundColor: color }}
                        onClick={() => setConfig({ ...config, fnc_color: color })}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-xs text-default-500">
            {t('logger.functionColorDesc', '支持十六进制颜色值')}
          </p>
        </div>
      </div>

      {/* 预览 */}
      <div className="p-4 rounded-xl bg-default-900 text-white font-mono text-sm">
        <p className="text-default-400 mb-2">{t('logger.preview', '日志预览')}</p>
        <div className="space-y-1">
          <p>
            <span className="text-default-500">[2026-01-03 12:00:00]</span>
            <span className="text-primary ml-2">[INFO]</span>
            <span style={{ color: config.fnc_color }} className="ml-2">[MyPlugin.hello]</span>
            <span className="ml-2">Hello, World!</span>
          </p>
          <p>
            <span className="text-default-500">[2026-01-03 12:00:01]</span>
            <span className="text-warning ml-2">[WARN]</span>
            <span style={{ color: config.fnc_color }} className="ml-2">[MyPlugin.check]</span>
            <span className="ml-2">Something needs attention</span>
          </p>
        </div>
      </div>
    </div>
  )
}
