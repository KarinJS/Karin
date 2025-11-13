/**
 * ESM 动态导入错误演示
 * @description 演示各种可能出现的动态导入错误情况
 */

console.log('=== ESM 动态导入错误演示 ===\n')

// 1. 模块不存在的错误
async function moduleNotFoundError () {
  console.log('1. 测试模块不存在的错误:')
  try {
    const module = await import('./non-existent-module.mjs')
    console.log('   ✅ 模块加载成功:', module)
  } catch (error) {
    console.log('   ❌ 模块加载失败:')
    console.log('   错误类型:', error.constructor.name)
    console.log('   错误信息:', error.message)
    console.log('   错误代码:', error.code)
  }
  console.log('')
}

// 2. 语法错误的模块
async function syntaxError () {
  console.log('2. 测试语法错误的模块:')
  try {
    const module = await import('./syntax-error-module.mjs')
    console.log('   ✅ 模块加载成功:', module)
  } catch (error) {
    console.log('   ❌ 模块加载失败:')
    console.log('   错误类型:', error.constructor.name)
    console.log('   错误信息:', error.message)
    if (error.stack) {
      console.log('   错误堆栈:', error.stack.split('\n')[0])
    }
  }
  console.log('')
}

// 3. 缺失依赖的错误
async function missingDependencyError () {
  console.log('3. 测试缺失依赖的错误:')
  try {
    const module = await import('./missing-dependency-module.mjs')
    console.log('   ✅ 模块加载成功:', module)
  } catch (error) {
    console.log('   ❌ 模块加载失败:')
    console.log('   错误类型:', error.constructor.name)
    console.log('   错误信息:', error.message)
    console.log('   错误代码:', error.code)
  }
  console.log('')
}

// 4. 循环依赖错误
async function circularDependencyError () {
  console.log('4. 测试循环依赖的错误:')
  try {
    const module = await import('./circular-a.mjs')
    console.log('   ✅ 模块加载成功:', module)
  } catch (error) {
    console.log('   ❌ 模块加载失败:')
    console.log('   错误类型:', error.constructor.name)
    console.log('   错误信息:', error.message)
  }
  console.log('')
}

// 5. 权限错误
async function permissionError () {
  console.log('5. 测试权限错误:')
  try {
    // 尝试导入系统敏感路径（可能会失败）
    const module = await import('file:///etc/passwd')
    console.log('   ✅ 模块加载成功:', module)
  } catch (error) {
    console.log('   ❌ 模块加载失败:')
    console.log('   错误类型:', error.constructor.name)
    console.log('   错误信息:', error.message)
    console.log('   错误代码:', error.code)
  }
  console.log('')
}

// 6. 网络错误（HTTP 模块）
async function networkError () {
  console.log('6. 测试网络错误:')
  try {
    const module = await import('https://non-existent-domain-12345.invalid/module.mjs')
    console.log('   ✅ 模块加载成功:', module)
  } catch (error) {
    console.log('   ❌ 模块加载失败:')
    console.log('   错误类型:', error.constructor.name)
    console.log('   错误信息:', error.message)
    console.log('   错误代码:', error.code)
  }
  console.log('')
}

// 执行所有测试
async function runAllTests () {
  await moduleNotFoundError()
  await syntaxError()
  await missingDependencyError()
  await circularDependencyError()
  await permissionError()
  await networkError()

  console.log('=== 测试完成 ===')
}

// 启动测试
runAllTests().catch(console.error)
