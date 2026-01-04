import type { FormSchema } from '../components/schema-form'

/**
 * 服务器配置 Schema (演示静态布局 + 手风琴)
 */
export const serverConfigSchema: FormSchema = {
  version: '1.0',
  id: 'server-config',
  title: '服务器配置',
  description: '配置 HTTP 服务器、WebSocket 和 FFmpeg 路径',
  options: {
    columns: 2,
    submit: {
      text: '保存配置',
      position: 'top',
    },
  },
  fields: [
    {
      key: '_layout',
      type: 'accordion',
      options: {
        defaultExpanded: ['http'],
        selectionMode: 'multiple',
        variant: 'splitted',
        items: [
          {
            key: 'http',
            title: 'HTTP 服务器',
            subtitle: 'WebUI 和 API 服务配置',
            icon: 'globe',
            iconColor: 'primary',
            fields: [
              {
                key: 'http.host',
                type: 'text',
                label: '监听地址',
                description: '0.0.0.0 表示监听所有网卡',
                defaultValue: '0.0.0.0',
                layout: { span: 1 },
              },
              {
                key: 'http.port',
                type: 'number',
                label: '端口',
                description: '默认端口 7777',
                defaultValue: 7777,
                layout: { span: 1 },
                options: {
                  min: 1,
                  max: 65535,
                },
                rules: [
                  { type: 'required', message: '端口不能为空' },
                ],
              },
              {
                key: 'http.auth_key',
                type: 'password',
                label: 'API 认证密钥',
                description: '用于 API 接口认证',
                layout: { span: 1 },
              },
              {
                key: '_spacer1',
                type: 'group',
                layout: { span: 1 },
              },
              {
                key: 'http.username',
                type: 'text',
                label: '登录用户名',
                description: 'WebUI 登录用户名',
                layout: { span: 1 },
              },
              {
                key: 'http.password',
                type: 'password',
                label: '登录密码',
                description: 'WebUI 登录密码',
                layout: { span: 1 },
              },
            ],
          },
          {
            key: 'ws',
            title: 'WebSocket 服务器',
            subtitle: '适配器连接配置',
            icon: 'wifi',
            iconColor: 'secondary',
            fields: [
              {
                key: 'ws_server.enable',
                type: 'switch',
                label: '启用 WebSocket 服务',
                tooltip: '允许适配器通过 WebSocket 连接',
                defaultValue: true,
                options: {
                  color: 'success',
                },
              },
            ],
          },
          {
            key: 'ffmpeg',
            title: 'FFmpeg 配置',
            subtitle: '音视频处理工具路径',
            icon: 'film',
            iconColor: 'warning',
            fields: [
              {
                key: 'ffmpeg.ffmpeg_path',
                type: 'text',
                label: 'FFmpeg 路径',
                description: '留空使用系统 PATH 中的 ffmpeg',
                placeholder: 'ffmpeg',
              },
              {
                key: 'ffmpeg.ffprobe_path',
                type: 'text',
                label: 'FFprobe 路径',
                description: '用于探测媒体信息',
                placeholder: 'ffprobe',
              },
              {
                key: 'ffmpeg.ffplay_path',
                type: 'text',
                label: 'FFplay 路径',
                description: '用于播放媒体',
                placeholder: 'ffplay',
              },
            ],
          },
        ],
      },
    },
  ],
}

/**
 * 场景配置 Schema (演示对象数组)
 */
