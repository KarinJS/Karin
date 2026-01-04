# Schema-Driven UI 策划案

> 目标：后端只需编写 AST/Schema 描述，前端自动渲染 HeroUI 组件

## 一、概述

### 1.1 设计理念

借鉴 VSCode 的扩展配置方式，提供一套 **声明式 UI Schema**，让后端/插件开发者无需了解前端技术栈，只需定义 JSON Schema 即可在 WebUI 中渲染出美观、一致的配置界面。

```
后端定义 Schema (JSON/AST)  →  前端 Schema Renderer  →  HeroUI 组件
```

### 1.2 核心原则

| 原则 | 说明 |
|------|------|
| **样式固定** | 所有样式由前端统一控制，后端无法也无需干预样式 |
| **组件受限** | 只提供预定义的组件类型，不支持任意自定义组件 |
| **类型安全** | Schema 有严格的 TypeScript 类型定义 |
| **验证内置** | 内置常用验证规则，无需自行实现 |
| **表单状态托管** | 表单的状态管理、提交、错误处理由框架统一管理 |

---

## 二、组件体系

### 2.1 基础输入组件

| 组件类型 | 对应 HeroUI | 用途 |
|----------|-------------|------|
| `text` | `<Input>` | 单行文本输入 |
| `password` | `<Input type="password">` | 密码输入，带眼睛切换 |
| `number` | `<Input type="number">` | 数字输入 |
| `textarea` | `<Textarea>` | 多行文本 |
| `switch` | `<Switch>` | 布尔开关 |
| `checkbox` | `<Checkbox>` | 复选框 |
| `checkbox-group` | `<CheckboxGroup>` | 复选框组 |
| `radio-group` | `<RadioGroup>` | 单选组 |
| `select` | `<Select>` | 下拉选择 |
| `autocomplete` | `<Autocomplete>` | 自动补全输入 |
| `slider` | `<Slider>` | 滑块 |
| `date-picker` | `<DatePicker>` | 日期选择 |
| `time-picker` | `<TimeInput>` | 时间选择 |
| `color-picker` | 自定义 | 颜色选择器 |

### 2.2 复合组件（数组/对象处理）

这是最复杂的部分，需要特别关注。

| 组件类型 | 用途 | 复杂度 |
|----------|------|--------|
| `list` | 简单值数组（字符串/数字列表） | ⭐ |
| `tags` | 标签输入（简化版 list） | ⭐ |
| `key-value` | 键值对编辑器 `Record<string, string>` | ⭐⭐ |
| `object-list` | 对象数组（最复杂） | ⭐⭐⭐ |
| `json-editor` | JSON 编辑器（兜底方案） | ⭐⭐ |
| `file-upload` | 文件上传 | ⭐ |

#### 2.2.1 VSCode 的处理方式分析

VSCode Settings Editor 对不同数据类型的处理：

| 数据类型 | VSCode 处理方式 | 示例 |
|----------|-----------------|------|
| `string[]` | 列表编辑器（Add Item 按钮） | `files.exclude` |
| `object` | 展开为多个独立字段 | `editor.fontSize` 等 |
| `object[]` | **表格/卡片列表 + 弹窗编辑** | `terminal.integrated.profiles` |
| `Record<string, T>` | 键值对编辑器 | `files.associations` |
| 超复杂结构 | **"Edit in settings.json" 链接** | `launch.json` 配置 |

**关键洞察：VSCode 对于超复杂的数组对象，会直接引导用户编辑 JSON 文件，而不是强行用 UI 表达。**

#### 2.2.2 简单数组 `list`

适用于：`string[]`、`number[]`

```
┌─────────────────────────────────────────┐
│ 白名单列表                         [+ 添加] │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────┐  [↑][↓][×] │
│ │ 123456789                    │           │
│ └─────────────────────────────┘           │
│ ┌─────────────────────────────┐  [↑][↓][×] │
│ │ 987654321                    │           │
│ └─────────────────────────────┘           │
└─────────────────────────────────────────┘
```

#### 2.2.3 对象数组 `object-list`（核心难点）

适用于：`Array<{ name: string, value: number, ... }>`

**方案 A：卡片列表模式**（推荐用于字段较少的对象）

