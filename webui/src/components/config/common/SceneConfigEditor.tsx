import { useState } from 'react'
import {
  Input,
  Button,
  Switch,
  Select,
  SelectItem,
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
  Chip
} from "@heroui/react"
import { Plus, Trash2, Settings2, HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ListManager } from './ListManager'

/** 场景配置项基础类型 */
export interface SceneConfigItemBase {
  inherit: boolean
  cd: number
  mode: number
  alias: string[]
  enable: string[]
  disable: string[]
}

/** 带有 user_cd 的配置类型 (group/guild) */
export interface SceneConfigItemWithUserCd extends SceneConfigItemBase {
  user_cd: number
  member_enable: string[]
  member_disable: string[]
}

/** 场景配置类型 */
export type SceneConfigItem = SceneConfigItemBase | SceneConfigItemWithUserCd

/** 应答模式选项 */
export interface ModeOption {
  key: string
  label: string
}

interface SceneConfigEditorProps<T extends SceneConfigItem> {
  /** 配置数据 */
  config: Record<string, T>
  /** 配置更新回调 */
  onChange: (config: Record<string, T>) => void
  /** 场景类型 */
  sceneType: 'group' | 'friend' | 'guild' | 'direct'
  /** 应答模式选项 */
  modeOptions: ModeOption[]
  /** 是否包含 user_cd */
  hasUserCd?: boolean
  /** 是否包含 member 黑白名单 */
  hasMemberList?: boolean
  /** 规则键名示例提示 */
  keyExamples?: string[]
}

/**
 * 场景配置编辑器通用组件
 * 支持 Group/Friend/Guild/Direct 等场景配置的编辑
 */
