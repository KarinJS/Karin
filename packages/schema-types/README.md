# @karinjs/schema-types

Schema-Driven UI 类型定义包，供前后端共同使用。

## 概述

此包提供了一套完整的 TypeScript 类型定义，用于实现类似 VSCode 设置页面的 Schema-Driven UI 系统。后端只需定义 JSON Schema，前端即可自动渲染对应的 HeroUI 组件。

## 安装

```bash
pnpm add @karinjs/schema-types
```

## 使用

### 后端定义 Schema

```typescript
import type { FormSchema } from '@karinjs/schema-types'

const serverConfigSchema: FormSchema = {
  version: '1.0',
  id: 'server-config',
  title: '服务器配置',
  description: '配置服务器连接参数',
  fields: [
    {
      key: 'host',
      type: 'text',
      label: '主机地址',
      placeholder: 'localhost',
      required: true,
      rules: [
        { type: 'required', message: '主机地址不能为空' }
      ]
    },
    {
      key: 'port',
      type: 'number',
      label: '端口',
      defaultValue: 8080,
      options: {
        min: 1,
        max: 65535
      }
    },
    {
      key: 'protocol',
      type: 'select',
      label: '协议',
      options: {
        items: [
          { label: 'HTTP', value: 'http' },
          { label: 'HTTPS', value: 'https' }
        ]
      }
    }
  ],
  submit: {
    api: '/api/server/config',
    method: 'PUT',
    successMessage: '配置已保存'
  }
}

// 发送给前端
app.get('/api/server/schema', (req, res) => {
  res.json(serverConfigSchema)
})
```

### 前端渲染表单

```tsx
import type { FormSchema } from '@karinjs/schema-types'
import { SchemaForm } from '@/components/schema-form'

function ServerConfig() {
  const [schema, setSchema] = useState<FormSchema | null>(null)

  useEffect(() => {
    fetch('/api/server/schema')
      .then(res => res.json())
      .then(setSchema)
  }, [])

  if (!schema) return <Loading />

  return (
    <SchemaForm
      schema={schema}
      onSubmit={(values) => {
        console.log('提交数据:', values)
      }}
    />
  )
}
```

## 字段类型

### 基础输入

- `text` - 单行文本
- `password` - 密码输入
- `number` - 数字输入
- `textarea` - 多行文本
- `switch` - 开关
- `select` - 下拉选择

### 高级输入

- `checkbox` - 复选框
- `checkbox-group` - 复选框组
- `radio-group` - 单选组
- `autocomplete` - 自动补全
- `slider` - 滑块
- `date-picker` - 日期选择
- `date-range-picker` - 日期范围选择
- `time-input` - 时间输入
- `color-picker` - 颜色选择
- `image-upload` - 图片上传
- `file-upload` - 文件上传
- `tags-input` - 标签输入
- `otp-input` - 验证码输入
- `rating` - 评分

### 列表类型

- `list` - 简单列表
- `object-list` - 对象数组
- `key-value` - 键值对
- `json-editor` - JSON 编辑器

### 布局组件

- `group` - 分组容器
- `accordion` - 折叠面板
- `tabs` - 标签页
- `divider` - 分隔线
- `alert` - 提示框
- `spacer` - 间距
- `scroll-area` - 滚动区域

### 展示组件

- `progress` - 进度条
- `avatar` - 头像
- `badge` - 徽章
- `chip` - 标签
- `snippet` - 代码片段
- `link` - 链接
- `user-card` - 用户卡片
- `image` - 图片
- `button` - 按钮
- `skeleton` - 骨架屏
- `pagination` - 分页

### 容器组件

- `card` - 卡片
- `popover-trigger` - 弹出框触发器
- `tooltip-wrapper` - 工具提示
- `drawer-trigger` - 抽屉触发器
- `modal-trigger` - 模态框触发器
- `table` - 表格
- `listbox` - 列表框
- `dropdown` - 下拉菜单
- `breadcrumbs` - 面包屑

## 国际化支持

所有文本字段都支持国际化：

```typescript
// 普通字符串
{ label: '用户名' }

// 国际化键
{ label: { $i18n: 'form.username', defaultValue: '用户名' } }
```

## 条件表达式

支持字段间的联动：

```typescript
{
  key: 'sslCert',
  type: 'file-upload',
  label: 'SSL 证书',
  // 仅在 protocol 为 https 时显示
  hidden: {
    not: { field: 'protocol', operator: 'eq', value: 'https' }
  }
}
```

## License

MIT