```
┌─────────────────────────────────────────────────────┐
│ 场景配置列表                                   [+ 添加] │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ 📦 场景 1                              [编辑][删除] │ │
│ │ ├─ 名称: 默认场景                                 │ │
│ │ ├─ CD: 10                                       │ │
│ │ └─ 启用: ✓                                      │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 📦 场景 2                              [编辑][删除] │ │
│ │ ├─ 名称: 高级场景                                 │ │
│ │ ├─ CD: 30                                       │ │
│ │ └─ 启用: ✗                                      │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

点击"编辑"后弹出 Modal：

```
┌──────────────────────────────────────┐
│ 编辑场景配置                      [×] │
├──────────────────────────────────────┤
│ 名称    [默认场景________________]   │
│                                      │
│ CD 时间  [10____] 秒                 │
│                                      │
│ 启用     [====○] (开)               │
│                                      │
│ 高级设置 ▼                          │
│ ┌────────────────────────────────┐  │
│ │ 优先级  [1____]                 │  │
│ │ 描述    [__________________]   │  │
│ └────────────────────────────────┘  │
├──────────────────────────────────────┤
│              [取消]  [确定]          │
└──────────────────────────────────────┘
```

**方案 B：表格模式**（推荐用于字段简单且数量多的列表）

```
┌──────────────────────────────────────────────────────────┐
│ 用户列表                                          [+ 添加] │
├──────────────────────────────────────────────────────────┤
│ ┌────────┬──────────────┬─────────┬─────────┬─────────┐ │
│ │ 序号   │ 用户 ID       │ 备注    │ 启用    │ 操作    │ │
│ ├────────┼──────────────┼─────────┼─────────┼─────────┤ │
│ │ 1      │ 123456789    │ 管理员  │ ✓       │ [编辑][×]│ │
│ │ 2      │ 987654321    │ 用户A   │ ✓       │ [编辑][×]│ │
│ │ 3      │ 111222333    │ 用户B   │ ✗       │ [编辑][×]│ │
│ └────────┴──────────────┴─────────┴─────────┴─────────┘ │
└──────────────────────────────────────────────────────────┘
```

**方案 C：JSON 编辑器兜底**（超复杂结构）

当对象结构过于复杂（嵌套多层、包含数组等），直接提供 JSON 编辑器：

```
┌─────────────────────────────────────────────────────┐
│ 高级配置                    [格式化] [验证] [重置]    │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ 1  {                                            │ │
│ │ 2    "scenes": [                                │ │
│ │ 3      {                                        │ │
│ │ 4        "name": "default",                     │ │
│ │ 5        "rules": [                             │ │
│ │ 6          { "type": "match", "value": "..." }  │ │
│ │ 7        ]                                      │ │
│ │ 8      }                                        │ │
│ │ 9    ]                                          │ │
│ │ 10 }                                            │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### 2.3 布局组件

| 组件类型 | 对应 HeroUI | 用途 |
|----------|-------------|------|
| `group` | `<div>` | 字段分组，无样式容器 |
| `card` | `<Card>` | 卡片容器 |
| `accordion` | `<Accordion>` | 折叠面板 |
| `tabs` | `<Tabs>` | 标签页 |
| `grid` | CSS Grid | 网格布局 |
| `divider` | `<Divider>` | 分隔线 |
| `alert` | 自定义 | 提示信息框 |

### 2.4 交互组件

| 组件类型 | 用途 |
|----------|------|
| `button` | 操作按钮 |
| `modal-trigger` | 弹窗触发器 |
| `popover-trigger` | 气泡卡片触发器 |
| `conditional` | 条件渲染（根据其他字段值显示/隐藏） |

---

## 三、Schema 规范

### 3.1 基础结构

```typescript
interface FormSchema {
  /** Schema 版本 */
  version: '1.0'

  /** 表单唯一标识 */
  id: string

  /** 表单标题（支持 i18n key） */
  title?: string | I18nKey

  /** 表单描述 */
  description?: string | I18nKey

  /** 字段定义 */
  fields: FieldSchema[]

  /** 表单级别配置 */
  options?: FormOptions
}

interface FormOptions {
  /** 布局模式 */
  layout?: 'vertical' | 'horizontal' | 'inline'

  /** 默认列数（grid 布局） */
  columns?: 1 | 2 | 3 | 4

  /** 标签宽度 */
  labelWidth?: string

  /** 是否显示必填星号 */
  showRequiredMark?: boolean

  /** 提交按钮配置 */
  submit?: {
    text?: string | I18nKey
    position?: 'top' | 'bottom' | 'both'
  }
}
```

### 3.2 字段基础定义

