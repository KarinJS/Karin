# redis

```js twoslash
import { redis } from 'node-karin'

/** 存储一个键值对 */
await redis.set('key', 'value')

/** 存储一个键值对 60秒后过期 */
await redis.set('key', 'value', { EX: 60 })

/** 获取指定键的值 */
const value = await redis.get('key')
console.log(value)

/** 删除指定键 */
await redis.del('key')

/** 获取所有键 慎用... 返回数组 */
const all = await redis.keys('*')
console.log(all)

/** 模糊获取以k开头的所有键列表 返回数组 */
const keys = await redis.keys('k*')
/** 打印所有键的值 */
for (const key of keys) {
    const value = await redis.get(key)
    console.log(value)
}
```
