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
 * 合并对象 专属privates、groups
 * @param def 默认配置
 * @param cfg 配置
 * @returns 合并后的配置
 */
export const mergeDegAndCfg = <T extends Record<string, any>> (def: T, cfg: T): T => {
  const list = {} as Record<string, any>

  Object.entries(cfg).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      list[key] = formatArray(value || def[key])
      return
    }

    if (typeof value === 'number') {
      value = Number(value)
      list[key] = isNaN(value) ? def[key] : value
      return
    }

    list[key] = value || def[key]
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
  /** 优先走缓存 */
  if (keys[0] in cache) {
    if (!count[keys[0]]) {
      count[keys[0]] = { start: 0, count: 0 }
    }

    count[keys[0]].count++
    return cache[keys[0]]
  }

  for (const index in keys) {
    if (keys[index] in cache) {
      if (index === '0') {
        /** 如果是索引0 说明有键有对应的缓存 */
        count[keys[index]] = { start: 0, count: 1 }
      } else {
        /** 如果索引不为0 说明有键没有对应的缓存 此时创建缓存 */
        count[keys[0]] = { start: 0, count: 1 }
        cache[keys[0]] = cache[keys[index]]
      }

      return cache[keys[index]]
    }
  }

  return cache.default
}

/**
 * 定时清理缓存
 */
export const clearCache = <T> (
  count: ReturnType<typeof createCount>,
  cache: Record<string, T>
) => {
  setInterval(() => {
    Object.keys(count).forEach((key) => {
      if (count[key].count - count[key].start < 10) {
        delete count[key]
        delete cache[key]
      } else {
        count[key].start = count[key].count
      }
    })
  }, 60000)
}