```typescript
interface FieldSchemaBase {
  /** 字段唯一标识，对应数据的 key（支持嵌套如 "http.port"） */
  key: string

  /** 组件类型 */
  type: ComponentType

  /** 标签文本 */
  label?: string | I18nKey

  /** 描述/帮助文本 */
  description?: string | I18nKey

  /** 占位文本 */
  placeholder?: string | I18nKey

  /** 提示图标的 tooltip 内容 */
  tooltip?: string | I18nKey

  /** 默认值 */
  defaultValue?: unknown

  /** 是否禁用 */
  disabled?: boolean | ConditionExpression

  /** 是否隐藏 */
  hidden?: boolean | ConditionExpression

  /** 是否必填 */
  required?: boolean

  /** 验证规则 */
  rules?: ValidationRule[]

  /** 布局配置 */
  layout?: FieldLayout

  /** 前缀图标 */
  prefixIcon?: IconName

  /** 后缀图标 */
  suffixIcon?: IconName
}

interface FieldLayout {
  /** 占用列数 */
  span?: 1 | 2 | 3 | 4

  /** 强制新行 */
  newLine?: boolean
}
```

### 3.3 各组件类型的特定配置

```typescript
// 文本输入
interface TextFieldSchema extends FieldSchemaBase {
  type: 'text'
  options?: {
    maxLength?: number
    minLength?: number
    pattern?: string  // 正则表达式
    clearable?: boolean
  }
}

// 密码输入
interface PasswordFieldSchema extends FieldSchemaBase {
  type: 'password'
  options?: {
    showToggle?: boolean  // 是否显示密码切换按钮，默认 true
    maxLength?: number
  }
}

// 数字输入
interface NumberFieldSchema extends FieldSchemaBase {
  type: 'number'
  options?: {
    min?: number
    max?: number
    step?: number
    precision?: number  // 小数位数
  }
}

// 开关
interface SwitchFieldSchema extends FieldSchemaBase {
  type: 'switch'
  options?: {
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  }
}

// 下拉选择
interface SelectFieldSchema extends FieldSchemaBase {
  type: 'select'
  options: {
    items: SelectItem[] | RemoteDataSource
    multiple?: boolean
    searchable?: boolean
    allowCustom?: boolean  // 允许输入自定义值
  }
}

interface SelectItem {
  label: string | I18nKey
  value: string | number
  description?: string | I18nKey
  disabled?: boolean
  icon?: IconName
}

// 远程数据源（用于动态选项）
interface RemoteDataSource {
  type: 'remote'
  api: string  // API 端点
  labelField: string
  valueField: string
  params?: Record<string, string>
}

// 列表组件
interface ListFieldSchema extends FieldSchemaBase {
  type: 'list'
  options: {
    itemType: 'text' | 'number' | 'object'
    itemSchema?: FieldSchema[]  // 当 itemType 为 object 时
    maxItems?: number
    minItems?: number
    addButtonText?: string | I18nKey
    sortable?: boolean
  }
}

// 折叠面板（静态布局）
interface AccordionFieldSchema extends FieldSchemaBase {
  type: 'accordion'
  options: {
    items: AccordionItem[]
    defaultExpanded?: string[]
    selectionMode?: 'single' | 'multiple'
    variant?: 'splitted' | 'bordered' | 'light' | 'shadow'
  }
}

interface AccordionItem {
  key: string
  title: string | I18nKey
  subtitle?: string | I18nKey
  icon?: IconName
  iconColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  fields: FieldSchema[]
}

// 标签页（静态布局）
interface TabsFieldSchema extends FieldSchemaBase {
  type: 'tabs'
  options: {
    items: TabItem[]
    variant?: 'solid' | 'bordered' | 'light' | 'underlined'
  }
}

interface TabItem {
  key: string
  title: string | I18nKey
  icon?: IconName
  fields: FieldSchema[]
}

// ============================================
// 动态数组组件（核心复杂组件）
// ============================================

// 简单值列表
interface ListFieldSchema extends FieldSchemaBase {
  type: 'list'
  options: {
    /** 列表项类型 */
    itemType: 'text' | 'number'
    /** 最大项数 */
    maxItems?: number
    /** 最小项数 */
    minItems?: number
    /** 添加按钮文本 */
    addButtonText?: string | I18nKey
    /** 是否可排序 */
    sortable?: boolean
    /** 是否可折叠（数量多时） */
    collapsible?: boolean
    /** 每项的占位符 */
    itemPlaceholder?: string | I18nKey
    /** 每项的验证规则 */
    itemRules?: ValidationRule[]
  }
}

// 对象数组列表（最复杂）
interface ObjectListFieldSchema extends FieldSchemaBase {
  type: 'object-list'
  options: {
    /** 对象内的字段定义 */
    itemSchema: FieldSchema[]

    /** 显示模式 */
    displayMode: 'card' | 'table' | 'inline'

    /** 卡片模式下，用于显示预览的字段 key 列表 */
    previewFields?: string[]

    /** 卡片模式下，显示的标题字段 */
    titleField?: string

    /** 表格模式下，列定义 */
    columns?: TableColumn[]

    /** 最大项数 */
    maxItems?: number

    /** 最小项数 */
    minItems?: number

    /** 添加按钮文本 */
    addButtonText?: string | I18nKey

    /** 是否可排序 */
    sortable?: boolean

    /** 编辑弹窗配置 */
    editModal?: {
      title?: string | I18nKey
      size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
      /** 弹窗内字段的布局 */
      columns?: 1 | 2
    }

    /** 空状态提示 */
    emptyText?: string | I18nKey

    /** 确认删除 */
    confirmDelete?: boolean
  }
}

interface TableColumn {
  /** 对应的字段 key */
  field: string
  /** 列标题 */
  title: string | I18nKey
  /** 列宽 */
  width?: string | number
  /** 是否可排序 */
  sortable?: boolean
  /** 显示格式化 */
  format?: 'default' | 'boolean' | 'date' | 'badge'
}

// 键值对编辑器
interface KeyValueFieldSchema extends FieldSchemaBase {
  type: 'key-value'
  options: {
    /** 键的标签 */
    keyLabel?: string | I18nKey
    /** 值的标签 */
    valueLabel?: string | I18nKey
    /** 键的占位符 */
    keyPlaceholder?: string | I18nKey
    /** 值的占位符 */
    valuePlaceholder?: string | I18nKey
    /** 键是否可编辑（有时候 key 是固定的） */
    keyEditable?: boolean
    /** 预定义的 key 列表（下拉选择） */
    predefinedKeys?: SelectItem[]
    /** 值类型 */
    valueType?: 'text' | 'number' | 'boolean' | 'select'
    /** 值为 select 时的选项 */
    valueOptions?: SelectItem[]
    /** 是否可排序 */
    sortable?: boolean
  }
}

// JSON 编辑器（兜底方案）
interface JsonEditorFieldSchema extends FieldSchemaBase {
  type: 'json-editor'
  options: {
    /** 高度 */
    height?: string | number
    /** JSON Schema 验证 */
    jsonSchema?: object
    /** 是否显示格式化按钮 */
    showFormat?: boolean
    /** 是否显示行号 */
    showLineNumbers?: boolean
    /** 语言模式 */
    language?: 'json' | 'yaml'
  }
}
```

