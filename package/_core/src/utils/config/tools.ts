import type { GroupsObjectValue, PrivatesObjectValue } from '@/types'

/**
 * 传入一个数组 将数组中所有元素为字符串
 * @param data 数据
 */
export const formatArray = (data: any[]) => {
  try {
    return data.map((v: string) => String(v)) || []
  } catch {
    return []
  }
}

/**
 * 初始化count
 * @param count 计数器
 * @param key 键
 */
export const initCount = (
  count: Record<string, {
    /** 上一分钟调用次数 */
    start: number,
    /** 当前调用次数 */
    count: number
  }>,
  key: string
) => {
  if (!count[key]) {
    count[key] = { start: 0, count: 1 }
  } else {
    count[key].count++
  }
}

/**
 * @internal
 * 传入一个对象 将对象中的嵌套数组中所有元素为字符串
 * @param data 数据
 * @returns 统一后的数据
 */
export const formatObject = <T extends Record<string, any>> (data: T): T => {
  const list = {} as Record<string, any>

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      list[key] = formatArray(value)
      return
    }

    if (typeof value === 'object') {
      list[key] = formatObject(value)
      return
    }

    list[key] = value
  })
  return list as T
}

/**
 * @internal
 * @description 创建缓存对象
 */
export const createCount = () => {
  return {} as Record<string, {
    /** 上一分钟调用次数 */
    start: number,
    /** 当前调用次数 */
    count: number
  }>
}

/**
 * 获取缓存配置
 */
export const getCacheCfg = <T> (
  cache: Record<string, T>,
  count: ReturnType<typeof createCount>,
  keys: string[]
) => {
  /**
   * 场景唯一标识符: Bot:selfId:groupId:userId
   */
  const key = keys[0]
  /** 优先走缓存 */
  if (cache[key]) {
    initCount(count, key)
    return cache[key]
  }

  /** 如果缓存不存在 需要遍历keys生成事件key */
  for (let i = 0; i < keys.length; i++) {
    const v = keys[i]
    if (!cache[v]) {
      continue
    }

    /**
     * 如果是索引0 说明有键有对应的缓存
     * - 2025-05-09 03:19:37 使用更严谨的判断方法
     */
    if (i === 0 && v === key) {
      initCount(count, v)
      return cache[v]
    }

    /** 可能已经存在缓存了 */
    if (v === key) {
      initCount(count, v)
      return cache[v]
    }

    /** 最后创建缓存 */
    cache[key] = cache[v]
    initCount(count, key)
    return cache[key]
  }

  return cache.default
}

/**
 * 定时清理缓存
 * @param data 数据
 * @param count 计数器
 * @param cache 缓存
 */
export const clearCache = <T extends GroupsObjectValue | PrivatesObjectValue> (
  count: ReturnType<typeof createCount>,
  staticCache: Record<string, T>,
  dynamicCache: Record<string, T>
) => {
  setInterval(() => {
    Object.keys(count).forEach((key) => {
      if (count[key].count - count[key].start < 10) {
        /** 如果源数据中存在这个key 这个key在缓存中是不允许删除的 */
        if (staticCache[key]) {
          delete count[key]
          return
        }

        delete count[key]
        delete dynamicCache[key]
      } else {
        count[key].start = count[key].count
      }
    })
  }, 60000)
}