export function SceneConfigEditor<T extends SceneConfigItem> ({
  config,
  onChange,
  modeOptions,
  hasUserCd = false,
  hasMemberList = false,
  keyExamples = []
}: SceneConfigEditorProps<T>) {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newRuleKey, setNewRuleKey] = useState('')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['global']))

  // 获取所有配置键
  const configKeys = Object.keys(config)
  const globalConfig = config.global

  // 更新单个配置项
  const updateConfigItem = (key: string, field: keyof T, value: unknown) => {
    const item = config[key]
    if (!item) return
    onChange({
      ...config,
      [key]: { ...item, [field]: value }
    })
  }

  // 更新列表字段
  const updateListField = (key: string, field: keyof T, items: string[]) => {
    const item = config[key]
    if (!item) return
    onChange({
      ...config,
      [key]: { ...item, [field]: items }
    })
  }

  // 添加新规则
  const addNewRule = () => {
    const trimmedKey = newRuleKey.trim()
    if (!trimmedKey || config[trimmedKey]) {
      return
    }
    // 从 global 复制一份作为新规则的初始值
    const newItem = { ...globalConfig, inherit: true }
    onChange({
      ...config,
      [trimmedKey]: newItem
    })
    setNewRuleKey('')
    onClose()
    // 展开新规则
    setSelectedKeys(new Set([...selectedKeys, trimmedKey]))
  }

  // 删除规则
  const deleteRule = (key: string) => {
    if (key === 'global') return // global 不能删除
    const newConfig = { ...config }
    delete newConfig[key]
    onChange(newConfig)
    selectedKeys.delete(key)
    setSelectedKeys(new Set(selectedKeys))
  }

  // 渲染单个配置项的表单
  const renderConfigForm = (key: string, item: T) => {
    const isGlobal = key === 'global'

    return (
      <div className="space-y-6">
        {/* 基本设置 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!isGlobal && (
            <div className="flex items-center justify-between p-3 border rounded-xl bg-default-100">
              <div className="flex items-center gap-2">
                <span>{t('common.inheritGlobal', '继承全局配置')}</span>
                <Tooltip content={t('scene.inheritHint', '开启后，未设置的选项将使用全局配置的值')}>
                  <HelpCircle size={14} className="text-default-400" />
                </Tooltip>
              </div>
              <Switch
                isSelected={item.inherit}
                onValueChange={(v) => updateConfigItem(key, 'inherit' as keyof T, v)}
              />
            </div>
          )}

          <Input
            label={t('common.cd', '冷却时间 (秒)')}
            type="number"
            min={0}
            value={String(item.cd)}
            onValueChange={(v) => updateConfigItem(key, 'cd' as keyof T, Number(v) || 0)}
            description={t('scene.cdDesc', '全局冷却时间')}
          />

          {hasUserCd && 'user_cd' in item && (
            <Input
              label={t('common.userCd', '用户冷却 (秒)')}
              type="number"
              min={0}
              value={String((item as SceneConfigItemWithUserCd).user_cd)}
              onValueChange={(v) => updateConfigItem(key, 'user_cd' as keyof T, Number(v) || 0)}
              description={t('scene.userCdDesc', '单用户冷却时间')}
            />
          )}

          <Select
            label={t('common.responseMode', '应答模式')}
            selectedKeys={[String(item.mode)]}
            onChange={(e) => updateConfigItem(key, 'mode' as keyof T, Number(e.target.value))}
            description={t('scene.modeDesc', '机器人响应规则')}
          >
            {modeOptions.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>
        </div>

        {/* 别名设置 */}
        <ListManager
          title={t('scene.alias', '机器人别名')}
          description={t('scene.aliasDesc', '使用 // 包裹表示正则表达式，如 /^小Q/')}
          items={item.alias.map(a => a.toString())}
          onChange={(items) => updateListField(key, 'alias' as keyof T, items)}
          placeholder={t('scene.aliasPlaceholder', '输入别名后回车')}
          chipColor="secondary"
        />

        {/* 插件启用/禁用 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ListManager
            title={t('scene.enablePlugins', '启用插件列表')}
            description={t('scene.enablePluginsDesc', '仅允许这些插件响应（白名单）')}
            items={item.enable}
            onChange={(items) => updateListField(key, 'enable' as keyof T, items)}
            placeholder="karin-plugin-xxx"
            chipColor="success"
          />
          <ListManager
            title={t('scene.disablePlugins', '禁用插件列表')}
            description={t('scene.disablePluginsDesc', '禁止这些插件响应（黑名单）')}
            items={item.disable}
            onChange={(items) => updateListField(key, 'disable' as keyof T, items)}
            placeholder="karin-plugin-xxx"
            chipColor="danger"
          />
        </div>

        {/* 成员黑白名单 (仅 group/guild) */}
        {hasMemberList && 'member_enable' in item && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ListManager
              title={t('scene.memberEnable', '成员白名单')}
              description={t('scene.memberEnableDesc', '不受任何限制的用户列表')}
              items={(item as SceneConfigItemWithUserCd).member_enable}
              onChange={(items) => updateListField(key, 'member_enable' as keyof T, items)}
              placeholder={t('scene.enterUserId', '输入用户ID')}
              chipColor="success"
            />
            <ListManager
              title={t('scene.memberDisable', '成员黑名单')}
              description={t('scene.memberDisableDesc', '禁止使用的用户列表')}
              items={(item as SceneConfigItemWithUserCd).member_disable}
              onChange={(items) => updateListField(key, 'member_disable' as keyof T, items)}
              placeholder={t('scene.enterUserId', '输入用户ID')}
              chipColor="danger"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Chip size="sm" variant="flat" color="primary">
            {configKeys.length} {t('scene.rules', '条规则')}
          </Chip>
        </div>
        <Button
          color="primary"
          variant="flat"
          startContent={<Plus size={18} />}
          onPress={onOpen}
        >
          {t('scene.addRule', '添加规则')}
        </Button>
      </div>

      {/* 配置规则列表 */}
      <Accordion
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        variant="splitted"
        className="px-0"
      >
        {configKeys.map((key) => {
          const item = config[key]
          const isGlobal = key === 'global'

          return (
            <AccordionItem
              key={key}
              aria-label={key}
              title={
                <div className="flex items-center gap-2">
                  <Settings2 size={18} className={isGlobal ? 'text-primary' : 'text-default-500'} />
                  <span className={isGlobal ? 'font-semibold text-primary' : ''}>
                    {isGlobal ? t('scene.globalConfig', '全局配置') : key}
                  </span>
                  {!isGlobal && item.inherit && (
                    <Chip size="sm" variant="flat" color="default">
                      {t('scene.inheriting', '继承中')}
                    </Chip>
                  )}
                </div>
              }
              subtitle={isGlobal ? t('scene.globalConfigDesc', '所有规则的默认配置') : undefined}
              startContent={
                !isGlobal && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => deleteRule(key)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )
              }
              classNames={{
                base: 'group',
                title: 'text-base',
                content: 'pt-2'
              }}
            >
              {renderConfigForm(key, item)}
            </AccordionItem>
          )
        })}
      </Accordion>

      {/* 添加规则弹窗 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {t('scene.addRule', '添加规则')}
          </ModalHeader>
          <ModalBody>
            <Input
              label={t('scene.ruleKey', '规则键名')}
              placeholder="Bot:123456789 或 group:987654321"
              value={newRuleKey}
              onValueChange={setNewRuleKey}
              description={t('scene.ruleKeyDesc', '用于匹配特定机器人或群组的配置')}
            />
            {keyExamples.length > 0 && (
              <div className="mt-2 p-3 rounded-lg bg-default-100">
                <p className="text-sm font-medium mb-2">{t('scene.keyExamples', '键名示例')}:</p>
                <ul className="text-sm text-default-600 space-y-1">
                  {keyExamples.map((example, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <code className="px-2 py-0.5 rounded bg-default-200 text-xs">{example.split(' - ')[0]}</code>
                      <span className="text-default-500">{example.split(' - ')[1]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              {t('common.cancel', '取消')}
            </Button>
            <Button color="primary" onPress={addNewRule} isDisabled={!newRuleKey.trim()}>
              {t('common.add', '添加')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