### 3.4 条件表达式

用于实现字段联动（显示/隐藏、启用/禁用）：

```typescript
type ConditionExpression =
  | SimpleCondition
  | AndCondition
  | OrCondition
  | NotCondition

interface SimpleCondition {
  field: string      // 依赖的字段 key
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'empty' | 'notEmpty'
  value?: unknown
}

interface AndCondition {
  and: ConditionExpression[]
}

interface OrCondition {
  or: ConditionExpression[]
}

interface NotCondition {
  not: ConditionExpression
}
```

**示例：**

```json
{
  "key": "redis.password",
  "type": "password",
  "label": "Redis 密码",
  "hidden": {
    "field": "redis.enable",
    "operator": "eq",
    "value": false
  }
}
```

### 3.5 验证规则

```typescript
interface ValidationRule {
  /** 规则类型 */
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom'

  /** 规则参数 */
  value?: unknown

  /** 错误消息 */
  message?: string | I18nKey
}
```

**内置验证器：**

| 类型 | 参数 | 说明 |
|------|------|------|
| `required` | - | 必填 |
| `minLength` | `number` | 最小长度 |
| `maxLength` | `number` | 最大长度 |
| `min` | `number` | 最小值 |
| `max` | `number` | 最大值 |
| `pattern` | `string` (正则) | 正则匹配 |
| `email` | - | 邮箱格式 |
| `url` | - | URL 格式 |
| `ip` | - | IP 地址格式 |
| `port` | - | 端口号 (1-65535) |
| `custom` | `string` | 自定义验证器名称 |

---

## 四、图标系统

使用 `lucide-react` 图标库，通过图标名称引用：

