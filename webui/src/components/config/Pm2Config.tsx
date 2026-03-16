import { useState, useEffect, useCallback } from 'react'
import { getPm2Config, updatePm2Config } from '../../api'
import type { ConfigPm2 } from '../../api'
import {
  Input,
  Switch,
  Accordion,
  AccordionItem,
  Tabs,
  Tab
} from "@heroui/react"
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LoadingSpinner, SaveButton, JsonEditor } from './common'
import { Cpu, AlertTriangle, Settings, Code } from 'lucide-react'

/**
 * PM2 配置 JSON 验证函数
 */
function validatePm2Config (config: unknown): string | null {
  if (!config || typeof config !== 'object') {
    return '配置必须是一个对象'
  }

  const cfg = config as Record<string, unknown>

  // 验证 lines 字段
  if ('lines' in cfg && typeof cfg.lines !== 'number') {
    return 'lines 必须是数字类型'
  }

  // 验证 apps 字段
  if ('apps' in cfg) {
    if (!Array.isArray(cfg.apps)) {
      return 'apps 必须是数组类型'
    }

    for (let i = 0; i < cfg.apps.length; i++) {
      const app = cfg.apps[i] as Record<string, unknown>
      if (!app || typeof app !== 'object') {
        return `apps[${i}] 必须是对象类型`
      }

      // 验证必需字段
      if (typeof app.name !== 'string' || !app.name) {
        return `apps[${i}].name 是必需的且必须是非空字符串`
      }
      if (typeof app.script !== 'string' || !app.script) {
        return `apps[${i}].script 是必需的且必须是非空字符串`
      }

      // 验证可选字段类型
      if ('autorestart' in app && typeof app.autorestart !== 'boolean') {
        return `apps[${i}].autorestart 必须是布尔类型`
      }
      if ('max_restarts' in app && typeof app.max_restarts !== 'number') {
        return `apps[${i}].max_restarts 必须是数字类型`
      }
      if ('max_memory_restart' in app && typeof app.max_memory_restart !== 'string') {
        return `apps[${i}].max_memory_restart 必须是字符串类型`
      }
      if ('restart_delay' in app && typeof app.restart_delay !== 'number') {
        return `apps[${i}].restart_delay 必须是数字类型`
      }
      if ('merge_logs' in app && typeof app.merge_logs !== 'boolean') {
        return `apps[${i}].merge_logs 必须是布尔类型`
      }
    }
  }

  return null
}

/**
 * PM2 配置组件
 */