export const sceneConfigSchema: FormSchema = {
  version: '1.0',
  id: 'scene-config',
  title: '场景配置',
  description: '配置不同场景下的权限和冷却时间',
  options: {
    submit: {
      text: '保存场景',
      position: 'top',
    },
  },
  fields: [
    {
      key: 'scenes',
      type: 'object-list',
      label: '场景列表',
      description: '每个场景可以配置独立的权限规则',
      options: {
        displayMode: 'card',
        titleField: 'name',
        previewFields: ['mode', 'cd', 'enable'],
        addButtonText: '添加场景',
        sortable: true,
        confirmDelete: true,
        emptyText: '暂无场景配置，点击上方按钮添加',
        editModal: {
          title: '编辑场景',
          size: 'lg',
          columns: 2,
        },
        itemSchema: [
          {
            key: 'name',
            type: 'text',
            label: '场景名称',
            required: true,
            placeholder: '输入场景名称',
            rules: [
              { type: 'required', message: '场景名称不能为空' },
              { type: 'maxLength', value: 32, message: '名称不能超过 32 个字符' },
            ],
          },
          {
            key: 'mode',
            type: 'select',
            label: '模式',
            defaultValue: 'whitelist',
            options: {
              items: [
                { label: '白名单', value: 'whitelist' },
                { label: '黑名单', value: 'blacklist' },
              ],
            },
          },
          {
            key: 'cd',
            type: 'number',
            label: '全局 CD (秒)',
            description: '所有用户共享的冷却时间',
            defaultValue: 0,
            options: {
              min: 0,
              max: 86400,
            },
          },
          {
            key: 'userCd',
            type: 'number',
            label: '用户 CD (秒)',
            description: '每个用户独立的冷却时间',
            defaultValue: 0,
            options: {
              min: 0,
              max: 86400,
            },
          },
          {
            key: 'enable',
            type: 'switch',
            label: '启用',
            defaultValue: true,
            options: {
              color: 'success',
            },
          },
          {
            key: 'priority',
            type: 'number',
            label: '优先级',
            description: '数字越小优先级越高',
            defaultValue: 100,
            options: {
              min: 1,
              max: 9999,
            },
          },
          {
            key: 'users',
            type: 'list',
            label: '用户列表',
            description: '添加用户 ID 到此场景',
            layout: { span: 2, newLine: true },
            options: {
              itemType: 'text',
              addButtonText: '添加用户',
              sortable: false,
              itemPlaceholder: '输入用户 ID',
            },
          },
        ],
      },
    },
  ],
}

/**
 * 综合演示 Schema (演示标签页 + 多种组件)
 */
export const demoSchema: FormSchema = {
  version: '1.0',
  id: 'demo-config',
  title: 'Schema-Driven UI 演示',
  description: '展示各种组件类型的渲染效果',
  options: {
    submit: {
      text: '保存',
      position: 'both',
    },
  },
  fields: [
    {
      key: '_info',
      type: 'alert',
      options: {
        variant: 'info',
        title: '欢迎使用',
        content: '这是一个 Schema-Driven UI 演示页面，所有 UI 都由 JSON Schema 驱动生成。后端只需定义 Schema，前端自动渲染 HeroUI 组件。',
      },
    },
    {
      key: '_tabs',
      type: 'tabs',
      options: {
        variant: 'underlined',
        items: [
          {
            key: 'basic',
            title: '基础输入',
            icon: 'edit',
            fields: [
              {
                key: 'name',
                type: 'text',
                label: '名称',
                placeholder: '输入名称',
                required: true,
                prefixIcon: 'user',
              },
              {
                key: 'email',
                type: 'text',
                label: '邮箱',
                placeholder: 'example@email.com',
                prefixIcon: 'mail',
                rules: [{ type: 'email', message: '请输入有效的邮箱地址' }],
              },
              {
                key: 'password',
                type: 'password',
                label: '密码',
                description: '至少 8 个字符',
              },
              {
                key: 'age',
                type: 'number',
                label: '年龄',
                options: {
                  min: 1,
                  max: 150,
                },
              },
              {
                key: 'bio',
                type: 'textarea',
                label: '个人简介',
                placeholder: '介绍一下自己...',
                options: {
                  rows: 4,
                  maxLength: 500,
                },
              },
            ],
          },
          {
            key: 'select',
            title: '选择组件',
            icon: 'list',
            fields: [
              {
                key: 'theme',
                type: 'select',
                label: '主题',
                defaultValue: 'system',
                options: {
                  items: [
                    { label: '跟随系统', value: 'system', icon: 'settings' },
                    { label: '浅色', value: 'light', icon: 'eye' },
                    { label: '深色', value: 'dark', icon: 'eye-off' },
                  ],
                },
              },
              {
                key: 'language',
                type: 'select',
                label: '语言',
                defaultValue: 'zh-CN',
                options: {
                  items: [
                    { label: '简体中文', value: 'zh-CN' },
                    { label: 'English', value: 'en-US' },
                    { label: '日本語', value: 'ja-JP' },
                  ],
                },
              },
              {
                key: 'notifications',
                type: 'switch',
                label: '启用通知',
                tooltip: '开启后将收到系统通知',
                defaultValue: true,
                options: {
                  color: 'success',
                },
              },
              {
                key: 'autoSave',
                type: 'switch',
                label: '自动保存',
                description: '每隔 5 分钟自动保存更改',
                options: {
                  color: 'primary',
                },
              },
            ],
          },
          {
            key: 'lists',
            title: '列表组件',
            icon: 'layers',
            fields: [
              {
                key: 'tags',
                type: 'list',
                label: '标签',
                description: '添加自定义标签',
                options: {
                  itemType: 'text',
                  addButtonText: '添加标签',
                  sortable: true,
                  itemPlaceholder: '输入标签名',
                  maxItems: 10,
                },
              },
              {
                key: '_divider',
                type: 'divider',
              },
              {
                key: 'ports',
                type: 'list',
                label: '端口列表',
                description: '配置开放的端口',
                options: {
                  itemType: 'number',
                  addButtonText: '添加端口',
                  itemPlaceholder: '1-65535',
                  maxItems: 5,
                },
              },
            ],
          },
        ],
      },
    },
  ],
}