```typescript
type IconName =
  | 'globe' | 'wifi' | 'film' | 'help-circle' | 'eye' | 'eye-off'
  | 'settings' | 'user' | 'lock' | 'mail' | 'phone' | 'calendar'
  | 'clock' | 'search' | 'plus' | 'minus' | 'trash' | 'edit'
  | 'check' | 'x' | 'alert-circle' | 'info' | 'warning'
  // ... 更多图标
```

---

## 五、国际化支持

### 5.1 I18n Key 格式

```typescript
interface I18nKey {
  $i18n: string      // i18n key
  defaultValue?: string  // 默认值（当 key 不存在时）
}

// 简写形式（字符串以 $ 开头）
"$server.host"  // 等价于 { $i18n: "server.host" }
```

### 5.2 示例

```json
{
  "key": "http.host",
  "type": "text",
  "label": { "$i18n": "server.host", "defaultValue": "监听地址" },
  "description": "$server.hostDesc"
}
```

---

## 六、完整示例

### 6.1 服务器配置 Schema（静态布局示例）

```json
{
  "version": "1.0",
  "id": "server-config",
  "title": "$config.server.title",
  "options": {
    "columns": 2,
    "submit": {
      "text": "$common.save",
      "position": "top"
    }
  },
  "fields": [
    {
      "type": "accordion",
      "key": "_layout",
      "options": {
        "defaultExpanded": ["http"],
        "selectionMode": "multiple",
        "items": [
          {
            "key": "http",
            "title": "$server.httpServer",
            "subtitle": "$server.httpServerDesc",
            "icon": "globe",
            "iconColor": "primary",
            "fields": [
              {
                "key": "http.host",
                "type": "text",
                "label": "$server.host",
                "description": "$server.hostDesc",
                "defaultValue": "0.0.0.0",
                "layout": { "span": 1 }
              },
              {
                "key": "http.port",
                "type": "number",
                "label": "$server.port",
                "description": "$server.portDesc",
                "defaultValue": 7777,
                "layout": { "span": 1 },
                "options": {
                  "min": 1,
                  "max": 65535
                },
                "rules": [
                  { "type": "required", "message": "$validation.portRequired" },
                  { "type": "port" }
                ]
              },
              {
                "key": "http.auth_key",
                "type": "password",
                "label": "$server.authKey",
                "description": "$server.authKeyDesc",
                "layout": { "span": 1 }
              },
              {
                "key": "_spacer1",
                "type": "group",
                "layout": { "span": 1 }
              },
              {
                "key": "http.username",
                "type": "text",
                "label": "$server.username",
                "description": "$server.usernameDesc",
                "layout": { "span": 1 }
              },
              {
                "key": "http.password",
                "type": "password",
                "label": "$server.password",
                "description": "$server.passwordDesc",
                "layout": { "span": 1 }
              }
            ]
          },
          {
            "key": "ws",
            "title": "$server.wsServer",
            "subtitle": "$server.wsServerDesc",
            "icon": "wifi",
            "iconColor": "secondary",
            "fields": [
              {
                "key": "ws_server.enable",
                "type": "switch",
                "label": "$server.enableWs",
                "tooltip": "$server.enableWsHint",
                "options": {
                  "color": "success"
                }
              }
            ]
          },
          {
            "key": "ffmpeg",
            "title": "$server.ffmpeg",
            "subtitle": "$server.ffmpegDesc",
            "icon": "film",
            "iconColor": "warning",
            "fields": [
              {
                "key": "ffmpeg.ffmpeg_path",
                "type": "text",
                "label": "$server.ffmpegPath",
                "description": "$server.ffmpegPathDesc",
                "placeholder": "ffmpeg"
              },
              {
                "key": "ffmpeg.ffprobe_path",
                "type": "text",
                "label": "$server.ffprobePath",
                "description": "$server.ffprobePathDesc",
                "placeholder": "ffprobe"
              },
              {
                "key": "ffmpeg.ffplayPath",
                "type": "text",
                "label": "$server.ffplayPath",
                "description": "$server.ffplayPathDesc",
                "placeholder": "ffplay"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### 6.2 对象数组示例（动态列表）

以下示例展示如何用 Schema 描述一个"场景配置列表"——每个场景是一个对象，包含多个字段：

**目标数据结构：**

```typescript
interface SceneConfig {
  scenes: Array<{
    name: string
    mode: 'whitelist' | 'blacklist'
    cd: number
    userCd: number
    enable: boolean
    users: string[]
  }>
}
```

**Schema 定义：**

```json
{
  "version": "1.0",
  "id": "scene-config",
  "title": "$scene.title",
  "fields": [
    {
      "key": "scenes",
      "type": "object-list",
      "label": "$scene.list",
      "description": "$scene.listDesc",
      "options": {
        "displayMode": "card",
        "titleField": "name",
        "previewFields": ["mode", "cd", "enable"],
        "addButtonText": "$scene.addScene",
        "sortable": true,
        "confirmDelete": true,
        "emptyText": "$scene.noScenes",
        "editModal": {
          "title": "$scene.editScene",
          "size": "lg",
          "columns": 2
        },
        "itemSchema": [
          {
            "key": "name",
            "type": "text",
            "label": "$scene.name",
            "required": true,
            "rules": [
              { "type": "required" },
              { "type": "maxLength", "value": 32 }
            ]
          },
          {
            "key": "mode",
            "type": "select",
            "label": "$scene.mode",
            "defaultValue": "whitelist",
            "options": {
              "items": [
                { "label": "$scene.whitelist", "value": "whitelist" },
                { "label": "$scene.blacklist", "value": "blacklist" }
              ]
            }
          },
          {
            "key": "cd",
            "type": "number",
            "label": "$scene.cd",
            "description": "$scene.cdDesc",
            "defaultValue": 0,
            "options": {
              "min": 0,
              "max": 86400
            }
          },
          {
            "key": "userCd",
            "type": "number",
            "label": "$scene.userCd",
            "description": "$scene.userCdDesc",
            "defaultValue": 0,
            "options": {
              "min": 0,
              "max": 86400
            }
          },
          {
            "key": "enable",
            "type": "switch",
            "label": "$scene.enable",
            "defaultValue": true,
            "options": {
              "color": "success"
            }
          },
          {
            "key": "users",
            "type": "list",
            "label": "$scene.users",
            "description": "$scene.usersDesc",
            "layout": { "span": 2, "newLine": true },
            "options": {
              "itemType": "text",
              "addButtonText": "$common.addUser",
              "itemPlaceholder": "$scene.userIdPlaceholder",
              "itemRules": [
                { "type": "pattern", "value": "^\\d{5,12}$", "message": "$validation.invalidUserId" }
              ]
            }
          }
        ]
      }
    }
  ]
}
```

**渲染效果（卡片模式）：**

```
┌─────────────────────────────────────────────────────────────┐
│ 场景配置列表                                        [+ 添加场景] │
│ 配置不同场景下的权限和冷却时间                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📋 默认场景                                  [⋮] [编辑] [×] │
│ │ ┌───────────┬───────────┬───────────┐                  │ │
│ │ │ 模式: 白名单 │ CD: 10秒   │ 状态: ✅   │                  │ │
│ │ └───────────┴───────────┴───────────┘                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📋 高级场景                                  [⋮] [编辑] [×] │
│ │ ┌───────────┬───────────┬───────────┐                  │ │
│ │ │ 模式: 黑名单 │ CD: 60秒   │ 状态: ❌   │                  │ │
│ │ └───────────┴───────────┴───────────┘                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│   暂无场景配置，点击上方按钮添加                               │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 键值对示例

