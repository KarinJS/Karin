---
agent: agent
---

# 代码优化任务：命名规范与复杂度优化

## 任务目标

优化选中代码的命名规范和代码复杂度，提升代码的可读性、可维护性和整体质量。

## 核心要求

### 1. 命名优化（主要任务）

#### 命名风格原则
- **简洁优雅**：使用简短但有意义的名称，避免冗长和模糊
- **语义清晰**：名称应准确表达其用途和含义
- **动词前缀**：函数命名优先使用动词前缀，如：
  - `get*` - 获取数据（纯查询，无副作用）
  - `set*` - 设置数据
  - `create*` - 创建新实例/对象
  - `register*` - 注册/添加到系统
  - `build*` - 构建复杂对象
  - `fetch*` - 从外部获取数据
  - `load*` - 加载资源
  - `parse*` - 解析数据
  - `format*` - 格式化数据
  - `validate*` - 验证数据
  - `calculate*` - 计算结果
  - `handle*` - 处理事件/逻辑
  - `process*` - 处理/加工数据
  - `transform*` - 转换数据结构
  - `is*` / `has*` / `should*` - 布尔判断

#### 具体规范

**函数命名**：
- ✅ 正确：`getUserById`, `createPlugin`, `registerHandler`, `isValid`
- ❌ 错误：`user`, `plugin`, `doSomething`, `check`

**变量命名**：
- 使用名词或形容词
- 布尔值使用 `is*`, `has*`, `should*`, `can*`, `will*` 前缀
- ✅ 正确：`userId`, `isActive`, `hasPermission`, `config`
- ❌ 错误：`active`, `permission`, `data1`, `temp`

**常量命名**：
- 使用 UPPER_SNAKE_CASE（全大写蛇形）表示全局常量
- 使用 camelCase 表示局部常量
- ✅ 正确：`MAX_RETRY_COUNT`, `API_BASE_URL`, `defaultConfig`
- ❌ 错误：`Constant`, `const_value`

**类/接口命名**：
- 使用 PascalCase（大驼峰）
- 使用名词或名词短语
- 接口可以使用 `I` 前缀或直接使用描述性名称
- ✅ 正确：`UserManager`, `PluginLoader`, `IEventHandler`
- ❌ 错误：`manager`, `loader`, `handler`

**类型命名**：
- 使用 PascalCase
- 类型别名使用描述性名称，可添加 `Type` 后缀避免混淆
- ✅ 正确：`ConfigOptions`, `CallbackFunction`, `MessageEventMap`
- ❌ 错误：`config`, `cb`, `map`

### 2. 降低圈复杂度（次要任务）

#### 优化策略

**优先编写纯函数**：
```typescript
// ❌ 避免副作用和外部依赖
let total = 0
function addToTotal(value) {
  total += value
  return total
}

// ✅ 纯函数：相同输入总是得到相同输出，无副作用
function add(a, b) {
  return a + b
}

// ❌ 避免修改输入参数
function updateUser(user) {
  user.updatedAt = Date.now()
  return user
}

// ✅ 返回新对象，不修改原对象
function updateUser(user) {
  return {
    ...user,
    updatedAt: Date.now(),
  }
}
```

**纯函数的优势**：
- 可测试性强：不依赖外部状态，易于编写单元测试
- 可预测性高：相同输入必定产生相同输出
- 易于调试：没有隐藏的副作用
- 可缓存：可以安全地缓存函数结果
- 并发安全：不会产生竞态条件

**提前返回（Early Return）**：
```typescript
// ❌ 避免深层嵌套
function process(data) {
  if (data) {
    if (data.isValid) {
      if (data.hasPermission) {
        // 处理逻辑
      }
    }
  }
}

// ✅ 使用提前返回
function process(data) {
  if (!data) return
  if (!data.isValid) return
  if (!data.hasPermission) return
  // 处理逻辑
}
```

**函数拆分**：
- 单一职责：每个函数只做一件事
- 提取复杂条件判断为独立函数
- 提取重复逻辑为可复用函数
```typescript
// ❌ 避免过长函数
function processUser(user) {
  // 50行代码...
}

// ✅ 拆分为多个函数
function processUser(user) {
  if (!validateUser(user)) return
  const data = transformUserData(user)
  return saveUser(data)
}
```

