import { useState, useEffect } from 'react'
import { getDirectConfig, updateDirectConfig } from '../../api'
import type { ConfigDirect } from '../../api'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LoadingSpinner, SaveButton, SceneConfigEditor } from './common'
import type { ModeOption } from './common'

// 将 RegExp[] 转换为 string[] 用于编辑
interface DirectConfigEditable {
  inherit: boolean
  cd: number
  mode: number
  alias: string[]
  enable: string[]
  disable: string[]
}

type ConfigDirectEditable = Record<string, DirectConfigEditable>

/**
 * 频道私信场景配置组件
 */
export function DirectConfig () {
  const { t } = useTranslation()
  const [config, setConfig] = useState<ConfigDirectEditable | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 私信应答模式选项
  const modeOptions: ModeOption[] = [
    { key: '0', label: t('mode.all', '响应所有消息') },
    { key: '1', label: t('mode.masterOnly', '仅响应主人') },
    { key: '2', label: t('mode.adminOnly', '仅响应管理员（含主人）') },
    { key: '3', label: t('mode.aliasOnly', '仅响应别名消息') },
    { key: '4', label: t('mode.aliasExceptMaster', '非主人需别名，主人无限制') },
    { key: '5', label: t('mode.aliasExceptAdmin', '非管理员需别名，管理员无限制') },
  ]

  // 规则键名示例
  const keyExamples = [
    'Bot:123456789 - 指定机器人的全局私信配置',
    'guild:888888 - 指定频道的私信配置',
    'Bot:123456789:888888 - 指定机器人在指定频道的私信配置',
    'Bot:123456789:888888:777777 - 指定机器人与频道内指定成员的私信配置',
  ]

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await getDirectConfig()
        if (res.ok && res.data) {
          // 将 RegExp[] 转换为 string[]
          const editable: ConfigDirectEditable = {}
          for (const [key, value] of Object.entries(res.data)) {
            editable[key] = {
              ...value,
              alias: value.alias.map((r: RegExp) => r.source || r.toString())
            }
          }
          setConfig(editable)
        }
      } catch (error) {
        console.error(error)
        toast.error(t('direct.loadError', '加载私信配置失败'))
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
      const res = await updateDirectConfig(config as unknown as ConfigDirect)
      if (res.ok) {
        toast.success(t('direct.saveSuccess', '私信配置已保存'))
      } else {
        toast.error(res.message || t('direct.saveError', '保存失败'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('direct.saveError', '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  if (loading || !config) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <SaveButton saving={saving} onPress={handleSave} />
      </div>

      <SceneConfigEditor
        config={config}
        onChange={setConfig}
        sceneType="direct"
        modeOptions={modeOptions}
        hasUserCd={false}
        hasMemberList={false}
        keyExamples={keyExamples}
      />
    </div>
  )
}