**目标数据结构：**

```typescript
interface FileAssociations {
  associations: Record<string, string>  // { "*.md": "markdown", "*.json": "json" }
}
```

**Schema 定义：**

```json
{
  "version": "1.0",
  "id": "file-associations",
  "fields": [
    {
      "key": "associations",
      "type": "key-value",
      "label": "文件关联",
      "description": "将文件扩展名映射到语言类型",
      "options": {
        "keyLabel": "匹配模式",
        "valueLabel": "语言类型",
        "keyPlaceholder": "*.md",
        "valuePlaceholder": "markdown",
        "sortable": true
      }
    }
  ]
}
```

### 6.4 嵌套对象数组（复杂场景）

当对象内还有数组时，可以嵌套使用 `list` 或 `object-list`：

```json
{
  "key": "plugins",
  "type": "object-list",
  "options": {
    "displayMode": "card",
    "titleField": "name",
    "itemSchema": [
      {
        "key": "name",
        "type": "text",
        "label": "插件名称"
      },
      {
        "key": "commands",
        "type": "object-list",
        "label": "命令列表",
        "options": {
          "displayMode": "table",
          "columns": [
            { "field": "name", "title": "命令名" },
            { "field": "alias", "title": "别名" },
            { "field": "enable", "title": "启用", "format": "boolean" }
          ],
          "itemSchema": [
            { "key": "name", "type": "text", "label": "命令名" },
            { "key": "alias", "type": "tags", "label": "别名" },
            { "key": "enable", "type": "switch", "label": "启用" }
          ]
        }
      }
    ]
  }
}
```

