import { redis } from '../../db/redis/redis'

interface CounterData {
  [key: string]: number | CounterData
}

class Counter {
  private readonly redisPrefix: string

  constructor () {
    this.redisPrefix = 'karin:counter:'
    console.log('FunctionCounter 初始化')
  }

  private getDateString (): string {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  }

  private getKeyWithDate (key: string): string {
    return `${key}:${this.getDateString()}`
  }

  private getTotalKey (key: string): string {
    return `${key}:total`
  }

  async increment (key: string, value: number = 1): Promise<number> {
    const keyWithDate = this.getKeyWithDate(key)
    const totalKey = this.getTotalKey(key)
    const redisKeyWithDate = `${this.redisPrefix}${keyWithDate}`
    const redisTotalKey = `${this.redisPrefix}${totalKey}`

    console.log(`尝试增加计数: ${redisKeyWithDate} 和 ${redisTotalKey}，增加值: ${value}`)

    const multi = redis.multi()
    multi.incrBy(redisKeyWithDate, value)
    multi.incrBy(redisTotalKey, value)
    const results = await multi.exec() as [null, number][] | null

    const newDateValue = results?.[0]?.[1] ?? 0
    const newTotalValue = results?.[1]?.[1] ?? 0

    console.log(`计数增加成功: ${redisKeyWithDate} = ${newDateValue}, ${redisTotalKey} = ${newTotalValue}`)
    return newDateValue
  }

  async getCount (key: string): Promise<{ date: number; total: number }> {
    const keyWithDate = this.getKeyWithDate(key)
    const totalKey = this.getTotalKey(key)
    const redisKeyWithDate = `${this.redisPrefix}${keyWithDate}`
    const redisTotalKey = `${this.redisPrefix}${totalKey}`

    console.log(`获取计数: ${redisKeyWithDate} 和 ${redisTotalKey}`)

    const [dateCount, totalCount] = await Promise.all([
      redis.get(redisKeyWithDate),
      redis.get(redisTotalKey),
    ])

    const result = {
      date: dateCount ? parseInt(dateCount) : 0,
      total: totalCount ? parseInt(totalCount) : 0,
    }

    console.log(`当前计数: ${redisKeyWithDate} = ${result.date}, ${redisTotalKey} = ${result.total}`)
    return result
  }

  async getTodayCount (key: string): Promise<number> {
    const keyWithDate = this.getKeyWithDate(key)
    const redisKey = `${this.redisPrefix}${keyWithDate}`
    console.log(`获取今日计数: ${redisKey}`)
    const count = await redis.get(redisKey)
    const numCount = count ? parseInt(count) : 0
    console.log(`今日计数: ${redisKey} = ${numCount}`)
    return numCount
  }

  async getCountsFromKey (key: string): Promise<CounterData> {
    console.log(`获取 ${key} 及其后续的所有计数`)
    const pattern = `${this.redisPrefix}${key}*`
    const keys = await redis.keys(pattern)
    const counts: CounterData = {}
    for (const fullKey of keys) {
      const value = await redis.get(fullKey)
      const cleanKey = fullKey.replace(this.redisPrefix, '')
      this.setNestedValue(counts, cleanKey, parseInt(value || '0'))
    }
    return counts
  }

  async reset (key?: string): Promise<void> {
    if (key) {
      console.log(`重置特定计数: ${key}`)
      await redis.del(`${this.redisPrefix}${key}`)
    } else {
      console.log('重置所有计数')
      const keys = await redis.keys(`${this.redisPrefix}*`)
      if (keys.length > 0) {
        await redis.del(keys)
      }
    }
  }

  private setNestedValue (obj: CounterData, key: string, value: number): void {
    const parts = key.split('.')
    let current: CounterData = obj
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) {
        current[parts[i]] = {}
      }
      current = current[parts[i]] as CounterData
    }
    current[parts[parts.length - 1]] = value
  }

  async getTotalCount (key?: string): Promise<number> {
    const totalKey = key
      ? `${this.redisPrefix}${key}:total`
      : `${this.redisPrefix}total`
    console.log(`获取总计数，键: ${totalKey}`)

    const value = await redis.get(totalKey)
    const totalCount = value ? parseInt(value) : 0

    console.log(`总计数: ${totalCount}`)
    return totalCount
  }
}

console.log('开始创建 FunctionCounter 实例')
const counter = new Counter()
console.log('FunctionCounter 实例创建完成')

export default counter
