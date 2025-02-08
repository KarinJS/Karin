# 事件监听器

## 文件变动

> 第二个key是组合文件名称

产生2种事件 key不同 事件内容形同

key: `karin:file:change`
key: `karin:file:change:config.json`

```json5
{
  "file": "config.json", // 文件名
  "old": {}, // 旧文件内容
  "data": {} // 新文件内容
}
```