### 6.5 何时使用 JSON 编辑器兜底

当数据结构满足以下条件时，建议直接使用 JSON 编辑器：

1. **嵌套层级 > 3 层**
2. **结构不固定**（动态 key、任意嵌套）
3. **开发者向配置**（目标用户是开发者）
4. **Schema 过于复杂难以维护**

```json
{
  "key": "advancedConfig",
  "type": "json-editor",
  "label": "高级配置",
  "description": "直接编辑 JSON 配置（适合高级用户）",
  "options": {
    "height": 400,
    "showFormat": true,
    "showLineNumbers": true,
    "jsonSchema": {
      "type": "object",
      "properties": {
        "rules": {
          "type": "array",
          "items": { "$ref": "#/definitions/rule" }
        }
      }
    }
  }
}
```

---

## 七、表单提交机制

### 7.1 数据流

```
用户操作 → Schema Renderer 更新本地状态 → 点击保存 → 验证 → 序列化 → API 调用
```

### 7.2 提交配置

```typescript
interface SubmitConfig {
  /** API 端点 */
  api: string

  /** HTTP 方法 */
  method?: 'POST' | 'PUT' | 'PATCH'

  /** 数据转换器 */
  transform?: 'flat' | 'nested'  // flat: { "a.b": 1 }, nested: { a: { b: 1 } }

  /** 额外参数 */
  extraParams?: Record<string, unknown>

  /** 成功消息 */
  successMessage?: string | I18nKey

  /** 成功后的回调行为 */
  onSuccess?: 'reload' | 'redirect' | 'none'

  /** 重定向地址 */
  redirectTo?: string
}
```

### 7.3 Schema 中的提交配置

```json
{
  "version": "1.0",
  "id": "server-config",
  "submit": {
    "api": "/api/config/server",
    "method": "PUT",
    "transform": "nested",
    "successMessage": "$server.saveSuccess"
  },
  "fields": [...]
}
```

---

## 八、前端实现架构

### 8.1 核心组件

```
src/components/schema-form/
├── SchemaForm.tsx          # 主入口组件
├── SchemaFormContext.tsx   # 表单上下文（状态、提交、验证）
├── FieldRenderer.tsx       # 字段渲染器（根据 type 分发）
├── fields/                 # 各类型字段组件
│   ├── TextField.tsx
│   ├── PasswordField.tsx
│   ├── NumberField.tsx
│   ├── SwitchField.tsx
│   ├── SelectField.tsx
│   ├── ListField.tsx
│   └── ...
├── layout/                 # 布局组件
│   ├── AccordionLayout.tsx
│   ├── TabsLayout.tsx
│   ├── GridLayout.tsx
│   └── CardLayout.tsx
├── validators/             # 验证器
│   ├── index.ts
│   └── rules.ts
├── utils/                  # 工具函数
│   ├── condition.ts        # 条件表达式求值
│   ├── path.ts             # 嵌套路径处理
│   └── i18n.ts             # 国际化处理
└── types.ts                # TypeScript 类型定义
```

### 8.2 使用方式

```tsx
import { SchemaForm } from '@/components/schema-form'

function ServerConfig() {
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [initialData, setInitialData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    // 从 API 获取 Schema 和初始数据
    Promise.all([
      fetch('/api/schema/server-config').then(r => r.json()),
      fetch('/api/config/server').then(r => r.json())
    ]).then(([schema, data]) => {
      setSchema(schema)
      setInitialData(data)
    })
  }, [])

  if (!schema) return <Loading />

  return (
    <SchemaForm
      schema={schema}
      initialData={initialData}
      onSubmit={async (data) => {
        await fetch('/api/config/server', {
          method: 'PUT',
          body: JSON.stringify(data)
        })
      }}
    />
  )
}
```

---

## 九、后端 API 规范

### 9.1 Schema 获取

```
GET /api/schema/{schemaId}

Response:
{
  "ok": true,
  "data": { /* FormSchema */ }
}
```

### 9.2 数据获取

```
GET /api/config/{configId}

Response:
{
  "ok": true,
  "data": { /* 配置数据 */ }
}
```

### 9.3 数据保存

```
PUT /api/config/{configId}

Body: { /* 配置数据 */ }

Response:
{
  "ok": true,
  "message": "保存成功"
}
```