export function Pm2Config () {
  const { t } = useTranslation()
  const [config, setConfig] = useState<ConfigPm2 | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState<'form' | 'json'>('form')

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await getPm2Config()
        if (res.ok && res.data) {
          setConfig(res.data)
        }
      } catch (error) {
        console.error(error)
        toast.error(t('pm2.loadError', '加载 PM2 配置失败'))
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
      const res = await updatePm2Config(config)
      if (res.ok) {
        toast.success(t('pm2.saveSuccess', 'PM2 配置已保存'))
      } else {
        toast.error(res.message || t('pm2.saveError', '保存失败'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('pm2.saveError', '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  const handleJsonChange = useCallback((newConfig: ConfigPm2) => {
    setConfig(newConfig)
  }, [])

  if (loading || !config) return <LoadingSpinner />

  // 渲染单个应用配置的表单
  const renderAppForm = (app: ConfigPm2['apps'][0], index: number) => {
    const updateApp = (key: string, value: unknown) => {
      const newApps = [...config.apps]
      newApps[index] = { ...newApps[index], [key]: value }
      setConfig({ ...config, apps: newApps })
    }

    return (
      <AccordionItem
        key={`app-${index}`}
        title={app.name || `App ${index + 1}`}
        subtitle={app.script}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Input
            label={t('pm2.appName', '应用名称')}
            value={app.name}
            onValueChange={(v) => updateApp('name', v)}
          />
          <Input
            label={t('pm2.script', '启动脚本')}
            value={app.script}
            onValueChange={(v) => updateApp('script', v)}
          />
          <Input
            label={t('pm2.maxRestarts', '最大重启次数')}
            type="number"
            value={String(app.max_restarts)}
            onValueChange={(v) => updateApp('max_restarts', Number(v))}
          />
          <Input
            label={t('pm2.maxMemory', '内存限制重启')}
            value={app.max_memory_restart}
            onValueChange={(v) => updateApp('max_memory_restart', v)}
            description={t('pm2.maxMemoryDesc', '例如: 1G, 500M')}
          />
          <Input
            label={t('pm2.restartDelay', '重启延迟(ms)')}
            type="number"
            value={String(app.restart_delay)}
            onValueChange={(v) => updateApp('restart_delay', Number(v))}
          />
          <Input
            label={t('pm2.errorFile', '错误日志文件')}
            value={app.error_file}
            onValueChange={(v) => updateApp('error_file', v)}
          />
          <Input
            label={t('pm2.outFile', '输出日志文件')}
            value={app.out_file}
            onValueChange={(v) => updateApp('out_file', v)}
          />
          <div className="flex items-center justify-between p-3 border rounded-xl bg-default-50">
            <span>{t('pm2.autorestart', '自动重启')}</span>
            <Switch
              isSelected={app.autorestart}
              onValueChange={(v) => updateApp('autorestart', v)}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-xl bg-default-50">
            <span>{t('pm2.mergeLogs', '合并日志')}</span>
            <Switch
              isSelected={app.merge_logs}
              onValueChange={(v) => updateApp('merge_logs', v)}
            />
          </div>
        </div>
      </AccordionItem>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu size={24} className="text-primary" />
          <div>
            <h3 className="text-lg font-medium">{t('pm2.title', 'PM2 进程管理')}</h3>
            <p className="text-sm text-default-500">
              {t('pm2.subtitle', '管理应用进程、重启策略等')}
            </p>
          </div>
        </div>
        <SaveButton saving={saving} onPress={handleSave} />
      </div>

      {/* 警告提示 */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-warning-50 border border-warning-200">
        <AlertTriangle size={20} className="text-warning-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warning-700">
            {t('pm2.warning', '注意事项')}
          </p>
          <p className="text-sm text-warning-600 mt-1">
            {t('pm2.warningDesc', 'PM2 配置修改后需要重启应用才能生效。修改不当可能导致应用无法启动。')}
          </p>
        </div>
      </div>

      {/* 编辑模式切换 */}
      <Tabs
        selectedKey={editMode}
        onSelectionChange={(key) => setEditMode(key as 'form' | 'json')}
        aria-label={t('pm2.editMode', '编辑模式')}
      >
        <Tab
          key="form"
          title={
            <div className="flex items-center gap-2">
              <Settings size={16} />
              <span>{t('pm2.formMode', '表单模式')}</span>
            </div>
          }
        />
        <Tab
          key="json"
          title={
            <div className="flex items-center gap-2">
              <Code size={16} />
              <span>{t('pm2.jsonMode', 'JSON 模式')}</span>
            </div>
          }
        />
      </Tabs>

      {editMode === 'form' ? (
        <>
          {/* 全局配置 */}
          <div className="p-5 rounded-xl bg-default-50 border border-default-200">
            <h4 className="font-medium mb-4">{t('pm2.globalConfig', '全局配置')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('pm2.lines', '日志行数')}
                type="number"
                value={String(config.lines)}
                onValueChange={(v) => setConfig({ ...config, lines: Number(v) })}
                description={t('pm2.linesDesc', 'PM2 日志显示的行数')}
              />
            </div>
          </div>

          {/* 应用配置 */}
          <Accordion selectionMode="multiple" defaultExpandedKeys={['app-0']} variant="splitted">
            {config.apps.map((app, index) => renderAppForm(app, index))}
          </Accordion>
        </>
      ) : (
        /* JSON 编辑模式 */
        <JsonEditor<ConfigPm2>
          value={config}
          onChange={handleJsonChange}
          label={t('pm2.jsonEditor', 'PM2 配置 JSON')}
          description={t('pm2.jsonEditorDesc', '直接编辑完整的 PM2 配置 JSON。修改后会自动验证格式。')}
          validate={validatePm2Config}
          minRows={15}
          maxRows={40}
        />
      )}
    </div>
  )
}
