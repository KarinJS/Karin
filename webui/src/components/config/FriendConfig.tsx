import { useState, useEffect } from 'react'
import { getFriendConfig, updateFriendConfig } from '../../api'
import type { ConfigFriend } from '../../api'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LoadingSpinner, SaveButton, SceneConfigEditor } from './common'
import type { ModeOption } from './common'

// 将 RegExp[] 转换为 string[] 用于编辑
interface FriendConfigEditable {
  inherit: boolean
  cd: number
  mode: number
  alias: string[]
  enable: string[]
  disable: string[]
}

type ConfigFriendEditable = Record<string, FriendConfigEditable>

/**
 * 好友场景配置组件
 */
export function FriendConfig () {
  const { t } = useTranslation()
  const [config, setConfig] = useState<ConfigFriendEditable | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 好友应答模式选项
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
    'Bot:123456789 - 指定机器人的全局好友配置',
    'Bot:123456789:888888 - 指定机器人与指定好友的配置',
  ]

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await getFriendConfig()
        if (res.ok && res.data) {
          // 将 RegExp[] 转换为 string[]
          const editable: ConfigFriendEditable = {}
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
        toast.error(t('friend.loadError', '加载好友配置失败'))
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
      const res = await updateFriendConfig(config as unknown as ConfigFriend)
      if (res.ok) {
        toast.success(t('friend.saveSuccess', '好友配置已保存'))
      } else {
        toast.error(res.message || t('friend.saveError', '保存失败'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('friend.saveError', '保存失败'))
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
        sceneType="friend"
        modeOptions={modeOptions}
        hasUserCd={false}
        hasMemberList={false}
        keyExamples={keyExamples}
      />
    </div>
  )
}
