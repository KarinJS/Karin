import { redis } from '../../db/redis/redis'

interface CounterData {
  [key: string]: number | CounterData
}
/**
 * 计数器
 * karin:counter:message 消息Counter
 *   karin:counter:message:send 发送消息总数
 *     karin:counter:message:send:success 发送消息成功数
 *     karin:counter:message:send:failed 发送消息失败数
 * karin:counter:message:recive 消息接收Counter
 *   karin:counter:message:recive:total 消息接收总数
 *   karin:counter:message:recive:{e.user_id} 某用户消息接收数
 *   karin:counter:process 进程Counter
 *    karin:counter:process:start 总启动次数
 *    karin:counter:process:uptime 总运行时间
 */
class Counter {
  private readonly redisPrefix: string

  constructor () {
    this.redisPrefix = 'karin:counter:'
    // console.log('FunctionCounter 初始化')
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

  /**
   * 增加计数
   * @param key - 计数键
   * @param value - 增加的值，默认为 1
   * @returns 增加后的计数值
   * 现在计数器返回一直为0，需要检查
   */
  async increment (key: string, value: number = 1): Promise<number> {
    const keyWithDate = this.getKeyWithDate(key)
    const totalKey = this.getTotalKey(key)
    const redisKeyWithDate = `${this.redisPrefix}${keyWithDate}`
    const redisTotalKey = `${this.redisPrefix}${totalKey}`

    logger.debug(`尝试增加计数: ${redisKeyWithDate} 和 ${redisTotalKey}，增加值: ${value}`)

    const multi = redis.multi()
    multi.incrBy(redisKeyWithDate, value)
    multi.incrBy(redisTotalKey, value)
    const results = await multi.exec() as [null, number][] | null

    const newDateValue = results?.[0]?.[1] ?? 0

    // console.log(`计数增加成功: ${redisKeyWithDate} = ${newDateValue}`)
    // TODO: newDateValue 为 0
    return newDateValue
  }

  async getCount (key: string): Promise<{ date: number; total: number }> {
    const keyWithDate = this.getKeyWithDate(key)
    const totalKey = this.getTotalKey(key)
    const redisKeyWithDate = `${this.redisPrefix}${keyWithDate}`
    const redisTotalKey = `${this.redisPrefix}${totalKey}`

    // console.log(`获取计数: ${redisKeyWithDate} 和 ${redisTotalKey}`)

    const [dateCount, totalCount] = await Promise.all([
      redis.get(redisKeyWithDate),
      redis.get(redisTotalKey),
    ])

    const result = {
      date: dateCount ? parseInt(dateCount) : 0,
      total: totalCount ? parseInt(totalCount) : 0,
    }

    // console.log(`当前计数: ${redisKeyWithDate} = ${result.date}, ${redisTotalKey} = ${result.total}`)
    return result
  }

  async getTodayCount (key: string): Promise<number> {
    const keyWithDate = this.getKeyWithDate(key)
    const redisKey = `${this.redisPrefix}${keyWithDate}`
    const count = await redis.get(redisKey)
    const numCount = count ? parseInt(count) : 0
    return numCount
  }

  async getCountsFromKey (key: string): Promise<CounterData> {
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
      // console.log(`重置特定计数: ${key}`)
      await redis.del(`${this.redisPrefix}${key}`)
    } else {
      // console.log('重置所有计数')
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

    const value = await redis.get(totalKey)
    const totalCount = value ? parseInt(value) : 0

    return totalCount
  }
}

// console.log('开始创建 FunctionCounter 实例')
const counter = new Counter()
// console.log('FunctionCounter 实例创建完成')

export default counter
