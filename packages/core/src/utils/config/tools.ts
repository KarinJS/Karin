const NODE_TYPES = ['number', 'string', 'boolean', 'undefined', 'null']

/**
 * 合并配置
 * @param defData 默认配置
 * @param data 配置
 * @returns 合并后的配置
 */
export const lint = async <T = Record<string, any>> (
  defData: Record<string, any>,
  data: Record<string, any>
): Promise<T> => {
  const list = {} as Record<string, any>
  await Promise.all(Object.keys(defData).map(async (key) => {
    if (Array.isArray(data?.[key])) {
      list[key] = setStr(data?.[key] || defData[key])
      return
    }

    if (NODE_TYPES.includes(typeof data?.[key])) {
      list[key] = data?.[key] ?? defData[key]
      return
    }

    if (typeof data?.[key] === 'object') {
      list[key] = await lint(defData[key], data?.[key])
    }
  }))

  return list as T
}

/**
 * 合并对象 专属privates、groups
 * @param defData 默认配置
 * @param data 配置
 * @returns 合并后的配置
 */
export const mergeData = (defData: Record<string, any>, data: Record<string, any>) => {
  const list = {} as Record<string, any>
  Object.keys(defData).forEach((key) => {
    if (typeof defData[key] === 'number') {
      list[key] = Number(data[key]) ?? defData[key]
      return
    }

    if (Array.isArray(defData[key])) {
      list[key] = Array.isArray(data[key]) ? data[key] : []
      list[key] = list[key].map((val: string) => String(val))
      return
    }

    throw TypeError(`${key} is not a number or array`)
  })
  return list
}

/**
 * 统一转换为字符串数组
 * @param data 数据
 */
export const setStr = (data: any[]) => {
  try {
    return data.map((v: string) => String(v)) || []
  } catch {
    return []
  }
}
