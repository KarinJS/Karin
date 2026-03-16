import { useState, useEffect } from 'react'
import { getFilterConfig, updateFilterConfig } from '../../api'
import type { ConfigFilter } from '../../api'
import {
  Switch,
  Accordion,
  AccordionItem,
  Tabs,
  Tab
} from "@heroui/react"
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ListManager, LoadingSpinner, SaveButton, PluginSelector } from './common'
import { Shield, ShieldOff, FileText, FileX, Puzzle } from 'lucide-react'

/**
 * 过滤器配置组件
 * 完整支持 enable/enable_list/disable_list/log_enable_list/log_disable_list/plugin
 */
export function FilterConfig () {
  const { t } = useTranslation()
  const [config, setConfig] = useState<ConfigFilter | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('enable')

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await getFilterConfig()
        if (res.ok && res.data) {
          setConfig(res.data)
        }
      } catch (error) {
        console.error(error)
        toast.error(t('filter.loadError', '加载过滤器配置失败'))
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
      const res = await updateFilterConfig(config)
      if (res.ok) {
        toast.success(t('filter.saveSuccess', '过滤器配置已保存'))
      } else {
        toast.error(res.message || t('filter.saveError', '保存失败'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('filter.saveError', '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  if (loading || !config) return <LoadingSpinner />

  const sceneKeys = ['user', 'friend', 'group', 'direct', 'guild', 'channel'] as const
  const eventSceneKeys = ['friend', 'group', 'direct', 'guild', 'channel'] as const
  const sceneLabels: Record<string, string> = {
    friend: t('filter.friend', '好友'),
    group: t('filter.group', '群聊'),
    direct: t('filter.direct', '私信'),
    guild: t('filter.guild', '频道'),
    channel: t('filter.channel', '子频道'),
    user: t('filter.user', '用户')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <SaveButton saving={saving} onPress={handleSave} />
      </div>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6",
          tab: "px-0 h-12"
        }}
      >
        {/* 事件开关 */}
        <Tab
          key="enable"
          title={
            <div className="flex items-center gap-2">
              <Shield size={18} />
              <span>{t('filter.eventSwitch', '事件开关')}</span>
            </div>
          }
        >
          <div className="mt-4 p-5 rounded-xl bg-default-50 border border-default-200">
            <h3 className="text-base font-medium mb-4">{t('filter.enableEvents', '启用/禁用事件类型')}</h3>
            <p className="text-sm text-default-500 mb-4">
              {t('filter.enableEventsDesc', '控制是否处理各类场景的事件')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {eventSceneKeys.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border rounded-xl bg-white hover:border-primary transition-colors"
                >
                  <span className="font-medium">{sceneLabels[key]}</span>
                  <Switch
                    isSelected={config.enable[key]}
                    onValueChange={(v) => setConfig({
                      ...config,
                      enable: { ...config.enable, [key]: v }
                    })}
                    color="success"
                  />
                </div>
              ))}
            </div>
          </div>
        </Tab>

        {/* 白名单 */}
        <Tab
          key="enable_list"
          title={
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-success" />
              <span>{t('filter.whitelist', '白名单')}</span>
            </div>
          }
        >
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-xl bg-success-50 border border-success-200">
              <p className="text-sm text-success-700">
                {t('filter.whitelistDesc', '白名单模式：只有在列表中的才会被处理。留空表示不启用白名单。')}
              </p>
            </div>
            <Accordion variant="splitted" selectionMode="multiple">
              {sceneKeys.map((key) => (
                <AccordionItem
                  key={key}
                  title={sceneLabels[key]}
                  subtitle={key === 'user' ? t('filter.userWhitelistDesc', '全局用户白名单，优先级最高') : undefined}
                >
                  <ListManager
                    title=""
                    items={config.enable_list[key]}
                    onChange={(items) => setConfig({
                      ...config,
                      enable_list: { ...config.enable_list, [key]: items }
                    })}
                    placeholder={t('filter.enterIdPlaceholder', '输入ID后回车')}
                    chipColor="success"
                  />
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Tab>

        {/* 黑名单 */}
        <Tab
          key="disable_list"
          title={
            <div className="flex items-center gap-2">
              <ShieldOff size={18} className="text-danger" />
              <span>{t('filter.blacklist', '黑名单')}</span>
            </div>
          }
        >
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-xl bg-danger-50 border border-danger-200">
              <p className="text-sm text-danger-700">
                {t('filter.blacklistDesc', '黑名单模式：在列表中的将被直接过滤，不会处理任何事件。')}
              </p>
            </div>
            <Accordion variant="splitted" selectionMode="multiple">
              {sceneKeys.map((key) => (
                <AccordionItem
                  key={key}
                  title={sceneLabels[key]}
                  subtitle={key === 'user' ? t('filter.userBlacklistDesc', '全局用户黑名单，优先级最高') : undefined}
                >
                  <ListManager
                    title=""
                    items={config.disable_list[key]}
                    onChange={(items) => setConfig({
                      ...config,
                      disable_list: { ...config.disable_list, [key]: items }
                    })}
                    placeholder={t('filter.enterIdPlaceholder', '输入ID后回车')}
                    chipColor="danger"
                  />
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Tab>

        {/* 日志白名单 */}
        <Tab
          key="log_enable_list"
          title={
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-success" />
              <span>{t('filter.logWhitelist', '日志白名单')}</span>
            </div>
          }
        >
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-xl bg-success-50 border border-success-200">
              <p className="text-sm text-success-700">
                {t('filter.logWhitelistDesc', '只有在列表中的才会打印日志。留空表示打印所有日志。')}
              </p>
            </div>
            <Accordion variant="splitted" selectionMode="multiple">
              {sceneKeys.map((key) => (
                <AccordionItem key={key} title={sceneLabels[key]}>
                  <ListManager
                    title=""
                    items={config.log_enable_list[key]}
                    onChange={(items) => setConfig({
                      ...config,
                      log_enable_list: { ...config.log_enable_list, [key]: items }
                    })}
                    placeholder={t('filter.enterIdPlaceholder', '输入ID后回车')}
                    chipColor="success"
                  />
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Tab>

        {/* 日志黑名单 */}
        <Tab
          key="log_disable_list"
          title={
            <div className="flex items-center gap-2">
              <FileX size={18} className="text-danger" />
              <span>{t('filter.logBlacklist', '日志黑名单')}</span>
            </div>
          }
        >
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-xl bg-danger-50 border border-danger-200">
              <p className="text-sm text-danger-700">
                {t('filter.logBlacklistDesc', '在列表中的将不会打印日志。')}
              </p>
            </div>
            <Accordion variant="splitted" selectionMode="multiple">
              {sceneKeys.map((key) => (
                <AccordionItem key={key} title={sceneLabels[key]}>
                  <ListManager
                    title=""
                    items={config.log_disable_list[key]}
                    onChange={(items) => setConfig({
                      ...config,
                      log_disable_list: { ...config.log_disable_list, [key]: items }
                    })}
                    placeholder={t('filter.enterIdPlaceholder', '输入ID后回车')}
                    chipColor="danger"
                  />
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Tab>

        {/* 插件过滤 */}
        <Tab
          key="plugin"
          title={
            <div className="flex items-center gap-2">
              <Puzzle size={18} />
              <span>{t('filter.pluginFilter', '插件过滤')}</span>
            </div>
          }
        >
          <div className="mt-4 space-y-6">
            <div className="p-4 rounded-xl bg-default-100 border border-default-200">
              <p className="text-sm text-default-600">
                {t('filter.pluginFilterDesc', '全局插件过滤配置，控制哪些插件可以响应事件。')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 插件白名单 */}
              <div className="p-5 rounded-xl bg-success-50/50 border border-success-200">
                <h4 className="text-base font-medium text-success-700 mb-2">
                  {t('filter.enablePlugins', '启用插件列表')}
                </h4>
                <p className="text-sm text-success-600 mb-4">
                  {t('filter.enablePluginsDesc', '仅允许这些插件响应（白名单模式）。留空表示允许所有插件。')}
                </p>
                <PluginSelector
                  value={config.plugin.enable}
                  onChange={(items) => setConfig({
                    ...config,
                    plugin: { ...config.plugin, enable: items }
                  })}
                  label={t('filter.selectEnabledPlugins', '选择启用的插件')}
                  placeholder={t('filter.selectPluginPlaceholder', '点击选择插件包')}
                  showSearch
                  showTypeChip
                />
              </div>

              {/* 插件黑名单 */}
              <div className="p-5 rounded-xl bg-danger-50/50 border border-danger-200">
                <h4 className="text-base font-medium text-danger-700 mb-2">
                  {t('filter.disablePlugins', '禁用插件列表')}
                </h4>
                <p className="text-sm text-danger-600 mb-4">
                  {t('filter.disablePluginsDesc', '禁止这些插件响应（黑名单模式）。')}
                </p>
                <PluginSelector
                  value={config.plugin.disable}
                  onChange={(items) => setConfig({
                    ...config,
                    plugin: { ...config.plugin, disable: items }
                  })}
                  label={t('filter.selectDisabledPlugins', '选择禁用的插件')}
                  placeholder={t('filter.selectPluginPlaceholder', '点击选择插件包')}
                  showSearch
                  showTypeChip
                />
              </div>
            </div>

            {/* 手动输入备选方式 */}
            <Accordion variant="splitted">
              <AccordionItem
                key="manual"
                title={t('filter.manualInput', '手动输入')}
                subtitle={t('filter.manualInputDesc', '如果需要输入未加载的插件包名，可以使用手动输入')}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                  <ListManager
                    title={t('filter.enablePlugins', '启用插件列表')}
                    items={config.plugin.enable}
                    onChange={(items) => setConfig({
                      ...config,
                      plugin: { ...config.plugin, enable: items }
                    })}
                    placeholder="karin-plugin-xxx"
                    chipColor="success"
                  />
                  <ListManager
                    title={t('filter.disablePlugins', '禁用插件列表')}
                    items={config.plugin.disable}
                    onChange={(items) => setConfig({
                      ...config,
                      plugin: { ...config.plugin, disable: items }
                    })}
                    placeholder="karin-plugin-xxx"
                    chipColor="danger"
                  />
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}
