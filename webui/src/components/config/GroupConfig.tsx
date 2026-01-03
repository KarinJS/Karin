import { useState, useEffect } from 'react'
import { getGroupConfig, updateGroupConfig } from '../../api'
import type { ConfigGroup } from '../../api'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LoadingSpinner, SaveButton, SceneConfigEditor } from './common'
import type { ModeOption } from './common'

// 将 RegExp[] 转换为 string[] 用于编辑
interface GroupConfigEditable {
  inherit: boolean
  cd: number
  user_cd: number
  mode: number
  alias: string[]
  enable: string[]
  disable: string[]
  member_enable: string[]
  member_disable: string[]
}

type ConfigGroupEditable = Record<string, GroupConfigEditable>

/**
 * 群聊场景配置组件
 */
export function GroupConfig () {
  const { t } = useTranslation()
  const [config, setConfig] = useState<ConfigGroupEditable | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 群聊应答模式选项
  const modeOptions: ModeOption[] = [
    { key: '0', label: t('mode.all', '响应所有消息') },
    { key: '1', label: t('mode.masterOnly', '仅响应主人') },
    { key: '2', label: t('mode.adminOnly', '仅响应管理员（含主人）') },
    { key: '3', label: t('mode.atOnly', '仅响应@机器人') },
    { key: '4', label: t('mode.aliasOnly', '仅响应别名消息') },
    { key: '5', label: t('mode.atOrAlias', '响应@或别名') },
    { key: '6', label: t('mode.atExceptMaster', '非主人需@，主人无限制') },
    { key: '7', label: t('mode.atExceptAdmin', '非管理员需@，管理员无限制') },
    { key: '8', label: t('mode.aliasExceptMaster', '非主人需别名，主人无限制') },
    { key: '9', label: t('mode.aliasExceptAdmin', '非管理员需别名，管理员无限制') },
    { key: '10', label: t('mode.atOrAliasExceptMaster', '非主人需@或别名，主人无限制') },
    { key: '11', label: t('mode.atOrAliasExceptAdmin', '非管理员需@或别名，管理员无限制') },
  ]

  // 规则键名示例
  const keyExamples = [
    'Bot:123456789 - 指定机器人的全局配置',
    'group:987654321 - 指定群聊的配置',
    'Bot:123456789:987654321 - 指定机器人在指定群的配置',
  ]

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await getGroupConfig()
        if (res.ok && res.data) {
          // 将 RegExp[] 转换为 string[]
          const editable: ConfigGroupEditable = {}
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
        toast.error(t('group.loadError', '加载群聊配置失败'))
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
      // 发送时保持 alias 为字符串数组，后端会处理转换
      const res = await updateGroupConfig(config as unknown as ConfigGroup)
      if (res.ok) {
        toast.success(t('group.saveSuccess', '群聊配置已保存'))
      } else {
        toast.error(res.message || t('group.saveError', '保存失败'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('group.saveError', '保存失败'))
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
        sceneType="group"
        modeOptions={modeOptions}
        hasUserCd={true}
        hasMemberList={true}
        keyExamples={keyExamples}
      />
    </div>
  )
}
