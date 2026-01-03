import { useState, useEffect } from 'react'
import { getServerConfig, updateServerConfig } from '../../api'
import type { ConfigServer } from '../../api'
import {
  Input,
  Switch,
  Accordion,
  AccordionItem,
  Tooltip
} from "@heroui/react"
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LoadingSpinner, SaveButton } from './common'
import { Globe, Wifi, Film, HelpCircle, Eye, EyeOff } from 'lucide-react'

/**
 * 服务器配置组件
 */
export function ServerConfig () {
  const { t } = useTranslation()
  const [config, setConfig] = useState<ConfigServer | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showAuthKey, setShowAuthKey] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await getServerConfig()
        if (res.ok && res.data) {
          setConfig(res.data)
        }
      } catch (error) {
        console.error(error)
        toast.error(t('server.loadError', '加载服务器配置失败'))
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
      const res = await updateServerConfig(config)
      if (res.ok) {
        toast.success(t('server.saveSuccess', '服务器配置已保存'))
      } else {
        toast.error(res.message || t('server.saveError', '保存失败'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('server.saveError', '保存失败'))
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

      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={['http']}
        variant="splitted"
      >
        {/* HTTP 服务器配置 */}
        <AccordionItem
          key="http"
          aria-label="HTTP Server"
          title={
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              <span className="font-medium">{t('server.httpServer', 'HTTP 服务器')}</span>
            </div>
          }
          subtitle={t('server.httpServerDesc', 'WebUI 和 API 服务配置')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Input
              label={t('server.host', '监听地址')}
              value={config.http.host}
              onValueChange={(v) => setConfig({
                ...config,
                http: { ...config.http, host: v }
              })}
              description={t('server.hostDesc', '0.0.0.0 表示监听所有网卡')}
            />
            <Input
              label={t('server.port', '端口')}
              type="number"
              min={1}
              max={65535}
              value={String(config.http.port)}
              onValueChange={(v) => setConfig({
                ...config,
                http: { ...config.http, port: Number(v) || 7777 }
              })}
              description={t('server.portDesc', '默认端口 7777')}
            />
            <Input
              label={t('server.authKey', 'API 认证密钥')}
              type={showAuthKey ? 'text' : 'password'}
              value={config.http.auth_key}
              onValueChange={(v) => setConfig({
                ...config,
                http: { ...config.http, auth_key: v }
              })}
              description={t('server.authKeyDesc', '用于 API 接口认证')}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowAuthKey(!showAuthKey)}
                  className="text-default-400 hover:text-default-600"
                >
                  {showAuthKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            <div /> {/* 占位 */}
            <Input
              label={t('server.username', '登录用户名')}
              value={config.http.username}
              onValueChange={(v) => setConfig({
                ...config,
                http: { ...config.http, username: v }
              })}
              description={t('server.usernameDesc', 'WebUI 登录用户名')}
            />
            <Input
              label={t('server.password', '登录密码')}
              type={showPassword ? 'text' : 'password'}
              value={config.http.password}
              onValueChange={(v) => setConfig({
                ...config,
                http: { ...config.http, password: v }
              })}
              description={t('server.passwordDesc', 'WebUI 登录密码')}
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
        </AccordionItem>

        {/* WebSocket 服务器配置 */}
        <AccordionItem
          key="ws"
          aria-label="WebSocket Server"
          title={
            <div className="flex items-center gap-2">
              <Wifi size={20} className="text-secondary" />
              <span className="font-medium">{t('server.wsServer', 'WebSocket 服务器')}</span>
            </div>
          }
          subtitle={t('server.wsServerDesc', '适配器连接配置')}
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 border rounded-xl bg-default-50">
              <div className="flex items-center gap-2">
                <span className="font-medium">{t('server.enableWs', '启用 WebSocket 服务')}</span>
                <Tooltip content={t('server.enableWsHint', '允许适配器通过 WebSocket 连接')}>
                  <HelpCircle size={14} className="text-default-400" />
                </Tooltip>
              </div>
              <Switch
                isSelected={config.ws_server.enable}
                onValueChange={(v) => setConfig({
                  ...config,
                  ws_server: { ...config.ws_server, enable: v }
                })}
                color="success"
              />
            </div>
          </div>
        </AccordionItem>

        {/* FFmpeg 配置 */}
        <AccordionItem
          key="ffmpeg"
          aria-label="FFmpeg"
          title={
            <div className="flex items-center gap-2">
              <Film size={20} className="text-warning" />
              <span className="font-medium">{t('server.ffmpeg', 'FFmpeg 配置')}</span>
            </div>
          }
          subtitle={t('server.ffmpegDesc', '音视频处理工具路径')}
        >
          <div className="grid grid-cols-1 gap-4 pt-2">
            <Input
              label={t('server.ffmpegPath', 'FFmpeg 路径')}
              value={config.ffmpeg.ffmpeg_path}
              onValueChange={(v) => setConfig({
                ...config,
                ffmpeg: { ...config.ffmpeg, ffmpeg_path: v }
              })}
              description={t('server.ffmpegPathDesc', '留空使用系统 PATH 中的 ffmpeg')}
              placeholder="ffmpeg"
            />
            <Input
              label={t('server.ffprobePath', 'FFprobe 路径')}
              value={config.ffmpeg.ffprobe_path}
              onValueChange={(v) => setConfig({
                ...config,
                ffmpeg: { ...config.ffmpeg, ffprobe_path: v }
              })}
              description={t('server.ffprobePathDesc', '用于探测媒体信息')}
              placeholder="ffprobe"
            />
            <Input
              label={t('server.ffplayPath', 'FFplay 路径')}
              value={config.ffmpeg.ffplay_path}
              onValueChange={(v) => setConfig({
                ...config,
                ffmpeg: { ...config.ffmpeg, ffplay_path: v }
              })}
              description={t('server.ffplayPathDesc', '用于播放媒体')}
              placeholder="ffplay"
            />
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