**使用数据结构替代条件**：
```typescript
// ❌ 避免过多条件
function getStatus(code) {
  if (code === 1) return 'success'
  if (code === 2) return 'pending'
  if (code === 3) return 'failed'
}

// ✅ 使用映射
const STATUS_MAP = {
  1: 'success',
  2: 'pending',
  3: 'failed',
}
function getStatus(code) {
  return STATUS_MAP[code]
}
```

**合并相似条件**：
```typescript
// ❌ 避免重复条件
if (type === 'A' || type === 'B') { /* ... */ }
if (type === 'C' || type === 'D') { /* ... */ }

// ✅ 使用数组/Set
const GROUP_A = new Set(['A', 'B'])
const GROUP_B = new Set(['C', 'D'])
if (GROUP_A.has(type)) { /* ... */ }
if (GROUP_B.has(type)) { /* ... */ }
```

## 约束条件

1. **保持功能一致**：优化后的代码必须保持原有功能完全不变
2. **类型安全**：保持 TypeScript 类型定义的完整性和准确性
3. **向后兼容**：如果是公共 API，需要考虑向后兼容性
4. **遵循项目规范**：遵循项目现有的代码风格和约定
5. **不破坏现有逻辑**：不改变控制流和业务逻辑

## 成功标准

### 命名优化
- ✅ 所有函数名使用清晰的动词前缀
- ✅ 变量名具有明确的语义，无需注释即可理解
- ✅ 布尔值使用 `is*`/`has*`/`should*` 等前缀
- ✅ 避免使用 `temp`、`data`、`obj` 等模糊名称
- ✅ 避免使用单字母变量（循环索引除外）

### 复杂度优化
- ✅ 圈复杂度降低到合理水平（建议 < 10）
- ✅ 嵌套层级不超过 3 层
- ✅ 函数长度控制在合理范围（建议 < 50 行）
- ✅ 提取了可复用的逻辑片段
- ✅ 尽可能使用纯函数（无副作用，可预测）

### 整体质量
- ✅ 代码可读性显著提升
- ✅ 易于理解和维护
- ✅ 通过所有现有测试（如果有）
- ✅ 无编译错误和类型错误

## 工作流程

1. **分析阶段**：
   - 识别命名不规范的变量、函数、类
   - 识别高复杂度的函数和深层嵌套
   - 识别重复逻辑和可优化点

2. **规划阶段**：
   - 列出需要重命名的标识符及新名称
   - 规划函数拆分和重构方案
   - 评估改动影响范围

3. **执行阶段**：
   - 优先处理命名优化
   - 其次处理复杂度优化
   - 确保每次改动都经过验证

4. **验证阶段**：
   - 检查是否有编译错误
   - 确认功能保持一致
   - 验证代码质量提升

## 输出要求

1. **直接执行修改**：使用工具直接修改代码，不要只输出建议
2. **分批处理**：如果改动较多，分批次进行，确保每次改动的准确性
3. **保持一致性**：如果某个标识符在多处使用，需要全部更新
4. **简要说明**：完成后简要说明优化了哪些方面

## 示例

### 优化前
```typescript
function load(p: unknown) {
  if (isClass<Plugin>(p)) {
    const i = new p()
    if (i.options?.name) {
      if ('init' in i) {
        await i.init()
      }
      cache.register.classPlugin(i, p)
    }
  }
}
```

### 优化后
```typescript
function registerClassPlugin(PluginClass: unknown) {
  if (!isClass<Plugin>(PluginClass)) return null
  
  const instance = new PluginClass()
  if (!hasValidOptions(instance)) return null
  
  await initializePluginIfNeeded(instance)
  cache.register.classPlugin(instance, PluginClass)
}

function hasValidOptions(instance: Plugin): boolean {
  return instance.options?.name != null
}

async function initializePluginIfNeeded(instance: Plugin): Promise<void> {
  if ('init' in instance && typeof instance.init === 'function') {
    await instance.init()
  }
}
```

## 注意事项

- 优先保证代码正确性，其次考虑优化程度
- 如果某个命名已经很清晰，无需强行修改
- 复杂度优化不应该以牺牲可读性为代价
- 遇到不确定的改动，优先保守处理
- **优先编写纯函数**：如果函数可以改造为纯函数（无副作用、相同输入产生相同输出），请尽量这样做
- 如果必须有副作用（如 I/O 操作、状态修改），应将副作用代码与纯逻辑分离