# YamlEditor 使用说明

## 概述

`YamlEditor` 是一个用于编辑 YAML 文件的类。它提供了读取、修改、添加、删除和保存 YAML 文件的功能。这个类在应用中适用于对 YAML 配置文件进行操作的场景。

::: tip
**_最最最重要的是，可以保留注释信息，并且不会影响 YAML 文件的结构。_**
:::

[[toc]]

## 使用

### 导入和实例化

```js twoslash
import { YamlEditor } from 'node-karin'

// 创建一个 YamlEditor 实例，指定文件路径
const yamlEditor = new YamlEditor('./path/to/your/file.yaml')
```

### 加载文件

创建实例时，`YamlEditor` 会自动加载指定路径的 YAML 文件。如果文件不存在或读取出错，将会记录错误。

### 获取 YAML 中的值

```js twoslash
// 获取指定路径的值，路径用点号分隔
const value = yamlEditor.get('root.child.key')

if (value === false) {
  console.log('未找到指定路径')
} else {
  console.log('获取的值:', value)
}
```

通过 `get(path)` 方法获取 YAML 中指定路径的值。如果路径不存在，将返回 `false`。

### 设置 YAML 中的值

```js twoslash
// 设置指定路径的值
yamlEditor.set('root.child.key', 'newValue')
```

通过 `set(path, value)` 方法设置 YAML 中指定路径的值。如果路径不存在，将会创建相应的结构。

### 向 YAML 中添加新值

```js twoslash
// 向指定路径添加新值
yamlEditor.add('root.newPath', 'newValue')
```

使用 `add(path, value)` 方法，可以在 YAML 中的指定路径添加新值。如果路径不存在，将会创建相应的结构。

### 删除 YAML 中的值

```js twoslash
// 删除指定路径的值
const success = yamlEditor.del('root.child.key')

if (success) {
  console.log('删除成功')
} else {
  console.log('删除失败')
}
```

`del(path)` 方法用于删除 YAML 中指定路径的值。如果成功删除，将返回 `true` ；否则返回 `false` 。

### 向 YAML 中的数组添加新元素

```js twoslash
// 向指定路径的数组添加新元素
yamlEditor.append('root.array', 'newElement', true) // 在数组开头添加

yamlEditor.append('root.array', 'newElement') // 在数组末尾添加
```

使用 `append(path, value, prepend)` 方法，可以向 YAML 中指定路径的数组添加新元素。`prepend` 参数决定是否在数组的开头添加元素，默认是在末尾添加。

### 检查指定路径的键是否存在

```js twoslash
// 向指定路径的数组添加新元素
yamlEditor.has('a.b.c') // true
yamlEditor.has('x.y.z') // false
```

使用 `has(path)` 方法，可以检查 YAML 中指定路径的键是否存在。如果存在，返回 `true` ；否则返回 `false` 。

### 查询指定路径中是否包含指定的值

```js twoslash
// 查询指定路径中是否包含指定的值
yamlEditor.hasVal('a.b.c', 'val') // true
yamlEditor.hasVal('x.y.z', 'val') // false
```

使用 `hasVal(path, value)` 方法，可以查询 YAML 中指定路径的值是否包含指定的值。如果包含，返回 `true` ；否则返回 `false` 。

### 保存文件

```js twoslash
// 保存修改后的 YAML 文件
yamlEditor.save()
```

通过 `save()` 方法保存 YAML 文件。这个方法将会覆盖原文件，确保之前的修改被保存。如果保存过程中出错，将记录错误。

## 注意事项

- **日志记录**：`YamlEditor` 使用了日志记录功能，确保在操作过程中能够及时发现问题。
- **错误处理**：所有方法都进行了错误处理，当发生异常时将记录错误。
- **路径格式**：指定路径时使用点号分隔，例如 `'root.child.key'` 。
- **保存文件**：使用 `save()` 方法确保所做的修改被写入文件。

## 示例

```js
// 创建 YamlEditor 实例
const yamlEditor = new YamlEditor('./example.yaml')

// 获取值
const existingValue = yamlEditor.get('a.b.c')

// 设置值
yamlEditor.set('x.y.z', 'Hello, YAML!')

// 添加新值
yamlEditor.add('new.path', { key: 'value' })

// 删除值
yamlEditor.del('delete.me')

// 向数组中添加元素
yamlEditor.append('my.array', 'new item')

// 检查指定路径是否存在
yamlEditor.has('a.b.c') // true
yamlEditor.has('x.y.z') // false

// 查询指定路径中是否包含指定的值
yamlEditor.hasVal('a.b.c', 'val') // true
yamlEditor.hasVal('x.y.z', 'val') // false

// 保存更改
yamlEditor.save()
```

通过这些操作，您可以方便地读取和修改 YAML 文件。
