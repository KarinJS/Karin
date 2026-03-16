import { useState, useEffect } from 'react'
import { getPermissions, updatePermissions } from '../../api'
import type { ConfigPermissions } from '../../api'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ListManager, LoadingSpinner, SaveButton } from './common'

/**
 * 权限配置组件
 * 管理 master 和 admin 列表
 */
export function PermissionsConfig () {
  const { t } = useTranslation()
  const [config, setConfig] = useState<ConfigPermissions>({ master: [], admin: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await getPermissions()
        if (response.ok && response.data) {
          setConfig(response.data)
        }
      } catch (error) {
        console.error(error)
        toast.error(t('permissions.loadError', '加载权限配置失败'))
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [t])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await updatePermissions(config)
      if (res.ok) {
        toast.success(t('permissions.saveSuccess', '权限配置已保存'))
      } else {
        toast.error(res.message || t('permissions.saveError', '保存失败'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('permissions.saveError', '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <SaveButton saving={saving} onPress={handleSave} />
      </div>

      <div className="grid gap-6">
        <ListManager
          title={t('permissions.masterList', '主人列表')}
          description={t('permissions.masterDesc', '拥有最高权限的用户，可执行所有指令')}
          items={config.master || []}
          onChange={(items) => setConfig({ ...config, master: items })}
          placeholder={t('permissions.enterUserId', '输入用户ID后回车')}
          chipColor="primary"
        />

        <ListManager
          title={t('permissions.adminList', '管理员列表')}
          description={t('permissions.adminDesc', '拥有管理权限的用户，可执行部分管理指令')}
          items={config.admin || []}
          onChange={(items) => setConfig({ ...config, admin: items })}
          placeholder={t('permissions.enterUserId', '输入用户ID后回车')}
          chipColor="secondary"
        />
      </div>
    </div>
  )
}