### 9.4 远程数据源

```
GET /api/options/{optionId}?{params}

Response:
{
  "ok": true,
  "data": [
    { "label": "选项1", "value": "1" },
    { "label": "选项2", "value": "2" }
  ]
}
```

---

## 十、扩展机制

### 10.1 自定义验证器

后端可注册自定义验证器名称，前端需预先实现对应逻辑：

```json
{
  "key": "cron",
  "type": "text",
  "rules": [
    { "type": "custom", "value": "cron-expression", "message": "无效的 Cron 表达式" }
  ]
}
```

前端预注册：

```typescript
registerValidator('cron-expression', (value: string) => {
  // 验证 cron 表达式
  return isValidCron(value) || '无效的 Cron 表达式'
})
```

### 10.2 自定义字段组件（仅限前端扩展）

```typescript
registerFieldComponent('custom-editor', CustomEditorField)
```

---

## 十一、对比 VSCode 设计

| 特性 | VSCode Settings | 本方案 |
|------|-----------------|--------|
| 配置来源 | `package.json` contributes | JSON Schema |
| 渲染引擎 | 内置 Settings Editor | HeroUI + React |
| 样式控制 | 完全固定 | 完全固定 |
| 组件类型 | 约 10 种 | 20+ 种 |
| 嵌套支持 | 有限 | 完整 |
| 条件渲染 | 支持 | 支持 |
| 验证 | JSON Schema | 内置 + 自定义 |
| 表单提交 | 自动保存 | 手动/自动可配置 |

---

## 十二、实施计划

### Phase 1: 基础框架（1-2 周）

- [ ] 定义 TypeScript 类型
- [ ] 实现 SchemaForm 核心组件
- [ ] 实现基础输入组件（text, number, password, switch, select）
- [ ] 实现 Grid 布局

### Phase 2: 复杂组件（1-2 周）

- [ ] 实现 List 组件
- [ ] 实现 Accordion/Tabs 布局
- [ ] 实现条件表达式引擎
- [ ] 实现验证系统

### Phase 3: 完善功能（1 周）

- [ ] 国际化支持
- [ ] 远程数据源
- [ ] 表单提交处理
- [ ] 错误处理

### Phase 4: 迁移现有配置页面（2-3 周）

- [ ] 逐步迁移现有配置组件
- [ ] 性能优化
- [ ] 文档编写

---

## 十三、开放问题

1. **是否需要支持自定义样式覆盖？**
   - 建议：不支持，保持一致性

2. **是否需要支持动态 Schema（根据用户角色等）？**
   - 建议：后端根据权限返回不同 Schema

3. **大表单性能优化**
   - 可考虑虚拟滚动、分步加载

4. **Schema 版本兼容**
   - 需要定义版本迁移策略

---

## 附录 A: 类型定义完整代码

类型定义已迁移到独立共享包：`packages/schema-types/`

### 包结构

```
packages/schema-types/
├── package.json
├── README.md
├── tsconfig.json
├── tsdown.config.ts
└── src/
    ├── index.ts           # 主入口，导出所有类型
    ├── base.ts            # 基础类型：I18nString, IconName, 条件表达式, 验证规则等
    ├── schema.ts          # FormSchema 表单 Schema 定义
    ├── context.ts         # FormContextValue 表单上下文
    └── fields/
        ├── index.ts       # 字段入口，导出 FieldSchema 联合类型
        ├── common.ts      # FieldSchemaBase 字段基础接口
        ├── basic.ts       # 基础输入：text, password, number, textarea, switch, select
        ├── input.ts       # 高级输入：checkbox, radio, slider, color-picker 等
        ├── list.ts        # 列表类型：list, object-list, key-value, json-editor
        ├── layout.ts      # 布局组件：group, accordion, tabs, divider, alert 等
        ├── display.ts     # 展示组件：progress, avatar, chip, button 等
        └── container.ts   # 容器组件：card, modal, drawer, table 等
```

### 使用方式

**后端使用：**

```typescript
import type { FormSchema, TextFieldSchema, SelectFieldSchema } from '@karinjs/schema-types'

const schema: FormSchema = {
  version: '1.0',
  id: 'my-config',
  fields: [...]
}
```

**前端使用：**

```typescript
// webui 中的 types.ts 已重新导出所有类型
import type { FormSchema, FieldSchema } from '@/components/schema-form/types'
```

## 附录 B: 示例 Schema 集合

详见 `webui/src/mocks/schemaDemo.ts`
