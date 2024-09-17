export function initAnalyzer () {
  const decoratedMethods = getDecoratedMethods()
  console.log('所有被 AnalyzedFunction 装饰的方法：')
  decoratedMethods.forEach(({ className, methodName }) => {
    console.log(`- ${className}.${methodName}`)
  })
}

const decoratedMethods: { className: string; methodName: string }[] = []

export function AnalyzedFunction () {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const className = target.constructor.name

    // 将被装饰的方法信息添加到数组中
    decoratedMethods.push({ className, methodName: propertyKey })

    descriptor.value = async function (...args: any[]) {
      const className = this.constructor.name
      console.log(`开始分析函数: ${className}.${propertyKey}`)
      // 记录参数
      console.log(`输入参数: ${JSON.stringify(args)}`)

      const start = performance.now()
      let result
      try {
        result = await originalMethod.apply(this, args)
        console.log(`函数 ${propertyKey} 执行成功`)
      } catch (error) {
        console.log(`函数 ${propertyKey} 执行异常: ${error}`)
        throw error
      } finally {
        const end = performance.now()
        const duration = end - start
        console.log(`函数 ${propertyKey} 执行时间: ${duration.toFixed(2)}毫秒`)
      }

      // 返回值分析
      if (result !== undefined) {
        console.log(`函数 ${propertyKey} 返回值类型: ${typeof result}`)
        if (typeof result === 'object' && result !== null) {
          console.log(`返回值结构: ${JSON.stringify(Object.keys(result))}`)
        } else {
          console.log(`返回值: ${result}`)
        }
      } else {
        console.log(`函数 ${propertyKey} 没有返回值`)
      }

      // 记录调用栈
      console.log(`调用栈: ${new Error().stack?.split('\n').slice(2).join('\n')}`)

      console.log(`函数分析完成: ${propertyKey}`)
      return result
    }

    return descriptor
  }
}

export function getDecoratedMethods () {
  return decoratedMethods
}