/**
 * Mock 初始数据
 */
export const mockServerData = {
  http: {
    host: '0.0.0.0',
    port: 7777,
    auth_key: 'your-secret-key',
    username: 'admin',
    password: 'password123',
  },
  ws_server: {
    enable: true,
  },
  ffmpeg: {
    ffmpeg_path: '',
    ffprobe_path: '',
    ffplay_path: '',
  },
}

export const mockSceneData = {
  scenes: [
    {
      name: '默认场景',
      mode: 'whitelist',
      cd: 10,
      userCd: 5,
      enable: true,
      priority: 100,
      users: ['123456789', '987654321'],
    },
    {
      name: '高级场景',
      mode: 'blacklist',
      cd: 60,
      userCd: 30,
      enable: false,
      priority: 50,
      users: [],
    },
  ],
}

export const mockDemoData = {
  name: 'Karin',
  email: 'admin@karin.dev',
  age: 25,
  bio: '这是一个示例简介',
  theme: 'system',
  language: 'zh-CN',
  notifications: true,
  autoSave: false,
  tags: ['Bot', 'Framework', 'TypeScript'],
  ports: [7777, 8080],
}

/**
 * 高级组件演示 Schema
 */
export const advancedComponentsSchema: FormSchema = {
  version: '1.0',
  id: 'advanced-components',
  title: '高级组件演示',
  description: '展示高级输入组件和展示组件',
  fields: [
    {
      key: '_tabs',
      type: 'tabs',
      options: {
        variant: 'bordered',
        items: [
          {
            key: 'input',
            title: '高级输入',
            icon: 'edit',
            fields: [
              {
                key: '_alert',
                type: 'alert',
                options: {
                  variant: 'info',
                  content: '这里展示了更多高级输入组件，适用于复杂的配置场景。',
                },
              },
              {
                key: 'acceptTerms',
                type: 'checkbox',
                label: '我同意服务条款',
                description: '请阅读并同意我们的服务条款',
                options: {
                  color: 'primary',
                },
              },
              {
                key: '_divider1',
                type: 'divider',
              },
              {
                key: 'features',
                type: 'checkbox-group',
                label: '启用的功能',
                description: '选择要启用的功能模块',
                options: {
                  orientation: 'vertical',
                  color: 'secondary',
                  items: [
                    { label: '自动回复', value: 'auto-reply', description: '自动响应消息' },
                    { label: '定时任务', value: 'cron', description: '支持定时执行任务' },
                    { label: '日志记录', value: 'logging', description: '记录所有操作日志' },
                    { label: 'API 接口', value: 'api', description: '提供 REST API' },
                  ],
                },
              },
              {
                key: '_divider2',
                type: 'divider',
              },
              {
                key: 'logLevel',
                type: 'radio-group',
                label: '日志级别',
                description: '选择日志记录的详细程度',
                defaultValue: 'info',
                options: {
                  orientation: 'horizontal',
                  color: 'warning',
                  items: [
                    { label: 'Debug', value: 'debug' },
                    { label: 'Info', value: 'info' },
                    { label: 'Warn', value: 'warn' },
                    { label: 'Error', value: 'error' },
                  ],
                },
              },
              {
                key: '_divider3',
                type: 'divider',
              },
              {
                key: 'timezone',
                type: 'autocomplete',
                label: '时区',
                description: '选择或输入时区',
                placeholder: '搜索时区...',
                options: {
                  allowCustomValue: true,
                  items: [
                    { label: 'Asia/Shanghai (UTC+8)', value: 'Asia/Shanghai' },
                    { label: 'Asia/Tokyo (UTC+9)', value: 'Asia/Tokyo' },
                    { label: 'America/New_York (UTC-5)', value: 'America/New_York' },
                    { label: 'Europe/London (UTC+0)', value: 'Europe/London' },
                    { label: 'Australia/Sydney (UTC+10)', value: 'Australia/Sydney' },
                  ],
                },
              },
            ],
          },
          {
            key: 'sliders',
            title: '滑块与评分',
            icon: 'settings',
            fields: [
              {
                key: 'volume',
                type: 'slider',
                label: '音量',
                description: '调整通知音量',
                defaultValue: 50,
                options: {
                  min: 0,
                  max: 100,
                  step: 5,
                  showSteps: false,
                  showValue: true,
                  color: 'primary',
                },
              },
              {
                key: 'quality',
                type: 'slider',
                label: '图片质量',
                description: '调整输出图片的质量',
                defaultValue: 80,
                options: {
                  min: 10,
                  max: 100,
                  step: 10,
                  showSteps: true,
                  showValue: true,
                  color: 'success',
                  marks: [
                    { value: 10, label: '低' },
                    { value: 50, label: '中' },
                    { value: 100, label: '高' },
                  ],
                },
              },
              {
                key: '_divider4',
                type: 'divider',
              },
              {
                key: 'rating',
                type: 'rating',
                label: '评分',
                description: '给这个项目打分',
                defaultValue: 4,
                options: {
                  max: 5,
                  size: 'lg',
                  color: 'warning',
                },
              },
              {
                key: '_divider5',
                type: 'divider',
              },
              {
                key: 'themeColor',
                type: 'color-picker',
                label: '主题色',
                description: '选择您喜欢的主题颜色',
                defaultValue: '#3b82f6',
              },
            ],
          },
          {
            key: 'tags',
            title: '标签与输入',
            icon: 'layers',
            fields: [
              {
                key: 'keywords',
                type: 'tags-input',
                label: '关键词',
                description: '输入关键词后按回车添加',
                defaultValue: ['Karin', 'Bot', 'Framework'],
                options: {
                  maxTags: 10,
                  color: 'primary',
                  placeholder: '输入关键词...',
                },
              },
              {
                key: '_divider6',
                type: 'divider',
              },
              {
                key: 'verifyCode',
                type: 'otp-input',
                label: '验证码',
                description: '输入 6 位验证码',
                options: {
                  length: 6,
                  type: 'number',
                  size: 'lg',
                },
              },
            ],
          },
          {
            key: 'display',
            title: '展示组件',
            icon: 'eye',
            fields: [
              {
                key: 'progress',
                type: 'progress',
                label: '加载进度',
                description: '当前任务完成进度',
                defaultValue: 65,
                options: {
                  color: 'success',
                  size: 'md',
                  showValueLabel: true,
                },
              },
              {
                key: '_divider7',
                type: 'divider',
              },
              {
                key: 'installCommand',
                type: 'snippet',
                label: '安装命令',
                description: '复制此命令安装 Karin',
                defaultValue: 'pnpm add @karinjs/core',
                options: {
                  symbol: '$',
                  color: 'primary',
                },
              },
              {
                key: '_divider8',
                type: 'divider',
              },
              {
                key: '_link',
                type: 'link',
                label: '相关链接',
                options: {
                  href: 'https://github.com/karinjs',
                  text: '访问 GitHub 仓库',
                  isExternal: true,
                  showAnchorIcon: true,
                  color: 'primary',
                },
              },
              {
                key: '_spacer',
                type: 'spacer',
                options: {
                  y: 4,
                },
              },
              {
                key: '_submitBtn',
                type: 'button',
                label: '操作',
                options: {
                  text: '保存所有配置',
                  color: 'primary',
                  variant: 'shadow',
                  icon: 'check',
                  action: {
                    type: 'submit',
                  },
                },
              },
            ],
          },
          {
            key: 'containers',
            title: '容器组件',
            icon: 'package',
            fields: [
              {
                key: '_card',
                type: 'card',
                options: {
                  title: '嵌套卡片',
                  subtitle: '这是一个卡片容器示例',
                  headerIcon: 'package',
                  shadow: 'md',
                },
                fields: [
                  {
                    key: 'cardInput',
                    type: 'text',
                    label: '卡片内输入',
                    placeholder: '在卡片内的输入框',
                  },
                  {
                    key: 'cardSwitch',
                    type: 'switch',
                    label: '卡片内开关',
                    options: {
                      color: 'success',
                    },
                  },
                ],
              },
              {
                key: '_divider9',
                type: 'divider',
              },
              {
                key: '_modalTrigger',
                type: 'modal-trigger',
                label: '弹出模态框',
                options: {
                  triggerText: '打开设置',
                  triggerColor: 'primary',
                  title: '详细设置',
                  size: 'lg',
                },
                fields: [
                  {
                    key: 'modalInput1',
                    type: 'text',
                    label: '设置项 1',
                    placeholder: '输入值...',
                  },
                  {
                    key: 'modalInput2',
                    type: 'number',
                    label: '设置项 2',
                    options: {
                      min: 0,
                      max: 100,
                    },
                  },
                  {
                    key: 'modalSwitch',
                    type: 'switch',
                    label: '启用此功能',
                  },
                ],
              },
              {
                key: '_divider10',
                type: 'divider',
              },
              {
                key: '_drawerTrigger',
                type: 'drawer-trigger',
                label: '侧边抽屉',
                options: {
                  triggerText: '打开抽屉',
                  triggerColor: 'secondary',
                  title: '抽屉内容',
                  placement: 'right',
                  size: 'md',
                },
                fields: [
                  {
                    key: 'drawerNote',
                    type: 'textarea',
                    label: '备注',
                    placeholder: '在抽屉中输入备注...',
                    options: {
                      rows: 6,
                    },
                  },
                ],
              },
            ],
          },
          {
            key: 'lists',
            title: '列表与表格',
            icon: 'list',
            fields: [
              {
                key: 'selectedItem',
                type: 'listbox',
                label: '选择一个选项',
                description: '从列表中选择',
                options: {
                  selectionMode: 'single',
                  variant: 'flat',
                  color: 'primary',
                  items: [
                    { label: '选项 A', value: 'a', description: '这是选项 A', icon: 'folder' },
                    { label: '选项 B', value: 'b', description: '这是选项 B', icon: 'file' },
                    { label: '选项 C', value: 'c', description: '这是选项 C', icon: 'database' },
                    { label: '选项 D', value: 'd', description: '这是选项 D', icon: 'server' },
                  ],
                },
              },
              {
                key: '_divider11',
                type: 'divider',
              },
              {
                key: '_dropdown',
                type: 'dropdown',
                label: '下拉菜单',
                options: {
                  triggerText: '更多操作',
                  triggerColor: 'default',
                  items: [
                    { key: 'edit', label: '编辑', icon: 'edit' },
                    { key: 'copy', label: '复制', icon: 'layers' },
                    { key: 'divider', label: '', isDivider: true },
                    { key: 'delete', label: '删除', icon: 'trash', color: 'danger' },
                  ],
                },
              },
              {
                key: '_divider12',
                type: 'divider',
              },
              {
                key: '_breadcrumbs',
                type: 'breadcrumbs',
                label: '面包屑导航',
                options: {
                  color: 'primary',
                  items: [
                    { label: '首页', href: '/', icon: 'folder' },
                    { label: '设置', href: '/settings' },
                    { label: '高级', isCurrent: true },
                  ],
                },
              },
              {
                key: '_divider13',
                type: 'divider',
              },
              {
                key: 'currentPage',
                type: 'pagination',
                label: '分页示例',
                defaultValue: 1,
                options: {
                  total: 100,
                  pageSize: 10,
                  showControls: true,
                  color: 'primary',
                },
              },
            ],
          },
        ],
      },
    },
  ],
}

export const mockAdvancedData = {
  acceptTerms: true,
  features: ['auto-reply', 'logging'],
  logLevel: 'info',
  timezone: 'Asia/Shanghai',
  volume: 50,
  quality: 80,
  rating: 4,
  themeColor: '#3b82f6',
  keywords: ['Karin', 'Bot', 'Framework'],
  verifyCode: '',
  progress: 65,
  installCommand: 'pnpm add @karinjs/core',
  cardInput: '',
  cardSwitch: false,
  modalInput1: '',
  modalInput2: 50,
  modalSwitch: true,
  drawerNote: '',
  selectedItem: 'a',
  currentPage: 1,
}
